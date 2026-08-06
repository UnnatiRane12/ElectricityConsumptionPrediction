import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set. Please add it to your .env file.")

# Try Supabase/PostgreSQL first, fall back to local SQLite if connection fails
try:
    if DATABASE_URL.startswith("sqlite"):
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(
            DATABASE_URL,
            connect_args={"sslmode": "require"},
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            echo=False
        )
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("[OK] Connected to Supabase PostgreSQL successfully!")
except Exception as e:
    print(f"[WARNING] Supabase connection failed. Falling back to local SQLite database.")
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../powerpredict.db"))
    DATABASE_URL = f"sqlite:///{db_path}"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
