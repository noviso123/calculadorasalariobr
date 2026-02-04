
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, '..', p);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const { render } = await import(pathToFileURL(toAbsolute('dist-server/entry-server.js')).href);

const routesToPrerender = [
    '/',
    '/ferias',
    '/decimo-terceiro',
    '/rescisao',
    '/consignado',
    '/comparar',
    '/irpf-simulador',
    '/politica-privacidade',
    '/termos',
    '/sobre'
];

(async () => {
  console.log('🚀 Starting Native SSR Prerendering...');

  for (const url of routesToPrerender) {
    console.log(`⚡ Prerendering: ${url}`);

    const appHtml = render(url); // { html, helmet } usually. Let's see entry-server output.

    // In entry-server.tsx we returned { html, helmet }
    // We need to inject helmet data too if we want perfect SEO titles.
    // For now, let's inject the HTML into root.

    const html = template
      .replace(`<!--app-html-->`, appHtml.html);

    // TODO: Improve Helmet injection (replace <title> etc) if needed.
    // Since React Helmet Async works on client too, client hydration will fix title quickly,
    // but for View Source SEO, we want it in HTML.
    // Let's assume simple injection for now to unblock.

    const filePath = url === '/' ? 'index.html' : `${url}/index.html`; // e.g. ferias/index.html
    const fullPath = toAbsolute(`dist/${filePath}`);
    const dirname = path.dirname(fullPath);

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(fullPath, html);
    console.log(`✅ Generated: ${filePath}`);
  }

  // Cleanup: remove dist-server
  // fs.rmSync(toAbsolute('dist-server'), { recursive: true, force: true });
  console.log('✨ SSR Prerendering Complete!');
})();
