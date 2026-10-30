import { blogSchema, toolSchema, indexSchema, partialSchema, type Blog, type Tool, type Index, type Partial, type ContentKind } from 'building-blocks/content-schema';
import type { z } from 'zod';
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
type BlogMatches = Assert<Equal<Blog, z.infer<typeof blogSchema>>>;
type ToolMatches = Assert<Equal<Tool, z.infer<typeof toolSchema>>>;
type IndexMatches = Assert<Equal<Index, z.infer<typeof indexSchema>>>;
type PartialMatches = Assert<Equal<Partial, z.infer<typeof partialSchema>>>;
const blog: Blog = { title: 'Example', description: 'Example', slug: 'example', category: 'notes', createDate: '2026/01/01', cover: '/example.png' };
const partial: Partial = {};
const kind: ContentKind = 'blog';
// @ts-expect-error Slugs are authored strings, not coerced numbers.
const invalidSlug: Blog = { ...blog, slug: 123 };
// @ts-expect-error Required blog metadata cannot be omitted.
const missing: Blog = {};
// @ts-expect-error Booleans cannot be strings.
const invalidFlag: Blog = { ...blog, noindex: 'false' };
// @ts-expect-error Generated framework keys are not raw metadata.
const generated: Partial = { _path: '/example' };
// @ts-expect-error Unknown content kind.
const invalidKind: ContentKind = 'page';
void [partial, kind, invalidSlug, missing, invalidFlag, generated, invalidKind];
