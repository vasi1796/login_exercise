# login_exercise

## Steps for setup

1. Run ```./init_prisma.sh```
2. Run ```./seed_prisma.sh```
3. Run ```docker compose up --build```

## To run migrations

1. Make necessary change in the api models
2. Run ```./create_prisma_migration.sh```