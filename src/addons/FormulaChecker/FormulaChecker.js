/*globals define*/
/*jshint node:true, browser:true*/

/**
 * Generated by AddOnGenerator 1.7.0 from webgme on Fri May 05 2017 11:02:34 GMT-0500 (Central Daylight Time).
 */

define([
    'addon/AddOnBase',
    'src4ml/src/db/mongoose',
    'text!src4ml/src/config/config.json',
    'src4ml/src/utils/translate'
], function (AddOnBase, mongoose, config4ml_, translate) {
    'use strict';

    /**
     * Initializes a new instance of FormulaChecker.
     * @class
     * @augments {AddOnBase}
     * @classdesc This class represents the addOn FormulaChecker.
     * @constructor
     */
    var config4ml = JSON.parse(config4ml_) || {};
    var FormulaChecker = function (mainLogger, gmeConfig) {
        // Call base class' constructor.
        AddOnBase.call(this, mainLogger, gmeConfig);
    };

    // Prototypal inheritance from AddOnBase.
    FormulaChecker.prototype = Object.create(AddOnBase.prototype);
    FormulaChecker.prototype.constructor = FormulaChecker;

    /**
     * Gets the name of the FormulaChecker.
     * @returns {string} The name of the AddOn.
     * @public
     */
    FormulaChecker.prototype.getName = function () {
        return 'FormulaChecker';
    };

    /**
     * Gets the semantic version (semver.org) of the FormulaChecker.
     * @returns {string} The version of the AddOn.
     * @public
     */
    FormulaChecker.prototype.getVersion = function () {
        return '0.1.0';
    };

    /**
     * This is invoked each time changes in the branch of the project are done. AddOns are allowed to make changes on
     * an update, but should not persist by themselves. (The AddOnManager will persist after each addOn has had its way
     * ordered by the usedAddOn registry in the rootNode).
     * Before each invocation a new updateResult is created which should be returned in the callback. There is no need
     * for the AddOn to report if it made changes or not, the monitor/manager will always persist and if there are no
     * changed objects - it won't commit to the storage.
     * @param {object} rootNode
     * @param {object} commitObj
     * @param {function(Error, AddOnUpdateResult)} callback
     */
    FormulaChecker.prototype.update = function (rootNode, commitObj, callback) {
        var self = this;

        this._dbApi.ensureMainEntry(this.projectId, commitObj._id)
            .then(function (mainEntry) {
                console.log(mainEntry);
                self._previousState = self._currentState;
                self._currentState = {
                    commitHash: commitObj._id,
                    language: translate.getLanguageDomainString(self.core, rootNode),
                    constraints: translate.getConstraintDomainString(self.core, rootNode)
                };

                // return getModel
                callback(null, self.updateResult);
            })
            .catch(callback);
    };

    /**
     * Called once when the addOn is started for the first time.
     * @param {object} rootNode
     * @param {object} commitObj
     * @param {function(Error, AddOnUpdateResult} callback
     */
    FormulaChecker.prototype.initialize = function (rootNode, commitObj, callback) {
        var self = this;
        this.logger.info('FormulaChecker got initialized at commitHash', commitObj._id);

        mongoose(config4ml)
            .then(function (api) {
                self._dbApi = api;
                self.update(rootNode, commitObj, callback);
            })
            .catch(function (err) {
                callback(err);
            });
    };

    FormulaChecker.prototype._getModel = function(core, rootNode){
        var deferred = Q.defer();

        return deferred.promise;
    };

    return FormulaChecker;
});
