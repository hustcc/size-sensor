/**
 * Created by hustcc on 18/6/22.
 * Contract: i@hust.cc
 */

/**
 * whether is ie, should do something special for ie
 * @returns {RegExpMatchArray | null}
 */
export const isIE = () => navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/);
