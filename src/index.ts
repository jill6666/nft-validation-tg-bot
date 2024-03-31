import { Telegraf } from 'telegraf';

import { about } from './commands';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import { walletMenuCallbacks } from './commands/walletMenu';
import disconnect from './commands/disconnect';
import { verifyHandler } from './commands/verifyHandler';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.command('about', about());
bot.command('disconnect', disconnect);
bot.command('verify', verifyHandler);
bot.on('callback_query', async (ctx) => {
  try {
    // @ts-ignore
    const data = JSON.parse(ctx?.callbackQuery?.data);
    const method = data?.method;
    const fn = walletMenuCallbacks[method as keyof typeof walletMenuCallbacks];

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
