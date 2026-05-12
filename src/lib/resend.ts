import { Resend } from 'resend'
import { marked } from 'marked'

let client: Resend | null = null

const getClient = () => {
  if (client) return client
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  client = new Resend(key)
  return client
}

type EmailTemplateShape = {
  subject: string
  preheader: string
  bodyMarkdown: string
  fromName: string
  fromEmail: string
}

const renderHtml = (markdown: string, preheader: string) => {
  const body = marked.parse(markdown, { async: false }) as string
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Upper Eastside Hangout</title>
  </head>
  <body style="margin:0;padding:0;background:#F5EBD8;font-family:Georgia,serif;color:#2D3F2C;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${preheader}</span>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F5EBD8;">
      <tr><td align="center" style="padding:48px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;width:100%;background:#FBF6EA;border-radius:8px;padding:32px;">
          <tr><td style="font-size:16px;line-height:1.7;color:#2D3F2C;">
            ${body}
          </td></tr>
          <tr><td style="padding-top:24px;border-top:1px solid #EADFC6;font-size:12px;color:#6b6655;text-align:center;">
            Upper Eastside Hangout · 701 NE 79th St, Miami, FL 33138
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

/**
 * Send the confirmation email. Returns true on success, false on any failure.
 * Caller treats failure as non-fatal — we never block the signup UX on email.
 */
export const sendConfirmationEmail = async (
  to: string,
  template: EmailTemplateShape,
): Promise<boolean> => {
  const c = getClient()
  if (!c) {
    console.warn('[resend] RESEND_API_KEY not set; skipping confirmation email.')
    return false
  }

  try {
    const html = renderHtml(template.bodyMarkdown, template.preheader)
    const result = await c.emails.send({
      from: `${template.fromName} <${template.fromEmail}>`,
      to: [to],
      subject: template.subject,
      html,
      text: template.bodyMarkdown,
    })
    if (result.error) {
      console.error('[resend] send failed:', result.error)
      return false
    }
    return true
  } catch (err) {
    console.error('[resend] send threw:', err)
    return false
  }
}
