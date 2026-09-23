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
function initPortal() {
    // DEMO ONLY – später durch sichere API ersetzen
    console.log('Portal initialized');
    checkSession();
}

/**
 * Check Session Status
 * Verifies if user is logged in
 */
function checkSession() {
    // DEMO ONLY – später durch sichere API ersetzen
    const sessionId = sessionStorage.getItem('mila_portal_session');

    if (sessionId) {
        currentSession.isAuthenticated = true;
        currentSession.patientId = sessionId;
        currentSession.loginTime = sessionStorage.getItem('mila_portal_login_time');
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
 * Logout Patient
 * Clears session and redirects to login
 */
function logoutPatient() {
    // DEMO ONLY – später durch sichere API ersetzen

    // Clear session storage
    sessionStorage.removeItem('mila_portal_session');
    sessionStorage.removeItem('mila_portal_login_time');

    // Clear in-memory session
    currentSession = {
        isAuthenticated: false,
        patientId: null,
        loginTime: null
    };

    // Redirect to login
    window.location.href = 'login.html';
}

/**
 * Protect Patient Page
 * Redirect to login if not authenticated
 */
function protectPatientPage() {
    // DEMO ONLY – später durch sichere API ersetzen
    // In production: Verify session with secure API

    checkSession();

    if (!currentSession.isAuthenticated) {
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
 * Load Patient Data
 * Retrieves patient information
 */
function loadPatient() {
    // DEMO ONLY – später durch sichere API ersetzen
    // API Call would be:
    // fetch('/api/patients/' + currentSession.patientId)
    //     .then(response => response.json())
    //     .then(data => { /* use data */ })

    return demoPatient;
}

/**
 * Load Appointments
 * Retrieves all patient appointments
 */
function loadAppointments() {
    // DEMO ONLY – später durch sichere API ersetzen
    // API Call would be:
    // fetch('/api/appointments?patientId=' + currentSession.patientId)
    //     .then(response => response.json())
    //     .then(data => { /* use data */ })

    return demoAppointments;
}

/**
 * Load Exercises
 * Retrieves patient exercise plan
 */
function loadExercises() {
    // DEMO ONLY – später durch sichere API ersetzen
    // API Call would be:
    // fetch('/api/exercises?patientId=' + currentSession.patientId)
    //     .then(response => response.json())
    //     .then(data => { /* use data */ })

    return demoExercises;
}

/**
 * Load Profile Data
 * Retrieves patient profile information
 */
function loadProfile() {
    // DEMO ONLY – später durch sichere API ersetzen
    return demoPatient;
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
    const dateTime = new Date(dateString + 'T' + timeString);
    return new Intl.DateTimeFormat('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(dateTime);
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