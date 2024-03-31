type TTempStorage = {
  [userId: number]: {
    address: string;
  };
};
const TempStorage: TTempStorage = {
  2131460787: { address: 'UQC1FTqL9LG8dSe9nY25UFeZ3yN1g4iUoYg8AG2B' },
  // 7054456958: { address: 'UQA0zP0Qt_e3wijio3a3OnqUYa9MO1oKko4c2u75YYdTATLF' },
};

export const checkUserExsist = (userId: number) => {
  console.log('userId', userId);
  return TempStorage?.[userId];
};

export default checkUserExsist;
