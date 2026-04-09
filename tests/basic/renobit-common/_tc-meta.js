function toBulletLines(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

async function attachTcMeta(testInfo, meta) {
  const lines = [
    `TC ID: ${meta.id}`,
    `Title: ${meta.title}`,
    '',
    'Preconditions:',
    toBulletLines(meta.preconditions),
    '',
    'Expected Results:',
    toBulletLines(meta.expectedResults),
  ];

  testInfo.annotations.push({ type: 'tc-id', description: meta.id });
  testInfo.annotations.push({ type: 'tc-title', description: meta.title });
  testInfo.annotations.push({
    type: 'precondition',
    description: meta.preconditions.join(' | '),
  });
  testInfo.annotations.push({
    type: 'expected-result',
    description: meta.expectedResults.join(' | '),
  });

  await testInfo.attach('tc-meta', {
    body: Buffer.from(lines.join('\n'), 'utf8'),
    contentType: 'text/plain',
  });
}

module.exports = {
  attachTcMeta,
};
