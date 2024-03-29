import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import { about } from './commands';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import { walletMenuCallbacks } from './commands/walletMenus';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.command('about', about());
bot.on(message('sticker'), walletMenuCallbacks.chose_wallet);
bot.on('callback_query', async (ctx) => {
  // @ts-ignore
  const data = JSON.parse(ctx?.callbackQuery?.data);
  const method = data?.method;

  if (!walletMenuCallbacks[method as keyof typeof walletMenuCallbacks]) return;
  walletMenuCallbacks[method as keyof typeof walletMenuCallbacks](
    ctx,
    data?.data,
  );
});

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
process.env.NODE_ENV !== 'production' && development(bot);
