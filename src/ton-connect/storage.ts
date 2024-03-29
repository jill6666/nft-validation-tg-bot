import { IStorage } from '@tonconnect/sdk';

type TTempStorage = { [key: string]: any };
let Storage: TTempStorage = {};

export class TonConnectStorage implements IStorage {
  constructor(private readonly chatId: number) {}

  private getKey(key: string): string {
    return this.chatId.toString() + key;
  }

  async removeItem(key: string): Promise<void> {
    delete Storage[this.getKey(key)];
  }

  async setItem(key: string, value: string): Promise<void> {
    Storage[this.getKey(key)] = value;
  }

  async getItem(key: string): Promise<string | null> {
    return Storage[this.getKey(key)] || null;
  }
}
