const { spawn } = require('child_process');

const KILL_PROCESS_FLAG = 'SIGKILL';

const watcher = spawn('node', ['watcher.js']);
let server = null;

const initServer = () => {
  server = spawn('node', ['./src/server.js']);

  server.stdout.on('data', data => console.log(data.toString()));

  server.stderr.on('data', data => console.log(data.toString()));
};

const killServer = () => {
  server.stdin.pause();
  server.kill(KILL_PROCESS_FLAG);
};

const restartServer = () => {
  killServer();
  initServer();
};

initServer();

watcher.stdout.on('data', (data) => {
  console.log(data.toString());
  restartServer();
});

watcher.stderr.on('data', data => console.log(data.toString()));

watcher.on('close', () => killServer());
