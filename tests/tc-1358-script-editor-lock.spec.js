const { test, expect } = require('@playwright/test');
const {
  ensureTestPage,
  goToEditor,
  addThreeBox,
  switchToThreeLayer,
} = require('./helpers/renobit');

test.setTimeout(60_000);

test.describe('TC-1358 Script Editor Lock (readOnly)', () => {
  const runId = Date.now().toString(36);
  const pageName = `tc-1358-script-${runId}`;

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    await ensureTestPage(page, pageName);
    await switchToThreeLayer(page);
  });

  /**
   * 컴포넌트 선택 후 스크립트 에디터 팝업을 연다.
   * 스크립트 에디터는 window.open(_blank) 팝업이므로 context.waitForEvent('page')로 잡아야 한다.
   */
  async function openScriptEditor(page, context, componentName) {
    // 컴포넌트 선택
    await page.evaluate((name) => {
      const comp = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
      if (!comp) throw new Error(`Component not found: ${name}`);
      window.wemb.editorFacade.sendNotification('command/newSelectedComponentInstance', comp);
    }, componentName);

    // 팝업 창 열기 대기
    const [scriptPage] = await Promise.all([
      context.waitForEvent('page'),
      page.evaluate(() => {
        window.wemb.editorFacade.sendNotification('command/showWScriptEditor');
      }),
    ]);

    await scriptPage.waitForLoadState('domcontentloaded');
    // lock-btn이 실제로 렌더링될 때까지 대기
    await scriptPage.waitForSelector('.script-edit-header .lock-btn', { timeout: 15_000 });
    return scriptPage;
  }

  test('TC-1358-01: Default lock state', async ({ page, context }) => {
    const boxName = `box_${runId}_01`;
    await addThreeBox(page, boxName, { x: 0, y: 0, z: 0 });

    const scriptPage = await openScriptEditor(page, context, boxName);
    const lockBtn = scriptPage.locator('.script-edit-header .lock-btn');

    // 기본 상태는 Locked
    await expect(lockBtn).toBeVisible();
    await expect(lockBtn).toContainText('Locked');
  });

  test('TC-1358-02: Unlock and re-lock', async ({ page, context }) => {
    const boxName = `box_${runId}_02`;
    await addThreeBox(page, boxName, { x: 0, y: 0, z: 0 });

    const scriptPage = await openScriptEditor(page, context, boxName);
    const lockBtn = scriptPage.locator('.script-edit-header .lock-btn');

    // Locked → Editing (잠금 해제)
    await lockBtn.click();
    await expect(lockBtn).toContainText('Editing');

    // Editing → Locked (재잠금)
    await lockBtn.click();
    await expect(lockBtn).toContainText('Locked');
  });

  test('TC-1358-03: Lock resets when switching instances', async ({ page, context }) => {
    const box1 = `box_1_${runId}`;
    const box2 = `box_2_${runId}`;
    await addThreeBox(page, box1, { x: -2, y: 0, z: 0 });
    await addThreeBox(page, box2, { x: 2, y: 0, z: 0 });

    // box1 선택 후 스크립트 에디터 열기
    const scriptPage = await openScriptEditor(page, context, box1);
    const lockBtn = scriptPage.locator('.script-edit-header .lock-btn');

    // box1 잠금 해제
    await lockBtn.click();
    await expect(lockBtn).toContainText('Editing');

    // 메인 에디터에서 box2로 전환 (NOTI_UPDATE_SELECTED_INFO → ScriptEditorWorker → popup 업데이트)
    await page.evaluate((name) => {
      const comp = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
      if (!comp) throw new Error(`Component not found: ${name}`);
      window.wemb.editorFacade.sendNotification('command/newSelectedComponentInstance', comp);
    }, box2);

    // 인스턴스 전환 시 Locked 상태로 초기화 확인
    await expect(lockBtn).toContainText('Locked', { timeout: 10_000 });
  });

  test('TC-1358-04: Shortcut keys and tooltip', async ({ page, context }) => {
    const boxName = `box_${runId}_04`;
    await addThreeBox(page, boxName, { x: 0, y: 0, z: 0 });

    const scriptPage = await openScriptEditor(page, context, boxName);
    const lockBtn = scriptPage.locator('.script-edit-header .lock-btn');
    await expect(lockBtn).toContainText('Locked');

    // Ctrl+Shift+U → 잠금 해제 (팝업 창에서 실행)
    await scriptPage.keyboard.press('Control+Shift+U');
    await expect(lockBtn).toContainText('Editing');

    // Ctrl+Shift+U → 재잠금
    await scriptPage.keyboard.press('Control+Shift+U');
    await expect(lockBtn).toContainText('Locked');

    // el-tooltip content="ctrl + shift + u" 확인
    await lockBtn.hover();
    const tooltip = scriptPage.locator('.el-tooltip__popper:visible');
    await expect(tooltip).toContainText(/ctrl \+ shift \+ u/i);
  });
});
