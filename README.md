# building-blocks

Small, framework-independent building blocks in one root package. The first module
is `building-blocks/content-schema`: strict runtime validation and inferred
TypeScript types for **raw, already-parsed frontmatter**.

## Install from Git

Use a reviewed full commit SHA, not a moving branch:

```sh
npm install 'git+https://github.com/sakutakajp/building-blocks.git#<FULL_COMMIT_SHA>'
```

This is not an npm-registry release. `private: true` prevents accidental registry
publication. Compiled ESM JavaScript and declarations are committed in `dist/`;
there are no install/prepare lifecycle scripts and consumers do not need a compiler.
Node.js 22+ is supported. Pin your application's lockfile as well.

```ts
import { blogSchema, type Blog } from 'building-blocks/content-schema';

const result = blogSchema.safeParse(rawMetadata);
if (!result.success) {
  console.error(result.error.issues);
} else {
  const metadata: Blog = result.data;
}
```

`rawMetadata` is supplied by your YAML/frontmatter parser. This package does not
parse Markdown, infer kinds from paths, select published files, or implement a CLI.
Select `blogSchema`, `toolSchema`, `indexSchema`, or `partialSchema` explicitly.
`contentSchemas` also exposes these under `blog`, `tool`, `index`, and `partial`.
Types `Blog`, `Tool`, `Index`, `Partial`, and `ContentKind` come from the schemas.

## Draft authoring policy

These are proposed authoring contracts, **not a claim that legacy content already
passes**. No existing consumer is wired to them by this package.

| Kind | Required fields | Optional fields |
| --- | --- | --- |
| Blog | title, description, slug, category, createDate, cover | updated, alt, tag, recommend, homepage, showCover, noindex |
| Tool | title, description, slug, category, createDate, cover, alt | updated, recommend, homepage, showCover, noindex, rules |
| Index | title, description, cover, alt | slug, category, createDate, updated, recommend, homepage, showCover, noindex |
| Partial | none | title, description, cover, updated |

- Dates stay strings in `YYYY/MM/DD`, with actual Gregorian-calendar validation
  (years 0001–9999). No timezone conversion or date-order policy is applied.
- Text is non-blank, except `alt`, where an empty string remains valid. Cover is
  text, not restricted to absolute URLs; local paths and template values work.
- `tag` and `rules` are arrays of non-blank strings. Empty arrays are allowed.
- Flags are actual booleans, never string/number coercions. No defaults are added;
  in particular, omitted `noindex` stays omitted. This is not publication or access control.
- Optional means omitted/undefined, not `null`. Numeric slugs, null descriptions,
  null dates, and blank descriptions must be reviewed before integration, not
  silently normalized. Generic informational pages may need a separate profile.
- Unknown keys fail for each kind. Framework-generated `_path`, `categoryBasePath`,
  body, and routing fields are deliberately outside this raw metadata contract.
- Body-only partials use `{}`; they do not inherit article requirements.
- Consumers remain responsible for publication selection, private/dot files,
  routing, YAML duplicate-key handling, and their own migration decisions.

## Development

```sh
npm ci --ignore-scripts
npm run check
npm run check:dist
```

`check` rebuilds JavaScript/declarations, checks inferred types with positive and
negative compile tests, and runs runtime tests through the public subpath export.
`check:dist` fails when rebuilding changes tracked distribution files. Commit
source and generated `dist/` together. Tests contain only synthetic examples.
Future modules should add explicit subpath exports; this is not a workspace or UI package.

## Licensing

No project license has been selected. Public visibility is not a license grant.
Third-party dependencies retain their own licenses.
