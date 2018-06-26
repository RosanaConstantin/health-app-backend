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
            Parse.Cloud.define(prefix + 'update-notifications', userProfile.updateNotifications);
            Parse.Cloud.define(prefix + 'update-superviser', userProfile.updateSuperviser);
            Parse.Cloud.define(prefix + 'login', userManagement.loginUser);
            Parse.Cloud.define(prefix + 'alert', userManagement.userAlert);
            Parse.Cloud.define(prefix + 'update-credentials', userManagement.updateCredentials);
            Parse.Cloud.define(prefix + 'delete', userManagement.deleteUser);
            Parse.Cloud.define(prefix + 'get-details', userManagement.getUserDetails);

            return this;
        }
    };

}());