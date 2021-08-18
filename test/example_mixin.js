const { Response } = require("../dist");

/**
 * Modifies the incoming requests
 * @param {Request} request Incoming request
 * @param {Response} response Outgoing response
 **/
function modify(request, response) {

    if (request.path.startsWith('/cry')) {

        response
            .text("Don't cry!")
            .end();

    };

    return ({ request, response });

}

module.exports = {

    modify,
    priority: 1

}

/**
 * You could also do the following:
 *
 *   module.exports = (server) => {
 *
 *       server.register_mixin({
 *
 *           modify,
 *           priority: 1
 *
 *       });
 *
 *   }
 *
**/

