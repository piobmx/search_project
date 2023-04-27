const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://localhost:2999',
			changeOrigin: true,
		})
	);

    app.use(
        '/v1',
        createProxyMiddleware({
			target: 'http://localhost:3000',
            changeOrigin: true,
        })
    );
};
