export function getQueryParams() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const queryParams: any = {};
  params.forEach(function(value, key) {
    queryParams[key] = value;
  });
  return queryParams;
}

export const formatAddress = (address: string) => {
  if (typeof address !== 'string') return '';
  if (address.length <= 10) return address
  return `${address.slice(0,5)}...${address.slice(address.length - 4, address.length)}`
}