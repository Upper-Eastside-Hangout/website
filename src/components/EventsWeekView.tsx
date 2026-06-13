import EventCard from './EventCard'
import { type EventInstance, formatEventDate, TZ } from '@/lib/events'

type Props = {
  instances: EventInstance[]
}

const dayKey = (d: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)

/**
 * Groups instances by day (in venue timezone) and renders them as a list
 * with a date heading per day.
 */
export default function EventsWeekView({ instances }: Props) {
  if (instances.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <p className="font-body text-base italic text-forest/70 md:text-lg">
          Nothing on the books in the next 7 days — check back soon, or follow
          along on social for late additions.
        </p>
      </div>
    )
  }

  // Group by day
  const groups = new Map<string, EventInstance[]>()
  for (const inst of instances) {
    const key = dayKey(inst.startsAt)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(inst)
  }

  const dayKeys = Array.from(groups.keys()).sort()

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      {dayKeys.map((key) => {
        const group = groups.get(key)!
        const dateLabel = formatEventDate(group[0].startsAt)
        return (
          <section key={key}>
            <h2 className="mb-4 font-label text-sm tracking-[0.2em] text-forest md:text-base">
              {dateLabel}
            </h2>
            <div className="space-y-3">
              {group.map((inst, i) => (
                <EventCard key={`${inst.event.id}-${i}`} instance={inst} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
