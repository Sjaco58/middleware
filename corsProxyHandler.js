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
        const query = request.query;
        const apiUrl = query.apiUrl;

        var keys = Object.keys(query);
        var values = Object.values(query);

        console.log(keys);

        var queryParams = [];

        for (var i = 0; i < keys.length; i++) {
            if(keys[i] !== 'apiUrl') {
                queryParams.push(keys[i] + '=' + values[i]);
            }
        }

        if (queryParams.length === 0) {
            fullApiUrl = apiUrl;
        } else {
            var fullApiUrl = apiUrl + '?' + queryParams.join('&');
        }
        console.log(fullApiUrl);
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
