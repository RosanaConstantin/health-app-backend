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
            User: Parse.User,
            UserProfile: Parse.Object.extend('UserProfile'),
            Notification: Parse.Object.extend('Notification'),
            Rating: Parse.Object.extend('Rating'),
            Activity: Parse.Object.extend('Activity'),
        },
        entityKeys: {
            UserProfile: ['gender', 'birthdate', 'firstName', 'lastName', 'phoneNumber', 'language', 'location', 'notifications', 'stepsGoal', 'weight','photo', 'superviser','superviserPhone', 'steps' ],
            User: ['email', 'password', 'username']
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
                if(key.localeCompare("weight") === 0 || key.localeCompare("stepsGoal") === 0) {
                    changes[key] = parseInt(changes[key]);
                }
                if (!!changes[key]) {
                    object.set(key, changes[key]);
                }
            });

            return object;
        },
        updateNotifications: function (object, objectKeys, changes) {
            if(changes !== undefined && changes!== null)
                object.set('notifications', changes);
            return object;
        },
        updateSuperviser: function (object, objectKeys, changes) {
            if(changes !== undefined && changes!== null)
                object.set('superviser', changes);
            return object;
        }
    };
}());
