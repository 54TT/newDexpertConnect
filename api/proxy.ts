const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
  let target = "";
  //     I! 代理目标地址
  //     // 这里使用 backend 主要用于区分 vercel serverless 的 api 路径
  if (req.url.startswith("/api")) {
    target = "http://165.22.51.161:8081";
  }
  //     target =http://backend-api.com
  //     11创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      "^/api/": "/api",
    },
  })(req, res);
};
