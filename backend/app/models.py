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
    created_by = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    image_url = Column(Text, nullable=False)
    tags = Column(VARCHAR(50), ForeignKey("tags.tag_name", ondelete="CASCADE"))
    slug = Column(Text, nullable=False)
    discount_percentage = Column(Integer, default=0)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(VARCHAR(50), nullable=False, unique=True)
    password = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    phone_number = Column(VARCHAR(15))


class Tags(Base):
    __tablename__ = "tags"
    tag_name = Column(VARCHAR(50), primary_key=True)
