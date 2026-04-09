const { test, expect } = require('@playwright/test');

const {
  ensureEditorSession,
  ensureTestPage,
  switchToTwoLayer,
} = require('../../helpers/renobit');
const { attachTcMeta } = require('./_tc-meta');

test.setTimeout(120_000);

async function placeCodeBox(page, instanceName) {
  await page.evaluate((name) => {
    window.wemb.editorFacade.sendNotification('command/addComponentInstanceByName', {
      componentName: 'FreeCode',
      name,
    });
  }, instanceName);

  await expect
    .poll(
      async () =>
        page.evaluate((name) => !!window.wemb?.mainPageComponent?.getComInstanceByName?.(name), instanceName),
      { timeout: 15_000 }
    )
    .toBeTruthy();
}

async function openCodeBoxEditor(page, instanceName) {
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.evaluate((name) => {
      const instance = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
      if (!instance) {
        throw new Error(`CodeBox instance not found: ${name}`);
      }

      window.wemb.editorFacade.sendNotification('command/newSelectedComponentInstance', instance);
      window.wemb.editorFacade.sendNotification('command/showWScriptEditor');
    }, instanceName),
  ]);

  await popup.waitForLoadState('domcontentloaded');
  await popup.waitForURL(/#\/codeBox$/);
  await expect(popup.locator('.script-edit-main')).toBeVisible();

  await expect
    .poll(
      async () =>
        popup.evaluate(() => {
          const focusArea = window.wemb?.viewComponentMap?.get?.('ScriptEditAreaMediator');
          const currentInstance = focusArea?.currentInstance;
          return currentInstance
            ? {
                name: currentInstance.name,
                componentName: currentInstance.componentName,
              }
            : null;
        }),
      { timeout: 15_000 }
    )
    .toEqual({
      name: instanceName,
      componentName: 'FreeCode',
    });

  return popup;
}

test.describe('RENOBIT 3.5.0 Final Common TC - CodeBox', () => {
  const runId = Date.now().toString(36);

  test.beforeEach(async ({ page }) => {
    await ensureEditorSession(page);
    await ensureTestPage(page, `tc_r35_codebox_${runId}`);
    await switchToTwoLayer(page);
  });

  test('TC-R35-CB-001 Template > FreeCode > CodeBox 배치', async ({ page }, testInfo) => {
    const instanceName = `tc_r35_codebox_${runId}`;

    await attachTcMeta(testInfo, {
      id: 'TC-R35-CB-001',
      title: 'Template > FreeCode > CodeBox 컴포넌트 배치',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        '편집 가능한 테스트 페이지가 열려 있어야 한다.',
        '2D 레이어가 활성화되어 있어야 한다.',
      ],
      expectedResults: [
        'FreeCode 컴포넌트가 페이지에 배치되어야 한다.',
        '배치 직후 mainPageComponent 에서 해당 인스턴스를 조회할 수 있어야 한다.',
      ],
    });

    await placeCodeBox(page, instanceName);
  });

  test('TC-R35-CB-002 CodeBox 편집기 열기', async ({ page }, testInfo) => {
    const instanceName = `tc_r35_codebox_input_${runId}`;

    await attachTcMeta(testInfo, {
      id: 'TC-R35-CB-002',
      title: 'CodeBox 편집기 팝업 열기',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        'CodeBox 컴포넌트가 배치되어 있어야 한다.',
        '편집 가능한 테스트 페이지가 열려 있어야 한다.',
      ],
      expectedResults: [
        '선택한 FreeCode 인스턴스 기준으로 CodeBox 편집기 팝업이 열려야 한다.',
        '팝업 URL 은 /#/codeBox 여야 한다.',
        '팝업 내부 편집 대상이 방금 배치한 FreeCode 인스턴스로 표시되어야 한다.',
      ],
    });

    await placeCodeBox(page, instanceName);
    const popup = await openCodeBoxEditor(page, instanceName);
    await expect(popup.locator('.header-instance-name-id')).toContainText(instanceName);
    await popup.close();
  });
});
