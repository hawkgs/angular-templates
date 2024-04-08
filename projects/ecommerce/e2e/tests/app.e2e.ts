import { setupBrowserHooks, getBrowserState } from './utils';

describe('App', function () {
  setupBrowserHooks();

  it('is running', async function () {
    const { page } = getBrowserState();
    const element = await page.locator('ec-root').wait();

    expect(element).not.toBeNull();
  });
});
