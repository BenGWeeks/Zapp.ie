const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');



dotenv.config();

console.log('Environment variables:', process.env.REACT_APP_LNBITS_NODE_URL);

module.exports = function (app) {
  const target = process.env.REACT_APP_LNBITS_NODE_URL;


  console.log('setupProxy.js is being executed');
  console.log('API URL:', target);


  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: { '^/api/v1': '/api/v1' },
      timeout: 5000, // Increase timeout to 5 seconds
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${target}${req.url}`);

      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`Proxy response from: ${target}${req.url}`);
        console.log('Response status code:', proxyRes.statusCode);
        console.log('Response headers:', JSON.stringify(proxyRes.headers));
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);

      },
    })
  );

  app.use(
    '/usermanager/api/v1',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: { '^/usermanager/api/v1': '/usermanager/api/v1' },
      timeout: 5000, // Increase timeout to 5 seconds
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${target}${req.url}`);

      
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`Proxy response from: ${target}${req.url}`);
        console.log('Response status code:', proxyRes.statusCode);
        console.log('Response headers:', JSON.stringify(proxyRes.headers));
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);

      },
    })
  );

  app.use(
    '/users/api/v1',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: { '^/users/api/v1': '/users/api/v1' },
      timeout: 5000, // Increase timeout to 5 seconds
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${target}${req.url}`);

      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`Proxy response from: ${target}${req.url}`);
        console.log('Response status code:', proxyRes.statusCode);
        console.log('Response headers:', JSON.stringify(proxyRes.headers));
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);

      },
    })
  );

  app.use(
    '/lnurlp/api/v1',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: { '^/lnurlp/api/v1': '/lnurlp/api/v1' },
      timeout: 5000, // Increase timeout to 5 seconds
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${target}${req.url}`);
        
        console.log('Request Headers:', JSON.stringify(proxyReq.getHeaders()));
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`Proxy response from: ${target}${req.url}`);
        console.log('Response status code:', proxyRes.statusCode);
        console.log('Response headers:', JSON.stringify(proxyRes.headers));
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
      },
    })
  );

  // Add the new endpoint for nostrmarket/api/v1
  app.use(
    '/nostrmarket/api/v1',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: { '^/nostrmarket/api/v1': '/nostrmarket/api/v1' },
      timeout: 5000, // Increase timeout to 5 seconds
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${target}${req.url}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`Proxy response from: ${target}${req.url}`);
        console.log('Response status code:', proxyRes.statusCode);
        console.log('Response headers:', JSON.stringify(proxyRes.headers));
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);

      },
    })
  );
};

