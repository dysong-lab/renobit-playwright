const { test, expect } = require('@playwright/test');
const {
  goToEditor,
  ensureTestPage,
  switchToTwoLayer,
  cleanupComponents,
} = require('../../helpers/renobit');

const TEST_PAGE = 'qa-properties-test-page';

async function openInstanceListPanel(page) {
  await page.evaluate(() => {
    const navbar = window.wemb?.viewComponentMap?.get('SideNavbarMediator');
    if (navbar) navbar.activeIndex = 'listbar-3';
  }).catch(() => {});
  await page.waitForTimeout(500);
}

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

async function selectComponentByApi(page, instanceName) {
  await page.evaluate((name) => {
    const inst =
      window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
      (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
    if (inst) window.wemb.editorFacade.sendNotification('command/newSelectedComponentInstance', inst);
  }, instanceName);
  await page.waitForTimeout(500);
}

// el-collapse 내부 실제 <tr> 타겟 (v-if="searchResult.length" 인 .instance-list 하위)
const INSTANCE_ROW = '.instance-list tr';

test.describe('INSTANCE LIST Tests', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    await ensureTestPage(page, TEST_PAGE);
    await page.evaluate(() => {
      const mpc = window.wemb?.mainPageComponent;
      if (!mpc) return;
      (mpc._comInstanceList || [])
        .filter(c => c.name?.startsWith('tc_inst_'))
        .forEach(c => window.wemb.editorFacade.sendNotification('command/removeComponentInstance', c));
    }).catch(() => {});
    await page.waitForTimeout(300);
  });

  // ────────────────────────────────────────────────────────────
  // 검색
  // ────────────────────────────────────────────────────────────

  test('[QATC-1523] Instance List - 검색 - 검색어 있음 { @QA @InstanceList @QATC-1523 }', async ({ page }) => {
    /**
     * [Test Steps]: 인스턴스 패널 클릭 → 컴포넌트 인스턴스명 입력
     * [Expected Result]: 입력한 검색어에 해당하는 컴포넌트가 검색됨
     */
    await switchToTwoLayer(page);
    const instName = `tc_inst_1523_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await openInstanceListPanel(page);

    const searchInput = page.getByPlaceholder('search keyword');
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill(instName);
    // @change 이벤트 기반 검색 — Enter로 트리거
    await searchInput.press('Enter');
    await page.waitForTimeout(300);

    // .instance-list tr 내 이름 셀이 보여야 함
    await expect(
      page.locator(INSTANCE_ROW).filter({ hasText: instName }).first()
    ).toBeVisible({ timeout: 5000 });

    await cleanupComponents(page, 'tc_inst_1523_');
  });

  test('[QATC-1524] Instance List - 검색 - 검색어 없음 { @QA @InstanceList @QATC-1524 }', async ({ page }) => {
    /**
     * [Test Steps]: 인스턴스 패널 클릭 → 존재하지 않는 인스턴스명 입력
     * [Expected Result]: 리스트 내 아무것도 노출되지 않음
     */
    await switchToTwoLayer(page);
    await openInstanceListPanel(page);

    const searchInput = page.getByPlaceholder('search keyword');
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    await searchInput.fill(`__no_match_${Date.now()}__`);
    // @change 이벤트 기반 검색 — Enter로 트리거
    await searchInput.press('Enter');
    await page.waitForTimeout(300);

    // searchResult.length === 0 이면 v-if로 .instance-list div 자체가 사라짐
    await expect(page.locator('.instance-list').first()).not.toBeVisible({ timeout: 3000 });
  });

  // ────────────────────────────────────────────────────────────
  // 선택 연동
  // ────────────────────────────────────────────────────────────

  test('[QATC-1525] Instance List - 선택 연동 - 인스턴스 리스트 → 에디터 영역 { @QA @InstanceList @QATC-1525 }', async ({ page }) => {
    /**
     * [Test Steps]: 인스턴스 패널 클릭 → 리스트에서 배치된 컴포넌트 항목 클릭
     * [Expected Result]: 에디터 영역에서 선택한 컴포넌트가 선택 상태로 표시됨
     */
    await switchToTwoLayer(page);
    const instName = `tc_inst_1525_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await openInstanceListPanel(page);

    // 이름 셀(<td @click>)을 클릭해야 onSelectedItem 트리거됨
    const nameCell = page.locator(`${INSTANCE_ROW} td`).filter({ hasText: instName }).first();
    await expect(nameCell).toBeVisible({ timeout: 5000 });
    await nameCell.click();
    await page.waitForTimeout(300);

    const isSelected = await page.evaluate((name) => {
      const selectedList =
        window.wemb?.editorProxy?._selectProxy?.currentPropertyManager?.getInstanceList?.() || [];
      return selectedList.some(s => s.name === name);
    }, instName);
    expect(isSelected).toBe(true);

    await cleanupComponents(page, 'tc_inst_1525_');
  });

  test('[QATC-1526] Instance List - 선택 연동 - 에디터 영역 → 인스턴스 리스트 { @QA @InstanceList @QATC-1526 }', async ({ page }) => {
    /**
     * [Test Steps]: 인스턴스 패널 클릭 → 에디터 영역에서 컴포넌트 클릭
     * [Expected Result]: 인스턴스 패널 리스트에 선택한 컴포넌트가 표시됨
     */
    await switchToTwoLayer(page);
    const instName = `tc_inst_1526_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await openInstanceListPanel(page);
    await selectComponentByApi(page, instName);

    // 에디터에서 선택 후 Instance List의 해당 row가 보여야 함
    await expect(
      page.locator(INSTANCE_ROW).filter({ hasText: instName }).first()
    ).toBeVisible({ timeout: 5000 });

    await cleanupComponents(page, 'tc_inst_1526_');
  });

  // ────────────────────────────────────────────────────────────
  // 아이콘
  // ────────────────────────────────────────────────────────────

  test('[QATC-1527] Instance List - 아이콘 - Visible (눈 아이콘) { @QA @InstanceList @QATC-1527 }', async ({ page }) => {
    /**
     * [Test Steps]: 인스턴스 패널 클릭 → 눈 모양 아이콘(view 버튼) 클릭
     * [Expected Result]: 에디터 영역에서 해당 컴포넌트가 보이지 않음
     */
    await switchToTwoLayer(page);
    const instName = `tc_inst_1527_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await openInstanceListPanel(page);

    const instRow = page.locator(INSTANCE_ROW).filter({ hasText: instName }).first();
    await expect(instRow).toBeVisible({ timeout: 5000 });

    // view 버튼은 <button class="icon icon-view"><i>view</i></button>
    const viewBtn = instRow.locator('button.icon-view');
    await expect(viewBtn).toBeVisible({ timeout: 3000 });
    await viewBtn.click();
    await page.waitForTimeout(300);

    // onSetEditModeVisible → setGroupPropertyValue(EDITOR_MODE, VISIBLE, false)
    // editorModeVisible 프로퍼티로 확인
    const isHidden = await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      return inst?.editorModeVisible === false;
    }, instName);
    expect(isHidden).toBe(true);

    await cleanupComponents(page, 'tc_inst_1527_');
  });

  test('[QATC-1528] Instance List - 아이콘 - Lock (자물쇠 아이콘) { @QA @InstanceList @QATC-1528 }', async ({ page }) => {
    /**
     * [Test Steps]: 인스턴스 패널 클릭 → 자물쇠 모양 아이콘(lock 버튼) 클릭
     * [Expected Result]: 컴포넌트 편집이 되지 않음 (lock: true)
     */
    await switchToTwoLayer(page);
    const instName = `tc_inst_1528_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await openInstanceListPanel(page);

    const instRow = page.locator(INSTANCE_ROW).filter({ hasText: instName }).first();
    await expect(instRow).toBeVisible({ timeout: 5000 });

    // lock 버튼은 <button class="icon icon-lock"><i>lock</i></button>
    const lockBtn = instRow.locator('button.icon-lock');
    await expect(lockBtn).toBeVisible({ timeout: 3000 });
    await lockBtn.click();
    await page.waitForTimeout(300);

    // onSetLock → component_instance.lock = !component_instance.lock
    const isLocked = await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      return inst?.lock === true;
    }, instName);
    expect(isLocked).toBe(true);

    await cleanupComponents(page, 'tc_inst_1528_');
  });
});
