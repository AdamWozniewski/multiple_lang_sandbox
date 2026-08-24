import {Queue, Worker} from 'bullmq';
import {mailer} from '@utility/mailing';
import {connection} from "./redis-connection";

export const mailerQueue = new Queue("mailer", {connection});

export const mailWorker = new Worker(
    "mailer",
    async (job) => {
        const {email, subject, content, template} = job.data;
        await mailer(email, subject, content, template);
    },
    {
        connection,
        concurrency: 5
    }
)

mailWorker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});
mailWorker.on('failed', (job, err) => {
    console.log(`item: ${job.id} - not working: ${err.message}`)
})
