import { IStorage } from '@tonconnect/sdk';
import { kv } from '@vercel/kv';

export class TonConnectStorage implements IStorage {
  constructor(private readonly chatId: number) {}
  private getKey(key: string): string {
    return this.chatId.toString() + key;
  }

  async removeItem(key: string): Promise<void> {
    await kv.del(this.getKey(key));
  }

  async setItem(key: string, value: string): Promise<void> {
    await kv.set(this.getKey(key), JSON.stringify(value));
  }

  async getItem(key: string): Promise<string | null> {
    return (await kv.get(this.getKey(key))) || null;
  }
}
