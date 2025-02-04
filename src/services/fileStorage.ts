import { promises as fs } from 'fs';
import * as path from 'path';
import { Storage, StoreItems } from 'botbuilder';

export class FileStorage implements Storage {
  private storagePath: string;

  constructor(storagePath?: string) {
    if (storagePath) {
      this.storagePath = storagePath;
    } else if (process.env.RUNNING_ON_AZURE === '1') {
      this.storagePath = path.join(process.env.TEMP || '/tmp', '.notification.localstore.json');
    } else {
      this.storagePath = path.join(__dirname, '../../.notification.localstore.json');
    }
    console.log(`FileStorage initialized with path: ${this.storagePath}`);
  }


  private async readFile(): Promise<StoreItems> {
    try {
      const data = await fs.readFile(this.storagePath, 'utf8');
      console.log(`Read data from ${this.storagePath}:`, data);
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`File not found: ${this.storagePath}. Returning empty object.`);
        return {};
      }
      throw error;
    }
  }

  private async writeFile(data: StoreItems): Promise<void> {
    await fs.writeFile(this.storagePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Wrote data to ${this.storagePath}:`, JSON.stringify(data, null, 2));
  }

  public async read(keys: string | string[]): Promise<StoreItems> {
    console.log("Reading keys:", keys, "Type:", typeof keys);

    if (typeof keys === "string") {
        keys = [keys]; // Convert single string to an array
    } else if (!Array.isArray(keys)) {
        throw new Error("Invalid argument: keys must be a string or an array of strings");
    }

    const data = await this.readFile();
    const result: StoreItems = {};
    
    keys.forEach(key => {
        if (data[key]) {
            result[key] = data[key];
        }
    });

    return result;
}


  public async write(changes: { [key: string]: unknown }): Promise<void> {
    const data = await this.readFile();
    Object.keys(changes).forEach(key => {
      data[key] = changes[key];
    });
    await this.writeFile(data);
  }

  public async delete(keys: string[]): Promise<void> {
    const data = await this.readFile();
    keys.forEach(key => {
      delete data[key];
    });
    await this.writeFile(data);
  }

  public async list(): Promise<{ [key: string]: unknown }[]> {
    const data = await this.readFile();
    return Object.keys(data).map(key => ({ [key]: data[key] }));
  }
}