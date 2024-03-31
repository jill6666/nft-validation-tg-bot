import { Context, Input } from 'telegraf';
import { getConnector } from '../ton-connect/connector';
import { getWalletInfo } from '../ton-connect/wallets';
import { isTelegramUrl } from '@tonconnect/sdk';
import addTGReturnStrategy from './addTGReturnStrategy';
import createDebug from 'debug';
import { toBuffer } from 'qrcode';

const debug = createDebug('bot:on_wallet_click');

// method: select_wallet
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

export default onWalletClick;
