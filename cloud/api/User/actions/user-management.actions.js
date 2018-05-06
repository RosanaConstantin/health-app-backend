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
        create: _createUser
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
                            response.error(500, error.message);1
                        }
                );
            });
    }

    function _loginUser(request, response) {
        if (!util.validateRequestParams(request, response, ['email', 'password'])) {
            return;
        }

        var params = request.params;

        return Parse.User.logIn(params['email'], params['password'])
            .then(function (user) {
                response.success(user);
            })
            .catch(_handleInvalidLogin.bind(null, params, response));

    }

    function _handleInvalidLogin(requestParams, response, error) {
        if (error.code && error.code === 101) {
            userUtil.loginWebsite(requestParams)
            // .then(function (websiteUser) {
            //     return userUtil.accountInformationWebsite(websiteUser['token']);
            // })
                .then(function (accountInformation) {
                    return _createNutrientUserAndProfile(requestParams, accountInformation);
                })
                .then(function (user, profile) {
                    response.success(user);
                })
                .catch(function (error) {
                    response.error(500, 'User login: ' + JSON.stringify(error));
                });
        } else {
            response.error(500, error);
        }
    }


}());