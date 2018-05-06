/**
 * User Management Actions
 * @name User Management Actions
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 * @version 1.0.0
 */

(function () {
    var util = require('../../../util'),
        entity = util.entity;

    module.exports = {
        version: '1.0.0',
        create: _createUser
    };

    function _createUser(request, response) {
        if (!util.validateRequestParams(request, response, ['email', 'password', 'firstName', 'lastName'])) {
            return;
        }

        var requestParams = request.params;

        var user = new entity.User;

        user.set("username", requestParams.email);
        user.set("password", requestParams.password);
        user.set("firstName", requestParams.firstName);
        user.set("lastName", requestParams.lastName);
        user.set("email", requestParams.email);

        user.signUp({useMasterKey: true}, {
            success: function(user) {
                console.log(user);
            },
            error: function(user, error) {
                console.log(error);
            }
        });
    }
}());