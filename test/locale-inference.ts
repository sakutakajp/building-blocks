import { createLocalePublicationSchema, type PublicationPolicy, type LocaleRoute } from '../src/locale-publication.js';
const policy: PublicationPolicy = { publication: 'draft', search: 'noindex' };
const route: LocaleRoute = { path: '/en/example/', publication: 'published', search: 'index' };
// @ts-expect-error draft cannot be indexable
const unsafe: PublicationPolicy = { publication: 'draft', search: 'index' };
// @ts-expect-error no implicit search default
const missing: LocaleRoute = { path: '/en/', publication: 'published' };
const parsed = createLocalePublicationSchema(['ja', 'en']).parse({ resources: {} });
const english: LocaleRoute | undefined = parsed.resources['example']?.en;
// @ts-expect-error unknown locale is not inferred as published
const unknownLocale = parsed.resources['example']?.xx;
void [policy, route, unsafe, missing, english, unknownLocale];
