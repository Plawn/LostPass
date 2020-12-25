FROM python:3.8.6-slim

WORKDIR /api

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY ./ .

EXPOSE 5000

CMD [ "uvicorn", "app.api:app", "--host", "0.0.0.0",  "--port", "5000" ]