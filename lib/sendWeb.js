'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const webPush = require('web-push');

var _require = require('ramda');

const is = _require.is,
      unless = _require.unless,
      assoc = _require.assoc;

var _require2 = require('./constants');

const WEB_METHOD = _require2.WEB_METHOD;


const stringify = unless(is(String), JSON.stringify);

const sendWebPush = (() => {
  var _ref = _asyncToGenerator(function* (regIds, data, settings) {
    const payload = stringify(data);
    const promises = regIds.map(function (regId) {
      return webPush.sendNotification(regId, payload, settings.web).then(function () {
        return {
          success: 1,
          failure: 0,
          message: [{
            regId,
            error: null
          }]
        };
      }).catch(function (err) {
        return {
          success: 0,
          failure: 1,
          message: [{
            regId,
            error: err,
            errorMsg: err.message
          }]
        };
      });
    });

    const results = yield Promise.all(promises);

    const reduced = results.reduce(function (acc, current) {
      return {
        success: acc.success + current.success,
        failure: acc.failure + current.failure,
        message: [...acc.message, ...current.message]
      };
    });
    return assoc('method', WEB_METHOD, reduced);
  });

  return function sendWebPush(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = sendWebPush;