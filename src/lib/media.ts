/**
 * Shared types + helpers for Payload upload relations that reference the
 * Media collection. Used by both Events (flyer) and Vendors (logo, illustration).
 *
 * When a Payload query runs at depth >= 1 (the default), upload relations
 * resolve to the full Media doc — including its `sizes` map of auto-generated
 * crops. At depth 0 the field is just the numeric id. These helpers normalize
 * both shapes into a plain URL string (or null).
 */

export type MediaSize = {
  url?: string | null
  filename?: string | null
  width?: number | null
  height?: number | null
}

export type MediaDoc = {
  id: number | string
  url?: string | null
  alt?: string | null
  filename?: string | null
  /** Sharp-generated crops. `og` is 1200×628 for social cards. */
  sizes?: {
    og?: MediaSize | null
    thumb?: MediaSize | null
  } | null
}

export type MediaRelation = MediaDoc | number | string | null | undefined

/**
 * Resolve a URL from an upload relation. Prefers the "og" sized crop when
 * present (1200×628) so social cards and shared displays land on a
 * consistent aspect. Falls back to the original file URL if no sized version
 * exists (e.g. for vendor logos where we upload square PNGs at native size).
 */
export const mediaUrl = (relation: MediaRelation): string | null => {
  if (!relation) return null
  if (typeof relation === 'number' || typeof relation === 'string') return null
  return relation.sizes?.og?.url || relation.url || null
}

/** Resolve alt text from a populated Media doc; returns fallback if missing. */
export const mediaAlt = (relation: MediaRelation, fallback: string): string => {
  if (!relation || typeof relation === 'number' || typeof relation === 'string') return fallback
  return relation.alt || fallback
}
