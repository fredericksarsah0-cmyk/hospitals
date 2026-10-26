// PUIT24210078 HOSPITAL MANAGEMENT SYSTEM - Main Application Controller
// Handles state management, UI rendering, routing, CRUD operations and storage

class HospitalApp {
    constructor() {
        this.symptomAdvisor = new SymptomAdvisor();
        this.loadStorage();
        this.currentTab = 'dashboard';
        this.editingPatientId = null;
        this.editingDoctorId = null;
        this.init();
    }

    /* =========================================================================
       1. DATA PERSISTENCE & STORAGE
       ========================================================================= */
    loadStorage() {
        try {
            const storedPatients = localStorage.getItem('puit_hms_patients');
            this.patients = storedPatients ? JSON.parse(storedPatients) : [...INITIAL_PATIENTS];

            const storedDoctors = localStorage.getItem('puit_hms_doctors');
            this.doctors = storedDoctors ? JSON.parse(storedDoctors) : [...INITIAL_DOCTORS];

            const storedAppointments = localStorage.getItem('puit_hms_appointments');
            this.appointments = storedAppointments ? JSON.parse(storedAppointments) : [...INITIAL_APPOINTMENTS];

            const storedActivities = localStorage.getItem('puit_hms_activities');
            this.activities = storedActivities ? JSON.parse(storedActivities) : [
                { text: "System initialized with PUIT24210078 clinical database", time: "Just now", type: "system" },
                { text: "Dr. Samuel Adebayo logged in for Morning Shift in Emergency", time: "10 mins ago", type: "doctor" },
                { text: "Patient Emmanuel Chukwuma assigned to Dr. Elena Rostova", time: "25 mins ago", type: "patient" },
                { text: "Appointment APT-501 confirmed for Internal Medicine review", time: "1 hour ago", type: "appointment" }
            ];
        } catch (e) {
            console.error("Storage loading error, using defaults", e);
            this.patients = [...INITIAL_PATIENTS];
            this.doctors = [...INITIAL_DOCTORS];
            this.appointments = [...INITIAL_APPOINTMENTS];
            this.activities = [];
        }
    }

    savePatients() {
        localStorage.setItem('puit_hms_patients', JSON.stringify(this.patients));
        this.updateStats();
    }

    saveDoctors() {
        localStorage.setItem('puit_hms_doctors', JSON.stringify(this.doctors));
        this.updateStats();
    }

    saveAppointments() {
        localStorage.setItem('puit_hms_appointments', JSON.stringify(this.appointments));
        this.updateStats();
    }

    saveActivities() {
        if (this.activities.length > 25) this.activities = this.activities.slice(0, 25);
        localStorage.setItem('puit_hms_activities', JSON.stringify(this.activities));
    }

    logActivity(text, type = "system") {
        this.activities.unshift({
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type
        });
        this.saveActivities();
        if (this.currentTab === 'dashboard') {
            this.renderActivityFeed();
        }
    }

    resetAllData() {
        if (confirm("Are you sure you want to reset all records back to default sample data? Any newly added records will be overwritten.")) {
            localStorage.removeItem('puit_hms_patients');
            localStorage.removeItem('puit_hms_doctors');
            localStorage.removeItem('puit_hms_appointments');
            localStorage.removeItem('puit_hms_activities');
            this.loadStorage();
            this.init();
            this.showToast("All PUIT24210078 hospital records reset to default demo data.", "success");
        }
    }

    /* =========================================================================
       2. INITIALIZATION & NAVIGATION
       ========================================================================= */
    init() {
        this.bindEvents();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.switchTab('dashboard');
        this.updateStats();
    }

    bindEvents() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = link.getAttribute('data-tab');
                if (targetTab) {
                    this.switchTab(targetTab);
                }
            });
        });

        // Mobile drawer toggle
        const toggleBtn = document.getElementById('mobileMenuToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('active');
            });
        }

        // Quick action buttons on dashboard
        document.querySelectorAll('[data-action-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = btn.getAttribute('data-action-tab');
                this.switchTab(tab);
            });
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
            el.addEventListener('click', (e) => {
                const modal = el.closest('.modal');
                if (modal && (e.target === el || el.classList.contains('modal-close'))) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Patient search and filter
        const patientSearch = document.getElementById('patientSearchInput');
        const patientStatusFilter = document.getElementById('patientStatusFilter');
        if (patientSearch) {
            patientSearch.addEventListener('input', () => this.renderPatientsTable());
        }
        if (patientStatusFilter) {
            patientStatusFilter.addEventListener('change', () => this.renderPatientsTable());
        }

        // Doctor search and filter
        const doctorSearch = document.getElementById('doctorSearchInput');
        const doctorDeptFilter = document.getElementById('doctorDeptFilter');
        if (doctorSearch) {
            doctorSearch.addEventListener('input', () => this.renderDoctorsCards());
        }
        if (doctorDeptFilter) {
            doctorDeptFilter.addEventListener('change', () => this.renderDoctorsCards());
        }

        // On-Duty Shift filter
        const dutyShiftFilter = document.getElementById('dutyShiftFilter');
        const dutyDeptFilter = document.getElementById('dutyDeptFilter');
        if (dutyShiftFilter) {
            dutyShiftFilter.addEventListener('change', () => this.renderDutyRoster());
        }
        if (dutyDeptFilter) {
            dutyDeptFilter.addEventListener('change', () => this.renderDutyRoster());
        }

        // Appointments filter & search
        const apptSearch = document.getElementById('apptSearchInput');
        const apptStatusFilter = document.getElementById('apptStatusFilter');
        if (apptSearch) {
            apptSearch.addEventListener('input', () => this.renderAppointmentsTable());
        }
        if (apptStatusFilter) {
            apptStatusFilter.addEventListener('change', () => this.renderAppointmentsTable());
        }

        // First Aid & Symptom Checker
        const symptomInput = document.getElementById('symptomInput');
        const symptomSubmit = document.getElementById('symptomSubmit');
        if (symptomSubmit && symptomInput) {
            symptomSubmit.addEventListener('click', () => {
                this.handleSymptomSearch(symptomInput.value);
            });
            symptomInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSymptomSearch(symptomInput.value);
                }
            });
        }

        // Populate doctor selection dropdowns
        this.populateDoctorSelectDropdowns();
    }

    updateClock() {
        const timeEl = document.getElementById('liveClockTime');
        const dateEl = document.getElementById('liveClockDate');
        if (timeEl && dateEl) {
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        }
    }

    switchTab(tabId) {
        this.currentTab = tabId;

        // Update Nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-tab') === tabId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Hide all views, show targeted view
        document.querySelectorAll('.tab-view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`view-${tabId}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Close mobile sidebar if open
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }

        // Update Breadcrumb
        const breadcrumbEl = document.getElementById('currentSectionTitle');
        if (breadcrumbEl) {
            const titles = {
                'dashboard': 'Hospital Dashboard & Live Status',
                'patients': 'Patients Records & Medical Directory',
                'doctors': 'Doctors Directory & Clinical Specialists',
                'duty': 'Doctors On-Duty Roster & Active Shifts',
                'appointments': 'Doctors Appointments & Scheduling',
                'firstaid': 'First Aid & Drug Advisor (Symptom Triage)'
            };
            breadcrumbEl.textContent = titles[tabId] || 'Hospital Management';
        }

        // Render contents specific to active tab
        if (tabId === 'dashboard') {
            this.updateStats();
            this.renderActivityFeed();
            this.renderDashboardDutySummary();
            this.renderDashboardAppointmentsSummary();
        } else if (tabId === 'patients') {
            this.renderPatientsTable();
        } else if (tabId === 'doctors') {
            this.renderDoctorsCards();
        } else if (tabId === 'duty') {
            this.renderDutyRoster();
        } else if (tabId === 'appointments') {
            this.renderAppointmentsTable();
        } else if (tabId === 'firstaid') {
            this.renderFirstAidChips();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateStats() {
        const totalPatientsEl = document.getElementById('statTotalPatients');
        const inpatientsEl = document.getElementById('statInpatients');
        const totalDoctorsEl = document.getElementById('statTotalDoctors');
        const onDutyDoctorsEl = document.getElementById('statOnDutyDoctors');
        const appointmentsCountEl = document.getElementById('statAppointmentsCount');

        if (totalPatientsEl) totalPatientsEl.textContent = this.patients.length;
        if (inpatientsEl) {
            const inpatients = this.patients.filter(p => p.admissionStatus === 'Inpatient' || p.admissionStatus === 'Emergency');
            inpatientsEl.textContent = inpatients.length;
        }
        if (totalDoctorsEl) totalDoctorsEl.textContent = this.doctors.length;
        if (onDutyDoctorsEl) {
            const onDuty = this.doctors.filter(d => d.status === 'On Duty');
            onDutyDoctorsEl.textContent = onDuty.length;
        }
        if (appointmentsCountEl) {
            const activeAppts = this.appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
            appointmentsCountEl.textContent = activeAppts.length;
        }
    }

    /* =========================================================================
       3. DASHBOARD MODULE RENDERING
       ========================================================================= */
    renderActivityFeed() {
        const feedEl = document.getElementById('dashboardActivityFeed');
        if (!feedEl) return;

        if (this.activities.length === 0) {
            feedEl.innerHTML = `<div class="empty-state-p">No recent activity logged yet.</div>`;
            return;
        }

        feedEl.innerHTML = this.activities.slice(0, 6).map(act => `
            <div class="activity-item">
                <div class="activity-badge badge-${act.type || 'system'}"></div>
                <div class="activity-content">
                    <p class="activity-text">${this.escapeHTML(act.text)}</p>
                    <span class="activity-time">${act.time}</span>
                </div>
            </div>
        `).join('');
    }

    renderDashboardDutySummary() {
        const container = document.getElementById('dashboardDutyList');
        if (!container) return;

        const onDutyDocs = this.doctors.filter(d => d.status === 'On Duty');
        if (onDutyDocs.length === 0) {
            container.innerHTML = `<div class="p-3 text-muted">No doctors currently recorded on duty.</div>`;
            return;
        }

        container.innerHTML = onDutyDocs.slice(0, 4).map(doc => `
            <div class="duty-pill-item">
                <div class="duty-avatar" style="background-color: ${doc.avatarColor || '#0284c7'}">
                    ${this.getInitials(doc.name)}
                </div>
                <div class="duty-info">
                    <strong>${this.escapeHTML(doc.name)}</strong>
                    <span class="duty-spec">${this.escapeHTML(doc.specialization)}</span>
                    <span class="duty-shift-tag"><i class="shift-icon">⏱</i> ${this.escapeHTML(doc.shift)}</span>
                </div>
                <span class="badge-status-on-duty">● ON DUTY</span>
            </div>
        `).join('');
    }

    renderDashboardAppointmentsSummary() {
        const container = document.getElementById('dashboardAppointmentsList');
        if (!container) return;

        const activeAppts = this.appointments.slice(0, 4);
        if (activeAppts.length === 0) {
            container.innerHTML = `<div class="p-3 text-muted">No upcoming appointments scheduled.</div>`;
            return;
        }

        container.innerHTML = activeAppts.map(apt => `
            <div class="mini-appointment-card">
                <div class="apt-header">
                    <strong>${this.escapeHTML(apt.patientName)}</strong>
                    <span class="status-chip status-${apt.status.toLowerCase()}">${apt.status}</span>
                </div>
                <div class="apt-body">
                    <div>🩺 <span>${this.escapeHTML(apt.doctorName)}</span></div>
                    <div>📅 <span>${apt.date} at ${apt.time}</span></div>
                </div>
            </div>
        `).join('');
    }

    /* =========================================================================
       4. PATIENTS RECORDS MODULE
       ========================================================================= */
    renderPatientsTable() {
        const tbody = document.getElementById('patientsTableBody');
        if (!tbody) return;

        const searchVal = (document.getElementById('patientSearchInput')?.value || '').toLowerCase();
        const statusFilter = document.getElementById('patientStatusFilter')?.value || 'ALL';

        let filtered = this.patients.filter(p => {
            const matchesSearch = 
                p.name.toLowerCase().includes(searchVal) ||
                p.id.toLowerCase().includes(searchVal) ||
                p.condition.toLowerCase().includes(searchVal) ||
                p.phone.toLowerCase().includes(searchVal);
            
            const matchesStatus = (statusFilter === 'ALL') || (p.admissionStatus === statusFilter);
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4 text-muted">
                        No patient records found matching the search criteria.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map(patient => `
            <tr>
                <td><strong class="text-primary">${patient.id}</strong></td>
                <td>
                    <div class="patient-name-cell">
                        <strong>${this.escapeHTML(patient.name)}</strong>
                        <span class="sub-text">${patient.age} yrs • ${patient.gender} • Blood ${patient.bloodGroup}</span>
                    </div>
                </td>
                <td>
                    <span class="badge-status-patient status-pat-${patient.admissionStatus.toLowerCase()}">
                        ${patient.admissionStatus}
                    </span>
                </td>
                <td>
                    <div class="patient-condition-cell" title="${this.escapeHTML(patient.condition)}">
                        ${this.escapeHTML(patient.condition)}
                    </div>
                </td>
                <td>
                    <span class="assigned-doc">${this.escapeHTML(patient.assignedDoctorName || 'Unassigned')}</span>
                </td>
                <td>
                    <span class="room-pill">${this.escapeHTML(patient.room || 'OPD')}</span>
                </td>
                <td>${patient.admissionDate || 'N/A'}</td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn-sm btn-outline-info" title="View Full Chart" onclick="app.viewPatientChart('${patient.id}')">
                            👁 View
                        </button>
                        <button class="btn-sm btn-outline-secondary" title="Edit Record" onclick="app.editPatient('${patient.id}')">
                            ✏ Edit
                        </button>
                        <button class="btn-sm btn-outline-danger" title="Delete Record" onclick="app.deletePatient('${patient.id}')">
                            🗑
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    openAddPatientModal() {
        this.editingPatientId = null;
        document.getElementById('patientModalTitle').textContent = "Register New Patient - PUIT24210078";
        document.getElementById('patientForm').reset();
        
        // Auto generate next patient ID
        const nextNum = 1000 + this.patients.length + 1;
        document.getElementById('patientFormId').value = `PAT-${nextNum}`;
        document.getElementById('patientFormAdmissionDate').value = new Date().toISOString().split('T')[0];

        this.openModal('modalPatient');
    }

    editPatient(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (!patient) return;

        this.editingPatientId = patientId;
        document.getElementById('patientModalTitle').textContent = `Edit Patient Record: ${patient.id}`;

        document.getElementById('patientFormId').value = patient.id;
        document.getElementById('patientFormName').value = patient.name;
        document.getElementById('patientFormAge').value = patient.age;
        document.getElementById('patientFormGender').value = patient.gender;
        document.getElementById('patientFormBloodGroup').value = patient.bloodGroup;
        document.getElementById('patientFormPhone').value = patient.phone;
        document.getElementById('patientFormAddress').value = patient.address || '';
        document.getElementById('patientFormEmergencyContact').value = patient.emergencyContact || '';
        document.getElementById('patientFormStatus').value = patient.admissionStatus;
        document.getElementById('patientFormCondition').value = patient.condition;
        document.getElementById('patientFormDoctor').value = patient.assignedDoctorId || '';
        document.getElementById('patientFormRoom').value = patient.room || '';
        document.getElementById('patientFormAdmissionDate').value = patient.admissionDate || '';
        document.getElementById('patientFormAllergies').value = patient.allergies || 'None';
        document.getElementById('patientFormNotes').value = patient.notes || '';

        this.openModal('modalPatient');
    }

    savePatientForm(e) {
        e.preventDefault();

        const id = document.getElementById('patientFormId').value.trim();
        const name = document.getElementById('patientFormName').value.trim();
        const age = parseInt(document.getElementById('patientFormAge').value) || 0;
        const gender = document.getElementById('patientFormGender').value;
        const bloodGroup = document.getElementById('patientFormBloodGroup').value;
        const phone = document.getElementById('patientFormPhone').value.trim();
        const address = document.getElementById('patientFormAddress').value.trim();
        const emergencyContact = document.getElementById('patientFormEmergencyContact').value.trim();
        const admissionStatus = document.getElementById('patientFormStatus').value;
        const condition = document.getElementById('patientFormCondition').value.trim();
        const doctorId = document.getElementById('patientFormDoctor').value;
        const room = document.getElementById('patientFormRoom').value.trim();
        const admissionDate = document.getElementById('patientFormAdmissionDate').value;
        const allergies = document.getElementById('patientFormAllergies').value.trim();
        const notes = document.getElementById('patientFormNotes').value.trim();

        if (!name || !condition) {
            this.showToast("Please provide patient name and clinical condition.", "error");
            return;
        }

        const selectedDoc = this.doctors.find(d => d.id === doctorId);
        const doctorName = selectedDoc ? selectedDoc.name : 'Unassigned';

        if (this.editingPatientId) {
            // Update existing
            const index = this.patients.findIndex(p => p.id === this.editingPatientId);
            if (index !== -1) {
                this.patients[index] = {
                    ...this.patients[index],
                    name,
                    age,
                    gender,
                    bloodGroup,
                    phone,
                    address,
                    emergencyContact,
                    admissionStatus,
                    condition,
                    assignedDoctorId: doctorId,
                    assignedDoctorName: doctorName,
                    department: selectedDoc ? selectedDoc.department : '',
                    room,
                    admissionDate,
                    allergies,
                    notes
                };
                this.logActivity(`Updated record for patient ${name} (${id})`, "patient");
                this.showToast(`Patient record ${id} updated successfully.`, "success");
            }
        } else {
            // Add new
            const newPatient = {
                id,
                name,
                age,
                gender,
                bloodGroup,
                phone,
                address,
                emergencyContact,
                admissionStatus,
                condition,
                assignedDoctorId: doctorId,
                assignedDoctorName: doctorName,
                department: selectedDoc ? selectedDoc.department : '',
                room: room || 'General OPD',
                admissionDate: admissionDate || new Date().toISOString().split('T')[0],
                allergies: allergies || 'None',
                notes
            };
            this.patients.unshift(newPatient);
            this.logActivity(`Registered new patient ${name} (${id})`, "patient");
            this.showToast(`Patient ${name} registered successfully.`, "success");
        }

        this.savePatients();
        this.renderPatientsTable();
        this.closeModal('modalPatient');
    }

    viewPatientChart(patientId) {
        const p = this.patients.find(item => item.id === patientId);
        if (!p) return;

        const content = document.getElementById('patientChartContent');
        if (!content) return;

        content.innerHTML = `
            <div class="patient-chart-header">
                <div class="chart-avatar-box">
                    <div class="chart-avatar">${this.getInitials(p.name)}</div>
                    <div>
                        <h3>${this.escapeHTML(p.name)}</h3>
                        <p class="chart-sub">ID: <strong>${p.id}</strong> • Admitted: ${p.admissionDate || 'N/A'}</p>
                    </div>
                </div>
                <div class="chart-status-pill">
                    <span class="badge-status-patient status-pat-${p.admissionStatus.toLowerCase()}">${p.admissionStatus}</span>
                </div>
            </div>

            <div class="patient-chart-grid">
                <div class="chart-card">
                    <h4>Demographics & Vitals</h4>
                    <ul class="chart-list">
                        <li><strong>Age:</strong> ${p.age} years</li>
                        <li><strong>Gender:</strong> ${p.gender}</li>
                        <li><strong>Blood Group:</strong> <span class="blood-group-tag">${p.bloodGroup}</span></li>
                        <li><strong>Phone:</strong> ${this.escapeHTML(p.phone)}</li>
                        <li><strong>Address:</strong> ${this.escapeHTML(p.address || 'N/A')}</li>
                        <li><strong>Emergency Contact:</strong> ${this.escapeHTML(p.emergencyContact || 'N/A')}</li>
                    </ul>
                </div>

                <div class="chart-card">
                    <h4>Clinical Assignment</h4>
                    <ul class="chart-list">
                        <li><strong>Primary Diagnosis / Complaint:</strong> <span class="text-danger font-weight-bold">${this.escapeHTML(p.condition)}</span></li>
                        <li><strong>Attending Doctor:</strong> ${this.escapeHTML(p.assignedDoctorName || 'None assigned')}</li>
                        <li><strong>Department:</strong> ${this.escapeHTML(p.department || 'General Medicine')}</li>
                        <li><strong>Ward / Bed Location:</strong> ${this.escapeHTML(p.room || 'OPD')}</li>
                        <li><strong>Known Allergies:</strong> <span class="allergy-tag">${this.escapeHTML(p.allergies || 'None reported')}</span></li>
                    </ul>
                </div>
            </div>

            <div class="chart-card mt-3">
                <h4>Doctor's Clinical Notes & Treatment Progress</h4>
                <div class="chart-notes-box">
                    ${p.notes ? this.escapeHTML(p.notes) : '<em>No additional clinical progress notes recorded yet.</em>'}
                </div>
            </div>

            <div class="chart-actions">
                <button class="btn btn-secondary" onclick="window.print()">🖨 Print Patient Chart</button>
                <button class="btn btn-primary" onclick="app.closeModal('modalPatientChart'); app.editPatient('${p.id}')">✏ Edit Record</button>
            </div>
        `;

        this.openModal('modalPatientChart');
    }

    deletePatient(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (!patient) return;

        if (confirm(`Are you sure you want to delete patient record for ${patient.name} (${patient.id})? This action cannot be undone.`)) {
            this.patients = this.patients.filter(p => p.id !== patientId);
            this.savePatients();
            this.logActivity(`Deleted patient record ${patient.name} (${patientId})`, "patient");
            this.showToast(`Patient record ${patientId} removed.`, "info");
            this.renderPatientsTable();
        }
    }

    /* =========================================================================
       5. DOCTORS DIRECTORY MODULE
       ========================================================================= */
    renderDoctorsCards() {
        const container = document.getElementById('doctorsGrid');
        if (!container) return;

        const searchVal = (document.getElementById('doctorSearchInput')?.value || '').toLowerCase();
        const deptVal = document.getElementById('doctorDeptFilter')?.value || 'ALL';

        let filtered = this.doctors.filter(d => {
            const matchesSearch = 
                d.name.toLowerCase().includes(searchVal) ||
                d.specialization.toLowerCase().includes(searchVal) ||
                d.department.toLowerCase().includes(searchVal) ||
                d.id.toLowerCase().includes(searchVal);

            const matchesDept = (deptVal === 'ALL') || (d.department === deptVal);
            return matchesSearch && matchesDept;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5 text-muted">
                    No doctors found matching the search criteria.
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(doc => {
            const isOnDuty = doc.status === 'On Duty';
            return `
                <div class="doctor-card ${isOnDuty ? 'card-on-duty' : ''}">
                    <div class="doc-card-top">
                        <div class="doc-avatar" style="background-color: ${doc.avatarColor || '#0284c7'}">
                            ${this.getInitials(doc.name)}
                        </div>
                        <div class="doc-header-info">
                            <h4 class="doc-name">${this.escapeHTML(doc.name)}</h4>
                            <p class="doc-spec">${this.escapeHTML(doc.specialization)}</p>
                            <span class="doc-dept-badge">${this.escapeHTML(doc.department)}</span>
                        </div>
                    </div>

                    <div class="doc-details-list">
                        <div class="doc-detail-row">
                            <span class="label">🎓 Qualification:</span>
                            <span class="value">${this.escapeHTML(doc.qualification || 'MBBS')}</span>
                        </div>
                        <div class="doc-detail-row">
                            <span class="label">⏳ Experience:</span>
                            <span class="value">${this.escapeHTML(doc.experience || '10+ yrs')}</span>
                        </div>
                        <div class="doc-detail-row">
                            <span class="label">🏢 Clinic Office:</span>
                            <span class="value">${this.escapeHTML(doc.room || 'OPD')}</span>
                        </div>
                        <div class="doc-detail-row">
                            <span class="label">⏱ Assigned Shift:</span>
                            <span class="value font-weight-bold">${this.escapeHTML(doc.shift || 'Flexible')}</span>
                        </div>
                        <div class="doc-detail-row">
                            <span class="label">📞 Contact:</span>
                            <span class="value">${this.escapeHTML(doc.phone)}</span>
                        </div>
                    </div>

                    <div class="doc-duty-control">
                        <div class="duty-status-indicator">
                            <span class="status-dot ${isOnDuty ? 'dot-active' : 'dot-inactive'}"></span>
                            <span class="duty-status-text ${isOnDuty ? 'text-success' : 'text-muted'}">${doc.status}</span>
                        </div>
                        <button class="btn-sm ${isOnDuty ? 'btn-outline-warning' : 'btn-outline-success'}" 
                                onclick="app.toggleDoctorDuty('${doc.id}')">
                            ${isOnDuty ? 'Set Off Duty' : 'Set On Duty'}
                        </button>
                    </div>

                    <div class="doc-footer-actions">
                        <button class="btn-sm btn-primary flex-1" onclick="app.scheduleAppointmentWithDoctor('${doc.id}')">
                            📅 Book Appointment
                        </button>
                        <button class="btn-sm btn-outline-secondary" onclick="app.editDoctor('${doc.id}')" title="Edit Doctor">
                            ✏
                        </button>
                        <button class="btn-sm btn-outline-danger" onclick="app.deleteDoctor('${doc.id}')" title="Delete Doctor">
                            🗑
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    openAddDoctorModal() {
        this.editingDoctorId = null;
        document.getElementById('doctorModalTitle').textContent = "Register New Doctor - PUIT24210078";
        document.getElementById('doctorForm').reset();

        const nextNum = 100 + this.doctors.length + 1;
        document.getElementById('doctorFormId').value = `DOC-${nextNum}`;

        this.openModal('modalDoctor');
    }

    editDoctor(doctorId) {
        const doc = this.doctors.find(d => d.id === doctorId);
        if (!doc) return;

        this.editingDoctorId = doctorId;
        document.getElementById('doctorModalTitle').textContent = `Edit Doctor Profile: ${doc.name}`;

        document.getElementById('doctorFormId').value = doc.id;
        document.getElementById('doctorFormName').value = doc.name;
        document.getElementById('doctorFormSpecialization').value = doc.specialization;
        document.getElementById('doctorFormQualification').value = doc.qualification || '';
        document.getElementById('doctorFormDepartment').value = doc.department;
        document.getElementById('doctorFormPhone').value = doc.phone;
        document.getElementById('doctorFormEmail').value = doc.email || '';
        document.getElementById('doctorFormExperience').value = doc.experience || '';
        document.getElementById('doctorFormRoom').value = doc.room || '';
        document.getElementById('doctorFormShift').value = doc.shift;
        document.getElementById('doctorFormStatus').value = doc.status;

        this.openModal('modalDoctor');
    }

    saveDoctorForm(e) {
        e.preventDefault();

        const id = document.getElementById('doctorFormId').value.trim();
        const name = document.getElementById('doctorFormName').value.trim();
        const specialization = document.getElementById('doctorFormSpecialization').value.trim();
        const qualification = document.getElementById('doctorFormQualification').value.trim();
        const department = document.getElementById('doctorFormDepartment').value;
        const phone = document.getElementById('doctorFormPhone').value.trim();
        const email = document.getElementById('doctorFormEmail').value.trim();
        const experience = document.getElementById('doctorFormExperience').value.trim();
        const room = document.getElementById('doctorFormRoom').value.trim();
        const shift = document.getElementById('doctorFormShift').value;
        const status = document.getElementById('doctorFormStatus').value;

        if (!name || !specialization) {
            this.showToast("Please provide Doctor Name and Specialization.", "error");
            return;
        }

        const colors = ["#0284c7", "#059669", "#7c3aed", "#ea580c", "#e11d48", "#0d9488", "#4f46e5"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        let shiftType = 'morning';
        if (shift.toLowerCase().includes('evening')) shiftType = 'evening';
        else if (shift.toLowerCase().includes('night')) shiftType = 'night';

        if (this.editingDoctorId) {
            const index = this.doctors.findIndex(d => d.id === this.editingDoctorId);
            if (index !== -1) {
                this.doctors[index] = {
                    ...this.doctors[index],
                    name,
                    specialization,
                    qualification,
                    department,
                    phone,
                    email,
                    experience,
                    room,
                    shift,
                    shiftType,
                    status
                };
                this.logActivity(`Updated doctor record for ${name} (${id})`, "doctor");
                this.showToast(`Doctor ${name} profile updated.`, "success");
            }
        } else {
            const newDoc = {
                id,
                name,
                specialization,
                qualification,
                department,
                phone,
                email,
                experience,
                room,
                shift,
                shiftType,
                status,
                dutyDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                avatarColor: randomColor
            };
            this.doctors.push(newDoc);
            this.logActivity(`Added new clinical doctor ${name} (${specialization})`, "doctor");
            this.showToast(`Doctor ${name} registered successfully.`, "success");
        }

        this.saveDoctors();
        this.populateDoctorSelectDropdowns();
        this.renderDoctorsCards();
        this.renderDutyRoster();
        this.closeModal('modalDoctor');
    }

    toggleDoctorDuty(doctorId) {
        const doc = this.doctors.find(d => d.id === doctorId);
        if (!doc) return;

        doc.status = (doc.status === 'On Duty') ? 'Off Duty' : 'On Duty';
        this.saveDoctors();
        this.logActivity(`Doctor ${doc.name} status switched to ${doc.status}`, "doctor");
        this.showToast(`${doc.name} is now ${doc.status}.`, "info");
        this.renderDoctorsCards();
        this.renderDutyRoster();
        this.updateStats();
    }

    deleteDoctor(doctorId) {
        const doc = this.doctors.find(d => d.id === doctorId);
        if (!doc) return;

        if (confirm(`Remove ${doc.name} (${doc.specialization}) from the hospital records?`)) {
            this.doctors = this.doctors.filter(d => d.id !== doctorId);
            this.saveDoctors();
            this.populateDoctorSelectDropdowns();
            this.logActivity(`Removed doctor ${doc.name}`, "doctor");
            this.showToast(`Doctor ${doc.name} record removed.`, "info");
            this.renderDoctorsCards();
            this.renderDutyRoster();
            this.updateStats();
        }
    }

    /* =========================================================================
       6. DOCTORS ON-DUTY ROSTER MODULE
       ========================================================================= */
    renderDutyRoster() {
        const grid = document.getElementById('dutyRosterGrid');
        if (!grid) return;

        const shiftVal = document.getElementById('dutyShiftFilter')?.value || 'ALL';
        const deptVal = document.getElementById('dutyDeptFilter')?.value || 'ALL';

        let filtered = this.doctors.filter(doc => {
            const matchesShift = (shiftVal === 'ALL') || 
                (shiftVal === 'ONDUTY' && doc.status === 'On Duty') ||
                (doc.shiftType === shiftVal);

            const matchesDept = (deptVal === 'ALL') || (doc.department === deptVal);
            return matchesShift && matchesDept;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5 text-muted">
                    No doctors found for selected duty schedule or department.
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(doc => {
            const isOnDuty = doc.status === 'On Duty';
            return `
                <div class="duty-roster-card ${isOnDuty ? 'duty-active-border' : 'duty-inactive-border'}">
                    <div class="roster-header">
                        <div class="roster-avatar" style="background-color: ${doc.avatarColor || '#0284c7'}">
                            ${this.getInitials(doc.name)}
                        </div>
                        <div class="roster-title">
                            <h4>${this.escapeHTML(doc.name)}</h4>
                            <span class="roster-spec">${this.escapeHTML(doc.specialization)}</span>
                        </div>
                        <span class="roster-status-badge ${isOnDuty ? 'badge-on' : 'badge-off'}">
                            ${isOnDuty ? '● ON DUTY' : '○ OFF DUTY'}
                        </span>
                    </div>

                    <div class="roster-body">
                        <div class="roster-item">
                            <span class="roster-label">🏥 Department:</span>
                            <span class="roster-val">${this.escapeHTML(doc.department)}</span>
                        </div>
                        <div class="roster-item">
                            <span class="roster-label">⏰ Duty Shift:</span>
                            <span class="roster-val font-weight-bold text-primary">${this.escapeHTML(doc.shift)}</span>
                        </div>
                        <div class="roster-item">
                            <span class="roster-label">📍 Station / Office:</span>
                            <span class="roster-val">${this.escapeHTML(doc.room || 'General OPD')}</span>
                        </div>
                        <div class="roster-item">
                            <span class="roster-label">📞 Emergency Line:</span>
                            <span class="roster-val"><a href="tel:${doc.phone}">${this.escapeHTML(doc.phone)}</a></span>
                        </div>
                        <div class="roster-days">
                            <span class="roster-label">Scheduled Days:</span>
                            <div class="days-pill-group">
                                ${(doc.dutyDays || ["Mon", "Tue", "Wed", "Thu", "Fri"]).map(day => `
                                    <span class="day-chip">${day.substring(0, 3)}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="roster-actions">
                        <button class="btn btn-sm ${isOnDuty ? 'btn-outline-warning' : 'btn-success'}" 
                                onclick="app.toggleDoctorDuty('${doc.id}')">
                            ${isOnDuty ? 'Switch to Off Duty' : 'Mark On Duty'}
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="app.scheduleAppointmentWithDoctor('${doc.id}')">
                            📅 Instant Book
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* =========================================================================
       7. DOCTORS APPOINTMENTS MODULE
       ========================================================================= */
    renderAppointmentsTable() {
        const tbody = document.getElementById('appointmentsTableBody');
        if (!tbody) return;

        const searchVal = (document.getElementById('apptSearchInput')?.value || '').toLowerCase();
        const statusVal = document.getElementById('apptStatusFilter')?.value || 'ALL';

        let filtered = this.appointments.filter(a => {
            const matchesSearch = 
                a.patientName.toLowerCase().includes(searchVal) ||
                a.doctorName.toLowerCase().includes(searchVal) ||
                a.department.toLowerCase().includes(searchVal) ||
                a.id.toLowerCase().includes(searchVal);

            const matchesStatus = (statusVal === 'ALL') || (a.status === statusVal);
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-muted">
                        No appointments found matching current filter.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map(apt => `
            <tr>
                <td><strong>${apt.id}</strong></td>
                <td>
                    <div class="appt-patient-cell">
                        <strong>${this.escapeHTML(apt.patientName)}</strong>
                        <span class="sub-text">${this.escapeHTML(apt.patientPhone || '')}</span>
                    </div>
                </td>
                <td>
                    <div class="appt-doctor-cell">
                        <strong>${this.escapeHTML(apt.doctorName)}</strong>
                        <span class="sub-text">${this.escapeHTML(apt.department)}</span>
                    </div>
                </td>
                <td>
                    <div class="appt-datetime-cell">
                        <span class="date-part">📅 ${apt.date}</span>
                        <span class="time-part">⏰ ${apt.time}</span>
                    </div>
                </td>
                <td>
                    <span class="priority-pill priority-${(apt.priority || 'Routine').toLowerCase()}">
                        ${apt.priority || 'Routine'}
                    </span>
                </td>
                <td>
                    <span class="status-chip status-${apt.status.toLowerCase()}">
                        ${apt.status}
                    </span>
                </td>
                <td>
                    <div class="action-btn-group">
                        ${apt.status === 'Pending' ? `
                            <button class="btn-sm btn-outline-success" title="Confirm" onclick="app.updateAppointmentStatus('${apt.id}', 'Confirmed')">
                                ✔ Confirm
                            </button>
                        ` : ''}
                        ${apt.status === 'Confirmed' ? `
                            <button class="btn-sm btn-outline-primary" title="Complete" onclick="app.updateAppointmentStatus('${apt.id}', 'Completed')">
                                🏁 Complete
                            </button>
                        ` : ''}
                        ${apt.status !== 'Cancelled' ? `
                            <button class="btn-sm btn-outline-warning" title="Cancel" onclick="app.updateAppointmentStatus('${apt.id}', 'Cancelled')">
                                ✕ Cancel
                            </button>
                        ` : ''}
                        <button class="btn-sm btn-outline-danger" title="Delete" onclick="app.deleteAppointment('${apt.id}')">
                            🗑
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    openBookAppointmentModal(preselectedDoctorId = null) {
        document.getElementById('appointmentForm').reset();
        
        const nextNum = 500 + this.appointments.length + 1;
        document.getElementById('apptFormId').value = `APT-${nextNum}`;

        // Default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('apptFormDate').value = today;
        document.getElementById('apptFormTime').value = "10:00";

        this.populateDoctorSelectDropdowns();

        if (preselectedDoctorId) {
            document.getElementById('apptFormDoctor').value = preselectedDoctorId;
        }

        this.openModal('modalAppointment');
    }

    scheduleAppointmentWithDoctor(doctorId) {
        this.openBookAppointmentModal(doctorId);
    }

    saveAppointmentForm(e) {
        e.preventDefault();

        const id = document.getElementById('apptFormId').value.trim();
        const patientName = document.getElementById('apptFormPatientName').value.trim();
        const patientPhone = document.getElementById('apptFormPatientPhone').value.trim();
        const doctorId = document.getElementById('apptFormDoctor').value;
        const date = document.getElementById('apptFormDate').value;
        const time = document.getElementById('apptFormTime').value;
        const priority = document.getElementById('apptFormPriority').value;
        const reason = document.getElementById('apptFormReason').value.trim();

        if (!patientName || !doctorId || !date || !time) {
            this.showToast("Please provide patient name, doctor, date, and appointment time.", "error");
            return;
        }

        const doc = this.doctors.find(d => d.id === doctorId);
        const doctorName = doc ? doc.name : 'Unknown Doctor';
        const department = doc ? doc.department : 'General OPD';

        const newAppt = {
            id,
            patientName,
            patientPhone: patientPhone || 'N/A',
            doctorId,
            doctorName,
            department,
            date,
            time,
            priority,
            status: "Confirmed",
            reason: reason || 'Routine Consultation'
        };

        this.appointments.unshift(newAppt);
        this.saveAppointments();
        this.logActivity(`Booked appointment ${id} for ${patientName} with ${doctorName}`, "appointment");
        this.showToast(`Appointment ${id} confirmed for ${patientName}.`, "success");
        this.renderAppointmentsTable();
        this.closeModal('modalAppointment');
    }

    updateAppointmentStatus(apptId, newStatus) {
        const appt = this.appointments.find(a => a.id === apptId);
        if (!appt) return;

        appt.status = newStatus;
        this.saveAppointments();
        this.logActivity(`Appointment ${appt.id} status changed to ${newStatus}`, "appointment");
        this.showToast(`Appointment ${appt.id} marked as ${newStatus}.`, "info");
        this.renderAppointmentsTable();
        this.updateStats();
    }

    deleteAppointment(apptId) {
        const appt = this.appointments.find(a => a.id === apptId);
        if (!appt) return;

        if (confirm(`Remove appointment ${appt.id} for ${appt.patientName}?`)) {
            this.appointments = this.appointments.filter(a => a.id !== apptId);
            this.saveAppointments();
            this.logActivity(`Deleted appointment ${apptId}`, "appointment");
            this.showToast(`Appointment ${apptId} deleted.`, "info");
            this.renderAppointmentsTable();
            this.updateStats();
        }
    }

    /* =========================================================================
       8. FIRST AID DRUGS & SYMPTOM TRIAGE MODULE
       ========================================================================= */
    renderFirstAidChips() {
        const container = document.getElementById('firstAidQuickChips');
        if (!container) return;

        const chips = [
            { id: "complaint-fever", label: "🌡 High Fever & Chills" },
            { id: "complaint-headache", label: "🧠 Severe Headache / Migraine" },
            { id: "complaint-burns", label: "🔥 Minor Burns & Scalds" },
            { id: "complaint-cuts-wounds", label: "🩹 Cuts, Wounds & Bleeding" },
            { id: "complaint-stomach-pain", label: "🤢 Stomach Ache & Diarrhea" },
            { id: "complaint-acidity", label: "🔥 Acid Reflux & Heartburn" },
            { id: "complaint-asthma", label: "🫁 Shortness of Breath / Asthma" },
            { id: "complaint-allergy", label: "🌸 Allergic Reaction & Hives" },
            { id: "complaint-sprain", label: "🦶 Sprained Ankle / Joint Pain" },
            { id: "complaint-cough-cold", label: "🤧 Cough, Cold & Sore Throat" },
            { id: "complaint-toothache", label: "🦷 Severe Toothache" },
            { id: "complaint-eye", label: "👁 Eye Irritation / Dust" }
        ];

        container.innerHTML = chips.map(chip => `
            <button class="firstaid-chip-btn" onclick="app.selectComplaintById('${chip.id}')">
                ${chip.label}
            </button>
        `).join('');

        // If no consultation opened yet, show default advice
        if (!document.getElementById('firstAidAdviceContainer').children.length) {
            this.selectComplaintById('complaint-fever');
        }
    }

    handleSymptomSearch(query) {
        if (!query || query.trim() === "") {
            this.showToast("Please enter what is wrong or your symptoms.", "warning");
            return;
        }

        const matches = this.symptomAdvisor.analyzeComplaint(query);
        const container = document.getElementById('firstAidAdviceContainer');
        if (!container) return;

        if (matches.length === 0) {
            container.innerHTML = `
                <div class="card p-4 text-center">
                    <h4 class="text-danger">No exact first aid match found for: "${this.escapeHTML(query)}"</h4>
                    <p class="text-muted mt-2">
                        For non-standard or multiple severe symptoms, immediate medical attention by an on-duty hospital physician is advised.
                    </p>
                    <div class="mt-3">
                        <button class="btn btn-primary" onclick="app.openBookAppointmentModal()">
                            📅 Book Doctor Consultation
                        </button>
                        <button class="btn btn-outline-danger ml-2" onclick="app.switchTab('duty')">
                            🚨 Contact Emergency On-Duty Doctor
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        const topMatch = matches[0].item;
        this.renderConditionDetails(topMatch, matches.slice(1, 4).map(m => m.item));
    }

    selectComplaintById(id) {
        const item = this.symptomAdvisor.getComplaintById(id);
        if (item) {
            this.renderConditionDetails(item, []);
        }
    }

    renderConditionDetails(condition, otherPossibilities = []) {
        const container = document.getElementById('firstAidAdviceContainer');
        if (!container) return;

        const assignedDoc = this.doctors.find(d => d.id === condition.recommendedDoctorId) || 
                            this.doctors.find(d => d.department.includes(condition.recommendedDepartment)) ||
                            this.doctors[0];

        container.innerHTML = `
            <div class="firstaid-advice-card">
                <!-- Header Banner -->
                <div class="triage-header" style="border-left: 6px solid ${condition.urgencyColor};">
                    <div class="triage-title-area">
                        <span class="triage-pill" style="background-color: ${condition.urgencyColor};">
                            TRIAGE: ${condition.urgency.toUpperCase()}
                        </span>
                        <h2 class="condition-main-title">${this.escapeHTML(condition.title)}</h2>
                        <p class="condition-dept-tag">Recommended Clinical Department: <strong>${condition.recommendedDepartment}</strong></p>
                    </div>
                    <div class="triage-actions">
                        <button class="btn-sm btn-outline-primary" onclick="window.print()">
                            🖨 Print First Aid Slip
                        </button>
                    </div>
                </div>

                <div class="condition-overview-box">
                    <p>${condition.overview}</p>
                </div>

                <!-- Immediate First Aid Actions Checklist -->
                <div class="firstaid-section">
                    <h3 class="section-heading">
                        <span class="heading-icon">🛡</span> Immediate First Aid Action Steps
                    </h3>
                    <ul class="firstaid-checklist">
                        ${condition.immediateActions.map((step, idx) => `
                            <li>
                                <span class="step-num">${idx + 1}</span>
                                <div class="step-text">${step}</div>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Recommended First Aid Drugs & Dosages -->
                <div class="firstaid-section mt-4">
                    <h3 class="section-heading">
                        <span class="heading-icon">💊</span> Recommended First Aid Drugs & Dosages
                    </h3>
                    <p class="section-subtext text-muted">
                        Safe Over-the-Counter (OTC) pharmaceutical relief based on PUIT24210078 Hospital Clinical Formulary:
                    </p>

                    <div class="drugs-grid">
                        ${condition.drugs.map(drug => `
                            <div class="drug-card">
                                <div class="drug-name-header">
                                    <h4 class="drug-name">${this.escapeHTML(drug.name)}</h4>
                                    <span class="drug-class-badge">${this.escapeHTML(drug.type)}</span>
                                </div>
                                <div class="drug-details">
                                    <div class="drug-prop">
                                        <strong>🎯 Purpose:</strong>
                                        <span>${this.escapeHTML(drug.purpose)}</span>
                                    </div>
                                    <div class="drug-prop">
                                        <strong>👤 Adult Dosage:</strong>
                                        <span class="dose-text">${this.escapeHTML(drug.adultDosage)}</span>
                                    </div>
                                    <div class="drug-prop">
                                        <strong>👶 Child Dosage / Pediatric:</strong>
                                        <span class="dose-text">${this.escapeHTML(drug.childDosage)}</span>
                                    </div>
                                    <div class="drug-prop drug-warning">
                                        <strong>⚠️ Safety Warning & Contraindications:</strong>
                                        <span>${this.escapeHTML(drug.safetyWarning)}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Red Flags & When to Rush to Emergency -->
                <div class="red-flag-box mt-4">
                    <div class="red-flag-header">
                        <span class="siren-icon">🚨</span>
                        <h4>CRITICAL RED FLAGS - WHEN TO RUSH TO PUIT EMERGENCY ROOM</h4>
                    </div>
                    <ul class="red-flag-list">
                        ${condition.redFlags.map(rf => `
                            <li><strong>⚠️</strong> ${rf}</li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Assigned On-Duty Doctor Referral & Quick Booking -->
                <div class="triage-referral-box mt-4">
                    <div class="doc-referral-card">
                        <div class="doc-referral-avatar" style="background-color: ${assignedDoc.avatarColor || '#0284c7'}">
                            ${this.getInitials(assignedDoc.name)}
                        </div>
                        <div class="doc-referral-info">
                            <span class="referral-tag">Assigned Clinical Specialist On Duty:</span>
                            <h4 class="referral-name">${assignedDoc.name}</h4>
                            <p class="referral-spec">${assignedDoc.specialization} • ${assignedDoc.room}</p>
                            <span class="referral-shift">Current Duty: ${assignedDoc.shift}</span>
                        </div>
                        <div class="doc-referral-cta">
                            <button class="btn btn-primary" onclick="app.openBookAppointmentModal('${assignedDoc.id}')">
                                📅 Book Appointment with Dr. ${assignedDoc.name.split(' ')[1] || ''}
                            </button>
                        </div>
                    </div>
                </div>

                ${otherPossibilities.length > 0 ? `
                    <div class="other-matches-box mt-4">
                        <h5>Other potential conditions related to your complaint:</h5>
                        <div class="other-chips-group">
                            ${otherPossibilities.map(op => `
                                <button class="btn-sm btn-outline-secondary" onclick="app.selectComplaintById('${op.id}')">
                                    ${op.title}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /* =========================================================================
       9. MODAL & DROPDOWN HELPERS
       ========================================================================= */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    populateDoctorSelectDropdowns() {
        const patientDocSelect = document.getElementById('patientFormDoctor');
        const apptDocSelect = document.getElementById('apptFormDoctor');

        const options = this.doctors.map(d => 
            `<option value="${d.id}">${d.name} (${d.specialization} - ${d.status})</option>`
        ).join('');

        if (patientDocSelect) {
            patientDocSelect.innerHTML = `<option value="">-- Select Attending Doctor --</option>` + options;
        }

        if (apptDocSelect) {
            apptDocSelect.innerHTML = `<option value="">-- Choose Doctor / Specialist --</option>` + options;
        }
    }

    showToast(message, type = "info") {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `custom-toast toast-${type}`;
        
        const icons = {
            success: '✔',
            error: '✖',
            warning: '⚠️',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || 'ℹ'}</span>
            <span class="toast-msg">${this.escapeHTML(message)}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('fade-out');
                setTimeout(() => toast.remove(), 400);
            }
        }, 4000);
    }

    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    getInitials(name) {
        if (!name) return 'MD';
        const parts = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
    }
}

// Global instance initiation
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new HospitalApp();
});
