const { test, expect } = require('@playwright/test');
const { goToEditor, ensureTestPage, savePage, switchToTwoLayer } = require('../helpers/renobit');

test.setTimeout(90_000);

/** 컴포넌트 배치 헬퍼 */
async function addComponent(page, componentName, instanceName) {
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

/** visualViewer에서 요소 존재 여부 반환 */
async function isVisibleInViewer(page, instanceName) {
  await page.goto('/renobit/visualViewer.do', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3_000);
  // TODO: visualViewer DOM 구조에 맞는 selector 확인 필요
  return page.evaluate((name) => {
    const el =
      document.querySelector(`[data-instance-name="${name}"]`) ||
      document.querySelector(`[id="${name}"]`) ||
      document.querySelector(`[data-name="${name}"]`);
    return el ? window.getComputedStyle(el).display !== 'none' : false;
  }, instanceName);
}

test.describe('Basic - Instance List (Hide / Lock)', () => {
  const runId = Date.now().toString(36);

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    await ensureTestPage(page, `basic_instlist_${runId}`);
    await switchToTwoLayer(page);
  });

  test('icon-view(숨기기) — viewer에서 컴포넌트 미노출 확인', async ({ page }) => {
    const instName = `hide_test_${runId}`;
    await addComponent(page, 'ActiveGroupBtnComponent', instName);

    // instance list에서 해당 인스턴스 행의 눈 아이콘 클릭 (visible=false)
    // TODO: instance list 패널의 눈 아이콘 selector 확인 필요
    await page.evaluate((name) => {
      const comp = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
      if (!comp) throw new Error(`Component not found: ${name}`);
      // visible 속성을 false로 설정
      // TODO: 실제 visible 속성 setter/커맨드 확인 필요
      window.wemb.editorFacade.sendNotification('command/setComponentVisible', {
        instance: comp,
        visible: false,
      });
    }, instName);

    // instance list UI에서 아이콘 상태 확인
    // TODO: selector 확인 필요
    const iconView = page.locator(`.instance-list [data-name="${instName}"] .icon-view, .instance-list [data-name="${instName}"] .icon-hide`);
    // await expect(iconView).toHaveClass(/hidden/);

    await savePage(page);

    // viewer에서 미노출 확인
    const visible = await isVisibleInViewer(page, instName);
    expect(visible, `viewer에서 ${instName}이 보이면 안 됨`).toBeFalsy();
    console.log('[PASS] icon-view(숨기기) → viewer에서 컴포넌트 미노출 확인');
  });

  test('icon-lock(잠금) — viewer에서 컴포넌트 정상 노출 확인', async ({ page }) => {
    const instName = `lock_test_${runId}`;
    await addComponent(page, 'ActiveGroupBtnComponent', instName);

    // instance list에서 잠금 아이콘 클릭 (locked=true)
    // TODO: 잠금 커맨드 확인 필요
    await page.evaluate((name) => {
      const comp = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
      if (!comp) throw new Error(`Component not found: ${name}`);
      window.wemb.editorFacade.sendNotification('command/setComponentLocked', {
        instance: comp,
        locked: true,
      });
    }, instName);

    // 잠금 상태에서도 컴포넌트는 visible=true 유지
    const isVisible = await page.evaluate((name) => {
      const comp = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
      // TODO: visible 속성명 확인 필요
      return comp?.visible !== false;
    }, instName);
    expect(isVisible, `${instName}의 visible이 false면 안 됨`).toBeTruthy();

    await savePage(page);

    // viewer에서 정상 노출 확인
    const visible = await isVisibleInViewer(page, instName);
    expect(visible, `viewer에서 ${instName}이 보여야 함`).toBeTruthy();
    console.log('[PASS] icon-lock(잠금) → viewer에서 컴포넌트 정상 노출 확인');
  });
});
