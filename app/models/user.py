from sqlalchemy import String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .base import Base

class User(Base):
    __tablename__ = 'users'

    email: Mapped[str] = mapped_column(String, index=True, unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)

    tenants: Mapped[list["Tenant"]] = relationship("Tenant", back_populates="user")
    property_managers: Mapped[list["PropertyManager"]] = relationship("PropertyManager", back_populates="user")