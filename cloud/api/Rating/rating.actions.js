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
        var message = request.params.rating;

        var Rating = entity.Rating;
        var rating = new Rating();
        var acl = new Parse.ACL(user);

        if(rating.message){
            rating.set("ratingMessage", rating.message);
        } else if(rating.stars){
            rating.set("ratingStars", rating.stars);
        }

        rating.setACL(acl);

        rating
            .save()
            .then(function (result) {
                response.success('Rating saved.');
            })
            .catch(function (reason) {
                response.error(500, 'Couldn\'t save rating' + JSON.stringify(reason));
            });
    }

}());