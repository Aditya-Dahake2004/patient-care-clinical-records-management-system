package com.genc.pccrms.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ClinicalRecord")
public class ClinicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer recordId;

    @Column(name = "patientId")
    private Integer patientId;

    @Column(name = "diagnosisCode")
    private String diagnosisCode;

    @Column(name = "clinicalNotes")
    private String clinicalNotes;

    public ClinicalRecord() {
    }

    public Integer getRecordId() { return recordId; }
    public void setRecordId(Integer recordId) { this.recordId = recordId; }

    public Integer getPatientId() { return patientId; }
    public void setPatientId(Integer patientId) { this.patientId = patientId; }

    public String getDiagnosisCode() { return diagnosisCode; }
    public void setDiagnosisCode(String diagnosisCode) { this.diagnosisCode = diagnosisCode; }

    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }
}