from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

engine = mysql.connector.connect(
    user="projectadmin@local-mart",
    password=os.environ['DB_PASSWORD'],
    host="local-mart.mysql.database.azure.com",
    port=3306,
    database=os.environ['DB_NAME']
)

# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
# )
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()