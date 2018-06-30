/**
 * Collection of Notification utils methods
 * @name Collection of Notification utils methods a
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 * @version 1.0.0
 *
 */
(function () {
    var _ = require('underscore');
    var util = require('../../util');
    var moment = require('moment');

    module.exports = {
        version: '1.0.0',
        initialize: function () {
            return this;
        },

        process: function (array) {
            var processedObj = [];
            _.forEach(array, function (item){
                var obj = item.toJSON();
                var date = moment(obj.createdAt).format('LLL').split(',');
                var newObj = {
                    createdAt: {
                        day: date[0],
                        hour: date[1].replace("2018 ", "")
                    },
                    message: obj.message,
                    objectId: obj.objectId
                }
                processedObj.push(newObj)
            });
            return processedObj;
        }
    };
}());
