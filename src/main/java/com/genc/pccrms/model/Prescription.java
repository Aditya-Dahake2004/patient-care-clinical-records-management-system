package com.genc.pharmacist.model;

import jakarta.persistence.*;

@Entity
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prescriptionId;

    private Long patientId;
    private String medicationName;
    private String dosage;
    private String frequency;

    @Enumerated(EnumType.STRING)
    private DispenseStatus dispenseStatus;

    // Enum for status
    public enum DispenseStatus {
        PENDING,
        DISPENSED,
        CANCELLED
    }

    // Getters and Setters
    public Long getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(Long prescriptionId) {
        this.prescriptionId = prescriptionId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public DispenseStatus getDispenseStatus() {
        return dispenseStatus;
    }

    public void setDispenseStatus(DispenseStatus dispenseStatus) {
        this.dispenseStatus = dispenseStatus;
    }
}
