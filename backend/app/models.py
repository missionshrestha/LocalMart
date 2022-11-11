from sqlalchemy.sql.sqltypes import Integer, VARCHAR, Text, DateTime, FLOAT, Boolean
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
        Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )
    tags = Column(VARCHAR(50), ForeignKey("tag.tag_name", ondelete="CASCADE"))
    slug = Column(Text, nullable=False)
    discount_percentage = Column(Integer, default=0)
    stock = Column(Integer, default=1)
    is_used = Column(Boolean, default=False)


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(50), nullable=False)
    email = Column(VARCHAR(50), nullable=False, unique=True)
    password = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    phone_number = Column(VARCHAR(15))
    profile_img = Column(Text, nullable=False)


class Tag(Base):
    __tablename__ = "tag"
    tag_name = Column(VARCHAR(50), primary_key=True)


class ImageURL(Base):
    __tablename__ = "imageurl"
    # Just in case PK
    pk = Column(Integer, primary_key=True)
    id = Column(Integer, ForeignKey("product.id", ondelete="CASCADE"))
    url = Column(Text, nullable=False)


class ProductFeature(Base):
    __tablename__ = "productfeature"
    # Just in case PK
    pk = Column(Integer, primary_key=True)
    id = Column(Integer, ForeignKey("product.id", ondelete="CASCADE"))
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
