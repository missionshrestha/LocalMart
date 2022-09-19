from sqlalchemy.sql.sqltypes import Integer, String
from .database import Base
from sqlalchemy import Column


class Test(Base):
    __tablename__ = "test"
    column1 = Column(Integer, primary_key=True)
    column2 = Column(String)
