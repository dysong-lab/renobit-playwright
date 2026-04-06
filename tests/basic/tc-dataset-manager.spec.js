const { test, expect } = require('@playwright/test');

test.setTimeout(90_000);

async function goToDatasetManager(page) {
  await page.goto('/renobit/visual.do#/datasetMananger', { waitUntil: 'domcontentloaded' });
  await page.locator('#dataset-manager').waitFor({ state: 'visible', timeout: 15_000 });
}

test.describe('Basic - Dataset Manager', () => {
  test.beforeEach(async ({ page }) => {
    await goToDatasetManager(page);
  });

  test('Dataset Manager 기본 레이아웃 표시', async ({ page }) => {
    await expect(page.locator('#dataset-manager')).toBeVisible();
    await expect(page.locator('#dataset-manager .dataset-list')).toBeVisible();
    await expect(page.locator('#dataset-manager .dataset-main-tabs')).toBeVisible();
  });

  test('기본 탭 표시', async ({ page }) => {
    await expect(page.getByRole('tab', { name: '데이터셋 생성' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '환경설정' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '데이터셋 수정' })).toHaveCount(0);
  });

  test('Create Dataset 폼 기본 필드 표시', async ({ page }) => {
    await expect(page.locator('#input01')).toBeVisible();
    await expect(page.locator('#input02')).toBeVisible();
    await expect(page.locator('.double-check-btn')).toBeVisible();
    await expect(page.locator('.preview-btn')).toBeVisible();
    await expect(page.locator('.complete-btn')).toBeVisible();
  });

  test('dataset.json import 시 import popup 표시', async ({ page }) => {
    await page.evaluate(() => {
      const datasetList = window.wemb?.viewComponentMap?.get?.('DatasetListMediator');
      if (!datasetList?.showImportPopup) {
        throw new Error('DatasetListMediator view is not ready');
      }

      datasetList.showImportPopup({
        data: [
          {
            dataset_id: 'fixture-ds-01',
            name: 'fixture_dataset',
          },
        ],
        datasource: [],
      });
    });

    const importDialog = page.locator('.import-dialog .el-dialog');
    await expect(importDialog).toBeVisible({ timeout: 15_000 });
    await expect(importDialog.getByText('fixture_dataset', { exact: true })).toBeVisible();
    await expect(importDialog.locator('.el-button--primary')).toBeVisible();
  });
});
