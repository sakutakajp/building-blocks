import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
for (const file of await readdir('themes')) {
 const css=await readFile(`themes/${file}`,'utf8');
 assert(!/@import|url\(/.test(css), `${file}: no external theme assets`);
 assert(!/:root/.test(css),`${file}: themes must be scoped`);
}
const pkg=JSON.parse(await readFile('package.json','utf8'));
assert(pkg.peerDependenciesMeta.vue.optional);
for(const file of ['dist/content-schema.js','dist/locale-publication.js'])assert(!/from ['"]vue/.test(await readFile(file,'utf8')));
console.log('Theme isolation and schema dependency checks passed');

// Assert schema and single-component consumers do not retain unrelated UI.
const { build } = await import('esbuild');
const bundle = await build({ stdin: { contents: "export { BbButton } from 'building-blocks/ui'", resolveDir: process.cwd() }, bundle: true, write: false, format: 'esm', external: ['vue'], minify: true });
const output = bundle.outputFiles[0].text;
for (const name of ['BbTextField', 'BbSelect', 'BbSelectionGroup', 'BbDialog', 'BbTabs', 'BbCard']) assert(!output.includes(name), `${name} retained in button-only bundle`);
console.log(`Button-only bundle: ${Buffer.byteLength(output)} bytes (Vue external)`);
