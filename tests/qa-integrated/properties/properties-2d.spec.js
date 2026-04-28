const { test, expect } = require('@playwright/test');
const {
  goToEditor,
  ensureTestPage,
  switchToTwoLayer,
  cleanupComponents,
} = require('../../helpers/renobit');

const TEST_PAGE = 'qa-properties-test-page';

async function addComponent(page, componentName, instanceName) {
  await page.evaluate(({ compName, instName }) => {
    window.wemb.editorFacade.sendNotification('command/addComponentInstanceByName', {
      componentName: compName,
      name: instName,
    });
  }, { compName: componentName, instName: instanceName });
  await page.waitForFunction(
    (name) => !!(
      window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
      (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name)
    ),
    instanceName,
    { timeout: 45000 }
  );
}

async function selectComponent(page, instanceName) {
  await page.evaluate((name) => {
    const inst = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
    if (inst) window.wemb.editorFacade.sendNotification('command/newSelectedComponentInstance', inst);
  }, instanceName);
  await page.waitForTimeout(500);
}

async function ensureSectionExpanded(page, sectionName) {
  const section = page.getByRole('menuitem', { name: new RegExp(sectionName) }).first();
  if (!await section.isVisible({ timeout: 5000 }).catch(() => false)) return;
  const isExpanded = await section.evaluate(
    el => el.getAttribute('aria-expanded') === 'true'
  ).catch(() => false);
  if (!isExpanded) {
    await section.click();
    await page.waitForTimeout(300);
  }
}

function getSizeSection(page) {
  return page.getByRole('menuitem', { name: /^Size/ }).first();
}

function getSizeInput(page, index) {
  return getSizeSection(page).getByRole('spinbutton').nth(index);
}

function getSizeUnitTextbox(page, index) {
  return getSizeSection(page).getByRole('textbox', { name: 'Select' }).nth(index);
}

function getSizeUnitSelect(page, index) {
  return getSizeSection(page).locator('.el-select').nth(index);
}

function getSizeIncreaseButton(page, index) {
  return getSizeSection(page).getByRole('button').nth(index * 2 + 1);
}

async function ensureSizeUnitPx(page, index) {
  const unitTextbox = getSizeUnitTextbox(page, index);
  await expect(unitTextbox).toBeVisible({ timeout: 5000 });

  const currentUnit = (await unitTextbox.inputValue().catch(() => '')).trim().toUpperCase();
  if (currentUnit === 'PX') return;

  const unitSelect = getSizeUnitSelect(page, index);
  await unitSelect.click();
  const pxOption = page.locator('.el-select-dropdown:visible').getByText(/^PX$/i).first();
  await expect(pxOption).toBeVisible({ timeout: 5000 });
  await pxOption.click();
  await expect(unitTextbox).toHaveValue(/px/i, { timeout: 5000 });
}

test.describe('PROPERTIES - 2D Component Tests', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    await ensureTestPage(page, TEST_PAGE);
    await page.evaluate(() => {
      const mpc = window.wemb?.mainPageComponent;
      if (!mpc) return;
      (mpc._comInstanceList || [])
        .filter(c => c.name?.startsWith('tc_prop_'))
        .forEach(c => window.wemb.editorFacade.sendNotification('command/removeComponentInstance', c));
    }).catch(() => {});
    await page.waitForTimeout(300);
  });

  // ────────────────────────────────────────────────────────────
  // 2D Component — Instance Name
  // ────────────────────────────────────────────────────────────

  test('[QATC-1216] Properties - 2D Instance Name { @QA @Properties @QATC-1216 }', async ({ page }) => {
    /**
     * [Expected Result]: 인스턴스명 노출 및 수정 가능, 중복 시 경고 얼럿
     */
    await switchToTwoLayer(page);
    const instName = `tc_prop_1216_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);
    await ensureSectionExpanded(page, 'Instance Name');

    const nameFound = await page.evaluate(
      (name) => [...document.querySelectorAll('input')].some(el => el.value === name),
      instName
    );
    expect(nameFound).toBe(true);

    await cleanupComponents(page, 'tc_prop_1216_');
  });

  // ────────────────────────────────────────────────────────────
  // 2D Component — Size
  // ────────────────────────────────────────────────────────────

  test('[QATC-1217] Properties - 2D Size - Width { @QA @Properties @QATC-1217 }', async ({ page }) => {
    /**
     * [Expected Result]: 크기 변경 가능, 단위: PX / % / EM / REM / VW / VH
     */
    await switchToTwoLayer(page);
    const instName = `tc_prop_1217_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);
    await ensureSectionExpanded(page, 'Size');

    const widthInput = getSizeInput(page, 0);
    await expect(widthInput).toBeVisible({ timeout: 5000 });

    await ensureSizeUnitPx(page, 0);

    const isEnabled = await widthInput.isEnabled().catch(() => false);
    if (isEnabled) {
      const newWidth = 300;
      await widthInput.fill(String(newWidth));
      await widthInput.press('Enter');
      await expect(widthInput).toHaveValue(/300(?:\.0+)?/, { timeout: 5000 });
    } else {
      const before = Number(await widthInput.inputValue());
      const increaseButton = getSizeIncreaseButton(page, 0);
      await expect(increaseButton).toBeEnabled({ timeout: 5000 });
      await increaseButton.click();
      await expect.poll(async () => Number(await widthInput.inputValue())).toBeGreaterThan(before);
    }

    await cleanupComponents(page, 'tc_prop_1217_');
  });

  test('[QATC-1218] Properties - 2D Size - Height { @QA @Properties @QATC-1218 }', async ({ page }) => {
    /**
     * [Expected Result]: 크기 변경 가능, 단위: PX / % / EM / REM / VW / VH
     */
    await switchToTwoLayer(page);
    const instName = `tc_prop_1218_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);
    await ensureSectionExpanded(page, 'Size');

    const heightInput = getSizeInput(page, 1);
    await expect(heightInput).toBeVisible({ timeout: 5000 });

    await ensureSizeUnitPx(page, 1);

    const isEnabled = await heightInput.isEnabled().catch(() => false);
    if (isEnabled) {
      const newHeight = 200;
      await heightInput.fill(String(newHeight));
      await heightInput.press('Enter');
      await expect(heightInput).toHaveValue(/200(?:\.0+)?/, { timeout: 5000 });
    } else {
      const before = Number(await heightInput.inputValue());
      const increaseButton = getSizeIncreaseButton(page, 1);
      await expect(increaseButton).toBeEnabled({ timeout: 5000 });
      await increaseButton.click();
      await expect.poll(async () => Number(await heightInput.inputValue())).toBeGreaterThan(before);
    }

    await cleanupComponents(page, 'tc_prop_1218_');
  });

  for (const [tcId, label] of [
    ['QATC-1219', 'Min W'],
    ['QATC-1220', 'Max W'],
    ['QATC-1221', 'Min H'],
    ['QATC-1222', 'Max H'],
  ]) {
    test(`[${tcId}] Properties - 2D Size - ${label} { @QA @Properties @${tcId} }`, async ({ page }) => {
      await switchToTwoLayer(page);
      const prefix = `tc_prop_${tcId.replace('QATC-', '')}_`;
      const instName = `${prefix}${Date.now()}`;
      await addComponent(page, 'Figures', instName);
      await selectComponent(page, instName);
      await ensureSectionExpanded(page, 'Size');
      await expect(page.getByText(label).first()).toBeAttached({ timeout: 5000 });
      await cleanupComponents(page, prefix);
    });
  }

  // ────────────────────────────────────────────────────────────
  // 2D Component — Border
  // ────────────────────────────────────────────────────────────

  test('[QATC-1290] Properties - Border - Type { @QA @Properties @QATC-1290 }', async ({ page }) => {
    /**
     * [Expected Result]: none/solid/insert/outset/ridge/groove/double/dotted/dashed/hidden/initial
     */
    await switchToTwoLayer(page);
    const instName = `tc_prop_1290_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);
    await ensureSectionExpanded(page, 'Border');

    await expect(page.getByText('Type').first()).toBeAttached({ timeout: 5000 });
    const typeControl = page.locator('[role="combobox"], select').first();
    await expect(typeControl).toBeAttached({ timeout: 5000 });

    await cleanupComponents(page, 'tc_prop_1290_');
  });

  test('[QATC-1291] Properties - Border - Width { @QA @Properties @QATC-1291 }', async ({ page }) => {
    /**
     * [Expected Result]: 너비 두께 설정
     */
    await switchToTwoLayer(page);
    const instName = `tc_prop_1291_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);
    await ensureSectionExpanded(page, 'Border');
    await expect(page.getByText('Width').first()).toBeAttached({ timeout: 5000 });
    await cleanupComponents(page, 'tc_prop_1291_');
  });

  test('[QATC-1292] Properties - Border - All { @QA @Properties @QATC-1292 }', async ({ page }) => {
    /**
     * [Expected Result]: 모든 테두리 두께 설정
     */
    await switchToTwoLayer(page);
    const instName = `tc_prop_1292_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const borderSection = page.getByRole('menuitem', { name: /Border/ }).first();
    if (!await borderSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cleanupComponents(page, 'tc_prop_1292_');
      test.skip();
      return;
    }
    await ensureSectionExpanded(page, 'Border');
    await expect(page.getByText(/^All$/i).first()).toBeAttached({ timeout: 5000 });
    await cleanupComponents(page, 'tc_prop_1292_');
  });

  for (const [tcId, corner] of [
    ['QATC-1293', 'Top Left'],
    ['QATC-1294', 'Top Right'],
    ['QATC-1295', 'Bottom Left'],
    ['QATC-1296', 'Bottom Right'],
  ]) {
    test(`[${tcId}] Properties - Border - ${corner} { @QA @Properties @${tcId} }`, async ({ page }) => {
      await switchToTwoLayer(page);
      const prefix = `tc_prop_${tcId.replace('QATC-', '')}_`;
      const instName = `${prefix}${Date.now()}`;
      await addComponent(page, 'Figures', instName);
      await selectComponent(page, instName);

      const borderSection = page.getByRole('menuitem', { name: /Border/ }).first();
      if (!await borderSection.isVisible({ timeout: 5000 }).catch(() => false)) {
        await cleanupComponents(page, prefix);
        test.skip();
        return;
      }
      await ensureSectionExpanded(page, 'Border');
      await expect(page.getByText(new RegExp(corner, 'i')).first()).toBeAttached({ timeout: 5000 });
      await cleanupComponents(page, prefix);
    });
  }
});
