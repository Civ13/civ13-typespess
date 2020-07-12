  /**
  * Similar to pollFunc but runs without a set timeout. Be careful with this, make sure the function has an escape clause!
  * @param {function} fn
  * @param {number} interval
  */
function eternalPollFunc(fn, interval) {
	interval = interval || 1000,

	(function p() {
		fn();
		setTimeout(p, interval);
	})();
}

module.exports = {eternalPollFunc};