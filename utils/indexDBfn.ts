import localforage from 'localforage';
export const setIndexDBItemEnCodeKey = async (
  keys: string | string[],
  data: any
) => {
  if (typeof keys === 'string') {
    return await localforage.setItem(keys, data);
  } else {
    const encodeKey = keys.join('_');
    return await localforage.setItem(encodeKey, data);
  }
};

export const getIndexDBItem = async (keys: string | string[]): Promise<any> => {
  const enCodeKeys = typeof keys === 'string' ? keys : keys.join('_');
  return await localforage.getItem(enCodeKeys);
};

export const getHistoryToken = async ({
  address,
  chainId,
}): Promise<any[] | null> => {
  return await getIndexDBItem([address, chainId]);
};

export const addHistoryToken = async ({ address, chainId }, data) => {
  return await setIndexDBItemEnCodeKey([address, chainId], data);
};
