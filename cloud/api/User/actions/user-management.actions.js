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
        create: _createUser,
        loginUser: _loginUser,
        getUserDetails: _getUserDetails
    };

    function _createUser(request, response) {
        if (!util.validateRequestParams(request, response, ['email', 'password', 'username', 'firstName', 'lastName'])) {
            return;
        }

        var requestParams = request.params;

        var user = new entity.User;

        user.set("username", requestParams.username);
        user.set("password", requestParams.password);
        user.set("email", requestParams.email);

        user.signUp(null)
            .then(function (user) {
                return createUserProfile(user, requestParams, response);
            }, function (reason) {
                response.error(500, reason.message);
            });
    }

    function createUserProfile(user, info, response) {
        var userProfile = new entity.UserProfile();

        userProfile.set('firstName', info['firstName']);
        userProfile.set('lastName', info['lastName']);

        return userProfile.save(null, {useMasterKey: true})
            .then(function (userProfile) {

                user.set('profile',
                    {
                        "__type": "Pointer",
                        "className": "UserProfile",
                        "objectId": userProfile.id
                    });

                return Parse.Promise.when(
                    user.save(null, {useMasterKey: true}),
                    Parse.Promise.as(userProfile)
                );
            })
            .then(function (profile) {
                var acl = new Parse.ACL(user);
                profile.setACL(acl);

                    profile.save(null, {useMasterKey: true})
                        .then( function(user){
                            response.success(user);
                        }, function (error){
                            response.error(500, error.message);
                        }
                );
            });
    }

    function _loginUser(request, response) {
        if (!util.validateRequestParams(request, response, ['username', 'password'])) {
            return;
        }

        var params = request.params;

        return Parse.User.logIn(params['username'], params['password'])
            .then(function (user) {
                response.success(user);
            }, function(reason){
                response.success(500, reason.message);
            });
    }

    function _getUserDetails(request, response){
        var user = request.user;
        var profileId = user.get('profile').id;
        var sessionToken = user.getSessionToken();

        var query = new Parse.Query(entity.UserProfile);

        query.get(profileId, {sessionToken: sessionToken})
            .then(function(result){
                response.success(result);
            }, function(error){
                response.error(500, error.message);
            })
    }
}());