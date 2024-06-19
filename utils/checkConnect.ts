function checkConnection() {
  // 没有环境直接为未连接
  //@ts-ignore
  if (!window?.ethereum?.request) return Promise.resolve(false);
  //@ts-ignore
  return window.ethereum
    .request({ method: 'eth_accounts' })
    .then((res) => {
      return res.length !== 0;
    })
    .catch(() => {
      return false;
    });
}
export default checkConnection;
