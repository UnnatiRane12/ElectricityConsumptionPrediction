import sys
sys.path.insert(0, '.')
from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash, verify_password

db = SessionLocal()
user = db.query(User).filter(User.email == 'demo@powerpredict.com').first()
if user:
    print('User found:', user.email)
    print('Hash in DB:', user.hashed_password[:30], '...')
    correct = verify_password('password123', user.hashed_password)
    print('password123 matches:', correct)
    if not correct:
        user.hashed_password = get_password_hash('password123')
        db.commit()
        print('Password RESET to password123')
        print('New verify:', verify_password('password123', user.hashed_password))
    else:
        print('Password is already correct - login should work!')
else:
    print('User NOT found - creating now...')
    new_user = User(
        full_name='Demo User',
        email='demo@powerpredict.com',
        hashed_password=get_password_hash('password123'),
        role='admin'
    )
    db.add(new_user)
    db.commit()
    print('Created demo user with password123')
db.close()
