type TTempStorage = {
  [userId: number]: {
    address: string;
  };
};

const TempStorage: TTempStorage = {
  2131460787: { address: 'UQC1FTqL9LG8dSe9nY25UFeZ3yN1g4iUoYg8AG2B' },
};
/**
 *
 * @description Check if the user is in the admin whitelist
 */
export const checkUserExsist = (userId: number) => {
  // TODO: Implement admin whitelist logic
  console.log('userId', userId);
  return TempStorage?.[userId];
};

export default checkUserExsist;
