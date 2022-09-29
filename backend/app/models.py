from sqlalchemy.sql.sqltypes import Integer, VARCHAR, Text, DateTime, FLOAT
from sqlalchemy.sql import func
from .database import Base
from sqlalchemy import Column, ForeignKey


class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True)
    title = Column(VARCHAR(50), nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    price = Column(FLOAT, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(VARCHAR(50), nullable=False, unique=True)
    password = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    phone_number = Column(VARCHAR(15))
