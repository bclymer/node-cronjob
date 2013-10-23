var jobs = {};

function schedule (owner, cronString, code) {
	if (jobs[owner] === undefined) {
		jobs[owner] = [];
	}
	var timeElements = cronString.split(' ');
	var cronTime = {
		'minute': timeElements[0],
		'hour': timeElements[1],
		'dayOfMonth': timeElements[2],
		'month': timeElements[3],
		'dayOfWeek': timeElements[4]
	};
	jobs[owner].push({
		shouldExecute: function(lastRun) {
			var now = new Date();
			if (cronTime.month != "*" && now.getMonth() + 1 != cronTime.month) return false;
			if (cronTime.dayOfMonth != "*" && now.getDate() != cronTime.dayOfMonth) return false;
			if (cronTime.dayOfWeek != "*" && now.getDay() != cronTime.dayOfWeek) return false;
			if (cronTime.hour != "*" && now.getHours() != cronTime.hour) return false;
			if (cronTime.minute != "*" && now.getMinutes() != cronTime.minute) return false;
			if (lastRun.getMinutes() == now.getMinutes() && now.getTime() - lastRun.getTime() < 60 * 1000) return false; // got called twice in a minute.
			return true;
		},
		code: code,
		failures: 0,
		lastRun: new Date(0)
	});
}

function unschedule (owner) {
	jobs[owner] = undefined;
}

/*
This runs on 30 second intervals so that tasks if a task takes a long time
a minute won't accidentally get skipped due to weird timing issues.
If cron scanned once per minute, at the 58 second mark by chance, and some task
took 3 seconds to run, a task that was scheduled 1 minute later would not run.
*/
setInterval(function() {
	for (var owner in jobs) {
		var owner = jobs[owner];
		owner.forEach(function(job) { // native forEach is a thing?? BADASS!
			if (job.shouldExecute(job.lastRun)) {
				try {
					job.lastRun = new Date();
					job.code();
				} catch (e) {
					job.failures++;
					// if (job.failures >= 3) { do something? }
				}
			}
		});
	}
}, 30 * 1000);

module.exports = {
	schedule: schedule,
	unschedule: unschedule
}