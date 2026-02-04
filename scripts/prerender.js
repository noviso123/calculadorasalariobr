
// scripts/prerender.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES = [
  '/',
  '/ferias',
  '/decimo-terceiro',
  '/rescisao',
  '/consignado',
  '/comparar', // CLT vs PJ
  '/irpf-simulador',
  '/politica-privacidade',
  '/termos',
  '/sobre'
];

async function prerender() {
  const dist = path.resolve('dist');

  // 1. Start the static server (preview)
  console.log('🚀 Starting preview server for prerendering...');

  // We use 'vite preview' to serve the built assets
  const server = spawn(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', ['vite', 'preview', '--port', '4173'], {
    stdio: 'inherit',
    shell: true
  });

  // Give server huge time to boot slightly
  await new Promise(r => setTimeout(r, 5000));

  console.log('📸 Starting browser...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (const route of ROUTES) {
    try {
        console.log(`⚡ Prerendering: ${route}`);

        await page.goto(`http://localhost:4173${route}`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Extra wait to ensure hydration/animations are settled
        await new Promise(r => setTimeout(r, 1000));

        // Get HTML
        const content = await page.content();

        // Path handling
        const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
        const filePath = path.join(dist, routePath);
        const dirPath = path.dirname(filePath);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Replace the root div empty state with the full content?
        // Puppeteer content() gives the *current* full HTML DOM.
        // We just save that.

        // OPTIONAL: Minify or specific cleanups could happen here.

        fs.writeFileSync(filePath, content);
        console.log(`✅ Saved: ${filePath}`);

    } catch (e) {
        console.error(`❌ Failed to prerender ${route}:`, e);
    }
  }

  await browser.close();
  server.kill();
  console.log('✨ Prerendering complete!');
  process.exit(0);
}

prerender();
