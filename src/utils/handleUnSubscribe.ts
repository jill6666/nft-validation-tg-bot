import { Context } from 'telegraf';
import { CHAIN, toUserFriendlyAddress, TonConnect } from '@tonconnect/sdk';
import checkNftOwnership from './checkNftOwnership';
import adminWhitelist from './adminWhitelist';

/**
 *
 * @description Handle the case when the user is already connected to the wallet
 */
async function handleUnSubscribe(ctx: Context, connector: TonConnect) {
  const address = connector.account?.address;
  if (!address) throw new Error('Address not found');

  const userFriendlyAddress = toUserFriendlyAddress(
    connector.wallet!.account.address,
    connector.wallet!.account.chain === CHAIN.TESTNET,
  );

  const userId = ctx.from?.id;
  if (!userId) throw new Error('User ID not found');

  const isAdmin = Boolean(adminWhitelist(userId));
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
}

export default handleUnSubscribe;
