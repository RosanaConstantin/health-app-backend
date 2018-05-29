/**
 * User Profile Actions
 * @name User Profile Actions
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 * @version 1.0.0
 */

(function () {
    var util = require('../../../util'),
        userUtil = require("../user.util"),
        entityKeys = util.entityKeys,
        entity = util.entity;

    module.exports = {
        version: '1.0.0',
        update: _updateProfile,
        updateNotifications: _updateNotifications
    };

    /**
     * @api {post} /api-user-update-profile Update Profile
     * @apiName UpdateProfile
     * @apiGroup User
     *
     * @apiHeader {String} Content-Type =application/json
     * @apiHeader {String} X-Parse-Application-Id Parse APP ID
     * @apiHeader {String} X-Parse-Session-Token Current user session token.
     *
     * @apiParam {String} profile Profile changes.
     *
     * @apiSuccess (200) {String} result Profile updated.
     *
     * @apiError (400) {String} InvalidUser Can't retrieve current user details: Session Token is null or invalid.
     * @apiError (400) {String} RequiredParams Parameter profile is missing or empty.
     * @apiError (500) {String} ApiError Couldn't update profile + {errorMessage}
     *
     */

    function _updateProfile(request, response) {
        if (!userUtil.validateUserRequest(request, response)) {
            return;
        }

        if (!util.validateRequestParams(request, response, ['profile'])) {
            return;
        }

        var user = request.user;
        var sessionToken = user.getSessionToken();

        var userProfile = user.get('profile');
        var profileChanges = request.params['profile'];

        var query = new Parse.Query(entity.UserProfile);

        query.get(userProfile.id, {sessionToken: sessionToken})
            .then(function (profile) {
                if (!profile) {
                    console.error('User profile is null or undefined');
                }

                return util.updateObject(profile, entityKeys.UserProfile, profileChanges)
                    .save(null, {sessionToken: sessionToken});
            })
            .then(function (result) {
                response.success('Profile updated.');
            })
            .catch(function (reason) {
                response.error(500, 'Couldn\'t update profile' + JSON.stringify(reason));
            });
    }


    function _updateNotifications(request, response) {
        if (!userUtil.validateUserRequest(request, response)) {
            return;
        }

        if (request.params && (request.params['notifications'] === undefined || request.params['notifications'] === null)) {
            return;
        }

        var user = request.user;
        var sessionToken = user.getSessionToken();

        var userProfile = user.get('profile');
        var profileChanges = request.params['notifications'];

        var query = new Parse.Query(entity.UserProfile);

        query.get(userProfile.id, {sessionToken: sessionToken})
            .then(function (profile) {
                if (!profile) {
                    console.error('User profile is null or undefined');
                }

                return util.updateNotifications(profile, entityKeys.UserProfile, profileChanges)
                    .save(null, {sessionToken: sessionToken});
            })
            .then(function (result) {
                response.success('Profile updated.');
            })
            .catch(function (reason) {
                response.error(500, 'Couldn\'t update profile' + JSON.stringify(reason));
            });
    }
}());