# PUIT24210078 HOSPITAL MANAGEMENT SYSTEM

A comprehensive, modern clinical healthcare management web application engineered for hospital administration, real-time doctor duty shift management, patient records tracking, appointment scheduling, and automated clinical first-aid symptom triage with safe OTC drug advice.

---

## 🌟 Key Modules & Features

### 1. 👥 Patients Records Management
- **Complete Patient Registry:** Keep track of patient demographics (Full Name, Age, Gender, Blood Group, Phone, Address, Emergency Contact).
- **Admission Tracking:** Categorize patients by Inpatient, Outpatient, Emergency, and Discharged status.
- **Clinical Records & History:** Store diagnosis, attending doctor, assigned ward/bed location, known drug allergies, and physician notes.
- **Search & Filter:** Instant search by name, patient ID, diagnosis, or phone number with real-time status filtering.
- **Detailed Chart Viewer & Printable Medical Records:** Print-ready patient charts formatted for clinical handover.

### 2. 👨‍⚕️ Doctors Directory
- **Specialist Profiles:** Directory of physicians with qualifications (MBBS, FWACS, MD, FRCS), medical departments, experience, room numbers, and contact information.
- **Departments Covered:**
  - Accident & Emergency (A&E)
  - Cardiovascular Sciences
  - Internal Medicine / OPD
  - Pediatrics & Child Health
  - Orthopedics & Sports Medicine
  - Maternal & Child Health (OB/GYN)
  - Neurology Department
  - Intensive Care Unit (ICU)
- **Status & Shift Management:** Toggle duty status between *On Duty*, *Off Duty*, *In Surgery*, and *On Break*.

### 3. ⏱ Doctors On Duty Roster (Live Shift Board)
- **Live Duty Board:** Real-time visibility into which doctors are actively on duty in the hospital.
- **Shift Rostering:**
  - Morning Shift (08:00 – 16:00)
  - Evening Shift (16:00 – 00:00)
  - Night Shift (00:00 – 08:00)
- **Instant Status Toggle:** Update doctor duty status directly with one click.
- **Emergency Hotline:** Quick phone links to on-duty specialists for acute clinical triage.

### 4. 📅 Doctors Appointments Scheduler
- **Appointment Booking:** Schedule consultations between registered patients and available doctors.
- **Time Slot & Priority:** Assign date, time, and clinical priority level (*Routine*, *Urgent*, *Emergency*).
- **Status Lifecycle:** Track appointments through *Pending*, *Confirmed*, *Completed*, and *Cancelled* states.

### 5. 💊 First Aid & Drug Advisor (Symptom Complaint Triage)
- **Intelligent Complaint Analyzer:** Allows patients or hospital triage nurses to type natural language complaints (e.g., *"severe throbbing headache and vomiting"*, *"hot stove burn with blister"*, *"twisted my ankle playing football"*, *"deep knife cut and bleeding"*, *"asthma attack cant breathe"*).
- **Quick Complaint Shortcuts:** 1-click access to common conditions:
  - High Fever & Chills
  - Severe Headache & Migraines
  - Minor Burns & Scalds
  - Cuts, Lacerations & Bleeding
  - Stomach Ache, Diarrhea & Food Poisoning
  - Acid Reflux & Heartburn
  - Asthma & Shortness of Breath
  - Allergic Reactions, Hives & Insect Stings
  - Sprains, Strains & Joint Trauma
  - Cough, Cold & Sore Throat
  - Severe Toothache & Pulpitis
  - Eye Irritation & Foreign Bodies
- **Clinical Protocols Provided:**
  - **Immediate First Aid Actions:** Step-by-step checklist to perform right away.
  - **Recommended First Aid Drugs & Safe OTC Medications:** Detailed adult dosage, pediatric guidelines, clinical purpose, and essential contraindications/safety warnings.
  - **Critical Red Flag Warnings:** Clear signals of when to immediately rush to the Emergency Room.
  - **Specialist Referral & Instant Booking:** Automatically pairs the complaint with the appropriate on-duty hospital specialist.

### 6. 🔐 Secure Login & Two-Step Authentication (2FA) with Salt & Pepper
- **Gated Hospital Access:** The Hospital Management System interface and patient electronic health records are strictly locked behind an identity verification gateway.
- **🧂 Unique Per-User Salt (128-bit):** Every clinical staff member is provisioned with an individual, cryptographically random 128-bit hex salt stored alongside their user profile. Precomputed rainbow tables and multi-target dictionary attacks are completely rendered useless.
- **🌶 Confidential Server-Wide Pepper (HMAC Secret):** An application-level secret pepper key known only to the running server environment and *never* stored in `users.json` or client storage. Protects against database leaks and offline GPU hash-cracking.
- **⚙️ Key Derivation:** PBKDF2 with HMAC-SHA512 running over 10,000 iterations to derive a high-entropy 512-bit key.
- **📱 Two-Step Authentication (2FA / OTP Code):**
  - Upon verifying Step 1 credentials, the system dispatches a time-sensitive, single-use 6-digit numeric OTP code.
  - **OTP Delivery Mechanism:** Dispatched in real-time to the server console log AND displayed on-screen via a simulated Emergency Medical Dispatch alert card with 1-click Copy and Auto-Fill buttons.
  - **Security Controls:** 5-minute expiry countdown timer, 30-second resend throttle cooldown, and automatic session invalidation after 5 incorrect attempts to stop brute-force attacks.
- **Clinical Staff Profiles & Roles:** Pre-seeded with realistic hospital roles (Administrator, Consultant Doctor, Triage Nurse) plus full support for registering new staff members.

---

## 🔑 Pre-Configured Clinical Staff Accounts

| Role | Username | Password | Contact Channel | Staff ID |
| :--- | :--- | :--- | :--- | :--- |
| **System Administrator** | `admin` | `AdminPassword123!` | `admin@hospital.puit.edu.ng` / `+234 803 123 4567` | `PUIT-ADM-001` |
| **Consultant Physician** | `dr.adebayo` | `DoctorPassword123!` | `dr.adebayo@hospital.puit.edu.ng` / `+234 802 987 6543` | `PUIT-DOC-101` |
| **Head Triage Nurse** | `nurse.chioma` | `NursePassword123!` | `chioma@hospital.puit.edu.ng` / `+234 814 555 0199` | `PUIT-NRS-204` |

*(Tip: 1-Click quick fill buttons are available on the login screen for instant testing!)*

---

## 🚀 How to Run the System

### Option 1: Direct Double-Click (Zero Setup Required)
You can directly open `index.html` in any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox) by double-clicking it. All features and local storage persistence work out of the box!

### Option 2: Using the Windows Launcher (`start.bat`)
Double-click `start.bat` in the project folder. It will automatically:
1. Open Visual Studio Code in this project folder.
2. Launch the local web server on `http://localhost:3000`.
3. Open `http://localhost:3000` in your default browser.

### Option 3: Visual Studio Code & Terminal
1. Open Visual Studio Code.
2. Open this folder: `c:\Users\HP\Desktop\HOSPITAL MANAGEMENT SYSTEM`.
3. Open the integrated terminal (`Ctrl + ~`) and start the server:
   ```bash
   node server.js
   ```
4. Visit `http://localhost:3000` in your web browser.

---

## 📁 Project Structure

```text
HOSPITAL MANAGEMENT SYSTEM/
├── index.html            # Main HTML layout, 2FA auth portal & modal dialogues
├── css/
│   └── styles.css        # Clinical styling, 2FA portal layout, responsive grids
├── js/
│   ├── auth.js           # 2-Step Authentication manager (Salt, Pepper, 2FA OTP)
│   ├── data.js           # Seed data for doctors, patients, shifts & First Aid formulary
│   ├── symptomChecker.js # Natural language complaint parsing & triage scoring engine
│   └── app.js            # Main application controller, localStorage & CRUD logic
├── server.js             # Secure Node.js server with PBKDF2/SHA-512 & 2FA API
├── users.json            # Salted & peppered clinical staff accounts
├── package.json          # Project metadata & start script
├── start.bat             # 1-click launcher for Windows
└── README.md             # Complete documentation & credentials
```

---

## 🔒 Data Persistence & Privacy
All records (Patients, Doctors, Shifts, Appointments) are stored locally in the browser's `localStorage`. No sensitive medical data is transmitted over external servers. You can reset records to the original demo dataset at any time using the **🔄 Reset Sample Records** button in the sidebar.
