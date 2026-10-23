/* ============================================
   MILA PHYSIO - THERAPEUT PORTAL
   Complete Therapist Portal JavaScript
   ============================================ */

const API_BASE = 'https://api.milaphysio.de/api';

let currentSession = {
    isAuthenticated: false,
    therapistId: null,
    loginTime: null
};

/* ============================================
   SESSION MANAGEMENT
   ============================================ */

async function checkSession() {
    try {
        const response = await fetch(`${API_BASE}/therapist/auth/me`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            currentSession.isAuthenticated = true;
            currentSession.therapistId = data.data.id;
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

async function loginTherapist(email, password) {
    try {
        const response = await fetch(`${API_BASE}/therapist/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showAlert(data.error || 'Login fehlgeschlagen', 'error');
            return false;
        }

        currentSession.isAuthenticated = true;
        currentSession.therapistId = data.data.id;
        currentSession.loginTime = new Date().toISOString();

        window.location.href = 'index.html';
        return true;
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Ein Fehler ist bei der Anmeldung aufgetreten.', 'error');
        return false;
    }
}

async function logoutTherapist() {
    try {
        await fetch(`${API_BASE}/therapist/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        currentSession = { isAuthenticated: false, therapistId: null, loginTime: null };
        window.location.href = 'login.html';
    }
}

async function protectTherapistPage() {
    const isAuthenticated = await checkSession();
    if (!isAuthenticated && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

/* ============================================
   PATIENT MANAGEMENT
   ============================================ */

async function loadPatientList() {
    const container = document.getElementById('patientList');
    if (!container) return;

    try {
        showLoadingState(container);

        const response = await fetch(`${API_BASE}/therapist/patients`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load patients');

        const data = await response.json();
        const patients = data.data || [];

        if (patients.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">👥</div><p>Keine Patienten vorhanden</p></div>';
            return;
        }

        container.innerHTML = `
            <table class="patients-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Geburtsdatum</th>
                        <th>Kontakt</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    ${patients.map(p => `
                        <tr>
                            <td>${escapeHtml(p.first_name + ' ' + p.last_name)}</td>
                            <td>${formatDate(p.date_of_birth)}</td>
                            <td>${escapeHtml(p.email)}</td>
                            <td>
                                <button class="btn btn-primary btn-small" onclick="openPatientDetail('${p.id}')">Öffnen</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Load patients error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
        showAlert('Fehler beim Laden der Patientenliste.', 'error');
    }
}

async function loadPatientDetail(patientId) {
    try {
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load patient');

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Load patient detail error:', error);
        showAlert('Fehler beim Laden der Patientendaten.', 'error');
        return null;
    }
}

function openPatientDetail(patientId) {
    window.location.href = `patientenakte.html?id=${patientId}`;
}

async function loadMasterData(patientId) {
    try {
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/master-data`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load master data');

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Load master data error:', error);
        return null;
    }
}

async function saveMasterData(patientId, masterData) {
    try {
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/master-data`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(masterData)
        });

        if (!response.ok) throw new Error('Failed to save master data');

        showAlert('Stammdaten erfolgreich gespeichert.', 'success');
        return true;
    } catch (error) {
        console.error('Save master data error:', error);
        showAlert('Fehler beim Speichern der Stammdaten.', 'error');
        return false;
    }
}

/* ============================================
   APPOINTMENTS
   ============================================ */

async function loadAppointments(patientId) {
    const container = document.getElementById('appointmentsList');
    if (!container) return;

    try {
        showLoadingState(container);

        const response = await fetch(`${API_BASE}/therapist/appointments?patientId=${patientId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load appointments');

        const data = await response.json();
        const appointments = data.data || [];

        if (appointments.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Keine Termine vorhanden</p></div>';
            return;
        }

        container.innerHTML = `
            <table class="appointments-table">
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Uhrzeit</th>
                        <th>Typ</th>
                        <th>Status</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    ${appointments.map(a => `
                        <tr>
                            <td>${formatDate(a.start_time)}</td>
                            <td>${formatTime(a.start_time)}</td>
                            <td>${escapeHtml(a.type || 'Therapie')}</td>
                            <td><span class="status-badge status-${a.status}">${escapeHtml(a.status)}</span></td>
                            <td>
                                <button class="btn btn-secondary btn-small" onclick="rescheduleAppointment('${a.id}')">Verschieben</button>
                                <button class="btn btn-danger btn-small" onclick="cancelAppointment('${a.id}')">Absagen</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Load appointments error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

async function createAppointment(patientId, appointmentData) {
    try {
        const response = await fetch(`${API_BASE}/therapist/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ patientId, ...appointmentData })
        });

        if (!response.ok) throw new Error('Failed to create appointment');

        showAlert('Termin erfolgreich erstellt.', 'success');
        return true;
    } catch (error) {
        console.error('Create appointment error:', error);
        showAlert('Fehler beim Erstellen des Termins.', 'error');
        return false;
    }
}

async function cancelAppointment(appointmentId) {
    if (!confirm('Möchten Sie diesen Termin wirklich absagen?')) return;

    try {
        const response = await fetch(`${API_BASE}/therapist/appointments/${appointmentId}/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to cancel appointment');

        showAlert('Termin erfolgreich abgesagt.', 'success');
        location.reload();
    } catch (error) {
        console.error('Cancel appointment error:', error);
        showAlert('Fehler beim Absagen des Termins.', 'error');
    }
}

async function rescheduleAppointment(appointmentId) {
    const newDate = prompt('Neues Datum (YYYY-MM-DD):');
    if (!newDate) return;

    try {
        const response = await fetch(`${API_BASE}/therapist/appointments/${appointmentId}/reschedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ new_date: newDate })
        });

        if (!response.ok) throw new Error('Failed to reschedule appointment');

        showAlert('Termin erfolgreich verschoben.', 'success');
        location.reload();
    } catch (error) {
        console.error('Reschedule appointment error:', error);
        showAlert('Fehler beim Verschieben des Termins.', 'error');
    }
}

/* ============================================
   PRESCRIPTIONS
   ============================================ */

async function loadPrescriptions(patientId) {
    const container = document.getElementById('prescriptionsList');
    if (!container) return;

    try {
        showLoadingState(container);

        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/prescriptions`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load prescriptions');

        const data = await response.json();
        const prescriptions = data.data || [];

        if (prescriptions.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Keine Verordnungen vorhanden</p></div>';
            return;
        }

        container.innerHTML = `
            <div class="prescriptions-list">
                ${prescriptions.map(p => `
                    <div class="card">
                        <h3>${escapeHtml(p.name || 'Verordnung')}</h3>
                        <p>Status: <span class="status-badge">${escapeHtml(p.status)}</span></p>
                        <button class="btn btn-primary btn-small" onclick="openPrescription('${p.id}')">Details</button>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Load prescriptions error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

function openPrescription(prescriptionId) {
    alert('Prescription detail coming soon');
}

/* ============================================
   CLINICAL DOCUMENTATION
   ============================================ */

async function loadAnamnesis(patientId) {
    const container = document.getElementById('anamnesisContent');
    if (!container) return;

    try {
        showLoadingState(container);
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/anamnesis`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok && response.status !== 404) throw new Error('Failed to load anamnesis');

        const data = await response.json();
        const anamnesis = data.data || {};

        container.innerHTML = `
            <form id="anamnesisForm" style="display: grid; gap: 1.5rem;">
                <div class="form-group">
                    <label>Patientenwunsch / Befunderhebung</label>
                    <textarea id="patientRequest" class="form-input" rows="4">${escapeHtml(anamnesis.patient_request || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>Allgemeine Anamnese</label>
                    <textarea id="generalAnamnesis" class="form-input" rows="4">${escapeHtml(anamnesis.general_anamnesis || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>Soziale Anamnese</label>
                    <textarea id="socialAnamnesis" class="form-input" rows="4">${escapeHtml(anamnesis.social_anamnesis || '')}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </form>
        `;

        document.getElementById('anamnesisForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveAnamnesis(patientId);
        });
    } catch (error) {
        console.error('Load anamnesis error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

async function saveAnamnesis(patientId) {
    try {
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/anamnesis`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                patient_request: document.getElementById('patientRequest')?.value,
                general_anamnesis: document.getElementById('generalAnamnesis')?.value,
                social_anamnesis: document.getElementById('socialAnamnesis')?.value
            })
        });

        if (!response.ok) throw new Error('Failed to save anamnesis');

        showAlert('Anamnese erfolgreich gespeichert.', 'success');
    } catch (error) {
        console.error('Save anamnesis error:', error);
        showAlert('Fehler beim Speichern der Anamnese.', 'error');
    }
}

async function loadFindings(patientId) {
    const container = document.getElementById('findingsContent');
    if (!container) return;

    try {
        showLoadingState(container);
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/findings`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok && response.status !== 404) throw new Error('Failed to load findings');

        const data = await response.json();
        const findings = (data.data || [])[0] || {};

        container.innerHTML = `
            <form id="findingsForm" style="display: grid; gap: 1.5rem;">
                <div class="form-group">
                    <label>Inspektion</label>
                    <textarea id="inspection" class="form-input" rows="4">${escapeHtml(findings.inspection || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>Palpation</label>
                    <textarea id="palpation" class="form-input" rows="4">${escapeHtml(findings.palpation || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>Funktionsprüfung</label>
                    <textarea id="functionalTest" class="form-input" rows="4">${escapeHtml(findings.functional_test || '')}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </form>
        `;

        document.getElementById('findingsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveFinding(patientId);
        });
    } catch (error) {
        console.error('Load findings error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

async function saveFinding(patientId) {
    try {
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/findings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                inspection: document.getElementById('inspection')?.value,
                palpation: document.getElementById('palpation')?.value,
                functional_test: document.getElementById('functionalTest')?.value
            })
        });

        if (!response.ok) throw new Error('Failed to save finding');

        showAlert('Befund erfolgreich gespeichert.', 'success');
    } catch (error) {
        console.error('Save finding error:', error);
        showAlert('Fehler beim Speichern des Befunds.', 'error');
    }
}

async function loadDiagnosis(patientId) {
    const container = document.getElementById('diagnosisContent');
    if (!container) return;

    try {
        showLoadingState(container);
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/diagnoses`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok && response.status !== 404) throw new Error('Failed to load diagnosis');

        const data = await response.json();
        const diagnosis = (data.data || [])[0] || {};

        container.innerHTML = `
            <form id="diagnosisForm" style="display: grid; gap: 1.5rem;">
                <div class="form-group">
                    <label>Verdachtsdiagnose</label>
                    <textarea id="suspectedDiagnosis" class="form-input" rows="4">${escapeHtml(diagnosis.suspected_diagnosis || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>Differential-Diagnosen</label>
                    <textarea id="differentialDiagnosis" class="form-input" rows="4">${escapeHtml(diagnosis.differential_diagnosis || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>Therapeutische Hypothese</label>
                    <textarea id="therapeuticHypothesis" class="form-input" rows="4">${escapeHtml(diagnosis.therapeutic_hypothesis || '')}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </form>
        `;

        document.getElementById('diagnosisForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveDiagnosis(patientId);
        });
    } catch (error) {
        console.error('Load diagnosis error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

async function saveDiagnosis(patientId) {
    try {
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/diagnoses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                suspected_diagnosis: document.getElementById('suspectedDiagnosis')?.value,
                differential_diagnosis: document.getElementById('differentialDiagnosis')?.value,
                therapeutic_hypothesis: document.getElementById('therapeuticHypothesis')?.value
            })
        });

        if (!response.ok) throw new Error('Failed to save diagnosis');

        showAlert('Diagnose erfolgreich gespeichert.', 'success');
    } catch (error) {
        console.error('Save diagnosis error:', error);
        showAlert('Fehler beim Speichern der Diagnose.', 'error');
    }
}

async function loadTherapyGoals(patientId) {
    const container = document.getElementById('goalsContent');
    if (!container) return;

    try {
        showLoadingState(container);
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/goals`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok && response.status !== 404) throw new Error('Failed to load goals');

        const data = await response.json();
        const goals = (data.data || [])[0] || {};

        container.innerHTML = `
            <form id="goalsForm" style="display: grid; gap: 1.5rem;">
                <div class="form-group">
                    <label>Mittelfristige Therapieziele (4-6 Wochen)</label>
                    <textarea id="mediumTermGoals" class="form-input" rows="4">${escapeHtml(goals.medium_term_goals || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>Kurzfristige Therapieziele (1-2 Wochen)</label>
                    <textarea id="shortTermGoals" class="form-input" rows="4">${escapeHtml(goals.short_term_goals || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>Patientenziele</label>
                    <textarea id="patientGoals" class="form-input" rows="4">${escapeHtml(goals.patient_goals || '')}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </form>
        `;

        document.getElementById('goalsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveGoals(patientId);
        });
    } catch (error) {
        console.error('Load goals error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

async function saveGoals(patientId) {
    try {
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/goals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                medium_term_goals: document.getElementById('mediumTermGoals')?.value,
                short_term_goals: document.getElementById('shortTermGoals')?.value,
                patient_goals: document.getElementById('patientGoals')?.value
            })
        });

        if (!response.ok) throw new Error('Failed to save goals');

        showAlert('Therapieziele erfolgreich gespeichert.', 'success');
    } catch (error) {
        console.error('Save goals error:', error);
        showAlert('Fehler beim Speichern der Therapieziele.', 'error');
    }
}

async function loadTreatmentDocumentation(patientId) {
    const container = document.getElementById('treatmentContent');
    if (!container) return;

    try {
        showLoadingState(container);
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/treatments`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok && response.status !== 404) throw new Error('Failed to load treatment');

        const data = await response.json();
        const treatment = (data.data || [])[0] || {};

        container.innerHTML = `
            <form id="treatmentForm" style="display: grid; gap: 1.5rem;">
                <div class="form-group">
                    <label>Therapieinhalte</label>
                    <textarea id="treatmentContent" class="form-input" rows="4">${escapeHtml(treatment.treatment_content || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>Patientenverhalten</label>
                    <textarea id="patientBehavior" class="form-input" rows="4">${escapeHtml(treatment.patient_behavior || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>Therapiefortschritt</label>
                    <textarea id="treatmentProgress" class="form-input" rows="4">${escapeHtml(treatment.treatment_progress || '')}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </form>
        `;

        document.getElementById('treatmentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveTreatment(patientId);
        });
    } catch (error) {
        console.error('Load treatment error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

async function saveTreatment(patientId) {
    try {
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/treatments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                treatment_content: document.getElementById('treatmentContent')?.value,
                patient_behavior: document.getElementById('patientBehavior')?.value,
                treatment_progress: document.getElementById('treatmentProgress')?.value
            })
        });

        if (!response.ok) throw new Error('Failed to save treatment');

        showAlert('Behandlungsdokumentation erfolgreich gespeichert.', 'success');
    } catch (error) {
        console.error('Save treatment error:', error);
        showAlert('Fehler beim Speichern der Behandlungsdokumentation.', 'error');
    }
}

/* ============================================
   VOICE & AI
   ============================================ */

async function loadVoiceDrafts(patientId) {
    const container = document.getElementById('voiceContent');
    if (!container) return;

    try {
        showLoadingState(container);
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/voice-drafts`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok && response.status !== 404) throw new Error('Failed to load voice drafts');

        const data = await response.json();
        const drafts = data.data || [];

        if (drafts.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Keine Voice-Drafts vorhanden</p></div>';
            return;
        }

        container.innerHTML = `
            <div style="display: grid; gap: 1rem;">
                ${drafts.map(d => `
                    <div class="card" style="padding: 1rem;">
                        <h4>${formatDate(d.created_at)}</h4>
                        <p>Status: ${escapeHtml(d.status)}</p>
                        <button class="btn btn-primary btn-small" onclick="reviewVoiceDraft('${d.id}')">Ansehen</button>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Load voice drafts error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

async function reviewVoiceDraft(draftId) {
    showAlert('Voice-Draft Review wird geladen...', 'info');
}

async function loadAIReview(patientId) {
    const container = document.getElementById('aiContent');
    if (!container) return;

    try {
        showLoadingState(container);
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/ai-results`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok && response.status !== 404) throw new Error('Failed to load AI reviews');

        const data = await response.json();
        const reviews = data.data || [];

        if (reviews.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Keine AI-Reviews vorhanden</p></div>';
            return;
        }

        container.innerHTML = `
            <div style="display: grid; gap: 1rem;">
                ${reviews.map(r => `
                    <div class="card" style="padding: 1rem;">
                        <h4>${formatDate(r.created_at)}</h4>
                        <p>Status: ${escapeHtml(r.status)}</p>
                        <p style="color: var(--text-light);">${escapeHtml(r.summary || 'Zusammenfassung wird generiert...')}</p>
                        <button class="btn btn-primary btn-small" onclick="viewAIReview('${r.id}')">Details</button>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Load AI reviews error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

function viewAIReview(reviewId) {
    showAlert('AI-Review Details werden geladen...', 'info');
}

/* ============================================
   DOCUMENTS
   ============================================ */

async function loadDocuments(patientId) {
    const container = document.getElementById('documentsList');
    if (!container) return;

    try {
        showLoadingState(container);
        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/documents`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok && response.status !== 404) throw new Error('Failed to load documents');

        const data = await response.json();
        const documents = data.data || [];

        if (documents.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Keine Dokumente vorhanden</p></div>';
            return;
        }

        container.innerHTML = `
            <div style="display: grid; gap: 1rem;">
                ${documents.map(doc => `
                    <div class="card" style="padding: 1rem;">
                        <h4>${escapeHtml(doc.document_type === 'BEHANDLUNGSVEREINBARUNG' ? 'Behandlungsvereinbarung' : 'Datenschutz')}</h4>
                        <p>Version: ${escapeHtml(doc.document_version)}</p>
                        <p>Status: <span class="status-badge">${escapeHtml(doc.acceptance_status)}</span></p>
                        ${doc.accepted_at ? `<p>Akzeptiert am: ${formatDate(doc.accepted_at)}</p>` : '<p style="color: var(--text-light);">Noch nicht akzeptiert</p>'}
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Load documents error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

/* ============================================
   EXERCISES
   ============================================ */

async function loadExercises(patientId) {
    const container = document.getElementById('exercisesList');
    if (!container) return;

    try {
        showLoadingState(container);
        const response = await fetch(`${API_BASE}/exercises?patientId=${patientId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok && response.status !== 404) throw new Error('Failed to load exercises');

        const data = await response.json();
        const exercises = data.data || [];

        if (exercises.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Keine Übungen zugewiesen</p></div>';
            return;
        }

        container.innerHTML = `
            <div style="display: grid; gap: 1rem;">
                ${exercises.map(exercise => `
                    <div class="card" style="padding: 1rem;">
                        <h4>${escapeHtml(exercise.title)}</h4>
                        ${exercise.description ? `<p>${escapeHtml(exercise.description)}</p>` : ''}
                        ${exercise.instructions ? `<p><strong>Anweisungen:</strong> ${escapeHtml(exercise.instructions)}</p>` : ''}
                        ${exercise.category ? `<p><strong>Kategorie:</strong> ${escapeHtml(exercise.category)}</p>` : ''}
                        ${exercise.sets_or_reps ? `<p><strong>Sätze/Wiederholungen:</strong> ${escapeHtml(exercise.sets_or_reps)}</p>` : ''}
                        ${exercise.frequency ? `<p><strong>Häufigkeit:</strong> ${escapeHtml(exercise.frequency)}</p>` : ''}
                        ${exercise.duration_minutes ? `<p><strong>Dauer:</strong> ${exercise.duration_minutes} Minuten</p>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Load exercises error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

async function createExercise(patientId, exerciseData) {
    try {
        const response = await fetch(`${API_BASE}/exercises`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                ...exerciseData,
                patient_id: patientId
            })
        });

        if (!response.ok) throw new Error('Failed to create exercise');

        showAlert('Übung erfolgreich zugewiesen.', 'success');
        return true;
    } catch (error) {
        console.error('Create exercise error:', error);
        showAlert('Fehler beim Zuweisen der Übung.', 'error');
        return false;
    }
}

/* ============================================
   BILLING
   ============================================ */

async function loadInvoices(patientId) {
    const container = document.getElementById('invoicesList');
    if (!container) return;

    try {
        showLoadingState(container);

        const response = await fetch(`${API_BASE}/therapist/patients/${patientId}/invoices`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load invoices');

        const data = await response.json();
        const invoices = data.data || [];

        if (invoices.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Keine Rechnungen vorhanden</p></div>';
            return;
        }

        container.innerHTML = `
            <table class="invoices-table">
                <thead>
                    <tr>
                        <th>Rechnungsnummer</th>
                        <th>Datum</th>
                        <th>Betrag</th>
                        <th>Status</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoices.map(i => `
                        <tr>
                            <td>${escapeHtml(i.invoice_number)}</td>
                            <td>${formatDate(i.issue_date)}</td>
                            <td>${(i.total_cents / 100).toFixed(2)}€</td>
                            <td><span class="status-badge status-${i.status}">${escapeHtml(i.status)}</span></td>
                            <td>
                                <button class="btn btn-primary btn-small" onclick="downloadInvoicePDF('${i.id}')">PDF</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Load invoices error:', error);
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

async function downloadInvoicePDF(invoiceId) {
    try {
        window.location.href = `${API_BASE}/therapist/invoices/${invoiceId}/pdf`;
    } catch (error) {
        console.error('Download PDF error:', error);
        showAlert('Fehler beim Download der PDF.', 'error');
    }
}

/* ============================================
   PRICE MANAGEMENT (existing functionality)
   ============================================ */

async function loadPriceCatalogue() {
    const catalogueContainer = document.getElementById('priceCatalogue');
    if (!catalogueContainer) return;

    try {
        showLoadingState(catalogueContainer);

        const response = await fetch(`${API_BASE}/therapist/prices/catalogue`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load price catalogue');

        const data = await response.json();
        const catalogue = data.data.catalogue;

        if (!catalogue || catalogue.length === 0) {
            catalogueContainer.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><p>Keine Preise verfügbar</p></div>';
            return;
        }

        catalogueContainer.innerHTML = catalogue.map(price => `
            <div class="price-card">
                <div class="price-card-header">
                    <h3 class="price-card-title">${escapeHtml(price.name)}</h3>
                    <span class="price-badge">Hausbesuch</span>
                </div>

                <div class="price-amount">${price.priceEur} €</div>

                <div class="price-details">
                    <div class="detail-row">
                        <span class="detail-label">Leistung:</span>
                        <span class="detail-value">${escapeHtml(price.description || price.name)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Gültig ab:</span>
                        <span class="detail-value">${formatDate(price.validFrom)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Dauer:</span>
                        <span class="detail-value">${price.durationMinutes} Min.</span>
                    </div>
                </div>

                <div class="price-actions">
                    <button class="btn btn-secondary btn-small" onclick="showPriceHistory('${price.code}')">Preisverlauf</button>
                    <button class="btn btn-primary btn-small" onclick="showNewVersionModal('${price.code}', '${price.name}')">Neue Version</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Load price catalogue error:', error);
        catalogueContainer.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden der Preise</p></div>';
        showAlert('Fehler beim Laden der Preiskatalog.', 'error');
    }
}

async function showPriceHistory(serviceCode) {
    const modal = document.getElementById('priceHistoryModal');
    const historyContainer = document.getElementById('priceHistoryTable');
    if (!modal || !historyContainer) return;

    try {
        showLoadingState(historyContainer);
        modal.classList.add('show');

        const response = await fetch(`${API_BASE}/therapist/prices/history/${encodeURIComponent(serviceCode)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load price history');

        const data = await response.json();
        const history = data.data.history;

        if (!history || history.length === 0) {
            historyContainer.innerHTML = '<div class="empty-state"><p>Keine Versionshistorie verfügbar</p></div>';
            return;
        }

        historyContainer.innerHTML = `
            <div class="price-history">
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Preis</th>
                            <th>Gültig ab</th>
                            <th>Gültig bis</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${history.map(h => `
                            <tr>
                                <td>${h.priceEur} €</td>
                                <td>${formatDate(h.validFrom)}</td>
                                <td>${h.validUntil ? formatDate(h.validUntil) : 'Laufend'}</td>
                                <td><span class="status-badge ${h.active ? 'status-active' : 'status-inactive'}">${h.active ? 'Aktiv' : 'Inaktiv'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Load price history error:', error);
        historyContainer.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Fehler beim Laden</p></div>';
    }
}

function showNewVersionModal(serviceCode, serviceName) {
    const modal = document.getElementById('newVersionModal');
    if (!modal) return;

    document.getElementById('newVersionServiceCode').value = serviceCode;
    document.getElementById('newVersionServiceName').textContent = serviceName;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('newVersionValidFrom').value = formatDateForInput(tomorrow);
    document.getElementById('newVersionPrice').value = '';

    modal.classList.add('show');
}

async function submitNewVersion() {
    const serviceCode = document.getElementById('newVersionServiceCode').value;
    const priceCents = parseInt(document.getElementById('newVersionPrice').value) * 100;
    const validFrom = document.getElementById('newVersionValidFrom').value;

    if (!serviceCode || !priceCents || priceCents <= 0 || !validFrom) {
        showAlert('Bitte alle erforderlichen Felder ausfüllen.', 'error');
        return;
    }

    try {
        const button = event.target;
        button.disabled = true;
        button.textContent = 'Wird gespeichert...';

        const response = await fetch(`${API_BASE}/therapist/prices/new-version`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                serviceCode,
                priceCents,
                validFrom: new Date(validFrom).toISOString().split('T')[0]
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to create new price version');

        showAlert(`Neue Preisversion erstellt: ${(priceCents/100).toFixed(2)} € gültig ab ${formatDate(validFrom)}`, 'success');
        closeModal('newVersionModal');
        await loadPriceCatalogue();
    } catch (error) {
        console.error('Submit new version error:', error);
        showAlert('Fehler beim Erstellen der neuen Preisversion.', 'error');
    } finally {
        const button = event.target;
        button.disabled = false;
        button.textContent = 'Speichern';
    }
}

/* ============================================
   INITIALIZATION
   ============================================ */

async function initTherapistPortal() {
    console.log('Therapist portal initialized');
    await protectTherapistPage();
    await loadPortalData();
}

async function loadPortalData() {
    const path = window.location.pathname;

    if (path.includes('patienten.html')) {
        await loadPatientList();
    } else if (path.includes('patientenakte.html')) {
        const params = new URLSearchParams(window.location.search);
        const patientId = params.get('id');
        if (patientId) {
            const patient = await loadPatientDetail(patientId);
            if (patient) {
                document.getElementById('patientName').textContent = `${patient.first_name} ${patient.last_name}`;
                await loadAppointments(patientId);
                await loadPrescriptions(patientId);
                await loadInvoices(patientId);
            }
        }
    } else if (path.includes('preisverwaltung.html')) {
        await loadPriceCatalogue();
    }
}

/* ============================================
   UI HELPERS
   ============================================ */

function showAlert(message, type = 'info') {
    const alertsContainer = document.getElementById('alertsContainer');
    if (!alertsContainer) return;

    const alertId = 'alert-' + Date.now();
    const alert = document.createElement('div');
    alert.id = alertId;
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${escapeHtml(message)}</span>
        <button class="alert-close" onclick="closeAlert('${alertId}')">×</button>
    `;

    alertsContainer.appendChild(alert);
    setTimeout(() => closeAlert(alertId), 5000);
}

function closeAlert(alertId) {
    const alert = document.getElementById(alertId);
    if (alert) alert.remove();
}

function showLoadingState(container) {
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Wird geladen...</p></div>';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function formatTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(date);
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/* ============================================
   EVENT LISTENERS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const profileBtn = document.getElementById('profileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.toggle('show');
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            alert('Profilfunktion kommt bald...');
        });
    }

    if (logoutBtn) logoutBtn.addEventListener('click', logoutTherapist);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', logoutTherapist);

    // Modal handlers
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Form handlers
    const newVersionForm = document.getElementById('newVersionForm');
    if (newVersionForm) {
        newVersionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitNewVersion();
        });
    }

    // Initialize portal on protected pages
    const isLoginPage = window.location.pathname.includes('login.html');
    if (!isLoginPage) {
        initTherapistPortal();
    }
});

// Login form handler
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginTherapist(email, password);
}
