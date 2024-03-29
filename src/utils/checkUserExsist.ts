type TTempStorage = {
  [userId: number]: {
    address: string;
  };
};
const TempStorage: TTempStorage = {
  // 2131460787: { address: 'UQC1FTqL9LG8dSe9nY25UFeZ3yN1g4iUoYg8AG2B' },
};

export const checkUserExsist = async (userId: number) => {
  return TempStorage?.[userId];
};

export default checkUserExsist;
