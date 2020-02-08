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

        try {
            const proxiedResponse = await fetch(apiUrl, {
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
