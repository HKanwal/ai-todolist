import { ReversedKeyvaluePipe } from './reversed-keyvalue.pipe';

describe('ReversedKeyvaluePipe', () => {
  it('create an instance', () => {
    const pipe = new ReversedKeyvaluePipe();
    expect(pipe).toBeTruthy();
  });
});
