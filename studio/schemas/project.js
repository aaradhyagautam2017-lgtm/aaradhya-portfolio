import {defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Sort order (1–4)',
      validation: (Rule) => Rule.required().integer().min(1).max(4),
    }),
    defineField({name: 'tagline',  title: 'Tagline',  type: 'string'}),
    defineField({name: 'role',     title: 'Role',     type: 'string'}),
    defineField({name: 'industry', title: 'Industry', type: 'string'}),
    defineField({name: 'platform', title: 'Platform', type: 'string'}),
    defineField({name: 'duration', title: 'Duration', type: 'string'}),
    defineField({name: 'year',     title: 'Year',     type: 'string'}),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'text',
    }),
    defineField({
      name: 'behance',
      title: 'Behance URL',
      type: 'url',
    }),
    defineField({
      name: 'nda',
      title: 'NDA',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
  ],
})
