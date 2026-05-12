import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Returns a singleton Payload instance for use in server components and API routes.
 * The first call boots Payload; subsequent calls reuse the same instance.
 */
export const getPayloadClient = async () => {
  return getPayload({ config })
}
