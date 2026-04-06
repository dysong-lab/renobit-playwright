const { test, expect } = require('@playwright/test');
const { goToEditor } = require('../helpers/renobit');

test.setTimeout(60_000);

const TAB_LABELS = [
  'Images',
  'Background',
  'Icons',
  'Button Images',
  'Sprite Clip',
  'State Clip',
  'GLTF',
  'Lottie',
  'HDR',
];

test.describe('Basic - Resource Manager', () => {
  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/showResourceManager');
    });
    await page.locator('#resource-manager').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('리소스 매니저 modal 표시', async ({ page }) => {
    await expect(page.locator('#resource-manager .modal-header')).toContainText('Resource Manager');
  });

  for (const label of TAB_LABELS) {
    test(`${label} 탭 표시`, async ({ page }) => {
      const tab = page.locator('#resource-manager').getByRole('tab', { name: label, exact: true });
      await expect(tab).toBeVisible();
    });
  }

  test('기본 탭은 Images로 시작', async ({ page }) => {
    const activeTab = page.locator('#resource-manager').getByRole('tab', {
      name: 'Images',
      exact: true,
    });
    await expect(activeTab).toHaveClass(/is-active/);
  });
});
