import { z } from 'zod';

/** A real Gregorian calendar date, preserved as YYYY/MM/DD (years 0001–9999). */
export const calendarDateSchema = z.string().refine((value) => {
  if (!/^\d{4}\/\d{2}\/\d{2}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1]!;
}, { message: 'Expected a real calendar date in YYYY/MM/DD format' });

/** Validate without trimming, coercing, or otherwise rewriting authored text. */
export const nonEmptyTextSchema = z.string().refine((value) => value.trim().length > 0, {
  message: 'Expected non-empty text',
});

const fields = {
  title: nonEmptyTextSchema,
  description: nonEmptyTextSchema,
  slug: nonEmptyTextSchema,
  category: nonEmptyTextSchema,
  createDate: calendarDateSchema,
  updated: calendarDateSchema,
  cover: nonEmptyTextSchema,
  alt: z.string(),
  tag: z.array(nonEmptyTextSchema),
  recommend: z.boolean(),
  homepage: z.boolean(),
  showCover: z.boolean(),
  noindex: z.boolean(),
};

const optionalFields = z.strictObject(fields).partial().shape;

/** Draft authoring contract; not a schema for framework-generated document objects. */
export const blogSchema = z.strictObject({
  ...optionalFields,
  title: fields.title,
  description: fields.description,
  slug: fields.slug,
  category: fields.category,
  createDate: fields.createDate,
  cover: fields.cover,
});

const { tag: _tag, ...pageOptionalFields } = optionalFields;

export const toolSchema = z.strictObject({
  ...pageOptionalFields,
  slug: fields.slug,
  category: fields.category,
  createDate: fields.createDate,
  rules: z.array(nonEmptyTextSchema).optional(),
  title: fields.title,
  description: fields.description,
  cover: fields.cover,
  alt: fields.alt,
});

export const indexSchema = z.strictObject({
  ...pageOptionalFields,
  title: fields.title,
  description: fields.description,
  cover: fields.cover,
  alt: fields.alt,
});

/** Body-only partials are represented by {}; metadata fields remain optional. */
export const partialSchema = z.strictObject({
  title: fields.title.optional(),
  description: fields.description.optional(),
  cover: fields.cover.optional(),
  updated: fields.updated.optional(),
});

/** Callers select the kind explicitly; no filename heuristics or permissive union. */
export const contentSchemas = {
  blog: blogSchema,
  tool: toolSchema,
  index: indexSchema,
  partial: partialSchema,
} as const;

export type ContentKind = keyof typeof contentSchemas;
export type Blog = z.infer<typeof blogSchema>;
export type Tool = z.infer<typeof toolSchema>;
export type Index = z.infer<typeof indexSchema>;
export type Partial = z.infer<typeof partialSchema>;
