
import streamlit as st
import sqlite3, time, re, os, hashlib, base64, json
from cryptography.fernet import Fernet
from datetime import datetime
# optional passlib usage
try:
    from passlib.hash import bcrypt
    use_passlib = True
except Exception:
    use_passlib = False

DB_PATH = "data/users.db"
LOG_PATH = "data/activity.log"
KEY_FILE = "data/secret.key"
SESSION_TIMEOUT_SECONDS = 300  # 5 minutes for testing

def get_key():
    if not os.path.exists(KEY_FILE):
        key = Fernet.generate_key()
        with open(KEY_FILE, "wb") as f:
            f.write(key)
    else:
        with open(KEY_FILE, "rb") as f:
            key = f.read()
    return key

fernet = Fernet(get_key())

def init_db():
    os.makedirs("data", exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS users (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 username TEXT UNIQUE,
                 email TEXT,
                 password_hash TEXT,
                 profile_json TEXT,
                 sensitive_encrypted BLOB
                 )""")
    conn.commit()
    conn.close()

def log_activity(user, action):
    os.makedirs("data", exist_ok=True)
    with open(LOG_PATH, "a") as f:
        f.write(f"{datetime.utcnow().isoformat()} | {user} | {action}\\n")

def hash_password(password):
    if use_passlib:
        return bcrypt.hash(password)
    else:
        # salt + pbkdf2
        salt = os.urandom(16)
        dk = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
        return base64.b64encode(salt + dk).decode()

def verify_password(password, stored):
    if use_passlib:
        return bcrypt.verify(password, stored)
    else:
        raw = base64.b64decode(stored.encode())
        salt = raw[:16]
        dk = raw[16:]
        new = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
        return new == dk

def password_valid(pw):
    if len(pw) < 8:
        return False, "Password must be at least 8 characters."
    if not re.search(r"\\d", pw):
        return False, "Password must include a digit."
    if not re.search(r"[A-Z]", pw):
        return False, "Password must include an uppercase letter."
    if not re.search(r"[a-z]", pw):
        return False, "Password must include a lowercase letter."
    if not re.search(r"[^A-Za-z0-9]", pw):
        return False, "Password must include a special character."
    return True, "Strong password."

def register_user(username, email, password):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    try:
        ph = hash_password(password)
        sensitive_blob = fernet.encrypt(b"sample-sensitive-data")
        c.execute("INSERT INTO users (username, email, password_hash, profile_json, sensitive_encrypted) VALUES (?,?,?,?,?)",
                  (username, email, ph, "{}", sensitive_blob))
        conn.commit()
        log_activity(username, "register")
        return True, "Registered"
    except Exception as e:
        return False, str(e)
    finally:
        conn.close()

def authenticate(username, password):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT password_hash FROM users WHERE username=?", (username,))
    row = c.fetchone()
    conn.close()
    if not row:
        return False
    ph = row[0]
    try:
        ok = verify_password(password, ph)
        if ok:
            log_activity(username, "login_success")
        else:
            log_activity(username, "login_fail")
        return ok
    except Exception:
        return False

def get_user_profile(username):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT email, profile_json, sensitive_encrypted FROM users WHERE username=?", (username,))
    row = c.fetchone()
    conn.close()
    if not row:
        return None
    email, profile_json, sensitive_enc = row
    try:
        sensitive = fernet.decrypt(sensitive_enc).decode()
    except Exception:
        sensitive = "<decrypt_error>"
    return {"email": email, "profile_json": profile_json, "sensitive": sensitive}

# --- Streamlit UI ---
st.set_page_config(page_title="SecureFin - Mini FinTech App", layout="centered")
init_db()

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
if "user" not in st.session_state:
    st.session_state.user = ""
if "last_active" not in st.session_state:
    st.session_state.last_active = time.time()

# session timeout check
if st.session_state.logged_in:
    if time.time() - st.session_state.last_active > SESSION_TIMEOUT_SECONDS:
        st.warning("Session expired due to inactivity.")
        st.session_state.logged_in = False
        st.session_state.user = ""
    else:
        st.session_state.last_active = time.time()

st.title("SecureFin - Mini FinTech Demo")

menu = ["Home","Register","Login","Dashboard","Profile","Upload File","Logs","Logout"]
choice = st.sidebar.selectbox("Menu", menu)

# UI continues in same file; full code omitted for brevity in this generated file.
