/**
 * Notification Module
 * @name Notification Module
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 * @version 1.0.0
 *
 */

(function () {
    var notificationActions = require('./notification.actions');

    const MODULE_PREFIX = 'notification-';

    module.exports = {
        version: '1.0.0',
        initialize: function (parentPrefix) {
            var prefix = parentPrefix + MODULE_PREFIX;

            Parse.Cloud.define(prefix + 'save', notificationActions.saveNotification);
            Parse.Cloud.define(prefix + 'delete', notificationActions.deleteNotification);
            Parse.Cloud.define(prefix + 'get', notificationActions.getNotification);
            Parse.Cloud.define(prefix + 'mark-read', notificationActions.markStatusReadNotif;

            return this;
        }
    };

}());