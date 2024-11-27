import chokidar from 'chokidar';
// const { exec } = require('child_process');
import { execSync } from 'child_process';

const watcher = chokidar.watch('frontend/**/*', {
    persistent: true,
});

watcher.on('change', (path) => {
    console.log(`File ${path} has been changed. Building...`);
    execSync('npm run build', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error during build: ${stderr}`);
        } else {
            console.log(`Build complete:\n${stdout}`);
        }
    });
});