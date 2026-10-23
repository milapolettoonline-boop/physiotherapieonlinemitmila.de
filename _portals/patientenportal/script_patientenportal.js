/* ============================================
   MILA PHYSIO - PATIENTENPORTAL JAVASCRIPT
   Demo-Only Patient Portal
   Functions for Portal Management
   ============================================ */

// DEMO ONLY – später durch sichere API ersetzen
// SECURITY: Keine echten Passwörter oder Patientendaten werden gespeichert

/* ============================================
   DEMO DATA STRUCTURES
   ============================================ */

// DEMO ONLY – später durch sichere API ersetzen
const demoPatient = {
    id: 'patient_001',
    firstName: 'Anna',
    lastName: 'Muster',
    email: 'anna.demo@example.com',
    phone: '0123456789',
    therapyType: 'Hausbesuch',
    memberSince: '2026-01-15'
};

// DEMO ONLY – später durch sichere API ersetzen
const demoAppointments = [
    {
        id: 'app_001',
        date: '2026-09-27',
        time: '10:00',
        type: 'Online-Physiotherapie',
        therapist: 'Mila Physio',
        status: 'Bestätigt',
        location: '',
        duration: '40 Minuten',
        meetingUrl: '',        // Wird vom Backend gefüllt
        rescheduleUrl: ''      // Wird vom Backend gefüllt
    },
    {
        id: 'app_002',
        date: '2026-10-04',
        time: '14:30',
        type: 'Hausbesuch',
        therapist: 'Mila Physio',
        status: 'Bestätigt',
        location: 'Patientenhaus',
        duration: '40 Minuten',
        meetingUrl: null,      // Nicht anwendbar für Hausbesuch
        rescheduleUrl: ''      // Wird vom Backend gefüllt
    },
    {
        id: 'app_003',
        date: '2026-10-11',
        time: '09:15',
        type: 'Online-Physiotherapie',
        therapist: 'Mila Physio',
        status: 'Bestätigt',
        location: '',
        duration: '40 Minuten',
        meetingUrl: '',        // Wird vom Backend gefüllt
        rescheduleUrl: ''      // Wird vom Backend gefüllt
    }
];

// DEMO ONLY – später durch sichere API ersetzen
const demoExercises = [
    {
        id: 'ex_001',
        name: 'Nackenrollen',
        category: 'Mobilität',
        description: 'Sanfte Rollbewegungen des Nackens',
        reps: '10 Wiederholungen',
        sets: '3 Sätze',
        frequency: '2x täglich'
    },
    {
        id: 'ex_002',
        name: 'Schulterblatt-Squeeze',
        category: 'Kräftigung',
        description: 'Zusammendrücken der Schulterblattern',
        reps: '15 Wiederholungen',
        sets: '3 Sätze',
        frequency: '1x täglich'
    },
    {
        id: 'ex_003',
        name: 'Seitliche Beuge',
        category: 'Dehnung',
        description: 'Dehnen der seitlichen Rückenmuskulatur',
        reps: '20 Sekunden',
        sets: '3 Sätze',
        frequency: '2x täglich'
    }
];

/* ============================================
   SESSION MANAGEMENT
   ============================================ */

// DEMO ONLY – später durch sichere API ersetzen
// Session wird nur im Memory gehalten (nicht persistent)
let currentSession = {
    isAuthenticated: false,
    patientId: null,
    loginTime: null
};

/**
 * Initialize Portal
 * Check authentication and load initial data
 */
async function initPortal() {
    console.log('Portal initialized');
    // Protect page - redirect to login if not authenticated
    await protectPatientPage();
    // Load patient data
    await loadPatientDataForPage();
}

/**
 * Check Session Status
 * Verifies if user is logged in via backend API
 */
async function checkSession() {
    try {
        const response = await fetch('https://api.milaphysio.de/api/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            currentSession.isAuthenticated = true;
            currentSession.patientId = data.data.id;
            return true;
        } else {
            currentSession.isAuthenticated = false;
            return false;
        }
    } catch (error) {
        console.error('Session check error:', error);
        currentSession.isAuthenticated = false;
        return false;
    }
}

/**
 * Login Patient
 * Authenticates patient (DEMO ONLY)
 *
 * @param {string} email - Patient email
 * @param {string} password - Patient password (NOT STORED)
 */
function loginPatient(email) {
    // DEMO ONLY – später durch sichere API ersetzen
    // In production: Send credentials to secure API endpoint
    // NEVER store passwords on client side

    if (email === 'anna.demo@example.com') {
        // Demo login successful
        currentSession.isAuthenticated = true;
        currentSession.patientId = demoPatient.id;
        currentSession.loginTime = new Date().toISOString();

        // DEMO ONLY – Store only session ID, NEVER passwords
        sessionStorage.setItem('mila_portal_session', demoPatient.id);
        sessionStorage.setItem('mila_portal_login_time', currentSession.loginTime);

        // Redirect to dashboard
        window.location.href = 'index.html';
    } else {
        alert('Demo-Login fehlgeschlagen');
    }
}

/**
 * Real Login Patient
 * Authenticates patient via backend API
 */
async function loginPatientReal(email, password) {
    try {
        const response = await fetch('https://api.milaphysio.de/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.error || 'Login fehlgeschlagen';
            alert(errorMessage);
            return false;
        }

        // Session cookie wird automatisch vom Backend gesetzt
        // Frontend speichert KEINE tokens oder credentials
        currentSession.isAuthenticated = true;
        currentSession.patientId = data.data.id;
        currentSession.loginTime = new Date().toISOString();

        // Redirect to dashboard
        window.location.href = 'index.html';
        return true;
    } catch (error) {
        console.error('Login error:', error);
        alert('Ein Fehler ist bei der Anmeldung aufgetreten. Bitte versuchen Sie es später erneut.');
        return false;
    }
}

/**
 * Logout Patient
 * Calls backend logout and clears session
 */
async function logoutPatient() {
    try {
        // Call backend logout endpoint
        await fetch('https://api.milaphysio.de/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear in-memory session
        currentSession = {
            isAuthenticated: false,
            patientId: null,
            loginTime: null
        };

        // Redirect to login
        window.location.href = 'login.html';
    }
}

/**
 * Protect Patient Page
 * Redirect to login if not authenticated
 */
async function protectPatientPage() {
    // Verify session with backend API
    const isAuthenticated = await checkSession();

    if (!isAuthenticated) {
        // Only redirect if not on login page
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
}

/* ============================================
   DATA LOADING FUNCTIONS
   ============================================ */

/**
 * Load Patient Data For Page
 * Main function to load data based on current page
 */
async function loadPatientDataForPage() {
    const path = window.location.pathname;

    if (path.includes('index.html') || path.endsWith('/patientenportal/')) {
        await loadDashboardData();
    } else if (path.includes('termine.html')) {
        await loadAppointmentsPageData();
    } else if (path.includes('profil.html')) {
        await loadProfilePageData();
    }
}

/**
 * Load Patient Data
 * Retrieves patient information from API
 */
async function loadPatient() {
    try {
        const response = await fetch('https://api.milaphysio.de/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            return data.data;
        } else if (response.status === 401) {
            // Session expired
            window.location.href = 'login.html';
            return null;
        } else {
            console.error('Failed to load patient:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Load patient error:', error);
        return null;
    }
}

/**
 * Load Appointments
 * Retrieves all patient appointments from API
 */
async function loadAppointments() {
    try {
        const response = await fetch('https://api.milaphysio.de/api/appointments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            return data.data || [];
        } else if (response.status === 401) {
            // Session expired
            window.location.href = 'login.html';
            return [];
        } else {
            console.error('Failed to load appointments:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Load appointments error:', error);
        return [];
    }
}

/**
 * Load Exercises
 * Retrieves patient exercise plan from API
 */
async function loadExercises() {
    try {
        const response = await fetch('https://api.milaphysio.de/api/exercises', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            return data.data || [];
        } else if (response.status === 401) {
            window.location.href = 'login.html';
            return [];
        } else {
            console.error('Failed to load exercises:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Load exercises error:', error);
        return [];
    }
}

/**
 * Update Patient Profile
 * Sends profile updates to backend API
 */
async function updatePatientProfile(updates) {
    try {
        const response = await fetch('https://api.milaphysio.de/api/profile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updates)
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, data: data.data };
        } else if (response.status === 401) {
            window.location.href = 'login.html';
            return { success: false };
        } else {
            const data = await response.json();
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, error: 'Ein Fehler ist aufgetreten' };
    }
}

/**
 * Load Profile Data
 * Retrieves patient profile information from API
 */
async function loadProfile() {
    try {
        const response = await fetch('https://api.milaphysio.de/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            return data.data;
        } else if (response.status === 401) {
            window.location.href = 'login.html';
            return null;
        } else {
            console.error('Failed to load profile:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Load profile error:', error);
        return null;
    }
}

/**
 * Load Dashboard Data
 * Load patient info and next appointment for dashboard
 */
async function loadDashboardData() {
    try {
        const patient = await loadPatient();
        if (patient) {
            document.getElementById('patientFirstName').textContent = patient.first_name || 'Pacient';
        }

        const appointments = await loadAppointments();
        if (appointments && appointments.length > 0) {
            const nextApp = appointments[0];
            document.getElementById('appointmentDateTime').textContent = formatDateTime(nextApp.start_at, '') || 'Loading...';
            document.getElementById('appointmentType').textContent = nextApp.type || 'Termin';
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

/**
 * Load Appointments Page Data
 * Load all appointments for appointments page
 */
async function loadAppointmentsPageData() {
    try {
        const appointments = await loadAppointments();
        if (appointments && appointments.length > 0) {
            renderAppointments(appointments);
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

/**
 * Render Appointments
 * Display appointments in HTML
 */
function renderAppointments(appointments) {
    const upcomingList = document.getElementById('upcomingAppointments');
    const pastList = document.getElementById('pastAppointments');

    if (!upcomingList || !pastList) return;

    const now = new Date();
    const upcoming = [];
    const past = [];

    appointments.forEach(app => {
        if (new Date(app.start_at) > now) {
            upcoming.push(app);
        } else {
            past.push(app);
        }
    });

    // Render upcoming
    if (upcoming.length > 0) {
        upcomingList.innerHTML = upcoming.map(app => `
            <div class="appointment-card">
                <div class="appointment-status">${app.status || 'Bestätigt'}</div>
                <div class="appointment-details">
                    <div class="appointment-info">
                        <span class="info-label">Datum & Zeit</span>
                        <span class="info-value">${formatDate(app.start_at)}</span>
                    </div>
                    <div class="appointment-info">
                        <span class="info-label">Typ</span>
                        <span class="info-value">${app.type}</span>
                    </div>
                    <div class="appointment-info">
                        <span class="info-label">Ort</span>
                        <span class="info-value">${app.location || 'Online'}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        upcomingList.innerHTML = '<p>Keine kommenden Termine.</p>';
    }

    // Render past
    if (pastList) {
        if (past.length > 0) {
            pastList.innerHTML = past.map(app => `
                <div class="appointment-card">
                    <div class="appointment-status">Abgeschlossen</div>
                    <div class="appointment-details">
                        <div class="appointment-info">
                            <span class="info-label">Datum</span>
                            <span class="info-value">${formatDate(app.start_at)}</span>
                        </div>
                        <div class="appointment-info">
                            <span class="info-label">Typ</span>
                            <span class="info-value">${app.type}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            pastList.innerHTML = '<p>Keine vergangenen Termine.</p>';
        }
    }
}

/**
 * Load Profile Page Data
 * Load patient profile for editing
 */
async function loadProfilePageData() {
    try {
        const patient = await loadProfile();
        if (patient) {
            document.getElementById('profileName').textContent =
                (patient.first_name || '') + ' ' + (patient.last_name || '');
            document.getElementById('firstName').textContent = patient.first_name || '-';
            document.getElementById('lastName').textContent = patient.last_name || '-';
            document.getElementById('email').textContent = patient.email;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

/**
 * Edit Profile Handler
 * Opens edit form for profile fields
 */
function editProfile() {
    const firstNameDiv = document.getElementById('firstName');
    const lastNameDiv = document.getElementById('lastName');

    if (!firstNameDiv || !lastNameDiv) return;

    const firstName = firstNameDiv.textContent;
    const lastName = lastNameDiv.textContent;

    const formHTML = `
        <form id="editProfileForm" class="profile-edit-form">
            <div class="form-group">
                <label for="editFirstName">Vorname</label>
                <input type="text" id="editFirstName" name="first_name" value="${firstName}" required>
            </div>
            <div class="form-group">
                <label for="editLastName">Nachname</label>
                <input type="text" id="editLastName" name="last_name" value="${lastName}" required>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Speichern</button>
                <button type="button" class="btn btn-secondary" onclick="cancelEditProfile()">Abbrechen</button>
            </div>
        </form>
    `;

    const profileCard = document.querySelector('.profile-card');
    profileCard.innerHTML = formHTML;

    document.getElementById('editProfileForm').addEventListener('submit', saveProfileChanges);
}

/**
 * Save Profile Changes
 * Submit profile updates to API
 */
async function saveProfileChanges(e) {
    e.preventDefault();

    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;

    const result = await updatePatientProfile({
        first_name: firstName,
        last_name: lastName
    });

    if (result.success) {
        alert('Profil aktualisiert!');
        location.reload();
    } else {
        alert('Fehler beim Aktualisieren des Profils: ' + result.error);
    }
}

/**
 * Cancel Edit Profile
 * Reload profile without saving
 */
function cancelEditProfile() {
    location.reload();
}

/**
 * Change Password Handler
 */
function changePassword() {
    alert('Passwortänderung wird in einer zukünftigen Phase implementiert.');
}

/* ============================================
   API PREPARATION
   ============================================ */

/**
 * API Base Configuration
 * Later to be replaced with actual API endpoints
 */
const API_CONFIG = {
    // Later: https://api.milaphysio.de
    baseURL: '/api',

    // Later: Implement proper headers with authentication token
    getHeaders: function() {
        return {
            'Content-Type': 'application/json',
            // Later: 'Authorization': 'Bearer ' + getAuthToken()
        };
    },

    // API Endpoints (prepared for future implementation)
    endpoints: {
        login: '/auth/login',
        logout: '/auth/logout',
        getPatient: '/patients/:id',
        getAppointments: '/appointments',
        postAppointment: '/appointments',
        patchAppointment: '/appointments/:id',
        getExercises: '/exercises',
        patchExercises: '/exercises/:id',
        getProfile: '/profile'
    }
};

/**
 * Future API Call Template
 *
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {object} data - Request body data
 * @returns {Promise} API response
 */
async function apiCall(endpoint, method = 'GET', data = null) {
    // DEMO ONLY – Later to be implemented with actual API

    console.log('API Call prepared:', {
        endpoint: API_CONFIG.baseURL + endpoint,
        method: method,
        dataSize: data ? JSON.stringify(data).length : 0
    });

    // Placeholder for future implementation
    try {
        // Later: const response = await fetch(API_CONFIG.baseURL + endpoint, {
        //     method: method,
        //     headers: API_CONFIG.getHeaders(),
        //     body: data ? JSON.stringify(data) : null
        // });
        // return await response.json();

        return { status: 'demo', message: 'API not yet connected' };
    } catch (error) {
        console.error('API Error:', error);
        return { status: 'error', message: error.message };
    }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Format Date
 * Formats date to German locale
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

/**
 * Format DateTime
 * Formats date and time to German locale
 */
function formatDateTime(dateString, timeString) {
    try {
        let dateTime;
        if (timeString) {
            dateTime = new Date(dateString + 'T' + timeString);
        } else {
            dateTime = new Date(dateString);
        }

        return new Intl.DateTimeFormat('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(dateTime);
    } catch (error) {
        return dateString;
    }
}

/**
 * Get Time Until Appointment
 * Calculates time remaining until next appointment
 */
function getTimeUntilAppointment(appointmentDate) {
    const now = new Date();
    const appointment = new Date(appointmentDate);
    const difference = appointment - now;

    if (difference < 0) {
        return 'Vorbei';
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
        return days + ' Tag' + (days > 1 ? 'e' : '');
    } else if (hours > 0) {
        return hours + ' Stunde' + (hours > 1 ? 'n' : '');
    } else {
        return 'Heute';
    }
}

/* ============================================
   ERROR HANDLING
   ============================================ */

/**
 * Handle Error
 * Centralized error handling
 */
function handleError(error, context = 'Unknown') {
    console.error(`Error in ${context}:`, error);

    // DEMO ONLY – Later send to logging service
    // logError(error, context);

    // User-friendly error message
    alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
}

/* ============================================
   PAGE INITIALIZATION
   ============================================ */

// Initialize portal on page load
document.addEventListener('DOMContentLoaded', function() {
    initPortal();
});

/* ============================================
   MODAL MANAGEMENT
   ============================================ */

/**
 * Open New Appointment Modal
 * Shows modal for selecting appointment type
 */
function openNewAppointmentModal() {
    const modal = document.getElementById('newAppointmentModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close Modal
 * Closes any open modal
 */
function closeModal(modalId = 'newAppointmentModal') {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Close all modals
 * Utility function
 */
function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

/**
 * Handle New Appointment Choice
 * Redirect to appropriate booking page
 *
 * @param {string} type - Type of appointment (online or hausbesuch)
 */
function handleNewAppointmentChoice(type) {
    closeModal('newAppointmentModal');

    if (type === 'online') {
        // Relativer Link zu Preisseite für Online-Physiotherapie
        window.location.href = '../online-physiotherapie/#preise';
    } else if (type === 'hausbesuch') {
        // Relativer Link zu Preisseite für Hausbesuch
        window.location.href = '../hausbesuch/#preise';
    }
}

/**
 * Handle Reschedule Click
 * Opens reschedule link or shows message if not available
 *
 * @param {string} appointmentId - ID of appointment to reschedule
 */
function handleRescheduleClick(appointmentId) {
    // Find appointment
    const appointment = demoAppointments.find(a => a.id === appointmentId);

    if (!appointment) {
        console.error('Appointment not found:', appointmentId);
        return;
    }

    // Check if rescheduleUrl exists and is not empty
    if (appointment.rescheduleUrl && appointment.rescheduleUrl.trim() !== '') {
        // Open in new tab
        window.open(appointment.rescheduleUrl, '_blank');
    } else {
        // Show message modal
        showMessageModal(
            'Umbuchung nicht verfügbar',
            'Die Umbuchung dieses Termins ist derzeit nicht direkt im Patientenportal verfügbar. Bitte verwende den Umbuchungslink aus deiner Terminbestätigung oder kontaktiere Mila Physio.',
            'messageModal'
        );
    }
}

/**
 * Handle Join Meeting Click
 * Opens meeting URL or shows message if not available
 *
 * @param {string} appointmentId - ID of appointment
 */
function handleJoinMeetingClick(appointmentId) {
    // Find appointment
    const appointment = demoAppointments.find(a => a.id === appointmentId);

    if (!appointment) {
        console.error('Appointment not found:', appointmentId);
        return;
    }

    // Check if meetingUrl exists and is not empty
    if (appointment.meetingUrl && appointment.meetingUrl.trim() !== '') {
        // Open in new tab
        window.open(appointment.meetingUrl, '_blank');
    } else if (appointment.meetingUrl === null) {
        // Not applicable for this appointment type
        showMessageModal(
            'Nicht verfügbar',
            'Dies ist kein Online-Termin. Der Online-Link ist nicht anwendbar.',
            'messageModal'
        );
    } else {
        // Link not yet available
        showMessageModal(
            'Link nicht verfügbar',
            'Der Link zum Online-Termin ist derzeit noch nicht verfügbar.',
            'messageModal'
        );
    }
}

/**
 * Show Message Modal
 * Generic function to show a message in a modal
 *
 * @param {string} title - Modal title
 * @param {string} message - Message to display
 * @param {string} modalId - ID of modal
 */
function showMessageModal(title, message, modalId = 'messageModal') {
    // Create or update modal
    let modal = document.getElementById(modalId);

    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="closeModal('${modalId}')">Schließen</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        // Update existing modal
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-body p').textContent = message;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Setup Modal Event Listeners
 * Closes modal when clicking outside
 */
function setupModalListeners() {
    document.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal.active');

        modals.forEach(modal => {
            // Close if clicked outside modal content
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
}

/* ============================================
   SECURITY NOTES
   ============================================ */

/**
 * Show Appointment Info Modal
 * Displays organizational information about an appointment
 */
function showAppointmentInfo(appointmentId) {
    const appointment = demoAppointments.find(app => app.id === appointmentId);
    if (!appointment) return;

    const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
    const dateFormatter = new Intl.DateTimeFormat('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const content = `
        <div class="info-group">
            <p><strong>Terminart:</strong> ${appointment.type}</p>
            <p><strong>Datum:</strong> ${dateFormatter.format(appointmentDate)}</p>
            <p><strong>Uhrzeit:</strong> ${appointment.time}</p>
            <p><strong>Dauer:</strong> ${appointment.duration}</p>
            <p><strong>Therapeut:</strong> ${appointment.therapist}</p>
            ${appointment.location ? `<p><strong>Ort:</strong> ${appointment.location}</p>` : ''}
            <p><strong>Status:</strong> ${appointment.status}</p>
        </div>
    `;

    document.getElementById('appointmentInfoContent').innerHTML = content;
    document.getElementById('appointmentInfoModal').classList.add('active');
}

/* ============================================
   PAGE INITIALIZATION
   ============================================ */

// Initialize portal when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Setup logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, #mobileLogoutBtn, #logoutBtnMain');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', logoutPatient);
    });

    // Setup profile button
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            window.location.href = 'profil.html';
        });
    }

    // Setup menu button
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }

    // Initialize portal
    initPortal();
});

/*
 * SECURITY IMPLEMENTATION (Future):
 *
 * 1. SESSION MANAGEMENT:
 *    - Use secure HTTPOnly cookies for session tokens
 *    - Implement session timeout (15-30 minutes)
 *    - Verify session on each API request
 *
 * 2. AUTHENTICATION:
 *    - Use HTTPS only
 *    - Implement OAuth2 or JWT tokens
 *    - Never store passwords on client
 *    - Use bcrypt for password hashing on server
 *
 * 3. DATA PROTECTION:
 *    - Encrypt sensitive data in transit
 *    - Implement CSRF protection
 *    - Use Content Security Policy headers
 *    - Validate all inputs on server-side
 *
 * 4. API SECURITY:
 *    - Implement rate limiting
 *    - Use API authentication tokens
 *    - Verify user permissions on server
 *    - Log all access attempts
 *
 * 5. PRIVACY:
 *    - No medical data stored in localStorage
 *    - No passwords stored anywhere
 *    - GDPR compliance
 *    - Right to data deletion
 */