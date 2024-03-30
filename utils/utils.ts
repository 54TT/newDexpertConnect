export function getQueryParams() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const queryParams: any = {};

  params.forEach(function(value, key) {
    queryParams[key] = value;
  });

  return queryParams;
}