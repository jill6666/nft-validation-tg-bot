import { toFile } from 'qrcode';
import * as fs from 'fs';
import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:on_edit_qr');

async function editQR(ctx: Context, link: string): Promise<void> {
  try {
    const fileName = 'QR-code-' + Math.round(Math.random() * 10000000000);

    debug(link);
    toFile(`./${fileName}`, link);

    await ctx.editMessageMedia({
      media: `attach://${fileName}`,
      type: 'photo',
    });

    await new Promise((r) => fs.rm(`./${fileName}`, r));
  } catch (e) {
    console.log(e);
    debug(`Error in "editQR": ${JSON.stringify(e)}`);
  }
}
export default editQR;
