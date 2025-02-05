import { Storage, StoreItems, ConversationReference } from 'botbuilder';
import * as fs from 'fs';
import * as path from 'path';

export class MyStorage implements Storage {

  private storagePath: string;

  constructor() {
    this.storagePath = path.join(__dirname, '../../.notification.json');
    // Ensure the directory exists
    const dir = path.dirname(this.storagePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Initialize the storage file if it doesn't exist
    if (!fs.existsSync(this.storagePath)) {
      fs.writeFileSync(this.storagePath, JSON.stringify({}));
    }
  }
  

  private storage: { [key: string]: any } = {};

  public async read(key: [string]): Promise<StoreItems> {
    console.log('Reading key:', key, typeof key);

    if (typeof key !== 'string') {
      throw new Error('Invalid key');
    }
    const items: StoreItems = {};
    if (this.storage[key]) {
      items[key] = this.storage[key];
    }
    return items;
  }

   async write(changes: { [key: string]: unknown }): Promise<void> {
    if (!changes || typeof changes !== 'object') {
      throw new Error('Invalid changes object');
    }
    Object.keys(changes).forEach(key => {
      this.storage[key] = changes[key];
    });
  }

  async delete(keys: string[]): Promise<void> {
    if (!Array.isArray(keys)) {
      throw new Error('Invalid keys array');
    }
    keys.forEach(key => {
      delete this.storage[key];
    });
  }

  async list(): Promise<PagedData<Partial<ConversationReference>>> {
    const data = await this.getDataFromStorage(); // Your existing implementation

    return { data: data as Partial<ConversationReference>[] }; // Ensure it's an array
}


private async getDataFromStorage(): Promise<Partial<ConversationReference>[]> {
  const data = await this.getDataFromStorage();
  return Array.isArray(data) ? data : [data];
  }

    async add(key: string, value: any): Promise<boolean> {
  
      // Your implementation here
  
      return true; // or false based on your logic
  
    }

    async remove(key: string): Promise<boolean> {

      // Implementation...
  
      return true; // or false based on your logic
  
    }
}

interface PagedData<T> {
  data: T[];
  totalCount?: number; // Optional, if you need total count
  page?: number; // Optional, if you have pagination
  pageSize?: number; // Optional, if you have pagination
}
