const { test, expect } = require('@playwright/test');
const {
  goToEditor,
  ensureTestPage,
  switchToTwoLayer,
  waitForActiveEditorPage,
} = require('../helpers/renobit');

test.setTimeout(90_000);

async function addComponent(page, componentName, instanceName) {
  await page.evaluate(
    ({ compName, instName }) => {
      window.wemb.editorFacade.sendNotification('command/addComponentInstanceByName', {
        componentName: compName,
        name: instName,
      });
    },
    { compName: componentName, instName: instanceName }
  );

  await page.waitForFunction(
    (name) => !!window.wemb?.mainPageComponent?.getComInstanceByName?.(name),
    instanceName,
    { timeout: 15_000 }
  );
}

async function openInstanceList(page) {
  await page.evaluate(() => {
    const sideNavbar = window.wemb?.viewComponentMap?.get?.('SideNavbarMediator');
    if (!sideNavbar) {
      throw new Error('SideNavbarMediator view is not ready');
    }
    sideNavbar.activeIndex = 'listbar-3';
  });

  await page.locator('#outline-panel-content').waitFor({ state: 'visible', timeout: 15_000 });
}

async function ensureEditablePage(page, pageId) {
  await waitForActiveEditorPage(page, pageId);

  const emptyEditorMessage = page.getByText('활성화된 페이지가 존재하지 않습니다. 먼저 페이지를 만들어주세요.');
  if (await emptyEditorMessage.isVisible().catch(() => false)) {
    await page.evaluate((id) => {
      window.wemb.editorFacade.sendNotification('command/openPage', id);
    }, pageId);

    await waitForActiveEditorPage(page, pageId);
    await expect(emptyEditorMessage).toBeHidden({ timeout: 15_000 });
  }
}

test.describe('Basic - Instance List (Hide / Lock)', () => {
  const runId = Date.now().toString(36);

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    const pageId = await ensureTestPage(page, `basic_instlist_${runId}`);
    await ensureEditablePage(page, pageId);
    await switchToTwoLayer(page);
    await openInstanceList(page);
  });

  test('icon-view(숨기기) — Instance List에서 visible 토글', async ({ page }) => {
    const instName = `hide_test_${runId}`;
    await addComponent(page, 'BsFiguresComponent', instName);

    const row = page.locator('#outline-panel-content tr').filter({ hasText: instName }).first();
    await expect(row).toBeVisible();

    const viewButton = row.locator('.icon-view').first();
    await expect(viewButton).toBeVisible();
    await viewButton.click();

    await expect(viewButton).toHaveClass(/off/);
    await page.waitForFunction(
      (name) => {
        const comp = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
        return comp?.editorModeVisible === false;
      },
      instName,
      { timeout: 10_000 }
    );
  });

  test('icon-lock(잠금) — Instance List에서 lock 토글', async ({ page }) => {
    const instName = `lock_test_${runId}`;
    await addComponent(page, 'BsFiguresComponent', instName);

    const row = page.locator('#outline-panel-content tr').filter({ hasText: instName }).first();
    await expect(row).toBeVisible();

    const lockButton = row.locator('.icon-lock').first();
    await expect(lockButton).toBeVisible();
    await lockButton.click();

    await expect(lockButton).toHaveClass(/on/);
    await page.waitForFunction(
      (name) => {
        const comp = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
        return comp?.lock === true && comp?.editorModeVisible !== false;
      },
      instName,
      { timeout: 10_000 }
    );
  });
});
