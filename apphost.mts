import { EndpointProperty, createBuilder } from './.aspire/modules/aspire.mjs';

const PORT = {
  mailhogSmtp: 1025,
  backend: 3000,
  recipeApi: 3001,
  postgres: 5432,
  adminer: 8082,
  mongo: 27017,
  mongoExpress: 8081,
  redis: 6379,
  mailhogUi: 8025,
} as const;

const DB = {
  postgresDatabase: 'postgres',
  mongoDatabase: 'node',
} as const;

const COMPOSE_PROJECT = 'multiple_lang_sandbox-aspire';
const composeLabels = (service: string) => [
  '--label', `com.docker.compose.project=${COMPOSE_PROJECT}`,
  '--label', `com.docker.compose.service=${service}`,
];

const builder = await createBuilder();

const postgresUser = builder.addParameter('postgres-user', { value: 'admin' });
const postgresPassword = builder.addParameter('postgres-password', { value: 'admin', secret: true });
const mongoUser = builder.addParameter('mongo-user', { value: 'admin' });
const mongoPassword = builder.addParameter('mongo-password', { value: 'example', secret: true });

const postgres = await builder
  .addPostgres('postgres', {
    port: PORT.postgres,
    userName: postgresUser,
    password: postgresPassword,
  })
  .withImage('postgres', { tag: '16-alpine' })
  .withVolume('/var/lib/postgresql/data', { name: 'multiple_lang_sandbox_pgdata' })
  .withContainerName('aspire-postgres')
  .withContainerRuntimeArgs(composeLabels('postgres'));

const postgresDb = await postgres.addDatabase('postgresdb', {
  databaseName: DB.postgresDatabase,
});

const mongo = await builder
  .addMongoDB('mongo', {
    port: PORT.mongo,
    userName: mongoUser,
    password: mongoPassword,
  })
  .withDataVolume({ name: 'multiple_lang_sandbox_mongo_data' })
  .withContainerName('aspire-mongo')
  .withContainerRuntimeArgs(composeLabels('mongo'))
  .withMongoExpress({
    configureContainer: async (container) => {
      await container
        .withHostPort({ port: PORT.mongoExpress })
        .withContainerName('aspire-mongo-express')
        .withContainerRuntimeArgs(composeLabels('mongo-express'));
    },
  });

const mongoDb = await mongo.addDatabase('mongodb', {
  databaseName: DB.mongoDatabase,
});

const redis = await builder
  .addContainer('redis', { image: 'redis', tag: '7-alpine' })
  .withEndpoint({ name: 'tcp', port: PORT.redis, targetPort: 6379 })
  .withVolume('/data', { name: 'multiple_lang_sandbox_redis-data' })
  .withContainerName('aspire-redis')
  .withContainerRuntimeArgs(composeLabels('redis'));

const mailhog = await builder
  .addContainer('mailhog', 'mailhog/mailhog')
  .withEndpoint({ name: 'smtp', port: PORT.mailhogSmtp, targetPort: 1025 })
  .withHttpEndpoint({ name: 'http', port: PORT.mailhogUi, targetPort: 8025 })
  .withContainerName('aspire-mailhog')
  .withContainerRuntimeArgs(composeLabels('mailhog'));

const postgresTcp = postgres.getEndpoint('tcp');
const mongoTcp = mongo.getEndpoint('tcp');
const redisTcp = redis.getEndpoint('tcp');
const mailhogSmtp = mailhog.getEndpoint('smtp');

await builder
  .addContainer('adminer', 'adminer')
  .withHttpEndpoint({ name: 'http', port: PORT.adminer, targetPort: 8080 })
  .withEnvironment('ADMINER_DEFAULT_SERVER', 'postgres')
  .withContainerName('aspire-adminer')
  .withContainerRuntimeArgs(composeLabels('adminer'))
  .waitFor(postgres);

await builder
  .addJavaScriptApp('backend', './apps/backend', { runScriptName: 'dev:server' })
  .withBun({ install: false })
  .publishAsDockerFile(async (container) => {
    await container.withEntrypoint('bun').withArgs(['dist/index.js']);
  })
  .withHttpEndpoint({ port: PORT.backend, targetPort: PORT.backend, env: 'PORT', isProxied: false })
  .withExternalHttpEndpoints()
  .withEnvironment('MONGO_DB_USER', mongoUser)
  .withEnvironment('MONGO_DB_PASSWORD', mongoPassword)
  .withEnvironment('MONGO_DB_ADDRESS', mongoTcp.property(EndpointProperty.Host))
  .withEnvironment('MONGO_DB_PORT', mongoTcp.property(EndpointProperty.Port))
  .withEnvironment('MONGO_DB_NAME', DB.mongoDatabase)
  .withEnvironment('POSTGRES_DB_HOST', postgresTcp.property(EndpointProperty.Host))
  .withEnvironment('POSTGRES_DB_PORT', postgresTcp.property(EndpointProperty.Port))
  .withEnvironment('POSTGRES_DB_NAME', DB.postgresDatabase)
  .withEnvironment('POSTGRES_DB_USER', postgresUser)
  .withEnvironment('POSTGRES_DB_PASSWORD', postgresPassword)
  .withEnvironment('REDIS_HOST', redisTcp.property(EndpointProperty.Host))
  .withEnvironment('REDIS_PORT', redisTcp.property(EndpointProperty.Port))
  .withEnvironment('EMAIL_HOST', mailhogSmtp.property(EndpointProperty.Host))
  .withEnvironment('EMAIL_PORT', mailhogSmtp.property(EndpointProperty.Port))
  .waitFor(mongoDb)
  .waitFor(postgresDb)
  .waitFor(redis)
  .waitFor(mailhog);

await builder
  .addJavaScriptApp('recipe-api', './apps/recipe-api', { runScriptName: 'start:dev' })
  .withBun({ install: false })
  .withBuildScript('build')
  .publishAsPackageScript({ scriptName: 'start:prod' })
  .withHttpEndpoint({ port: PORT.recipeApi, targetPort: PORT.recipeApi, env: 'NEST_PORT', isProxied: false })
  .withExternalHttpEndpoints()
  .withEnvironment('POSTGRES_DB_HOST', postgresTcp.property(EndpointProperty.Host))
  .withEnvironment('POSTGRES_DB_PORT', postgresTcp.property(EndpointProperty.Port))
  .withEnvironment('POSTGRES_DB_USER', postgresUser)
  .withEnvironment('POSTGRES_DB_PASSWORD', postgresPassword)
  .withEnvironment('POSTGRES_DB_DATABASE', DB.postgresDatabase)
  .waitFor(postgresDb);

await builder.addDockerComposeEnvironment('docker-compose');

await builder.build().run();
