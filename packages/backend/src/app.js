// import { runDBAdmin } from "./db/sql/init.js";
import express from 'express';
import path from 'path';
import expressEjsLayouts from 'express-ejs-layouts';
import {fileURLToPath} from 'url';
// import './db/mongo/database.js';
import {routerWeb} from './routes/web.js';
import {routerApi} from './routes/api.js';
import {globalMiddleware} from "./middleware/view-variables.js";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import {userMiddleware} from "./middleware/user-middleware.js";
import {isAuthMiddleware} from "./middleware/is-auth-middleware.js";
import helmet from "helmet";
import {rateLimiterMiddleware} from "./middleware/rate-limiter-middleware.js";
import {config} from "./config.js";
import { serve, setup } from 'swagger-ui-express';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startApp = async () => {
    const app = express();

    app.use(expressSession({
        secret: config.sessionSecret,
        saveUninitialized: true,
        cookie: {
            maxAge: 86400000,
        },
        resave: false
    }));

    const swaggerDocument = JSON.parse(
      await readFile(new URL('./../docs/swagger.json', import.meta.url))
    );
    app.use('/api-docs', serve, setup(swaggerDocument));
    app.disable('etag');
    app.set('view engine', 'ejs');
    app.use(expressEjsLayouts);
    app.set('views', path.join(__dirname, '/views'));
    app.set('layout', 'layouts/main');
    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(express.json());

    app.use(globalMiddleware);

    app.use(userMiddleware);
// app.use(helmet({
//     directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "cdn.jsdelivr.net"],
//         styleSrc: ["'self'", "cdn.jsdelivr.net"],
//     }
// }))
    app.use(rateLimiterMiddleware);
    app.use('/admin', isAuthMiddleware);

// Routing
    app.use('/api', routerApi);
    app.use(routerWeb);
    return app
}

export default startApp;