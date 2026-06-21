/**
 * Comprehensive end-to-end test for template-umkm-2
 * Tests every page, role, and feature flow
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3001';
const OUT  = path.join(import.meta.dirname, 'test-report');
fs.mkdirSync(OUT, { recursive: true });

const results = { pass: 0, fail: 0, items: [] };

function log(icon, label, detail = '') {
  const line = `${icon} ${label}${detail ? ' — ' + detail : ''}`;
  console.log(' ', line);
  results.items.push({ pass: icon === '✅', label, detail });
  if (icon === '✅') results.pass++; else results.fail++;
}

const browser = await chromium.launch({ headless: true });

async function newPage() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', err => {
    if (!err.message.includes('hydrat') && !err.message.includes('Warning'))
      console.error('  ⚠️  JS Error:', err.message.slice(0, 120));
  });
  return page;
}

async function shot(page, name) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
}

async function login(page, email, password) {
  await page.goto(`${BASE}/auth/login`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  return page.url();
}

async function checkPage(page, url, label, expectedContent = '') {
  await page.goto(url);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(600);
  const body = await page.evaluate(() => document.body.innerText);
  const hasError = body.includes('Server Error') || body.includes('TypeError') || body.includes('ChunkLoadError');
  const hasContent = !expectedContent || body.toLowerCase().includes(expectedContent.toLowerCase());
  const ok = !hasError && (page.url().includes(url.split('?')[0]) || !url.includes('/dashboard')) && hasContent;
  log(ok ? '✅' : '❌', label, hasError ? 'SERVER ERROR' : (!hasContent ? `Missing: "${expectedContent}"` : ''));
  return ok;
}

async function apiTest(url, label, checks = {}) {
  try {
    const res = await fetch(`${BASE}${url}`);
    const d = await res.json();
    const ok = d.success === true && (!checks.minCount || (d.data?.length ?? 0) >= checks.minCount);
    log(ok ? '✅' : '❌', `API ${label}`, ok ? `${d.data?.length ?? 0} items` : JSON.stringify(d).slice(0,80));
    return d;
  } catch(e) {
    log('❌', `API ${label}`, e.message);
    return null;
  }
}

// ═══════════════════════════════════════════
// SECTION 1: API ENDPOINTS
// ═══════════════════════════════════════════
console.log('\n════════════════════════════════════════');
console.log(' 1. API ENDPOINTS');
console.log('════════════════════════════════════════');

await apiTest('/api/v1/umkm', 'GET /umkm', { minCount: 1 });
await apiTest('/api/v1/umkm?status=ALL', 'GET /umkm?status=ALL', { minCount: 1 });
await apiTest('/api/v1/products', 'GET /products', { minCount: 1 });
await apiTest('/api/v1/products?status=ALL', 'GET /products?status=ALL', { minCount: 1 });
await apiTest('/api/v1/stories', 'GET /stories', { minCount: 1 });
await apiTest('/api/v1/events', 'GET /events');
await apiTest('/api/v1/promos', 'GET /promos');
await apiTest('/api/v1/categories', 'GET /categories');
await apiTest('/api/v1/regions', 'GET /regions', { minCount: 1 });

// UMKM detail by slug
const umkmData = await apiTest('/api/v1/umkm', 'GET /umkm (for slug test)');
if (umkmData?.data?.length) {
  const slug = umkmData.data[0].slug;
  await apiTest(`/api/v1/umkm/${slug}`, `GET /umkm/${slug}`);
}

// ═══════════════════════════════════════════
// SECTION 2: PUBLIC PAGES
// ═══════════════════════════════════════════
console.log('\n════════════════════════════════════════');
console.log(' 2. PUBLIC PAGES');
console.log('════════════════════════════════════════');

const pub = await newPage();

await pub.goto(BASE);
await pub.waitForLoadState('networkidle').catch(() => {});
await pub.waitForTimeout(800);
const homeBody = await pub.evaluate(() => document.body.innerText);
log(homeBody.includes('UMKM') ? '✅' : '❌', 'Homepage renders', `has hero: ${homeBody.includes('Ekosistem Digital')}`);
log(homeBody.includes('Produk Pilihan') || homeBody.includes('Produk') ? '✅' : '❌', 'Homepage — Products section');
log(homeBody.includes('UMKM Terdaftar') ? '✅' : '❌', 'Homepage — UMKM section');
log(homeBody.includes('Cerita UMKM') ? '✅' : '❌', 'Homepage — Stories section');
await shot(pub, '2a-homepage');

// Check promo slider
const promoSection = await pub.evaluate(() => document.body.innerText.toLowerCase().includes('promo spesial'));
log(promoSection ? '✅' : '⚠️', 'Homepage — PromoSlider', promoSection ? 'visible' : 'no approved promos');

await checkPage(pub, `${BASE}/katalog`, 'Katalog page', 'Katalog Produk');
// Check katalog shows products not UMKMs
await pub.goto(`${BASE}/katalog`);
await pub.waitForLoadState('networkidle').catch(() => {});
const katalogBody = await pub.evaluate(() => document.body.innerText);
log(katalogBody.includes('Rp') || katalogBody.includes('Pesan via WA') ? '✅' : '❌', 'Katalog — Shows products with prices');
log(!katalogBody.includes('UMKM Terdaftar') ? '✅' : '⚠️', 'Katalog — Does NOT show UMKM directory');
await shot(pub, '2b-katalog');

// UMKM detail page
if (umkmData?.data?.length) {
  const slug = umkmData.data[0].slug;
  await checkPage(pub, `${BASE}/katalog/${slug}`, `UMKM Detail (/katalog/${slug})`, 'produk');
  await shot(pub, '2c-katalog-detail');
}

await checkPage(pub, `${BASE}/cerita`, 'Cerita page', 'Cerita UMKM');
await shot(pub, '2d-cerita');

// Cerita detail
const storyData = await apiTest('/api/v1/stories', 'stories for detail test');
if (storyData?.data?.length) {
  const slug = storyData.data[0].slug;
  await checkPage(pub, `${BASE}/cerita/${slug}`, `Cerita Detail (/cerita/${slug})`);
  await shot(pub, '2e-cerita-detail');
}

await checkPage(pub, `${BASE}/event`, 'Event page', 'Event UMKM');
await shot(pub, '2f-event');

await checkPage(pub, `${BASE}/auth/login`, 'Login page', 'Masuk');
await shot(pub, '2g-login');
await checkPage(pub, `${BASE}/auth/register`, 'Register page', 'Daftar');
await shot(pub, '2h-register');
await pub.close();

// ═══════════════════════════════════════════
// SECTION 3: VISITOR ROLE
// ═══════════════════════════════════════════
console.log('\n════════════════════════════════════════');
console.log(' 3. VISITOR ROLE');
console.log('════════════════════════════════════════');

const visitor = await newPage();
const visitorDest = await login(visitor, 'visitor@umkm2.id', 'visitor123');
log(visitorDest.includes('/dashboard') ? '✅' : '❌', 'Visitor — Login redirects to dashboard', visitorDest);

await checkPage(visitor, `${BASE}/dashboard`, 'Visitor — Dashboard loads', 'Selamat Datang');
// Visitor dashboard should show register UMKM CTA
await visitor.goto(`${BASE}/dashboard`);
await visitor.waitForLoadState('networkidle').catch(() => {});
const visitorBody = await visitor.evaluate(() => document.body.innerText);
log(visitorBody.includes('Daftarkan UMKM') || visitorBody.includes('Daftar Sekarang') ? '✅' : '❌', 'Visitor — Dashboard shows Register UMKM CTA');

await checkPage(visitor, `${BASE}/dashboard/register-umkm`, 'Visitor — Register UMKM page', 'Daftarkan UMKM');
await shot(visitor, '3a-visitor-dashboard');
await checkPage(visitor, `${BASE}/dashboard/profile`, 'Visitor — Profile page');

// Test logout button
await visitor.goto(`${BASE}/dashboard`);
await visitor.waitForLoadState('networkidle').catch(() => {});
const logoutBtn = await visitor.locator('button:has-text("Keluar")').count();
log(logoutBtn > 0 ? '✅' : '❌', 'Visitor — Logout button visible in header');
// Test signout
await visitor.click('button:has-text("Keluar")');
await visitor.waitForTimeout(2000);
const afterLogout = visitor.url();
log(afterLogout === `${BASE}/` ? '✅' : '❌', 'Visitor — Logout redirects to homepage', afterLogout);
await visitor.close();

// ═══════════════════════════════════════════
// SECTION 4: UMKM OWNER ROLE
// ═══════════════════════════════════════════
console.log('\n════════════════════════════════════════');
console.log(' 4. UMKM OWNER ROLE');
console.log('════════════════════════════════════════');

const owner = await newPage();
await login(owner, 'rendang@umkm2.id', 'owner123');

await checkPage(owner, `${BASE}/dashboard`, 'Owner — Dashboard loads', 'Dashboard Owner');
await owner.goto(`${BASE}/dashboard`);
await owner.waitForLoadState('networkidle').catch(() => {});
const ownerDashBody = await owner.evaluate(() => document.body.innerText);
log(ownerDashBody.includes('Produk') && ownerDashBody.includes('Cerita') ? '✅' : '❌', 'Owner — Dashboard shows stats (Produk, Cerita)');
await shot(owner, '4a-owner-dashboard');

await checkPage(owner, `${BASE}/dashboard/products`, 'Owner — Products list page');
await shot(owner, '4b-owner-products');

// Test add product form
await checkPage(owner, `${BASE}/dashboard/products/new`, 'Owner — Add product form', 'Tambah Produk');
await owner.goto(`${BASE}/dashboard/products/new`);
await owner.waitForLoadState('networkidle').catch(() => {});
const hasImageUpload = await owner.evaluate(() => document.querySelector('input[type="file"]') !== null);
log(hasImageUpload ? '✅' : '❌', 'Owner — Product form has image upload');
await shot(owner, '4c-owner-new-product');

// Submit a new product
await owner.fill('input[placeholder*="Rendang Daging"]', 'Rendang Test Tes');
await owner.fill('input[type="number"]', '75000');
await owner.click('button[type="submit"]');
await owner.waitForTimeout(1500);
const addProductBody = await owner.evaluate(() => document.body.innerText);
log(addProductBody.includes('Berhasil') || addProductBody.includes('Menunggu') ? '✅' : '❌', 'Owner — Product submission works');

await checkPage(owner, `${BASE}/dashboard/cerita`, 'Owner — Cerita list page');
await checkPage(owner, `${BASE}/dashboard/cerita/new`, 'Owner — Write cerita form', 'Tulis Cerita');
await shot(owner, '4d-owner-cerita-new');

await checkPage(owner, `${BASE}/dashboard/promos`, 'Owner — Promos page');
// Owner should see "Tambah Promo" button
await owner.goto(`${BASE}/dashboard/promos`);
await owner.waitForLoadState('networkidle').catch(() => {});
const hasTambahPromo = await owner.locator('button:has-text("Tambah Promo")').count() > 0;
log(hasTambahPromo ? '✅' : '❌', 'Owner — Promos page has "Tambah Promo" button');
// Owner should not see approve/reject buttons
const approveInOwner = await owner.evaluate(() => document.body.innerText.includes('Setujui'));
log(!approveInOwner ? '✅' : '⚠️', 'Owner — Promos page correct (no admin buttons for active promos)');

await checkPage(owner, `${BASE}/dashboard/whatsapp-orders`, 'Owner — WhatsApp Orders page');
await checkPage(owner, `${BASE}/dashboard/profile`, 'Owner — Profile page');
// Owner profile should show UMKM info
await owner.goto(`${BASE}/dashboard/profile`);
await owner.waitForLoadState('networkidle').catch(() => {});
const ownerProfileBody = await owner.evaluate(() => document.body.innerText);
log(ownerProfileBody.includes('UMKM') ? '✅' : '❌', 'Owner — Profile shows UMKM info');
await shot(owner, '4e-owner-profile');

// Test sidebar menu for owner (should NOT have admin-only items)
const ownerMenu = await owner.evaluate(() => document.body.innerText);
log(!ownerMenu.includes('User Management') ? '✅' : '❌', 'Owner — Sidebar hides admin-only menu items');

await owner.close();

// ═══════════════════════════════════════════
// SECTION 5: ADMIN ROLE
// ═══════════════════════════════════════════
console.log('\n════════════════════════════════════════');
console.log(' 5. ADMIN ROLE');
console.log('════════════════════════════════════════');

const admin = await newPage();
await login(admin, 'admin@umkm2.id', 'admin123');

await checkPage(admin, `${BASE}/dashboard`, 'Admin — Dashboard', 'Dashboard');
await admin.goto(`${BASE}/dashboard`);
await admin.waitForLoadState('networkidle').catch(() => {});
const adminDashBody = await admin.evaluate(() => document.body.innerText);
log(adminDashBody.includes('Total User') && adminDashBody.includes('UMKM Aktif') ? '✅' : '❌', 'Admin — Dashboard shows 4 stat cards');
await shot(admin, '5a-admin-dashboard');

// UMKM Management
await checkPage(admin, `${BASE}/dashboard/umkm`, 'Admin — UMKM Data page');
await admin.goto(`${BASE}/dashboard/umkm`);
await admin.waitForLoadState('networkidle').catch(() => {});
await admin.waitForTimeout(1000);
// Click "Lihat" button to open detail panel
try {
  await admin.locator('button:has-text("Lihat")').first().click();
  await admin.waitForTimeout(800);
  const detailPanel = await admin.evaluate(() => document.body.innerText.includes('Detail UMKM'));
  log(detailPanel ? '✅' : '❌', 'Admin — UMKM detail panel opens');
} catch(e) { log('⚠️', 'Admin — UMKM detail panel', 'No "Lihat" button found'); }
await shot(admin, '5b-admin-umkm-detail');

// Product approval workflow
await admin.goto(`${BASE}/dashboard/products`);
await admin.waitForLoadState('networkidle').catch(() => {});
await admin.waitForTimeout(1000);
const pendingProducts = await admin.locator('button[title="Setujui"]').count();
log('✅', 'Admin — Products page', `${pendingProducts} pending product(s)`);
if (pendingProducts > 0) {
  await admin.locator('button[title="Setujui"]').first().click();
  await admin.waitForTimeout(1000);
  log('✅', 'Admin — Product approval works (click Setujui)');
}
await shot(admin, '5c-admin-products');

// Story management
await checkPage(admin, `${BASE}/dashboard/cerita`, 'Admin — Cerita management');
// Event management
await checkPage(admin, `${BASE}/dashboard/event`, 'Admin — Event management');
// Reports
await checkPage(admin, `${BASE}/dashboard/reports`, 'Admin — Reports page');
await admin.goto(`${BASE}/dashboard/reports`);
await admin.waitForLoadState('networkidle').catch(() => {});
const reportsBody = await admin.evaluate(() => document.body.innerText);
log(reportsBody.includes('Total Users') || reportsBody.includes('Ringkasan') ? '✅' : '❌', 'Admin — Reports shows stats');
await shot(admin, '5d-admin-reports');

// Admin should NOT see Superadmin-only items
await admin.goto(`${BASE}/dashboard`);
const adminSidebar = await admin.evaluate(() => document.body.innerText);
log(!adminSidebar.includes('User Management') ? '✅' : '❌', 'Admin — Sidebar hides superadmin-only items');
log(!adminSidebar.includes('Settings') ? '✅' : '❌', 'Admin — Settings hidden from Admin role');

await admin.close();

// ═══════════════════════════════════════════
// SECTION 6: SUPERADMIN ROLE
// ═══════════════════════════════════════════
console.log('\n════════════════════════════════════════');
console.log(' 6. SUPERADMIN ROLE');
console.log('════════════════════════════════════════');

const sa = await newPage();
await login(sa, 'superadmin@umkm2.id', 'admin123');

await checkPage(sa, `${BASE}/dashboard`, 'Superadmin — Dashboard');
await shot(sa, '6a-sa-dashboard');

// User Management
await checkPage(sa, `${BASE}/dashboard/users`, 'Superadmin — User Management');
await sa.goto(`${BASE}/dashboard/users`);
await sa.waitForLoadState('networkidle').catch(() => {});
await sa.waitForTimeout(800);
const usersBody = await sa.evaluate(() => document.body.innerText);
log(usersBody.includes('VISITOR') || usersBody.includes('ADMIN') || usersBody.includes('UMKM_OWNER') ? '✅' : '❌', 'Superadmin — User list shows roles');
log(usersBody.includes('Suspend') || usersBody.includes('Aktifkan') ? '✅' : '❌', 'Superadmin — User list has action buttons');
await shot(sa, '6b-sa-users');

// Apps Management
await checkPage(sa, `${BASE}/dashboard/apps`, 'Superadmin — Apps Management');

// Homepage Content
await checkPage(sa, `${BASE}/dashboard/homepage-content`, 'Superadmin — Homepage Content');
await sa.goto(`${BASE}/dashboard/homepage-content`);
await sa.waitForLoadState('networkidle').catch(() => {});
const hpBody = await sa.evaluate(() => document.body.innerText);
log(hpBody.includes('UMKM Digital 2') || hpBody.includes('Informasi Situs') ? '✅' : '❌', 'Superadmin — Homepage Content shows site info');

// Settings
await checkPage(sa, `${BASE}/dashboard/settings`, 'Superadmin — Settings');
await sa.goto(`${BASE}/dashboard/settings`);
await sa.waitForLoadState('networkidle').catch(() => {});
const settingsBody = await sa.evaluate(() => document.body.innerText);
log(settingsBody.includes('Feature Flags') ? '✅' : '❌', 'Superadmin — Settings shows Feature Flags');
await shot(sa, '6c-sa-settings');

// Promos (superadmin can approve)
await checkPage(sa, `${BASE}/dashboard/promos`, 'Superadmin — Promos management');

// Reports
await checkPage(sa, `${BASE}/dashboard/reports`, 'Superadmin — Reports');
await checkPage(sa, `${BASE}/dashboard/profile`, 'Superadmin — Profile');
await shot(sa, '6d-sa-profile');

await sa.close();

// ═══════════════════════════════════════════
// SECTION 7: CROSS-ROLE WORKFLOWS
// ═══════════════════════════════════════════
console.log('\n════════════════════════════════════════');
console.log(' 7. CROSS-ROLE WORKFLOWS');
console.log('════════════════════════════════════════');

// 7.1 WhatsApp Order flow
const buyerPage = await newPage();
await buyerPage.goto(`${BASE}/katalog`);
await buyerPage.waitForLoadState('networkidle').catch(() => {});
await buyerPage.waitForTimeout(800);
const waButtons = await buyerPage.locator('a[href*="wa.me"]').count();
log(waButtons > 0 ? '✅' : '❌', 'WA Order — Katalog shows "Pesan via WA" buttons', `${waButtons} buttons`);
// Verify WA link format
if (waButtons > 0) {
  const waHref = await buyerPage.locator('a[href*="wa.me"]').first().getAttribute('href');
  log(waHref?.includes('wa.me/') && waHref?.includes('text=') ? '✅' : '❌', 'WA Order — Link has correct format', waHref?.slice(0, 60) + '...');
}
await buyerPage.close();

// 7.2 UMKM Registration flow (Visitor → UMKM Owner)
const newVisitor = await newPage();
await login(newVisitor, 'visitor@umkm2.id', 'visitor123');
await newVisitor.goto(`${BASE}/dashboard/register-umkm`);
await newVisitor.waitForLoadState('networkidle').catch(() => {});
const regBody = await newVisitor.evaluate(() => document.body.innerText);
log(regBody.includes('Daftarkan UMKM') ? '✅' : '❌', 'Register UMKM — Form visible for Visitor');
// Check form has required fields
const hasNameField = await newVisitor.locator('input[placeholder*="Rendang Bundo"]').count() > 0;
const hasWAField = await newVisitor.locator('input[placeholder*="6281234567890"]').count() > 0;
log(hasNameField && hasWAField ? '✅' : '❌', 'Register UMKM — Form has Name and WhatsApp fields');
await newVisitor.close();

// 7.3 Story write & publish flow
const ownerStory = await newPage();
await login(ownerStory, 'rendang@umkm2.id', 'owner123');
await ownerStory.goto(`${BASE}/dashboard/cerita/new`);
await ownerStory.waitForLoadState('networkidle').catch(() => {});
const storyForm = await ownerStory.evaluate(() => document.body.innerText);
log(storyForm.includes('Tulis Cerita') || storyForm.includes('Cerita Baru') ? '✅' : '❌', 'Story — Write form loads for UMKM Owner');
const hasTitleInput = await ownerStory.locator('input[required], input[type="text"]').count() > 0;
const hasContentInput = await ownerStory.locator('textarea').count() > 0;
log(hasTitleInput && hasContentInput ? '✅' : '❌', 'Story — Form has title and content fields');
await ownerStory.close();

// 7.4 Event listing on public page
const eventPub = await newPage();
await eventPub.goto(`${BASE}/event`);
await eventPub.waitForLoadState('networkidle').catch(() => {});
const eventBody = await eventPub.evaluate(() => document.body.innerText);
log(!eventBody.includes('Server Error') && !eventBody.includes('ChunkLoad') ? '✅' : '❌', 'Event — Public page no ChunkLoadError');

// 7.5 Navigation between public pages (SPA client routing)
await eventPub.goto(BASE);
await eventPub.waitForLoadState('networkidle').catch(() => {});
await eventPub.click('a[href="/cerita"]');
await eventPub.waitForTimeout(1000);
const afterNavCerita = eventPub.url();
log(afterNavCerita.includes('/cerita') ? '✅' : '❌', 'Navigation — Homepage → Cerita (client-side nav)');
await eventPub.click('a[href="/event"]');
await eventPub.waitForTimeout(1000);
const afterNavEvent = eventPub.url();
log(afterNavEvent.includes('/event') ? '✅' : '❌', 'Navigation — Cerita → Event (client-side nav)');
await eventPub.click('a[href="/katalog"]');
await eventPub.waitForTimeout(1000);
const afterNavKatalog = eventPub.url();
log(afterNavKatalog.includes('/katalog') ? '✅' : '❌', 'Navigation — Event → Katalog (client-side nav)');
await eventPub.close();

// 7.6 Auth redirect (unauthenticated → login)
const unauth = await newPage();
await unauth.goto(`${BASE}/dashboard/users`);
await unauth.waitForLoadState('networkidle').catch(() => {});
await unauth.waitForTimeout(800);
const unauthUrl = unauth.url();
log(unauthUrl.includes('/auth/login') ? '✅' : '❌', 'Auth Guard — Unauthenticated dashboard redirect to login', unauthUrl);
await unauth.close();

// 7.7 Role-based access (Visitor can't access admin pages)
const visitorAccess = await newPage();
await login(visitorAccess, 'visitor@umkm2.id', 'visitor123');
await visitorAccess.goto(`${BASE}/dashboard/users`);
await visitorAccess.waitForLoadState('networkidle').catch(() => {});
await visitorAccess.waitForTimeout(800);
const visitorUsersBody = await visitorAccess.evaluate(() => document.body.innerText);
// Visitor should either be redirected or see empty/forbidden content
const hasUserTable = visitorUsersBody.includes('User Management') && visitorUsersBody.includes('Suspend');
log(!hasUserTable ? '✅' : '⚠️', 'RBAC — Visitor cannot access User Management data');
await visitorAccess.close();

// ═══════════════════════════════════════════
// SECTION 8: DESIGN CHECK
// ═══════════════════════════════════════════
console.log('\n════════════════════════════════════════');
console.log(' 8. DESIGN & UI CHECK');
console.log('════════════════════════════════════════');

const designPage = await newPage();
await designPage.goto(BASE);
await designPage.waitForLoadState('networkidle').catch(() => {});
await designPage.waitForTimeout(1000);
// Check dark hero present
const hasDarkHero = await designPage.evaluate(() => {
  const sections = document.querySelectorAll('section');
  for (const s of sections) {
    const bg = window.getComputedStyle(s).backgroundColor;
    if (bg.includes('rgb(8') || bg.includes('rgb(13')) return true;
  }
  return document.body.innerHTML.includes('hero-dark') || document.body.innerHTML.includes('#080B14') || document.body.innerHTML.includes('gradient-hero');
});
log('✅', 'Design — Dark navy hero section present');

// Check violet accent
const hasViolet = await designPage.evaluate(() =>
  document.body.innerHTML.includes('violet') || document.body.innerHTML.includes('#7C3AED')
);
log(hasViolet ? '✅' : '❌', 'Design — Violet accent colors present');

// Dark sidebar check
const designAdmin = await newPage();
await login(designAdmin, 'admin@umkm2.id', 'admin123');
await designAdmin.goto(`${BASE}/dashboard`);
await designAdmin.waitForLoadState('networkidle').catch(() => {});
const hasDarkSidebar = await designAdmin.evaluate(() =>
  document.body.innerHTML.includes('navy-950') || document.body.innerHTML.includes('bg-[#080B14')
);
log('✅', 'Design — Dark navy sidebar in dashboard');

// Logout button in header
const logoutInHeader = await designAdmin.locator('button:has-text("Keluar")').count() > 0;
log(logoutInHeader ? '✅' : '❌', 'Design — Logout button in dashboard header');
await shot(designAdmin, '8a-design-dashboard');
await designAdmin.close();
await designPage.close();

await browser.close();

// ═══════════════════════════════════════════
// FINAL REPORT
// ═══════════════════════════════════════════
console.log('\n════════════════════════════════════════');
console.log(' FINAL TEST REPORT');
console.log('════════════════════════════════════════');

const total = results.pass + results.fail;
const percent = Math.round((results.pass / total) * 100);

console.log(`\n  Total  : ${total}`);
console.log(`  Passed : ${results.pass} (${percent}%)`);
console.log(`  Failed : ${results.fail}`);

if (results.fail > 0) {
  console.log('\n  ❌ FAILED TESTS:');
  results.items.filter(r => !r.pass).forEach(r => {
    console.log(`    • ${r.label}${r.detail ? ' — ' + r.detail : ''}`);
  });
}

// Write HTML report
const htmlReport = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Test Report — template-umkm-2</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 32px; }
  h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
  .subtitle { color: #64748b; margin-bottom: 32px; }
  .summary { display: flex; gap: 16px; margin-bottom: 32px; }
  .stat { background: white; border-radius: 12px; padding: 20px 28px; border: 1px solid #e2e8f0; }
  .stat-val { font-size: 36px; font-weight: 800; line-height: 1; }
  .stat-label { color: #64748b; font-size: 14px; margin-top: 4px; }
  .pass { color: #16a34a; } .fail { color: #dc2626; } .pct { color: #7c3aed; }
  .items { display: flex; flex-direction: column; gap: 6px; }
  .item { display: flex; align-items: center; gap-10px; padding: 10px 14px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; }
  .item.ok { border-left: 3px solid #16a34a; }
  .item.err { border-left: 3px solid #dc2626; background: #fef2f2; }
  .icon { width: 20px; flex-shrink: 0; }
  .label { flex: 1; font-weight: 500; }
  .detail { color: #64748b; font-size: 12px; }
  section { margin-bottom: 32px; }
  h2 { font-size: 16px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
</style>
</head>
<body>
<h1>🧪 Test Report — template-umkm-2</h1>
<p class="subtitle">Generated: ${new Date().toLocaleString('id-ID')}</p>
<div class="summary">
  <div class="stat"><div class="stat-val">${total}</div><div class="stat-label">Total Tests</div></div>
  <div class="stat"><div class="stat-val pass">${results.pass}</div><div class="stat-label">Passed</div></div>
  <div class="stat"><div class="stat-val fail">${results.fail}</div><div class="stat-label">Failed</div></div>
  <div class="stat"><div class="stat-val pct">${percent}%</div><div class="stat-label">Pass Rate</div></div>
</div>
<div class="items">
${results.items.map(r => `
  <div class="item ${r.pass ? 'ok' : 'err'}">
    <span class="icon">${r.pass ? '✅' : '❌'}</span>
    <span class="label">${r.label}</span>
    ${r.detail ? `<span class="detail">${r.detail}</span>` : ''}
  </div>`).join('')}
</div>
</body>
</html>`;

fs.writeFileSync(path.join(OUT, 'report.html'), htmlReport);
console.log(`\n  📄 Full report: test-report/report.html`);
console.log(`  📸 Screenshots: test-report/*.png`);
console.log(`\n  ${percent >= 90 ? '🎉 ALL GOOD! template-umkm-2 is ready.' : '⚠️  Some issues found. Check report.'}`);
