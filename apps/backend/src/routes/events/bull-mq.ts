import { createBullMqQueueAdapter } from "@bullstudio/bullmq-adapter";
import { bullstudio } from "@bullstudio/express";
import {mailerQueue} from "../../events/mailer-queue";

export const expressBullMQ = bullstudio({
    queues: [
        createBullMqQueueAdapter(mailerQueue, {
            key: "email",
            label: "Email",
        }),
    ],
    protection: {
        type: "basic",
        username: process.env.BULLSTUDIO_USERNAME ?? "operator",
        password: process.env.BULLSTUDIO_PASSWORD ?? "change-me",
        sessionSecret: process.env.BULLSTUDIO_SESSION_SECRET!,
    },
});