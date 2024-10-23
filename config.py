import os
## Key for app.py has I see right now
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://your_postgres_user:your_postgres_password@localhost/your_db_name')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
