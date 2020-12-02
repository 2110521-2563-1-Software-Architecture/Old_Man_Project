FROM python:3.6
ENV PYTHONUNBUFFERED 1
RUN mkdir -p /usr/src/backend
WORKDIR /usr/src/backend
ADD requirements.txt /usr/src/backend/
RUN pip install --upgrade pip && pip install -r requirements.txt
ADD . /usr/src/backend/