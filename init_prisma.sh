docker-compose start db && docker-compose build api && docker-compose run api npx prisma migrate dev --skip-seed