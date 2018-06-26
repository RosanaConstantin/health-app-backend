/**
 * User Management Actions
 * @name User Management Actions
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 * @version 1.0.0
 */

(function () {
    var util = require('../../../util'),
        entityKeys = util.entityKeys,
        entity = util.entity;

    var SMSAPI = require('smsapicom');

    module.exports = {
        version: '1.0.0',
        create: _createUser,
        deleteUser: _deleteUser,
        loginUser: _loginUser,
        getUserDetails: _getUserDetails,
        updateCredentials: _updateCredentials,
        userAlert: _userAlert
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
        userProfile.set('notifications', true);
        userProfile.set('steps', 0);

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
        var userId = user.id;
        var sessionToken = user.getSessionToken();

        var query = new Parse.Query(entity.User);

        query
            .include('profile')
            .get(userId, {sessionToken: sessionToken})
            .then(function(result){
                response.success(result);
            }, function(error){
                response.error(500, error.message);
            })
    }

    function _updateCredentials(request, response){

        if (!util.validateRequestParams(request, response, ['credentials'])) {
            return;
        }

        var user = request.user;
        var sessionToken = user.getSessionToken();

        var credentialsChanges = request.params['credentials'];

        var query = new Parse.Query(entity.User);

        query.get(user.id, {sessionToken: sessionToken})
            .then(function (user) {
                if (!user) {
                    console.error('Utilizatorul este null sau nedefinit!');
                }

                return util.updateObject(user, entityKeys.User, credentialsChanges)
                    .save(null, {sessionToken: sessionToken});
            })
            .then(function (result) {
                response.success('S-a actualizat utilizatorul!');
            })
            .catch(function (reason) {
                response.error(500, 'Nu s-a putut actualiza utlizatorul!' + JSON.stringify(reason));
            });
    }

    function _deleteUser(request, response){
        var user = request.user;
        var sessionToken = user.getSessionToken();

        var query = new Parse.Query(entity.User);

        query.get(user.id, {sessionToken: sessionToken})
            .then(function (user) {
                return user.destroy({useMasterKey: true});
            })
            .then(function (result) {
                response.success('S-a sters utilizatorul!');
            })
            .catch(function (reason) {
                response.error(500, 'Nu s-a putut sterge utilizatorul' + JSON.stringify(reason));
            });
    }

    function _userAlert( request, response){
        if (!util.validateRequestParams(request, response, ['phone'])) {
            return;
        }
        var superviser = request.params.phone;


        var smsapi = new SMSAPI();
        smsapi.authentication
            .login('rosanaconstantin@gmail.com', '123456789')
            .then(sendMessage)
            .then(displayResult)
            .catch(displayError);

        function sendMessage(){
            return smsapi.message
                .sms()
                .from('Info')
                .to('+4' + superviser)
                .message('Pacientul tau este in pericol! Localizeaza-l si asigura-te ca e bine!')
                .execute(); // return Promise
        }

        function displayResult(result){
            //console.log(result);
            response.success("Reusit");
        }

        function displayError(err){
           // console.error(err);
            response.error("Esuat");
        }
    }
}());