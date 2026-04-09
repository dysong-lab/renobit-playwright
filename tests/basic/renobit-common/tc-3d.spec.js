const { test, expect } = require('@playwright/test');

const {
  addThreeBox,
  applyTempGroupTransform,
  cleanupComponents,
  ensureEditorSession,
  ensureTestPage,
  getComponentState,
  getSelectedComponentStates,
  getThreeLayerState,
  moveSelectedByKeyboard,
  savePage,
  selectThreeComponents,
  setThreeTransformMode,
  switchToThreeLayer,
  switchToTwoLayer,
  waitForEditorReady,
} = require('../../helpers/renobit');
const { attachTcMeta } = require('./_tc-meta');

test.setTimeout(120_000);

test.describe('RENOBIT 3.5.0 Final Common TC - 3D', () => {
  test('TC-R35-3D-001 3D 레이어 전환 후 T/R/S 툴바 표시', async ({ page }, testInfo) => {
    const runId = Date.now().toString(36);
    const pageName = `tc_r35_3d_mode_${runId}`;
    const boxA = `tc_r35_3d_mode_${runId}_a`;
    const boxB = `tc_r35_3d_mode_${runId}_b`;

    await attachTcMeta(testInfo, {
      id: 'TC-R35-3D-001',
      title: '3D 레이어 전환 및 다중 선택 후 T/R/S 툴바 표시',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        '3D 레이어를 포함한 편집 가능한 테스트 페이지가 열려 있어야 한다.',
      ],
      expectedResults: [
        '3D 레이어 전환 후 activeLayer.name 이 _threeLayer 여야 한다.',
        'Box 두 개 다중 선택 시 tempGroup 이 생성되어야 한다.',
        'T/R/S 버튼이 노출되어야 하고 2D 레이어 전환 시 다시 숨겨져야 한다.',
      ],
    });

    await ensureEditorSession(page);
    await ensureTestPage(page, pageName);
    await cleanupComponents(page, `tc_r35_3d_mode_${runId}`);
    await switchToThreeLayer(page);

    await addThreeBox(page, boxA, { x: -2, y: 0, z: 0 });
    await addThreeBox(page, boxB, { x: 2, y: 0, z: 0 });
    await selectThreeComponents(page, [boxA, boxB]);

    await expect
      .poll(async () =>
        page.evaluate(() => ({
          activeLayer: window.wemb?.mainPageComponent?.activeLayer?.name,
          tempGroupExists: !!window.wemb?.mainPageComponent?.threeLayer?._tempGroup,
        }))
      )
      .toEqual({
        activeLayer: '_threeLayer',
        tempGroupExists: true,
      });

    const translateButton = page.getByRole('button', { name: 'T', exact: true });
    const rotateButton = page.getByRole('button', { name: 'R', exact: true });
    const scaleButton = page.getByRole('button', { name: 'S', exact: true });

    await expect(translateButton).toBeVisible();
    await expect(rotateButton).toBeVisible();
    await expect(scaleButton).toBeVisible();

    await switchToTwoLayer(page);
    await expect(translateButton).toHaveCount(0);
    await expect(rotateButton).toHaveCount(0);
    await expect(scaleButton).toHaveCount(0);
  });

  test('TC-R35-3D-002 3D 다중 선택 이동/회전/스케일 후 저장 유지', async ({ page }, testInfo) => {
    const runId = Date.now().toString(36);
    const pageName = `tc_r35_3d_multi_${runId}`;
    const boxA = `tc_r35_3d_multi_${runId}_a`;
    const boxB = `tc_r35_3d_multi_${runId}_b`;

    await attachTcMeta(testInfo, {
      id: 'TC-R35-3D-002',
      title: '3D 다중 선택 후 이동/회전/스케일 적용 및 저장 유지',
      preconditions: [
        '에디터 로그인 완료 상태여야 한다.',
        '3D 레이어 전환이 가능해야 한다.',
        'Box 컴포넌트를 배치할 수 있는 편집 상태여야 한다.',
      ],
      expectedResults: [
        '다중 선택 후 이동, 회전, 스케일이 두 컴포넌트에 함께 반영되어야 한다.',
        '저장 후 새로고침해도 position/rotation/size 값이 유지되어야 한다.',
      ],
    });

    await ensureEditorSession(page);
    await ensureTestPage(page, pageName);
    await cleanupComponents(page, `tc_r35_3d_multi_${runId}`);
    await switchToThreeLayer(page);

    await addThreeBox(page, boxA, { x: -2, y: 0, z: 0 });
    await addThreeBox(page, boxB, { x: 2, y: 0, z: 0 });
    await selectThreeComponents(page, [boxA, boxB]);

    const initialThreeLayer = await getThreeLayerState(page);
    expect(initialThreeLayer.tempGroupExists).toBeTruthy();

    const initialA = await getComponentState(page, boxA);
    const initialB = await getComponentState(page, boxB);

    await moveSelectedByKeyboard(page, [
      { key: 'ArrowUp' },
      { key: 'ArrowRight', shiftKey: true },
    ]);
    const movedStates = await getSelectedComponentStates(page, [boxA, boxB]);
    expect(movedStates[boxA].position.y).toBeCloseTo(initialA.position.y - 1, 1);
    expect(movedStates[boxA].position.x).toBeCloseTo(initialA.position.x + 5, 1);
    expect(movedStates[boxB].position.y).toBeCloseTo(initialB.position.y - 1, 1);
    expect(movedStates[boxB].position.x).toBeCloseTo(initialB.position.x + 5, 1);

    await setThreeTransformMode(page, 'rotate');
    await applyTempGroupTransform(page, 'rotate', Math.PI / 4);
    const rotatedStates = await getSelectedComponentStates(page, [boxA, boxB]);
    expect(Number(rotatedStates[boxA].rotation.z)).toBeCloseTo(45, 1);
    expect(Number(rotatedStates[boxB].rotation.z)).toBeCloseTo(45, 1);

    await setThreeTransformMode(page, 'scale');
    await applyTempGroupTransform(page, 'scale', { x: 1.2, y: 1.2, z: 1.2 });
    const scaledStates = await getSelectedComponentStates(page, [boxA, boxB]);
    expect(scaledStates[boxA].size.x).toBeCloseTo(1.2, 1);
    expect(scaledStates[boxB].size.x).toBeCloseTo(1.2, 1);

    await savePage(page);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await ensureEditorSession(page);
    await ensureTestPage(page, pageName);
    await switchToThreeLayer(page);

    const restoredA = await getComponentState(page, boxA);
    const restoredB = await getComponentState(page, boxB);
    expect(restoredA.position.x).toBeCloseTo(scaledStates[boxA].position.x, 1);
    expect(restoredA.position.y).toBeCloseTo(scaledStates[boxA].position.y, 1);
    expect(Number(restoredA.rotation.z)).toBeCloseTo(Number(scaledStates[boxA].rotation.z), 1);
    expect(restoredA.size.x).toBeCloseTo(scaledStates[boxA].size.x, 1);
    expect(restoredB.position.x).toBeCloseTo(scaledStates[boxB].position.x, 1);
    expect(restoredB.position.y).toBeCloseTo(scaledStates[boxB].position.y, 1);
    expect(Number(restoredB.rotation.z)).toBeCloseTo(Number(scaledStates[boxB].rotation.z), 1);
    expect(restoredB.size.x).toBeCloseTo(scaledStates[boxB].size.x, 1);
  });
});
