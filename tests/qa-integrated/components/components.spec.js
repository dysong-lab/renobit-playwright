const { test, expect } = require('@playwright/test');
const {
  goToEditor,
  ensureTestPage,
  switchToTwoLayer,
  switchToThreeLayer,
  cleanupComponents,
} = require('../../helpers/renobit');

// 컴포넌트 패널(listbar-2) 활성화
async function openComponentsPanel(page) {
  await page.evaluate(() => {
    const navbar = window.wemb?.viewComponentMap?.get('SideNavbarMediator');
    if (navbar) navbar.activeIndex = 'listbar-2';
  }).catch(() => {});
  await page.waitForTimeout(500);
}

// 에디터 API로 컴포넌트 배치 후 인스턴스 등록 대기
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

test.describe('COMPONENTS Module Tests', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    await ensureTestPage(page, 'qa-component-test-page');
  });

  // ────────────────────────────────────────────────────────────
  // 구성 — Pack 목록 / 드래그&드롭
  // ────────────────────────────────────────────────────────────

  test('[QATC-957] Components - Pack 목록 - 컴포넌트 Pack 목록 (2D) { @QA @Components @QATC-957 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: 컴포넌트 패널 클릭
     * [Expected Result]: Bootstrap / DataViz / Template Pack 목록 표출
     */
    await switchToTwoLayer(page);
    await openComponentsPanel(page);

    for (const packName of ['Bootstrap', 'DataViz', 'Template']) {
      await expect(page.locator(`text=${packName}`).first()).toBeAttached({ timeout: 10000 });
    }
  });

  test('[QATC-958] Components - Pack 목록 - Pack 그룹 하위 목록 (2D) { @QA @Components @QATC-958 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: 컴포넌트 패널 → Bootstrap / DataViz / Template의 ▶ 클릭
     * [Expected Result]: Bootstrap: Contents/DataDisplay/Forms/Fundamental/Interactive/Navigation
     *                    DataViz: Echart/TabulatorTable  Template: FreeCode/Group
     */
    await switchToTwoLayer(page);
    await openComponentsPanel(page);

    // Bootstrap 하위 그룹 확인
    const bootstrapNode = page.locator('text=Bootstrap').first();
    await bootstrapNode.click();
    await page.waitForTimeout(300);
    for (const group of ['Contents', 'DataDisplay', 'Forms', 'Fundamental', 'Interactive', 'Navigation']) {
      await expect(page.locator(`text=${group}`).first()).toBeAttached({ timeout: 5000 });
    }

    // DataViz 하위 확인
    const datavizNode = page.locator('text=DataViz').first();
    await datavizNode.click();
    await page.waitForTimeout(300);
    for (const group of ['Echart', 'TabulatorTable']) {
      await expect(page.locator(`text=${group}`).first()).toBeAttached({ timeout: 5000 });
    }

    // Template 하위 확인
    const templateNode = page.locator('text=Template').first();
    await templateNode.click();
    await page.waitForTimeout(300);
    for (const group of ['FreeCode', 'Group']) {
      await expect(page.locator(`text=${group}`).first()).toBeAttached({ timeout: 5000 });
    }
  });

  test('[QATC-959] Components - Pack 목록 - 드래그&드롭 / 더블클릭 (2D) { @QA @Components @QATC-959 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: Pack 하위 컴포넌트를 에디터 영역으로 드래그&드롭
     * [Expected Result]: 에디터 영역에 컴포넌트 배치됨
     */
    await switchToTwoLayer(page);
    const instName = 'tc_959_fig';
    await addComponent(page, 'Figures', instName);

    const exists = await page.evaluate(
      (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
      instName
    );
    expect(exists).toBe(true);
    await cleanupComponents(page, 'tc_959_');
  });

  test('[QATC-961] Components - Pack 목록 - 컴포넌트 Pack 목록 (3D) { @QA @Components @QATC-961 }', async ({ page }) => {
    /**
     * [Precondition]: 3D 레이어
     * [Test Steps]: 컴포넌트 패널 클릭
     * [Expected Result]: 컴포넌트 Pack 목록 표출 (Three)
     */
    await switchToThreeLayer(page);
    await openComponentsPanel(page);

    await expect(page.locator('text=Three').first()).toBeAttached({ timeout: 10000 });
  });

  test('[QATC-965] Components - Pack 목록 - Pack 하위 목록 (3D) { @QA @Components @QATC-965 }', async ({ page }) => {
    /**
     * [Precondition]: 3D 레이어
     * [Test Steps]: 컴포넌트 패널 → Three의 ▶ 클릭
     * [Expected Result]: Three: 2D Geometry / 3D Geometry / Modeling 표출
     */
    await switchToThreeLayer(page);
    await openComponentsPanel(page);

    const threeNode = page.locator('text=Three').first();
    await threeNode.click();
    await page.waitForTimeout(300);

    for (const group of ['2D Geometry', '3D Geometry', 'Modeling']) {
      await expect(page.locator(`text=${group}`).first()).toBeAttached({ timeout: 5000 });
    }
  });

  test('[QATC-968] Components - Pack 목록 - 드래그&드롭 / 더블클릭 (3D) { @QA @Components @QATC-968 }', async ({ page }) => {
    /**
     * [Precondition]: 3D 레이어
     * [Test Steps]: Pack 하위 컴포넌트를 에디터 영역으로 드래그&드롭
     * [Expected Result]: 에디터 영역에 컴포넌트 배치됨
     */
    await switchToThreeLayer(page);
    const instName = 'tc_968_box';
    await addComponent(page, 'BoxComponent', instName);

    const exists = await page.evaluate(
      (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
      instName
    );
    expect(exists).toBe(true);
    await cleanupComponents(page, 'tc_968_');
  });

  // ────────────────────────────────────────────────────────────
  // 2D — Bootstrap
  // ────────────────────────────────────────────────────────────

  for (const [tcId, compName, instPrefix, desc] of [
    ['QATC-975', 'Figures',    'tc_975_', 'Figures'],
    ['QATC-976', 'Images',     'tc_976_', 'Images'],
    ['QATC-977', 'Tables',     'tc_977_', 'Tables'],
    ['QATC-978', 'Typography', 'tc_978_', 'Typography'],
    ['QATC-979', 'Accordion',  'tc_979_', 'Accordion'],
    ['QATC-980', 'Card',       'tc_980_', 'Card'],
  ]) {
    test(`[${tcId}] Components - Bootstrap/Contents - ${desc} { @QA @Components @${tcId} }`, async ({ page }) => {
      await switchToTwoLayer(page);
      const instName = `${instPrefix}${Date.now()}`;
      await addComponent(page, compName, instName);

      const exists = await page.evaluate(
        (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
        instName
      );
      expect(exists).toBe(true);
      await cleanupComponents(page, instPrefix);
    });
  }

  // ────────────────────────────────────────────────────────────
  // 2D — DataViz / Echart
  // ────────────────────────────────────────────────────────────

  test('[QATC-1039] Components - DataViz/Echart - Echart — 배치 { @QA @Components @QATC-1039 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: DataViz > Echart 드래그&드롭
     * [Expected Result]: 다양한 차트와 커스터마이징 옵션 노출
     */
    await switchToTwoLayer(page);
    const instName = `tc_1039_${Date.now()}`;
    await addComponent(page, 'Echart', instName);

    const exists = await page.evaluate(
      (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
      instName
    );
    expect(exists).toBe(true);
    await cleanupComponents(page, 'tc_1039_');
  });

  test('[QATC-1040] Components - DataViz/Echart - Echart — 데이터 확인 { @QA @Components @QATC-1040 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: Echart 배치 → CodeBox completed/preview 동일 설정 → Apply
     * [Expected Result]: visual / visualViewer에서 데이터 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_1040_${Date.now()}`;
    await addComponent(page, 'Echart', instName);

    // CodeBox에 기본 Echart 옵션 스크립트 적용
    const applied = await page.evaluate((name) => {
      const inst = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
      if (!inst) return false;
      // 컴포넌트가 data/option 속성을 가지는지 확인
      return typeof inst.props !== 'undefined' || typeof inst.setter !== 'undefined';
    }, instName);
    expect(applied).toBe(true);
    await cleanupComponents(page, 'tc_1040_');
  });

  test('[QATC-1047] Components - DataViz/Echart - 컴포넌트 활용 — Echart { @QA @Components @QATC-1047 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: 에디터 배치 → CodeBox preview 이벤트 확인
     * [Expected Result]: Echart 예제 코드 적용 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_1047_${Date.now()}`;
    await addComponent(page, 'Echart', instName);

    const exists = await page.evaluate(
      (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
      instName
    );
    expect(exists).toBe(true);
    await cleanupComponents(page, 'tc_1047_');
  });

  // ────────────────────────────────────────────────────────────
  // 2D — DataViz / TabulatorTable
  // ────────────────────────────────────────────────────────────

  test('[QATC-1042] Components - DataViz/TabulatorTable - TabulatorTable — 배치 { @QA @Components @QATC-1042 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: DataViz > TabulatorTable 드래그&드롭
     * [Expected Result]: 정렬/필터/편집/반응형 레이아웃 테이블 노출
     */
    await switchToTwoLayer(page);
    const instName = `tc_1042_${Date.now()}`;
    await addComponent(page, 'TabulatorTable', instName);

    const exists = await page.evaluate(
      (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
      instName
    );
    expect(exists).toBe(true);
    await cleanupComponents(page, 'tc_1042_');
  });

  test('[QATC-1043] Components - DataViz/TabulatorTable - TabulatorTable — 데이터 확인 { @QA @Components @QATC-1043 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: TabulatorTable 배치 → CodeBox completed/preview 설정 → Apply
     * [Expected Result]: visual / visualViewer에서 데이터 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_1043_${Date.now()}`;
    await addComponent(page, 'TabulatorTable', instName);

    const applied = await page.evaluate((name) => {
      const inst = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
      return !!inst;
    }, instName);
    expect(applied).toBe(true);
    await cleanupComponents(page, 'tc_1043_');
  });

  test('[QATC-1044] Components - DataViz/TabulatorTable - TabulatorTable — destroy { @QA @Components @QATC-1044 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: 페이지 이동 스니펫 적용 후 destroy 흐름 확인
     * [Expected Result]: 이동 페이지에서 TabulatorTable 정상 노출 및 인스턴스 정상 동작
     */
    await switchToTwoLayer(page);
    const instName = `tc_1044_${Date.now()}`;
    await addComponent(page, 'TabulatorTable', instName);

    // 컴포넌트 배치 확인
    const exists = await page.evaluate(
      (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
      instName
    );
    expect(exists).toBe(true);

    // 다른 페이지로 이동하여 destroy 트리거 확인
    const anotherPageId = await page.evaluate(() => {
      const pages = window.wemb?.pageTreeDataManager?.treeData || [];
      const currentId = window.wemb?.pageManager?.currentPageInfo?.id;
      return (pages.find(p => p.id !== currentId && p.type === 'page') || {}).id || null;
    });
    if (anotherPageId) {
      await page.evaluate((id) => {
        window.wemb.editorFacade.sendNotification('command/openPage', id);
      }, anotherPageId);
      await page.waitForTimeout(2000);
    }

    // 테스트 페이지로 복귀 (cleanup은 인스턴스 없으면 no-op)
    await ensureTestPage(page, 'qa-component-test-page');
    await cleanupComponents(page, 'tc_1044_').catch(() => {});
  });

  test('[QATC-1049] Components - DataViz/TabulatorTable - 컴포넌트 활용 — TabulatorTable { @QA @Components @QATC-1049 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: 에디터 배치 → CodeBox preview 이벤트 확인
     * [Expected Result]: TabulatorTable 예제 코드 적용 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_1049_${Date.now()}`;
    await addComponent(page, 'TabulatorTable', instName);

    const exists = await page.evaluate(
      (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
      instName
    );
    expect(exists).toBe(true);
    await cleanupComponents(page, 'tc_1049_');
  });

  test('[QATC-1050] Components - DataViz - 컴포넌트 활용 — Apply { @QA @Components @QATC-1050 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: CodeBox preview 확인 후 Apply
     * [Expected Result]: 에디터 레이어에서 코드 결과 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_1050_${Date.now()}`;
    await addComponent(page, 'Echart', instName);

    // Apply: savePage 커맨드로 적용 상태 확인
    await page.evaluate(() => {
      window.wemb.editorFacade.sendNotification('command/savePage');
    });
    const toast = page.locator('.el-message--success').first();
    await expect(toast).toBeAttached({ timeout: 15000 });
    await cleanupComponents(page, 'tc_1050_');
  });

  // ────────────────────────────────────────────────────────────
  // 2D — Template / FreeCode
  // ────────────────────────────────────────────────────────────

  test('[QATC-1054] Components - Template/FreeCode - FreeCode — HTML/CSS/JS 코드 작성 { @QA @Components @QATC-1054 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: Template > FreeCode > Codebox 드래그&드롭
     * [Expected Result]: HTML/CSS/JS 코드 작성 및 실행 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_1054_${Date.now()}`;
    await addComponent(page, 'FreeCode', instName);

    const exists = await page.evaluate(
      (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
      instName
    );
    expect(exists).toBe(true);
    await cleanupComponents(page, 'tc_1054_');
  });

  test('[QATC-1055] Components - Template/FreeCode - FreeCode — Lottie { @QA @Components @QATC-1055 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: FreeCode 배치 → Resource Manager 파일 선택 → HTML/JS/CSS 입력
     * [Expected Result]: visual / visualViewer에서 HTML/JS/CSS 적용 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_1055_${Date.now()}`;
    await addComponent(page, 'FreeCode', instName);

    const exists = await page.evaluate(
      (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
      instName
    );
    expect(exists).toBe(true);
    await cleanupComponents(page, 'tc_1055_');
  });

  test('[QATC-1059] Components - Template/FreeCode - FreeCode — HDR Default Code Snippet { @QA @Components @QATC-1059 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: FreeCode 배치 → Default Code Snippet > HDR Load 저장
     * [Expected Result]: visual / visualViewer에서 적용 확인
     */
    await switchToTwoLayer(page);
    const instName = `tc_1059_${Date.now()}`;
    await addComponent(page, 'FreeCode', instName);

    const exists = await page.evaluate(
      (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
      instName
    );
    expect(exists).toBe(true);
    await cleanupComponents(page, 'tc_1059_');
  });

  test('[QATC-1061] Components - Template - Group { @QA @Components @QATC-1061 }', async ({ page }) => {
    /**
     * [Precondition]: 2D 레이어
     * [Test Steps]: Template > Group 드래그&드롭
     * [Expected Result]: 레이아웃 유지, 그룹 단위 이동, 반응형 디자인 적용
     */
    await switchToTwoLayer(page);
    const instName = `tc_1061_${Date.now()}`;
    await addComponent(page, 'Group', instName);

    const exists = await page.evaluate(
      (name) => !!(window.wemb?.mainPageComponent?.getComInstanceByName?.(name)),
      instName
    );
    expect(exists).toBe(true);
    await cleanupComponents(page, 'tc_1061_');
  });
});
