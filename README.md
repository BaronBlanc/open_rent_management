# Property Manager

This is a FastAPI project for managing properties.

## Installation

1. Install Poetry:
    ```bash
    curl -sSL https://install.python-poetry.org | python3 -
    ```
    or you can use
    ```bash
    pip install poetry
    ```
2. Check for Virtual Environment
    ```bash
    poetry env list
    ```
3. Install dependencies:
    ```bash
    poetry install
    ```

4. Create an env file and customize variables
    ```bash
    cp .env.sample .env
    ```

5. Run the Application
    ```bash
    docker-compose up -d
    poetry run runserver
    ```

6. Verify the Application
    ```bash
    curl http://127.0.0.1:8000
    ```

## Running the app

```bash
docker-compose up -d

poetry run runserver

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
