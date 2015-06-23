/* Nuclear
 * By AlloyTeam http://www.alloyteam.com/
 * Github: https://github.com/AlloyTeam/Sword
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
        root.Sword = factory();
    }
}(this, function () {
