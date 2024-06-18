function checkConnection() {
  // 没有环境直接为未连接
  if (!window?.ethereum?.request) return Promise.resolve(false);
  return window.ethereum
    .request({ method: 'eth_accounts' })
    .then((res) => {
      return res.length !== 0;
    })
    .catch((e) => {
      return false;
    });
}
export default checkConnection;
