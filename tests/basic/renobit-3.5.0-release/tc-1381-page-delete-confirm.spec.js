const { test, expect } = require('@playwright/test');
const {
  ensureTestPage,
  goToEditor,
} = require('../../helpers/renobit');

test.setTimeout(60_000);

// serial: 페이지를 공유하며 순서대로 실행, 마지막 테스트에서 실제 삭제
test.describe.serial('TC-1381 Page Delete Confirmation', () => {
  const runId = Date.now().toString(36);
  const pageName = `tc-1381-delete-${runId}`;

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    await ensureTestPage(page, pageName);
  });

  /**
   * jstree 컨텍스트메뉴는 DOM 우클릭 후 vakata 메뉴를 통해 열린다.
   * page.click('right')가 불안정하므로 editorFacade로 직접 트리거한다.
   */
  async function triggerDeleteAction(page, targetPageName) {
    // treeData에 페이지가 등록될 때까지 대기 (treeData 항목 페이지명 필드는 'text')
    await page.waitForFunction(
      (name) => (window.wemb?.pageTreeDataManager?.treeData || []).some((item) => item.text === name),
      targetPageName,
      { timeout: 15_000 }
    );

    // jstree에서 해당 페이지 노드를 선택 후 onDeleteTreeItems 호출
    await page.evaluate((name) => {
      const treeData = window.wemb?.pageTreeDataManager?.treeData || [];
      const found = treeData.find((item) => item.text === name);
      if (!found) throw new Error(`Page not found in tree: ${name}`);

      const tree = $('#page-tree').jstree(true);
      tree.deselect_all(true);
      tree.select_node(found.id);
    }, targetPageName);

    // jstree가 선택 반영할 시간 확보 후 삭제 커맨드 실행
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/deletePageTreeItems');
    });
  }

  // El-MessageBox $prompt 입력창: .el-message-box__input input
  // El-MessageBox 확인 버튼: .el-message-box__btns .el-button--primary
  // El-MessageBox 취소 버튼: .el-message-box__btns .el-button:not(.el-button--primary)

  test('TC-1381-02: Validation', async ({ page }) => {
    await triggerDeleteAction(page, pageName);

    const promptInput = page.locator('.el-message-box__input input');
    await expect(promptInput).toBeVisible({ timeout: 10_000 });
    const confirmBtn = page.locator('.el-message-box__btns .el-button--primary');
    const errorMsg = page.locator('.el-message-box__errormsg');

    // 1. lowercase
    await promptInput.fill('delete');
    await confirmBtn.click();
    await expect(errorMsg).toBeVisible();

    // 2. mixed case
    await promptInput.fill('Delete');
    await confirmBtn.click();
    await expect(errorMsg).toBeVisible();

    // 3. leading space
    await promptInput.fill(' DELETE');
    await confirmBtn.click();
    await expect(errorMsg).toBeVisible();

    // 4. empty
    await promptInput.fill('');
    await confirmBtn.click();
    await expect(errorMsg).toBeVisible();

    // 다이얼로그 닫기 (다음 테스트를 위해 상태 유지)
    await page.locator('.el-message-box__btns .el-button:not(.el-button--primary)').click();
  });

  // jstree는 state 플러그인으로 노드가 CSS hidden 상태일 수 있어
  // DOM visibility 대신 pageTreeDataManager.treeData로 페이지 존재 확인
  async function assertPageExistsInTree(page, name) {
    const exists = await page.evaluate(
      (n) => (window.wemb?.pageTreeDataManager?.treeData || []).some((item) => item.text === n),
      name
    );
    expect(exists, `Page "${name}" should still exist in treeData`).toBeTruthy();
  }

  test('TC-1381-03: Cancel Actions', async ({ page }) => {
    const cancelBtn = page.locator('.el-message-box__btns .el-button:not(.el-button--primary)');
    const promptInput = page.locator('.el-message-box__input input');

    // 1. Stage 1에서 취소
    await triggerDeleteAction(page, pageName);
    await expect(promptInput).toBeVisible({ timeout: 10_000 });
    await cancelBtn.click();
    await assertPageExistsInTree(page, pageName);

    // 2. Stage 1 통과 후 Stage 2에서 취소
    await triggerDeleteAction(page, pageName);
    await expect(promptInput).toBeVisible({ timeout: 10_000 });
    await promptInput.fill('DELETE');
    await page.locator('.el-message-box__btns .el-button--primary').click();

    // 2단계 confirm 다이얼로그 등장 후 취소
    const stage2Cancel = page.locator('.el-message-box__btns .el-button:not(.el-button--primary)');
    await expect(stage2Cancel).toBeVisible({ timeout: 10_000 });
    await stage2Cancel.click();
    await assertPageExistsInTree(page, pageName);

    // 3. ESC로 Stage 1 취소
    await triggerDeleteAction(page, pageName);
    await expect(promptInput).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press('Escape');
    await assertPageExistsInTree(page, pageName);
  });

  test('TC-1381-04: Multi-language Support', async ({ page }) => {
    const promptInput = page.locator('.el-message-box__input input');
    const confirmBtn = page.locator('.el-message-box__btns .el-button--primary');
    const errorMsg = page.locator('.el-message-box__errormsg');

    const changeLang = async (lang) => {
      await page.evaluate((l) => {
        if (window.wemb?.vueRoot) {
          window.wemb.vueRoot.$i18n.locale = l;
        } else {
          localStorage.setItem('lang', l);
        }
      }, lang);
      await page.waitForTimeout(300);
    };

    // en-US: "Please type DELETE to confirm."
    await changeLang('en-US');
    await triggerDeleteAction(page, pageName);
    await expect(promptInput).toBeVisible({ timeout: 10_000 });
    await promptInput.fill('delete');
    await confirmBtn.click();
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('DELETE');
    await page.locator('.el-message-box__btns .el-button:not(.el-button--primary)').click();

    // zh-CN: "请输入 DELETE 以确认。"
    await changeLang('zh-CN');
    await triggerDeleteAction(page, pageName);
    await expect(promptInput).toBeVisible({ timeout: 10_000 });
    await promptInput.fill('delete');
    await confirmBtn.click();
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('DELETE');
    await page.locator('.el-message-box__btns .el-button:not(.el-button--primary)').click();

    // zh-TW: "請輸入 DELETE 以確認。"
    await changeLang('zh-TW');
    await triggerDeleteAction(page, pageName);
    await expect(promptInput).toBeVisible({ timeout: 10_000 });
    await promptInput.fill('delete');
    await confirmBtn.click();
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('DELETE');
    await page.locator('.el-message-box__btns .el-button:not(.el-button--primary)').click();

    // 복원
    await changeLang('ko-KR');
  });

  // 마지막 테스트: 실제 삭제 수행
  test('TC-1381-01: Normal Delete Flow', async ({ page }) => {
    await triggerDeleteAction(page, pageName);

    const promptInput = page.locator('.el-message-box__input input');
    await expect(promptInput).toBeVisible({ timeout: 10_000 });

    // Stage 1: DELETE 입력 후 확인
    await promptInput.fill('DELETE');
    await page.locator('.el-message-box__btns .el-button--primary').click();

    // Stage 2: 최종 확인 (confirmButtonText = locale_msg.common.delete = '삭제')
    const stage2Confirm = page.locator('.el-message-box__btns .el-button--primary');
    await expect(stage2Confirm).toBeVisible({ timeout: 10_000 });
    await stage2Confirm.click();

    // 성공 메시지 확인
    await expect(page.locator('.el-message--success')).toBeVisible({ timeout: 10_000 });

    // 트리에서 페이지 사라짐 확인
    await page.waitForFunction(
      (name) => !window.wemb?.pageTreeDataManager?.treeData?.some((item) => item.name === name),
      pageName,
      { timeout: 10_000 }
    );
  });
});
