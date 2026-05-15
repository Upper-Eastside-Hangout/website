'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import ProfileLightbox from './ProfileLightbox'
import { trackPixel } from '@/lib/pixel'

type SignupGlobals = {
  heading: string
  buttonText: string
  successMessage: string
  segmentLabel1: string
  segmentLabel2: string
  segmentLabel3: string
}

type Props = { globals: SignupGlobals }

const Schema = z.object({
  email: z.string().email('Please enter a valid email.').max(254),
})
type FormData = z.infer<typeof Schema>

export default function SignupForm({ globals }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [subscriberId, setSubscriberId] = useState<string | number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(Schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })
      if (!res.ok) {
        console.error('[signup] non-OK response:', res.status)
        return
      }
      const json = (await res.json()) as {
        subscriberId: string | number
        alreadyExisted?: boolean
      }
      setSubscriberId(json.subscriberId)
      setLightboxOpen(true)
      reset()
      // Meta Pixel: fire Lead on a NEW email signup. Duplicates re-opening the
      // lightbox don't count as fresh leads.
      if (!json.alreadyExisted) {
        trackPixel('Lead', { content_name: 'email_signup' })
      }
    } catch (err) {
      console.error('[signup] submit threw:', err)
    }
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setSubmitted(true)
  }

  return (
    <section id="signup" className="relative overflow-hidden text-cream">
      <Image
        src="/backgrounds/signup.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
        <h2 className="font-invitation text-4xl leading-[1.05] md:text-6xl">
          {globals.heading}
        </h2>

        {submitted ? (
          <p className="mx-auto mt-8 max-w-md font-body text-base italic text-cream/90 md:text-lg">
            {globals.successMessage}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:gap-0 sm:overflow-hidden sm:rounded-sm sm:bg-cream-50 sm:shadow-sm"
            noValidate
          >
            <label className="sr-only" htmlFor="signup-email">
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="Your email address"
              autoComplete="email"
              {...register('email')}
              className="w-full rounded-sm bg-cream-50 px-5 py-4 font-body text-base text-forest placeholder:text-forest/40 shadow-sm focus:outline-none sm:flex-1 sm:w-auto sm:rounded-none sm:bg-transparent sm:shadow-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-sm bg-forest px-7 py-4 font-label text-sm tracking-[0.16em] text-cream shadow-sm transition hover:bg-forest-dark disabled:opacity-60 sm:w-auto sm:shrink-0 sm:rounded-none sm:shadow-none"
            >
              {isSubmitting ? '…' : globals.buttonText}
            </button>
          </form>
        )}

        {errors.email && (
          <p className="mt-3 font-body text-sm text-cream/90" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <ProfileLightbox
        open={lightboxOpen}
        subscriberId={subscriberId}
        onDone={closeLightbox}
        globals={{
          segmentLabel1: globals.segmentLabel1,
          segmentLabel2: globals.segmentLabel2,
          segmentLabel3: globals.segmentLabel3,
        }}
      />
    </section>
  )
}
