import { scanDir, rules } from './runSecurityScan';

describe('Security scan', () => {
  jest.setTimeout(30000);

  test('insecure project has expected findings', async () => {
    const findings = await scanDir('insecure');
    const ruleIds = findings.map((f) => f.ruleId);
    expect(ruleIds).toEqual(
      expect.arrayContaining([
        'HARDCODED_KEY',
        'CLIENT_DEBUG_LEAK',
        'DANGEROUS_HTML',
        'INSECURE_FETCH',
        'UNAUTH_ADMIN',
        'ENV_LEAK'
      ])
    );
    expect(findings.length).toBeGreaterThanOrEqual(6);
  });

  test('secure project has no findings', async () => {
    const findings = await scanDir('secure');
    expect(findings).toHaveLength(0);
  });
});
