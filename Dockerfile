FROM python:3.12.9-slim as builder

RUN pip install poetry==2.1.2

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /app

COPY . /app

RUN --mount=type=cache,target=$POETRY_CACHE_DIR \
    poetry install --without ci --no-root \
    && poetry build \
    && poetry run pip install dist/*.whl

FROM python:3.12.9-slim as runtime


RUN apt-get update \
    && apt-get install -y apt-transport-https curl gnupg2 \
    && rm -rf /var/lib/apt/lists/*

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

WORKDIR /app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
