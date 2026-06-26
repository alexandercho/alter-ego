const { spawn } = require('node:child_process') as typeof import('node:child_process');

type Service = {
    name: string;
    args: string[];
};

const services: Service[] = [
    {
        name: 'backend',
        args: ['--dir', 'backend', 'dev']
    },
    {
        name: 'frontend',
        args: ['--dir', 'frontend', 'start']
    }
];

const children = new Map<string, import('node:child_process').ChildProcess>();
let shuttingDown = false;

const createPnpmProcess = (args: string[]) => {
    if (process.env.npm_execpath) {
        return {
            command: process.execPath,
            args: [process.env.npm_execpath, ...args]
        };
    }

    return {
        command: process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
        args
    };
};

const stopChildren = (signal: NodeJS.Signals = 'SIGTERM') => {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;

    for (const child of children.values()) {
        if (child.exitCode === null && !child.killed) {
            child.kill(signal);
        }
    }
};

const maybeExit = () => {
    if (children.size === 0) {
        process.exit(process.exitCode ?? 0);
    }
};

for (const service of services) {
    const pnpmProcess = createPnpmProcess(service.args);
    const child = spawn(pnpmProcess.command, pnpmProcess.args, {
        cwd: process.cwd(),
        env: process.env,
        stdio: 'inherit',
    });

    children.set(service.name, child);

    child.on('error', (error) => {
        console.error(`Failed to start ${service.name}:`, error);
        process.exitCode = 1;
        stopChildren('SIGTERM');
        maybeExit();
    });

    child.on('exit', (code, signal) => {
        children.delete(service.name);

        if (!shuttingDown) {
            process.exitCode = code ?? 1;

            if (signal) {
                console.error(`${service.name} stopped from signal ${signal}. Shutting down the remaining service.`);
            } else {
                console.error(`${service.name} exited with code ${code}. Shutting down the remaining service.`);
            }

            stopChildren('SIGTERM');
        }

        maybeExit();
    });
}

process.on('SIGINT', () => {
    process.exitCode = 0;
    stopChildren('SIGINT');
    maybeExit();
});

process.on('SIGTERM', () => {
    process.exitCode = 0;
    stopChildren('SIGTERM');
    maybeExit();
});
