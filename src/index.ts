import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import { about } from './commands';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import { nftVerify } from './commands/nftValidate';
import onWalletClick from './utils/onWalletClick';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.command('about', about());
bot.on(message('sticker'), nftVerify());

bot.on('callback_query', async (ctx) => {
  // @ts-ignore
  const wallet = JSON.parse(ctx?.callbackQuery?.data)?.data;
  onWalletClick(ctx, wallet);
});

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
