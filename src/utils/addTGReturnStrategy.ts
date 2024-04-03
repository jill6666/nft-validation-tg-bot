import { encodeTelegramUrlParameters } from '@tonconnect/sdk';

/**
 *
 * @description Add the return strategy to the Telegram link
 */
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

export default addTGReturnStrategy;
