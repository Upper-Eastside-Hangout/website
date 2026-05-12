import type { GlobalConfig } from 'payload'

const defaultBody = `Hey,

You're on the list for Upper Eastside Hangout.

We're building something in Miami's Upper Eastside — open-air, dog-friendly, food and drinks from people we love. We'll send a note before we open the gate.

Until then,
Upper Eastside Hangout
701 NE 79th St, Miami, FL 33138
`

export const EmailTemplate: GlobalConfig = {
  slug: 'emailTemplate',
  label: 'Confirmation Email',
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
      defaultValue: 'Welcome to Upper Eastside Hangout',
    },
    {
      name: 'preheader',
      type: 'text',
      required: true,
      defaultValue: "You're on the list.",
    },
    {
      name: 'bodyMarkdown',
      type: 'textarea',
      required: true,
      defaultValue: defaultBody,
      admin: { description: 'Markdown. Rendered to HTML at send time.' },
    },
    {
      name: 'fromName',
      type: 'text',
      required: true,
      defaultValue: 'Upper Eastside Hangout',
    },
    {
      name: 'fromEmail',
      type: 'text',
      required: true,
      defaultValue: 'hello@uppereastsidehangout.com',
      admin: {
        description:
          'The sending domain must be verified in Resend (DKIM/SPF). Change here is cosmetic until DNS is verified.',
        readOnly: false,
      },
    },
  ],
}
