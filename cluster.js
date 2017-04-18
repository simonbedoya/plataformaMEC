/**
 * Created by sbv23 on 18/04/2017.
 */
const cluster = require('cluster');
const os = require('os');

const workers = os.cpus().length;

cluster.setupMaster({ exec: './bin/www' });

function log(msg) {
    console.log(`[SERVER] ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')} ${msg}`)
}

log(`Master with pid ${process.pid} starting...`);

for (let i = 0; i < workers; i++) {
    cluster.fork()
}

cluster.on('exit', (worker, code, signal) => {
    log(`worker with pid ${worker.process.pid} died. Restarting...`);
    cluster.fork()
});

cluster.on('online', worker => {
    log(`Worker with pid ${worker.process.pid} started`)
});