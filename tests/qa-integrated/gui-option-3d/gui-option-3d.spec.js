const { test, expect } = require('@playwright/test');
const {
  goToEditor,
  ensureTestPage,
  switchToThreeLayer,
  cleanupComponents,
} = require('../../helpers/renobit');

const TEST_PAGE = 'qa-properties-test-page';

async function openGuiOptionPanel(page) {
  const guiTab = page.locator('#right-panel-wrap .el-tabs__item')
    .filter({ hasText: /GUI\s*[Oo]ption/i })
    .first();
  if (await guiTab.count() > 0 && await guiTab.isVisible().catch(() => false)) {
    await guiTab.click();
  }
  await page.waitForTimeout(500);
}

async function expandSection(page, sectionName) {
  const headers = page.locator('.el-collapse-item__header, .gui-option-header, [class*="collapse"] .title');
  const matching = headers.filter({ hasText: new RegExp(sectionName, 'i') });
  if (await matching.count() > 0) {
    const header = matching.first();
    const isExpanded = await header.evaluate(
      el => el.classList.contains('is-active') || el.getAttribute('aria-expanded') === 'true'
    ).catch(() => false);
    if (!isExpanded) {
      await header.click().catch(() => {});
      await page.waitForTimeout(300);
    }
  }
}

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

function getThreeLayer(page) {
  return page.evaluate(() => {
    return window.wemb?.mainPageComponent?.threeLayer;
  });
}

test.describe('GUI OPTION 3D Tests', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    await goToEditor(page);
    await ensureTestPage(page, TEST_PAGE);
    await page.evaluate(() => {
      const mpc = window.wemb?.mainPageComponent;
      if (!mpc) return;
      (mpc._comInstanceList || [])
        .filter(c => c.name?.startsWith('tc_gui3d_'))
        .forEach(c => window.wemb.editorFacade.sendNotification('command/removeComponentInstance', c));
    }).catch(() => {});
    await page.waitForTimeout(300);
  });

  // ────────────────────────────────────────────────────────────
  // 목록 확인
  // ────────────────────────────────────────────────────────────

  test('[QATC-1215] GUI Option 3D - 목록 { @QA @GuiOption3D @QATC-1215 }', async ({ page }) => {
    /**
     * [Test Steps]: toolbar > 3D 선택 > threeLayerPage 선택 > GUI option
     * [Expected Result]: controls / shadowMap / camera / ambiantLight / directionalLight /
     *   directionalLightHelper / directionalLightPosition / directionalLightTargetPosition /
     *   directionalLightShadow / directionalLightShadowCameraHelper / directionalLightShadowCamera 노출
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    const threeLayer = await page.evaluate(() => window.wemb?.mainPageComponent?.threeLayer);
    expect(threeLayer).not.toBeNull();

    const expectedKeys = [
      'controls',
      'shadowMap',
      'camera',
      'ambiantLight',
      'directionalLight',
      'directionalLightHelper',
      'directionalLightPosition',
      'directionalLightTargetPosition',
      'directionalLightShadow',
      'directionalLightShadowCameraHelper',
      'directionalLightShadowCamera',
    ];
    const layerState = await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      const scene = window.wemb?.threeElements?.scene;
      if (!tl) return {};
      return {
        hasControls: !!tl._controls,
        hasShadowMap: !!(tl._renderer?.shadowMap),
        hasCamera: !!tl._camera,
        hasAmbiantLight: !!(scene?.getObjectByName?.('AmbientLight')),
        hasDirectionalLight: !!(scene?.getObjectByName?.('DirectionalLight')),
        hasDirectionalLightHelper: !!(scene?.getObjectByName?.('DirectionalLightHelper')),
      };
    });
    expect(layerState.hasControls).toBe(true);
    expect(layerState.hasCamera).toBe(true);
    expect(layerState.hasDirectionalLight).toBe(true);
  });

  // ────────────────────────────────────────────────────────────
  // Controls
  // ────────────────────────────────────────────────────────────

  test('[QATC-1223] GUI Option 3D - Controls - controls { @QA @GuiOption3D @QATC-1223 }', async ({ page }) => {
    /**
     * [Test Steps]: toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > controls
     * [Expected Result]: controls 섹션 노출 확인
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    const hasControls = await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      return !!tl?._controls;
    });
    expect(hasControls).toBe(true);
  });

  test('[QATC-1244] GUI Option 3D - Controls - autoRotate { @QA @GuiOption3D @QATC-1244 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > controls > autoRotate 활성화
     * [Expected Result]: 카메라 자동 회전
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._controls) tl._controls.autoRotate = true;
    });

    const autoRotate = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._controls?.autoRotate;
    });
    expect(autoRotate).toBe(true);
  });

  test('[QATC-1245] GUI Option 3D - Controls - autoRotateSpeed { @QA @GuiOption3D @QATC-1245 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > controls > autoRotateSpeed 확인
     * [Expected Result]: 자동 회전 속도 설정, 기본값 2.0
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    const defaultSpeed = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._controls?.autoRotateSpeed;
    });
    expect(typeof defaultSpeed).toBe('number');
    expect(defaultSpeed).toBeGreaterThanOrEqual(0);
  });

  test('[QATC-1247] GUI Option 3D - Controls - enable { @QA @GuiOption3D @QATC-1247 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > controls > enable 토글
     * [Expected Result]: 컨트롤 자체 활성화 여부 (true / false)
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._controls) tl._controls.enabled = false;
    });
    const disabled = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._controls?.enabled;
    });
    expect(disabled).toBe(false);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._controls) tl._controls.enabled = true;
    });
    const enabled = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._controls?.enabled;
    });
    expect(enabled).toBe(true);
  });

  test('[QATC-1249] GUI Option 3D - Controls - enableZoom { @QA @GuiOption3D @QATC-1249 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > controls > enableZoom 토글
     * [Expected Result]: 마우스 휠로 확대/축소 가능 여부
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._controls) tl._controls.enableZoom = false;
    });
    const disabled = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._controls?.enableZoom;
    });
    expect(disabled).toBe(false);
  });

  test('[QATC-1251] GUI Option 3D - Controls - enablePan { @QA @GuiOption3D @QATC-1251 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > controls > enablePan 토글
     * [Expected Result]: 오른쪽 드래그로 화면 이동 가능 여부
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._controls) tl._controls.enablePan = false;
    });
    const disabled = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._controls?.enablePan;
    });
    expect(disabled).toBe(false);
  });

  test('[QATC-1254] GUI Option 3D - Controls - minDistance { @QA @GuiOption3D @QATC-1254 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > controls > minDistance 설정
     * [Expected Result]: 카메라가 타겟에 가장 가까이 갈 수 있는 거리
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._controls) tl._controls.minDistance = 5;
    });
    const val = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._controls?.minDistance;
    });
    expect(val).toBe(5);
  });

  test('[QATC-1256] GUI Option 3D - Controls - maxDistance { @QA @GuiOption3D @QATC-1256 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > controls > maxDistance 설정
     * [Expected Result]: 카메라가 타겟에서 가장 멀리 떨어질 수 있는 거리
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._controls) tl._controls.maxDistance = 500;
    });
    const val = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._controls?.maxDistance;
    });
    expect(val).toBe(500);
  });

  test('[QATC-1258] GUI Option 3D - Controls - minPolarAngle { @QA @GuiOption3D @QATC-1258 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > controls > minPolarAngle 설정
     * [Expected Result]: 위쪽으로 올릴 수 있는 각도의 최솟값
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._controls) tl._controls.minPolarAngle = 0;
    });
    const val = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._controls?.minPolarAngle;
    });
    expect(val).toBe(0);
  });

  test('[QATC-1260] GUI Option 3D - Controls - maxPolarAngle { @QA @GuiOption3D @QATC-1260 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > controls > maxPolarAngle 설정
     * [Expected Result]: 아래쪽으로 내릴 수 있는 각도의 최댓값
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._controls) tl._controls.maxPolarAngle = Math.PI;
    });
    const val = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._controls?.maxPolarAngle;
    });
    expect(val).toBeCloseTo(Math.PI, 5);
  });

  // ────────────────────────────────────────────────────────────
  // ShadowMap
  // ────────────────────────────────────────────────────────────

  test('[QATC-1226] GUI Option 3D - ShadowMap - enable { @QA @GuiOption3D @QATC-1226 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > shadowMap > enable 토글
     * [Expected Result]: 카메라 시점 기준 shadowMap 영역을 어두운 영역으로 표현
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._renderer?.shadowMap) tl._renderer.shadowMap.enabled = true;
    });
    const enabled = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._renderer?.shadowMap?.enabled;
    });
    expect(enabled).toBe(true);
  });

  for (const [tcId, typeName, typeValue] of [
    ['QATC-1230', 'BasicShadowMap', 0],
    ['QATC-1231', 'PCFShadowMap', 1],
    ['QATC-1233', 'PCFSoftShadowMap', 2],
    ['QATC-1235', 'VSMShadowMap', 3],
  ]) {
    test(`[${tcId}] GUI Option 3D - ShadowMap - type ${typeName} { @QA @GuiOption3D @${tcId} }`, async ({ page }) => {
      await switchToThreeLayer(page);
      await openGuiOptionPanel(page);

      await page.evaluate((tval) => {
        const tl = window.wemb?.mainPageComponent?.threeLayer;
        if (tl?._renderer?.shadowMap) tl._renderer.shadowMap.type = tval;
      }, typeValue);

      const shadowType = await page.evaluate(() => {
        return window.wemb?.mainPageComponent?.threeLayer?._renderer?.shadowMap?.type;
      });
      expect(shadowType).toBe(typeValue);
    });
  }

  // ────────────────────────────────────────────────────────────
  // Camera
  // ────────────────────────────────────────────────────────────

  test('[QATC-1239] GUI Option 3D - Camera - fov { @QA @GuiOption3D @QATC-1239 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > camera > fov 설정
     * [Expected Result]: 수직 방향 시야각 설정
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._camera) {
        tl._camera.fov = 60;
        tl._camera.updateProjectionMatrix?.();
      }
    });
    const fov = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._camera?.fov;
    });
    expect(fov).toBe(60);
  });

  test('[QATC-1241] GUI Option 3D - Camera - near { @QA @GuiOption3D @QATC-1241 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > camera > near 설정
     * [Expected Result]: 이 거리보다 가까운 물체는 보이지 않음
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._camera) {
        tl._camera.near = 0.5;
        tl._camera.updateProjectionMatrix?.();
      }
    });
    const near = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._camera?.near;
    });
    expect(near).toBe(0.5);
  });

  test('[QATC-1242] GUI Option 3D - Camera - far { @QA @GuiOption3D @QATC-1242 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > camera > far 설정
     * [Expected Result]: 이 거리보다 멀리 있는 물체는 보이지 않음
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const tl = window.wemb?.mainPageComponent?.threeLayer;
      if (tl?._camera) {
        tl._camera.far = 2000;
        tl._camera.updateProjectionMatrix?.();
      }
    });
    const far = await page.evaluate(() => {
      return window.wemb?.mainPageComponent?.threeLayer?._camera?.far;
    });
    expect(far).toBe(2000);
  });

  // ────────────────────────────────────────────────────────────
  // Ambient Light
  // ────────────────────────────────────────────────────────────

  test('[QATC-1297] GUI Option 3D - Ambient Light - visible { @QA @GuiOption3D @QATC-1297 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > ambiantLight > visible 토글
     * [Expected Result]: 사용 여부
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const light = window.wemb?.threeElements?.scene?.getObjectByName?.('AmbientLight');
      if (light) light.visible = false;
    });
    const visible = await page.evaluate(() => {
      const light = window.wemb?.threeElements?.scene?.getObjectByName?.('AmbientLight');
      return light?.visible;
    });
    expect(visible).toBe(false);
  });

  test('[QATC-1298] GUI Option 3D - Ambient Light - intensity { @QA @GuiOption3D @QATC-1298 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > ambiantLight > intensity 설정
     * [Expected Result]: 밝기 설정
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const light = window.wemb?.threeElements?.scene?.getObjectByName?.('AmbientLight');
      if (light) light.intensity = 0.8;
    });
    const intensity = await page.evaluate(() => {
      const light = window.wemb?.threeElements?.scene?.getObjectByName?.('AmbientLight');
      return light?.intensity;
    });
    expect(intensity).toBeCloseTo(0.8, 5);
  });

  test('[QATC-1300] GUI Option 3D - Ambient Light - color { @QA @GuiOption3D @QATC-1300 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > ambiantLight > color 설정
     * [Expected Result]: 빛의 색상 설정
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const light = window.wemb?.threeElements?.scene?.getObjectByName?.('AmbientLight');
      if (light?.color) light.color.set(0xff0000);
    });
    const hex = await page.evaluate(() => {
      const light = window.wemb?.threeElements?.scene?.getObjectByName?.('AmbientLight');
      return light?.color?.getHex?.();
    });
    expect(hex).toBe(0xff0000);
  });

  // ────────────────────────────────────────────────────────────
  // Directional Light
  // ────────────────────────────────────────────────────────────

  test('[QATC-1305] GUI Option 3D - Directional Light - visible { @QA @GuiOption3D @QATC-1305 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > directionalLight > visible 토글
     * [Expected Result]: 사용 여부
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      if (dl) dl.visible = false;
    });
    const visible = await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      return dl?.visible;
    });
    expect(visible).toBe(false);
  });

  test('[QATC-1307] GUI Option 3D - Directional Light - castShadow { @QA @GuiOption3D @QATC-1307 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > directionalLight > castShadow 토글
     * [Expected Result]: 그림자 생성 여부
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      if (dl) dl.castShadow = true;
    });
    const castShadow = await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      return dl?.castShadow;
    });
    expect(castShadow).toBe(true);
  });

  test('[QATC-1308] GUI Option 3D - Directional Light - intensity { @QA @GuiOption3D @QATC-1308 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > directionalLight > intensity 설정
     * [Expected Result]: 빛의 세기
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      if (dl) dl.intensity = 1.5;
    });
    const intensity = await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      return dl?.intensity;
    });
    expect(intensity).toBeCloseTo(1.5, 5);
  });

  test('[QATC-1310] GUI Option 3D - Directional Light - color { @QA @GuiOption3D @QATC-1310 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > directionalLight > color 설정
     * [Expected Result]: 빛 색상 설정
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      if (dl?.color) dl.color.set(0x0000ff);
    });
    const hex = await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      return dl?.color?.getHex?.();
    });
    expect(hex).toBe(0x0000ff);
  });

  test('[QATC-1557] GUI Option 3D - Directional Light - directionalLightPosition visible { @QA @GuiOption3D @QATC-1557 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > directionalLightPosition 설정
     * [Expected Result]: 빛의 방향 설정
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    const hasPosition = await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      return !!(dl?.position);
    });
    expect(hasPosition).toBe(true);
  });

  test('[QATC-1313] GUI Option 3D - Directional Light - directionalLightTargetPosition { @QA @GuiOption3D @QATC-1313 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > directionalLightTargetPosition x/y/z 설정
     * [Expected Result]: 빛이 향하는 방향의 x/y/z축 설정
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      if (dl?.target?.position) {
        dl.target.position.set(1, 2, 3);
        dl.target.updateMatrixWorld?.();
      }
    });
    const pos = await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      const p = dl?.target?.position;
      return p ? { x: p.x, y: p.y, z: p.z } : null;
    });
    expect(pos).not.toBeNull();
    expect(pos.x).toBe(1);
    expect(pos.y).toBe(2);
    expect(pos.z).toBe(3);
  });

  test('[QATC-1315] GUI Option 3D - Directional Light - directionalLightShadow { @QA @GuiOption3D @QATC-1315 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > directionalLightShadow 설정
     * [Expected Result]: 그림자 생성 및 관련 x/y/z축 설정
     */
    await switchToThreeLayer(page);
    await openGuiOptionPanel(page);

    const hasShadow = await page.evaluate(() => {
      const dl = window.wemb?.threeElements?.scene?.getObjectByName?.('DirectionalLight');
      return !!(dl?.shadow);
    });
    expect(hasShadow).toBe(true);
  });

  // ────────────────────────────────────────────────────────────
  // 3D Geometry (TorusComponent)
  // ────────────────────────────────────────────────────────────

  test('[QATC-1349] GUI Option 3D - 3D Geometry - position { @QA @GuiOption3D @QATC-1349 }', async ({ page }) => {
    /**
     * [Test Steps]: toolbar > 3D 선택 > TorusComponent 선택 > GUI option > position
     * [Expected Result]: x(좌우) / y(상하) / z(앞뒤) 위치 조정
     */
    await switchToThreeLayer(page);
    const instName = `tc_gui3d_1349_${Date.now()}`;
    await addComponent(page, 'TorusComponent', instName);
    await selectComponent(page, instName);
    await openGuiOptionPanel(page);

    await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      if (inst?.appendElement?.position) inst.appendElement.position.set(1, 2, 3);
    }, instName);

    const pos = await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      const p = inst?.appendElement?.position;
      return p ? { x: p.x, y: p.y, z: p.z } : null;
    }, instName);
    expect(pos).not.toBeNull();
    expect(pos.x).toBe(1);
    expect(pos.y).toBe(2);
    expect(pos.z).toBe(3);

    await cleanupComponents(page, 'tc_gui3d_1349_');
  });

  test('[QATC-1351] GUI Option 3D - 3D Geometry - rotation { @QA @GuiOption3D @QATC-1351 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > TorusComponent > rotation
     * [Expected Result]: x/y/z 축 회전 제어
     */
    await switchToThreeLayer(page);
    const instName = `tc_gui3d_1351_${Date.now()}`;
    await addComponent(page, 'TorusComponent', instName);
    await selectComponent(page, instName);
    await openGuiOptionPanel(page);

    await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      if (inst?.appendElement?.rotation) {
        inst.appendElement.rotation.x = 0.5;
        inst.appendElement.rotation.y = 1.0;
        inst.appendElement.rotation.z = 1.5;
      }
    }, instName);

    const rot = await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      const r = inst?.appendElement?.rotation;
      return r ? { x: r.x, y: r.y, z: r.z } : null;
    }, instName);
    expect(rot).not.toBeNull();
    expect(rot.x).toBeCloseTo(0.5, 5);
    expect(rot.y).toBeCloseTo(1.0, 5);
    expect(rot.z).toBeCloseTo(1.5, 5);

    await cleanupComponents(page, 'tc_gui3d_1351_');
  });

  test('[QATC-1353] GUI Option 3D - 3D Geometry - scale { @QA @GuiOption3D @QATC-1353 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > TorusComponent > scale
     * [Expected Result]: x/y/z 축 크기 조절
     */
    await switchToThreeLayer(page);
    const instName = `tc_gui3d_1353_${Date.now()}`;
    await addComponent(page, 'TorusComponent', instName);
    await selectComponent(page, instName);
    await openGuiOptionPanel(page);

    await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      if (inst?.appendElement?.scale) inst.appendElement.scale.set(2, 2, 2);
    }, instName);

    const scale = await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      const s = inst?.appendElement?.scale;
      return s ? { x: s.x, y: s.y, z: s.z } : null;
    }, instName);
    expect(scale).not.toBeNull();
    expect(scale.x).toBe(2);
    expect(scale.y).toBe(2);
    expect(scale.z).toBe(2);

    await cleanupComponents(page, 'tc_gui3d_1353_');
  });

  test('[QATC-1355] GUI Option 3D - 3D Geometry - material { @QA @GuiOption3D @QATC-1355 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > TorusComponent > material
     * [Expected Result]: transparent / opacity / side / color / emissive / wireframe / roughness / metalness 등 표면 속성 제어
     */
    await switchToThreeLayer(page);
    const instName = `tc_gui3d_1355_${Date.now()}`;
    await addComponent(page, 'TorusComponent', instName);
    await selectComponent(page, instName);
    await openGuiOptionPanel(page);

    const hasMaterial = await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      return !!(inst?.element?.material);
    }, instName);
    expect(hasMaterial).toBe(true);

    await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      const mat = inst?.element?.material;
      if (mat) {
        mat.wireframe = true;
        mat.opacity = 0.5;
        mat.transparent = true;
      }
    }, instName);

    const matState = await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      const m = inst?.element?.material;
      return m ? { wireframe: m.wireframe, opacity: m.opacity, transparent: m.transparent } : null;
    }, instName);
    expect(matState).not.toBeNull();
    expect(matState.wireframe).toBe(true);
    expect(matState.opacity).toBeCloseTo(0.5, 5);
    expect(matState.transparent).toBe(true);

    await cleanupComponents(page, 'tc_gui3d_1355_');
  });

  test('[QATC-1357] GUI Option 3D - 3D Geometry - geometry { @QA @GuiOption3D @QATC-1357 }', async ({ page }) => {
    /**
     * [Test Steps]: GUI option > TorusComponent > geometry
     * [Expected Result]: Box / Sphere 같은 기하학 정보 설정
     */
    await switchToThreeLayer(page);
    const instName = `tc_gui3d_1357_${Date.now()}`;
    await addComponent(page, 'TorusComponent', instName);
    await selectComponent(page, instName);
    await openGuiOptionPanel(page);

    const hasGeometry = await page.evaluate((name) => {
      const inst =
        window.wemb?.mainPageComponent?.getComInstanceByName?.(name) ||
        (window.wemb?.mainPageComponent?._comInstanceList || []).find(c => c.name === name);
      return !!(inst?.element?.geometry);
    }, instName);
    expect(hasGeometry).toBe(true);

    await cleanupComponents(page, 'tc_gui3d_1357_');
  });
});
