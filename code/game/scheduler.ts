/**
 * fn is the function to loop, interval is the waiting time in seconds (can be lower than 1). Be careful with this, make sure the function has an escape clause or it will run forever!
 * @param {function} _fn
 * @param {number} interval
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function Scheduler(fn: Function, interval: number) {
	const ninterval = interval * 1000;
	fn();
	setTimeout(Scheduler, ninterval);
}

module.exports = Scheduler;
