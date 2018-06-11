/**
 * API Module
 * @name API Module
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 *
 */
(function () {
    var user = require("./User/user.module");
    var notification = require("./Notification/notification.module");
    var rating = require("./Rating/rating.module");
    var activity = require("./Activity/activity.module");
    var userHooks = require('./User/hooks/user');

    const MODULE_PREFIX = 'api-';

    module.exports = {
        version: '1.0.0',
        initialize: function () {

            // Actions initialize
            user.initialize(MODULE_PREFIX);
            notification.initialize(MODULE_PREFIX);
            rating.initialize(MODULE_PREFIX);
            activity.initialize(MODULE_PREFIX);

            // Hooks initialize
            userHooks.initialize();
            return this;
        }
    };

}());