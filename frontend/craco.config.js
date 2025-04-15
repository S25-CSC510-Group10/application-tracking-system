const path = require('path');

module.exports = {
    devServer: (devServerConfig) => {
        devServerConfig.historyApiFallback = {
            disableDotRule: true,
            rewrites: [
                { from: /^\/service-worker\.js$/, to: '/service-worker.js' },
                { from: /^\/application-tracking-system\/.*$/, to: '/baby' },
            ],
        };
        return devServerConfig;
    },
};