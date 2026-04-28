const { test, expect } = require('@playwright/test');
const {
  goToEditor,
  ensureTestPage,
  switchToThreeLayer,
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

function getLabelSection(page) {
  return page.getByRole('menuitem', { name: /^Label/ }).first();
}

function getLabelUseTextbox(page) {
  return getLabelSection(page).getByRole('textbox', { name: 'Select' }).first();
}

async function enableLabelUse(page) {
  const useTextbox = getLabelUseTextbox(page);
  await expect(useTextbox).toBeVisible({ timeout: 5000 });

  const currentValue = (await useTextbox.inputValue().catch(() => '')).trim().toUpperCase();
  if (currentValue === 'Y') return;

  await getLabelSection(page).locator('.el-select').first().click();
  const yesOption = page.locator('.el-select-dropdown:visible').getByText(/^Y$/i).first();
  await expect(yesOption).toBeVisible({ timeout: 5000 });
  await yesOption.click();
  await expect(useTextbox).toHaveValue(/Y/i, { timeout: 5000 });
}

test.describe('PROPERTIES - 3D Component Tests', () => {
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
  // 3D Component — Instance Name
  // ────────────────────────────────────────────────────────────

  test('[QATC-1299] Properties - 3D Instance Name { @QA @Properties @QATC-1299 }', async ({ page }) => {
    /**
     * [Expected Result]: 인스턴스 이름 노출
     */
    await switchToThreeLayer(page);
    const instName = `tc_prop_1299_${Date.now()}`;
    await addComponent(page, 'BoxComponent', instName);
    await selectComponent(page, instName);
    await ensureSectionExpanded(page, 'Instance Name');

    const nameFound = await page.evaluate(
      (name) => [...document.querySelectorAll('input')].some(el => el.value === name),
      instName
    );
    expect(nameFound).toBe(true);

    await cleanupComponents(page, 'tc_prop_1299_');
  });

  // ────────────────────────────────────────────────────────────
  // 3D Component — Label
  // ────────────────────────────────────────────────────────────

  test('[QATC-1301] Properties - Label - Use { @QA @Properties @QATC-1301 }', async ({ page }) => {
    /**
     * [Expected Result]: default 상태 N (비활성)
     */
    await switchToThreeLayer(page);
    const instName = `tc_prop_1301_${Date.now()}`;
    await addComponent(page, 'BoxComponent', instName);
    await selectComponent(page, instName);
    await ensureSectionExpanded(page, 'Label');

    await expect(page.getByText('Use').first()).toBeAttached({ timeout: 5000 });
    await expect(getLabelUseTextbox(page)).toHaveValue(/N/i, { timeout: 5000 });

    await cleanupComponents(page, 'tc_prop_1301_');
  });

  test('[QATC-1302] Properties - Label - Text { @QA @Properties @QATC-1302 }', async ({ page }) => {
    /**
     * [Expected Result]: 해당 3D 컴포넌트 설명 텍스트
     */
    await switchToThreeLayer(page);
    const instName = `tc_prop_1302_${Date.now()}`;
    await addComponent(page, 'BoxComponent', instName);
    await selectComponent(page, instName);
    await ensureSectionExpanded(page, 'Label');
    await enableLabelUse(page);
    await expect(page.getByText('Text').first()).toBeAttached({ timeout: 5000 });
    await cleanupComponents(page, 'tc_prop_1302_');
  });

  for (const [tcId, axis] of [
    ['QATC-1303', 'x'],
    ['QATC-1304', 'y'],
  ]) {
    test(`[${tcId}] Properties - Label - ${axis} { @QA @Properties @${tcId} }`, async ({ page }) => {
      await switchToThreeLayer(page);
      const prefix = `tc_prop_${tcId.replace('QATC-', '')}_`;
      const instName = `${prefix}${Date.now()}`;
      await addComponent(page, 'BoxComponent', instName);
      await selectComponent(page, instName);
      await ensureSectionExpanded(page, 'Label');
      await enableLabelUse(page);
      await expect(page.getByText(new RegExp(`^${axis}$`, 'i')).first()).toBeAttached({ timeout: 5000 });
      await cleanupComponents(page, prefix);
    });
  }

  for (const [tcId, desc] of [
    ['QATC-1306', 'Font Type'],
    ['QATC-1309', 'Font Size'],
    ['QATC-1311', 'Font Color'],
    ['QATC-1312', 'Border Size'],
    ['QATC-1314', 'Border Type'],
    ['QATC-1316', 'Border Color'],
    ['QATC-1317', 'bg Color'],
    ['QATC-1318', 'Alpha'],
    ['QATC-1320', 'Line Connect'],
  ]) {
    test(`[${tcId}] Properties - Label - ${desc} { @QA @Properties @${tcId} }`, async ({ page }) => {
      await switchToThreeLayer(page);
      const prefix = `tc_prop_${tcId.replace('QATC-', '')}_`;
      const instName = `${prefix}${Date.now()}`;
      await addComponent(page, 'BoxComponent', instName);
      await selectComponent(page, instName);
      await ensureSectionExpanded(page, 'Label');
      await enableLabelUse(page);

      const searchText = new RegExp(desc.replace(' ', '.{0,3}'), 'i');
      await expect(page.getByText(searchText).first()).toBeAttached({ timeout: 5000 });

      await cleanupComponents(page, prefix);
    });
  }
});
