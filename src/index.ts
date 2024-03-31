import { Telegraf } from 'telegraf';

import { about, disconnect, verifyHandler, callbacks } from './commands';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.command('about', about());
bot.command('disconnect', disconnect);
bot.command('verify', verifyHandler);
bot.on('callback_query', async (ctx) => {
  try {
    // @ts-ignore
    const data = JSON.parse(ctx?.callbackQuery?.data);
    const method = data?.method;
    const fn = callbacks[method as keyof typeof callbacks];

    if (!fn) return;
    await fn(ctx, data?.data);
  } catch (e) {
    console.log(e);
  }
});

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
process.env.NODE_ENV !== 'production' && development(bot);
