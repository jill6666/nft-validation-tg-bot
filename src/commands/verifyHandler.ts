import { Context, Input } from 'telegraf';
import { getWallets } from '../ton-connect/wallets';
import { toBuffer } from 'qrcode';
import { getConnector } from '../ton-connect/connector';
import handleUnSubscribe from '../utils/handleUnSubscribe';
import handleConnected from '../utils/handleConnected';
import getKeyboard from '../utils/getKeyboard';

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

  await newConnectRequestListenersMap.get(chatId)?.();

  const connector = getConnector(chatId, () => {
    unsubscribe();
    newConnectRequestListenersMap.delete(chatId);
    deleteMessage();
  });

  await connector.restoreConnection();

  if (connector.connected) {
    await handleConnected(ctx, connector);
    return;
  }

  const unsubscribe = connector.onStatusChange(async (wallet) => {
    if (wallet) {
      await deleteMessage();
      await handleUnSubscribe(ctx, connector);

      unsubscribe();
      newConnectRequestListenersMap.delete(chatId);
    }
  });

  const wallets = await getWallets();
  const link = connector.connect(wallets);
  const image = await toBuffer(link, { type: 'png' });
  const keyboard = getKeyboard(wallets);

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

  // Add listener to delete message when new connect request is received
  newConnectRequestListenersMap.set(chatId, async () => {
    unsubscribe();
    await deleteMessage();
    newConnectRequestListenersMap.delete(chatId);
  });
}
