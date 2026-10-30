import { z } from 'zod';
/** A real Gregorian calendar date, preserved as YYYY/MM/DD (years 0001–9999). */
export declare const calendarDateSchema: z.ZodString;
/** Validate without trimming, coercing, or otherwise rewriting authored text. */
export declare const nonEmptyTextSchema: z.ZodString;
/** Draft authoring contract; not a schema for framework-generated document objects. */
export declare const blogSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    slug: z.ZodString;
    category: z.ZodString;
    createDate: z.ZodString;
    cover: z.ZodString;
    updated: z.ZodOptional<z.ZodString>;
    alt: z.ZodOptional<z.ZodString>;
    tag: z.ZodOptional<z.ZodArray<z.ZodString>>;
    recommend: z.ZodOptional<z.ZodBoolean>;
    homepage: z.ZodOptional<z.ZodBoolean>;
    showCover: z.ZodOptional<z.ZodBoolean>;
    noindex: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const toolSchema: z.ZodObject<{
    slug: z.ZodString;
    category: z.ZodString;
    createDate: z.ZodString;
    rules: z.ZodOptional<z.ZodArray<z.ZodString>>;
    title: z.ZodString;
    description: z.ZodString;
    cover: z.ZodString;
    alt: z.ZodString;
    updated: z.ZodOptional<z.ZodString>;
    recommend: z.ZodOptional<z.ZodBoolean>;
    homepage: z.ZodOptional<z.ZodBoolean>;
    showCover: z.ZodOptional<z.ZodBoolean>;
    noindex: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const indexSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    cover: z.ZodString;
    alt: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    createDate: z.ZodOptional<z.ZodString>;
    updated: z.ZodOptional<z.ZodString>;
    recommend: z.ZodOptional<z.ZodBoolean>;
    homepage: z.ZodOptional<z.ZodBoolean>;
    showCover: z.ZodOptional<z.ZodBoolean>;
    noindex: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
/** Body-only partials are represented by {}; metadata fields remain optional. */
export declare const partialSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    cover: z.ZodOptional<z.ZodString>;
    updated: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
/** Callers select the kind explicitly; no filename heuristics or permissive union. */
export declare const contentSchemas: {
    readonly blog: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        slug: z.ZodString;
        category: z.ZodString;
        createDate: z.ZodString;
        cover: z.ZodString;
        updated: z.ZodOptional<z.ZodString>;
        alt: z.ZodOptional<z.ZodString>;
        tag: z.ZodOptional<z.ZodArray<z.ZodString>>;
        recommend: z.ZodOptional<z.ZodBoolean>;
        homepage: z.ZodOptional<z.ZodBoolean>;
        showCover: z.ZodOptional<z.ZodBoolean>;
        noindex: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>;
    readonly tool: z.ZodObject<{
        slug: z.ZodString;
        category: z.ZodString;
        createDate: z.ZodString;
        rules: z.ZodOptional<z.ZodArray<z.ZodString>>;
        title: z.ZodString;
        description: z.ZodString;
        cover: z.ZodString;
        alt: z.ZodString;
        updated: z.ZodOptional<z.ZodString>;
        recommend: z.ZodOptional<z.ZodBoolean>;
        homepage: z.ZodOptional<z.ZodBoolean>;
        showCover: z.ZodOptional<z.ZodBoolean>;
        noindex: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>;
    readonly index: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        cover: z.ZodString;
        alt: z.ZodString;
        slug: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        createDate: z.ZodOptional<z.ZodString>;
        updated: z.ZodOptional<z.ZodString>;
        recommend: z.ZodOptional<z.ZodBoolean>;
        homepage: z.ZodOptional<z.ZodBoolean>;
        showCover: z.ZodOptional<z.ZodBoolean>;
        noindex: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>;
    readonly partial: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        cover: z.ZodOptional<z.ZodString>;
        updated: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
};
export type ContentKind = keyof typeof contentSchemas;
export type Blog = z.infer<typeof blogSchema>;
export type Tool = z.infer<typeof toolSchema>;
export type Index = z.infer<typeof indexSchema>;
export type Partial = z.infer<typeof partialSchema>;
