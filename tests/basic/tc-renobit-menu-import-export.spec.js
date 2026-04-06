const { test, expect } = require('@playwright/test');
const path = require('path');
const { goToEditor, ensureTestPage } = require('../helpers/renobit');

test.setTimeout(90_000);

const FIXTURES = path.join(__dirname, '../fixtures');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test.describe('Basic - RENOBIT 메뉴 > Import / Export', () => {
  const runId = Date.now().toString(36);

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
  });

  test('Import Page - 파일 선택 후 import modal 표시', async ({ page }) => {
    await Promise.all([
      page.evaluate(() => {
        window.wemb.editorFacade.sendNotification('command/importPages');
      }),
      page.setInputFiles('#importFile', path.join(FIXTURES, 'page.json')),
    ]);

    await page.locator('#importPagesModal').waitFor({ state: 'visible', timeout: 15_000 });
    await expect(page.locator('#importPagesModal .el-button--primary')).toBeVisible();
  });

  test('Export Current Page - 현재 페이지 내보내기 다운로드 시작', async ({ page }) => {
    await ensureTestPage(page, `basic_export_current_${runId}`);

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.evaluate(() => {
        window.wemb.editorFacade.sendNotification('command/exportPage');
      }),
    ]);

    await expect(download.suggestedFilename()).toBe('pages.json');
  });

  test('Export Pages - 내보내기 modal 표시 및 다운로드 시작', async ({ page }) => {
    const pageName = `basic_export_pages_${runId}`;
    await ensureTestPage(page, pageName);

    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/showExportPagesModal');
    });

    const modal = page.locator('#exportPagesModal');
    await modal.waitFor({ state: 'visible', timeout: 15_000 });
    await modal.getByPlaceholder('페이지명을 입력하세요.').fill(pageName);

    const searchList = modal.locator('.page-search-list');
    const pageCheckbox = searchList.locator(`input.el-checkbox__original[value="${pageName}"]`).first();
    await expect(searchList).toBeVisible();
    const pageLabel = searchList.getByText(pageName, { exact: true }).first();
    await expect(pageLabel).toBeVisible();
    await pageLabel.click();
    await expect(pageCheckbox).toBeChecked();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      modal.locator('.el-button--primary').click(),
    ]);

    await expect(download.suggestedFilename()).toBe('pages.json');
  });

  test('Import Resources - zip 파일 chooser 열기', async ({ page }) => {
    await Promise.all([
      page.evaluate(() => {
        window.wemb.editorFacade.sendNotification('command/importResources');
      }),
      page.setInputFiles('#importFile', path.join(FIXTURES, 'resources.zip')),
    ]);
  });

  test('Export Resources - export resources modal 표시', async ({ page }) => {
    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/showExportResourcesManager');
    });

    const modal = page.locator('#export-resource-manager');
    await modal.waitFor({ state: 'visible', timeout: 15_000 });
    await expect(modal.getByText('Export Resources')).toBeVisible();
  });

  test('Import Total Data - zip 파일 chooser 열기', async ({ page }) => {
    await Promise.all([
      page.evaluate(() => {
        window.wemb.editorFacade.sendNotification('command/importTotalDATA');
      }),
      page.setInputFiles('#importFile', path.join(FIXTURES, 'total_data.zip')),
    ]);
  });

  test('Export Total Data - 내보내기 modal 표시', async ({ page }) => {
    await ensureTestPage(page, `basic_export_total_${runId}`);

    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/showExportTotalDataModal');
    });

    const modal = page.locator('#exportTotalDataModal');
    await modal.waitFor({ state: 'visible', timeout: 15_000 });
    await expect(modal.locator('.all-checkbox')).toBeVisible();
    await expect(modal.locator('.el-button--primary')).toBeVisible();
  });
});
