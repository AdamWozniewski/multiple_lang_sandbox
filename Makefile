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

dev-start-sql:
	$(MAKE) start-common
	docker compose start postgres adminer
	cd apps/recipe-api && bun run start:dev

dev-start-mongo:
	$(MAKE) start-common
	docker compose start mongo mongo-express
	cd apps/backend && bun run dev:server

aspire:
	bunx aspire run

aspire-start:
	bunx aspire start

kubernetes-init:
	minikube start
	kubectl delete namespace sandbox --ignore-not-found
	kubectl apply -f k8s/

stop:
	docker compose stop
	bunx aspire stop