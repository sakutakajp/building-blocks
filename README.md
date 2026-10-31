# building-blocks

Content schemas and optional themeable Vue UI in one root package. The first module
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
Node.js 22.22.3+, 24.15.0+ or 26+ is supported. Pin your application's lockfile as well.

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

## Locale publication policy

The additive `building-blocks/locale-publication` export provides `publicationPolicySchema`,
`localeRouteSchema`, `publicationPathSchema`, and `createLocalePublicationSchema(allowedLocales)`.
The factory takes the application's explicit locale allowlist and validates a strict object
whose `resources` map generic resource IDs to locale entries. Each entry requires `path`,
`publication` (`published` or `draft`) and `search` (`index` or `noindex`). Draft requires noindex.
Paths must be canonical lower-case absolute ASCII page paths ending in `/`, and cannot collide
across resources or locales. No optional defaults, coercion or unknown keys are accepted.
An absent locale remains absent; it is never filled in or published. The package contains no
site-specific locale list, resource IDs, slugs or content. Inferred types are exported as
`PublicationPolicy`, `LocaleRoute` and `LocalePublication`.

Validation alone does not restrict access. Consumers must enforce drafts in server/client
routing, content/query APIs and static output, and derive links, robots, sitemap and hreflang
from their one validated policy source. A published-noindex page remains accessible by URL.
Tool and Index frontmatter optionally accept `localePublication`, validated by
`publicationPolicySchema`. Existing content remains valid without it; Blog and Partial contracts
and independent editorial `noindex` remain unchanged. Applications may require the field for
their managed pages and prohibit duplicated `noindex` in those pages. Install an exact reviewed work-branch commit; this is not a main
merge or an npm release.

## Themeable Vue UI

The optional `building-blocks/ui` entry exports `BbTheme`, `BbButton`, `BbTextField`,
`BbCard`, `BbTabs`, `BbSelectionGroup`, `BbSelect`, `BbBadge` and `BbDialog`.
UI consumers install Vue 3.5 or later. Schema-only consumers do not need Vue:
it is an optional peer and is never imported by the schema entry points.

Import the structural CSS and only the themes you use. No fonts, images or network
requests are bundled with themes. Storybook is a development dependency, not an
application dependency. `sideEffects` preserves explicitly imported CSS; bundlers
can tree-shake unused UI exports. UI is SSR-safe and has no top-level DOM access.

```vue
<script setup lang="ts">
import { BbTheme, BbButton } from 'building-blocks/ui';
import 'building-blocks/themes/base.css';
import 'building-blocks/themes/memphis.css';
</script>
<template>
  <BbTheme theme="memphis">
    <BbButton @click="start">Start</BbButton>
  </BbTheme>
</template>
```

Available themes: `glassmorphism`, `memphis`, `cyberpunk`. `BbTheme` boundaries can
be nested. Theme variables are locally scoped, so a light form can sit inside a
dark page. Blur is limited to surfaces; controls remain solid and readable.
There are no animations, remote fonts or mandatory global theme imports.

### Component contracts

- Button: `variant` primary/secondary/danger/ghost; `size` sm/md/lg; disabled/loading; defaults to type button.
- Text field / Select: `v-model`, required `label`, optional description/error/disabled/required. Supply `options` as `{value,label,disabled?}` to Select.
- Card: title/description and header/default/footer slots.
- Tabs: string `v-model`, `tabs` as `{value,label,disabled?}`, `label`; panels via `#panel-VALUE`. Arrow/Home/End navigation skips disabled tabs.
- Selection group: `type` checkbox/radio/switch, label and options. Radio uses string `v-model`; checkbox and switch use string arrays. `required` means at least one enabled option for checkbox/switch.
- Badge: neutral/success/warning/danger, with text in default slot. Convey meaning with words, not color alone.
- Dialog: `v-model:open`, required title, optional description, default/footer slots. Uses native dialog modal behavior and Escape; focus returns to the trigger. Keep it inside BbTheme. Native `<dialog>` support is required.

Storybook contains 24 component/theme stories plus three full galleries with
working inputs, tabs and dialogs. Example content is fictional and never submitted.

### Development and publishing

```sh
npm ci --ignore-scripts
npm run check
npm run lint
npm run build-storybook
```

`npm run storybook` starts the local catalog. GitHub Pages publishes only
`storybook-static/` after checks pass on main. Enable repository Settings → Pages →
Source → GitHub Actions. The workflow uses GitHub's short-lived deployment token;
no personal token or npm publishing credential is required. It has read-only
repository access, with Pages write and OIDC permissions limited to the deploy job.
Deployment is public: never add credentials, customer data or private source content
to stories. PR builds test the catalog but do not deploy. No external analytics.

Public repository visibility does not grant an open-source license. This change
preserves the repository's existing licensing status rather than selecting a license
on the owner's behalf.
