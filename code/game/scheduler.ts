  /**
  * fn is the function to loop, interval is the waiting time in seconds (can be lower than 1). Be careful with this, make sure the function has an escape clause or it will run forever!
  * @param {function} _fn
  * @param {number} interval
  */
function Scheduler(fn: Function, interval: number) {
	let ninterval = interval * 1000;
  fn();
  setTimeout(Scheduler, ninterval);
	}

module.exports = Scheduler;