/**
 * Collection of Activities utils methods
 * @name Collection of Activities utils methods a
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 * @version 1.0.0
 *
 */
(function () {
    var _ = require('underscore');
    var util = require('../../util');

    module.exports = {
        version: '1.0.0',
        initialize: function () {
            return this;
        },

        process: function (array) {
            var processedObj = [];
            _forEach(array, function (item){
                var obj = item.toJSON();
                var newObj = {
                    createdAt: moment(obj.createdAt).format('LL'),
                    message: obj.message
                }
                processedObj.push(newObj)
            });
            return processedObj;
        }
    };
}());
