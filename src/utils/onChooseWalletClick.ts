import { Context } from 'telegraf';
import createDebug from 'debug';
import { getWallets } from '../ton-connect/wallets';

const debug = createDebug('bot:on_choose_wallet');

const onChooseWallet = async (ctx: Context) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) throw new Error('User not found');

    const wallets = await getWallets();
    const buttons = wallets.map((wallet) => ({
      text: wallet.name,
      callback_data: JSON.stringify({
        method: 'select_wallet',
        data: wallet.appName,
      }),
    }));
    const length = buttons.length;
    const cols = 2; // Number of columns
    const rows = Math.ceil(length / cols); // Calculate the number of rows
    const keyboard = [];

    for (let i = 0; i < rows; i++) {
      const row = buttons.slice(i * cols, (i + 1) * cols);
      keyboard.push(row);
    }

    await ctx.editMessageMedia({
      type: 'photo',
      media: 'https://i.imgur.com/8nLFCVP.png',
    });
    await ctx.editMessageReplyMarkup({ inline_keyboard: keyboard });
  } catch (e) {
    console.log(e);
    debug(`Error in "onChooseWallet": ${JSON.stringify(e)}`);
  }
};

export default onChooseWallet;
