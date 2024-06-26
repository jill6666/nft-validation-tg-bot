import { VercelRequest, VercelResponse } from '@vercel/node';
import createDebug from 'debug';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

const debug = createDebug('bot:dev');

const PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000;
const VERCEL_URL = `${process.env.VERCEL_URL}`;

const production = async (
  req: VercelRequest,
  res: VercelResponse,
  bot: Telegraf<Context<Update>>,
) => {
  try {
    debug('Bot runs in production mode');
    debug(`setting webhook: ${VERCEL_URL}`);

    if (!VERCEL_URL) throw new Error('VERCEL_URL is not set.');

    const getWebhookInfo = await bot.telegram.getWebhookInfo();

    if (getWebhookInfo.url !== VERCEL_URL + '/api') {
      debug(`deleting webhook ${VERCEL_URL}`);
      await bot.telegram.deleteWebhook();

      debug(`setting webhook: ${VERCEL_URL}/api`);
      await bot.telegram.setWebhook(`${VERCEL_URL}/api`);
    }

    await bot.handleUpdate(req.body as unknown as Update, res);
  } catch (e) {
    debug(`Error: ${e}`);
  }
};
export { production };
