# FinTech Secure Application – CY4053 Assignment 2
### Cybersecurity for FinTech (Fall 2025)  
### Instructor: Dr. Usama Arshad  
### BSFT – 7th Semester  

---

## 📌 Overview
This is a secure FinTech mini-application developed for **CY4053 Assignment 2**.

It demonstrates essential cybersecurity features used in real-world FinTech systems, including:

- Secure user authentication  
- Input validation  
- Password hashing  
- AES-256 encryption/decryption  
- Secure storage  
- Session management  
- File upload validation  
- Audit logging  
- Safe error handling  

Designed specifically for **manual cybersecurity testing (20+ test cases)**.

---

## 🛠 Tech Stack
- **Backend:** Python Flask  
- **Frontend:** HTML, CSS, JavaScript  
- **Database:** SQLite  
- **Security:**  
  - bcrypt password hashing  
  - AES-256 encryption  
  - Secure session cookies  

---

## 🔐 Security Features Implemented

### ✔ 1. User Registration & Login
- Password hashing (bcrypt)  
- Login lockout after multiple failed attempts  
- Secure session handling  

### ✔ 2. Strong Password Policy
- Uppercase, lowercase, digits, symbols  
- Minimum length required  

### ✔ 3. Input Validation & Sanitization
- Blocks SQL Injection  
- Blocks XSS attempts  
- Length limits  
- Strict numeric validation  

### ✔ 4. Session Management
- Auto session expiry  
- Secure logout  
- Unauthorized access protection  

### ✔ 5. AES Encryption / Decryption Tool
- User can enter text → Encrypt with AES-256  
- Decrypt encrypted text  
- Demonstrates confidentiality  

### ✔ 6. Audit Logging
Logs events like:
- Login / Logout  
- Profile updates  
- Encryption operations  
- File upload attempts  

### ✔ 7. File Upload Validation
- Only safe file types allowed  
- Rejects `.exe`, `.js`, `.php` etc.  
- MIME-Type + size validation  

### ✔ 8. Safe Error Handling
- No stack traces shown  
- Generic user-safe messages  

---

## 📂 Project Structure
