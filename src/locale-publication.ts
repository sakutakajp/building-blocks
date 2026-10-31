import { z } from 'zod';

/** Canonical, absolute ASCII page path. No queries, fragments, escapes or dot segments. */
export const publicationPathSchema = z.string().regex(
  /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/,
  'Expected a canonical lower-case page path with leading and trailing slash',
);

/** Explicit states: no defaults, no coercion, no publishing through an omitted field. */
export const publicationPolicySchema = z.discriminatedUnion('publication', [
  z.strictObject({ publication: z.literal('published'), search: z.enum(['index', 'noindex']) }),
  z.strictObject({ publication: z.literal('draft'), search: z.literal('noindex') }),
]);

export const localeRouteSchema = z.discriminatedUnion('publication', [
  z.strictObject({ path: publicationPathSchema, publication: z.literal('published'), search: z.enum(['index', 'noindex']) }),
  z.strictObject({ path: publicationPathSchema, publication: z.literal('draft'), search: z.literal('noindex') }),
]);

const identifierSchema = z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
const localeNameSchema = z.string().regex(/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/);

/**
 * Resource IDs and allowed locales belong to the caller, never this package.
 * Each resource maps only its declared locales to explicit page policies.
 * partialRecord is intentional: an absent locale stays absent (not published).
 */
export function createLocalePublicationSchema<const L extends readonly [string, ...string[]]>(allowedLocales: L) {
  z.array(localeNameSchema).min(1).refine(values => new Set(values).size === values.length, {
    message: 'Allowed locales must be unique',
  }).parse(allowedLocales);
  // Inspect dynamic keys before Zod can discard the special own key __proto__.
  const rawKeys = z.unknown().superRefine((input, ctx) => {
    if (!input || typeof input !== 'object' || !('resources' in input)) return;
    const resources = input.resources;
    if (!resources || typeof resources !== 'object') return;
    for (const resource of Object.keys(resources)) {
      if (!identifierSchema.safeParse(resource).success) ctx.addIssue({
        code: 'custom', path: ['resources', resource], message: 'Invalid resource identifier',
      });
      const locales: unknown = Reflect.get(resources, resource);
      if (!locales || typeof locales !== 'object') continue;
      for (const locale of Object.keys(locales)) {
        if (!allowedLocales.includes(locale)) ctx.addIssue({
          code: 'custom', path: ['resources', resource, locale], message: 'Unknown locale',
        });
      }
    }
  });
  return rawKeys.pipe(z.strictObject({
    resources: z.record(identifierSchema, z.partialRecord(z.enum(allowedLocales), localeRouteSchema)),
  })).superRefine((ledger, ctx) => {
    const paths = new Map<string, string>();
    for (const [resource, locales] of Object.entries(ledger.resources)) {
      for (const [locale, value] of Object.entries(locales)) {
        if (value === undefined) continue;
        // Object.entries loses the generic partialRecord value type. Keep narrowing checked.
        const result = localeRouteSchema.safeParse(value);
        if (!result.success) continue; // Outer parsing already records invalid routes.
        const route = result.data;
        const previous = paths.get(route.path);
        if (previous) ctx.addIssue({
          code: 'custom', path: ['resources', resource, locale, 'path'],
          message: `Route collides with ${previous}: ${route.path}`,
        });
        paths.set(route.path, `${resource}/${locale}`);
      }
    }
  });
}

export type PublicationPolicy = z.infer<typeof publicationPolicySchema>;
export type LocaleRoute = z.infer<typeof localeRouteSchema>;
export type LocalePublication = z.infer<ReturnType<typeof createLocalePublicationSchema>>;
