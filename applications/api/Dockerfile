FROM python:3.12.5-slim

WORKDIR /app

COPY . .

RUN pip install --upgrade pip  

RUN pip install -r requirements.txt

RUN python manage.py migrate   

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
