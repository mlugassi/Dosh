import Comment from './Comment';

describe('Comment', () => {
  it('should create an instance', () => {
    expect(new Comment("", "", "", "", "")).toBeTruthy();
  });
});
