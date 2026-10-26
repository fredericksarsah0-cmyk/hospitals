// PUIT24210078 HOSPITAL MANAGEMENT SYSTEM - Secure Authentication Manager
// Implements 2-Step Authentication (2FA) with Salt, Pepper & OTP Code Verification

class AuthManager {
    constructor() {
        this.sessionKey = 'puit_hms_session_v1';
        this.usersKey = 'puit_hms_users_local';
        this.clientPepper = 'PUIT24210078_SECURE_PEPPER_KEY_V1_CLINICAL_AUTHENTICATION_HMAC_SECRET';
        this.currentUser = null;
        this.pendingToken = null;
        this.pendingUser = null;
        this.activeOtpPreview = null;
        this.otpExpiresAt = null;
        this.countdownTimer = null;
        this.resendTimer = null;
        this.resendCooldownSeconds = 30;
        this.isServerMode = false;
        
        // Bind UI and initialize
        this.init();
    }

    /* =========================================================================
       1. INITIALIZATION & SESSION CHECK
       ========================================================================= */
    async init() {
        // Check if Node server API is reachable
        await this.detectServerMode();

        // Ensure fallback demo users are initialized in localStorage if offline
        this.ensureLocalUsers();

        // Bind DOM event listeners
        this.bindEvents();

        // Check if user already has an active, valid authenticated session
        const existingSession = this.getStoredSession();
        if (existingSession && existingSession.user) {
            this.currentUser = existingSession.user;
            this.unlockHospitalSystem(existingSession.user, false);
        } else {
            this.lockHospitalSystem();
        }
    }

    async detectServerMode() {
        try {
            if (window.location.protocol.startsWith('http')) {
                const res = await fetch('/api/auth/security-info', { method: 'GET' });
                if (res.ok) {
                    this.isServerMode = true;
                    console.log('[AUTH] Connected to PUIT24210078 Node.js Secure Auth API.');
                    return;
                }
            }
        } catch (e) {
            // Server offline or file:// protocol
        }
        this.isServerMode = false;
        console.log('[AUTH] Operating in Local WebCrypto Salt & Pepper Client Engine.');
    }

    getStoredSession() {
        try {
            const rawSession = sessionStorage.getItem(this.sessionKey) || localStorage.getItem(this.sessionKey);
            if (rawSession) {
                const data = JSON.parse(rawSession);
                if (data.expiresAt && Date.now() < data.expiresAt) {
                    return data;
                }
                this.clearStoredSession();
            }
        } catch (e) {
            this.clearStoredSession();
        }
        return null;
    }

    saveStoredSession(user, token, remember) {
        const sessionData = {
            user,
            token,
            savedAt: Date.now(),
            expiresAt: Date.now() + (remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
        };
        sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        if (remember) {
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        }
    }

    clearStoredSession() {
        sessionStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.sessionKey);
    }

    /* =========================================================================
       2. EVENT BINDING & UI HANDLERS
       ========================================================================= */
    bindEvents() {
        // Step 1: Credentials Form Submission
        const loginForm = document.getElementById('authLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCredentialsSubmit();
            });
        }

        // Step 2: OTP Verification Form Submission
        const otpForm = document.getElementById('authOtpForm');
        if (otpForm) {
            otpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOtpSubmit();
            });
        }

        // Password Show/Hide Toggle
        const togglePwdBtn = document.getElementById('toggleLoginPassword');
        const pwdInput = document.getElementById('loginPassword');
        if (togglePwdBtn && pwdInput) {
            togglePwdBtn.addEventListener('click', () => {
                const isPassword = pwdInput.type === 'password';
                pwdInput.type = isPassword ? 'text' : 'password';
                togglePwdBtn.textContent = isPassword ? '🙈' : '👁';
                togglePwdBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            });
        }

        // Quick Demo Accounts Fill Buttons
        document.querySelectorAll('.demo-account-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const username = btn.dataset.username;
                const password = btn.dataset.password;
                if (username && password) {
                    const uInput = document.getElementById('loginUsername');
                    const pInput = document.getElementById('loginPassword');
                    if (uInput) uInput.value = username;
                    if (pInput) pInput.value = password;
                    this.clearError('login');
                }
            });
        });

        // 6-Digit OTP Box Management (Auto Focus, Backspace, Paste)
        const otpDigits = document.querySelectorAll('.otp-digit');
        otpDigits.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = val ? val[0] : '';
                if (val && index < otpDigits.length - 1) {
                    otpDigits[index + 1].focus();
                }
                this.clearError('otp');
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    otpDigits[index - 1].focus();
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
                const digits = pasteData.replace(/[^0-9]/g, '').slice(0, 6);
                if (digits) {
                    digits.split('').forEach((d, i) => {
                        if (otpDigits[i]) otpDigits[i].value = d;
                    });
                    if (otpDigits[Math.min(digits.length, 5)]) {
                        otpDigits[Math.min(digits.length, 5)].focus();
                    }
                    if (digits.length === 6) {
                        this.handleOtpSubmit();
                    }
                }
            });
        });

        // Auto-fill OTP button in simulated notification card
        const btnAutoFill = document.getElementById('btnAutoFillOtp');
        if (btnAutoFill) {
            btnAutoFill.addEventListener('click', () => {
                if (this.activeOtpPreview) {
                    const digits = this.activeOtpPreview.split('');
                    otpDigits.forEach((input, i) => {
                        input.value = digits[i] || '';
                    });
                    if (otpDigits[5]) otpDigits[5].focus();
                    this.showToast('OTP auto-filled from secure hospital dispatch notification.', 'info');
                }
            });
        }

        // Copy OTP button in simulated notification card
        const btnCopyOtp = document.getElementById('btnCopyOtp');
        if (btnCopyOtp) {
            btnCopyOtp.addEventListener('click', () => {
                if (this.activeOtpPreview) {
                    navigator.clipboard.writeText(this.activeOtpPreview).then(() => {
                        const originalText = btnCopyOtp.innerHTML;
                        btnCopyOtp.innerHTML = '✅ Copied!';
                        setTimeout(() => { btnCopyOtp.innerHTML = originalText; }, 2000);
                        this.showToast('OTP code copied to clipboard.', 'success');
                    }).catch(() => {
                        this.showToast('Code: ' + this.activeOtpPreview, 'info');
                    });
                }
            });
        }

        // Resend OTP Button
        const btnResend = document.getElementById('btnResendOtp');
        if (btnResend) {
            btnResend.addEventListener('click', () => {
                this.handleResendOtp();
            });
        }

        // Back to Step 1 Button
        const btnBack = document.getElementById('btnBackToStep1');
        if (btnBack) {
            btnBack.addEventListener('click', () => {
                this.showStep(1);
            });
        }

        // Registration Modal Open/Close
        const btnOpenRegister = document.getElementById('btnOpenRegisterModal');
        const modalRegister = document.getElementById('modalRegisterStaff');
        if (btnOpenRegister && modalRegister) {
            btnOpenRegister.addEventListener('click', (e) => {
                e.preventDefault();
                modalRegister.classList.add('active');
            });
        }

        const registerForm = document.getElementById('staffRegistrationForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegisterSubmit();
            });
        }

        // Security Architecture Modal Open
        const btnOpenSecurity = document.getElementById('btnOpenSecurityModal');
        const modalSecurity = document.getElementById('modalSecurityInfo');
        if (btnOpenSecurity && modalSecurity) {
            btnOpenSecurity.addEventListener('click', (e) => {
                e.preventDefault();
                modalSecurity.classList.add('active');
            });
        }

        // Close generic modals
        document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('.auth-modal').forEach(m => m.classList.remove('active'));
            });
        });
    }

    /* =========================================================================
       3. STEP 1: CREDENTIALS VERIFICATION (SALT & PEPPER)
       ========================================================================= */
    async handleCredentialsSubmit() {
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');
        const rememberInput = document.getElementById('rememberTerminal');
        const submitBtn = document.getElementById('btnSubmitCredentials');

        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';
        const remember = rememberInput ? rememberInput.checked : false;

        if (!username || !password) {
            this.showError('login', 'Please enter your username/staff ID and password.');
            return;
        }

        this.setButtonLoading(submitBtn, true, 'Verifying Credentials...');
        this.clearError('login');

        try {
            let result;

            if (this.isServerMode) {
                // Call Node.js server API
                const resp = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                result = await resp.json();
                if (!resp.ok || !result.success) {
                    throw new Error(result.error || 'Invalid credentials.');
                }
            } else {
                // Client-side WebCrypto Salt & Pepper engine
                result = await this.clientLogin(username, password);
            }

            // Step 1 Successful! Transition to Step 2 (Two-Step Authentication)
            this.pendingToken = result.pendingToken;
            this.pendingUser = result.user;
            this.activeOtpPreview = result.otpPreview;
            this.rememberTerminal = remember;

            this.showStep(2);
            this.renderOtpStep(result);
            this.showToast('Step 1 Verified! 2FA OTP Code dispatched.', 'success');

        } catch (err) {
            this.showError('login', err.message || 'Authentication error. Please check credentials.');
        } finally {
            this.setButtonLoading(submitBtn, false, '<span>🔒 Verify Credentials & Send OTP</span>');
        }
    }

    /* =========================================================================
       4. STEP 2: TWO-STEP AUTHENTICATION (OTP CODE VERIFICATION)
       ========================================================================= */
    renderOtpStep(authResult) {
        // Update masked contact channels
        const phoneEl = document.getElementById('otpMaskedPhone');
        const emailEl = document.getElementById('otpMaskedEmail');
        const targetStaffName = document.getElementById('otpStaffName');

        if (phoneEl) phoneEl.textContent = authResult.user.maskedPhone || '+234 803 *** 4567';
        if (emailEl) emailEl.textContent = authResult.user.maskedEmail || 'staff@hospital.puit.edu.ng';
        if (targetStaffName) targetStaffName.textContent = authResult.user.name;

        // Update simulated dispatch card
        const highlightEl = document.getElementById('dispatchOtpHighlight');
        if (highlightEl) {
            highlightEl.textContent = authResult.otpPreview || '------';
        }

        // Clear existing digits
        document.querySelectorAll('.otp-digit').forEach(d => { d.value = ''; });
        const firstDigit = document.querySelector('.otp-digit[data-index="0"]');
        if (firstDigit) setTimeout(() => firstDigit.focus(), 200);

        // Start countdown timer (5 minutes = 300 seconds)
        this.startOtpCountdown(authResult.expiresInSeconds || 300);

        // Start resend cooldown (30 seconds)
        this.startResendCooldown();
    }

    async handleOtpSubmit() {
        const otpDigits = document.querySelectorAll('.otp-digit');
        let otpCode = '';
        otpDigits.forEach(d => { otpCode += d.value.trim(); });

        const submitBtn = document.getElementById('btnVerifyOtp');

        if (otpCode.length !== 6) {
            this.showError('otp', 'Please enter all 6 digits of the OTP code received.');
            return;
        }

        this.setButtonLoading(submitBtn, true, 'Verifying 2-Step OTP Code...');
        this.clearError('otp');

        try {
            let result;

            if (this.isServerMode) {
                const resp = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pendingToken: this.pendingToken,
                        otp: otpCode
                    })
                });
                result = await resp.json();
                if (!resp.ok || !result.success) {
                    throw new Error(result.error || 'Invalid OTP code.');
                }
            } else {
                result = await this.clientVerifyOtp(this.pendingToken, otpCode);
            }

            // 2-STEP AUTHENTICATION COMPLETE!
            this.stopTimers();
            this.saveStoredSession(result.user, result.token, this.rememberTerminal);
            this.currentUser = result.user;

            // Trigger success animation and unlock HMS
            this.showStep(3);
            setTimeout(() => {
                this.unlockHospitalSystem(result.user, true);
            }, 800);

        } catch (err) {
            this.showError('otp', err.message || 'OTP verification failed. Please try again.');
        } finally {
            this.setButtonLoading(submitBtn, false, '<span>🛡️ Confirm OTP & Open Hospital System</span>');
        }
    }

    async handleResendOtp() {
        const btnResend = document.getElementById('btnResendOtp');
        if (btnResend && btnResend.disabled) return;

        this.clearError('otp');

        try {
            let result;
            if (this.isServerMode) {
                const resp = await fetch('/api/auth/resend-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pendingToken: this.pendingToken })
                });
                result = await resp.json();
                if (!resp.ok || !result.success) {
                    throw new Error(result.error || 'Failed to resend OTP.');
                }
            } else {
                result = await this.clientResendOtp(this.pendingToken);
            }

            this.activeOtpPreview = result.otpPreview;
            const highlightEl = document.getElementById('dispatchOtpHighlight');
            if (highlightEl) {
                highlightEl.textContent = result.otpPreview;
            }

            // Reset countdown & resend cooldown
            this.startOtpCountdown(result.expiresInSeconds || 300);
            this.startResendCooldown();

            this.showToast('Fresh OTP code dispatched to simulated pager & terminal.', 'info');

        } catch (err) {
            this.showError('otp', err.message || 'Could not resend OTP.');
        }
    }

    startOtpCountdown(seconds) {
        clearInterval(this.countdownTimer);
        let remaining = seconds;
        const timerEl = document.getElementById('otpCountdownTimer');

        const updateDisplay = () => {
            const m = Math.floor(remaining / 60).toString().padStart(2, '0');
            const s = (remaining % 60).toString().padStart(2, '0');
            if (timerEl) timerEl.textContent = `${m}:${s}`;
        };

        updateDisplay();

        this.countdownTimer = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(this.countdownTimer);
                if (timerEl) timerEl.textContent = '00:00 (Expired)';
                this.showError('otp', 'Your OTP code has expired. Please click Resend Code.');
            } else {
                updateDisplay();
            }
        }, 1000);
    }

    startResendCooldown() {
        clearInterval(this.resendTimer);
        const btnResend = document.getElementById('btnResendOtp');
        const cooldownSpan = document.getElementById('resendCooldown');
        let remaining = 30;

        if (btnResend) btnResend.disabled = true;
        if (cooldownSpan) cooldownSpan.textContent = remaining;

        this.resendTimer = setInterval(() => {
            remaining--;
            if (cooldownSpan) cooldownSpan.textContent = remaining;
            if (remaining <= 0) {
                clearInterval(this.resendTimer);
                if (btnResend) {
                    btnResend.disabled = false;
                    btnResend.innerHTML = '🔄 Resend New Code';
                }
            }
        }, 1000);
    }

    stopTimers() {
        clearInterval(this.countdownTimer);
        clearInterval(this.resendTimer);
    }

    /* =========================================================================
       5. STAFF REGISTRATION (SALT & PEPPER IMPLEMENTATION)
       ========================================================================= */
    async handleRegisterSubmit() {
        const form = document.getElementById('staffRegistrationForm');
        const btn = document.getElementById('btnSubmitRegistration');

        const name = document.getElementById('regName').value.trim();
        const username = document.getElementById('regUsername').value.trim();
        const staffId = document.getElementById('regStaffId').value.trim();
        const role = document.getElementById('regRole').value;
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            this.showError('register', 'Passwords do not match. Please re-enter.');
            return;
        }

        if (password.length < 8) {
            this.showError('register', 'Password must be at least 8 characters long.');
            return;
        }

        this.setButtonLoading(btn, true, 'Generating Salt & Pepper Hash...');
        this.clearError('register');

        try {
            if (this.isServerMode) {
                const resp = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, name, role, staffId, email, phone })
                });
                const result = await resp.json();
                if (!resp.ok || !result.success) {
                    throw new Error(result.error || 'Registration failed.');
                }
            } else {
                await this.clientRegister({ username, password, name, role, staffId, email, phone });
            }

            // Success! Populate login form
            document.querySelectorAll('.auth-modal').forEach(m => m.classList.remove('active'));
            form.reset();

            const loginUser = document.getElementById('loginUsername');
            const loginPwd = document.getElementById('loginPassword');
            if (loginUser) loginUser.value = username;
            if (loginPwd) loginPwd.value = password;

            this.showToast('Staff registered successfully with Salt & Pepper! You can now log in.', 'success');

        } catch (err) {
            this.showError('register', err.message || 'Registration failed.');
        } finally {
            this.setButtonLoading(btn, false, '<span>Register Clinical Account</span>');
        }
    }

    /* =========================================================================
       6. UI STATE SWITCHING & HOSPITAL SYSTEM UNLOCK
       ========================================================================= */
    showStep(stepNumber) {
        const step1Panel = document.getElementById('authStep1Panel');
        const step2Panel = document.getElementById('authStep2Panel');
        const step3Panel = document.getElementById('authStep3Panel');

        const step1Badge = document.getElementById('stepIndicator1');
        const step2Badge = document.getElementById('stepIndicator2');
        const step3Badge = document.getElementById('stepIndicator3');

        // Reset display
        if (step1Panel) step1Panel.style.display = (stepNumber === 1) ? 'block' : 'none';
        if (step2Panel) step2Panel.style.display = (stepNumber === 2) ? 'block' : 'none';
        if (step3Panel) step3Panel.style.display = (stepNumber === 3) ? 'block' : 'none';

        // Update stepper badges
        if (step1Badge) {
            step1Badge.classList.toggle('active', stepNumber === 1);
            step1Badge.classList.toggle('completed', stepNumber > 1);
        }
        if (step2Badge) {
            step2Badge.classList.toggle('active', stepNumber === 2);
            step2Badge.classList.toggle('completed', stepNumber > 2);
        }
        if (step3Badge) {
            step3Badge.classList.toggle('active', stepNumber === 3);
            step3Badge.classList.toggle('completed', stepNumber === 3);
        }
    }

    unlockHospitalSystem(user, logToActivity = false) {
        const authWrapper = document.getElementById('authScreenWrapper');
        const appContainer = document.getElementById('appContainer');

        if (authWrapper) {
            authWrapper.classList.add('fade-out');
            setTimeout(() => {
                authWrapper.style.display = 'none';
                authWrapper.classList.remove('fade-out');
            }, 300);
        }

        if (appContainer) {
            appContainer.style.display = 'flex';
        }

        // Update Topbar with authenticated staff member
        const avatarEl = document.getElementById('currentUserAvatar');
        const nameEl = document.getElementById('currentUserName');
        const roleEl = document.getElementById('currentUserRole');

        if (avatarEl) avatarEl.textContent = this.getInitials(user.name);
        if (nameEl) nameEl.textContent = user.name;
        if (roleEl) roleEl.textContent = `${user.role} (${user.staffId || user.username})`;

        // Log authentication to hospital live activity feed
        if (logToActivity && window.app && typeof window.app.logActivity === 'function') {
            window.app.logActivity(
                `${user.name} logged in via Two-Step Verification (OTP: ${this.activeOtpPreview || 'Verified'})`,
                'doctor'
            );
        }

        this.showToast(`Welcome, ${user.name}! Clinical access authorized.`, 'success');
    }

    lockHospitalSystem() {
        const authWrapper = document.getElementById('authScreenWrapper');
        const appContainer = document.getElementById('appContainer');

        if (appContainer) appContainer.style.display = 'none';
        if (authWrapper) {
            authWrapper.style.display = 'flex';
            this.showStep(1);
        }
    }

    async logout() {
        if (confirm("Are you sure you want to log out of the PUIT24210078 Hospital Management System?")) {
            const session = this.getStoredSession();
            if (session && session.token && this.isServerMode) {
                try {
                    await fetch('/api/auth/logout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token: session.token })
                    });
                } catch (e) {
                    // Ignore network failure on logout
                }
            }

            if (window.app && typeof window.app.logActivity === 'function' && this.currentUser) {
                window.app.logActivity(`${this.currentUser.name} signed out of workstation`, 'system');
            }

            this.clearStoredSession();
            this.currentUser = null;
            this.pendingToken = null;
            this.activeOtpPreview = null;
            this.stopTimers();

            // Clear inputs
            const pInput = document.getElementById('loginPassword');
            if (pInput) pInput.value = '';
            document.querySelectorAll('.otp-digit').forEach(d => { d.value = ''; });

            this.lockHospitalSystem();
            this.showToast('You have been securely signed out.', 'info');
        }
    }

    /* =========================================================================
       7. CLIENT-SIDE WEBCRYPTO FALLBACK ENGINE (SALT & PEPPER + 2FA)
       ========================================================================= */
    ensureLocalUsers() {
        const stored = localStorage.getItem(this.usersKey);
        if (!stored) {
            // Pre-seed default accounts with known Salt & Pepper PBKDF2-HMAC-SHA512 hashes
            const defaultUsers = [
                {
                    id: 'USR-001',
                    username: 'admin',
                    name: 'System Administrator',
                    role: 'Chief Administrator',
                    staffId: 'PUIT-ADM-001',
                    email: 'admin@hospital.puit.edu.ng',
                    phone: '+234 803 123 4567',
                    salt: '05e5acb6371343153b2bee633a3b54e8',
                    hash: '6b3f68fa70c9ef7118f82b6afc65cff83a97713ec0b45698e7c76711284987ffaf1cf400278f4fd1c374b3d4f90c7e32f5af80bf175d1428ddb3bff3f65343de'
                },
                {
                    id: 'USR-002',
                    username: 'dr.adebayo',
                    name: 'Dr. Samuel Adebayo, FWACS',
                    role: 'Chief Consultant Physician',
                    staffId: 'PUIT-DOC-101',
                    email: 'dr.adebayo@hospital.puit.edu.ng',
                    phone: '+234 802 987 6543',
                    salt: 'e71f65bf19a06e00632917e1483c0404',
                    hash: '7416a1ca0368ae041c5dc18304a7e2cb25a401f285938339c7d960d51e25b8201837884fdb6d78fb8c07dc775c2456f6d97e589047f94dd1529f0f7bc0a6f2b1'
                },
                {
                    id: 'USR-003',
                    username: 'nurse.chioma',
                    name: 'Nurse Chioma Okonjo, RN',
                    role: 'Head Triage Nurse',
                    staffId: 'PUIT-NRS-204',
                    email: 'chioma@hospital.puit.edu.ng',
                    phone: '+234 814 555 0199',
                    salt: '363513360e09f16c13b4daeb31a8f85b',
                    hash: 'cce427b60314f2d67926add89e8ef202bb38553fd297fe8733276c8e63b421b482e5e238d99eb17065c354fb282604071ea8d7a6ef8425aa7689ba6bfe5aef2a'
                }
            ];
            localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
        }
    }

    getLocalUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.usersKey)) || [];
        } catch (e) {
            return [];
        }
    }

    saveLocalUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    async clientHash(password, salt) {
        const enc = new TextEncoder();
        const combined = password + this.clientPepper;
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(combined),
            { name: "PBKDF2" },
            false,
            ["deriveBits"]
        );
        const saltBuf = enc.encode(salt);
        const derivedBits = await window.crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: saltBuf,
                iterations: 10000,
                hash: "SHA-512"
            },
            keyMaterial,
            512
        );
        return Array.from(new Uint8Array(derivedBits))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    clientGenerateSalt() {
        const arr = new Uint8Array(16);
        window.crypto.getRandomValues(arr);
        return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    clientGenerateOTP() {
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        return (100000 + (arr[0] % 900000)).toString();
    }

    clientMaskContact(phone, email) {
        const maskedPhone = (phone || '+234 800 000 0000').replace(/(\+\d{3}\s*\d{3})\d+(\d{4})/, '$1 *** $2');
        const emailParts = (email || 'staff@hospital.puit.edu.ng').split('@');
        const maskedEmail = emailParts[0].substring(0, 2) + '***@' + (emailParts[1] || 'hospital.puit.edu.ng');
        return { maskedPhone, maskedEmail };
    }

    async clientLogin(username, password) {
        const users = this.getLocalUsers();
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!user) {
            throw new Error('Staff username not found. Please verify your credentials.');
        }

        const computedHash = await this.clientHash(password, user.salt);
        if (computedHash !== user.hash) {
            throw new Error('Invalid credentials. Password does not match our records.');
        }

        // Generate OTP and pending token
        const otp = this.clientGenerateOTP();
        const pendingToken = 'cl-token-' + Date.now() + '-' + Math.random().toString(36).substring(2);
        const { maskedPhone, maskedEmail } = this.clientMaskContact(user.phone, user.email);

        // Store client pending in memory
        this.clientPending = {
            token: pendingToken,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                staffId: user.staffId,
                email: user.email,
                phone: user.phone,
                maskedPhone,
                maskedEmail
            },
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: 0
        };

        return {
            success: true,
            pendingToken,
            user: this.clientPending.user,
            otpPreview: otp,
            expiresInSeconds: 300
        };
    }

    async clientVerifyOtp(pendingToken, otpCode) {
        if (!this.clientPending || this.clientPending.token !== pendingToken) {
            throw new Error('Pending 2FA session expired. Please log in again.');
        }

        if (Date.now() > this.clientPending.expiresAt) {
            this.clientPending = null;
            throw new Error('OTP code has expired. Please request a new code.');
        }

        if (this.clientPending.attempts >= 5) {
            this.clientPending = null;
            throw new Error('Too many incorrect attempts. Session invalidated.');
        }

        if (this.clientPending.otp !== otpCode.trim()) {
            this.clientPending.attempts++;
            const remaining = 5 - this.clientPending.attempts;
            throw new Error(`Incorrect OTP code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
        }

        const user = this.clientPending.user;
        const sessionToken = 'cl-sess-' + Date.now();
        this.clientPending = null;

        return {
            success: true,
            token: sessionToken,
            user
        };
    }

    async clientResendOtp(pendingToken) {
        if (!this.clientPending || this.clientPending.token !== pendingToken) {
            throw new Error('Verification session expired. Please log in again.');
        }

        const newOtp = this.clientGenerateOTP();
        this.clientPending.otp = newOtp;
        this.clientPending.expiresAt = Date.now() + 5 * 60 * 1000;
        this.clientPending.attempts = 0;

        return {
            success: true,
            otpPreview: newOtp,
            expiresInSeconds: 300
        };
    }

    async clientRegister(data) {
        const users = this.getLocalUsers();
        if (users.some(u => u.username.toLowerCase() === data.username.toLowerCase())) {
            throw new Error('A staff member with this username already exists.');
        }

        const salt = this.clientGenerateSalt();
        const hash = await this.clientHash(data.password, salt);

        const newUser = {
            id: `USR-${Date.now().toString().slice(-4)}`,
            username: data.username,
            name: data.name,
            role: data.role,
            staffId: data.staffId || `PUIT-STF-${Math.floor(100 + Math.random() * 900)}`,
            email: data.email || `${data.username}@hospital.puit.edu.ng`,
            phone: data.phone || '+234 800 000 0000',
            salt: salt,
            hash: hash,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveLocalUsers(users);
        return { success: true };
    }

    /* =========================================================================
       8. HELPERS & FEEDBACK
       ========================================================================= */
    showError(formType, message) {
        let el;
        if (formType === 'login') el = document.getElementById('loginErrorMessage');
        else if (formType === 'otp') el = document.getElementById('otpErrorMessage');
        else if (formType === 'register') el = document.getElementById('registerErrorMessage');

        if (el) {
            el.textContent = message;
            el.style.display = 'block';
        }
    }

    clearError(formType) {
        let el;
        if (formType === 'login') el = document.getElementById('loginErrorMessage');
        else if (formType === 'otp') el = document.getElementById('otpErrorMessage');
        else if (formType === 'register') el = document.getElementById('registerErrorMessage');

        if (el) {
            el.textContent = '';
            el.style.display = 'none';
        }
    }

    setButtonLoading(btn, isLoading, originalHtml) {
        if (!btn) return;
        btn.disabled = isLoading;
        if (isLoading) {
            btn.innerHTML = `<span class="auth-spinner"></span> ${originalHtml}`;
        } else {
            btn.innerHTML = originalHtml;
        }
    }

    getInitials(name) {
        if (!name) return 'MD';
        const parts = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
    }

    showToast(message, type = 'info') {
        if (window.app && typeof window.app.showToast === 'function') {
            window.app.showToast(message, type);
            return;
        }

        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✅' : type === 'danger' ? '⚠️' : 'ℹ️'}</span>
            <div class="toast-message">${message}</div>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }
}

// Global Authentication Instance
let auth;
document.addEventListener('DOMContentLoaded', () => {
    auth = new AuthManager();
});
