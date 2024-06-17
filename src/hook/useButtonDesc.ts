const useButtonDesc = (id: string) => {
  const desc = {
    '1': 'Swap',
    '2': 'Connect Wallet',
    '3': 'Unsupported Chain',
    '4': 'Insufficient Balance',
  };
  return [desc[id]];
};

export default useButtonDesc;
