function checkConnection() {
  // 没有环境直接为未连接
  //@ts-ignore
  if (!window?.ethereum) return null;
  //@ts-ignore
  return (window as any)?.ethereum
    ?.request({ method: 'eth_accounts' })
    .then((res) => {
      return res.length !== 0;
    })
    .catch(() => {
      return false;
    });
}
export default checkConnection;
