/**
 * Create a test therapist directly in the database
 */

const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const DATABASE_URL = 'postgresql://mila_user:mila_password_dev@localhost:5432/milaphysio_patientenportal';

const TEST_THERAPIST = {
    id: 'test-therapist-id-' + Date.now(),
    email: 'test-therapist@milaphysio.de',
    password: 'testpass123',
    first_name: 'Test',
    last_name: 'Therapist'
};

async function createTherapist() {
    const client = new Client({ connectionString: DATABASE_URL });

    try {
        await client.connect();
        console.log('✅ Connected to database');

        // Hash password
        const password_hash = await bcrypt.hash(TEST_THERAPIST.password, 10);
        console.log(`✅ Password hashed`);

        // Insert therapist
        const result = await client.query(
            `INSERT INTO therapists (id, email, password_hash, first_name, last_name, is_active)
             VALUES ($1, $2, $3, $4, $5, true)
             ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
             RETURNING id, email`,
            [TEST_THERAPIST.id, TEST_THERAPIST.email, password_hash, TEST_THERAPIST.first_name, TEST_THERAPIST.last_name]
        );

        if (result.rows.length > 0) {
            console.log(`✅ Therapist created/updated:`);
            console.log(`   Email: ${result.rows[0].email}`);
            console.log(`   Password: ${TEST_THERAPIST.password}`);
        }

        // Create a patient and assign to therapist
        const patientId = 'test-patient-id-' + Date.now();
        const patientResult = await client.query(
            `INSERT INTO patients (id, email, password_hash, first_name, last_name, date_of_birth, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, true)
             ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
             RETURNING id, email`,
            [patientId, 'test-patient@milaphysio.de', password_hash, 'Test', 'Patient', '1990-01-01']
        );

        if (patientResult.rows.length > 0) {
            console.log(`✅ Patient created/updated:`);
            console.log(`   Email: ${patientResult.rows[0].email}`);
            console.log(`   Password: testpass123`);

            // Assign patient to therapist
            await client.query(
                `INSERT INTO therapist_patients (therapist_id, patient_id, notes)
                 VALUES ($1, $2, 'Test assignment')
                 ON CONFLICT (therapist_id, patient_id) DO NOTHING`,
                [TEST_THERAPIST.id, patientResult.rows[0].id]
            );
            console.log(`✅ Patient assigned to therapist`);
        }

        console.log('\n✅ Test data ready for frontend tests\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

createTherapist();
