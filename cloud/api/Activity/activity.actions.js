/**
 * Activity Actions
 * @name Activity Actions
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 * @version 1.0.0
 */

(function () {
    var util = require('../../util'),
        userUtil = require('../User/user.util'),
        entity = util.entity;

    module.exports = {
        version: '1.0.0',
        getActivities: _getActivities,
        saveActivity: _saveActivity,
    };

    function _getActivities(request, response) {
        if (!userUtil.validateUserRequest(request, response)) {
            return;
        }

        var user = request.user;
        var sessionToken = user.getSessionToken();
        var activities = new Parse.Query(entity.Activity);

        activities
            .limit(20)
            .ascending("createdAt")
            .find({sessionToken: sessionToken})
            .then(function(activities){
                response.success(activities)
            })
            .catch(function (reason) {
                response.error(500, 'Couldn\'t  retrieve activities for user: ' + JSON.stringify(reason));
            });
    }

    function _saveActivity(request, response) {
        if (!userUtil.validateUserRequest(request, response)) {
            return;
        }

        if (!util.validateRequestParams(request, response, ['message'])) {
            return;
        }

        var user = request.user;
        var message = request.params.message;

        var Activity = entity.Activity;
        var activity = new Activity();
        var acl = new Parse.ACL(user);

        activity.set("message", message);
        activity.setACL(acl);

        activity
            .save()
            .then(function (result) {
                response.success('Activity saved.');
            })
            .catch(function (reason) {
                response.error(500, 'Couldn\'t save activity' + JSON.stringify(reason));
            });
    }
}());