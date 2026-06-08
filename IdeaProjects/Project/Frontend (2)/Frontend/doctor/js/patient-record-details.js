document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("id");

    if (!patientId) {
        alert("Error: No patient specified. Redirecting to round list.");
        window.location.href = "todays-patients.html";
        return;
    }

    function renderPatientRecord() {
        const patient = window.HospitalStore.getPatientById(patientId);
        if (!patient) {
            alert("Error: Patient record not found. Redirecting to round list.");
            window.location.href = "todays-patients.html";
            return;
        }

        // Render Demographics
        document.getElementById("patName").textContent = patient.name;
        document.getElementById("patMRN").textContent = patient.mrn;
        document.getElementById("patGender").textContent = patient.gender;
        document.getElementById("patDOB").textContent = patient.dob;
        document.getElementById("patPhone").textContent = patient.phone;
        document.getElementById("patAddress").textContent = patient.address || "Not Provided";
        document.getElementById("avatarInitials").textContent = patient.name.split(" ").map(n => n[0]).join("");

        // Direct Action Buttons
        document.getElementById("diagnoseBtn").setAttribute("href", `create-diagnosis.html?patientId=${patient.id}`);
        document.getElementById("prescribeBtn").setAttribute("href", `create-prescription.html?patientId=${patient.id}`);

        // Fetch Clinical Tables
        const appointments = window.HospitalStore.getAppointments().filter(a => a.patientId == patientId);
        const diagnoses = window.HospitalStore.getDiagnoses().filter(d => d.patientId == patientId);
        const prescriptions = window.HospitalStore.getPrescriptions().filter(p => p.patientId == patientId);
        const notes = window.HospitalStore.getClinicalNotes().filter(n => n.patientId == patientId);

        // Render Latest Vitals if available
        if (notes.length > 0) {
            const latestNote = notes[notes.length - 1];
            document.getElementById("vitalTemp").textContent = latestNote.vitals.temp;
            document.getElementById("vitalBP").textContent = latestNote.vitals.bp;
            document.getElementById("vitalHR").textContent = latestNote.vitals.hr;
            document.getElementById("vitalRR").textContent = latestNote.vitals.rr;
        }

        // Render Appointments Table
        const apptsBody = document.getElementById("recordApptsBody");
        apptsBody.innerHTML = "";
        if (appointments.length === 0) {
            apptsBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-2">No encounter records.</td></tr>`;
        } else {
            appointments.forEach(a => {
                row = document.createElement("tr");
                row.innerHTML = `<td>${a.date}</td><td>${a.doctorName}</td><td>${a.time}</td><td><span class="badge bg-primary-subtle text-primary">${a.status}</span></td>`;
                apptsBody.appendChild(row);
            });
        }

        // Render Diagnoses Table
        const diagsBody = document.getElementById("recordDiagsBody");
        diagsBody.innerHTML = "";
        if (diagnoses.length === 0) {
            diagsBody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-2">No historic diagnoses logged.</td></tr>`;
        } else {
            diagnoses.forEach(d => {
                row = document.createElement("tr");
                row.innerHTML = `<td>${d.date}</td><td><span class="badge bg-purple text-white" style="background-color: #9333ea;">${d.icdCode}</span></td><td class="fw-bold">${d.diagnosis}</td>`;
                diagsBody.appendChild(row);
            });
        }

        // Render Prescriptions Table
        const prescsBody = document.getElementById("recordPrescsBody");
        prescsBody.innerHTML = "";
        if (prescriptions.length === 0) {
            prescsBody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-2">No medications issued.</td></tr>`;
        } else {
            prescriptions.forEach(p => {
                let medSummary = p.medicines.map(m => `${m.name} (${m.dosage})`).join(", ");
                row = document.createElement("tr");
                row.innerHTML = `<td>${p.date}</td><td class="small">${medSummary}</td><td>${p.notes || 'None'}</td>`;
                prescsBody.appendChild(row);
            });
        }
    }

    renderPatientRecord();
});
