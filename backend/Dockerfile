FROM python:3.9.7

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y \
    build-essential \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

RUN pip install -r requirements.txt

EXPOSE 5000

ENV FLASK_APP=app.py
CMD ["flask", "run", "--host=0.0.0.0", "--reload"]
