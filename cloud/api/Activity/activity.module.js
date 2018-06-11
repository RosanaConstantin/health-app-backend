/**
 * Activity Module
 * @name Activity Module
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 * @version 1.0.0
 *
 */

(function () {
    var activityActions = require('./activity.actions');

    const MODULE_PREFIX = 'activity-';

    module.exports = {
        version: '1.0.0',
        initialize: function (parentPrefix) {
            var prefix = parentPrefix + MODULE_PREFIX;

            Parse.Cloud.define(prefix + 'save', activityActions.saveActivity);
            Parse.Cloud.define(prefix + 'get', activityActions.getActivities);

            return this;
        }
    };

}());