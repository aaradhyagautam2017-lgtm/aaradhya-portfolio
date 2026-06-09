import {defineField, defineType} from 'sanity'

export const chatbotResponse = defineType({
  name: 'chatbotResponse',
  title: 'Chatbot Response',
  type: 'document',
  fields: [
    defineField({
      name: 'keyword',
      title: 'Keyword',
      type: 'string',
      description: 'Word to match in user input',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'response',
      title: 'Response',
      type: 'text',
      description: 'What the chatbot replies',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
