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
