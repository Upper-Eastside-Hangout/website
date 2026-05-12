import type { GlobalConfig } from 'payload'

export const SignupSection: GlobalConfig = {
  slug: 'signupSection',
  label: 'Signup Section',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Be first through the gate.',
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      defaultValue: 'SIGN ME UP',
    },
    {
      name: 'successMessage',
      type: 'text',
      required: true,
      defaultValue: "You're on the list. Check your inbox.",
    },
    {
      name: 'segmentLabel1',
      type: 'text',
      required: true,
      defaultValue: 'I live in the neighborhood',
      admin: { description: 'Maps to segment value: neighborhood' },
    },
    {
      name: 'segmentLabel2',
      type: 'text',
      required: true,
      defaultValue: "I'm in the industry",
      admin: { description: 'Maps to segment value: industry' },
    },
    {
      name: 'segmentLabel3',
      type: 'text',
      required: true,
      defaultValue: 'Just curious',
      admin: { description: 'Maps to segment value: curious' },
    },
  ],
}
