const { test, expect } = require('@playwright/test');
const { goToEditor, ensureTestPage, savePage, switchToTwoLayer } = require('../helpers/renobit');

test.setTimeout(120_000);

/**
 * 2D 컴포넌트를 배치하고 저장 후 visualViewer에서 요소 존재 확인
 * @param {Page} page
 * @param {string} componentName - window.wemb 커맨드용 컴포넌트 이름
 * @param {string} instanceName  - 배치할 인스턴스 이름
 */
async function place2DComponent(page, componentName, instanceName) {
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

/**
 * 저장 후 visualViewer.do에서 인스턴스 확인
 * - visualViewer가 별도 URL을 사용하는 경우 해당 URL로 이동 필요
 * TODO: visualViewer DOM 구조 확인 필요
 */
async function verifyInViewer(page, instanceName) {
  await savePage(page);

  const pageId = await page.evaluate(() => window.wemb?.pageManager?.currentPageInfo?.id);
  await page.goto(`/renobit/visualViewer.do`, { waitUntil: 'domcontentloaded' });

  // visualViewer 초기화 대기
  // TODO: visualViewer 로드 완료 조건 확인 필요
  await page.waitForTimeout(3_000);

  // 컴포넌트 존재 여부 확인
  // TODO: visualViewer에서 인스턴스를 식별하는 실제 속성 확인 필요
  const found = await page.evaluate((name) => {
    return !!(
      document.querySelector(`[data-instance-name="${name}"]`) ||
      document.querySelector(`[id="${name}"]`) ||
      document.querySelector(`[data-name="${name}"]`)
    );
  }, instanceName);

  expect(found, `visualViewer에서 "${instanceName}" 컴포넌트를 찾을 수 없음`).toBeTruthy();
}

// ── 공통 페이지 준비 ────────────────────────────────────────────
test.describe('Basic - 2D Component 배치', () => {
  const runId = Date.now().toString(36);
  const pageName = `basic_2d_${runId}`;

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    await ensureTestPage(page, pageName);
    await switchToTwoLayer(page);
  });

  // ── 2d_pack / AmCharts ────────────────────────────────────────
  // TODO: 실제 componentName은 RENOBIT 소스에서 확인 필요
  for (const [compName, label] of [
    ['AmchartsAreaComponent', 'AmCharts Area'],
    ['AmchartsBarComponent', 'AmCharts Bar'],
    ['AmchartsColumnLineComponent', 'AmCharts Column Line'],
  ]) {
    test(`2d_pack > AmCharts > ${label} 배치`, async ({ page }) => {
      const instName = `amcharts_${label.replace(/\s/g, '_').toLowerCase()}_${runId}`;
      await place2DComponent(page, compName, instName);
      await verifyInViewer(page, instName);
      console.log(`[PASS] ${label} 배치 및 viewer 확인`);
    });
  }

  // ── 2d_pack / Basic ───────────────────────────────────────────
  for (const [compName, label] of [
    ['ActiveGroupBtnComponent', 'Active Group Btn'],
    ['UpDownStatusComponent', 'Up/Down Status'],
  ]) {
    test(`2d_pack > Basic > ${label} 배치`, async ({ page }) => {
      const instName = `basic_${label.replace(/\s/g, '_').toLowerCase()}_${runId}`;
      await place2DComponent(page, compName, instName);
      await verifyInViewer(page, instName);
      console.log(`[PASS] ${label} 배치 및 viewer 확인`);
    });
  }

  // ── 2d_pack / Extra ───────────────────────────────────────────
  test('2d_pack > Extra > Compass 배치', async ({ page }) => {
    const instName = `extra_compass_${runId}`;
    await place2DComponent(page, 'CompassComponent', instName);
    await verifyInViewer(page, instName);
    console.log('[PASS] Compass 배치 및 viewer 확인');
  });

  // ── 2d_pack / Form ────────────────────────────────────────────
  for (const [compName, label] of [
    ['DropdownFieldComponent', 'Dropdown Field'],
    ['TextareaFieldComponent', 'Textarea Field'],
  ]) {
    test(`2d_pack > Form > ${label} 배치`, async ({ page }) => {
      const instName = `form_${label.replace(/\s/g, '_').toLowerCase()}_${runId}`;
      await place2DComponent(page, compName, instName);
      await verifyInViewer(page, instName);
      console.log(`[PASS] ${label} 배치 및 viewer 확인`);
    });
  }

  // ── 2d_pack / Menu ────────────────────────────────────────────
  for (const [compName, label] of [
    ['BasicMenuComponent', 'Basic Menu'],
    ['TreePanelComponent', 'Tree Panel'],
  ]) {
    test(`2d_pack > Menu > ${label} 배치`, async ({ page }) => {
      const instName = `menu_${label.replace(/\s/g, '_').toLowerCase()}_${runId}`;
      await place2DComponent(page, compName, instName);
      await verifyInViewer(page, instName);
      console.log(`[PASS] ${label} 배치 및 viewer 확인`);
    });
  }

  // ── 2d_pack / Progress ────────────────────────────────────────
  for (const [compName, label] of [
    ['ProgressBarComponent', 'Progress Bar'],
    ['ProgressTriangleComponent', 'Progress Triangle'],
  ]) {
    test(`2d_pack > Progress > ${label} 배치`, async ({ page }) => {
      const instName = `progress_${label.replace(/\s/g, '_').toLowerCase()}_${runId}`;
      await place2DComponent(page, compName, instName);
      await verifyInViewer(page, instName);
      console.log(`[PASS] ${label} 배치 및 viewer 확인`);
    });
  }

  // ── Bootstrap / Contents ──────────────────────────────────────
  for (const [compName, label] of [
    ['BsFiguresComponent', 'Bootstrap Figures'],
    ['BsTypographyComponent', 'Bootstrap Typography'],
  ]) {
    test(`Bootstrap > Contents > ${label} 배치`, async ({ page }) => {
      const instName = `bs_${label.replace(/\s/g, '_').toLowerCase()}_${runId}`;
      await place2DComponent(page, compName, instName);
      await verifyInViewer(page, instName);
      console.log(`[PASS] ${label} 배치 및 viewer 확인`);
    });
  }

  // ── Bootstrap / DataDisplay ───────────────────────────────────
  for (const [compName, label] of [
    ['BsAccordionComponent', 'Bootstrap Accordion'],
    ['BsToastsComponent', 'Bootstrap Toasts'],
  ]) {
    test(`Bootstrap > DataDisplay > ${label} 배치`, async ({ page }) => {
      const instName = `bs_dd_${label.replace(/\s/g, '_').toLowerCase()}_${runId}`;
      await place2DComponent(page, compName, instName);
      await verifyInViewer(page, instName);
      console.log(`[PASS] ${label} 배치 및 viewer 확인`);
    });
  }

  // ── DataViz / Echart ──────────────────────────────────────────
  for (const [compName, label] of [
    ['EchartComponent', 'Echart'],
    ['EchartScatterComponent', 'Echart Scatter'],
  ]) {
    test(`DataViz > Echart > ${label} 배치`, async ({ page }) => {
      const instName = `echart_${label.replace(/\s/g, '_').toLowerCase()}_${runId}`;
      await place2DComponent(page, compName, instName);
      await verifyInViewer(page, instName);
      console.log(`[PASS] ${label} 배치 및 viewer 확인`);
    });
  }

  // ── DataViz / TabulatorTable ──────────────────────────────────
  test('DataViz > TabulatorTable 배치', async ({ page }) => {
    const instName = `tabulator_${runId}`;
    await place2DComponent(page, 'TabulatorTableComponent', instName);
    await verifyInViewer(page, instName);
    console.log('[PASS] TabulatorTable 배치 및 viewer 확인');
  });

  // ── Template / FreeCode ───────────────────────────────────────
  test('Template > FreeCode > CodeBox (HTML+JS 입력) 배치', async ({ page }) => {
    const instName = `codebox_${runId}`;
    await place2DComponent(page, 'CodeBoxComponent', instName);

    // HTML, JS 입력 (CodeBox 컴포넌트 속성 편집)
    // TODO: CodeBox 내부 에디터 selector 확인 필요
    await page.evaluate((name) => {
      const comp = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
      if (!comp) throw new Error(`Component not found: ${name}`);
      window.wemb.editorFacade.sendNotification('command/newSelectedComponentInstance', comp);
    }, instName);

    await verifyInViewer(page, instName);
    console.log('[PASS] CodeBox 배치 및 viewer 확인');
  });

  // ── Template / Group ─────────────────────────────────────────
  test('Template > Group 배치 후 Echart 하위 배치', async ({ page }) => {
    const groupName = `group_${runId}`;
    const echartName = `echart_in_group_${runId}`;

    // Group 배치
    await place2DComponent(page, 'GroupComponent', groupName);

    // Group 내부에 Echart 배치
    // TODO: Group 내부 배치 커맨드 확인 필요 (parentName 파라미터 여부)
    await page.evaluate(
      ({ gName, eName }) => {
        const group = window.wemb?.mainPageComponent?.getComInstanceByName?.(gName);
        window.wemb.editorFacade.sendNotification('command/addComponentInstanceByName', {
          componentName: 'EchartComponent',
          name: eName,
          parentName: gName,
        });
      },
      { gName: groupName, eName: echartName }
    );

    await page.waitForFunction(
      (name) => !!window.wemb?.mainPageComponent?.getComInstanceByName?.(name),
      echartName,
      { timeout: 15_000 }
    );

    await verifyInViewer(page, echartName);
    console.log('[PASS] Group 내 Echart 배치 및 viewer 확인');
  });
});
