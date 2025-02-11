# Property Manager

This is a FastAPI project for managing properties.

## Installation

1. Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Create an env file and customize variables
    ```bash
    cp .env.sample .env
    ```

## Running the app

```bash
docker-compose up -d

uvicorn app.main:app --reload

## Use Alembic to create migrations and update database model

alembic init alembic

# Create migration
alembic revision --autogenerate -m "New Migration"

# Apply migration 
alembic upgrade head

# downgrade migration 
alembic downgrade head

# Verify state of migrations 
alembic current
