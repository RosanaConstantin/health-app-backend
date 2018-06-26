/**
 * Notification Actions
 * @name Notification Actions
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
        saveNotification: _saveNotification,
        deleteNotification: _deleteNotification,
        getNotification: _getNotifications,
        markStatusReadNotif: _markStatusReadNotif
    };

    function _deleteNotification(request, response) {
        if (!userUtil.validateUserRequest(request, response)) {
            return;
        }

        if (!util.validateRequestParams(request, response, ['notificationId'])) {
            return;
        }

        var user = request.user;
        var sessionToken = user.getSessionToken();
        var notificationId = request.params.notificationId;
        var notification = new Parse.Query(entity.Notification);

        notification
            .get(notificationId, {sessionToken: sessionToken})
            .then(function (notif) {
                if(!notif) {
                    response.error(400, "Nu s-a gasit notificarea respectiva!");
                }

                return notif.destroy({useMasterKey: true});
            })
            .then(function(result){
                response.success("Notificare stearsa!")
            })
            .catch(function (reason) {
                response.error(500, 'Nu s-a putut sterge notificarea pentru utilizator: ' + JSON.stringify(reason));
            });
    }

    function _getNotifications(request, response) {
        if (!userUtil.validateUserRequest(request, response)) {
            return;
        }

        var user = request.user;
        var sessionToken = user.getSessionToken();

        var query = new Parse.Query(entity.Notification);

        query
            .find({sessionToken: sessionToken})
            .then(function (result) {
                response.success(result);
            })
            .catch(function (reason) {
                response.error(500, 'Nu se pot extrage notificarile pentru utilizator: ' + JSON.stringify(reason));
            });
    }

    function _saveNotification(request, response) {
        if (!userUtil.validateUserRequest(request, response)) {
            return;
        }

        if (!util.validateRequestParams(request, response, ['message'])) {
            return;
        }

        var user = request.user;
        var message = request.params.message;

        var Notification = entity.Notification;
        var notification = new Notification();
        var acl = new Parse.ACL(user);

        notification.set("message", message);
        notification.setACL(acl);

        notification
            .save()
            .then(function (result) {
                response.success(result);
            })
            .catch(function (reason) {
                response.error(500, 'Nu s-a putut salva notificarea' + JSON.stringify(reason));
            });
    }

    function _markStatusReadNotif (request, response) {
        if (!userUtil.validateUserRequest(request, response)) {
            return;
        }

        if (!util.validateRequestParams(request, response, ['notif'])) {
            return;
        }

        var user = request.user;
        var sessionToken = user.getSessionToken();
        var notificationId = request.params.notif.notificationId;
        var wasRead = request.params.notif.wasRead;
        var notification = new Parse.Query(entity.Notification);

        notification
            .get(notificationId, {sessionToken: sessionToken})
            .then(function (notif) {
                if(!notif) {
                    response.error(400, "Nu s-a gasit notificarea respectiva!");
                }

                notif.set("wasRead", wasRead)
                return notif.save(null, {sessionToken: sessionToken});
            })
            .then(function(result){
                response.success("Notificarea actualizata cu succes!")
            })
            .catch(function (reason) {
                response.error(500, 'Nu s-a putut actualiza notificarea: ' + JSON.stringify(reason));
            });
    }
}());