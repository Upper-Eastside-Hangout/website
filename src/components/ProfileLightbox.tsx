'use client'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type SignupGlobals = {
  segmentLabel1: string
  segmentLabel2: string
  segmentLabel3: string
}

type Props = {
  open: boolean
  subscriberId: string | number | null
  onDone: () => void
  globals: SignupGlobals
}

const ProfileSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  birthdate: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^\d{2}\/\d{2}$/.test(v),
      'Use MM/DD format.',
    )
    .refine(
      (v) => {
        if (!v) return true
        const [mm, dd] = v.split('/').map((s) => parseInt(s, 10))
        return mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31
      },
      'Month must be 01-12 and day must be 01-31.',
    ),
  phone: z.string().max(40).optional(),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say']).optional(),
  segment: z.enum(['neighborhood', 'industry', 'curious']).optional(),
})

type ProfileFormData = z.infer<typeof ProfileSchema>

export default function ProfileLightbox({
  open,
  subscriberId,
  onDone,
  globals,
}: Props) {
  const [submitting, setSubmitting] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
  })

  const birthdate = watch('birthdate') || ''

  // Auto-format MM/DD: insert "/" after two digits.
  const onBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    const formatted =
      raw.length <= 2 ? raw : `${raw.slice(0, 2)}/${raw.slice(2)}`
    setValue('birthdate', formatted, { shouldValidate: false })
  }

  // Body scroll lock + escape-to-close.
  useEffect(() => {
    if (!open) return
    document.body.classList.add('no-scroll')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone()
    }
    document.addEventListener('keydown', onKey)
    // Focus the first input for accessibility.
    setTimeout(() => {
      dialogRef.current?.querySelector<HTMLInputElement>('input')?.focus()
    }, 50)
    return () => {
      document.body.classList.remove('no-scroll')
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onDone])

  if (!open) return null

  const onSubmit = async (data: ProfileFormData) => {
    if (!subscriberId) {
      onDone()
      return
    }
    setSubmitting(true)
    const payload: Record<string, unknown> = { subscriberId }
    if (data.firstName) payload.firstName = data.firstName
    if (data.lastName) payload.lastName = data.lastName
    if (data.birthdate) {
      const [mm, dd] = data.birthdate.split('/')
      payload.birthMonth = mm
      payload.birthDay = dd
    }
    if (data.phone) payload.phone = data.phone
    if (data.gender) payload.gender = data.gender
    if (data.segment) payload.segment = data.segment

    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      console.error('[profile] submit failed:', err)
    } finally {
      setSubmitting(false)
      reset()
      onDone()
    }
  }

  const skip = () => {
    reset()
    onDone()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tell us a bit more"
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest/70 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) skip()
      }}
    >
      <div
        ref={dialogRef}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-md bg-cream-50 p-6 shadow-xl md:p-8"
      >
        <button
          type="button"
          onClick={skip}
          aria-label="Close"
          className="absolute right-3 top-3 text-forest/60 transition hover:text-forest"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h3 className="font-heading text-2xl font-bold tracking-[-0.01em] text-forest">
          Tell us a bit more
        </h3>
        <p className="mt-2 font-body text-sm italic text-forest/70">
          All optional. Helps us send you the right kind of note.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-label text-xs tracking-[0.18em] text-forest/70">
                First name
              </span>
              <input
                type="text"
                {...register('firstName')}
                className="mt-1 w-full rounded-sm border border-forest/20 bg-white px-3 py-2 text-sm text-forest focus:border-forest focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-label text-xs tracking-[0.18em] text-forest/70">
                Last name
              </span>
              <input
                type="text"
                {...register('lastName')}
                className="mt-1 w-full rounded-sm border border-forest/20 bg-white px-3 py-2 text-sm text-forest focus:border-forest focus:outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="font-label text-xs tracking-[0.18em] text-forest/70">
              Birthdate (MM/DD)
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={birthdate}
              onChange={onBirthdateChange}
              placeholder="MM/DD"
              maxLength={5}
              className="mt-1 w-32 rounded-sm border border-forest/20 bg-white px-3 py-2 text-sm text-forest focus:border-forest focus:outline-none"
            />
            {errors.birthdate && (
              <span className="mt-1 block text-xs text-terracotta">
                {errors.birthdate.message}
              </span>
            )}
          </label>

          <label className="block">
            <span className="font-label text-xs tracking-[0.18em] text-forest/70">
              Phone <span className="font-normal normal-case text-forest/50">(optional)</span>
            </span>
            <input
              type="tel"
              {...register('phone')}
              className="mt-1 w-full rounded-sm border border-forest/20 bg-white px-3 py-2 text-sm text-forest focus:border-forest focus:outline-none"
            />
          </label>

          <fieldset>
            <legend className="font-label text-xs tracking-[0.18em] text-forest/70">
              Gender
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-forest sm:grid-cols-4">
              {[
                ['male', 'Male'],
                ['female', 'Female'],
                ['non-binary', 'Non-binary'],
                ['prefer-not-to-say', 'Prefer not to say'],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={value}
                    {...register('gender')}
                    className="accent-forest"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-label text-xs tracking-[0.18em] text-forest/70">
              Which one are you?
            </legend>
            <div className="mt-2 space-y-2 text-sm text-forest">
              <label className="flex items-center gap-2">
                <input type="radio" value="neighborhood" {...register('segment')} className="accent-forest" />
                <span>{globals.segmentLabel1}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="industry" {...register('segment')} className="accent-forest" />
                <span>{globals.segmentLabel2}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="curious" {...register('segment')} className="accent-forest" />
                <span>{globals.segmentLabel3}</span>
              </label>
            </div>
          </fieldset>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={skip}
              className="rounded-sm px-4 py-2 font-label text-xs tracking-[0.18em] text-forest/70 transition hover:text-forest"
              disabled={submitting}
            >
              SKIP FOR NOW
            </button>
            <button
              type="submit"
              className="rounded-sm bg-forest px-6 py-2 font-label text-sm tracking-[0.2em] text-cream transition hover:bg-forest-dark disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'SAVING…' : 'SAVE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
