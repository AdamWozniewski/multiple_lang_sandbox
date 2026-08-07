install-all:
	docker compose up --build --no-start
	bun install
	bun scripts/mongo-types.ts
	bun scripts/mongo-create-admin.ts
	bun scripts/mongo-seed.ts


	bun scripts/sql-types.ts
	bun scripts/sql-create-admin.ts
	bun scripts/sql-seed.ts



start-sql:
	docker compose start mongodb mongo_express redis mailhog
	cd apps/backend && bun run dev:server

start-mongo:
	docker compose start mongo mongo-express redis mailhog
	#cd apps/backend && bun run dev:server
