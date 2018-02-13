
/**
 *
 * @param o - the option object that may have a second handler defined
 * @returns {boolean}
 */
export
function hasSecondHandler(o) {
    return typeof o.extra == "function"
}