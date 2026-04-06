const { test, expect } = require('@playwright/test');
const { goToEditor, ensureTestPage, savePage, switchToTwoLayer } = require('../helpers/renobit');

test.setTimeout(120_000);

/**
 * 컴포넌트를 배치하고 Properties 패널에서 속성을 수정한다.
 * Properties 패널은 컴포넌트 선택 시 우측에 표시된다.
 */
async function selectComponent(page, instanceName) {
  await page.evaluate((name) => {
    const comp = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
    if (!comp) throw new Error(`Component not found: ${name}`);
    window.wemb.editorFacade.sendNotification('command/newSelectedComponentInstance', comp);
  }, instanceName);
  await page.waitForTimeout(500);
}

/**
 * Properties 패널에서 spinbutton 값 수정
 * label: 'Width' | 'Height' | 'X' | 'Y' 등
 */
async function setProperty(page, label, value) {
  const panel = page.locator('.el-tab-pane[aria-labelledby*="Properties"], [role="tabpanel"][aria-label="Properties"]');
  const row = panel.locator(`text=${label}`).locator('..').locator('input, [role="spinbutton"]').first();
  await row.clear();
  await row.fill(String(value));
  await row.press('Enter');
  await page.waitForTimeout(200);
}

async function verifyInViewer(page, instanceName) {
  await savePage(page);
  await page.goto('/renobit/visualViewer.do', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3_000);

  const found = await page.evaluate((name) => {
    return !!(
      document.querySelector(`[data-instance-name="${name}"]`) ||
      document.querySelector(`[id="${name}"]`) ||
      document.querySelector(`[data-name="${name}"]`)
    );
  }, instanceName);

  expect(found, `visualViewer에서 "${instanceName}" 컴포넌트를 찾을 수 없음`).toBeTruthy();
}

test.describe('Basic - 2D Component Properties 수정', () => {
  const runId = Date.now().toString(36);

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    await ensureTestPage(page, `basic_props_${runId}`);
    await switchToTwoLayer(page);
  });

  test('2d_pack > Basic > Active Group Btn — Properties 수정 후 viewer 확인', async ({ page }) => {
    const instName = `agb_props_${runId}`;

    // 컴포넌트 배치
    await page.evaluate((name) => {
      window.wemb.editorFacade.sendNotification('command/addComponentInstanceByName', {
        componentName: 'ActiveGroupBtnComponent',
        name,
      });
    }, instName);
    await page.waitForFunction(
      (n) => !!window.wemb?.mainPageComponent?.getComInstanceByName?.(n),
      instName,
      { timeout: 15_000 }
    );

    // Properties 패널에서 속성 수정
    await selectComponent(page, instName);

    // Size
    await setProperty(page, 'Width', 300);
    await setProperty(page, 'Height', 150);

    // Position
    await setProperty(page, 'X', 50);
    await setProperty(page, 'Y', 50);

    // 저장 후 viewer 확인
    await verifyInViewer(page, instName);
    console.log('[PASS] Active Group Btn Properties 수정 → viewer 확인');
  });

  test('Bootstrap > Contents > Figures — Properties 수정 후 viewer 확인', async ({ page }) => {
    const instName = `bs_fig_props_${runId}`;

    await page.evaluate((name) => {
      window.wemb.editorFacade.sendNotification('command/addComponentInstanceByName', {
        componentName: 'BsFiguresComponent',
        name,
      });
    }, instName);
    await page.waitForFunction(
      (n) => !!window.wemb?.mainPageComponent?.getComInstanceByName?.(n),
      instName,
      { timeout: 15_000 }
    );

    await selectComponent(page, instName);

    await setProperty(page, 'Width', 400);
    await setProperty(page, 'Height', 200);
    await setProperty(page, 'X', 100);
    await setProperty(page, 'Y', 100);

    await verifyInViewer(page, instName);
    console.log('[PASS] Bootstrap Figures Properties 수정 → viewer 확인');
  });

  test('DataViz > Echart — Properties 수정 후 viewer 확인', async ({ page }) => {
    const instName = `echart_props_${runId}`;

    await page.evaluate((name) => {
      window.wemb.editorFacade.sendNotification('command/addComponentInstanceByName', {
        componentName: 'EchartComponent',
        name,
      });
    }, instName);
    await page.waitForFunction(
      (n) => !!window.wemb?.mainPageComponent?.getComInstanceByName?.(n),
      instName,
      { timeout: 15_000 }
    );

    await selectComponent(page, instName);

    await setProperty(page, 'Width', 500);
    await setProperty(page, 'Height', 300);
    await setProperty(page, 'X', 200);
    await setProperty(page, 'Y', 50);

    await verifyInViewer(page, instName);
    console.log('[PASS] Echart Properties 수정 → viewer 확인');
  });
});
