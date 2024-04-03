interface IButtons {
  text: string;
  callback_data: string;
}
/**
 *
 * @description Generates a keyboard layout for the Telegram bot
 * @returns
 */
function getKeyboard(buttons: IButtons[], cols = 2) {
  const length = buttons.length;
  const rows = Math.ceil(length / cols); // Calculate the number of rows
  const keyboard = [];

  for (let i = 0; i < rows; i++) {
    const row = buttons.slice(i * cols, (i + 1) * cols);
    keyboard.push(row);
  }

  return keyboard;
}

export default getKeyboard;
