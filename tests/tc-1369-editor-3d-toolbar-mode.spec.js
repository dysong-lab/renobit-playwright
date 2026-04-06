const { test, expect } = require('@playwright/test');

const {
  addThreeBox,
  applyTempGroupTransform,
  ensureTestPage,
  getSelectedComponentStates,
  getThreeLayerState,
  goToEditor,
  savePage,
  selectThreeComponents,
  setThreeTransformMode,
  switchToThreeLayer,
  waitForEditorReady,
} = require('./helpers/renobit');

test.setTimeout(120_000);

test('TC-1369-02: T/R/S mode buttons', async ({ page }) => {
  const runId = Date.now().toString(36);
  const pageName = `tc-page-3d-mode-${runId}`;
  const boxA = `tc1369_mode_${runId}_a`;
  const boxB = `tc1369_mode_${runId}_b`;

  await goToEditor(page);
  await ensureTestPage(page, pageName);
  await switchToThreeLayer(page);

  await addThreeBox(page, boxA, { x: -2, y: 0, z: 0 });
  await addThreeBox(page, boxB, { x: 2, y: 0, z: 0 });
  await selectThreeComponents(page, [boxA, boxB]);

  const translateButton = page.getByRole('button', { name: 'T', exact: true });
  const rotateButton = page.getByRole('button', { name: 'R', exact: true });
  const scaleButton = page.getByRole('button', { name: 'S', exact: true });

  await expect(translateButton).toBeVisible();
  await expect(rotateButton).toBeVisible();
  await expect(scaleButton).toBeVisible();

  await page.evaluate(() => {
    window.wemb.editorFacade.sendNotification('command/changeActvieLayer', 'twoLayer');
  });
  await page.waitForFunction(() => window.wemb?.mainPageComponent?.activeLayer?.name === '_twoLayer');

  await expect(translateButton).toHaveCount(0);
  await expect(rotateButton).toHaveCount(0);
  await expect(scaleButton).toHaveCount(0);

  await switchToThreeLayer(page);
  await selectThreeComponents(page, [boxA, boxB]);

  await setThreeTransformMode(page, 'rotate');
  let threeLayerState = await getThreeLayerState(page);
  expect(threeLayerState.mode).toBe('rotate');

  await applyTempGroupTransform(page, 'rotate', Math.PI / 4);
  let rotatedStates = await getSelectedComponentStates(page, [boxA, boxB]);
  expect(Number(rotatedStates[boxA].rotation.z)).toBeCloseTo(45, 1);
  expect(Number(rotatedStates[boxB].rotation.z)).toBeCloseTo(45, 1);

  await setThreeTransformMode(page, 'scale');
  threeLayerState = await getThreeLayerState(page);
  expect(threeLayerState.mode).toBe('scale');

  await applyTempGroupTransform(page, 'scale', { x: 1.2, y: 1.2, z: 1.2 });
  const scaledStates = await getSelectedComponentStates(page, [boxA, boxB]);
  expect(scaledStates[boxA].size.x).toBeCloseTo(1.2, 1);
  expect(scaledStates[boxB].size.x).toBeCloseTo(1.2, 1);

  await savePage(page);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForEditorReady(page);
  await ensureTestPage(page, pageName);
  await switchToThreeLayer(page);

  rotatedStates = await getSelectedComponentStates(page, [boxA, boxB], 10_000);
  expect(Number(rotatedStates[boxA].rotation.z)).toBeCloseTo(45, 1);
  expect(Number(rotatedStates[boxB].rotation.z)).toBeCloseTo(45, 1);

  const restoredStates = await getSelectedComponentStates(page, [boxA, boxB], 10_000);
  expect(restoredStates[boxA].size.x).toBeCloseTo(1.2, 1);
  expect(restoredStates[boxB].size.x).toBeCloseTo(1.2, 1);
});
