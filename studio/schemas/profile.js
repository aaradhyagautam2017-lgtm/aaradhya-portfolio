export default {
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    {
      name: 'statusText',
      title: 'Status Text',
      type: 'string',
      description: 'Shown under STATUS on the home screen',
    },
    {
      name: 'progressValue',
      title: 'Progress Value',
      type: 'number',
      description: 'Integer 0–100. Controls the progress bar width and percentage label.',
      validation: Rule => Rule.min(0).max(100).integer(),
    },
  ],
};
