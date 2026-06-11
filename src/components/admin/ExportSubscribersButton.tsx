/**
 * Download-CSV button shown above the Subscribers list in the Payload admin.
 * The /api/export-subscribers endpoint is admin-gated and streams a CSV with
 * one row per subscriber. The browser handles the download via the link's
 * `download` attribute and the endpoint's Content-Disposition header.
 */
export default function ExportSubscribersButton() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '1rem',
      }}
    >
      <a
        href="/api/export-subscribers"
        download
        className="btn btn--style-primary btn--size-small"
        style={{
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download CSV
      </a>
    </div>
  )
}
