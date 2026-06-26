const { spawn } = require('node:child_process') as typeof import('node:child_process');

type PnpmTarget = {
    name: string;
    args: string[];
};

const installTargets: PnpmTarget[] = [
    {
        name: 'root',
        args: ['install']
    },
    {
        name: 'backend',
        args: ['--dir', 'backend', 'install']
    },
    {
        name: 'frontend',
        args: ['--dir', 'frontend', 'install']
    }
];

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

const runInstall = ({ name, args }: PnpmTarget) =>
    new Promise<void>((resolve, reject) => {
        const pnpmProcess = createPnpmProcess(args);
        const child = spawn(pnpmProcess.command, pnpmProcess.args, {
            cwd: process.cwd(),
            env: process.env,
            stdio: 'inherit'
        });

        child.on('error', (error) => {
            reject(new Error(`Failed to install ${name}: ${error.message}`));
        });

        child.on('exit', (code, signal) => {
            if (code === 0) {
                resolve();
                return;
            }

            if (signal) {
                reject(new Error(`${name} install stopped by signal ${signal}.`));
                return;
            }

            reject(new Error(`${name} install exited with code ${code}.`));
        });
    });

const installAll = async () => {
    for (const target of installTargets) {
        console.log(`\n☕ Installing ${target.name} dependencies...\n`);
        await runInstall(target);
    }

    console.log('\n☕ All dependencies installed.\n');
};

installAll().catch((error) => {
    console.error(`\n${error.message}\n`);
    process.exit(1);
});
