/**
 * Collection of utils methods and constants
 * @name Collection of utils methods and constants
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 * @version 1.0.0
 *
 */
(function () {
    var _ = require('underscore');

    module.exports = {
        version: '1.0.0',
        initialize: function () {
            return this;
        },
        entity: {
            Role: Parse.Object.extend('Role'),
            User: Parse.User
        },
        ResponseWrapper: {
            override: function (response) {
                response.errorTriggered = false;
                var original = response.error;
                response['error'] = function () {
                    this.errorTriggered = true;
                    return original.apply(this, arguments);
                };
                return response;
            }
        },
        validateRequestParams: function (request, response, requiredParams) {
            this.ResponseWrapper.override(response);

            _.forEach(requiredParams, function (param) {
                if (!request.params[param]) {
                    response.error(400, 'Parameter ' + param + ' is missing or empty');
                }
            });

            return !response.errorTriggered;
        },
        updateObject: function (object, objectKeys, changes) {
            _.forEach(objectKeys, function (key) {
                if (!!changes[key]) {
                    object.set(key, changes[key]);
                }
            });

            return object;
        }

    };
}());
