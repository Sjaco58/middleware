'use strict';

const fetch = require("node-fetch");

module.exports = {
    /**
     * Proxies a third party api with cors headers
     *
     * @param {Request} request - The Hapi request object
     * @returns {Promise<JSON>} - Promise which will be resolved to a JSON object representing the proxied response
     */

    simpleCorsProxy: async (request, h) => {
        const params = request.query;

        const apiUrl = params.apiUrl;

        const queryParams = Object.keys(params).reduce(function(acc, paramKey) {
            if(paramKey !== 'apiUrl') {
                acc.push(`${paramKey}=${params[paramKey]}`);
            }
            return acc;
        }, []);

        const fullApiUrl = queryParams.length ? `${apiUrl}?${queryParams.join('&')}` : apiUrl;

        try {
            const proxiedResponse = await fetch(fullApiUrl, {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                },
                cache: 'no-cache',
                referrer: 'no-referrer'
            });

            const json = await proxiedResponse.json();

            return h.response(json)
                .header('Access-Control-Allow-Origin', '*')
                .code(201);
        } catch(exception) {
            console.log(exception);
            return h.response(proxiedResponse)
                .header('Access-Control-Allow-Origin', '*');
        }
    }
};
