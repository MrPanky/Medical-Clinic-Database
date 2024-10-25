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
    res.json("Hello this is mr.backend! 乁( ⁰͡ Ĺ̯ ⁰͡ ) ㄏ");
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

    db.query(q1, employeeValues, (err) => {
        if (err) {
            return res.status(500).json({ error: "Error inserting into employee table", details: err });
        }

        db.query(q2, doctorValues, (err) => {
            if (err) {
                return res.status(500).json({ error: "Error inserting into doctors table", details: err });
            }
            return res.json("A doctor has been created successfully!");
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

// Delete doctor
app.delete("/doctors/:employee_ID", (req, res) => {
    const employee_id = req.params.employee_ID;
    const q1 = "DELETE FROM doctors WHERE employee_ID = ?";
    const q2 = "DELETE FROM employee WHERE employee_ID = ?";

    db.query(q1, [employee_id], (err) => {
        if (err) return res.status(500).json(err);

        db.query(q2, [employee_id], (err) => {
            if (err) return res.status(500).json(err);
            return res.json("Doctor and employee have been deleted!");
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






app.listen(3000, () => console.log('Server running on port 3000! (Connected to backend!)'));
