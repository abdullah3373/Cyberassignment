FinTech Secure Application – CY4053 Assignment 2
BSFT - 7th Semester (Fall 2025)
Instructor: Dr. Usama Arshad
📌 Overview

This is a secure FinTech mini-application developed for CY4053 – Cybersecurity for FinTech (Assignment 2).
It demonstrates core cybersecurity concepts:

Secure authentication

Data encryption

Input validation

Session handling

Error sanitization

Audit logging

FinTech-style transaction input

File upload validation

The application supports manual cybersecurity testing with 20+ test cases.

🛠 Tech Stack

Backend: Python Flask / (your choice)

Frontend: HTML/CSS/JS (or Streamlit UI if chosen)

Database: SQLite / MySQL

Encryption: AES-256 (Fernet or PyCryptoDome)

Password Hashing: bcrypt

🔐 Security Features Implemented
✔ 1. User Registration + Login

Password hashing (bcrypt)

Login rate limit / lockout

Secure session tokens

✔ 2. Password Strength Policy

Minimum length

Symbols, digits, uppercase, lowercase

✔ 3. Input Validation & Sanitization

Prevents SQL injection

Prevents XSS

Rejects over-length input

✔ 4. Session Management

Auto-logout after inactivity

Secure cookies

Logout button clears session

✔ 5. Secure Database Storage

Passwords hashed

Transactions encrypted (AES-256)

Logs protected

✔ 6. Error Handling

No stack traces exposed

Generic error messages

✔ 7. Encryption/Decryption Tool

Allows users to:

Enter text

Encrypt using AES

Decrypt using stored key

View encrypted data

✔ 8. Audit Logs

Every user action logged: login, logout, updates

✔ 9. Profile Update Page

Email, username update

Validations applied

✔ 10. File Upload Validation

Accept safe file types only

Reject executable/malicious files

📂 Project Folder Structure
/project
│── app.py
│── requirements.txt
│── README.md
│── /templates
│── /static
│── /database
│── /encryption
│── /logs

▶ How to Run
1. Install Requirements
pip install -r requirements.txt

2. Run Application
python app.py

3. Open in Browser
http://127.0.0.1:5000/

🧪 Manual Cybersecurity Testing

A complete test case document (20 tests) is included in the /documentation folder.

Tests include:

SQL injection

XSS

Weak passwords

Unauthorized access

Session expiry

Encryption/decryption

Input validation

File upload restrictions

Secure error handling

Data confidentiality
