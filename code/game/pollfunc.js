  /**
  * Runs the function 'fn' every 'interval' miliseconds, for 'timeout' time.
  * @param {function} fn
  * @param {number} timeout
  * @param {number} interval
  */
function pollFunc(fn, timeout, interval) {
    var startTime = (new Date()).getTime();
    interval = interval || 1000,
    canPoll = true;

    (function p() {
        canPoll = ((new Date).getTime() - startTime ) <= timeout;
        if (canPoll)  {
			fn();
            setTimeout(p, interval);
        }
    })();
}

module.exports = {pollFunc};