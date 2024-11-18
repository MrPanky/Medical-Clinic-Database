CREATE TABLE Patient (
    medical_ID VARCHAR(9) PRIMARY KEY CHECK (medical_ID LIKE 'M%'),
    billingID VARCHAR(9) UNIQUE CHECK (billingID LIKE 'B%'),
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    age INT CHECK (age BETWEEN 0 AND 110),
    birthdate DATE NOT NULL,
    address_line_1 VARCHAR(64) NOT NULL,
    address_line_2 VARCHAR(64),
    city VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    personal_email VARCHAR(255) NOT NULL,
    work_email VARCHAR(255),
    home_phone VARCHAR(15) NOT NULL,
    work_phone VARCHAR(15),
    cell_phone VARCHAR(15),
    emergency_contact_info VARCHAR(500) NOT NULL CHECK (LENGTH(emergency_contact_info) > 20),
    is_child BOOLEAN,
    balance DECIMAL(10, 2),
    created DATETIME NOT NULL,
    creatorID VARCHAR(255) CHECK (creatorID LIKE 'E%'),
    last_edited DATETIME,
    last_editedID VARCHAR(255) CHECK (last_editedID LIKE 'E%')
);

CREATE TABLE OfficeStaff (
    employee_ID VARCHAR(9) PRIMARY KEY CHECK (employee_ID LIKE 'E%'),
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(64) NOT NULL,
    manager BOOLEAN,
    availabilityMon ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityTues ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityWed ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityThurs ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityFri ENUM('morning', 'afternoon', 'all day', 'not available'),
    created DATETIME NOT NULL,
    creatorID VARCHAR(255) CHECK (creatorID LIKE 'E%'),
    last_edited DATETIME,
    last_editedID VARCHAR(255) CHECK (last_editedID LIKE 'E%')
);

CREATE TABLE Doctors (
    employee_ID VARCHAR(9) PRIMARY KEY CHECK (employee_ID LIKE 'E%'),
    specialty VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    work_address VARCHAR(64) NOT NULL,
    availabilityMon ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityTues ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityWed ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityThurs ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityFri ENUM('morning', 'afternoon', 'all day', 'not available'),
    created DATETIME NOT NULL,
    creatorID VARCHAR(255) CHECK (creatorID LIKE 'E%'),
    last_edited DATETIME,
    last_editedID VARCHAR(255) CHECK (last_editedID LIKE 'E%')
);

CREATE TABLE Nurses (
    employee_ID VARCHAR(9) PRIMARY KEY CHECK (employee_ID LIKE 'E%'),
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    work_address VARCHAR(64) NOT NULL,
    availabilityMon ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityTues ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityWed ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityThurs ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityFri ENUM('morning', 'afternoon', 'all day', 'not available'),
    created DATETIME NOT NULL,
    creatorID VARCHAR(255) CHECK (creatorID LIKE 'E%'),
    last_edited DATETIME,
    last_editedID VARCHAR(255) CHECK (last_editedID LIKE 'E%')
);

CREATE TABLE BillingStaff (
    employee_ID VARCHAR(9) PRIMARY KEY CHECK (employee_ID LIKE 'E%'),
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    work_address VARCHAR(64) NOT NULL,
    availabilityMon ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityTues ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityWed ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityThurs ENUM('morning', 'afternoon', 'all day', 'not available'),
    availabilityFri ENUM('morning', 'afternoon', 'all day', 'not available'),
    created DATETIME NOT NULL,
    creatorID VARCHAR(255) CHECK (creatorID LIKE 'E%'),
    last_edited DATETIME,
    last_editedID VARCHAR(255) CHECK (last_editedID LIKE 'E%')
);

CREATE TABLE Invoice (
    appointment_ID VARCHAR(9) PRIMARY KEY CHECK (appointment_ID LIKE 'A%'),
    appointmentDateTime DATETIME NOT NULL,
    patientBillingID VARCHAR(9) NOT NULL,
    InvoiceID VARCHAR(9) CHECK (InvoiceID LIKE 'I%'),
    patient_name VARCHAR(64) NOT NULL,
    patient_address VARCHAR(64) NOT NULL,
    patient_phone VARCHAR(15) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,
    patient_insurance VARCHAR(200) NOT NULL,
    services VARCHAR(400) NOT NULL,
    amountCharged DECIMAL(10, 2) NOT NULL,
    amountDue DECIMAL(10, 2) NOT NULL,
    created DATETIME NOT NULL,
    creatorID VARCHAR(255) CHECK (creatorID LIKE 'E%'),
    last_edited DATETIME,
    last_editedID VARCHAR(255) CHECK (last_editedID LIKE 'E%'),
    FOREIGN KEY (patientBillingID) REFERENCES Patient(billingID)
);

CREATE TABLE Director (
    employee_ID VARCHAR(9) PRIMARY KEY CHECK (employee_ID LIKE 'E%'),
    name VARCHAR(64) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    address VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created DATETIME NOT NULL,
    creatorID VARCHAR(255) CHECK (creatorID LIKE 'E%'),
    last_edited DATETIME
);

CREATE TABLE Office (
    location_ID INT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    hours_of_operation VARCHAR(100) NOT NULL,
    director_ID VARCHAR(64) NOT NULL,
    holidays VARCHAR(255),
    created DATETIME NOT NULL,
    creatorID VARCHAR(255) CHECK (creatorID LIKE 'E%'),
    last_edited DATETIME,
    last_edited_ID INT,
    FOREIGN KEY (director_ID) REFERENCES Director(employee_ID)
);

CREATE TABLE Schedule (
    schedule_ID VARCHAR(9) PRIMARY KEY,
    mon_avail VARCHAR(255),
    tues_avail VARCHAR(255),
    wed_avail VARCHAR(255),
    thurs_avail VARCHAR(255),
    fri_avail VARCHAR(255),
    created DATETIME NOT NULL,
    creatorID VARCHAR(255) CHECK (creatorID LIKE 'E%'),
    last_edited DATETIME,
    last_editedID VARCHAR(255) CHECK (last_editedID LIKE 'E%'),
    working_time VARCHAR(255),
    location_ID INT,
    FOREIGN KEY (location_ID) REFERENCES Office(location_ID),
    FOREIGN KEY (schedule_ID) REFERENCES Doctors(employee_ID) 
);


CREATE TABLE Appointment (
    appointment_ID VARCHAR(9) PRIMARY KEY CHECK (appointment_ID LIKE 'A%'),
    patientmedicalID VARCHAR(9) NOT NULL,
    patientName VARCHAR(64) NOT NULL,
    doctor VARCHAR(64) NOT NULL,
    nurse VARCHAR(64) NOT NULL,
    doctorID VARCHAR(9) NOT NULL,
    appointment_type VARCHAR(255) NOT NULL,
    nurseID VARCHAR(9) NOT NULL,
    officeID INT,
    dateTime DATETIME NOT NULL,
    reason VARCHAR(100) NOT NULL,
    treatments VARCHAR(200),
    diagnoses VARCHAR(100),
    allergies VARCHAR(200),
    patientWeight DECIMAL(5, 2) CHECK (patientWeight > 0 AND patientWeight < 1000),
    patientBP VARCHAR(10) NOT NULL,
    patientHR INT CHECK (patientHR BETWEEN 50 AND 150),
    created_at DATETIME NOT NULL,
    created_by VARCHAR(9),
    last_edited DATETIME,
    last_edited_ID VARCHAR(9),
    FOREIGN KEY (patientmedicalID) REFERENCES Patient(medical_ID),
    FOREIGN KEY (doctorID) REFERENCES Doctors(employee_ID),
    FOREIGN KEY (nurseID) REFERENCES Nurses(employee_ID),
    FOREIGN KEY (appointment_type) REFERENCES Doctors(specialty)
);



CREATE TABLE Referral (
    referral_ID VARCHAR(9) PRIMARY KEY CHECK (referral_ID LIKE 'R%'),
    originating_doctor_ID VARCHAR(9) NOT NULL,
    originating_doctor_contact_info VARCHAR(15) NOT NULL,
    receiving_doctor_ID VARCHAR(9) NOT NULL,
    receiving_doctor_contact_info VARCHAR(15) NOT NULL,
    patient_ID VARCHAR(9) NOT NULL,
    patient_contact_info VARCHAR(15) NOT NULL,
    status ENUM('not reviewed', 'accepted', 'rejected'),
    date_created DATETIME NOT NULL,
    date_reviewed DATETIME,
    reason VARCHAR(200) NOT NULL,
    created DATETIME NOT NULL,
    creatorID VARCHAR(255) CHECK (creatorID LIKE 'E%'),
    last_edited DATETIME,
    last_editedID VARCHAR(255) CHECK (last_editedID LIKE 'E%'),
    FOREIGN KEY (originating_doctor_ID) REFERENCES Doctors(employee_ID),
    FOREIGN KEY (receiving_doctor_ID) REFERENCES Doctors(employee_ID),
    FOREIGN KEY (patient_ID) REFERENCES Patient(medical_ID)
);

CREATE TABLE Medical_Record (
    medical_ID VARCHAR(9) PRIMARY KEY CHECK (medical_ID LIKE 'M%'),
    height INT CHECK (height BETWEEN 10 AND 84),
    weight DECIMAL(5, 2) CHECK (weight > 0 AND weight <= 1000),
    sex VARCHAR(6) NOT NULL,
    age INT CHECK (age BETWEEN 0 AND 110),
    birthdate DATE NOT NULL,
    patient_doctors VARCHAR(255),
    previous_medical_conditions VARCHAR(255),
    previous_treatments VARCHAR(255),
    previous_medications VARCHAR(255),
    family_history VARCHAR(255),
    appointment_history VARCHAR(255),
    current_medications VARCHAR(255),
    active_conditions VARCHAR(255),
    test_history VARCHAR(255),
    allergies VARCHAR(200),
    vaccination_record VARCHAR(255),
    insurance VARCHAR(200),
    emergency_contact_information VARCHAR(800),
    created DATETIME NOT NULL,
    creatorID VARCHAR(255) CHECK (creatorID LIKE 'E%'),
    last_edited DATETIME,
    last_editedID VARCHAR(255) CHECK (last_editedID LIKE 'E%'),
    FOREIGN KEY (medical_ID) REFERENCES Patient(medical_ID)
);

CREATE TABLE Billing_Cost_Table (
    appointment_type VARCHAR(250) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (appointment_type),
    FOREIGN KEY (appointment_type) REFERENCES Appointment(appointment_type)
);


