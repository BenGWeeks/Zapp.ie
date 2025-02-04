import { Storage, StoreItems } from 'botbuilder';

export class MyStorage implements Storage {

  private storage: { [key: string]: any } = {};

  public async read(keys: string[]): Promise<StoreItems> {
    console.log('Reading keys:');
    if (!Array.isArray(keys)) {
      throw new Error('Invalid keys array');
    }
    console.log('Reading keys:');
    const items: StoreItems = {};
    keys.forEach(key => {
      if (this.storage[key]) {
        items[key] = this.storage[key];
      }
    });
    return items;
  }

  public async write(changes: { [key: string]: unknown }): Promise<void> {
    if (!changes || typeof changes !== 'object') {
      throw new Error('Invalid changes object');
    }
    Object.keys(changes).forEach(key => {
      this.storage[key] = changes[key];
    });
  }

  public async delete(keys: string[]): Promise<void> {
    if (!Array.isArray(keys)) {
      throw new Error('Invalid keys array');
    }
    keys.forEach(key => {
      delete this.storage[key];
    });
  }

  public async list(): Promise<{ [key: string]: unknown }[]> {
    console.log('Reading keys:')
    return Object.keys(this.storage).map(key => ({ [key]: this.storage[key] }));
  }
}