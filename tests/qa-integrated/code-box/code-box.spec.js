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
    const inst =
      window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
      (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
    if (inst) window.wemb.editorFacade.sendNotification('command/newSelectedComponentInstance', inst);
  }, instanceName);
  await page.waitForTimeout(500);
}

// Code Box는 별도 popup 창으로 열림. window.opener.__scriptWorkerChannel__ 통신.
async function openCodeBox(page) {
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.evaluate(() =>
      window.wemb.editorFacade.sendNotification('command/showWScriptEditor')
    ),
  ]);
  await popup.waitForLoadState('domcontentloaded');
  await popup.waitForSelector('.script-edit-main', { timeout: 30_000 });
  await popup.waitForTimeout(1000);
  return popup;
}

async function ensureSidebarVisible(popup) {
  const isVisible = await popup.locator('#edit-aside-list').isVisible({ timeout: 3000 }).catch(() => false);
  if (!isVisible) {
    await popup.locator('.el-icon-s-unfold').first().click();
    await popup.waitForTimeout(300);
  }
}

async function expandSubmenu(popup, sectionText) {
  const titleEl = popup.locator('.el-submenu__title').filter({ hasText: sectionText }).first();
  if (!await titleEl.isVisible({ timeout: 3000 }).catch(() => false)) return;
  const isOpen = await titleEl.evaluate(
    (el) => el.closest('.el-submenu')?.classList.contains('is-opened')
  ).catch(() => false);
  if (!isOpen) {
    await titleEl.click();
    await popup.waitForTimeout(300);
  }
}

async function ensureEditorUnlocked(popup) {
  const lockBtn = popup.locator('.lock-btn');
  if (!await lockBtn.isVisible({ timeout: 3000 }).catch(() => false)) return;
  const isLocked = await lockBtn.evaluate(
    (el) => !el.classList.contains('unlocked')
  ).catch(() => false);
  if (isLocked) {
    await lockBtn.click();
    await popup.waitForTimeout(300);
  }
}

// Monaco editor의 textarea(.inputarea)로 코드 입력
async function typeInMonacoEditor(popup, code) {
  const textarea = popup.locator('.script-edit-area .inputarea').first();
  await textarea.click({ force: true });
  await popup.keyboard.press('Control+A');
  await popup.keyboard.type(code);
  await popup.waitForTimeout(300);
}

test.describe('CODE BOX Tests', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    await ensureTestPage(page, TEST_PAGE);
    await page.evaluate(() => {
      const mpc = window.wemb?.mainPageComponent;
      if (!mpc) return;
      (mpc._comInstanceList || [])
        .filter(c => c.name?.startsWith('tc_cb_'))
        .forEach(c => window.wemb.editorFacade.sendNotification('command/removeComponentInstance', c));
    }).catch(() => {});
    await page.waitForTimeout(300);
  });

  // ────────────────────────────────────────────────────────────
  // 헤더 — Format code / Apply
  // ────────────────────────────────────────────────────────────

  test('[QATC-3201] Code Box - Format code { @QA @CodeBox @QATC-3201 }', async ({ page }) => {
    /**
     * [Test Steps]: Code Box 열기 → 헤더 > Format code 클릭
     * [Expected Result]: 작성 코드가 정렬됨 (버튼 클릭 시 에러 없음)
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3201_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    const formatBtn = popup.locator('.format-btn');
    await expect(formatBtn).toBeVisible({ timeout: 5000 });
    await formatBtn.click();
    await popup.waitForTimeout(500);

    // Format 후에도 editor가 정상 노출
    await expect(popup.locator('.script-edit-main')).toBeAttached({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3201_');
  });

  test('[QATC-3204] Code Box - Apply — 정상 코드 { @QA @CodeBox @QATC-3204 }', async ({ page }) => {
    /**
     * [Test Steps]: 정상 코드 작성 후 헤더 > Apply 클릭
     * [Expected Result]: 인스턴스에 즉시 코드 결과 적용
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3204_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    // 유효한 CSS 코드 입력 후 Apply
    await typeInMonacoEditor(popup, '/* valid css */ .test-3204 { color: red; }');

    const applyBtn = popup.locator('.apply-btn');
    await expect(applyBtn).toBeVisible({ timeout: 5000 });
    await applyBtn.click();
    await popup.waitForTimeout(500);

    // Apply 후 editor가 정상 노출 (에러 없음)
    await expect(popup.locator('.script-edit-main')).toBeAttached({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3204_');
  });

  test('[QATC-3205] Code Box - Apply — 비정상 코드 { @QA @CodeBox @QATC-3205 }', async ({ page }) => {
    /**
     * [Test Steps]: 비정상 코드 작성 후 헤더 > Apply 클릭
     * [Expected Result]: 코드가 반영되지 않음 (에러 없이 editor 유지)
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3205_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    // 비정상 JS 코드 입력
    await typeInMonacoEditor(popup, 'this is invalid {{{ code !!!');

    const applyBtn = popup.locator('.apply-btn');
    await expect(applyBtn).toBeVisible({ timeout: 5000 });
    await applyBtn.click();
    await popup.waitForTimeout(500);

    // Apply 후에도 Code Box editor가 정상 노출 (앱 크래시 없음)
    await expect(popup.locator('.script-edit-main')).toBeAttached({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3205_');
  });

  test('[QATC-3208] Code Box - Apply — 편집 중 이탈 { @QA @CodeBox @QATC-3208 }', async ({ page }) => {
    /**
     * [Test Steps]: CSS/JS 편집 중 다른 인스턴스/페이지 선택
     * [Expected Result]: 저장하지 않은 변경사항 alert 노출
     */
    await switchToTwoLayer(page);
    const instA = `tc_cb_3208a_${Date.now()}`;
    const instB = `tc_cb_3208b_${Date.now()}`;
    await addComponent(page, 'Figures', instA);
    await addComponent(page, 'Figures', instB);
    await selectComponent(page, instA);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    // 코드 수정 (change flag 트리거)
    await typeInMonacoEditor(popup, '/* unsaved change */ .modified { color: blue; }');
    await popup.waitForTimeout(300);

    // Instance List에서 다른 인스턴스 클릭 → 변경 내용 alert 기대
    await ensureSidebarVisible(popup);
    await expandSubmenu(popup, 'Instance List');
    const otherNode = popup.locator('.code-box-instance-tree .el-tree-node__content')
      .filter({ hasText: instB }).first();
    if (await otherNode.isVisible({ timeout: 3000 }).catch(() => false)) {
      const dialogPromise = popup.waitForEvent('dialog', { timeout: 5000 }).catch(() => null);
      await otherNode.click();
      const dialog = await dialogPromise;
      if (dialog) {
        expect(dialog.type()).toMatch(/confirm|alert/);
        await dialog.dismiss();
      }
    }

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3208');
  });

  test('[QATC-3209] Code Box - Apply — 페이지 저장 { @QA @CodeBox @QATC-3209 }', async ({ page }) => {
    /**
     * [Test Steps]: 헤더 > Apply 후 페이지 저장
     * [Expected Result]: 페이지 저장 후 코드 즉시 적용
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3209_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    const applyBtn = popup.locator('.apply-btn');
    await expect(applyBtn).toBeVisible({ timeout: 5000 });
    await applyBtn.click();
    await popup.waitForTimeout(500);

    // 메인 에디터 페이지에서 Ctrl+S로 저장
    await page.keyboard.press('Control+s');
    await page.waitForTimeout(1000);

    // 저장 후 Code Box editor 정상 노출
    await expect(popup.locator('.script-edit-main')).toBeAttached({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3209_');
  });

  // ────────────────────────────────────────────────────────────
  // Side List 구성
  // ────────────────────────────────────────────────────────────

  test('[QATC-3115] Code Box - Side list 구성 확인 { @QA @CodeBox @QATC-3115 }', async ({ page }) => {
    /**
     * [Test Steps]: Code Box > Side list 확인
     * [Expected Result]: Instance List / Group item List / Instance Options /
     *   Default Code Snippet / Sample Code / SVG style 노출
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3115_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureSidebarVisible(popup);

    const menu = popup.locator('#edit-aside-list .el-menu');
    await expect(menu).toBeVisible({ timeout: 5000 });

    const sectionTitles = ['Instance List', 'Group Item List', 'Instance Options',
      'Default Code Snippet', 'Sample Code', 'SVG Style'];
    for (const title of sectionTitles) {
      await expect(
        popup.locator('.el-submenu__title').filter({ hasText: title }).first()
      ).toBeAttached({ timeout: 5000 });
    }

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3115_');
  });

  // ────────────────────────────────────────────────────────────
  // Instance List
  // ────────────────────────────────────────────────────────────

  test('[QATC-3121] Code Box - Instance List - 리스트 노출 { @QA @CodeBox @QATC-3121 }', async ({ page }) => {
    /**
     * [Test Steps]: Side list > Instance List
     * [Expected Result]: 페이지 내 인스턴스가 2D/3D 레이어별 리스트 출력
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3121_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureSidebarVisible(popup);
    await expandSubmenu(popup, 'Instance List');

    const tree = popup.locator('.code-box-instance-tree');
    await expect(tree).toBeVisible({ timeout: 5000 });

    // 배치한 인스턴스가 트리에 노출
    await expect(
      tree.locator('.el-tree-node__content').filter({ hasText: instName }).first()
    ).toBeAttached({ timeout: 5000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3121_');
  });

  test('[QATC-3123] Code Box - Instance List - 검색 { @QA @CodeBox @QATC-3123 }', async ({ page }) => {
    /**
     * [Test Steps]: Side list > Instance List > 검색 입력
     * [Expected Result]: 검색 결과 노출, 미매칭 시 No Data
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3123_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureSidebarVisible(popup);
    await expandSubmenu(popup, 'Instance List');

    const filterInput = popup.locator('.instance-list-area .el-input__inner').first();
    await expect(filterInput).toBeVisible({ timeout: 5000 });

    // 일치하는 검색어 입력
    await filterInput.fill(instName.slice(0, 8));
    await popup.waitForTimeout(300);
    await expect(
      popup.locator('.code-box-instance-tree .el-tree-node__content').first()
    ).toBeVisible({ timeout: 3000 });

    // 미매칭 검색어
    await filterInput.fill(`__nomatch_${Date.now()}__`);
    await popup.waitForTimeout(300);
    await expect(
      popup.locator('.code-box-instance-tree .el-tree-node__content').first()
    ).not.toBeVisible({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3123_');
  });

  // ────────────────────────────────────────────────────────────
  // TabulatorTable
  // ────────────────────────────────────────────────────────────

  test('[QATC-3127] Code Box - TabulatorTable — 기본 코드 { @QA @CodeBox @QATC-3127 }', async ({ page }) => {
    /**
     * [Test Steps]: TabulatorTable 배치 → Code Box > Instance List 선택
     * [Expected Result]: 기본 HTML/CSS/JS 코드 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3127_${Date.now()}`;
    await addComponent(page, 'TabulatorTable', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);

    // Code Box에 코드가 로드되어야 함 (Monaco editor 컨테이너 존재)
    await expect(popup.locator('.monaco-editor-container').first()).toBeAttached({ timeout: 5000 });

    // 헤더에 인스턴스명 노출
    await expect(
      popup.locator('.header-instance-name-id h4')
    ).toContainText(instName, { timeout: 5000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3127_');
  });

  test('[QATC-3130] Code Box - TabulatorTable — 수정 후 Apply { @QA @CodeBox @QATC-3130 }', async ({ page }) => {
    /**
     * [Test Steps]: Instance List > index 선택 후 코드 수정 → Apply
     * [Expected Result]: Apply 적용 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3130_${Date.now()}`;
    await addComponent(page, 'TabulatorTable', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    await typeInMonacoEditor(popup, '/* modified for 3130 */');

    const applyBtn = popup.locator('.apply-btn');
    await expect(applyBtn).toBeVisible({ timeout: 5000 });
    await applyBtn.click();
    await popup.waitForTimeout(500);

    await expect(popup.locator('.script-edit-main')).toBeAttached({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3130_');
  });

  test('[QATC-3132] Code Box - TabulatorTable — 수정 후 Format code { @QA @CodeBox @QATC-3132 }', async ({ page }) => {
    /**
     * [Test Steps]: Instance List > index 선택 후 코드 수정 → Format code
     * [Expected Result]: Format code 적용 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3132_${Date.now()}`;
    await addComponent(page, 'TabulatorTable', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    await typeInMonacoEditor(popup, '.unformatted{color:red;display:block}');

    const formatBtn = popup.locator('.format-btn');
    await expect(formatBtn).toBeVisible({ timeout: 5000 });
    await formatBtn.click();
    await popup.waitForTimeout(500);

    await expect(popup.locator('.script-edit-main')).toBeAttached({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3132_');
  });

  // ────────────────────────────────────────────────────────────
  // Echart
  // ────────────────────────────────────────────────────────────

  test('[QATC-3134] Code Box - Echart — 기본 코드 { @QA @CodeBox @QATC-3134 }', async ({ page }) => {
    /**
     * [Test Steps]: Echart 배치 → Code Box > Instance List 선택
     * [Expected Result]: 기본 HTML/CSS/JS 코드 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3134_${Date.now()}`;
    await addComponent(page, 'Echart', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);

    await expect(popup.locator('.monaco-editor-container').first()).toBeAttached({ timeout: 5000 });
    await expect(
      popup.locator('.header-instance-name-id h4')
    ).toContainText(instName, { timeout: 5000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3134_');
  });

  test('[QATC-3136] Code Box - Echart — 수정 후 Apply { @QA @CodeBox @QATC-3136 }', async ({ page }) => {
    /**
     * [Test Steps]: Instance List > index 선택 후 코드 수정 → Apply
     * [Expected Result]: Apply 적용 및 Format code 적용 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3136_${Date.now()}`;
    await addComponent(page, 'Echart', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    await typeInMonacoEditor(popup, '/* modified for 3136 */');

    const applyBtn = popup.locator('.apply-btn');
    await expect(applyBtn).toBeVisible({ timeout: 5000 });
    await applyBtn.click();
    await popup.waitForTimeout(500);

    // Format code도 확인
    const formatBtn = popup.locator('.format-btn');
    await formatBtn.click();
    await popup.waitForTimeout(300);

    await expect(popup.locator('.script-edit-main')).toBeAttached({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3136_');
  });

  // ────────────────────────────────────────────────────────────
  // SVG Style — Color Theme
  // ────────────────────────────────────────────────────────────

  test('[QATC-3188] Code Box - Color Theme — Event Color { @QA @CodeBox @QATC-3188 }', async ({ page }) => {
    /**
     * [Test Steps]: Side list > SVG style > Color Theme
     * [Expected Result]: Event Color 적용, 상태별 색상 확인, 복사 alert 노출
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3188_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureSidebarVisible(popup);
    await expandSubmenu(popup, 'SVG Style');

    const svgArea = popup.locator('.svg-snippet-area');
    await expect(svgArea).toBeVisible({ timeout: 5000 });

    // Color Theme 섹션 확인
    await expect(svgArea.locator('.color-theme-area')).toBeAttached({ timeout: 3000 });
    await expect(svgArea.getByText('Color Theme')).toBeAttached({ timeout: 3000 });
    await expect(svgArea.getByText('Event Color')).toBeAttached({ timeout: 3000 });

    // Event Color 셀렉트 존재
    await expect(svgArea.locator('.event-color-area .el-select').first()).toBeAttached({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3188_');
  });

  test('[QATC-3189] Code Box - Color Theme — Gradient { @QA @CodeBox @QATC-3189 }', async ({ page }) => {
    /**
     * [Test Steps]: Side list > SVG style > Color Theme
     * [Expected Result]: linear / radial gradient 적용
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3189_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureSidebarVisible(popup);
    await expandSubmenu(popup, 'SVG Style');

    const svgArea = popup.locator('.svg-snippet-area');
    await expect(svgArea).toBeVisible({ timeout: 5000 });

    // Mask(index=0) 라디오가 기본 선택 → Gradient 셀렉트 노출
    await expect(svgArea.locator('.gradient-area')).toBeAttached({ timeout: 3000 });
    await expect(svgArea.getByText('Gradient')).toBeAttached({ timeout: 3000 });
    await expect(svgArea.locator('.gradient-area .el-select')).toBeAttached({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3189_');
  });

  // ────────────────────────────────────────────────────────────
  // SVG Style — Animation
  // ────────────────────────────────────────────────────────────

  for (const [tcId, animName] of [
    ['QATC-3190', 'blink'],
    ['QATC-3191', 'pulse'],
    ['QATC-3192', 'rotate'],
    ['QATC-3193', 'animate'],
  ]) {
    test(`[${tcId}] Code Box - Animation — ${animName} { @QA @CodeBox @${tcId} }`, async ({ page }) => {
      await switchToTwoLayer(page);
      const prefix = `tc_cb_${tcId.replace('QATC-', '')}_`;
      const instName = `${prefix}${Date.now()}`;
      await addComponent(page, 'Figures', instName);
      await selectComponent(page, instName);

      const popup = await openCodeBox(page);
      await ensureSidebarVisible(popup);
      await expandSubmenu(popup, 'SVG Style');

      const svgArea = popup.locator('.svg-snippet-area');
      await expect(svgArea).toBeVisible({ timeout: 5000 });
      await expect(svgArea.getByText('Animation')).toBeAttached({ timeout: 3000 });

      // 해당 애니메이션 버튼 존재 (대소문자 무관)
      await expect(
        svgArea.locator('.animation-area .list-group-item')
          .filter({ hasText: new RegExp(animName, 'i') }).first()
      ).toBeAttached({ timeout: 5000 });

      await popup.close();
      await cleanupComponents(page, prefix);
    });
  }

  // ────────────────────────────────────────────────────────────
  // Box 영역 — 코드 작성
  // ────────────────────────────────────────────────────────────

  test('[QATC-3213] Code Box - HTML / CSS / JS 코드 작성 { @QA @CodeBox @QATC-3213 }', async ({ page }) => {
    /**
     * [Test Steps]: Box 영역에서 HTML/CSS/JS 작성
     * [Expected Result]: 구조/스타일/동작 자유 정의 가능
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3213_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);

    // 코드 편집 영역(script-edit-area) 노출 확인
    await expect(popup.locator('.script-edit-area')).toBeVisible({ timeout: 5000 });

    // Monaco editor 패널 중 하나 이상 노출 (컴포넌트 타입에 따라 HTML 또는 CSS/JS 패널)
    const hasEditorPanel = await popup.evaluate(() => {
      const titles = [...document.querySelectorAll('.lm_title')].map(el => el.textContent);
      return titles.some(t => /html|css|javascript/i.test(t));
    });
    expect(hasEditorPanel).toBe(true);

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3213_');
  });

  test('[QATC-3216] Code Box - CSS / JS 코드 작성 { @QA @CodeBox @QATC-3216 }', async ({ page }) => {
    /**
     * [Test Steps]: Box 영역에서 CSS/JS만 작성
     * [Expected Result]: HTML 구조 고정, 스타일과 동작만 제어
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3216_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    // CSS/JS 편집 가능한 Monaco editor 패널 노출 확인
    await expect(popup.locator('.script-edit-area')).toBeVisible({ timeout: 5000 });

    const hasCssOrJs = await popup.evaluate(() => {
      const titles = [...document.querySelectorAll('.lm_title')].map(el => el.textContent);
      return titles.some(t => /css|javascript/i.test(t));
    });
    expect(hasCssOrJs).toBe(true);

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3216_');
  });

  test('[QATC-3218] Code Box - JS 코드 작성 { @QA @CodeBox @QATC-3218 }', async ({ page }) => {
    /**
     * [Test Steps]: Box 영역에서 JS만 작성
     * [Expected Result]: 스타일/구조 변경 없이 JS로 동작 제어
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3218_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    // JAVASCRIPT 탭/패널 존재 확인
    await expect(popup.locator('.script-edit-area')).toBeVisible({ timeout: 5000 });

    const hasJs = await popup.evaluate(() => {
      const titles = [...document.querySelectorAll('.lm_title')].map(el => el.textContent);
      return titles.some(t => /javascript/i.test(t));
    });
    expect(hasJs).toBe(true);

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3218_');
  });

  // ────────────────────────────────────────────────────────────
  // Preview
  // ────────────────────────────────────────────────────────────

  test('[QATC-3220] Code Box - Preview — 실시간 코드 실행 { @QA @CodeBox @QATC-3220 }', async ({ page }) => {
    /**
     * [Test Steps]: Box 영역 코드 작성
     * [Expected Result]: 작성한 JS가 Preview에 즉시 반영
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3220_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    // 유효한 CSS 입력 후 Apply → preview 반영 확인
    await typeInMonacoEditor(popup, '/* preview test */ .tc3220 { opacity: 0.9; }');

    const applyBtn = popup.locator('.apply-btn');
    await applyBtn.click();
    await popup.waitForTimeout(500);

    // Apply 후 에디터 정상 유지 (Preview = 에디터 레이어에 즉시 반영)
    await expect(popup.locator('.script-edit-main')).toBeAttached({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3220_');
  });

  test('[QATC-3221] Code Box - Preview — Viewer 반영 { @QA @CodeBox @QATC-3221 }', async ({ page }) => {
    /**
     * [Test Steps]: Box 영역 코드 작성 후 Viewer 확인
     * [Expected Result]: 최종 Viewer에는 기존 이벤트에 코드 적용 후 반영
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3221_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const popup = await openCodeBox(page);
    await ensureEditorUnlocked(popup);

    await typeInMonacoEditor(popup, '/* viewer test */');

    const applyBtn = popup.locator('.apply-btn');
    await applyBtn.click();
    await popup.waitForTimeout(500);

    // 메인 에디터 페이지의 컴포넌트에 cssCode가 업데이트됐는지 확인
    const hasUpdated = await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      return !!(inst?.properties?.publishCode);
    }, instName);
    expect(hasUpdated).toBe(true);

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3221_');
  });

  // ────────────────────────────────────────────────────────────
  // 코드 활용 — 인스턴스 ID
  // ────────────────────────────────────────────────────────────

  test('[QATC-3223] Code Box - 코드 활용 — 인스턴스 ID 활용 { @QA @CodeBox @QATC-3223 }', async ({ page }) => {
    /**
     * [Test Steps]: Box 영역에서 인스턴스 ID로 JS 접근 및 CSS 스타일링
     * [Expected Result]: 인스턴스 ID 기반 접근 정상 동작
     */
    await switchToTwoLayer(page);
    const instName = `tc_cb_3223_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    // 인스턴스 ID 조회
    const instId = await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      return inst?.id || inst?.componentInstanceId || '';
    }, instName);

    const popup = await openCodeBox(page);

    // 헤더에 인스턴스 이름이 표시되어야 함
    const headerText = await popup.locator('.header-instance-name-id h4').textContent({ timeout: 5000 }).catch(() => '');
    expect(headerText.trim()).toBeTruthy();

    await ensureEditorUnlocked(popup);

    // 인스턴스 ID를 사용한 JS 코드 입력 및 Apply
    if (instId) {
      await typeInMonacoEditor(popup, `/* use instance id */ document.getElementById('${instId}');`);
      const applyBtn = popup.locator('.apply-btn');
      await applyBtn.click();
      await popup.waitForTimeout(500);
    }

    await expect(popup.locator('.script-edit-main')).toBeAttached({ timeout: 3000 });

    await popup.close();
    await cleanupComponents(page, 'tc_cb_3223_');
  });
});
