import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '..', '.output', 'public');
const indexPath = path.join(outDir, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

const importMapRe = /<script\s+type="importmap">([\s\S]*?)<\/script>/i;
const m = html.match(importMapRe);
if (m) {
  const importMapJson = m[1].trim();
  const importMapPath = path.join(outDir, 'nuxt.importmap.json');
  fs.writeFileSync(importMapPath, importMapJson, 'utf8');
  html = html.replace(importMapRe, '<script type="importmap" src="/nuxt.importmap.json"></script>');
}

const nuxtCfgRe = /<script>([\s\S]*?window\.__NUXT__[\s\S]*?)<\/script>/i;
const n = html.match(nuxtCfgRe);
if (n) {
  const js = n[1].trim();
  const nuxtCfgPath = path.join(outDir, 'nuxt-config.js');
  fs.writeFileSync(nuxtCfgPath, js + '\n', 'utf8');
  html = html.replace(nuxtCfgRe, '<script src="/nuxt-config.js"></script>');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Post-build fix applied: importmap + NUXT config externalized.');
