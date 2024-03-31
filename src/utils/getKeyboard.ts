import { WalletInfoRemote } from '@tonconnect/sdk';

function getKeyboard(wallets: WalletInfoRemote[]) {
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

  return keyboard;
}

export default getKeyboard;
