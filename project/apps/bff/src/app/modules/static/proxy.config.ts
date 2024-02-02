import { createProxyMiddleware } from 'http-proxy-middleware';

export const ImageUploaderProxy = createProxyMiddleware({
  target: process.env.STATIC_URL,
  changeOrigin: true,
  logLevel: 'info',
});
