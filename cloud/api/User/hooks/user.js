/**
 * User entity hooks
 * @module hooks/user
 * @author Rosana Constantin constantin.rosana@yahoo.com
 */

(function () {
    var _ = require('underscore'),
        util = require('../../../util'),
        entity = util.entity;

    module.exports = {
        version: '1.0.0',
        initialize: function () {
            Parse.Cloud.beforeSave(Parse.User, beforeSave);
            Parse.Cloud.afterSave(Parse.User, afterSave);
            return this;
        }
    };

    function beforeSave(request, response) {
        var user = request.object;
        var userAuthData = user.get('authData');
        var userType = user.get('type');

        if (!!userAuthData && !!userAuthData.facebook) {
            userType = util.getConstantValue('UserType', 'client');
            user.set('type', userType);
        }

        // if (!userType) {
        //     response.error('User Type is mandatory');
        //     return;
        // }

        response.success(user);
    }

    function afterSave(request) {
        var user = request.object;

        var userType = user.get('type');
        var roleName = util.getConstantKey('UserType', userType);

        if (!roleName) {
            console.error('Can\'t find role name with code for user: ' + JSON.stringify(user) + '(' + userType + '/' + roleName + ')');
            return;
        }

        var query = new Parse.Query(Parse.Role);
        query.equalTo('name', roleName);

        query.first({useMasterKey: true})
            .then(function (role) {
                role.relation('users').add(user);
                return role.save(null, {useMasterKey: true});
            }, function (error) {
                console.error('Can\'t find role for user:' + JSON.stringify(user));
                console.error('Error:' + JSON.stringify(error));
            })
            .then(function (done) {
                console.log('Role updated!');
            }, function (error) {
                console.error('Error while adding role to new user: ' + JSON.stringify(error));
            });

        if (!user.get('profile')) {
            var userProfile = new entity.UserProfile();
            var acl = new Parse.ACL(user);
            userProfile.setACL(acl);

            userProfile.save(null, {useMasterKey: true})
                .then(function (profile) {
                    user.set('profile', profile);
                    return user.save(null, {useMasterKey: true});
                })
                .then(function (result) {
                    console.log('User profile created!');
                })
                .catch(function (reason) {
                    console.error('Error while adding profile to new user: ' + JSON.stringify(reason));
                });
        }
    }
}());