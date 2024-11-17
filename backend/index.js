import express from 'express';
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
host:"medical-clinic-database.mysql.database.azure.com", 
user:"group8", 
password:"Abcd1234", 
database:"medical_clinic_database", 
port:3306, 
});

app.use(express.json());
app.use(cors());
  

app.get('/', (req, res) => {
    res.status(200).json("Hello this is mr.backend! 乁( ⁰͡ Ĺ̯ ⁰͡ ) ㄏ");
});

app.get('/ping', (req, res) => {
    res.status(200).send("I'm still alive!");
});

// Login route
app.post("/login", (req, res) => {
    const { ID, password } = req.body;
    const q1 = "SELECT * FROM employee WHERE employee_ID = ?";
    const q2 = "SELECT * FROM patient WHERE Medical_ID = ?";
    const q3 = "SELECT * FROM employee_password WHERE employee_ID = ?";
    const q4 = "SELECT * FROM patient_password WHERE medical_ID = ?";

    if (!ID || !password) {
        return res.status(400).json({ message: "ID and password are required." });
    }

    const firstLetter = ID.charAt(0); // Get the first letter
    if (firstLetter === 'E') {
        db.query(q1, [ID], (err, data) => {
            if (err) {
                console.error(err);
                return res.json(err);
            }
            if (data.length > 0) {
                db.query(q3, [ID], (err, passData) => {
                    if (err) {
                        console.error(err);
                        return res.json(err);
                    }
                    if (passData.length > 0) {
                        if (passData[0].password === password) {
                            return res.json(data[0]); // Return employee data
                        } else {
                            return res.json("Password incorrect");
                        }
                    } else {
                        return res.json("Password record not found");
                    }
                });
            } else {
                return res.json("Employee not found");
            }
        });
    } else if (firstLetter === 'M') {
        db.query(q2, [ID], (err, data) => {
            if (err) {
                console.error(err);
                return res.json(err);
            }
            if (data.length > 0) {
                db.query(q4, [ID], (err, passData) => {
                    if (err) {
                        console.error(err);
                        return res.json(err);
                    }
                    if (passData.length > 0) {
                        if (passData[0].password === password) {
                            return res.json(data[0]); // Return patient data
                        } else {
                            return res.json("Password incorrect" );
                        }
                    } else {
                        return res.json("Password not found" );
                    }
                });
            } else {
                return res.json("Patient not found" );
            }
        });
    } else {
        return res.json("ID must start with 'E' or 'M'");
    }
});

// Get doctors
app.get("/doctors", (req, res) => {
    const q = "SELECT * FROM doctors";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// Get doctor by employee_ID
app.get("/doctors/:employee_ID", (req, res) => {
    const employee_id = req.params.employee_ID;
    const q = "SELECT * FROM doctors WHERE employee_ID = ?";
    
    db.query(q, [employee_id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("Doctor not found.");
        
        return res.json(data[0]); // Return the doctor data
    });
});


// Create doctor
app.post("/doctors", (req, res) => {
    console.log(req.body);
    
    const q1 = "INSERT INTO employee (employee_ID, first_name, last_name, role) VALUES (?, ?, ?, 'Doctor')";
    const employeeValues = [
        req.body.employee_ID,
        req.body.first_name,
        req.body.last_name
    ];

    const q2 = "INSERT INTO doctors (employee_ID, specialty, first_name, last_name, phone_number, work_address, created, last_edited) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const doctorValues = [
        req.body.employee_ID,
        req.body.specialty,
        req.body.first_name,
        req.body.last_name,
        req.body.phone_number,
        req.body.work_address,
        req.body.created,
        req.body.created
    ];

    // Create a schedule ID (you might want to implement a better ID generation)
    const schedule_ID = req.body.employee_ID; // or generate a new one if necessary

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current date for last_edited
    const q3 = "INSERT INTO employee_schedule_location (schedule_ID, mon_avail, tues_avail, wed_avail, thurs_avail, fri_avail, working_time, created, creatorID, last_edited, last_editedID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const scheduleValues = [
        schedule_ID,
        req.body.availabilityMon,
        req.body.availabilityTues,
        req.body.availabilityWed,
        req.body.availabilityThurs,
        req.body.availabilityFri,
        "9 AM - 5 PM", // Set working_time
        req.body.created,
        req.body.employee_ID, // Assuming the creatorID is the employee's ID
        currentDate, // Set last_edited to current date
        req.body.employee_ID // Assuming the last_editedID is also the employee's ID
    ];

    db.query(q1, employeeValues, (err) => {
        if (err) {
            return res.status(500).json({ error: "Error inserting into employee table", details: err });
        }

        db.query(q2, doctorValues, (err) => {
            if (err) {
                return res.status(500).json({ error: "Error inserting into doctors table", details: err });
            }

            db.query(q3, scheduleValues, (err) => {
                if (err) {
                    return res.status(500).json({ error: "Error inserting into employee_schedule_location table", details: err });
                }
                return res.json("A doctor has been created successfully!");
            });
        });
    });
});


// Update doctor
app.put("/doctors/:employee_ID", (req, res) => {
    const employee_id = req.params.employee_ID;
    const q1 = "UPDATE doctors SET specialty = ?, first_name = ?, last_name = ?, phone_number = ?, work_address = ? WHERE employee_ID = ?";
    const q2 = "UPDATE employee SET first_name = ?, last_name = ? WHERE employee_ID = ?";
    
    const values = [
        req.body.specialty,
        req.body.first_name,
        req.body.last_name,
        req.body.phone_number,
        req.body.work_address,
        employee_id
    ];

    db.query(q1, values, (err) => {
        if (err) return res.status(500).json(err);

        const employeeValues = [
            req.body.first_name,
            req.body.last_name,
            employee_id
        ];

        db.query(q2, employeeValues, (err) => {
            if (err) return res.status(500).json(err);
            return res.json("Doctor and employee have been updated!");
        });
    });
});

// Delete Doctor and Clear Schedule
app.delete("/doctors/:employee_ID", (req, res) => {
    const employee_ID = req.params.employee_ID;
    
    const q1 = "DELETE FROM doctors WHERE employee_ID = ?";
    const q2 = "DELETE FROM employee WHERE employee_ID = ?";
    const q3 = "DELETE FROM employee_schedule_location WHERE schedule_ID = ?"; // Assuming schedule_ID is the same as employee_ID

    db.query(q1, [employee_ID], (err) => {
        if (err) return res.status(500).json(err);

        db.query(q2, [employee_ID], (err) => {
            if (err) return res.status(500).json(err);

            db.query(q3, [employee_ID], (err) => {
                if (err) return res.status(500).json(err);
                return res.json("Doctor and associated schedule have been deleted!");
            });
        });
    });
});
// Create Office Staff
app.post("/staff/officestaff", (req, res) => {
    const { employee_ID, first_name, last_name, phone_number, email, address, manager, created, creatorID } = req.body;

    const defaultAvailability = 'all day'; // Default availability

    const q1 = "INSERT INTO employee (employee_ID, first_name, last_name, role) VALUES (?, ?, ?, 'OfficeStaff')";
    const employeeValues = [employee_ID, first_name, last_name];

    const q2 = "INSERT INTO officestaff (employee_ID, first_name, last_name, phone_number, email, address, manager, availabilityMon, availabilityTues, availabilityWed, availabilityThurs, availabilityFri, created, creatorID, last_edited) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const staffValues = [
        employee_ID,
        first_name,
        last_name,
        phone_number,
        email,
        address,
        manager,
        defaultAvailability, // Set availability to 'all day'
        defaultAvailability,
        defaultAvailability,
        defaultAvailability,
        defaultAvailability,
        created,
        creatorID,
        created
    ];

    db.query(q1, employeeValues, (err) => {
        if (err) {
            return res.status(500).json({ error: "Error inserting into employee table", details: err });
        }

        db.query(q2, staffValues, (err) => {
            if (err) {
                return res.status(500).json({ error: "Error inserting into officestaff table", details: err });
            }
            return res.json("An Office Staff member has been created successfully!");
        });
    });
});

// Create Billing Staff
app.post("/staff/billingstaff", (req, res) => {
    const { employee_ID, first_name, last_name, phone_number, email, work_address, created, creatorID } = req.body;

    const defaultAvailability = 'all day'; // Default availability

    const q1 = "INSERT INTO employee (employee_ID, first_name, last_name, role) VALUES (?, ?, ?, 'BillingStaff')";
    const employeeValues = [employee_ID, first_name, last_name];

    const q2 = "INSERT INTO billingstaff (employee_ID, first_name, last_name, phone_number, email, address, availabilityMon, availabilityTues, availabilityWed, availabilityThurs, availabilityFri, created, creatorID, last_edited) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const staffValues = [
        employee_ID,
        first_name,
        last_name,
        phone_number,
        email,
        address,
        defaultAvailability, // Set availability to 'all day'
        defaultAvailability,
        defaultAvailability,
        defaultAvailability,
        defaultAvailability,
        created,
        creatorID,
        created
    ];

    db.query(q1, employeeValues, (err) => {
        if (err) {
            return res.status(500).json({ error: "Error inserting into employee table", details: err });
        }

        db.query(q2, staffValues, (err) => {
            if (err) {
                return res.status(500).json({ error: "Error inserting into billingstaff table", details: err });
            }
            return res.json("A Billing Staff member has been created successfully!");
        });
    });
});


// Update Office Staff
app.put("/staff/officestaff/:employee_ID", (req, res) => {
    const employee_ID = req.params.employee_ID;
    const { first_name, last_name, phone_number, address } = req.body;

    const query = "UPDATE officestaff SET first_name = ?, last_name = ?, phone_number = ?, address = ? WHERE employee_ID = ?";
    const values = [first_name, last_name, phone_number, address, employee_ID];

    db.query(query, values, (err) => {
        if (err) return res.status(500).json(err);
        return res.json("Office staff updated successfully!");
    });
});

// Update Billing Staff
app.put("/staff/billingstaff/:employee_ID", (req, res) => {
    const employee_ID = req.params.employee_ID;
    const { first_name, last_name, phone_number, address } = req.body;

    const query = "UPDATE billingstaff SET first_name = ?, last_name = ?, phone_number = ?, address = ? WHERE employee_ID = ?";
    const values = [first_name, last_name, phone_number, address, employee_ID];

    db.query(query, values, (err) => {
        if (err) return res.status(500).json(err);
        return res.json("Billing staff updated successfully!");
    });
});

// Get Office Staff by Employee ID
app.get("/staff/officestaff/:employee_ID", (req, res) => {
    const employee_ID = req.params.employee_ID;

    const query = "SELECT first_name, last_name, phone_number, address FROM officestaff WHERE employee_ID = ?";
    const values = [employee_ID];

    db.query(query, values, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json("Office staff not found.");
        return res.json(results[0]); // Return the first matching record
    });
});

// Get Billing Staff by Employee ID
app.get("/staff/billingstaff/:employee_ID", (req, res) => {
    const employee_ID = req.params.employee_ID;

    const query = "SELECT first_name, last_name, phone_number, address FROM billingstaff WHERE employee_ID = ?";
    const values = [employee_ID];

    db.query(query, values, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json("Billing staff not found.");
        return res.json(results[0]); // Return the first matching record
    });
});



// Director view
app.get("/director_view/:employee_ID", (req, res) => {
    const director_id = req.params.employee_ID;

    const q_doctors = `
        SELECT d.employee_ID, d.first_name, d.last_name, d.specialty, esl.working_time, o.name AS office_name, o.location_ID 
        FROM doctors d 
        JOIN employee_schedule_location esl ON d.employee_ID = esl.schedule_ID 
        JOIN office o ON esl.mon_avail = o.location_ID OR esl.tues_avail = o.location_ID OR esl.wed_avail = o.location_ID OR esl.thurs_avail = o.location_ID OR esl.fri_avail = o.location_ID 
        WHERE o.director_ID = ? 
        AND (esl.mon_avail IS NOT NULL OR esl.tues_avail IS NOT NULL OR esl.wed_avail IS NOT NULL OR esl.thurs_avail IS NOT NULL OR esl.fri_avail IS NOT NULL);
    `;

    db.query(q_doctors, [director_id], (err, doctors) => {
        if (err) return res.status(500).json(err);
        if (doctors.length === 0) return res.status(404).json("No doctors found.");
        
        return res.json(doctors); // Send back the doctors data
    });
});

// get Director Office ID
app.get("/director_office/:directorId", (req, res) => {
    const directorId = req.params.directorId;

    const query = "SELECT location_ID FROM office WHERE director_ID = ?";
    
    db.query(query, [directorId], (err, results) => {
        if (err) {
            console.error('Error fetching director office ID:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length > 0) {
            return res.json({ officeId: results[0].location_ID });
        } else {
            return res.status(404).json({ message: 'Director not found or no office associated' });
        }
    });
});



// Get patients from doctors_patient table
app.get("/doctors_patient/:doctorId", (req, res) => {
    const doctorId = req.params.doctorId;

    const q = `
        SELECT p.first_name, p.last_name, p.medical_ID, p.home_phone, p.address_line_1, p.address_line_2, p.city, p.state, p.zip, p.personal_email
        FROM patient p
        JOIN doctors_patient dp ON p.medical_ID = dp.patient_ID
        WHERE dp.doctor_ID = ? 
    `;

    db.query(q, [doctorId], (err, patients) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.status(500).json(err);
        }
        if (patients.length === 0) {
            return res.status(404).json("No patients found for this doctor.");
        }
        
        return res.json(patients); // Send back the patients data
    });
});

//retrieve office staff and billing staff
app.get("/staff_management", (req, res) => {
    const q = `
        SELECT e.employee_ID, e.first_name, e.last_name, e.role
        FROM employee e
        WHERE e.role IN ('OfficeStaff', 'BillingStaff')
    `;

    db.query(q, (err, staff) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        return res.json(staff); // Send back the staff data
    });
});
// Delete Office Staff
app.delete("/staff/officestaff/:employee_ID", (req, res) => {
    const employee_ID = req.params.employee_ID;
    
    const q1 = "DELETE FROM officestaff WHERE employee_ID = ?";
    const q2 = "DELETE FROM employee WHERE employee_ID = ?";

    db.query(q1, [employee_ID], (err) => {
        if (err) return res.status(500).json(err);

        db.query(q2, [employee_ID], (err) => {
            if (err) return res.status(500).json(err);
            return res.json("Office Staff member has been deleted!");
        });
    });
});

// Delete Billing Staff
app.delete("/staff/billingstaff/:employee_ID", (req, res) => {
    const employee_ID = req.params.employee_ID;
    
    const q1 = "DELETE FROM billingstaff WHERE employee_ID = ?";
    const q2 = "DELETE FROM employee WHERE employee_ID = ?";

    db.query(q1, [employee_ID], (err) => {
        if (err) return res.status(500).json(err);

        db.query(q2, [employee_ID], (err) => {
            if (err) return res.status(500).json(err);
            return res.json("Billing Staff member has been deleted!");
        });
    });
});



// Get appointments for a specific director's office
app.get("/appointments/:directorId", (req, res) => {
    const directorId = req.params.directorId;

    const q = `
    SELECT * 
FROM appointment 
WHERE officeID IN (SELECT location_ID FROM office WHERE director_ID = ?)
`;


    db.query(q, [directorId], (err, appointment) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        return res.json(appointment);
    });
});

// get appointment info by AppointmentID
app.get('/appointment/:id', (req, res) => {
    const appointmentId = req.params.id;
    db.query('SELECT * FROM appointment WHERE appointment_ID = ?', [appointmentId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Calculate profit for specific appointment IDs
app.get("/profit", (req, res) => {
    const { appointmentIds } = req.query; // Expecting a comma-separated list of appointment IDs

    if (!appointmentIds) {
        return res.status(400).json({ message: "appointmentIds query parameter is required." });
    }

    const query = `
        SELECT SUM(amountCharged) AS profit
        FROM medical_clinic_database.invoice
        WHERE appointment_ID IN (?)
        AND amountDue = 0;
    `;

    db.query(query, [appointmentIds.split(',')], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        const profit = results[0]?.profit || 0; // Default to 0 if no profit found
        return res.json({ profit });
    });
});

app.get('/total_profit', (req, res) => {
    const q = `SELECT SUM(amountCharged) AS profit FROM invoices WHERE amountDue = 0`;
    
    db.query(q, (err, results) => {
        if (err) return res.status(500).json(err);
        return res.json({ profit: results[0].profit || 0 }); // Return profit or 0 if no results
    });
});

app.get('/office_statistics', async (req, res) => {
    const { location, startDate, endDate } = req.query;

    // Validate parameters
    if (!location || !startDate || !endDate) {
        return res.status(400).json({ error: 'Location, start date, and end date are required.' });
    }

    const query = `
       SELECT 
    appointment.appointment_ID, 
    appointment.patientName, 
    appointment.doctor, 
    appointment.nurse, 
    appointment.appointment_type, 
    appointment.dateTime, 
    appointment.reason, 
    appointment.treatments, 
    appointment.diagnoses, 
    appointment.allergies, 
    appointment.patientWeight, 
    appointment.patientBP, 
    appointment.patientHR, 
    billing_cost_table.cost AS appointment_cost,
    SUM(billing_cost_table.cost) AS totalProfit, 
    COUNT(appointment.appointment_type) AS appointmentCount
FROM appointment
JOIN billing_cost_table 
    ON appointment.appointment_type = billing_cost_table.appointment_type
WHERE appointment.officeID = ? 
    AND appointment.dateTime BETWEEN ? AND ?
GROUP BY appointment.appointment_ID
ORDER BY appointment.dateTime;
    `;

    db.query(query, [location, startDate, endDate], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);  // Return both totalProfit and appointmentCount
    });
});


// get patient info by medical ID, including medical history and family history
app.get('/patient/:id', (req, res) => {
    const medicalId = req.params.id;
    const query = `
        SELECT p.*, 
               mr.height, 
               mr.weight, 
               mr.sex, 
               mr.allergies AS medical_allergies, 
               mh.conditions AS medical_conditions, 
               mh.treatment, 
               mh.medication, 
               mh.diagnosis_date, 
               fh.relation, 
               fh.conditions AS family_conditions 
        FROM patient p
        LEFT JOIN medical_record mr ON p.medical_ID = mr.medical_ID
        LEFT JOIN medical_history mh ON p.medical_ID = mh.medical_ID
        LEFT JOIN family_history fh ON p.medical_ID = fh.medical_ID
        WHERE p.medical_ID = ?
    `;

    db.query(query, [medicalId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.get('/api/patient/:id', (req, res) => {
    const medicalId = req.params.id;
    console.log(medicalId)

    // Query to get the most recent upcoming appointment
    const upcomingAppointmentQuery = `
      SELECT a.dateTime, a.reason, a.doctor, o.name, o.address
      FROM appointment as a
      LEFT JOIN office as o ON a.officeId = o.location_ID
      WHERE a.patientmedicalID = ? AND a.dateTime > NOW()
      ORDER BY a.dateTime ASC
      LIMIT 1;
    `;

    // Query to get the most recent 3 test results
    const recentTestsQuery = `
      SELECT test_name, test_date, result
      FROM test_history
      WHERE medical_ID = ?
      ORDER BY test_date DESC
      LIMIT 3;
    `;

    const top3RecentReferrals = `
        SELECT r1.status, r1.date_reviewed, r1.reason, 
    doc_origin.first_name as origin_first_name, doc_origin.last_name as origin_last_name, 
    doc_receive.first_name as receive_first_name, doc_receive.last_name as receive_last_name
    FROM (
    SELECT patient_ID, originating_doctor_ID, receiving_doctor_ID, status, date_reviewed, reason
    FROM referral 
    WHERE patient_ID = ?
    ORDER BY date_reviewed DESC  
    LIMIT 3  
    ) AS r1
    LEFT JOIN doctors AS doc_origin 
    ON r1.originating_doctor_ID = doc_origin.employee_ID
    LEFT JOIN doctors AS doc_receive
    ON r1.receiving_doctor_ID = doc_receive.employee_ID;
    `




    db.query(upcomingAppointmentQuery, [medicalId], (err1, appointmentResult) => {
        if (err1) {
            return res.status(500).json({ error: 'Failed to fetch upcoming appointment', details: err1 });
        }

        db.query(recentTestsQuery, [medicalId], (err2, testResults) => {
            if (err2) {
                return res.status(500).json({ error: 'Failed to fetch recent test results', details: err2 });
            }

            db.query(top3RecentReferrals, [medicalId], (err3, referralResults) => {
                if (err3) {
                    return res.status(500).json({ error: 'Failed to fetch recent referrals', details: err3 });
                }

                // Handling upcoming appointment and recent test results
                const upcomingAppointment = appointmentResult.length > 0 ? appointmentResult[0] : null;
                const recentTests = testResults.length > 0 ? testResults : null;  // Set to null if no test results
                const recentReferrals = referralResults.length > 0 ? referralResults : null;  // Set to null if no referrals
                // Send response
                res.json({
                    upcomingAppointment: upcomingAppointment,
                    recentTests: recentTests,
                    recentReferrals: recentReferrals

                });
            });

        });
    });
});

app.get('/patient/:id/my_account/personal_information', (req, res) => {
    const medicalId = req.params.id;

    const personInformationQuery = `
       SELECT p.first_name, p.last_name, p.age, p.birthdate, p.address_line_1, p.address_line_2,
              p.city, p.state, p.zip, p.personal_email, p.home_phone, p.work_phone, p.cell_phone
       FROM patient p 
       WHERE p.medical_ID = ?;
    `;

    db.query(personInformationQuery, [medicalId], (err, personalData) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve personal information', details: err });
        }

        if (personalData.length === 0) {
            return res.status(404).json({ error: 'No personal information found for the given medical ID' });
        }

        // Format the birthdate to just YYYY-MM-DD
        const formattedBirthdate = new Date(personalData[0].birthdate).toLocaleDateString('en-CA');  // Returns YYYY-MM-DD

        res.json({
            first_name: personalData[0].first_name,
            last_name: personalData[0].last_name,
            age: personalData[0].age,
            birthdate: formattedBirthdate,  // Send the formatted birthdate
            address: {
                line_1: personalData[0].address_line_1,
                line_2: personalData[0].address_line_2,
                city: personalData[0].city,
                state: personalData[0].state,
                zip: personalData[0].zip
            },
            contact: {
                personal_email: personalData[0].personal_email,
                home_phone: personalData[0].home_phone,
                work_phone: personalData[0].work_phone,
                cell_phone: personalData[0].cell_phone
            }
        });
    });
});


app.get('/patient/appointment/availability', (req, res) => {
    const { doctorID, officeID } = req.query;

    if (!doctorID || !officeID) {
        return res.status(400).json({ error: "Please provide both doctorID and officeID" });
    }

    // First query: Get fully booked dates
    const fullyBookedDatesQuery = `
        SELECT 
            DATE(dateTime) AS unavailable_date
        FROM 
            appointment
        WHERE 
            doctorID = ?
        GROUP BY 
            DATE(dateTime)
        HAVING 
            COUNT(*) >= 8
    `;

    // Second query: Get unavailable days based on the doctor's schedule
    const unavailableDaysQuery = `
        SELECT 
            schedule_ID,
            CASE WHEN mon_avail != ? THEN 'Monday' END AS Monday,
            CASE WHEN tues_avail != ? THEN 'Tuesday' END AS Tuesday,
            CASE WHEN wed_avail != ? THEN 'Wednesday' END AS Wednesday,
            CASE WHEN thurs_avail != ? THEN 'Thursday' END AS Thursday,
            CASE WHEN fri_avail != ? THEN 'Friday' END AS Friday
        FROM 
            employee_schedule_location
        WHERE 
            schedule_ID = ?
    `;

    // Execute both queries
    db.query(fullyBookedDatesQuery, [doctorID], (err, fullyBookedResults) => {
        if (err) {
            console.error('Error fetching fully booked dates:', err);
            return res.status(500).json({ error: 'Failed to retrieve fully booked dates' });
        }

        db.query(unavailableDaysQuery, [officeID, officeID, officeID, officeID, officeID, doctorID], (err, unavailableDaysResults) => {
            if (err) {
                console.error('Error fetching unavailable days:', err);
                return res.status(500).json({ error: 'Failed to retrieve unavailable days' });
            }

            // Process unavailable days results to filter out null values
            const unavailableDays = [];
            unavailableDaysResults.forEach(row => {
                if (row.Monday) unavailableDays.push(row.Monday);
                if (row.Tuesday) unavailableDays.push(row.Tuesday);
                if (row.Wednesday) unavailableDays.push(row.Wednesday);
                if (row.Thursday) unavailableDays.push(row.Thursday);
                if (row.Friday) unavailableDays.push(row.Friday);
            });

            // Combine results and send response
            res.json({
                fullyBookedDates: fullyBookedResults.map(row => row.unavailable_date),
                unavailableDays: unavailableDays
            });
        });
    });
});



app.get('/patient/appointments/time_slots', (req, res) => {
    const { doctorID, date, facility } = req.query;
    console.log(doctorID)
    console.log(date)
    console.log(facility)

    if (!doctorID || !date || !facility) {
        return res.status(400).json({ error: "Please provide  doctorID , date and facility" });
    }
    console.log(typeof doctorID, typeof date)
    // SQL query to retrieve time slots
    const query = `
    SELECT 
    DATE(dateTime) AS appointment_date,
    HOUR(dateTime) AS appointment_hour,
    DATE_FORMAT(dateTime, '%h:%i %p') AS time_slot
    FROM 
    appointment
    WHERE 
    doctorID =  ? and date(datetime) = ? and officeID = ?
    ORDER BY
    appointment_hour 
    `;

    db.query(query, [doctorID, date, facility], (err, results) => {
        if (err) {

            console.error('Error fetching time slots:', err);
            return res.status(500).json({ error: 'Failed to retrieve time slots' });
        }
        console.log(results)
        // Respond with the time slots
        res.json({ timeSlots: results.map(row => row.time_slot) });
    });
});


app.get('/patient/:id/appointments/upcoming_appointments', (req, res) => {
    const medicalId = req.params.id;
    console.log('asdfasdfasdfasdfasdfasdf')
    // Query to retrieve all upcoming appointments
    const upcomingAppointmentQuery = `
        SELECT a.dateTime, a.reason, a.doctor, o.name, o.address
        FROM appointment as a 
        LEFT JOIN office as o ON a.officeId = o.location_ID
        WHERE a.patientmedicalID = ? AND a.dateTime > NOW()
        ORDER BY a.dateTime;
    `;

    // Execute the query
    db.query(upcomingAppointmentQuery, [medicalId], (err, upcomingAppointments) => {
        if (err) {
            // Handle error, send a 500 response
            return res.status(500).json({ error: 'Failed to retrieve upcoming appointments', details: err });
        }

        // If there are no upcoming appointments, return an appropriate message
        if (upcomingAppointments.length === 0) {
            return res.status(404).json({ message: 'No upcoming appointments found for this patient' });
        }

        // Send the list of upcoming appointments in the response
        res.json({
            appointments: upcomingAppointments
        });
    });
});

app.post('/patient/:id/appointments/create_appointment', (req, res) => {
    const medicalId = req.params.id;
    const {
        doctorId, nurseId, nurseName, facility,
        appointmentType, reason, date, timeSlot
    } = req.body;

    const randomNumber = Math.floor(1000000 + Math.random() * 9000000); // 7-digit number
    const appointment_id = `A${randomNumber}`;

    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    const timePattern = /^(\d{1,2}):(\d{2})\s?(am|pm)$/i; // 12-hour format with am/pm

    if (!datePattern.test(date) || !timePattern.test(timeSlot)) {
        return res.status(400).json({ error: 'Invalid date or time format.' });
    }

    // Convert timeSlot to 24-hour format
    const [, hour, minute, period] = timeSlot.match(timePattern);
    const hour24 = period.toLowerCase() === 'pm' && hour !== '12' ? parseInt(hour) + 12 : period.toLowerCase() === 'am' && hour === '12' ? '00' : hour;
    const formattedDateTime = `${date} ${hour24}:${minute}:00`;
    // First query to retrieve the doctor's name
    console.log('asdf', doctorId)
    const doctorNameQuery = `
        SELECT first_name, last_name
        FROM doctors
        WHERE employee_ID = ?;
    `;

    db.query(doctorNameQuery, [doctorId], (err, doctorResult) => {
        if (err) {
            console.error('Error retrieving doctor name:', err);
            return res.status(500).json({ error: 'Failed to retrieve doctor name.' });
        }

        // Ensure a doctor record was found
        if (doctorResult.length === 0) {
            return res.status(404).json({ error: 'Doctor not found.' });
        }

        const doctorName = `${doctorResult[0].first_name} ${doctorResult[0].last_name}`;

        // Prepare the SQL query to insert the new appointment
        const query = `
            INSERT INTO appointment 
            (appointment_ID, patientmedicalID, doctor, nurse, doctorID,
             appointment_type, nurseID, officeID, dateTime, reason, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        console.log('asdfasdf', formattedDateTime)
        const values = [
            appointment_id,     // appointment_ID
            medicalId,          // patientmedicalID
            doctorName,         // doctor (name of doctor)
            nurseName,          // nurse
            doctorId,           // doctorID
            appointmentType,    // appointment_type
            nurseId,            // nurseID
            facility,           // officeID
            formattedDateTime, // dateTime
            reason,             // reason for the appointment
            medicalId            // created_by (replace with actual user if applicable)
        ];
        console.log('values', values)

        db.query(query, values, (err, result) => {
            if (err) {
                // Check if the error is due to the overdue balance trigger
                if (err.code === 'ER_SIGNAL_EXCEPTION') {
                    return res.status(400).json({ error: 'Cannot create appointment. Patient has an overdue balance older than 30 days.' });
                }
                console.log(err)
                console.error('Error creating appointment:', err);
                return res.status(500).json({ error: 'Failed to create appointment.' });
            }
            res.status(201).json({ message: 'Appointment created successfully.' });
        });
    });
});
app.get('/patient/:id/appointments/doctors', (req, res) => {
    const medicalId = req.params.id;
    console.log('asdfadfad', medicalId)
    // SQL query to retrieve all doctors of a patient, including specialists
    const getDoctorsQuery = `
        select d.specialty, d.first_name, d.last_name, d.employee_ID
    from (select * from doctors_patient 
    where doctors_patient.patient_ID = ?) as dp 
    left join doctors d 
    on dp.doctor_ID = d.employee_ID;

    `;
    // Execute the query
    db.query(getDoctorsQuery, [medicalId], (err, results) => {
        if (err) {
            // Handle error and return 500 status code with error message
            return res.status(500).json({
                error: 'Failed to retrieve doctors for the patient',
                details: err
            });
        }
        console.log(results)
        // If successful, return the results as a JSON response
        return res.json({
            doctors: results
        });
    });


});

app.get('/patient/:id/medical_records/medical_history', (req, res) => {
    const medicalId = req.params.id;

    //this query retrieves all medical records based on medicalId
    const medicalHistoryQuery = `
    select conditions, treatment, diagnosis_date, resolved, medication 
    from medical_history
    where medical_id = ?;
    `
    db.query(medicalHistoryQuery, [medicalId], (err, medicalHistoryData) => {
        if (err) {
            console.error('Error fetching medical history:', err);
            return res.status(500).json({ error: 'Failed to retrieve medical history' });
        }

        // Check if medical history is found
        if (medicalHistoryData.length === 0) {
            return res.status(404).json({ message: 'No medical history found for the provided ID' });
        }

        // Send the medical history data as a response
        res.json({ medicalHistory: medicalHistoryData });
    })
})
app.get('/patient/:id/medical_records/referral_history', (req, res) => {
    const medicalID = req.params.id
    //retrieves all referrals based on medicalId
    const allReferralQuery = `SELECT r1.status, r1.date_created, r1.reason, 
    doc_origin.first_name as origin_first_name, doc_origin.last_name as origin_last_name, 
    doc_receive.first_name as receive_first_name, doc_receive.last_name as receive_last_name
    FROM (
    SELECT patient_ID, originating_doctor_ID, receiving_doctor_ID ,status, date_created,reason
    FROM referral 
    WHERE patient_ID = ?
    ) AS r1
    LEFT JOIN doctors AS doc_origin 
    ON r1.originating_doctor_ID = doc_origin.employee_ID
    LEFT JOIN doctors AS doc_receive
    ON r1.receiving_doctor_ID = doc_receive.employee_ID;`
    db.query(allReferralQuery, [medicalID], (err, referralData) => {
        if (err) {
            console.error('Error fetching referral summary:', err);
            return res.status(500).json({ error: 'Failed to retrieve referral summary' });
        }

        // If no referrals found, return a 404
        if (referralData.length === 0) {
            return res.status(404).json({ message: 'No referrals found for the provided patient ID' });
        }

        // Return the retrieved referral data
        res.json({ referrals: referralData });
    });
})
app.get('/patient/:id/medical_records/test_history', (req, res) => {
    const medicalId = req.params.id
    const recentTestsQuery = `
      SELECT test_name, test_date, result
      FROM test_history
      WHERE medical_ID = ?
      ORDER BY test_date DESC
      LIMIT 3;
    `;
    db.query(recentTestsQuery, [medicalId], (err, testHistoryData) => {
        if (err) {
            console.error('Error fetching test history:', err);
            return res.status(500).json({ error: 'Failed to retrieve test history' });
        }

        // If no tests found, return a 404
        if (testHistoryData.length === 0) {
            return res.status(404).json({ message: 'No test history found for the provided medical ID' });
        }

        // Return the retrieved test history data
        res.json({ tests: testHistoryData });
    });
})

app.get("/get_patient_phone/:patientId", (req, res) => {
    console.log("ID being received at get_patient_phone is", ...req.params.patientId)
    const patientId = req.params.patientId;

    const q_retrieve_patient_phone =
        `
    SELECT home_phone
    FROM patient
    WHERE medical_ID = ?
    `

    db.query(q_retrieve_patient_phone, patientId, (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data)
    })
})


app.get("/medical_get_patient_name/:patientId", (req, res) => {

    const patientId = req.params.patientId
    console.log("patientId is....:)", patientId)

    const q_patient_name =
        `SELECT first_name, last_name
         FROM patient 
         WHERE medical_ID = ?
        `;


    console.log('executing query:', q_patient_name);
    db.query(q_patient_name, patientId, (err, patientName) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        return res.json(patientName);
    });
});

app.post('/patient/:id/my_account/password_change', (req, res) => {
    const medicalId = req.params.id;
    const newPassword = req.body.password;
    
    console.log(medicalId, newPassword)
    // Validate the input
    if (!newPassword || newPassword.trim() === '') {
        return res.status(400).send({ message: 'Password is required' });
    }

    // Update the password in the database
    const query = `UPDATE patient_password SET password = ?, last_edited = NOW() WHERE medical_ID = ?;`;
    console.log('password')
    db.query(query, [newPassword, medicalId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Database error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).send({ message: 'Patient not found' });
        }

        res.send({ message: 'Password updated successfully' });
    });
});

app.get('/patient/:id/pay_bill', (req, res) => {
    const medicalId = req.params.id;
    console.log('asdfasdf',medicalId)
    const query = `
        SELECT 
            i.InvoiceID, 
            i.appointmentDateTime, 
            i.patient_insurance, 
            i.amountDue,
            i.created,
            a.doctor, 
            a.officeID,
            (CASE 
                WHEN DATE_ADD(i.created, INTERVAL 30 DAY) < NOW() AND i.amountDue > 0 THEN TRUE 
                ELSE FALSE 
            END) AS is_overdue
        FROM invoice i
        LEFT JOIN appointment a ON i.appointment_ID = a.appointment_ID
        WHERE a.patientmedicalID = ? 
        AND i.amountDue > 0;
    `;

    db.query(query, [medicalId], (err, rows) => {
        if (err) {
            console.error('Error fetching invoices:', err);
            return res.status(500).send({ message: 'Database error' });
        }
        console.log(rows)
        res.json(rows);
    });
});

app.post('/patient/pay_invoice', (req, res) => {
    const { invoiceId, amountPayed, amountDue } = req.body;

    // Validate input
    if (!invoiceId || amountPayed === undefined || amountDue === undefined || isNaN(amountPayed)) {
        return res.status(400).send({ message: 'Invalid input. Please provide valid invoice ID, payment amount, and amount due.' });
    }

    // Convert amountPayed from string to number
    

    
    

    // Ensure the payment doesn't exceed the current amount due
    if (amountPayed > amountDue) {
        return res.status(400).send({ message: 'Payment exceeds the amount due.' });
    }

    const newAmountDue = amountDue - amountPayed;
    console.log('newamoutndue', newAmountDue)
    // Query to update the amountDue
    const updateInvoiceQuery = `UPDATE invoice SET amountDue = ? WHERE InvoiceID = ?`;

    db.query(updateInvoiceQuery, [newAmountDue, invoiceId], (err, result) => {
        if (err) {
            console.error('Error updating invoice:', err);
            return res.status(500).send({ message: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Invoice not found' });
        }

        res.send({ message: 'Payment applied successfully', newAmountDue });
    });
});


// Get specific info for a patient
app.post("/SearchPatient", (req, res) => {
    const { patientID, option, choice} = req.body;

    console.log(option);
    console.log(patientID);
    console.log(choice);


    const q1 = "SELECT invoice.appointment_ID, invoice.appointmentDateTime, invoice.amountCharged, invoice.amountDue, appointment.officeID, appointment.patientName, appointment.doctor, appointment.nurse, appointment.appointment_type, invoice.patientBillingID , invoice.created, patient.address_line_1, patient.address_line_2, patient.city, patient.state, patient.zip FROM invoice, appointment, patient WHERE invoice.appointment_ID = appointment.appointment_ID  AND invoice.patientBillingID = patient.billingID AND patient.medical_ID = appointment.patientmedicalID AND invoice.amountDue > 0.00 AND invoice.patientBillingID = ?;";
    const q2 = "SELECT invoice.appointment_ID, invoice.appointmentDateTime, invoice.amountCharged, invoice.amountDue, appointment.officeID, appointment.patientName, appointment.doctor, appointment.nurse, appointment.appointment_type, invoice.patientBillingID , invoice.created, patient.address_line_1, patient.address_line_2, patient.city, patient.state, patient.zip FROM invoice, appointment, patient WHERE invoice.appointment_ID = appointment.appointment_ID  AND invoice.patientBillingID = patient.billingID AND patient.medical_ID = appointment.patientmedicalID AND invoice.amountDue = 0.00 AND invoice.patientBillingID = ?;";
    const q3 = "SELECT billingID FROM patient WHERE billingID = ?;";

    if(!option){
        if(!choice){
            console.log("q1");
            db.query(q1, [patientID], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.json(data);
            });
        }else{
            console.log("q2");
            db.query(q2, [patientID], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.json(data);
            });
        }
        
    }else{
        db.query(q3, [patientID], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json(data);
        });
    }
    return;
});

// Get an office location for invoice purposes
app.post("/Created_invoice", (req, res) => {
    const {offID} = req.body;
    console.log(offID);

    const q = "SELECT DISTINCT * FROM office WHERE location_ID = ?;";

    db.query(q, [offID], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });

});


//get patient info for all patients with a certain name
app.post("/Search_Patient_ID", (req, res) => {
    const {query} = req.body;
    console.log(query);

    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });

});




// Get Appointments that have not been paid
app.post("/Past_Due_Patients", (req, res) => {

    const q = `SELECT
    invoice.patientBillingID,
    invoice.patient_name,
    patient.personal_email,
    patient.home_phone,
    invoice.appointmentDateTime,
    invoice.amountDue
FROM
    invoice, appointment, patient
WHERE
	invoice.appointment_ID = appointment.appointment_ID AND invoice.patientBillingID = patient.billingID AND patient.medical_ID = appointment.patientmedicalID AND
    invoice.appointmentDateTime BETWEEN ? AND ?
    AND invoice.amountDue > 0;;
`;

    const values = [
        req.body.params.startDate,
        req.body.params.endDate,
        req.body.params.location
    ]

    console.log(values[0]);

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });

});

// Switch appointment to paid
app.post("/See_Patient_Balance", (req, res) => {
    const  patientID  = req.params.id;

    const values =[
        req.body.ID
    ]

    console.log(values);
    const q = "UPDATE invoice SET amountDue = 0.00 WHERE appointment_ID = ?";
    db.query(q, [values, patientID], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.get("/doctor_view/:employee_ID", (req, res) => {
    const doctorId = req.params.employee_ID;

    const q_doctors =
        //"SELECT * FROM employee WHERE employee_ID = ?";
        //'SELECT employee_ID FROM doctors WHERE employee_ID = ?';
        `
    SELECT d.employee_ID, d.first_name, d.last_name, d.specialty, d.availabilityMon, d.availabilityTues, d.availabilityWed, d.availabilityThurs, d.availabilityFri
    FROM doctors d 
    WHERE employee_ID = ?`;
    console.log('executing query:', q_doctors, [doctorId]);
    db.query(q_doctors, [doctorId], (err, doctors) => {
        console.log(doctorId);
        if (typeof doctorId === 'string') {
            console.log('doctorId is a string');
        }
        if (err) return res.status(500).json(err);
        if (doctors.length === 0) return res.status(404).json("No doctors found.");

        return res.json(doctors); // Send back the doctors data
    });
});

app.get("/doc_appointments/:employee_ID", (req, res) => {
    const doctorId = req.params.employee_ID;

    const q_doc_apps =
        `SELECT * 
    FROM appointment 
    WHERE doctorID = ?`;

    console.log('executing query:', q_doc_apps, [doctorId]);
    db.query(q_doc_apps, [doctorId], (err, appointment) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        return res.json(appointment);
    });
});

app.get("/doc_availability/:employee_ID", (req, res) => {

    const employeeId = req.params.employee_ID;

    const q_doctor_availability =
        `
    SELECT availabilityMon, availabilityTues, availabilityWed, availabilityThurs, availabilityFri
    FROM doctors
    WHERE employee_ID = ?;
    `
    console.log('executing query:', q_doctor_availability, [employeeId]);
    db.query(q_doctor_availability, [employeeId], (err, availability) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        return res.json(availability);
    });
});

app.put("/update_doc_availability/:employee_ID", (req, res) => {
    const employeeId = req.params.employee_ID;
    //const monAvailability = req.body.monAvailability;
    //console.log("value in req.body.availabilityMon = ", req.body.monAvailability)
    const q_update_availability =
        `
        UPDATE doctors
        SET availabilityMon = ?, availabilityTues = ?, availabilityWed = ?, availabilityThurs = ?, availabilityFri = ?
        WHERE employee_ID = ?;
        `
    const availabilityByDay = [
        req.body.monAvailability,
        req.body.tuesAvailability,
        req.body.wedAvailability,
        req.body.thursAvailability,
        req.body.friAvailability,
    ]
    console.log('executing query:', q_update_availability, [employeeId]);
    db.query(q_update_availability, [...availabilityByDay, employeeId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json("availability updated");
    });
});

app.post("/create_referral/:employee_ID", (req, res) => {
    //const employeeId = req.params.employee_ID;
    //console.log("referral contains: ", req);
    console.log(req.body.status);
    const now = new Date();
    const isoString = now.toISOString();
    const mysqlDateTime = isoString.slice(0, 19).replace('T', ' ');
    console.log("the mysql datetime is...", mysqlDateTime);
    console.log("the referral_ID is...", req.body.referral_ID)
    console.log("the originating doctorID is ...", req.body.originating_doctor_ID)
    console.log("the originating doctor contact info is... ", req.body.originating_doctor_contact_info)
    const q_create_referral =
        `
    INSERT INTO referral (referral_ID, date_created, creatorID, created, patient_contact_info, originating_doctor_ID, originating_doctor_contact_info, receiving_doctor_ID, receiving_doctor_contact_info, patient_ID, reason, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?);
    `
    const values = [
        req.body.referral_ID,
        mysqlDateTime,
        req.body.creatorID, req.body.created,
        req.body.patient_contact_info, req.body.originating_doctor_ID,
        req.body.originating_doctor_contact_info, req.body.receiving_doctor_ID,
        req.body.receiving_doctor_contact_info, req.body.patient_ID,
        req.body.reason, req.body.status,
    ]
    console.log('executing query:', q_create_referral);
    db.query(q_create_referral, [...values], (err, data) => {
        if (err) return res.json(err);
        return res.json("Referral created");
    })

})

//Get Doctor Last name
app.get("/doctor_Lname/:employee_ID", (req, res) => {
    const doctorId = req.params.employee_ID;

    const q_doc_name = "SELECT last_name FROM doctors WHERE employee_ID = ?";

    console.log("executing query", q_doc_name);
    db.query(q_doc_name, [doctorId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        };
        return res.json(results);
    })

})

//View referrals by employee_ID
app.get("/view_referrals/:employee_ID", (req, res) => {
    console.log(req.params);
    const doctorId = req.params.employee_ID;
    const q_referral = "SELECT * FROM referral WHERE receiving_doctor_ID = ?  AND status = ?"

    const values = [
        doctorId, 'not reviewed'
    ]
    console.log('executing query', q_referral)

    db.query(q_referral, [...values], (err, results) => {
        if (err) {
            console.error("Error fetching referrals", err);
            return res.status(500).json(err);
        }
        return res.json(results);
    })
})

//View detailed referral information by referral_ID
app.get("/view_specific_referral/:referral_ID", (req, res) => {
    console.log(req.params);
    const referralId = req.params.referral_ID;
    const q_specific_referral = "SELECT * FROM referral WHERE referral_ID = ?"

    const values = [
        referralId
    ]
    console.log('executing query', q_specific_referral)

    db.query(q_specific_referral, [...values], (err, results) => {
        if (err) {
            console.error("Error fetching referral", err);
            return res.status(500).json(err);
        }
        return res.json(results);
    })
})

app.put("/accept_referral/:referral_ID", (req, res) => {
    const referralId = req.params.referral_ID;
    const q_accept_referral =
        `
    UPDATE referral
    SET status = ?
    WHERE referral_ID = ?;
    `
    const accepted = 'accepted'

    db.query(q_accept_referral, [accepted, referralId], (err, results) => {
        if (err) {
            console.error("Error fetching referral", err);
            return res.status(500).json(err);
        }
        return res.json('referral accepted');
    })

})

app.put("/reject_referral/:referral_ID", (req, res) => {
    const referralId = req.params.referral_ID;
    const q_reject_referral =
        `
    UPDATE referral
    SET status = ?
    WHERE referral_ID = ?;
    `
    const rejected = 'rejected'

    db.query(q_reject_referral, [rejected, referralId], (err, results) => {
        if (err) {
            console.error("Error fetching referral", err);
            return res.status(500).json(err);
        }
        return res.json('referral rejected');
    })

})

// app.get("/patient_check/:patientId", (req, res) => {
//     const patientId = req.params.patientId

//     const q_check_patient_id =
//     `
//     SELECT medical_ID
//     FROM patient
//     WHERE medical_ID = ?
//     `
//     db.query(q_check_patient, [patientId,])
// })

/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/

app.get("/nurse_appointments/:employee_ID", (req, res) => {
    const nurseId = req.params.employee_ID;

    const q_nurse_apps =
        `SELECT * 
    FROM appointment 
    WHERE nurseID = ?`;

    console.log('executing query:', q_nurse_apps, [nurseId]);
    db.query(q_nurse_apps, [nurseId], (err, appointment) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        return res.json(appointment);
    });
});

app.get("/view_all_patients/", (req, res) => {

    const q_all_patients =
        `SELECT * 
         FROM patient 
        `;

    console.log('executing query:', q_all_patients);
    db.query(q_all_patients, (err, patient) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        return res.json(patient);
    });
});

app.post("/nurse_create_patient/:employee_ID", (req, res) => {
    //const employeeId = req.params.employee_ID;
    //console.log("referral contains: ", req);
    console.log(req.body);
    console.log(req.body.medical_ID);
    console.log(req.body.last_name);
    console.log(req.body.first_name);
    console.log(req.body.address);
    // const now = new Date();
    // const isoString = now.toISOString();
    // const mysqlDateTime = isoString.slice(0, 19).replace('T', ' ');

    const q_create_patient =
        `
    INSERT INTO patient (medical_ID, billingID, first_name, last_name, birthdate, address_line_1, city, state, zip, personal_email, home_phone, emergency_contact_info, created, creatorID, last_edited, last_editedID)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `
    const values = [
        req.body.medical_ID,
        req.body.billingID,
        req.body.first_name,
        req.body.last_name,
        req.body.birthdate,
        req.body.address,
        req.body.city,
        req.body.state,
        req.body.zip,
        req.body.email,
        req.body.home_phone,
        req.body.emergency_contact,
        req.body.date_created,
        req.body.creatorID,
        req.body.last_edited,
        req.body.last_editedID
    ]
    console.log('executing query:', q_create_patient);
    db.query(q_create_patient, [...values], (err, data) => {
        if (err) return res.json("patient failed to create, please check all fields and try again");
        return res.json("patient created");
    })

})

app.post("/nurse_assign_new_patient/:patientID", (req, res) => {
    //const employeeId = req.params.employee_ID;
    //console.log("referral contains: ", req);
    console.log("patient being assigned");
    const patientId = req.params.patientID;
    console.log("the req.params are...", req.params)
    console.log(patientId);
    // console.log(req.body);
    // console.log(req.body.medical_ID);
    // console.log(req.body.last_name);
    // console.log(req.body.first_name);
    // console.log(req.body.address);
    // const now = new Date();
    // const isoString = now.toISOString();
    // const mysqlDateTime = isoString.slice(0, 19).replace('T', ' ');

    const q_assign_new_patient =
        `
    INSERT INTO doctors_patient (doctor_ID, patient_ID)
    VALUES (?,?);
    `
    const values = [
        'E12345678',
        patientId,
    ]
    console.log('executing query:', q_assign_new_patient);
    db.query(q_assign_new_patient, [...values], (err, data) => {
        if (err) return res.json(err);
        return res.json("patient assigned");
    })

})

app.get("/nurse_get_app_history/:patientId", (req, res) => {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;  // Get the startDate and endDate from the query parameters

    // Build the SQL query dynamically based on whether dates are provided
    let q_appointment_history = `
        SELECT patientName, patientWeight, dateTime, treatments
        FROM appointment 
        WHERE patientMedicalID = ?
    `;

    // If startDate and endDate are provided, add them to the query
    if (startDate && endDate) {
        q_appointment_history += ` AND dateTime BETWEEN ? AND ?`;
    } else if (startDate) {
        q_appointment_history += ` AND dateTime >= ?`;
    } else if (endDate) {
        q_appointment_history += ` AND dateTime <= ?`;
    }

    console.log('Executing query:', q_appointment_history);

    const queryParams = [patientId];
    if (startDate && endDate) {
        queryParams.push(startDate, endDate);
    } else if (startDate) {
        queryParams.push(startDate);
    } else if (endDate) {
        queryParams.push(endDate);
    }

    db.query(q_appointment_history, queryParams, (err, appointments) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        return res.json(appointments);
    });
});


app.get("/nurse_get_patient_name/:patientId", (req, res) => {

    const patientId = req.params.patientId
    console.log("patientId is....:)", patientId)

    const q_patient_name =
        `SELECT first_name, last_name
         FROM patient 
         WHERE medical_ID = ?
        `;


    console.log('executing query:', q_patient_name);
    db.query(q_patient_name, patientId, (err, patientName) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        return res.json(patientName);
    });
});

//get appointment type
app.get("/nurse_get_appointment_type/:doctorId", (req, res) => {
    const doctorId = req.params.doctorId;
    console.log("hi from index, doctorId is...", doctorId)

    const q_app_type = 
    `
    SELECT specialty
    FROM doctors
    WHERE employee_ID = ?
    `
    db.query(q_app_type, doctorId, (err, appType) => {
        if (err){
            console.error(err);
            return res.status(500).json(err);
        }
        return res.json(appType)
    });
});

app.post('/patient/:id/appointments/nurse_create_appointment', (req, res) => {
    const medicalId = req.params.id;
    console.log("patName is...", req.body.patName);
    const {
        patName, doctorId, nurseId, nurseName, facility,
        appointmentType, reason, date, timeSlot
    } = req.body;

    const randomNumber = Math.floor(1000000 + Math.random() * 9000000); // 7-digit number
    const appointment_id = `A${randomNumber}`;

    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    const timePattern = /^(\d{1,2}):(\d{2})\s?(am|pm)$/i; // 12-hour format with am/pm

    if (!datePattern.test(date) || !timePattern.test(timeSlot)) {
        return res.status(400).json({ error: 'Invalid date or time format.' });
    }

    // Convert timeSlot to 24-hour format
    const [, hour, minute, period] = timeSlot.match(timePattern);
    const hour24 = period.toLowerCase() === 'pm' && hour !== '12' ? parseInt(hour) + 12 : period.toLowerCase() === 'am' && hour === '12' ? '00' : hour;
    const formattedDateTime = `${date} ${hour24}:${minute}:00`;
    // First query to retrieve the doctor's name
    console.log('asdf', doctorId)
    const doctorNameQuery = `
        SELECT first_name, last_name
        FROM doctors
        WHERE employee_ID = ?;
    `;

    db.query(doctorNameQuery, [doctorId], (err, doctorResult) => {
        if (err) {
            console.error('Error retrieving doctor name:', err);
            return res.status(500).json({ error: 'Failed to retrieve doctor name.' });
        }

        // Ensure a doctor record was found
        if (doctorResult.length === 0) {
            return res.status(404).json({ error: 'Doctor not found.' });
        }

        const doctorName = `${doctorResult[0].first_name} ${doctorResult[0].last_name}`;

        // Prepare the SQL query to insert the new appointment
        const query = `
            INSERT INTO appointment 
            (patientName, appointment_ID, patientmedicalID, doctor, nurse, doctorID,
             appointment_type, nurseID, officeID, dateTime, reason, created_by, patientBP, created_at) 
            VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        console.log('asdfasdf', formattedDateTime)
        const values = [
            patName,
            appointment_id,     // appointment_ID
            medicalId,          // patientmedicalID
            doctorName,         // doctor (name of doctor)
            nurseName,          // nurse
            doctorId,           // doctorID
            appointmentType,    // appointment_type
            nurseId,            // nurseID
            facility,           // officeID
            formattedDateTime, // dateTime
            reason,             // reason for the appointment
            medicalId,
            '120/80',
            formattedDateTime,           // created_by (replace with actual user if applicable)
        ];
        console.log('values', values)

        db.query(query, values, (err, result) => {
            if (err) {
                // Check if the error is due to the overdue balance trigger
                if (err.code === 'ER_SIGNAL_EXCEPTION') {
                    return res.status(400).json({ error: 'Cannot create appointment. Patient has an overdue balance older than 30 days.' });
                }
                console.log(err)
                console.error('Error creating appointment:', err);
                return res.status(500).json({ error: 'Failed to create appointment.' });
            }
            res.status(201).json({ message: 'Appointment created successfully.' });
        });
    });
});

app.get('/patient/:id/appointments/doctors', (req, res) => {
    const medicalId = req.params.id;
    console.log('asdfadfad', medicalId)
    // SQL query to retrieve all doctors of a patient, including specialists
    const getDoctorsQuery = `
        select d.specialty, d.first_name, d.last_name, d.employee_ID
    from (select * from doctors_patient 
    where doctors_patient.patient_ID = ?) as dp 
    left join doctors d 
    on dp.doctor_ID = d.employee_ID;
    `;
    // Execute the query
    db.query(getDoctorsQuery, [medicalId], (err, results) => {
        if (err) {
            // Handle error and return 500 status code with error message
            return res.status(500).json({
                error: 'Failed to retrieve doctors for the patient',
                details: err
            });
        }
        console.log(results)
        // If successful, return the results as a JSON response
        return res.json({
            doctors: results
        });
    });


});

app.get('/patient/:id/medical_records/medical_history', (req, res) => {
    const medicalId = req.params.id;

    //this query retrieves all medical records based on medicalId
    const medicalHistoryQuery = `
    select conditions, treatment, diagnosis_date, resolved, medication 
    from medical_history
    where medical_id = ?;
    `
    db.query(medicalHistoryQuery, [medicalId], (err, medicalHistoryData) => {
        if (err) {
            console.error('Error fetching medical history:', err);
            return res.status(500).json({ error: 'Failed to retrieve medical history' });
        }

        // Check if medical history is found
        if (medicalHistoryData.length === 0) {
            return res.status(404).json({ message: 'No medical history found for the provided ID' });
        }

        // Send the medical history data as a response
        res.json({ medicalHistory: medicalHistoryData });
    })
})
app.get('/patient/:id/medical_records/referral_history', (req, res) => {
    const medicalID = req.params.id
    //retrieves all referrals based on medicalId
    const allReferralQuery = `SELECT r1.status, r1.date_created, r1.reason, 
    doc_origin.first_name as origin_first_name, doc_origin.last_name as origin_last_name, 
    doc_receive.first_name as receive_first_name, doc_receive.last_name as receive_last_name
    FROM (
    SELECT patient_ID, originating_doctor_ID, receiving_doctor_ID ,status, date_created,reason
    FROM referral 
    WHERE patient_ID = ?
    ) AS r1
    LEFT JOIN doctors AS doc_origin 
    ON r1.originating_doctor_ID = doc_origin.employee_ID
    LEFT JOIN doctors AS doc_receive
    ON r1.receiving_doctor_ID = doc_receive.employee_ID;`
    db.query(allReferralQuery, [medicalID], (err, referralData) => {
        if (err) {
            console.error('Error fetching referral summary:', err);
            return res.status(500).json({ error: 'Failed to retrieve referral summary' });
        }

        // If no referrals found, return a 404
        if (referralData.length === 0) {
            return res.status(404).json({ message: 'No referrals found for the provided patient ID' });
        }

        // Return the retrieved referral data
        res.json({ referrals: referralData });
    });
})
app.get('/patient/:id/medical_records/test_history', (req, res) => {
    const medicalId = req.params.id
    const recentTestsQuery = `
      SELECT test_name, test_date, result
      FROM test_history
      WHERE medical_ID = ?
      ORDER BY test_date DESC
      LIMIT 3;
    `;
    db.query(recentTestsQuery, [medicalId], (err, testHistoryData) => {
        if (err) {
            console.error('Error fetching test history:', err);
            return res.status(500).json({ error: 'Failed to retrieve test history' });
        }

        // If no tests found, return a 404
        if (testHistoryData.length === 0) {
            return res.status(404).json({ message: 'No test history found for the provided medical ID' });
        }

        // Return the retrieved test history data
        res.json({ tests: testHistoryData });
    });
})
// Create a new patient, set their password, and link them to a doctor
app.post("/patients", (req, res) => {
    console.log(req.body);

    // Generate a random medical ID starting with 'M'
    const medicalID = "M" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current date for created and last_edited

    // Step 1: Insert into the `patient` table
    const q1 = "INSERT INTO patient (medical_ID, first_name, last_name, birthdate, address_line_1, address_line_2, city, state, zip, personal_email, home_phone, emergency_contact_info, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const patientValues = [
        medicalID, 
        req.body.first_name,
        req.body.last_name,
        req.body.birthdate,
        req.body.address_line_1,
        req.body.address_line_2 || '', // Default to empty string if not provided
        req.body.city,
        req.body.state,
        req.body.zip,
        req.body.personal_email,
        req.body.home_phone,
        req.body.emergency_contact_info,
        currentDate // created timestamp
    ];

    // Step 2: Insert into the `patient_password` table (default password: 'Patient')
    const q2 = "INSERT INTO patient_password (medical_ID, password, created) VALUES (?, ?, ?)";
    const passwordValues = [
        medicalID, 
        'Patient',  // Default password
        currentDate, // created timestamp
        currentDate,
    ];

    // Step 3: Insert into `doctors_patient` table to associate the patient with a doctor
    const q3 = "INSERT INTO doctors_patient (doctor_ID, patient_ID) VALUES (?, ?)";
    const doctorPatientValues = [
       "E12345678",  // The doctor ID passed from the frontend
        medicalID  // The newly generated medical ID for the patient
    ];

    // Start a transaction to ensure all queries are executed atomically
    db.beginTransaction((err) => {
        if (err) {
            console.error("Error starting transaction:", err); // Log the error
            return res.status(500).json({ error: "Error starting transaction", details: err });
        }

        // Execute query to insert patient
        db.query(q1, patientValues, (err) => {
            if (err) {
                console.error("Error inserting into patient table:", err); // Log the error
                return db.rollback(() => {
                    res.status(500).json({ error: "Error inserting into patient table", details: err });
                });
            }

            // Insert the patient's password
            db.query(q2, passwordValues, (err) => {
                if (err) {
                    console.error("Error inserting into patient_password table:", err); // Log the error
                    return db.rollback(() => {
                        res.status(500).json({ error: "Error inserting into patient_password table", details: err });
                    });
                }

                // Link the patient to the doctor
                db.query(q3, doctorPatientValues, (err) => {
                    if (err) {
                        console.error("Error inserting into doctors_patient table:", err); // Log the error
                        return db.rollback(() => {
                            res.status(500).json({ error: "Error inserting into doctors_patient table", details: err });
                        });
                    }

                    // Commit transaction if all queries succeed
                    db.commit((err) => {
                        if (err) {
                            console.error("Error committing transaction:", err); // Log the error
                            return db.rollback(() => {
                                res.status(500).json({ error: "Error committing transaction", details: err });
                            });
                        }

                        // Respond to client after success
                        return res.json("Patient has been created, linked to a doctor, and a default password has been set!");
                    });
                });
            });
        });
    });
});

// Define the route to fetch all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT * FROM patient'; // Adjust to match your actual table name
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching patients:', err);
        return res.status(500).json({ error: 'Failed to fetch patients' });
      }
      res.json(results); // Send the patient data as JSON
    });
  });

  // Delete Patient Endpoint
app.delete("/patients/:medicalId", (req, res) => {
    const medicalId = req.params.medicalId;
  
    // Start a transaction to ensure all queries are executed atomically
    db.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        return res.status(500).json({ error: "Error starting transaction", details: err });
      }
  
      // Step 1: Delete from `doctors_patient` table (unassociate doctor-patient relation)
      const q1 = "DELETE FROM doctors_patient WHERE patient_ID = ?";
      db.query(q1, [medicalId], (err) => {
        if (err) {
          console.error("Error deleting from doctors_patient table:", err);
          return db.rollback(() => {
            res.status(500).json({ error: "Error deleting from doctors_patient table", details: err });
          });
        }
  
        // Step 2: Delete from `patient_password` table
        const q2 = "DELETE FROM patient_password WHERE medical_ID = ?";
        db.query(q2, [medicalId], (err) => {
          if (err) {
            console.error("Error deleting from patient_password table:", err);
            return db.rollback(() => {
              res.status(500).json({ error: "Error deleting from patient_password table", details: err });
            });
          }
  
          // Step 3: Delete from `patient` table
          const q3 = "DELETE FROM patient WHERE medical_ID = ?";
          db.query(q3, [medicalId], (err) => {
            if (err) {
              console.error("Error deleting from patient table:", err);
              return db.rollback(() => {
                res.status(500).json({ error: "Error deleting from patient table", details: err });
              });
            }
  
            // Commit transaction if all queries succeed
            db.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                return db.rollback(() => {
                  res.status(500).json({ error: "Error committing transaction", details: err });
                });
              }
  
              // Respond to client after success
              return res.json({ message: "Patient deleted successfully" });
            });
          });
        });
      });
    });
  });
  
// Update Patient Password Route 
app.put('/patient/password/:medical_ID', (req, res) => {
    const { medical_ID } = req.params;
    const { newPassword } = req.body;
  
    if (!newPassword) {
      return res.status(400).json({ message: 'Password is required' });
    }
  
    const query = 'UPDATE patient_password SET password = ? WHERE medical_ID = ?';
    db.query(query, [newPassword, medical_ID], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating password', error: err });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json({ message: 'Password updated successfully' });
    });
  });
  
  // Update Employee Password Route 
  app.put('/employee/password/:employee_ID', (req, res) => {
    const { employee_ID } = req.params;
    const { newPassword } = req.body;
  
    if (!newPassword) {
      return res.status(400).json({ message: 'Password is required' });
    }
  
    const query = 'UPDATE employee_password SET password = ? WHERE employee_ID = ?';
    db.query(query, [newPassword, employee_ID], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating password', error: err });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json({ message: 'Password updated successfully' });
    });
  });
  

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000! (Connected to backend!)');
  });