document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientId = 1;

    function renderHistory() {
        const diagnoses = (window.HospitalStore.getDiagnoses() || []).filter(d => d.patientId == patientId);
        const notes = (window.HospitalStore.getClinicalNotes() || []).filter(n => n.patientId == patientId);

        const timeline = document.getElementById("timelineContainer");
        timeline.innerHTML = "";

        // Combine clinical notes and diagnoses
        const events = [];

        diagnoses.forEach(d => {
            events.push({
                type: "diagnosis",
                date: d.date,
                title: d.diagnosis,
                subtitle: `ICD-10 Code: ${d.icdCode || "N/A"}`,
                description: `Symptoms: ${d.symptoms}\nNotes: ${d.notes || ""}`
            });
        });

        notes.forEach(n => {
            events.push({
                type: "note",
                date: n.date,
                title: "Clinical Progress Note Recorded",
                subtitle: `Physician Visit Round`,
                description: n.note,
                vitals: n.vitals
            });
        });

        // Sort events by date descending
        events.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (events.length === 0) {
            timeline.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="bi bi-calendar3-x fs-3 d-block mb-2"></i>
                    No medical history EMR records registered.
                </div>
            `;
            return;
        }

        events.forEach(ev => {
            const evDiv = document.createElement("div");
            evDiv.className = `timeline-event ${ev.type === "diagnosis" ? "diagnosis" : ""}`;

            let vitalsSection = "";
            if (ev.vitals) {
                vitalsSection = `
                    <div class="d-flex flex-wrap gap-2 mt-3 mb-2">
                        <span class="vitals-pill small text-dark">BP: <strong>${ev.vitals.bp || "N/A"}</strong></span>
                        <span class="vitals-pill small text-dark">Pulse: <strong>${ev.vitals.hr || "N/A"}</strong></span>
                        <span class="vitals-pill small text-dark">Temp: <strong>${ev.vitals.temp || "N/A"}</strong></span>
                        <span class="vitals-pill small text-dark">Resp: <strong>${ev.vitals.rr || "N/A"}</strong></span>
                    </div>
                `;
            }

            evDiv.innerHTML = `
                <span class="text-secondary small fw-semibold d-block mb-1"><i class="bi bi-calendar-check me-1"></i>${ev.date}</span>
                <h6 class="fw-bold text-dark mb-1">${ev.title}</h6>
                <span class="text-primary small d-block mb-2 fw-semibold">${ev.subtitle}</span>
                <p class="text-muted small mb-0" style="white-space: pre-line;">${ev.description}</p>
                ${vitalsSection}
            `;

            timeline.appendChild(evDiv);
        });

        // Populate Vitals Sidebar with the latest recorded vitals
        const vitalsContainer = document.getElementById("vitalsContainer");
        vitalsContainer.innerHTML = "";

        const notesWithVitals = notes.filter(n => n.vitals);
        if (notesWithVitals.length > 0) {
            const latest = notesWithVitals[notesWithVitals.length - 1].vitals;
            vitalsContainer.innerHTML = `
                <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                        <span class="text-muted small"><i class="bi bi-thermometer-half text-danger me-2"></i>Body Temperature</span>
                        <strong class="fs-6">${latest.temp || "N/A"}</strong>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                        <span class="text-muted small"><i class="bi bi-heartpulse text-primary me-2"></i>Blood Pressure</span>
                        <strong class="fs-6">${latest.bp || "N/A"}</strong>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                        <span class="text-muted small"><i class="bi bi-activity text-success me-2"></i>Heart Rate</span>
                        <strong class="fs-6">${latest.hr || "N/A"}</strong>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                        <span class="text-muted small"><i class="bi bi-wind text-info me-2"></i>Respiration Rate</span>
                        <strong class="fs-6">${latest.rr || "N/A"}</strong>
                    </div>
                </div>
            `;
        } else {
            vitalsContainer.innerHTML = `
                <div class="text-center py-3 text-muted small">
                    No vitals recordings present in EMR records.
                </div>
            `;
        }
    }

    renderHistory();
});
