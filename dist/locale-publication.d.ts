import { z } from 'zod';
/** Canonical, absolute ASCII page path. No queries, fragments, escapes or dot segments. */
export declare const publicationPathSchema: z.ZodString;
/** Explicit states: no defaults, no coercion, no publishing through an omitted field. */
export declare const publicationPolicySchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    publication: z.ZodLiteral<"published">;
    search: z.ZodEnum<{
        index: "index";
        noindex: "noindex";
    }>;
}, z.core.$strict>, z.ZodObject<{
    publication: z.ZodLiteral<"draft">;
    search: z.ZodLiteral<"noindex">;
}, z.core.$strict>], "publication">;
export declare const localeRouteSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    path: z.ZodString;
    publication: z.ZodLiteral<"published">;
    search: z.ZodEnum<{
        index: "index";
        noindex: "noindex";
    }>;
}, z.core.$strict>, z.ZodObject<{
    path: z.ZodString;
    publication: z.ZodLiteral<"draft">;
    search: z.ZodLiteral<"noindex">;
}, z.core.$strict>], "publication">;
/**
 * Resource IDs and allowed locales belong to the caller, never this package.
 * Each resource maps only its declared locales to explicit page policies.
 * partialRecord is intentional: an absent locale stays absent (not published).
 */
export declare function createLocalePublicationSchema<const L extends readonly [string, ...string[]]>(allowedLocales: L): z.ZodPipe<z.ZodUnknown, z.ZodObject<{
    resources: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodEnum<{ [k_1 in L[number]]: k_1; } extends infer T ? { [k in keyof T]: T[k]; } : never> & z.core.$partial, z.ZodDiscriminatedUnion<[z.ZodObject<{
        path: z.ZodString;
        publication: z.ZodLiteral<"published">;
        search: z.ZodEnum<{
            index: "index";
            noindex: "noindex";
        }>;
    }, z.core.$strict>, z.ZodObject<{
        path: z.ZodString;
        publication: z.ZodLiteral<"draft">;
        search: z.ZodLiteral<"noindex">;
    }, z.core.$strict>], "publication">>>;
}, z.core.$strict>>;
export type PublicationPolicy = z.infer<typeof publicationPolicySchema>;
export type LocaleRoute = z.infer<typeof localeRouteSchema>;
export type LocalePublication = z.infer<ReturnType<typeof createLocalePublicationSchema>>;
