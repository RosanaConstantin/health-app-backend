/**
 * Rating Module
 * @name Rating Module
 * @namespace
 * @author Rosana Constantin constantin.rosana@yahoo.com
 * @version 1.0.0
 *
 */
(function () {
    var rating = require('./rating.actions');

    const MODULE_PREFIX = 'rating-';

    module.exports = {
        version: '1.0.0',
        initialize: function (parentPrefix) {
            var prefix = parentPrefix + MODULE_PREFIX;

            Parse.Cloud.define(prefix + 'save', rating.save);
            return this;
        }
    };

}());