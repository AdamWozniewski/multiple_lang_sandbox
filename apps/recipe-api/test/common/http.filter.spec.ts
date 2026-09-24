import { HttpFilter } from '../../src/common/filters/http.filter';

describe('HttpFilter', () => {
  it('should be defined', () => {
    expect(new HttpFilter()).toBeDefined();
  });
});
