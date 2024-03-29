import { Context } from 'telegraf';
import createDebug from 'debug';
import checkUserExsist from '../utils/checkUserExsist';
import { getWallets } from '../ton-connect/wallets';

const debug = createDebug('bot:about_command');

const nftVerify = () => async (ctx: Context) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) throw new Error('User not found');

    const userVarified = await checkUserExsist(userId);
    if (!Boolean(userVarified)) {
      const wallets = await getWallets();

      ctx.reply('To check for the presence of NFT, connect your wallet', {
        reply_markup: {
          inline_keyboard: [
            wallets.map((wallet) => ({
              text: wallet.name,
              callback_data: JSON.stringify({
                method: 'select_wallet',
                data: wallet.appName,
              }),
            })),
          ],
        },
      });
    } else {
      ctx.reply('You are already verified! 🎉');
    }
  } catch (e) {
    console.log(e);
    debug(`Error in "nftVerify": ${JSON.stringify(e)}`);
  }
};

export { nftVerify };
