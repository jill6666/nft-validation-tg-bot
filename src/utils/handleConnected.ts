import { Context } from 'telegraf';
import { CHAIN, toUserFriendlyAddress, TonConnect } from '@tonconnect/sdk';
import { getWalletInfo } from '../ton-connect/wallets';

async function handleConnected(ctx: Context, connector: TonConnect) {
  const connectedName =
    (await getWalletInfo(connector.wallet!.device.appName))?.name ||
    connector.wallet!.device.appName;

  await ctx.sendMessage(
    `You have already connect ${connectedName} wallet\nYour address: ${toUserFriendlyAddress(
      connector.wallet!.account.address,
      connector.wallet!.account.chain === CHAIN.TESTNET,
    )}\n\n Disconnect wallet firstly to connect a new one`,
  );
}
export default handleConnected;
