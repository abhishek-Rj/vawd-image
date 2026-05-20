FROM python:alpine3.22

WORKDIR /app

COPY app/ ./app/
COPY pyproject.toml .
COPY project.toml .
COPY uv.lock .

RUN curl -Ls https://astral.sh/uv/install.sh | sh

EXPOSE 8000

CMD 
