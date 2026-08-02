import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "powerpredict_db")

DEFAULT_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)

SQLITE_URL = "sqlite:///./powerpredict.db"

engine = None
try:
    if "postgresql" in DATABASE_URL:
        # Test postgres engine
        temp_engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 3})
        with temp_engine.connect() as conn:
            pass
        engine = temp_engine
        print(f"Connected to PostgreSQL database: {POSTGRES_DB}")
except Exception as e:
    print(f"PostgreSQL connection failed ({e}). Falling back to SQLite database at {SQLITE_URL}")

if engine is None:
    engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
    print(f"Connected to SQLite database: {SQLITE_URL}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
