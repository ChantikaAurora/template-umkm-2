import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3001';
const OUT = path.join(import.meta.dirname, 'test-shots');
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function newPage() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  page.on('dialog', d => d.dismiss().catch(() => {}));
  return page;
}

async function shot(page, name) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  console.log(`  📸 ${name}.png`);
}

async function login(page, email, password) {
  await page.goto(`${BASE}/auth/login`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
}

// Public homepage
const pub = await newPage();
await pub.goto(BASE);
await shot(pub, '01-homepage');
await pub.goto(`${BASE}/katalog`);
await shot(pub, '02-katalog');
await pub.goto(`${BASE}/auth/login`);
await shot(pub, '03-login');
await pub.close();

// Owner dashboard
const owner = await newPage();
await login(owner, 'rendang@umkm2.id', 'owner123');
await owner.goto(`${BASE}/dashboard`);
await shot(owner, '04-owner-dashboard');
await owner.goto(`${BASE}/dashboard/products`);
await shot(owner, '05-owner-products');
await owner.close();

// Admin
const admin = await newPage();
await login(admin, 'admin@umkm2.id', 'admin123');
await admin.goto(`${BASE}/dashboard`);
await shot(admin, '06-admin-dashboard');
await admin.goto(`${BASE}/dashboard/umkm`);
await shot(admin, '07-admin-umkm');
await admin.close();

// Superadmin
const sa = await newPage();
await login(sa, 'superadmin@umkm2.id', 'admin123');
await sa.goto(`${BASE}/dashboard/users`);
await shot(sa, '08-superadmin-users');
await sa.goto(`${BASE}/dashboard/settings`);
await shot(sa, '09-superadmin-settings');
await sa.close();

await browser.close();
console.log(`\n✅ Screenshots saved to test-shots/`);
