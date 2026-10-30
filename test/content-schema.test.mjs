import test from 'node:test';
import assert from 'node:assert/strict';
import { blogSchema, toolSchema, indexSchema, partialSchema, contentSchemas } from 'building-blocks/content-schema';

const blog = { title: 'Example', description: 'Example description', slug: 'example', category: 'notes', createDate: '2024/02/29', cover: '/example.png' };
const tool = { ...blog, alt: '' };
const page = { title: 'Example', description: 'Example description', cover: '/example.png', alt: '' };

test('valid blog metadata and optional fields are preserved without adding defaults', () => {
  const input = { ...blog, updated: '2026/01/01', alt: 'Example image', tag: ['example'], recommend: false, homepage: true, showCover: false, noindex: true };
  assert.deepEqual(blogSchema.parse(input), input);
  assert.deepEqual(blogSchema.parse(blog), blog);
});
for (const [kind, schema, valid] of [['blog', blogSchema, blog], ['tool', toolSchema, tool], ['index', indexSchema, page], ['partial', partialSchema, {}]]) {
  test(`${kind}: accepts minimal input and rejects unknown/generated keys`, () => {
    assert.deepEqual(schema.parse(valid), valid);
    for (const key of ['typo', '_path', 'categoryBasePath', 'date']) {
      assert.equal(schema.safeParse({ ...valid, [key]: 'example' }).success, false);
    }
    for (const value of [null, [], 'example']) assert.equal(schema.safeParse(value).success, false);
  });
}
test('required fields cannot be omitted', () => {
  for (const [schema, input] of [[blogSchema, blog], [toolSchema, tool], [indexSchema, page]]) {
    for (const key of Object.keys(input)) {
      const candidate = { ...input }; delete candidate[key];
      assert.equal(schema.safeParse(candidate).success, false, key);
    }
  }
});
test('legacy invalid values are errors, never coerced', () => {
  for (const patch of [{ slug: 123 }, { description: null }, { updated: null }, { tag: 'example' }, { tag: [1] }, { createDate: '2023/02/29' }, { title: ' ' }]) {
    assert.equal(blogSchema.safeParse({ ...blog, ...patch }).success, false);
  }
  for (const key of ['recommend', 'homepage', 'showCover', 'noindex']) {
    for (const value of ['false', 0, null]) assert.equal(blogSchema.safeParse({ ...blog, [key]: value }).success, false);
  }
});
test('partials permit absent metadata but enforce their own allowed fields', () => {
  assert.deepEqual(partialSchema.parse({ title: 'Example {query}', updated: '2026/01/01' }), { title: 'Example {query}', updated: '2026/01/01' });
  assert.equal(partialSchema.safeParse({ slug: 'example' }).success, false);
  assert.equal(partialSchema.safeParse({ updated: '2026/02/30' }).success, false);
});
test('schema selection is explicit', () => {
  assert.equal(contentSchemas.blog, blogSchema);
  assert.equal(contentSchemas.tool, toolSchema);
  assert.equal(contentSchemas.index, indexSchema);
  assert.equal(contentSchemas.partial, partialSchema);
});

test('tool rules are typed and tags are blog-only', () => {
  assert.deepEqual(toolSchema.parse({ ...tool, rules: ['Example rule'] }).rules, ['Example rule']);
  assert.equal(toolSchema.safeParse({ ...tool, rules: [1] }).success, false);
  assert.equal(toolSchema.safeParse({ ...tool, tag: ['example'] }).success, false);
  assert.equal(indexSchema.safeParse({ ...page, tag: ['example'] }).success, false);
});
