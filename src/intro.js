/* Sving
 * By dntzhang https://github.com/dntzhang/
 * Github: https://github.com/dntzhang/Sving
 * MIT Licensed.
 */
; (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === "function" && define.cmd) {
        define(function (require, exports, module) {
            module.exports = factory();
        });
    } else {
        root.Sving = factory();
    }
}(this, function () {
