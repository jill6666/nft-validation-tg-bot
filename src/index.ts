import { Telegraf } from 'telegraf';

import { disconnect, verifyHandler, walletCallbacks } from './commands';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

const callbacks = { ...walletCallbacks };

bot.on('callback_query', async (ctx) => {
  try {
    // @ts-ignore
    const request = JSON.parse(ctx?.callbackQuery?.data);
    const method = request?.method;
    const fn = callbacks[method as keyof typeof callbacks];

    if (!fn) return;
    await fn(ctx, request?.data);
  } catch (e) {
    console.log(e);
  }
});

bot.command('disconnect', disconnect);
bot.command('verify', verifyHandler);

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
process.env.NODE_ENV !== 'production' && development(bot);
