from sqlalchemy.sql.sqltypes import Integer, VARCHAR, Text, DateTime, FLOAT
from sqlalchemy.sql import func
from .database import Base
from sqlalchemy import Column


class Test(Base):
    __tablename__ = "test"
    column1 = Column(Integer, primary_key=True)
    column2 = Column(VARCHAR(10))


class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True)
    title = Column(VARCHAR(50), nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    price = Column(FLOAT, nullable=False)