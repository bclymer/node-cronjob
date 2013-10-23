node-cronjob
============

Cron scheduling for node.

Installing
============

`npm install node-cronjob`

Usage
============

```
var cron = require('node-cronjob');

cron.schedule(this, "0 0 * * *", function() { // once per day at midnight. Minute = 0, hour = 0
    log.debug("Mmmm, cronjobs".);
});
```

The 2nd parameter is a cron-like string, see here http://en.wikipedia.org/wiki/Cron#Examples
