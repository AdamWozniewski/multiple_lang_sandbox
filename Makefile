install-all:
	docker compose up --build --no-start

	bun install
	bunx aspire certs trust

	#bun scripts/mongo-types.ts
	#bun scripts/mongo-create-admin.ts
	#bun scripts/mongo-seed.ts

	#bun scripts/sql-types.ts
	#bun scripts/sql-create-admin.ts
	#bun scripts/sql-seed.ts

start-common:
	docker compose start mailhog redis #jenkins gitea

start-sql:
	$(MAKE) start-common
	docker compose start postgres adminer
	cd apps/recipe-api && bun run start:dev

start-mongo:
	$(MAKE) start-common
	docker compose start mongo mongo-express
	cd apps/backend && bun run dev:server

aspire:
	bunx aspire run

aspire-start:
	bunx aspire start

stop:
	docker compose stop
	bunx aspire stop