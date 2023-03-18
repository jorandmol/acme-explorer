run-local:
	docker-compose --env-file .env.example up --build

stop-local:
	docker-compose --env-file .env.example down

run-dev:
	npm start

run-prod:
	NODE_ENV=production npm start
