import { Context, Input } from 'telegraf';
import { getConnector } from '../ton-connect/connector';
import { getWalletInfo, getWallets } from '../ton-connect/wallets';
import { isTelegramUrl } from '@tonconnect/sdk';
import addTGReturnStrategy from '../utils/addTGReturnStrategy';
import createDebug from 'debug';
import { toBuffer } from 'qrcode';

const debug = createDebug('bot:wallet_menu_callbacks');

export const callbacks = {
  select_wallet: onWalletClick,
  chose_wallet: onChooseWallet,
};

async function onWalletClick(ctx: Context, walletName: string): Promise<void> {
  try {
    const chatId = ctx.chat?.id;
    if (!chatId) throw new Error('Chat not found');

    const connector = getConnector(chatId);

    const selectedWallet = await getWalletInfo(walletName);
    if (!selectedWallet) throw new Error('Wallet not found');

    let buttonLink = connector.connect({
      bridgeUrl: selectedWallet?.bridgeUrl,
      universalLink: selectedWallet?.universalLink,
    });

    if (isTelegramUrl(selectedWallet?.universalLink)) {
      buttonLink = addTGReturnStrategy(
        buttonLink,
        process.env.TELEGRAM_BOT_LINK!,
      );
    }
    const image = await toBuffer(buttonLink, { type: 'png' });
    await ctx.editMessageMedia(
      {
        type: 'photo',
        media: Input.fromBuffer(image),
      },
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '« Back',
                callback_data: JSON.stringify({ method: 'chose_wallet' }),
              },
              {
                text: `Open ${selectedWallet?.name}`,
                url: buttonLink,
              },
            ],
          ],
        },
      },
    );
  } catch (e) {
    debug(`Error in "onChooseWallet": ${JSON.stringify(e)}`);
  }
}

async function onChooseWallet(ctx: Context): Promise<void> {
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

    await ctx.editMessageReplyMarkup({ inline_keyboard: keyboard });
  } catch (e) {
    console.log(e);
    debug(`Error in "onChooseWallet": ${JSON.stringify(e)}`);
  }
}
