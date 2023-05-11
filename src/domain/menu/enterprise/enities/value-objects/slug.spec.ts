import { describe, expect, it } from 'vitest';
import { Slug } from './slug';

describe('Slug', () => {
  it('should be able to create a slug from name and taste', () => {
    const slug = Slug.createFromNameAndTaste('Pot Cake', 'Chocolate');
    const slug2 = Slug.createFromNameAndTaste(
      'Bolo Vulcão',
      'Ninho com nutella',
    );

    expect(slug.value).toEqual('pot-cake-chocolate');
    expect(slug2.value).toEqual('bolo-vulcao-ninho-com-nutella');
  });
});
