import psycopg2

try:
    connection = psycopg2.connect(
        database="messanger_app",
        user="postgres",
        password="Cabler15",
        host="localhost",
        port="5432"
    )
    print("Connection to database established successfully.")
except Exception as e:
    print("Error while connecting to PostgreSQL:", e)
finally:
    if connection():
        connection.close()
