'use strict';

module.exports = {
    outDir: './out',
    testDb: 'mongodb://84.46.248.181/searchx-test',
    testUrl: 'http://84.46.248.181',
    cacheFreshness: 3600,
    scrapFreshness: 60 * 60 * 24,
    enableScrap : false,
    enableCache : false
};
