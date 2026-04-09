const { test, expect } = require('@playwright/test');

const {
  addThreeBox,
  applyTempGroupTransform,
  cleanupComponents,
  ensureTestPage,
  getComponentState,
  getSelectedComponentStates,
  getThreeLayerState,
  goToEditor,
  moveSelectedByKeyboard,
  savePage,
  selectThreeComponents,
  setThreeTransformMode,
  switchToThreeLayer,
  waitForEditorReady,
} = require('../../helpers/renobit');

test.setTimeout(240_000);

test('TC-1369 editor 3D multi select', async ({ page }) => {
  const runId = Date.now().toString(36);
  const pageName = `tc-page-3d-${runId}`;
  const boxA = `tc1369_${runId}_a`;
  const boxB = `tc1369_${runId}_b`;

  // 1. 에디터로 이동 (로그인은 globalSetup에서 완료, storageState로 세션 재사용)
  await goToEditor(page);

  // 2. tc-page-3d 페이지 열기/생성 (isLoaded까지 대기)
  const activePageId = await ensureTestPage(page, pageName);
  await cleanupComponents(page, 'tc1369_');

  // 3. 3D 레이어 전환 및 Box 두 개 생성
  await switchToThreeLayer(page);
  await page.waitForTimeout(1_000);

  await addThreeBox(page, boxA, { x: -2, y: 0, z: 0 });
  await addThreeBox(page, boxB, { x: 2, y: 0, z: 0 });

  // 4. 다중 선택 및 T/R/S 버튼 노출 확인
  await selectThreeComponents(page, [boxA, boxB]);

  await expect(page.getByRole('button', { name: 'T' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'R' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'S' }).first()).toBeVisible();

  // 5. tempGroup 생성 확인
  const initialThreeLayer = await getThreeLayerState(page);
  expect(initialThreeLayer.tempGroupExists).toBeTruthy();
  expect(initialThreeLayer.tempGroupComponents).toEqual([boxA, boxB]);
  expect(initialThreeLayer.tempGroupPosition.x).toBeCloseTo(0, 1);
  expect(initialThreeLayer.tempGroupPosition.y).toBeCloseTo(0, 1);
  expect(initialThreeLayer.tempGroupPosition.z).toBeCloseTo(0, 1);

  // 6. Translate — 방향키로 이동
  const initialA = await getComponentState(page, boxA);
  const initialB = await getComponentState(page, boxB);

  await moveSelectedByKeyboard(page, [
    { key: 'ArrowUp' },
    { key: 'ArrowRight', shiftKey: true },
  ]);
  const movedStates = await getSelectedComponentStates(page, [boxA, boxB]);

  const movedA = movedStates[boxA];
  const movedB = movedStates[boxB];
  expect(movedA.position.y).toBeCloseTo(initialA.position.y - 1, 1);
  expect(movedA.position.x).toBeCloseTo(initialA.position.x + 5, 1);
  expect(movedB.position.y).toBeCloseTo(initialB.position.y - 1, 1);
  expect(movedB.position.x).toBeCloseTo(initialB.position.x + 5, 1);

  // 7. Rotate — tempGroup z축 45도 회전
  await setThreeTransformMode(page, 'rotate');
  await applyTempGroupTransform(page, 'rotate', Math.PI / 4);
  const rotatedStates = await getSelectedComponentStates(page, [boxA, boxB]);

  const rotatedA = rotatedStates[boxA];
  const rotatedB = rotatedStates[boxB];
  expect(Number(rotatedA.rotation.z)).toBeCloseTo(45, 1);
  expect(Number(rotatedB.rotation.z)).toBeCloseTo(45, 1);

  // 8. Scale — tempGroup 1.2배 스케일
  await setThreeTransformMode(page, 'scale');
  await applyTempGroupTransform(page, 'scale', { x: 1.2, y: 1.2, z: 1.2 });
  const scaledStates = await getSelectedComponentStates(page, [boxA, boxB]);

  const scaledA = scaledStates[boxA];
  const scaledB = scaledStates[boxB];
  expect(scaledA.size.x).toBeCloseTo(1.2, 1);
  expect(scaledA.size.y).toBeCloseTo(1.2, 1);
  expect(scaledA.size.z).toBeCloseTo(1.2, 1);
  expect(scaledB.size.x).toBeCloseTo(1.2, 1);
  expect(scaledB.size.y).toBeCloseTo(1.2, 1);
  expect(scaledB.size.z).toBeCloseTo(1.2, 1);

  // 9. 저장
  await savePage(page);

  // 10. 새로고침 후 값 유지 확인
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForEditorReady(page);
  await ensureTestPage(page, pageName);
  await page.waitForFunction(
    (instanceName) => !!window.wemb?.mainPageComponent?.getComInstanceByName(instanceName),
    boxA,
    { timeout: 15_000 }
  );
  await page.waitForFunction(
    (instanceName) => !!window.wemb?.mainPageComponent?.getComInstanceByName(instanceName),
    boxB,
    { timeout: 15_000 }
  );

  const restoredA = await getComponentState(page, boxA);
  const restoredB = await getComponentState(page, boxB);

  expect(restoredA.position.x).toBeCloseTo(scaledA.position.x, 1);
  expect(restoredA.position.y).toBeCloseTo(scaledA.position.y, 1);
  expect(restoredA.position.z).toBeCloseTo(scaledA.position.z, 1);
  expect(Number(restoredA.rotation.z)).toBeCloseTo(Number(scaledA.rotation.z), 1);
  expect(restoredA.size.x).toBeCloseTo(scaledA.size.x, 1);
  expect(restoredA.size.y).toBeCloseTo(scaledA.size.y, 1);
  expect(restoredA.size.z).toBeCloseTo(scaledA.size.z, 1);

  expect(restoredB.position.x).toBeCloseTo(scaledB.position.x, 1);
  expect(restoredB.position.y).toBeCloseTo(scaledB.position.y, 1);
  expect(restoredB.position.z).toBeCloseTo(scaledB.position.z, 1);
  expect(Number(restoredB.rotation.z)).toBeCloseTo(Number(scaledB.rotation.z), 1);
  expect(restoredB.size.x).toBeCloseTo(scaledB.size.x, 1);
  expect(restoredB.size.y).toBeCloseTo(scaledB.size.y, 1);
  expect(restoredB.size.z).toBeCloseTo(scaledB.size.z, 1);
});
