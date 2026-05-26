document.addEventListener("DOMContentLoaded", () => {
    routeEhrModule();
});

function routeEhrModule() {
    const path = window.location.pathname;
    
    if (path.includes("module3-ehr-management/index.html") || path.endsWith("module3-ehr-management/")) {
        renderEhrDashboard();
    } else if (path.includes("create-encounter.html")) {
        handleCreateEncounter();
    } else if (path.includes("medical-history.html")) {
        renderMedicalHistory();
    } else if (path.includes("diagnosis-tracking.html")) {
        renderDiagnosisTracking();
    } else if (path.includes("clinical-notes.html")) {
        renderClinicalNotes();
    } else if (path.includes("vitals-summary.html")) {
        renderVitalsSummary();
    }
}

function renderEhrDashboard() {
    const encounters = getBasicEncounters();
    document.getElementById("widget-total-encounters").innerText = encounters.length;
}

function handleCreateEncounter() {
    const patientDropdown = document.getElementById("enc-patient");
    if (patientDropdown) {
        const patients = getBasicPatients();
        patientDropdown.innerHTML = '<option value="" disabled selected>Select Patient</option>';
        patients.forEach(p => {
            patientDropdown.innerHTML += `<option value="${p.patientId}">${p.fullName} (${p.mrn})</option>`;
        });
    }

    const form = document.getElementById("createEncounterForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const patId = document.getElementById("enc-patient").value;
            const diagnosis = document.getElementById("enc-diagnosis").value.trim();
            const bp = document.getElementById("enc-bp").value.trim();
            const notes = document.getElementById("enc-notes").value.trim();
            
            if (!patId || !diagnosis || !bp || !notes) {
                alert("Please fill in all clinical parameters.");
                return;
            }
            
            let encounters = getBasicEncounters();
            const newId = encounters.length > 0 ? Math.max(...encounters.map(e => e.recordId)) + 1 : 201;
            
            const newEncounter = {
                recordId: newId,
                patientId: parseInt(patId),
                date: new Date().toISOString().split('T')[0],
                diagnosis,
                bp,
                notes
            };
            encounters.push(newEncounter);
            saveBasicEntity("b_encounters", encounters);
            
            showBasicAlert("Encounter saved successfully!", "success");
            setTimeout(() => {
                window.location.href = "medical-history.html?id=" + patId;
            }, 1500);
        });
    }
}

function renderMedicalHistory() {
    // 1. Populate the Patient Dropdown in the search form
    const patientSelect = document.getElementById("search-patient");
    if (patientSelect) {
        const patients = getBasicPatients();
        patientSelect.innerHTML = '<option value="">Select Patient...</option>';
        patients.forEach(p => {
            patientSelect.innerHTML += `<option value="${p.patientId}">${p.fullName}</option>`;
        });
    }

    // 2. Listen for the Load Chart button
    const loadBtn = document.getElementById("btn-load-chart");
    if (loadBtn) {
        loadBtn.addEventListener("click", () => {
            const patId = document.getElementById("search-patient").value;
            if (patId) {
                // Update URL parameter so it reloads the data cleanly
                window.location.href = `medical-history.html?id=${patId}`;
            } else {
                alert("Please select a Patient Name from the dropdown first.");
            }
        });
    }

    // 3. Render Data if an ID is present in the URL (e.g., after clicking Load Chart)
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get("id");

    if (patientId) {
        const encounters = getBasicEncounters().filter(e => e.patientId == patientId);
        const p = getBasicPatients().find(pat => pat.patientId == patientId);

        // Update the Demographics Banner
        if (p && document.getElementById("history-patient-name")) {
            document.getElementById("history-patient-name").innerText = p.fullName;
            document.getElementById("history-patient-mrn").innerText = p.mrn || "#Auto-Generated";
        }

        // Update the History Table
        const tableBody = document.getElementById("history-table-body");
        if (tableBody) {
            tableBody.innerHTML = "";
            if (encounters.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted border-bottom-0"><i class="bi bi-inbox fs-3 d-block mb-2"></i>No encounters found for this patient.</td></tr>`;
                return;
            }

            encounters.forEach(e => {
                tableBody.innerHTML += `
                    <tr class="border-bottom">
                        <td class="fw-semibold text-secondary py-3">${e.date}</td>
                        <td class="py-3"><span class="badge bg-light text-dark border">${e.diagnosis}</span></td>
                        <td class="py-3 text-danger fw-bold"><i class="bi bi-heart-pulse me-1"></i>${e.bp}</td>
                        <td class="py-3 text-muted small">${e.notes}</td>
                    </tr>
                `;
            });
        }
    }
}

function renderDiagnosisTracking() {
    const encounters = getBasicEncounters();
    const patients = getBasicPatients();
    const tableBody = document.getElementById("diagnosis-table-body");
    
    if (tableBody) {
        tableBody.innerHTML = "";
        encounters.forEach(e => {
            const p = patients.find(pat => pat.patientId == e.patientId);
            const patName = p ? p.fullName : "Unknown Patient";
            
            tableBody.innerHTML += `
                <tr>
                    <td>${e.date}</td>
                    <td>${patName}</td>
                    <td><strong>${e.diagnosis}</strong></td>
                    <td>${e.notes}</td>
                </tr>
            `;
        });
    }
}

function renderClinicalNotes() {
    const encounters = getBasicEncounters();
    const patients = getBasicPatients();
    const notesContainer = document.getElementById("notes-cards-list");
    
    if (notesContainer) {
        notesContainer.innerHTML = "";
        encounters.forEach(e => {
            const p = patients.find(pat => pat.patientId == e.patientId);
            const patName = p ? p.fullName : "Unknown Patient";
            
            notesContainer.innerHTML += `
                <div class="col-12 col-md-6">
                    <div class="card metric-card p-3 mb-3">
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <strong>${patName}</strong>
                            <small class="text-secondary">${e.date}</small>
                        </div>
                        <p class="text-dark small mb-1"><strong>Diagnosis:</strong> ${e.diagnosis}</p>
                        <p class="text-secondary small mb-0"><strong>Clinical Notes:</strong> ${e.notes}</p>
                    </div>
                </div>
            `;
        });
    }
}

function renderVitalsSummary() {
    const encounters = getBasicEncounters();
    const patients = getBasicPatients();
    const vitalsContainer = document.getElementById("vitals-cards-list");
    
    if (vitalsContainer) {
        vitalsContainer.innerHTML = "";
        encounters.forEach(e => {
            const p = patients.find(pat => pat.patientId == e.patientId);
            const patName = p ? p.fullName : "Unknown Patient";
            
            vitalsContainer.innerHTML += `
                <div class="col-12 col-md-4">
                    <div class="card metric-card p-3 mb-3 text-center">
                        <span class="text-secondary small fw-bold">${patName}</span>
                        <div class="text-primary fs-3 my-2"><i class="bi bi-heart-pulse"></i></div>
                        <h4 class="fw-bold mb-0">${e.bp}</h4>
                        <small class="text-muted">BP Checked: ${e.date}</small>
                    </div>
                </div>
            `;
        });
    }
}
