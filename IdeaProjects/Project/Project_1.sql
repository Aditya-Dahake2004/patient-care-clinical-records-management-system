-- Create Database
CREATE DATABASE IF NOT EXISTS pccr;
USE pccr;
-- Patient Table
CREATE TABLE IF NOT EXISTS Patient (
    patientId INT AUTO_INCREMENT PRIMARY KEY,
    mrn VARCHAR(20),
    fullName VARCHAR(100),
    dateOfBirth DATE,
    gender VARCHAR(10),
    contactNumber VARCHAR(20)
) ENGINE=InnoDB;
-- Appointment Table
CREATE TABLE IF NOT EXISTS Appointment (
    appointmentId INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT,
    doctorId INT,
    appointmentDate DATE,
    appointmentTime TIME,
    appointmentStatus ENUM('BOOKED','COMPLETED','CANCELLED','NO_SHOW'),
    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patientId)
        REFERENCES Patient(patientId)
) ENGINE=InnoDB;
-- ClinicalRecord Table
CREATE TABLE IF NOT EXISTS ClinicalRecord (
    recordId INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT,
    encounterDate DATE,
    diagnosisCode VARCHAR(20),
    clinicalNotes TEXT,
    vitalsSummary VARCHAR(255),
 
    CONSTRAINT fk_clinical_patient
        FOREIGN KEY (patientId)
        REFERENCES Patient(patientId)
) ENGINE=InnoDB;
-- Prescription Table
CREATE TABLE IF NOT EXISTS Prescription (
    prescriptionId INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT,
    medicationName VARCHAR(100),
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    dispenseStatus ENUM('PENDING','DISPENSED','CANCELLED'),
 
    CONSTRAINT fk_prescription_patient
        FOREIGN KEY (patientId)
        REFERENCES Patient(patientId)
) ENGINE=InnoDB;
-- Invoice Table
CREATE TABLE IF NOT EXISTS Invoice (
    invoiceId INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT,
    totalAmount DECIMAL(10,2),
    insuranceCoverage DECIMAL(10,2),
    patientPayable DECIMAL(10,2),
    claimStatus ENUM('PENDING','APPROVED','REJECTED'),
 
    CONSTRAINT fk_invoice_patient
        FOREIGN KEY (patientId)
        REFERENCES Patient(patientId)
) ENGINE=InnoDB;