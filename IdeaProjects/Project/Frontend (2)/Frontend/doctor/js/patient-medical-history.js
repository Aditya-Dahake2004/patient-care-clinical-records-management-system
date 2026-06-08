document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientSelect = document.getElementById("historyPatientSelect");
    const timelineContainer = document.getElementById("timelineContainer");
    const profileCard = document.getElementById("historyProfileCard");

    // Load patients dropdown
    const patients = window.HospitalStore.getPatients();
    if (patientSelect) {
        patients.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = `${p.name} (${p.mrn})`;
            patientSelect.appendChild(opt);
        });

        patientSelect.addEventListener("change", function() {
            loadPatientHistory(this.value);
        });
    }

    function loadPatientHistory(patientId) {
        if (!patientId) {
            profileCard.classList.add("d-none");
            timelineContainer.innerHTML = `<div class="text-center text-muted py-5"><i class="bi bi-person-bounding-box display-4 d-block mb-3"></i>Please select a patient to view their longitudinal medical history chart.</div>`;
            return;
        }

        const patient = window.HospitalStore.getPatientById(patientId);
        if (!patient) return;

        // Display demographics panel
        profileCard.classList.remove("d-none");
        document.getElementById("patName").textContent = patient.name;
        document.getElementById("patMRN").textContent = patient.mrn;
        document.getElementById("patGender").textContent = patient.gender;
        document.getElementById("patDOB").textContent = patient.dob;
        document.getElementById("patPhone").textContent = patient.phone;

        // Fetch medical items
        const appointments = window.HospitalStore.getAppointments().filter(a => a.patientId == patientId);
        const diagnoses = window.HospitalStore.getDiagnoses().filter(d => d.patientId == patientId);
        const prescriptions = window.HospitalStore.getPrescriptions().filter(p => p.patientId == patientId);
        const notes = window.HospitalStore.getClinicalNotes().filter(n => n.patientId == patientId);

        // Build sorted chronological timeline events
        let events = [];

        appointments.forEach(a => {
            events.push({
                type: "appointment",
                date: a.date,
                title: `Encounter Scheduled - ${a.status}`,
                desc: `Department: ${a.department} | Doctor: ${a.doctorName}<br>Reason: ${a.reason || 'Not Specified'}`,
                class: "note"
            });
        });

        diagnoses.forEach(d => {
            events.push({
                type: "diagnosis",
                date: d.date,
                title: `Recorded Diagnosis: ${d.diagnosis} (${d.icdCode})`,
                desc: `Symptoms presented: ${d.symptoms}<br>Treatment details: ${d.notes}`,
                class: "diagnosis"
            });
        });

        prescriptions.forEach(p => {
            let medList = p.medicines.map(m => `${m.name} (${m.dosage} - ${m.frequency})`).join(", ");
            events.push({
                type: "prescription",
                date: p.date,
                title: `Prescription Issued`,
                desc: `Medications: ${medList}<br>Directions: ${p.notes}`,
                class: "prescription"
            });
        });

        notes.forEach(n => {
            events.push({
                type: "note",
                date: n.date,
                title: `Intake & Clinical Note Added`,
                desc: `Note: ${n.note}<br>Vitals recorded: BP: ${n.vitals.bp} | HR: ${n.vitals.hr} | Temp: ${n.vitals.temp} | RR: ${n.vitals.rr}`,
                class: "note"
            });
        });

        // Sort events descending by date
        events.sort((a, b) => new Date(b.date) - new Date(a.date));

        timelineContainer.innerHTML = "";

        if (events.length === 0) {
            timelineContainer.innerHTML = `<div class="text-center text-muted py-5">No historic records or rounds found for this patient.</div>`;
            return;
        }

        const timelineList = document.createElement("div");
        timelineList.className = "timeline-clinical";

        events.forEach(ev => {
            const item = document.createElement("div");
            item.className = `timeline-item ${ev.class}`;
            item.innerHTML = `
                <div class="timeline-date">${ev.date}</div>
                <div class="fw-bold text-dark mb-1">${ev.title}</div>
                <div class="text-muted small">${ev.desc}</div>
            `;
            timelineList.appendChild(item);
        });

        timelineContainer.appendChild(timelineList);
    }

    // Auto load if passed in URL query
    const urlParams = new URLSearchParams(window.location.search);
    const preId = urlParams.get("id");
    if (preId) {
        if (patientSelect) {
            patientSelect.value = preId;
        }
        loadPatientHistory(preId);
    } else {
        loadPatientHistory("");
    }
});
