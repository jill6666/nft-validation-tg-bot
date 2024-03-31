import {
  encodeTelegramUrlParameters,
  isTelegramUrl,
  WalletInfoRemote,
} from '@tonconnect/sdk';
import { InlineKeyboardButton } from 'node-telegram-bot-api';
import addTGReturnStrategy from './addTGReturnStrategy';

const AT_WALLET_APP_NAME = 'telegram-wallet';

async function buildUniversalKeyboard(
  link: string,
  wallets: WalletInfoRemote[],
): Promise<InlineKeyboardButton[]> {
  const atWallet = wallets.find(
    (wallet) => wallet.appName.toLowerCase() === AT_WALLET_APP_NAME,
  );
  const atWalletLink = atWallet
    ? addTGReturnStrategy(
        convertDeeplinkToUniversalLink(link, atWallet?.universalLink),
        process.env.TELEGRAM_BOT_LINK!,
      )
    : undefined;

  const keyboard = [
    {
      text: 'Choose a Wallet',
      callback_data: JSON.stringify({ method: 'chose_wallet' }),
    },
    {
      text: 'Open Link',
      url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(link)}`,
    },
  ];

  if (atWalletLink) {
    keyboard.unshift({
      text: '@wallet',
      url: atWalletLink,
    });
  }

  return keyboard;
}
export default buildUniversalKeyboard;

function convertDeeplinkToUniversalLink(
  link: string,
  walletUniversalLink: string,
): string {
  const search = new URL(link).search;
  const url = new URL(walletUniversalLink);

  if (isTelegramUrl(walletUniversalLink)) {
    const startattach =
      'tonconnect-' + encodeTelegramUrlParameters(search.slice(1));
    url.searchParams.append('startattach', startattach);
  } else {
    url.search = search;
  }

  return url.toString();
}
