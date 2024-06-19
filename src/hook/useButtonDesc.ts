const useButtonDesc = (id: string) => {
  const desc = {
    '1': 'Swap',
    '2': 'Connect Wallet',
    '3': 'Unsupported Chain',
    '4': 'Insufficient Balance',
    '5': 'Waiting Approve',
    '6': 'Waiting Permit',
    '7': 'Calculating Amount',
  };
  return [desc[id]];
};

export default useButtonDesc;
