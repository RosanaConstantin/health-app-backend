/**
 * User Module
 * @name User Module
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 * @version 1.0.0
 *
 */
(function () {
    var userManagement = require('./actions/user-management.actions');
    var userProfile = require('./actions/user-profile.actions');

    const MODULE_PREFIX = 'user-';

    module.exports = {
        version: '1.0.0',
        initialize: function (parentPrefix) {
            var prefix = parentPrefix + MODULE_PREFIX;

            Parse.Cloud.define(prefix + 'create', userManagement.create);
            Parse.Cloud.define(prefix + 'update-profile', userProfile.update);
            Parse.Cloud.define(prefix + 'login', userManagement.loginUser);

            return this;
        }
    };

}());