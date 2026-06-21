/**
 * Quick test: verify login + key dashboard pages for all roles
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3001';
const results = [];

const browser = await chromium.launch({ headless: true });

async function newPage() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  page.on('dialog', d => d.dismiss().catch(() => {}));
  return page;
}

async function login(page, email, password) {
  await page.goto(`${BASE}/auth/login`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  return page.url();
}

async function checkPage(page, url, label) {
  await page.goto(url);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(800);
  const status = page.url().includes('/auth/login') ? 'REDIRECT_TO_LOGIN' : 'OK';
  const title = await page.title().catch(() => 'N/A');
  results.push({ label, url, status, title });
  console.log(`  ${status === 'OK' ? '✅' : '❌'} ${label}: ${status}`);
}

// PUBLIC pages
console.log('\n=== PUBLIC PAGES ===');
{
  const page = await newPage();
  await checkPage(page, BASE, 'Homepage');
  await checkPage(page, `${BASE}/katalog`, 'Katalog');
  await checkPage(page, `${BASE}/cerita`, 'Cerita');
  await checkPage(page, `${BASE}/event`, 'Event');
  await checkPage(page, `${BASE}/auth/login`, 'Login Page');
  await checkPage(page, `${BASE}/auth/register`, 'Register Page');
  await page.close();
}

// VISITOR
console.log('\n=== VISITOR ===');
{
  const page = await newPage();
  const dest = await login(page, 'visitor@umkm2.id', 'visitor123');
  console.log(`  Login → ${dest}`);
  await checkPage(page, `${BASE}/dashboard`, 'Visitor Dashboard');
  await checkPage(page, `${BASE}/dashboard/register-umkm`, 'Visitor Register UMKM');
  await checkPage(page, `${BASE}/dashboard/profile`, 'Visitor Profile');
  await page.close();
}

// UMKM OWNER
console.log('\n=== UMKM OWNER ===');
{
  const page = await newPage();
  const dest = await login(page, 'rendang@umkm2.id', 'owner123');
  console.log(`  Login → ${dest}`);
  await checkPage(page, `${BASE}/dashboard`, 'Owner Dashboard');
  await checkPage(page, `${BASE}/dashboard/products`, 'Owner Products');
  await checkPage(page, `${BASE}/dashboard/products/new`, 'Owner New Product');
  await checkPage(page, `${BASE}/dashboard/cerita`, 'Owner Cerita');
  await checkPage(page, `${BASE}/dashboard/promos`, 'Owner Promos');
  await checkPage(page, `${BASE}/dashboard/whatsapp-orders`, 'Owner WA Orders');
  await page.close();
}

// ADMIN
console.log('\n=== ADMIN ===');
{
  const page = await newPage();
  const dest = await login(page, 'admin@umkm2.id', 'admin123');
  console.log(`  Login → ${dest}`);
  await checkPage(page, `${BASE}/dashboard`, 'Admin Dashboard');
  await checkPage(page, `${BASE}/dashboard/umkm`, 'Admin UMKM');
  await checkPage(page, `${BASE}/dashboard/products`, 'Admin Products');
  await checkPage(page, `${BASE}/dashboard/cerita`, 'Admin Cerita');
  await checkPage(page, `${BASE}/dashboard/event`, 'Admin Event');
  await checkPage(page, `${BASE}/dashboard/reports`, 'Admin Reports');
  await page.close();
}

// SUPERADMIN
console.log('\n=== SUPERADMIN ===');
{
  const page = await newPage();
  const dest = await login(page, 'superadmin@umkm2.id', 'admin123');
  console.log(`  Login → ${dest}`);
  await checkPage(page, `${BASE}/dashboard`, 'Superadmin Dashboard');
  await checkPage(page, `${BASE}/dashboard/users`, 'Superadmin Users');
  await checkPage(page, `${BASE}/dashboard/apps`, 'Superadmin Apps');
  await checkPage(page, `${BASE}/dashboard/homepage-content`, 'Superadmin Homepage Content');
  await checkPage(page, `${BASE}/dashboard/settings`, 'Superadmin Settings');
  await page.close();
}

await browser.close();

// Summary
const ok = results.filter(r => r.status === 'OK').length;
const fail = results.filter(r => r.status !== 'OK').length;
console.log(`\n📊 Results: ${ok} OK, ${fail} failed out of ${results.length} pages`);
if (fail > 0) {
  console.log('\n❌ Failed pages:');
  results.filter(r => r.status !== 'OK').forEach(r => console.log(`  - ${r.label}: ${r.url} → ${r.status}`));
}
console.log('\n✅ Test complete');
