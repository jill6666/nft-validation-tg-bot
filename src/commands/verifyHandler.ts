import { Context, Input } from 'telegraf';
import { CHAIN, toUserFriendlyAddress } from '@tonconnect/sdk';
import { getWallets, getWalletInfo } from '../ton-connect/wallets';
import { toBuffer } from 'qrcode';
import { getConnector } from '../ton-connect/connector';
import checkNftOwnership from '../utils/checkNftOwnership';
import adminWhitelist from '../utils/adminWhitelist';

let newConnectRequestListenersMap = new Map<number, () => void>();

/**
 * @description Handler for the /verify command
 * 1. send QRCode with wallets list to connect the wallet
 * 2. handle the wallet selection in /callback_handler
 * @param {Context} ctx - Telegram bot context
 */
export async function verifyHandler(ctx: Context): Promise<void> {
  const chatId = ctx.chat?.id;
  let messageWasDeleted = false;

  if (!chatId) throw new Error('Chat not found');

  newConnectRequestListenersMap.get(chatId)?.();

  const connector = getConnector(chatId, () => {
    unsubscribe();
    newConnectRequestListenersMap.delete(chatId);
    deleteMessage();
  });

  await connector.restoreConnection();

  if (connector.connected) {
    const connectedName =
      (await getWalletInfo(connector.wallet!.device.appName))?.name ||
      connector.wallet!.device.appName;
    await ctx.sendMessage(
      `You have already connect ${connectedName} wallet\nYour address: ${toUserFriendlyAddress(
        connector.wallet!.account.address,
        connector.wallet!.account.chain === CHAIN.TESTNET,
      )}\n\n Disconnect wallet firstly to connect a new one`,
    );

    return;
  }

  const unsubscribe = connector.onStatusChange(async (wallet) => {
    if (wallet) {
      await deleteMessage();

      const address = connector.account?.address;
      if (!address) throw new Error('Address not found');
      const userFriendlyAddress = toUserFriendlyAddress(
        connector.wallet!.account.address,
        connector.wallet!.account.chain === CHAIN.TESTNET,
      );

      const userId = ctx.from?.id;
      const isAdmin = await adminWhitelist(userId!);
      const hasPermission = await checkNftOwnership({
        address: userFriendlyAddress,
        collection: 'EQCV8xVdWOV23xqOyC1wAv-D_H02f7gAjPzOlNN6Nv1ksVdL',
      });

      const userName =
        `@${ctx.from?.username}` ||
        `${ctx.from?.first_name} ${ctx.from?.last_name || ''}` ||
        userFriendlyAddress;

      if (isAdmin || hasPermission)
        await ctx.sendMessage(`Welcome, ${userName} ! 🎉`);
      else {
        await ctx.sendMessage(
          `You don't have permission to access this group chat. Please contact the group admin for more information.`,
        );
        await ctx.banChatMember(ctx.from?.id!);
      }

      unsubscribe();
      newConnectRequestListenersMap.delete(chatId);
    }
  });

  const wallets = await getWallets();
  const link = connector.connect(wallets);
  const image = await toBuffer(link, { type: 'png' });

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

  const botMessage = await ctx.sendPhoto(Input.fromBuffer(image), {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });

  const deleteMessage = async (): Promise<void> => {
    if (!messageWasDeleted) {
      messageWasDeleted = true;
      await ctx.deleteMessage(botMessage.message_id);
    }
  };

  newConnectRequestListenersMap.set(chatId, async () => {
    unsubscribe();

    await deleteMessage();

    newConnectRequestListenersMap.delete(chatId);
  });
}
