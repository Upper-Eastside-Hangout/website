import type { GlobalConfig } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  LinkFeature,
  ParagraphFeature,
  HeadingFeature,
  UnorderedListFeature,
  OrderedListFeature,
} from '@payloadcms/richtext-lexical'

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
      name: 'body',
      type: 'richText',
      admin: {
        description:
          'Rich-text email body. Use the toolbar to bold, italicize, add links, and create lists. Takes priority over the legacy Markdown field below.',
      },
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'bodyMarkdown',
      type: 'textarea',
      defaultValue: defaultBody,
      admin: {
        description:
          'Legacy plain-text/markdown body. Used as a fallback when the rich-text Body above is empty. Once you migrate, you can clear this field.',
      },
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
