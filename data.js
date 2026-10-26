// PUIT24210078 HOSPITAL MANAGEMENT SYSTEM - Initial Data & Knowledgebase
// Provides rich seed data and First Aid Clinical Directory

const INITIAL_DOCTORS = [
    {
        id: "DOC-101",
        name: "Dr. Samuel Adebayo",
        specialization: "Emergency Medicine",
        qualification: "MBBS, FWACS (Emergency Care)",
        department: "Accident & Emergency (A&E)",
        phone: "+234 803 111 2233",
        email: "s.adebayo@puit-hospital.org",
        experience: "14 years",
        room: "Trauma Bay 1 / ER-01",
        shift: "Morning (08:00 - 16:00)",
        shiftType: "morning",
        status: "On Duty",
        dutyDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        avatarColor: "#0284c7"
    },
    {
        id: "DOC-102",
        name: "Dr. Elena Rostova",
        specialization: "Cardiology",
        qualification: "MD, FACC (Interventional Cardiology)",
        department: "Cardiovascular Sciences",
        phone: "+234 802 334 5566",
        email: "e.rostova@puit-hospital.org",
        experience: "16 years",
        room: "Cardio Suite 304",
        shift: "Morning (08:00 - 16:00)",
        shiftType: "morning",
        status: "On Duty",
        dutyDays: ["Monday", "Wednesday", "Friday"],
        avatarColor: "#e11d48"
    },
    {
        id: "DOC-103",
        name: "Dr. Kenneth Okonjo",
        specialization: "General Medicine & Internal Medicine",
        qualification: "MBBS, FMCP",
        department: "Internal Medicine / OPD",
        phone: "+234 805 444 8899",
        email: "k.okonjo@puit-hospital.org",
        experience: "11 years",
        room: "Consultation Room 102",
        shift: "Evening (16:00 - 00:00)",
        shiftType: "evening",
        status: "On Duty",
        dutyDays: ["Monday", "Tuesday", "Thursday", "Saturday"],
        avatarColor: "#059669"
    },
    {
        id: "DOC-104",
        name: "Dr. Aisha Bello",
        specialization: "Pediatrics & Child Health",
        qualification: "MBBS, FWACP (Pediatrics)",
        department: "Pediatrics Ward",
        phone: "+234 809 777 6655",
        email: "a.bello@puit-hospital.org",
        experience: "9 years",
        room: "Pediatric Clinic 201",
        shift: "Morning (08:00 - 16:00)",
        shiftType: "morning",
        status: "On Duty",
        dutyDays: ["Tuesday", "Wednesday", "Thursday", "Friday"],
        avatarColor: "#7c3aed"
    },
    {
        id: "DOC-105",
        name: "Dr. Marcus Vance",
        specialization: "Orthopedic Surgery & Trauma",
        qualification: "MD, FRCS (Ortho)",
        department: "Orthopedics & Sports Medicine",
        phone: "+234 808 999 1122",
        email: "m.vance@puit-hospital.org",
        experience: "15 years",
        room: "Surgical Wing OR-4",
        shift: "Evening (16:00 - 00:00)",
        shiftType: "evening",
        status: "On Duty",
        dutyDays: ["Monday", "Wednesday", "Saturday"],
        avatarColor: "#ea580c"
    },
    {
        id: "DOC-106",
        name: "Dr. Fatimah Al-Hassan",
        specialization: "Obstetrics & Gynecology",
        qualification: "MBBS, FWACS (OB/GYN)",
        department: "Maternal & Child Health",
        phone: "+234 813 555 7788",
        email: "f.alhassan@puit-hospital.org",
        experience: "12 years",
        room: "Maternity Ward Suite 110",
        shift: "Night (00:00 - 08:00)",
        shiftType: "night",
        status: "On Duty",
        dutyDays: ["Thursday", "Friday", "Saturday", "Sunday"],
        avatarColor: "#db2777"
    },
    {
        id: "DOC-107",
        name: "Dr. David Chen",
        specialization: "Neurology",
        qualification: "MD, PhD (Neuroscience)",
        department: "Neurology Department",
        phone: "+234 814 222 3344",
        email: "d.chen@puit-hospital.org",
        experience: "18 years",
        room: "Neuro Center 405",
        shift: "Morning (08:00 - 16:00)",
        shiftType: "morning",
        status: "Off Duty",
        dutyDays: ["Tuesday", "Thursday", "Friday"],
        avatarColor: "#4f46e5"
    },
    {
        id: "DOC-108",
        name: "Dr. Chidinma Eze",
        specialization: "Critical Care & Anesthesiology",
        qualification: "MBBS, DA, FWACS",
        department: "Intensive Care Unit (ICU)",
        phone: "+234 816 888 4433",
        email: "c.eze@puit-hospital.org",
        experience: "13 years",
        room: "ICU Command Unit",
        shift: "Night (00:00 - 08:00)",
        shiftType: "night",
        status: "On Duty",
        dutyDays: ["Monday", "Wednesday", "Friday", "Sunday"],
        avatarColor: "#0d9488"
    }
];

const INITIAL_PATIENTS = [
    {
        id: "PAT-1001",
        name: "Emmanuel Chukwuma",
        age: 42,
        gender: "Male",
        bloodGroup: "O+",
        phone: "+234 803 234 8871",
        address: "14 Greenfield Avenue, Ikeja, Lagos",
        emergencyContact: "Chioma Chukwuma (Wife) - +234 803 234 8872",
        condition: "Hypertensive Urgency with Mild Angina",
        admissionStatus: "Inpatient",
        assignedDoctorId: "DOC-102",
        assignedDoctorName: "Dr. Elena Rostova",
        department: "Cardiovascular Sciences",
        room: "Ward B, Bed 12",
        admissionDate: "2026-10-15",
        allergies: "Penicillin",
        notes: "BP stabilized from 180/110 to 135/85 mmHg. Daily ECG monitoring."
    },
    {
        id: "PAT-1002",
        name: "Grace Victoria Adeleke",
        age: 28,
        gender: "Female",
        bloodGroup: "B+",
        phone: "+234 809 456 7812",
        address: "Plot 8 Sunset Boulevard, Victoria Island",
        emergencyContact: "Gbenga Adeleke (Brother) - +234 802 888 1234",
        condition: "Acute Gastroenteritis & Moderate Dehydration",
        admissionStatus: "Inpatient",
        assignedDoctorId: "DOC-103",
        assignedDoctorName: "Dr. Kenneth Okonjo",
        department: "Internal Medicine / OPD",
        room: "Ward A, Bed 04",
        admissionDate: "2026-10-17",
        allergies: "Sulfa drugs",
        notes: "Completed 2 units IV Ringers Lactate. Tolerating oral fluid rehydration."
    },
    {
        id: "PAT-1003",
        name: "Tariq Ibrahim",
        age: 35,
        gender: "Male",
        bloodGroup: "A+",
        phone: "+234 806 789 0123",
        address: "Block 4, Palm Court, Lekki Phase 1",
        emergencyContact: "Halima Ibrahim (Sister) - +234 806 789 0124",
        condition: "Right Tibial Fissure & Ankle Sprain (Sports Injury)",
        admissionStatus: "Outpatient",
        assignedDoctorId: "DOC-105",
        assignedDoctorName: "Dr. Marcus Vance",
        department: "Orthopedics & Sports Medicine",
        room: "OPD Rehab 3",
        admissionDate: "2026-10-18",
        allergies: "None",
        notes: "Cast applied. Scheduled for physical therapy review in 2 weeks."
    },
    {
        id: "PAT-1004",
        name: "Baby Kamsiyochukwu Obi",
        age: 4,
        gender: "Male",
        bloodGroup: "O+",
        phone: "+234 818 345 6789",
        address: "27 Coral Crescent, Surulere",
        emergencyContact: "Ngozi Obi (Mother) - +234 818 345 6780",
        condition: "Bronchopneumonia & High-grade Fever (39.2°C)",
        admissionStatus: "Emergency",
        assignedDoctorId: "DOC-104",
        assignedDoctorName: "Dr. Aisha Bello",
        department: "Pediatrics Ward",
        room: "Pediatric ICU Crib 2",
        admissionDate: "2026-10-18",
        allergies: "None known",
        notes: "Oxygen saturation 97% on nasal prongs. Nebulization ongoing."
    },
    {
        id: "PAT-1005",
        name: "Zainab Mohammed",
        age: 31,
        gender: "Female",
        bloodGroup: "AB+",
        phone: "+234 805 123 4567",
        address: "19 Marina Road, Ikoyi",
        emergencyContact: "Farouk Mohammed (Husband) - +234 805 123 4568",
        condition: "Third Trimester Antenatal Care - Gestational Diabetes Screen",
        admissionStatus: "Outpatient",
        assignedDoctorId: "DOC-106",
        assignedDoctorName: "Dr. Fatimah Al-Hassan",
        department: "Maternal & Child Health",
        room: "Maternity Clinic 102",
        admissionDate: "2026-10-19",
        allergies: "Aspirin",
        notes: "Routine 34th week ultrasound normal. Fetal heart rate 142 bpm."
    },
    {
        id: "PAT-1006",
        name: "Patrick O'Connor",
        age: 58,
        gender: "Male",
        bloodGroup: "A-",
        phone: "+234 812 998 7766",
        address: "Flat 12, Atlantic Towers, Oniru",
        emergencyContact: "Mary O'Connor (Daughter) - +234 812 998 7767",
        condition: "Post-Appendectomy Recovery",
        admissionStatus: "Discharged",
        assignedDoctorId: "DOC-101",
        assignedDoctorName: "Dr. Samuel Adebayo",
        department: "Accident & Emergency (A&E)",
        room: "Discharged (Was Bed 8)",
        admissionDate: "2026-10-12",
        allergies: "Codeine",
        notes: "Sutures healing cleanly. Discharged home with oral analgesics."
    }
];

const INITIAL_APPOINTMENTS = [
    {
        id: "APT-501",
        patientName: "Grace Victoria Adeleke",
        patientPhone: "+234 809 456 7812",
        doctorId: "DOC-103",
        doctorName: "Dr. Kenneth Okonjo",
        department: "Internal Medicine / OPD",
        date: "2026-10-19",
        time: "10:30",
        reason: "Follow-up stool analysis review and gastrointestinal checkup",
        priority: "Routine",
        status: "Confirmed"
    },
    {
        id: "APT-502",
        patientName: "Emmanuel Chukwuma",
        patientPhone: "+234 803 234 8871",
        doctorId: "DOC-102",
        doctorName: "Dr. Elena Rostova",
        department: "Cardiovascular Sciences",
        date: "2026-10-19",
        time: "12:00",
        reason: "Comprehensive Echocardiogram and 24-hr Holter review",
        priority: "Urgent",
        status: "Confirmed"
    },
    {
        id: "APT-503",
        patientName: "Tariq Ibrahim",
        patientPhone: "+234 806 789 0123",
        doctorId: "DOC-105",
        doctorName: "Dr. Marcus Vance",
        department: "Orthopedics & Sports Medicine",
        date: "2026-10-20",
        time: "14:15",
        reason: "X-ray reassessment of tibial fissure and mobility test",
        priority: "Routine",
        status: "Pending"
    },
    {
        id: "APT-504",
        patientName: "Zainab Mohammed",
        patientPhone: "+234 805 123 4567",
        doctorId: "DOC-106",
        doctorName: "Dr. Fatimah Al-Hassan",
        department: "Maternal & Child Health",
        date: "2026-10-21",
        time: "09:00",
        reason: "Bi-weekly fetal Doppler ultrasound and glucose tolerance check",
        priority: "Routine",
        status: "Confirmed"
    },
    {
        id: "APT-505",
        patientName: "Baby Kamsiyochukwu Obi",
        patientPhone: "+234 818 345 6789",
        doctorId: "DOC-104",
        doctorName: "Dr. Aisha Bello",
        department: "Pediatrics Ward",
        date: "2026-10-19",
        time: "11:00",
        reason: "Pediatric respiratory recovery evaluation",
        priority: "Urgent",
        status: "Confirmed"
    }
];

// Clinical First Aid & Drug Advice Database
// Maps medical complaints and symptoms to actionable first aid protocol, recommended OTC drugs,
// dosage instructions, precautions, and specialist referral.
const FIRST_AID_KNOWLEDGEBASE = [
    {
        id: "complaint-fever",
        category: "General / Infection",
        title: "High Fever, Hot Body & Chills",
        keywords: ["fever", "hot", "temperature", "chills", "shivering", "warm body", "febrile", "sweating"],
        urgency: "Moderate", // Low, Moderate, High, Emergency
        urgencyColor: "#f59e0b",
        recommendedDepartment: "Internal Medicine / OPD",
        recommendedDoctorId: "DOC-103",
        overview: "An elevated body temperature above 37.8°C (100°F) is commonly a response to viral or bacterial infections, malaria, or heat exposure.",
        immediateActions: [
            "Rest in a cool, well-ventilated room with lightweight clothing.",
            "Apply lukewarm water compress (sponging) to forehead, neck, armpits, and groin. Never use freezing ice water or alcohol rubs.",
            "Drink plenty of fluids: Oral Rehydration Salts (ORS), water, coconut water, or clear broth to prevent dehydration.",
            "Record temperature every 2 hours using a digital thermometer."
        ],
        drugs: [
            {
                name: "Paracetamol (Acetaminophen)",
                type: "Antipyretic / Analgesic",
                adultDosage: "500mg – 1000mg orally every 4 to 6 hours as needed (Max: 4000mg / 24 hours).",
                childDosage: "10 – 15 mg/kg per dose every 4 to 6 hours (Syrup form).",
                purpose: "Rapidly lowers fever temperature and relieves body aches.",
                safetyWarning: "Avoid exceeding maximum dosage to prevent severe liver toxicity. Do not combine with other Paracetamol-containing cold remedies."
            },
            {
                name: "Ibuprofen (Advil / Motrin)",
                type: "NSAID (Non-Steroidal Anti-Inflammatory)",
                adultDosage: "400mg orally with food or milk every 6 to 8 hours as needed.",
                childDosage: "5 – 10 mg/kg under medical supervision (if over 6 months old).",
                purpose: "Reduces high fever and inflammatory muscle ache.",
                safetyWarning: "Always take after food. Contraindicated in suspected Dengue fever, active stomach ulcers, or severe kidney disease."
            },
            {
                name: "Oral Rehydration Salts (ORS)",
                type: "Electrolyte Replenisher",
                adultDosage: "Dissolve 1 sachet in 1 Litre of clean drinking water; sip frequently.",
                childDosage: "Sip 100ml - 200ml after fever sweating episodes.",
                purpose: "Restores vital sodium and potassium lost through perspiration.",
                safetyWarning: "Do not boil after dissolving. Discard prepared solution after 24 hours."
            }
        ],
        redFlags: [
            "Temperature above 39.5°C (103°F) that does not drop after medication.",
            "Stiff neck, severe photophobia (light sensitivity), or sudden confusion.",
            "Fever accompanied by petechial rash (tiny purple spots on skin).",
            "Fever in infants younger than 3 months (requires immediate ER triage)."
        ]
    },
    {
        id: "complaint-headache",
        category: "Neurological / Pain",
        title: "Severe Headache, Migraine & Head Pressure",
        keywords: ["headache", "head ache", "migraine", "head pain", "throbbing head", "temple pain", "tension headache"],
        urgency: "Moderate",
        urgencyColor: "#f59e0b",
        recommendedDepartment: "Neurology Department",
        recommendedDoctorId: "DOC-107",
        overview: "Headaches can stem from tension, dehydration, eye strain, migraine, sinusitis, or elevated blood pressure.",
        immediateActions: [
            "Retire to a quiet, darkened, cool room and close your eyes.",
            "Apply a cold gel pack or ice pack wrapped in a cloth to your forehead or the back of your neck for 15 minutes.",
            "Gently massage tense muscles at the temples, neck, and shoulder blades.",
            "Drink 500ml of water immediately; dehydration is a very frequent primary trigger."
        ],
        drugs: [
            {
                name: "Paracetamol (Acetaminophen) 500mg",
                type: "Analgesic",
                adultDosage: "1 to 2 tablets (500mg - 1000mg) with water.",
                childDosage: "Pediatric syrup dosage as per weight chart.",
                purpose: "Gentle first-line pain relief for tension headaches and mild migraines.",
                safetyWarning: "Do not take more than 8 tablets (4000mg) within 24 hours."
            },
            {
                name: "Ibuprofen 400mg",
                type: "Anti-inflammatory Analgesic",
                adultDosage: "1 tablet (400mg) taken strictly with food or a glass of milk.",
                childDosage: "Consult doctor for pediatric use.",
                purpose: "Excellent for throbbing vascular headaches and sinus pressure pain.",
                safetyWarning: "Avoid if you have history of gastric ulcers or severe asthma."
            },
            {
                name: "Paracetamol + Caffeine combination (e.g. Panadol Extra)",
                type: "Combination Analgesic",
                adultDosage: "1 to 2 tablets every 6 hours (Max 8 tablets per day).",
                childDosage: "Not recommended for children under 12.",
                purpose: "Caffeine constricts dilated cranial blood vessels to boost migraine relief.",
                safetyWarning: "Avoid evening intake if prone to insomnia."
            }
        ],
        redFlags: [
            "'Thunderclap' headache reaching peak intensity within seconds (worst headache of life).",
            "Headache accompanied by slurred speech, facial drooping, or one-sided weakness (Stroke warning).",
            "Headache after a traumatic blow to the head.",
            "Headache with fever, stiff neck, and nausea."
        ]
    },
    {
        id: "complaint-burns",
        category: "Trauma & Wounds",
        title: "Minor Burns, Scalds & Heat Blisters",
        keywords: ["burn", "burns", "scald", "hot water", "blister", "stove burn", "chemical burn", "steam burn", "fire"],
        urgency: "High",
        urgencyColor: "#ea580c",
        recommendedDepartment: "Accident & Emergency (A&E)",
        recommendedDoctorId: "DOC-101",
        overview: "First- and superficial second-degree burns involving hot liquids, steam, irons, or cooking stoves need immediate cooling and aseptic dressing.",
        immediateActions: [
            "IMMEDIATELY cool the burn under gently running cool tap water for 15 to 20 minutes. DO NOT use ice or freezing water, which causes tissue necrosis.",
            "Gently remove rings, watches, or restrictive clothing around the area before swelling starts.",
            "NEVER pop or puncture blisters, as intact skin protects against lethal bacterial infection.",
            "NEVER apply butter, raw eggs, toothpaste, or motor oil to burns."
        ],
        drugs: [
            {
                name: "Silver Sulfadiazine Cream 1% (Dermazin / Silvadene)",
                type: "Topical Antibacterial Cream",
                adultDosage: "Apply a 2mm thick layer over clean burned skin 1 - 2 times daily; cover with sterile non-adherent dressing.",
                childDosage: "Safe for children over 2 months.",
                purpose: "Prevents wound sepsis and promotes burn re-epithelialization.",
                safetyWarning: "Contraindicated in patients allergic to sulfonamides or in late pregnancy."
            },
            {
                name: "Pure Aloe Vera Gel / Burnol",
                type: "Soothing Topical Protectant",
                adultDosage: "Apply gently 2 - 3 times daily on first-degree (non-broken, red) burns.",
                childDosage: "Safe for topical use on intact skin.",
                purpose: "Cools burning sensations and speeds cellular repair.",
                safetyWarning: "Do not apply inside open blister beds."
            },
            {
                name: "Paracetamol 500mg / Ibuprofen 400mg",
                type: "Oral Analgesic",
                adultDosage: "1 tablet every 6 hours for burning pain management.",
                childDosage: "Paracetamol suspension as per weight.",
                purpose: "Controls the throbbing pain associated with burn trauma.",
                safetyWarning: "Ensure proper hydration."
            }
        ],
        redFlags: [
            "Burns covering the face, eyes, hands, groin, or major joint surfaces.",
            "Third-degree burns: skin looks charred black, white, leathery, or is painless due to nerve damage.",
            "Electrical or high-concentration industrial chemical burns.",
            "Burn area larger than the palm of the patient's hand."
        ]
    },
    {
        id: "complaint-cuts-wounds",
        category: "Trauma & Wounds",
        title: "Cuts, Lacerations, Scrapes & Bleeding",
        keywords: ["cut", "cuts", "wound", "bleeding", "blood", "laceration", "knife cut", "glass cut", "scrape", "abrasion"],
        urgency: "High",
        urgencyColor: "#ea580c",
        recommendedDepartment: "Accident & Emergency (A&E)",
        recommendedDoctorId: "DOC-101",
        overview: "Skin abrasions, knife cuts, glass slices, and puncture wounds need rapid bleeding control, antiseptic cleansing, and tetanus evaluation.",
        immediateActions: [
            "Apply firm, direct pressure on the wound with a clean sterile gauze or clean cloth for at least 5 to 10 minutes without lifting to check.",
            "Elevate the injured limb above heart level to decrease blood flow and capillary leakage.",
            "Wash surrounding skin gently with clean water and mild soap. Rinse out loose debris.",
            "Do NOT pull out any deeply impaled objects (e.g. knife, deep glass); bandage around it and rush to Hospital."
        ],
        drugs: [
            {
                name: "Povidone-Iodine 5% / 10% Solution (Betadine)",
                type: "Topical Antiseptic",
                adultDosage: "Apply with sterile cotton ball around and over wound margins once cleaned; allow to dry.",
                childDosage: "Safe for minor scrapes.",
                purpose: "Broad-spectrum antiseptic killing bacteria, viruses, and fungi.",
                safetyWarning: "Check for iodine hypersensitivity. Avoid deep cavity packing."
            },
            {
                name: "Triple Antibiotic Ointment (Neosporin / Bacitracin)",
                type: "Topical Antibacterial",
                adultDosage: "Apply a thin layer over clean wound 1 - 3 times daily before covering with a sterile plaster/bandage.",
                childDosage: "Apply small dab once or twice daily.",
                purpose: "Prevents localized bacterial infection and avoids gauze sticking to wound.",
                safetyWarning: "Discontinue if allergic rash or contact dermatitis develops."
            },
            {
                name: "Tetanus Toxoid Vaccine (Hospital Injection)",
                type: "Immunization",
                adultDosage: "0.5ml Intramuscular booster if dirty wound and last booster was > 5 years ago.",
                childDosage: "As per routine immunization card.",
                purpose: "Protects against fatal Clostridium tetani toxin.",
                safetyWarning: "Administer within 48 hours at PUIT Emergency Room."
            }
        ],
        redFlags: [
            "Pulsing, spurting bright red blood (arterial laceration) - apply immediate pressure and call ER.",
            "Wound gaping widely, revealing fat, muscle, or tendon (requires emergency sutures).",
            "Numbness, tingling, or loss of motion downstream from the cut.",
            "Bite wounds from humans or animals (high rabies/infection hazard)."
        ]
    },
    {
        id: "complaint-stomach-pain",
        category: "Gastrointestinal",
        title: "Stomach Ache, Diarrhea, Cramps & Food Poisoning",
        keywords: ["stomach", "stomach ache", "belly pain", "tummy", "abdominal pain", "diarrhea", "loose stool", "vomiting", "food poisoning", "cramps"],
        urgency: "Moderate",
        urgencyColor: "#f59e0b",
        recommendedDepartment: "Internal Medicine / OPD",
        recommendedDoctorId: "DOC-103",
        overview: "Gastrointestinal distress may be caused by dietary indiscretion, bacterial/viral gastroenteritis, amoebiasis, or peptic ulcers.",
        immediateActions: [
            "Stop all dairy products, greasy foods, caffeine, and spicy meals for 24-48 hours.",
            "Begin immediate oral rehydration therapy: sip 200ml ORS solution after every watery stool.",
            "Adopt the BRAT diet (Bananas, Rice, Applesauce, Toast) once vomiting halts.",
            "Rest with warm water bottle placed over abdomen to soothe spasms."
        ],
        drugs: [
            {
                name: "Oral Rehydration Salts (WHO Formula ORS)",
                type: "Oral Hydration Electrolyte",
                adultDosage: "Drink 1 to 2 liters throughout the day, sipping slowly.",
                childDosage: "50 - 100ml after each loose stool passage.",
                purpose: "Crucial life-saving prevention against circulatory collapse from dehydration.",
                safetyWarning: "Always use clean boiled or bottled water."
            },
            {
                name: "Hyoscine Butylbromide (Buscopan) 10mg",
                type: "Antispasmodic",
                adultDosage: "1 to 2 tablets (10mg - 20mg) 3 to 4 times daily for crampy pains.",
                childDosage: "Under medical prescription only.",
                purpose: "Relaxes smooth muscles of the digestive tract to stop painful cramps.",
                safetyWarning: "Avoid in glaucoma or severe prostate enlargement."
            },
            {
                name: "Zinc Sulfate 20mg (Pediatric/Adult)",
                type: "Enteric Mucosal Restorative",
                adultDosage: "20mg daily for 10-14 days.",
                childDosage: "10mg daily for infants under 6 months; 20mg for older children.",
                purpose: "Reduces severity and duration of diarrhea episodes.",
                safetyWarning: "Take with food to minimize nausea."
            },
            {
                name: "Activated Charcoal Tablets 250mg",
                type: "Toxin Adsorbent",
                adultDosage: "2 to 4 capsules with a glass of water for acute food toxicity.",
                childDosage: "Consult physician.",
                purpose: "Binds bacterial toxins and gas in the gut.",
                safetyWarning: "Do not take within 2 hours of other oral prescription drugs."
            }
        ],
        redFlags: [
            "Intense, sharp localized pain in lower right abdomen (Appendicitis risk - do NOT take laxatives!).",
            "Vomiting blood or bowel movements looking black/tarry or containing visible frank blood.",
            "Inability to keep any fluids down for more than 12 hours.",
            "High fever with rigid, board-like abdomen."
        ]
    },
    {
        id: "complaint-acidity",
        category: "Gastrointestinal",
        title: "Acid Reflux, Heartburn & Indigestion",
        keywords: ["acid", "acidity", "heartburn", "reflux", "gerd", "indigestion", "bloating", "sour burp", "gastric"],
        urgency: "Low",
        urgencyColor: "#10b981",
        recommendedDepartment: "Internal Medicine / OPD",
        recommendedDoctorId: "DOC-103",
        overview: "Acid reflux occurs when stomach acid travels backwards into the esophagus, causing a burning sensation behind the breastbone.",
        immediateActions: [
            "Stand upright or sit in an elevated 45° angle. DO NOT lie flat after meals.",
            "Loosen tight belts, waistbands, or tight clothing around the abdomen.",
            "Sip a glass of cool water or non-fat milk to wash down acid.",
            "Avoid citrus fruits, chocolates, carbonated soda, and raw onions."
        ],
        drugs: [
            {
                name: "Magnesium Trisilicate & Aluminium Hydroxide Gel (Gaviscon / Gelusil)",
                type: "Antacid & Alginate Barrier",
                adultDosage: "10ml – 20ml liquid suspension or 2 chewable tablets taken 30 minutes after meals and at bedtime.",
                childDosage: "5ml – 10ml as guided by doctor.",
                purpose: "Rapidly neutralizes gastric acidity and creates a protective foam raft over stomach contents.",
                safetyWarning: "Take 2 hours apart from other medications to ensure absorption."
            },
            {
                name: "Omeprazole 20mg / Pantoprazole 40mg",
                type: "Proton Pump Inhibitor (PPI)",
                adultDosage: "1 capsule (20mg) taken once daily in the morning 30 minutes before breakfast.",
                childDosage: "Specialist prescription only.",
                purpose: "Significantly cuts down stomach acid production for prolonged 24-hr relief.",
                safetyWarning: "Swallow whole with water; do not crush or chew beads."
            },
            {
                name: "Famotidine 20mg (Pepcid)",
                type: "H2 Blocker",
                adultDosage: "1 tablet (20mg) taken 30 to 60 minutes before eating trigger foods.",
                childDosage: "Doctor consultation recommended.",
                purpose: "Fast relief from nighttime heartburn and hyperacidity.",
                safetyWarning: "Dose reduction needed in moderate to severe renal impairment."
            }
        ],
        redFlags: [
            "Chest pressure or burning sensation radiating to left arm, neck, jaw, or shoulder (RULE OUT HEART ATTACK!).",
            "Difficulty swallowing food or pills (dysphagia).",
            "Unexplained weight loss or vomiting coffee-ground material."
        ]
    },
    {
        id: "complaint-asthma",
        category: "Respiratory",
        title: "Shortness of Breath, Wheezing & Asthma Attack",
        keywords: ["asthma", "breathing", "shortness of breath", "wheezing", "chest tightness", "gasping", "breath", "suffocating"],
        urgency: "Emergency",
        urgencyColor: "#dc2626",
        recommendedDepartment: "Accident & Emergency (A&E)",
        recommendedDoctorId: "DOC-101",
        overview: "Bronchospasm and airway constriction that requires rapid rescue bronchodilators to avoid hypoxic respiratory failure.",
        immediateActions: [
            "Sit the person upright comfortably. NEVER allow them to lie flat down.",
            "Loosen all restrictive collar buttons, ties, and clothing around the chest.",
            "Keep the patient calm with slow, steady breaths in through nose and out through pursed lips.",
            "Remove all environmental triggers (cigarette smoke, dust, cold draft, incense)."
        ],
        drugs: [
            {
                name: "Salbutamol / Albuterol Inhaler (Ventolin 100mcg)",
                type: "Short-Acting Beta-2 Agonist (Rescue Inhaler)",
                adultDosage: "Give 2 to 4 puffs (ideally with a spacer) immediately. If no relief, give 2 puffs every 2 minutes up to 10 puffs while awaiting ambulance.",
                childDosage: "2 to 6 puffs via spacer device under adult supervision.",
                purpose: "Rapidly relaxes bronchial smooth muscles to open narrowed airways within 3-5 minutes.",
                safetyWarning: "Mild hand tremors and tachycardia (fast heart rate) are common expected side effects."
            },
            {
                name: "Prednisolone 20mg – 40mg Oral (Emergency Hospital Stock)",
                type: "Systemic Corticosteroid",
                adultDosage: "40mg single oral dose as initiated by ER doctor.",
                childDosage: "1mg/kg under ER medical direction.",
                purpose: "Subdues severe inflammation and swelling in bronchial lining.",
                safetyWarning: "Take with food; requires short acute course only."
            }
        ],
        redFlags: [
            "Person cannot speak a full sentence in one breath.",
            "Lips, fingernails, or tongue turning blue or grey (Cyanosis / critical hypoxia).",
            "Skin sucking in tightly around ribs and neck during inhalation (retractions).",
            "Peak flow meter reading below 50% or no improvement after 10 inhaler puffs -> CALL ER NOW."
        ]
    },
    {
        id: "complaint-allergy",
        category: "Immunology",
        title: "Allergic Reaction, Hives, Itching & Insect Stings",
        keywords: ["allergy", "allergic", "hives", "itch", "itching", "rash", "bee sting", "insect bite", "swelling", "urticaria"],
        urgency: "High",
        urgencyColor: "#ea580c",
        recommendedDepartment: "Internal Medicine / OPD",
        recommendedDoctorId: "DOC-103",
        overview: "Histamine release triggered by food (peanuts, shellfish), drug reactions, plant contact, or insect venom.",
        immediateActions: [
            "Scrape off insect stinger with edge of a credit card if visible (do not squeeze venom sac with tweezers).",
            "Wash affected area with soap and cool water, then apply cold compress for 10 minutes.",
            "Check breathing and airway immediately. If throat tightness or swelling begins, treat as Anaphylaxis emergency!"
        ],
        drugs: [
            {
                name: "Cetirizine 10mg / Loratadine 10mg (Zyrtec / Claritin)",
                type: "Second-Generation Antihistamine",
                adultDosage: "1 tablet (10mg) orally once daily.",
                childDosage: "2.5mg - 5mg syrup according to age and weight.",
                purpose: "Blocks histamine H1 receptors to soothe itching, urticarial wheals, and sneezing without heavy sedation.",
                safetyWarning: "Avoid alcohol consumption while taking antihistamines."
            },
            {
                name: "Hydrocortisone Cream 1%",
                type: "Mild Topical Corticosteroid",
                adultDosage: "Apply sparingly to localized itchy skin rash or insect bites 2 times daily for up to 5 days.",
                childDosage: "Apply small amount; avoid face and diaper areas unless directed.",
                purpose: "Calms inflammation, erythema, and localized allergic swelling.",
                safetyWarning: "Do not apply on open broken skin, fungal ringworm, or viral herpes lesions."
            },
            {
                name: "Calamine Lotion",
                type: "Topical Soothing Agent",
                adultDosage: "Shake bottle well and dab generously over itchy areas with a cotton pad.",
                childDosage: "Safe for all ages.",
                purpose: "Provides immediate cooling evaporation that relieves intense skin pruritics.",
                safetyWarning: "For external use only."
            },
            {
                name: "EpiPen (Epinephrine Auto-Injector 0.3mg)",
                type: "Anaphylaxis Emergency Treatment",
                adultDosage: "Inject firmly into outer middle thigh (anterolateral aspect) and hold for 3 seconds.",
                childDosage: "EpiPen Jr (0.15mg) for children 15kg - 30kg.",
                purpose: "Reverses life-threatening airway closure and circulatory shock in anaphylaxis.",
                safetyWarning: "After injecting, dial emergency hospital hotline immediately."
            }
        ],
        redFlags: [
            "Swelling of the lips, tongue, uvula, or difficulty swallowing.",
            "Hoarseness in voice, wheezing, or stridor sound when breathing.",
            "Dizziness, lightheadedness, cold clammy skin, or loss of consciousness."
        ]
    },
    {
        id: "complaint-sprain",
        category: "Orthopedics",
        title: "Sprains, Strains, Ankle Twists & Joint Swelling",
        keywords: ["sprain", "strain", "twist", "twisted ankle", "joint pain", "swollen ankle", "wrist pain", "knee pain", "sports injury", "ligament"],
        urgency: "Moderate",
        urgencyColor: "#f59e0b",
        recommendedDepartment: "Orthopedics & Sports Medicine",
        recommendedDoctorId: "DOC-105",
        overview: "Stretching or tearing of ligaments or muscle fibers following awkward landings, sports tackles, or sudden twists.",
        immediateActions: [
            "Follow the clinical P.R.I.C.E. protocol immediately:",
            "Protect: Support injured joint with a brace, splint, or crutches to prevent aggravating injury.",
            "Rest: Stop bearing weight or exercising on the injured limb.",
            "Ice: Apply ice packs wrapped in a dry towel for 15-20 minutes every 2-3 hours for the first 48 hours.",
            "Compress: Wrap snugly with an elastic crepe bandage from below the joint moving upwards (not too tight).",
            "Elevate: Prop the limb on pillows above heart level to drain excess inflammatory fluid."
        ],
        drugs: [
            {
                name: "Ibuprofen 400mg",
                type: "NSAID",
                adultDosage: "1 tablet (400mg) every 8 hours with food for 3 to 5 days.",
                childDosage: "Consult pediatrician.",
                purpose: "Reduces painful soft tissue inflammation and swelling around injured joint capsule.",
                safetyWarning: "Take with food. Do not combine with other oral NSAIDs."
            },
            {
                name: "Diclofenac Topical Gel 1% (Voltaren Emulgel)",
                type: "Topical NSAID Gel",
                adultDosage: "Gently massage 2g - 4g into the swollen joint 3 to 4 times daily.",
                childDosage: "Not recommended under 12.",
                purpose: "Delivers concentrated anti-inflammatory relief directly to tendons and ligaments without stomach upset.",
                safetyWarning: "Wash hands thoroughly after applying. Do not wrap with airtight plastic film."
            },
            {
                name: "Paracetamol 1000mg",
                type: "Analgesic",
                adultDosage: "2 x 500mg tablets every 6 hours as needed.",
                childDosage: "Syrup dose per weight.",
                purpose: "Safe baseline pain relief if patient cannot tolerate NSAIDs.",
                safetyWarning: "Keep within daily limit."
            }
        ],
        redFlags: [
            "Heard or felt a loud 'pop' or snap at the moment of injury.",
            "Complete inability to put any weight or take 4 steps on the injured foot/leg.",
            "Joint appears visibly deformed, angled abnormally, or bone is protruding.",
            "Loss of sensation, pins and needles, or cold pale toes/fingers."
        ]
    },
    {
        id: "complaint-cough-cold",
        category: "Respiratory",
        title: "Cough, Flu, Sore Throat & Nasal Congestion",
        keywords: ["cough", "cold", "flu", "sore throat", "throat pain", "runny nose", "catarrh", "sneezing", "congestion", "phlegm"],
        urgency: "Low",
        urgencyColor: "#10b981",
        recommendedDepartment: "Internal Medicine / OPD",
        recommendedDoctorId: "DOC-103",
        overview: "Upper respiratory tract infection caused by rhinoviruses, influenza, or environmental irritants.",
        immediateActions: [
            "Perform warm salt water gargles (1/2 teaspoon salt in 1 cup warm water) 3-4 times daily for throat inflammation.",
            "Use steam inhalation: inhale steam over a bowl of hot water or take a hot steamy shower.",
            "Drink hot herbal teas with honey and lemon (honey is clinically proven to soothe nocturnal cough in children > 1 yr).",
            "Maintain high fluid intake to thin mucosal secretions."
        ],
        drugs: [
            {
                name: "Dextromethorphan HBr 15mg – 30mg (Dry Cough)",
                type: "Cough Suppressant",
                adultDosage: "10ml syrup or 1 tablet every 6 to 8 hours as needed for dry hacking cough.",
                childDosage: "Age 6+: 5ml syrup.",
                purpose: "Acts on cough center in brainstem to quiet persistent dry, non-productive coughing.",
                safetyWarning: "Do not use if coughing up thick productive yellow/green mucus."
            },
            {
                name: "Guaifenesin 200mg – 400mg (Productive/Chest Cough)",
                type: "Expectorant",
                adultDosage: "10ml - 20ml syrup every 4 hours with a large glass of water.",
                childDosage: "Consult pediatrician.",
                purpose: "Thins and loosens bronchial phlegm, making it easier to cough up and clear lungs.",
                safetyWarning: "Must be accompanied by copious water intake for efficacy."
            },
            {
                name: "Normal Saline Nasal Spray 0.9%",
                type: "Nasal Decongestant / Moisturizer",
                adultDosage: "2 sprays in each nostril as often as needed.",
                childDosage: "1 - 2 drops in each nostril.",
                purpose: "Clears congested nasal passages safely without causing rebound congestion (medicamentosa).",
                safetyWarning: "Completely non-habit forming and safe for pregnant women and newborns."
            },
            {
                name: "Amylmetacresol & Dichlorobenzyl Alcohol Lozenges (Strepsils)",
                type: "Antiseptic Throat Lozenge",
                adultDosage: "Dissolve 1 lozenge slowly in mouth every 2 to 3 hours.",
                childDosage: "Children over 6 years.",
                purpose: "Lubricates pharynx and delivers mild local antiseptic action.",
                safetyWarning: "Choking hazard for children under 5."
            }
        ],
        redFlags: [
            "Coughing up rust-colored or bright red blood (Hemoptysis).",
            "Severe pain when swallowing saliva or unable to open mouth (Peritonsillar abscess / quinsy).",
            "Persistent cough lasting longer than 3 weeks (rule out Tuberculosis, Pertussis, or Asthma)."
        ]
    },
    {
        id: "complaint-toothache",
        category: "Dental",
        title: "Severe Toothache & Gum Inflammation",
        keywords: ["toothache", "tooth pain", "teeth", "gum", "cavity", "swollen jaw", "dental pain", "tooth", "molar"],
        urgency: "Moderate",
        urgencyColor: "#f59e0b",
        recommendedDepartment: "Internal Medicine / OPD",
        recommendedDoctorId: "DOC-103",
        overview: "Pulpitis, advanced dental caries, cracked enamel, or periodontal pocket abscess.",
        immediateActions: [
            "Rinse mouth thoroughly with warm salt water to dislodge food particles trapped in dental crevices.",
            "Apply a clean cold compress to the outside of your cheek for 15 minutes at a time to reduce swelling.",
            "NEVER place an aspirin tablet directly on the gum tissue or tooth; it causes severe acidic chemical burns on oral mucosa."
        ],
        drugs: [
            {
                name: "Ibuprofen 400mg – 600mg",
                type: "Anti-inflammatory Analgesic",
                adultDosage: "1 tablet (400mg) every 6 to 8 hours after meals.",
                childDosage: "Pediatric suspension per weight.",
                purpose: "Gold-standard OTC drug for dental inflammation and deep jaw throbbing.",
                safetyWarning: "Do not exceed recommended dose."
            },
            {
                name: "Clove Oil (Eugenol)",
                type: "Natural Topical Dental Anesthetic",
                adultDosage: "Dip the tip of a cotton swab in clove oil and dab gently on the painful tooth cavity for 2 minutes.",
                childDosage: "Dilute 1:1 with olive oil for older children.",
                purpose: "Eugenol numbs exposed dental nerve endings and provides natural antiseptic properties.",
                safetyWarning: "Avoid swallowing; do not spill excessively on tongue or gums."
            },
            {
                name: "Chlorhexidine Gluconate 0.2% Oral Rinse",
                type: "Antibacterial Mouthwash",
                adultDosage: "Swish 10ml in mouth for 1 minute twice daily after brushing.",
                childDosage: "Not recommended under 6.",
                purpose: "Suppresses bacterial colonies in periodontal pockets.",
                safetyWarning: "Do not swallow. Temporary tooth staining can occur with prolonged use."
            }
        ],
        redFlags: [
            "Swelling spreading noticeably into the neck, under the tongue, or causing breathing/swallowing issues (Ludwig's Angina - ER emergency!).",
            "High fever with facial cellulitis.",
            "Sudden loss of sensation in lower lip or jaw."
        ]
    },
    {
        id: "complaint-eye",
        category: "Ophthalmology",
        title: "Eye Irritation, Foreign Particle & Pink Eye",
        keywords: ["eye", "eye pain", "foreign particle", "pink eye", "conjunctivitis", "itchy eyes", "red eye", "dust in eye"],
        urgency: "High",
        urgencyColor: "#ea580c",
        recommendedDepartment: "Accident & Emergency (A&E)",
        recommendedDoctorId: "DOC-101",
        overview: "Irritation caused by dust, eyelash, chemical splash, or infectious conjunctivitis.",
        immediateActions: [
            "DO NOT RUB YOUR EYE! Rubbing can cause corneal abrasions and permanent scarring from trapped particles.",
            "Flush the eye immediately with plenty of sterile saline solution or clean running tap water for 15 minutes.",
            "Remove contact lenses immediately and do not wear them until fully cleared by an ophthalmologist.",
            "Blink rapidly into an eyecup filled with clean water to encourage particle displacement."
        ],
        drugs: [
            {
                name: "Carboxymethylcellulose 0.5% (Artificial Tears)",
                type: "Ophthalmic Lubricant",
                adultDosage: "Instill 1 to 2 drops in the affected eye 3 to 4 times daily.",
                childDosage: "1 drop in affected eye.",
                purpose: "Flushes micro-debris, lubricates scratched cornea, and eases stinging.",
                safetyWarning: "Ensure dropper tip never touches eyeball or fingers to prevent contamination."
            },
            {
                name: "Chloramphenicol 0.5% Eye Drops (Clinical Prescription)",
                type: "Ophthalmic Antibiotic",
                adultDosage: "1 drop every 2 hours for first 48 hours, then 4 times daily (under doctor prescription).",
                childDosage: "As prescribed by doctor.",
                purpose: "Fights bacterial conjunctivitis with yellow/green pus discharge.",
                safetyWarning: "Requires clinical doctor review before starting."
            }
        ],
        redFlags: [
            "Chemical splash (bleach, battery acid, lye) - flush continuously and rush to ER immediately!",
            "Any change or deterioration in vision (blurriness, haloes, double vision).",
            "Severe deep eye ache, headache with vomiting, or cloudiness of cornea (Acute Glaucoma)."
        ]
    }
];

// Department List for Easy Filtering
const HOSPITAL_DEPARTMENTS = [
    "All Departments",
    "Accident & Emergency (A&E)",
    "Cardiovascular Sciences",
    "Internal Medicine / OPD",
    "Pediatrics Ward",
    "Orthopedics & Sports Medicine",
    "Maternal & Child Health",
    "Neurology Department",
    "Intensive Care Unit (ICU)"
];
