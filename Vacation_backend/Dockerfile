FROM python:3-alpine

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./

RUN pip3 install -r requirements.txt

RUN pwd



COPY . /app/
RUN ls
