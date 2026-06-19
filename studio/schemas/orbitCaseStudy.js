import {defineField, defineType} from 'sanity'

export const orbitCaseStudy = defineType({
  name: 'orbitCaseStudy',
  title: 'Project Orbit — Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'figures',
      title: 'Documentation Figures',
      description: 'Each item ties one image to a specific figure slot in the case study.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'figure',
          fields: [
            defineField({
              name: 'figureId',
              title: 'Figure Slot',
              type: 'string',
              description: 'Which slot this image belongs to.',
              options: {
                list: [
                  {title: 'Figure 00 — Hero Visual',                  value: '00'},
                  {title: 'Figure 01 — Context & Experiment Scope',   value: '01'},
                  {title: 'Figure 02 — Neubrutalist Layout Trials',   value: '02'},
                  {title: 'Figure 03 — Multi-Agent Stack Allocation', value: '03'},
                  {title: 'Figure 04 — Wormhole Context Maps',        value: '04'},
                  {title: 'Figure 05 — Portfolio Assembly Drafts',    value: '05'},
                  {title: 'Figure 06 — Antigravity Session Logs',     value: '06'},
                  {title: 'Figure 07 — CMS Schema Declarations',      value: '07'},
                  {title: 'Figure 08 — Context Scaling Logs',         value: '08'},
                  {title: 'Figure 09a — Orbit Framework Mappings',    value: '09a'},
                  {title: 'Figure 09b — AI Node Responsibility Matrix', value: '09b'},
                  {title: 'Figure 09c — Project Context Logs',        value: '09c'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption Override',
              type: 'string',
              description: 'Optional — leave blank to keep the default caption from the page.',
            }),
          ],
          preview: {
            select: {figureId: 'figureId', media: 'image'},
            prepare({figureId, media}) {
              return {title: figureId ? `Figure ${figureId}` : 'No slot selected', media}
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Project Orbit — Case Study'}
    },
  },
})
