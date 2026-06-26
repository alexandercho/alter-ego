import loadDevEnv from '#utils/load-dev-env';
import app = require('#app');

loadDevEnv();

const DEFAULT_PORT = 3001;

const getPort = () => {
    const rawPort = process.env.PORT;
    const parsedPort = Number.parseInt(rawPort ?? '', 10);

    if (parsedPort > 0) {
        return parsedPort;
    }

    return DEFAULT_PORT;
};

const port = getPort();

const server = app.listen(port, () => console.log(`Backend server listening on http://localhost:${port}`));

const shutdown = (signal: NodeJS.Signals) => {
    console.log(`Received ${signal}. Shutting down server.`);

    server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
