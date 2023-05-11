export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(slug: string) {
    return new Slug(slug);
  }

  /**
   * Receives a name and taste and normalize it as a slug
   *
   * Example:
   * "Pot Cake" and "Chocolate"
   *
   * Retorn:
   * "pot-cake-chocolate"
   * @param name {string}
   * @param taste {string}
   */
  static createFromNameAndTaste(name: string, taste: string) {
    const slugName = name
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');

    const slugTaste = taste
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');

    return new Slug(`${slugName}-${slugTaste}`);
  }
}
