import { Context } from 'telegraf';
import createDebug from 'debug';
import { getConnector } from '../ton-connect/connector';

const debug = createDebug('bot:about_command');

export const disconnect = async (ctx: Context) => {
  try {
    const chatId = ctx.chat?.id;
    if (!chatId) throw new Error('Chat not found');

    const connector = getConnector(chatId);
    await connector.restoreConnection();

    let msg = 'Wallet has been disconnected';

    if (!connector.connected) {
      await ctx.sendMessage("You didn't connect a wallet");
      return;
    }

    await connector.disconnect();
    await ctx.sendMessage(msg);
  } catch (e) {
    console.log(e);
    debug(`Error in "disconnect": ${JSON.stringify(e)}`);
  }
};

export default disconnect;
