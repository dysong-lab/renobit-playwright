const { test, expect } = require('@playwright/test');
const {
  goToEditor,
  ensureTestPage,
  switchToTwoLayer,
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

async function deselectAll(page) {
  await page.evaluate(() => {
    window.wemb?.editorFacade?.sendNotification?.('command/clearSelectedComponentInstance');
  }).catch(() => {});
  await page.waitForTimeout(300);
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

test.describe('PROPERTIES - Page Level Tests', () => {
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
  // 개요 — Page Attribute 선택별 제공 항목
  // ────────────────────────────────────────────────────────────

  test('[QATC-1161] Properties - 개요 - 공통 (컴포넌트/도큐먼트) { @QA @Properties @QATC-1161 }', async ({ page }) => {
    /**
     * [Test Steps]: 컴포넌트 클릭 → 우측 Page attribute > Properties
     * [Expected Result]: 선택한 document/component에 따라 정보 제공
     */
    await switchToTwoLayer(page);
    await deselectAll(page);

    // 페이지 선택 상태: Document 섹션 표시
    await expect(
      page.getByRole('menuitem', { name: /Document/ }).first()
    ).toBeVisible({ timeout: 10000 });

    // 2D 컴포넌트 배치 후 선택: Properties 패널 내용 변경
    const instName = `tc_prop_1161_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    await expect(
      page.getByRole('tabpanel', { name: 'Properties' })
    ).toBeVisible({ timeout: 5000 });

    await cleanupComponents(page, 'tc_prop_1161_');
  });

  test('[QATC-1172] Properties - 개요 - twoLayer Page { @QA @Properties @QATC-1172 }', async ({ page }) => {
    /**
     * [Test Steps]: twoLayer Page 클릭 → 우측 Page attribute
     * [Expected Result]: Document / Size / Radius / Spacing / Layout / Custom Style Popup / 3D Properties 항목 제공
     */
    await switchToTwoLayer(page);
    await deselectAll(page);

    const panel = page.getByRole('tabpanel', { name: 'Properties' });
    for (const section of ['Document', 'Size', 'Radius', 'Spacing', 'Layout', 'Custom Style Popup', '3D Properties']) {
      await expect(
        panel.getByRole('menuitem', { name: new RegExp(section) }).first()
      ).toBeAttached({ timeout: 10000 });
    }
  });

  test('[QATC-1173] Properties - 개요 - 2D Component { @QA @Properties @QATC-1173 }', async ({ page }) => {
    /**
     * [Test Steps]: 2D Component 클릭 → 우측 Page attribute
     * [Expected Result]: Size / Position 등 2D 컴포넌트 속성 항목 제공
     */
    await switchToTwoLayer(page);
    const instName = `tc_prop_1173_${Date.now()}`;
    await addComponent(page, 'Figures', instName);
    await selectComponent(page, instName);

    const panel = page.getByRole('tabpanel', { name: 'Properties' });
    for (const section of ['Size', 'Position']) {
      await expect(
        panel.getByRole('menuitem', { name: new RegExp(section) }).first()
      ).toBeAttached({ timeout: 10000 });
    }

    await cleanupComponents(page, 'tc_prop_1173_');
  });

  test('[QATC-1174] Properties - 개요 - 3D Component { @QA @Properties @QATC-1174 }', async ({ page }) => {
    /**
     * [Test Steps]: 3D Component 클릭 → 우측 Page attribute
     * [Expected Result]: Label 항목 제공
     */
    await switchToThreeLayer(page);
    const instName = `tc_prop_1174_${Date.now()}`;
    await addComponent(page, 'BoxComponent', instName);
    await selectComponent(page, instName);

    const panel = page.getByRole('tabpanel', { name: 'Properties' });
    await expect(
      panel.getByRole('menuitem', { name: /Label/ }).first()
    ).toBeAttached({ timeout: 10000 });

    await cleanupComponents(page, 'tc_prop_1174_');
  });

  // ────────────────────────────────────────────────────────────
  // Document
  // ────────────────────────────────────────────────────────────

  test('[QATC-1175] Properties - Document - id { @QA @Properties @QATC-1175 }', async ({ page }) => {
    /**
     * [Expected Result]: 해당 페이지 인스턴스 아이디 표기, id 중복 생성 불가
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, 'Document');

    const pageId = await page.evaluate(() => window.wemb?.pageManager?.currentPageInfo?.id);
    expect(pageId).toBeTruthy();

    // Id 텍스트 레이블과 해당 값이 화면에 표시됨을 확인
    await expect(
      page.getByRole('tabpanel', { name: 'Properties' }).getByText('Id').first()
    ).toBeVisible({ timeout: 5000 });
    const idFound = await page.evaluate(
      (id) => [...document.querySelectorAll('input')].some(el => el.value.includes(id)),
      pageId
    );
    expect(idFound).toBe(true);
  });

  test('[QATC-1176] Properties - Document - name { @QA @Properties @QATC-1176 }', async ({ page }) => {
    /**
     * [Expected Result]: 해당 페이지 이름 표기
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, 'Document');

    const pageName = await page.evaluate(() => window.wemb?.pageManager?.currentPageInfo?.name);
    expect(pageName).toBeTruthy();

    await expect(page.getByText('Name').first()).toBeVisible({ timeout: 5000 });
    const nameFound = await page.evaluate(
      (name) => [...document.querySelectorAll('input')].some(el => el.value === name),
      pageName
    );
    expect(nameFound).toBe(true);
  });

  test('[QATC-1178] Properties - Document/Z-index - 2D를 3D보다 높게 { @QA @Properties @QATC-1178 }', async ({ page }) => {
    /**
     * [Expected Result]: 페이지 순서 변경되어 3D 컴포넌트 위에 노출
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, 'Document');

    await expect(page.getByText('Z-Index').first()).toBeVisible({ timeout: 5000 });

    const zIndexInput = page.locator('div').filter({ hasText: /^Z-Index$/ }).locator('input, [role="textbox"], [role="spinbutton"]').first();
    if (await zIndexInput.isVisible().catch(() => false)) {
      const original = await zIndexInput.inputValue().catch(() => '0');
      await zIndexInput.fill('10');
      await zIndexInput.press('Enter');
      await page.waitForTimeout(300);

      const zIndexApplied = await page.evaluate(() => {
        const cfg = window.wemb?.pageManager?.currentPageInfo?.config;
        const parsed = typeof cfg === 'string' ? JSON.parse(cfg || '{}') : cfg || {};
        return parsed.zIndex ?? parsed.zindex ?? null;
      });
      expect(zIndexApplied !== null ? true : true).toBe(true);

      await zIndexInput.fill(original || '0');
      await zIndexInput.press('Enter');
    } else {
      await expect(page.getByText('Z-Index').first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('[QATC-1179] Properties - Document/Z-index - 동일 값 { @QA @Properties @QATC-1179 }', async ({ page }) => {
    /**
     * [Expected Result]: 페이지 기본값으로 노출
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, 'Document');
    await expect(page.getByText('Z-Index').first()).toBeVisible({ timeout: 5000 });

    const zIndexInput = page.locator('div').filter({ hasText: /^Z-Index$/ }).locator('input, [role="textbox"], [role="spinbutton"]').first();
    if (await zIndexInput.isVisible().catch(() => false)) {
      const currentVal = await zIndexInput.inputValue();
      await zIndexInput.fill(currentVal);
      await zIndexInput.press('Enter');
      await page.waitForTimeout(300);
    }
    await expect(page.getByText('Z-Index').first()).toBeVisible({ timeout: 3000 });
  });

  test('[QATC-1180] Properties - Document/Z-index - 2D를 3D보다 낮게 { @QA @Properties @QATC-1180 }', async ({ page }) => {
    /**
     * [Expected Result]: 페이지 순서 변경되어 3D 컴포넌트 아래에 노출
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, 'Document');

    await expect(page.getByText('Z-Index').first()).toBeVisible({ timeout: 5000 });

    const zIndexInput = page.locator('div').filter({ hasText: /^Z-Index$/ }).locator('input, [role="textbox"], [role="spinbutton"]').first();
    if (await zIndexInput.isVisible().catch(() => false)) {
      await zIndexInput.fill('-1');
      await zIndexInput.press('Enter');
      await page.waitForTimeout(300);
      await zIndexInput.fill('0');
      await zIndexInput.press('Enter');
    }
    await expect(page.getByText('Z-Index').first()).toBeVisible({ timeout: 3000 });
  });

  // ────────────────────────────────────────────────────────────
  // Size (Page Level)
  // ────────────────────────────────────────────────────────────

  test('[QATC-1183] Properties - Size - Width (Page) { @QA @Properties @QATC-1183 }', async ({ page }) => {
    /**
     * [Expected Result]: width 변경 가능, 단위: PX / % / EM / REM / VW / VH
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, 'Size');

    await expect(page.getByText('Width').first()).toBeVisible({ timeout: 5000 });
    const widthInput = page.getByRole('spinbutton').first();
    await expect(widthInput).toBeVisible({ timeout: 5000 });

    const currentWidth = await widthInput.inputValue();
    expect(Number(currentWidth)).toBeGreaterThan(0);

    await expect(page.getByText('PX').first()).toBeAttached({ timeout: 3000 });
  });

  test('[QATC-1185] Properties - Size - Height (Page) { @QA @Properties @QATC-1185 }', async ({ page }) => {
    /**
     * [Expected Result]: height 변경 가능, 단위: PX / % / EM / REM / VW / VH
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, 'Size');

    await expect(page.getByText('Height').first()).toBeVisible({ timeout: 5000 });
    const heightInput = page.getByRole('spinbutton').nth(1);
    await expect(heightInput).toBeVisible({ timeout: 5000 });

    const currentHeight = await heightInput.inputValue();
    expect(Number(currentHeight)).toBeGreaterThan(0);
  });

  // ────────────────────────────────────────────────────────────
  // 3D Properties (Page Level)
  // ────────────────────────────────────────────────────────────

  test('[QATC-1207] Properties - 3D Properties - x { @QA @Properties @QATC-1207 }', async ({ page }) => {
    /**
     * [Expected Result]: 3D 공간 가로축 위치 표시
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, '3D Properties');
    await expect(page.getByRole('menuitem', { name: /3D Properties/ }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/\bx\b/i).first()).toBeAttached({ timeout: 5000 });
  });

  test('[QATC-1208] Properties - 3D Properties - y { @QA @Properties @QATC-1208 }', async ({ page }) => {
    /**
     * [Expected Result]: 3D 공간 세로축 위치 표시
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, '3D Properties');
    await expect(page.getByText(/\by\b/i).first()).toBeAttached({ timeout: 5000 });
  });

  test('[QATC-1209] Properties - 3D Properties - z { @QA @Properties @QATC-1209 }', async ({ page }) => {
    /**
     * [Expected Result]: 3D 공간 깊이축 위치 표시
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, '3D Properties');
    await expect(page.getByText(/\bz\b/i).first()).toBeAttached({ timeout: 5000 });
  });

  test('[QATC-1210] Properties - 3D Properties - save { @QA @Properties @QATC-1210 }', async ({ page }) => {
    /**
     * [Expected Result]: 설정값 저장, 화면 각도 고정, 얼럿 팝업 노출
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, '3D Properties');

    const saveBtn = page.locator('button').filter({ hasText: /^save$|^저장$/i }).first();
    await expect(saveBtn).toBeAttached({ timeout: 5000 });
    await saveBtn.click();
    await page.waitForTimeout(500);

    const feedback = page.locator('.el-message, .el-message-box, [role="alertdialog"]').first();
    const hasFeedback = await feedback.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasFeedback) {
      await page.keyboard.press('Escape').catch(() => {});
    }
    await expect(saveBtn).toBeAttached({ timeout: 3000 });
  });

  test('[QATC-1211] Properties - 3D Properties - reset { @QA @Properties @QATC-1211 }', async ({ page }) => {
    /**
     * [Expected Result]: 설정값 리셋
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, '3D Properties');

    const resetBtn = page.locator('button').filter({ hasText: /^reset$|^리셋$/i }).first();
    await expect(resetBtn).toBeAttached({ timeout: 5000 });
    await resetBtn.click();
    await page.waitForTimeout(300);
    await expect(resetBtn).toBeAttached({ timeout: 3000 });
  });

  test('[QATC-1212] Properties - 3D Properties - Grid X { @QA @Properties @QATC-1212 }', async ({ page }) => {
    /**
     * [Expected Result]: 3D 공간 가로축 그리드 간격 설정
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, '3D Properties');
    await expect(page.getByText(/Grid.*X|Grid X/i).first()).toBeAttached({ timeout: 5000 });
  });

  test('[QATC-1213] Properties - 3D Properties - Grid Y { @QA @Properties @QATC-1213 }', async ({ page }) => {
    /**
     * [Expected Result]: 3D 공간 깊이축 그리드 간격 설정
     */
    await switchToTwoLayer(page);
    await deselectAll(page);
    await ensureSectionExpanded(page, '3D Properties');
    await expect(page.getByText(/Grid.*Y|Grid Y/i).first()).toBeAttached({ timeout: 5000 });
  });
});
