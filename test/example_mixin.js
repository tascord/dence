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

/**
 * Modifies outgoing files
 * @param {string} file_name Path to file
 * @param {string} content File content
 * @param {object} args Provided arguments
 * @returns {string} modified content
 **/
function modify_file(file_name, content, args) {

    if(file_name.endsWith('.html')) return 'Nothing here....';
    else return content;

}

module.exports = {

    modify,
    modify_file,
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

