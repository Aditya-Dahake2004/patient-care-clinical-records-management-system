document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientSelect = document.getElementById("notesPatientSelect");
    const notesTimeline = document.getElementById("notesTimeline");
    const saveNoteForm = document.getElementById("saveNoteForm");


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
            renderClinicalNotes(this.value);
        });
    }

    function renderClinicalNotes(patientId) {
        if (!patientId) {
            notesTimeline.innerHTML = `<div class="text-center text-muted py-5"><i class="bi bi-journal-text display-4 d-block mb-3"></i>Please select a patient to view or record clinical intake logs.</div>`;
            return;
        }

        const notes = window.HospitalStore.getClinicalNotes().filter(n => n.patientId == patientId);
        
        notesTimeline.innerHTML = "";

        if (notes.length === 0) {
            notesTimeline.innerHTML = `<div class="text-center text-muted py-4">No clinical consultation notes logged for this patient yet. Feel free to add a new note below.</div>`;
            return;
        }

        const list = document.createElement("div");
        list.className = "timeline-clinical";

        // Render descending order (most recent first)
        [...notes].reverse().forEach(n => {
            const item = document.createElement("div");
            item.className = "timeline-item note";
            item.innerHTML = `
                <div class="timeline-date">${n.date}</div>
                <div class="card clinic-card p-3 shadow-none border-1">
                    <div class="d-flex flex-wrap gap-3 mb-2 bg-light p-2 rounded small text-dark fw-semibold">
                        <span><i class="bi bi-thermometer-half text-danger"></i> Temp: ${n.vitals.temp}</span>
                        <span><i class="bi bi-activity text-primary"></i> BP: ${n.vitals.bp}</span>
                        <span><i class="bi bi-heart-pulse text-success"></i> HR: ${n.vitals.hr}</span>
                        <span><i class="bi bi-wind text-info"></i> RR: ${n.vitals.rr}</span>
                    </div>
                    <p class="text-muted small mb-0">${n.note}</p>
                </div>
            `;
            list.appendChild(item);
        });

        notesTimeline.appendChild(list);
    }

    if (saveNoteForm) {
        saveNoteForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const patientId = patientSelect.value;
            const patientName = patientSelect.options[patientSelect.selectedIndex].text.split(" (")[0];
            const temp = document.getElementById("vitalTemp").value.trim();
            const bp = document.getElementById("vitalBP").value.trim();
            const hr = document.getElementById("vitalHR").value.trim();
            const rr = document.getElementById("vitalRR").value.trim();
            const noteText = document.getElementById("clinicalNoteText").value.trim();

            if (!patientId || !noteText) {
                alert("Please select a patient and type a clinical note summary.");
                return;
            }

            const todayStr = new Date().toISOString().split("T")[0];

            const noteObj = {
                patientId,
                patientName,
                vitals: {
                    temp: temp || "98.6°F",
                    bp: bp || "120/80 mmHg",
                    hr: hr || "72 bpm",
                    rr: rr || "16 bpm"
                },
                note: noteText,
                date: todayStr
            };

            const saved = window.HospitalStore.saveClinicalNote(noteObj);
            alert("Clinical round notes and vitals saved successfully!");
            
            // Clear note form
            saveNoteForm.reset();
            
            // Re-render notes
            renderClinicalNotes(patientId);
        });
    }

    // Default load
    renderClinicalNotes("");
});
