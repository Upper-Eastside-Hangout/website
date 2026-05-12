/* Admin layout — wraps Payload's RootLayout so the admin UI gets its own
 * font/style scope separate from the marketing site.
 */
import type { Metadata } from 'next'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'

import '@payloadcms/next/css'

export const metadata: Metadata = {
  title: 'Upper Eastside Hangout — Admin',
  description: 'Payload admin for Upper Eastside Hangout.',
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: { children: React.ReactNode }) =>
  RootLayout({ config, importMap, children, serverFunction })

export default Layout
