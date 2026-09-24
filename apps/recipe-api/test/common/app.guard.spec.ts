import { AppGuard } from '../../src/common/guards/app/app.guard';

describe('AppGuard', () => {
  it('should be defined', () => {
    expect(new AppGuard()).toBeDefined();
  });
});
