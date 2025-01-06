import { globalPage } from '../pages/GlobalPage.js';

describe('test', async () => {
  it('should test', async () => {
    await globalPage.openPage('https://lumenalta.com/jobs/senior-react-developer/apply');
  });
})