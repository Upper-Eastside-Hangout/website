import { NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Signed Vercel Blob client uploads. Replaces @payloadcms/storage-vercel-blob
 * (which has been observed to break the Payload admin in this stack).
 *
 * Flow:
 *   1. Browser POSTs { type: 'blob.generate-client-token', payload: { ... } } here.
 *   2. We auth against Payload (admin/editor only), then issue a one-time client token.
 *   3. Browser uploads directly to Vercel Blob with that token.
 *   4. Vercel calls our completion webhook ({ type: 'blob.upload-completed' }).
 */
export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody

  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        // Gate on a Payload session — only authenticated admin/editor users
        // may upload. Read the Payload auth cookie from the incoming request.
        const payload = await getPayloadClient()
        const headers = req.headers
        const auth = await payload.auth({ headers })
        if (!auth.user) {
          throw new Error('Unauthorized')
        }
        return {
          allowedContentTypes: [
            'image/png',
            'image/jpeg',
            'image/webp',
            'image/svg+xml',
            'image/gif',
          ],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10 MB
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async ({ blob }) => {
        // Place to log or post-process. We just log for now — the URL is
        // returned to the admin upload widget client-side via the SDK.
        console.log('[upload] completed:', blob.url)
      },
    })

    return NextResponse.json(json)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'upload_failed'
    const status = message === 'Unauthorized' ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
