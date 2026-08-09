install-all:
	docker compose up --build --no-start

	bun install

	bun scripts/mongo-types.ts
	bun scripts/mongo-create-admin.ts
	bun scripts/mongo-seed.ts

	bun scripts/sql-types.ts
	bun scripts/sql-create-admin.ts
	bun scripts/sql-seed.ts

start-common:
	docker compose start mailhog redis #jenkins gitea

start-sql:
	docker compose start postgres adminer
	cd apps/backend && bun run dev:server

start-mongo:
	$(MAKE) start-common
	docker compose start mongo mongo-express
	cd apps/backend && bun run dev:server
