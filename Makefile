# Makefile

# Start development environment
up-build:
	docker compose up --build

up:
	docker compose up

# Stop environment
down:
	docker compose down

# Enter backend container shell
shell:
	docker compose exec backend sh

# Run Prisma generate inside container
generate:
	docker compose exec backend yarn prisma generate

# Run Prisma db push inside container
db-push:
	docker compose exec backend yarn db:push

# Run Prisma db reset inside container
db-reset:
	docker compose exec backend yarn db:reset

# Run both generate + db push
sync:
	docker compose exec backend sh -c "yarn prisma generate && yarn db:push"

fr-log:
	docker compose logs -f frontend
