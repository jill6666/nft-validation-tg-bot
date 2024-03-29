import { Context } from 'telegraf';
import { getConnector } from '../ton-connect/connector';
import { getWalletInfo } from '../ton-connect/wallets';
import { isTelegramUrl, encodeTelegramUrlParameters } from '@tonconnect/sdk';

async function onWalletClick(ctx: Context, walletName: string): Promise<void> {
  const chatId = ctx.chat?.id;
  console.log('chatId', chatId);
  if (!chatId) return;

  const connector = getConnector(chatId);

  const selectedWallet = await getWalletInfo(walletName);
  if (!selectedWallet) return;

  let buttonLink = connector.connect({
    bridgeUrl: selectedWallet?.bridgeUrl,
    universalLink: selectedWallet?.universalLink,
  });

  if (isTelegramUrl(selectedWallet?.universalLink)) {
    console.log('TELEGRAM_BOT_LINK');
    buttonLink = addTGReturnStrategy(
      buttonLink,
      process.env.TELEGRAM_BOT_LINK!,
    );
  }

  await ctx.reply('kkk', {
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
    message_thread_id: ctx.message?.message_id,
  });
}

function addTGReturnStrategy(link: string, strategy: string): string {
  const parsed = new URL(link);
  parsed.searchParams.append('ret', strategy);
  link = parsed.toString();

  const lastParam = link.slice(link.lastIndexOf('&') + 1);
  return (
    link.slice(0, link.lastIndexOf('&')) +
    '-' +
    encodeTelegramUrlParameters(lastParam)
  );
}

export default onWalletClick;
