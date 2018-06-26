/**
 * Rating Actions
 * @name Rating Actions
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
        save: _saveRating,
    };


    function _saveRating(request, response) {
        if (!userUtil.validateUserRequest(request, response)) {
            return;
        }

        if (!util.validateRequestParams(request, response, ['rating'])) {
            return;
        }

        var user = request.user;
        var ratingReq = request.params.rating;

        var Rating = entity.Rating;
        var rating = new Rating();
        var acl = new Parse.ACL(user);

        if(ratingReq.message){
            rating.set("ratingMessage", ratingReq.message);
        } else if(ratingReq.stars){
            rating.set("ratingStars", ratingReq.stars);
        }

        rating.setACL(acl);

        rating
            .save()
            .then(function (result) {
                response.success('S-a salvat evaluarea!');
            })
            .catch(function (reason) {
                response.error(500, 'Nu s-a putut salva evaluarea' + JSON.stringify(reason));
            });
    }

}());