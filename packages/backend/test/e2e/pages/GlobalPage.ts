import { browser } from '@wdio/globals';

class GlobalPage {
  async openPage(page: string): Promise<void> {
    await browser.url(page);
    await expect(browser).toHaveUrl('https://www.npmjs.com/package/@wdio/types');
  }
}

export const globalPage: GlobalPage = new GlobalPage();