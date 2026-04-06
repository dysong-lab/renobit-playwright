const { test, expect } = require('@playwright/test');
const path = require('path');
const { goToEditor, ensureTestPage, savePage } = require('../helpers/renobit');

test.setTimeout(60_000);

const FIXTURES = path.join(__dirname, '../fixtures');

/** El-Message success 토스트 확인 헬퍼 */
async function expectSuccessToast(page, keyword = '') {
  const toast = page.locator('.el-message--success');
  await expect(toast).toBeVisible({ timeout: 15_000 });
  if (keyword) {
    await expect(toast).toContainText(keyword);
  }
}

test.describe('Basic - RENOBIT 메뉴 > Import / Export', () => {
  const runId = Date.now().toString(36);

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
  });

  // ── Import Page ──────────────────────────────────────────────
  test('Import Page — page.json 가져오기', async ({ page }) => {
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.evaluate(() => {
        // TODO: 실제 커맨드명 확인 필요
        window.wemb.editorFacade.sendNotification('command/importPage');
      }),
    ]);
    await fileChooser.setFiles(path.join(FIXTURES, 'page.json'));

    await expectSuccessToast(page);
    console.log('[PASS] Import Page 성공 팝업 확인');
  });

  // ── Export Current Page ───────────────────────────────────────
  test('Export Current Page — 현재 페이지 내보내기', async ({ page }) => {
    await ensureTestPage(page, `basic_export_${runId}`);

    await page.evaluate(() => {
      // TODO: 실제 커맨드명 확인 필요
      window.wemb.editorFacade.sendNotification('command/exportCurrentPage');
    });

    await expectSuccessToast(page, '파일 내보내기 완료');
    console.log('[PASS] Export Current Page 성공 팝업 확인');
  });

  // ── Export Pages ──────────────────────────────────────────────
  test('Export Pages — 특정 페이지 선택 내보내기', async ({ page }) => {
    const pageName = `basic_expages_${runId}`;
    await ensureTestPage(page, pageName);

    await page.evaluate(() => {
      // TODO: 실제 커맨드명 확인 필요
      window.wemb.editorFacade.sendNotification('command/openExportPagesModal');
    });

    // 내보내기 팝업에서 테스트 페이지 선택 후 내보내기
    // TODO: 팝업 내부 구조(체크박스 selector) 확인 필요
    await page.waitForSelector('.export-pages-modal', { state: 'visible', timeout: 10_000 });
    await page.locator('.export-pages-modal').getByText(pageName).click();
    await page.locator('.export-pages-modal .el-button--primary').click();

    await expectSuccessToast(page, '파일 내보내기 완료');
    console.log('[PASS] Export Pages 성공 팝업 확인');
  });

  // ── Import Resources ──────────────────────────────────────────
  test('Import Resources — resources.zip 가져오기', async ({ page }) => {
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.evaluate(() => {
        // TODO: 실제 커맨드명 확인 필요
        window.wemb.editorFacade.sendNotification('command/importResources');
      }),
    ]);
    await fileChooser.setFiles(path.join(FIXTURES, 'resources.zip'));

    await expectSuccessToast(page, '리소스가 성공적으로 추가');
    console.log('[PASS] Import Resources 성공 팝업 확인');
  });

  // ── Export Resources ──────────────────────────────────────────
  test('Export Resources — 리소스 선택 내보내기', async ({ page }) => {
    await page.evaluate(() => {
      // TODO: 실제 커맨드명 확인 필요
      window.wemb.editorFacade.sendNotification('command/openExportResourcesModal');
    });

    // 리소스 선택 후 내보내기
    // TODO: 팝업 내부 구조 확인 필요
    await page.waitForSelector('.export-resources-modal', { state: 'visible', timeout: 10_000 });
    await page.locator('.export-resources-modal input[type="checkbox"]').first().check();
    await page.locator('.export-resources-modal .el-button--primary').click();

    // 확인 팝업 OK 클릭
    await page.locator('.el-message-box .el-button--primary').click();

    await expectSuccessToast(page, '리소스 내보내기 완료');
    console.log('[PASS] Export Resources 성공 팝업 확인');
  });

  // ── Import Total Data ─────────────────────────────────────────
  test('Import Total Data — total_data.zip 가져오기', async ({ page }) => {
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.evaluate(() => {
        // TODO: 실제 커맨드명 확인 필요
        window.wemb.editorFacade.sendNotification('command/importTotalData');
      }),
    ]);
    await fileChooser.setFiles(path.join(FIXTURES, 'total_data.zip'));

    await expectSuccessToast(page, '통합가져오기 완료');
    console.log('[PASS] Import Total Data 성공 팝업 확인');
  });

  // ── Export Total Data ─────────────────────────────────────────
  test('Export Total Data — 전체 선택 내보내기', async ({ page }) => {
    await page.evaluate(() => {
      // TODO: 실제 커맨드명 확인 필요
      window.wemb.editorFacade.sendNotification('command/openExportTotalDataModal');
    });

    // 전체 선택 체크 후 내보내기
    // TODO: 팝업 내부 구조 확인 필요
    await page.waitForSelector('.export-total-data-modal', { state: 'visible', timeout: 10_000 });
    await page.locator('.export-total-data-modal .select-all input[type="checkbox"]').check();
    await page.locator('.export-total-data-modal .el-button--primary').click();

    // 페이지 선택 후 내보내기 (2단계)
    await page.locator('.export-total-data-modal .el-button--primary').click();

    await expectSuccessToast(page, '파일 내보내기 완료');
    console.log('[PASS] Export Total Data 성공 팝업 확인');
  });
});
