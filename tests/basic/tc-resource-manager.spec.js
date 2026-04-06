const { test, expect } = require('@playwright/test');
const path = require('path');
const { goToEditor } = require('../helpers/renobit');

test.setTimeout(60_000);

const FIXTURES = path.join(__dirname, '../fixtures');

/**
 * 리소스 매니저 탭을 열고 파일을 업로드한 뒤 성공 토스트를 확인한다.
 * @param {Page} page
 * @param {string} tabName - 탭 이름 (image, background, icons 등)
 * @param {string} fixturePath - 업로드할 fixture 파일 경로
 */
async function uploadResourceInTab(page, tabName, fixturePath) {
  // 리소스 매니저 열기
  // TODO: 실제 커맨드명 또는 UI 경로 확인 필요
  await page.evaluate(() => {
    window.wemb.editorFacade.sendNotification('command/openResourceManager');
  });

  // TODO: 리소스 매니저 컨테이너 selector 확인 필요
  await page.waitForSelector('.resource-manager', { state: 'visible', timeout: 15_000 });

  // 탭 클릭
  await page.locator('.resource-manager .el-tabs__item').filter({ hasText: tabName }).click();

  // + 버튼 클릭 → 파일 선택
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('.resource-manager .resource-add-btn').click(),
    // TODO: + 버튼 selector 확인 필요 (.resource-add-btn)
  ]);
  await fileChooser.setFiles(fixturePath);

  // 성공 토스트 확인
  await expect(page.locator('.el-message--success')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.el-message--success')).toContainText('리소스가 성공적으로 추가');
}

test.describe('Basic - Resource Manager', () => {
  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
  });

  test('image 탭 — jpg 파일 업로드', async ({ page }) => {
    await uploadResourceInTab(page, 'image', path.join(FIXTURES, 'image.jpg'));
    console.log('[PASS] Resource Manager > image 탭 업로드 성공');
  });

  test('background 탭 — jpg 파일 업로드', async ({ page }) => {
    await uploadResourceInTab(page, 'background', path.join(FIXTURES, 'image.jpg'));
    console.log('[PASS] Resource Manager > background 탭 업로드 성공');
  });

  test('icons 탭 — jpg 파일 업로드', async ({ page }) => {
    await uploadResourceInTab(page, 'icons', path.join(FIXTURES, 'image.jpg'));
    console.log('[PASS] Resource Manager > icons 탭 업로드 성공');
  });

  test('button images 탭 — jpg 파일 업로드', async ({ page }) => {
    await uploadResourceInTab(page, 'button images', path.join(FIXTURES, 'image.jpg'));
    console.log('[PASS] Resource Manager > button images 탭 업로드 성공');
  });

  test('sprite clip 탭 — jpg 파일 업로드', async ({ page }) => {
    await uploadResourceInTab(page, 'sprite clip', path.join(FIXTURES, 'image.jpg'));
    console.log('[PASS] Resource Manager > sprite clip 탭 업로드 성공');
  });

  test('state clip 탭 — zip 파일 업로드', async ({ page }) => {
    await uploadResourceInTab(page, 'state clip', path.join(FIXTURES, 'state_clip.zip'));
    console.log('[PASS] Resource Manager > state clip 탭 업로드 성공');
  });

  test('gltf 탭 — zip 파일 업로드', async ({ page }) => {
    await uploadResourceInTab(page, 'gltf', path.join(FIXTURES, 'gltf.zip'));
    console.log('[PASS] Resource Manager > gltf 탭 업로드 성공');
  });

  test('asset resource gltf 탭 — zip 파일 업로드', async ({ page }) => {
    await uploadResourceInTab(page, 'asset resource gltf', path.join(FIXTURES, 'asset_gltf.zip'));
    console.log('[PASS] Resource Manager > asset resource gltf 탭 업로드 성공');
  });

  test('lottie 탭 — zip 파일 업로드', async ({ page }) => {
    await uploadResourceInTab(page, 'lottie', path.join(FIXTURES, 'lottie.zip'));
    console.log('[PASS] Resource Manager > lottie 탭 업로드 성공');
  });

  test('hdr 탭 — zip 파일 업로드', async ({ page }) => {
    await uploadResourceInTab(page, 'hdr', path.join(FIXTURES, 'hdr.zip'));
    console.log('[PASS] Resource Manager > hdr 탭 업로드 성공');
  });
});
