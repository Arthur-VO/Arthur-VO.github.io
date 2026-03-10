// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    draft: z.boolean().default(false),
    title: z.string(),
    status: z.enum(['active', 'completed', 'archived']),
    topic: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    tagline_human: z.string(),
    tagline_tech: z.string(),
    url: z.string().url()
  })
});

const blog = defineCollection({
  schema: z.object({
    draft: z.boolean().default(false),
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.string(),
    description_human: z.string(),
    description_tech: z.string(),
    tags: z.array(z.string()).default([])
  })
});

const signal = defineCollection({
  schema: z.object({
    issue_number: z.number().int().positive(),
    title: z.string(),
    link: z.string().url()
  })
});

export const collections = {
  projects,
  blog,
  signal
};