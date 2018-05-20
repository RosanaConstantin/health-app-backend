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
            Parse.Cloud.afterSave(Parse.User, afterSave);
            return this;
        }
    };

    function afterSave(request) {
        var user = request.object;

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