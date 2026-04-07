const { test, expect } = require('@playwright/test');

const {
  ensureEditorSession,
  ensureTestPage,
  switchToTwoLayer,
} = require('../../helpers/renobit');
const { attachTcMeta } = require('./_tc-meta');

test.setTimeout(120_000);

/**
 * RENOBIT에 등록된 2D 컴포넌트 이름 목록을 반환한다.
 * 컴포넌트명이 맞지 않을 때 진단용으로 사용한다.
 */
async function getAvailableComponentNames(page) {
  return page.evaluate(() => {
    // RENOBIT 컴포넌트 레지스트리 접근 경로 (실제 경로 확인 필요)
    const registry =
      window.wemb?.componentManager?.componentList ||
      window.wemb?.componentRegistry ||
      window.wemb?.editorProxy?._componentList ||
      window.wemb?.mainPageComponent?._componentList;

    if (!registry) return null;

    if (Array.isArray(registry)) {
      return registry.map((c) => c.name || c.componentName || c);
    }
    if (typeof registry === 'object') {
      return Object.keys(registry);
    }
    return null;
  });
}

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

  const found = await expect
    .poll(
      async () =>
        page.evaluate(
          (name) => !!window.wemb?.mainPageComponent?.getComInstanceByName?.(name),
          instanceName
        ),
      { timeout: 15_000 }
    )
    .toBeTruthy()
    .catch(async (err) => {
      // 실패 시 실제 등록된 컴포넌트 이름 목록을 출력해 디버깅에 활용
      const available = await getAvailableComponentNames(page);
      if (available) {
        console.error(
          `[컴포넌트 이름 불일치] "${componentName}" 을 찾을 수 없음.\n` +
            `사용 가능한 컴포넌트 이름:\n${available.join('\n')}`
        );
      } else {
        console.error(
          `[컴포넌트 이름 불일치] "${componentName}" 을 찾을 수 없음. ` +
            `(레지스트리 접근 경로를 getAvailableComponentNames에서 확인 필요)`
        );
      }
      throw err;
    });
}

const ACTIVE_COMPONENT_CASES = [
  { id: 'TC-R35-CM-001', category: '2d_pack > AmCharts', componentName: 'AreaChartComponent', title: 'AmCharts Area 배치' },
  { id: 'TC-R35-CM-002', category: '2d_pack > AmCharts', componentName: 'ComboChartComponent', title: 'AmCharts Column Line 배치' },
  { id: 'TC-R35-CM-003', category: '2d_pack > Basic', componentName: 'ActiveGroupButtonComponent', title: 'Active Group Btn 배치' },
  { id: 'TC-R35-CM-004', category: '2d_pack > Basic', componentName: 'UpDownStatusComponent', title: 'Up/Down Status 배치' },
  { id: 'TC-R35-CM-005', category: '2d_pack > Extra', componentName: 'CompassComponent', title: 'Compass 배치' },
  { id: 'TC-R35-CM-006', category: '2d_pack > Form', componentName: 'DropdownFieldComponent', title: 'Dropdown Field 배치' },
  { id: 'TC-R35-CM-007', category: '2d_pack > Form', componentName: 'TextAreaFieldComponent', title: 'Textarea Field 배치' },
  { id: 'TC-R35-CM-008', category: '2d_pack > Menu', componentName: 'MenuComponent', title: 'Basic Menu 배치' },
  { id: 'TC-R35-CM-009', category: '2d_pack > Menu', componentName: 'TreeMenuComponent', title: 'Tree Panel 배치' },
  { id: 'TC-R35-CM-010', category: '2d_pack > Progress', componentName: 'BarProgressComponent', title: 'Progress Bar 배치' },
  { id: 'TC-R35-CM-011', category: '2d_pack > Progress', componentName: 'TriangleProgressComponent', title: 'Progress Triangle 배치' },
  { id: 'TC-R35-CM-012', category: 'Bootstrap > Contents', componentName: 'Figures', title: 'Figures 배치' },
  { id: 'TC-R35-CM-013', category: 'Bootstrap > Contents', componentName: 'Typography', title: 'Typography 배치' },
  { id: 'TC-R35-CM-014', category: 'Bootstrap > DataDisplay', componentName: 'Accordion', title: 'Accordion 배치' },
  { id: 'TC-R35-CM-015', category: 'Bootstrap > DataDisplay', componentName: 'Toasts', title: 'Toasts 배치' },
  { id: 'TC-R35-CM-016', category: 'DataViz > Echart', componentName: 'Echart', title: 'Echart 배치' },
  { id: 'TC-R35-CM-017', category: 'DataViz > Echart', componentName: 'EchartScatter', title: 'Echart Scatter 배치' },
  { id: 'TC-R35-CM-018', category: 'DataViz > TabulatorTable', componentName: 'TabulatorTable', title: 'TabulatorTable 배치' },
  { id: 'TC-R35-CM-019', category: 'Template > Group', componentName: 'Group', title: 'Group 배치' },
];

const PENDING_COMPONENT_CASES = [
  { id: 'TC-R35-CM-020', title: '2d_pack > Network Service 하위 배치', detail: 'Network005, Network007' },
  { id: 'TC-R35-CM-021', title: '2d_pack > Numeric 하위 배치', detail: 'Numeric001 ~ Numerical Circle' },
  { id: 'TC-R35-CM-022', title: '2d_pack > Sprite 하위 배치', detail: 'Create Sprite Clip ~ Sprite006' },
  { id: 'TC-R35-CM-023', title: '2d_pack > State 하위 배치', detail: 'Create State Clip ~ State029' },
  { id: 'TC-R35-CM-024', title: 'Bootstrap > Forms 하위 배치', detail: 'Check & Radios ~ Select' },
  { id: 'TC-R35-CM-025', title: 'Bootstrap > Fundamental 하위 배치', detail: 'Badge ~ Spinners' },
  { id: 'TC-R35-CM-026', title: 'Bootstrap > Interactive 하위 배치', detail: 'Alerts ~ Tooltips' },
  { id: 'TC-R35-CM-027', title: 'Bootstrap > Navigation 하위 배치', detail: 'Breadcrumb ~ Scrollspy' },
  { id: 'TC-R35-CM-028', title: '2D Properties > Active Group Btn 수정', detail: 'Size, Position, Transform, Layout, FlexItem, Spacing, Label, Background, Border, Font-Type' },
  { id: 'TC-R35-CM-029', title: '2D Properties > Figures 수정', detail: 'Size, Position, Transform, Layout, FlexItem, Spacing, Label, Background, Border, Font-Type' },
  { id: 'TC-R35-CM-030', title: '2D Properties > Echart 수정', detail: 'Size, Position, Transform, Layout, FlexItem, Spacing, Label, Background, Border, Font-Type' },
];

test.describe('RENOBIT 3.5.0 Final Common TC - Component Manager', () => {
  const runId = Date.now().toString(36);

  test.beforeEach(async ({ page }) => {
    await ensureEditorSession(page);
    await ensureTestPage(page, `tc_r35_cm_${runId}`);
    await switchToTwoLayer(page);
  });

  for (const componentCase of ACTIVE_COMPONENT_CASES) {
    test(`${componentCase.id} ${componentCase.title}`, async ({ page }, testInfo) => {
      const instanceName = `${componentCase.id.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${runId}`;

      await attachTcMeta(testInfo, {
        id: componentCase.id,
        title: `${componentCase.category} > ${componentCase.title}`,
        preconditions: [
          '에디터 로그인 완료 상태여야 한다.',
          '편집 가능한 테스트 페이지가 열려 있어야 한다.',
          '2D 레이어가 활성화되어 있어야 한다.',
        ],
        expectedResults: [
          `${componentCase.category} 에서 선택한 컴포넌트를 페이지에 배치할 수 있어야 한다.`,
          '배치 직후 mainPageComponent 에서 해당 인스턴스를 조회할 수 있어야 한다.',
        ],
      });

      await place2DComponent(page, componentCase.componentName, instanceName);
    });
  }

  for (const pendingCase of PENDING_COMPONENT_CASES) {
    test(`${pendingCase.id} ${pendingCase.title}`, async ({}, testInfo) => {
      await attachTcMeta(testInfo, {
        id: pendingCase.id,
        title: pendingCase.title,
        preconditions: [
          '에디터 로그인 완료 상태여야 한다.',
          '컴포넌트 매니저 및 속성 패널의 실제 selector 또는 command 파라미터가 확정되어야 한다.',
        ],
        expectedResults: [
          `${pendingCase.detail} 범위의 하위 컴포넌트 또는 속성 편집 흐름이 모두 동작해야 한다.`,
          '배치 또는 수정 후 저장 가능한 상태를 유지해야 한다.',
        ],
      });

      test.skip(`${pendingCase.detail} 자동화용 selector/command 안정화 후 활성화`);
    });
  }
});
