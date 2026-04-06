#!/usr/bin/env node
/**
 * 테스트용 fixture 파일 생성 스크립트
 * 실행: node tests/fixtures/create-fixtures.js
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;

// 1. page.json — ImportPagesCommand가 읽을 수 있는 최소 page export 포맷
fs.writeFileSync(
  path.join(dir, 'page.json'),
  JSON.stringify(
    {
      data: {
        page_info: {
          id: 'fixture-page-id',
          name: 'fixture-page',
          type: 'page',
          secret: 'N',
          props: {
            setter: {
              width: 1920,
              height: 1080,
              mode: true,
              type: 'page',
              scene_info: '',
              template_yn: 'N',
              camera: {
                x: -100,
                y: 100,
                z: 100,
              },
            },
            background: {
              using: false,
              type: 'color',
              data: {
                color: '#ffffff',
              },
            },
            events: {
              loadstart: '',
              loadcomplete: '',
              ready: '',
              unload: '',
            },
          },
        },
        master_info: {
          background: {
            color: '',
            path: '',
            image: '',
            using: false,
          },
          master_layer: [],
          scripts: {},
        },
        stage_info: {
          background: {
            color: '',
            path: '',
            image: '',
            using: false,
          },
        },
        content_info: {
          two_layer: [],
          three_layer: [],
        },
      },
    },
    null,
    2
  )
);

// 2. dataset.json — 최소 유효 데이터셋 포맷
fs.writeFileSync(
  path.join(dir, 'dataset.json'),
  JSON.stringify(
    {
      version: '3.5.0',
      data: [
        {
          dataset_id: 'fixture-ds-01',
          name: 'fixture_dataset',
          description: 'fixture dataset',
          data_type: 1,
          delivery_type: 0,
          interval: 10,
          rest_api:
            '{"url":"https://jsonplaceholder.typicode.com/todos","method":"GET","contentType":"application/json;charset=UTF-8","dataType":"json","data":{}}',
          query: '',
          query_type: 0,
          param_info: [],
          datasource: '',
        },
      ],
      datasource: [],
    },
    null,
    2
  )
);

// 3. 1x1 흰색 PNG (image.jpg, image.png 공용)
const pngBytes = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==',
  'base64'
);
fs.writeFileSync(path.join(dir, 'image.jpg'), pngBytes);
fs.writeFileSync(path.join(dir, 'image.png'), pngBytes);

// 4. 최소 유효 ZIP (빈 ZIP 엔드 레코드)
const emptyZip = Buffer.from('504B050600000000000000000000000000000000000000000000', 'hex');
const zipFiles = ['resources.zip', 'total_data.zip', 'sprite.zip', 'gltf.zip', 'lottie.zip', 'state_clip.zip', 'hdr.zip', 'asset_gltf.zip'];
for (const f of zipFiles) {
  fs.writeFileSync(path.join(dir, f), emptyZip);
}

console.log('✓ Fixture files created in tests/fixtures/');
console.log('  - page.json, dataset.json');
console.log('  - image.jpg, image.png');
console.log('  - ' + zipFiles.join(', '));
console.log('\n※ 실제 검증이 필요한 import 테스트는 유효한 파일로 교체 필요');
