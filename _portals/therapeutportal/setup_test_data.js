/**
 * Setup test data for frontend integration tests
 * Creates therapist and patient records that don't get cleaned up
 */

const API_BASE = 'http://localhost:3000/api';

const TEST_THERAPIST_EMAIL = 'test-therapist@milaphysio.de';
const TEST_THERAPIST_PASSWORD = 'testpass123';
const TEST_PATIENT_EMAIL = 'test-patient@milaphysio.de';
const TEST_PATIENT_PASSWORD = 'patientpass123';

async function setupTestData() {
    console.log('🔧 Setting up test data...\n');

    try {
        // Create therapist
        console.log('📝 Creating test therapist...');
        const therapistResponse = await fetch(`${API_BASE}/therapist/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_THERAPIST_EMAIL,
                password: TEST_THERAPIST_PASSWORD,
                first_name: 'Test',
                last_name: 'Therapist'
            })
        });

        if (therapistResponse.status === 409) {
            console.log('✅ Therapist already exists');
        } else if (therapistResponse.ok) {
            console.log('✅ Therapist created');
        } else {
            const error = await therapistResponse.json();
            console.log(`⚠️  Therapist creation: ${error.error}`);
        }

        // Create patient
        console.log('📝 Creating test patient...');
        const patientResponse = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_PATIENT_EMAIL,
                password: TEST_PATIENT_PASSWORD,
                first_name: 'Test',
                last_name: 'Patient',
                date_of_birth: '1990-01-01'
            })
        });

        if (patientResponse.status === 409) {
            console.log('✅ Patient already exists');
        } else if (patientResponse.ok) {
            console.log('✅ Patient created');
        } else {
            const error = await patientResponse.json();
            console.log(`⚠️  Patient creation: ${error.error}`);
        }

        console.log('\n✅ Test data setup complete\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Setup error:', error.message);
        process.exit(1);
    }
}

setupTestData();
