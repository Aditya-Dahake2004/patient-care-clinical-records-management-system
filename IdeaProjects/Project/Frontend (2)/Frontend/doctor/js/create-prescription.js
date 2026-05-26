document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientSelect = document.getElementById("prescPatient");
    const addMedBtn = document.getElementById("addMedicationBtn");
    const medicationListContainer = document.getElementById("medicationListContainer");
    const prescForm = document.getElementById("createPrescriptionForm");

    // Local list of drafted medicines
    let draftedMedicines = [];

    // Load patients dropdown
    const patients = window.HospitalStore.getPatients();
    if (patientSelect) {
        patients.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = `${p.name} (${p.mrn})`;
            patientSelect.appendChild(opt);
        });

        // Pre-select if patient ID query is present
        const urlParams = new URLSearchParams(window.location.search);
        const preId = urlParams.get("patientId");
        if (preId) {
            patientSelect.value = preId;
        }
    }

    // Add medicine to local draft list
    if (addMedBtn) {
        addMedBtn.addEventListener("click", function() {
            const name = document.getElementById("medName").value.trim();
            const dosage = document.getElementById("medDosage").value.trim();
            const frequency = document.getElementById("medFrequency").value;
            const duration = document.getElementById("medDuration").value.trim();

            if (!name || !dosage || !frequency || !duration) {
                alert("Please complete all medication descriptors (name, dose, frequency, duration) before adding.");
                return;
            }

            // Push to local draft
            draftedMedicines.push({ name, dosage, frequency, duration });

            // Clear inputs
            document.getElementById("medName").value = "";
            document.getElementById("medDosage").value = "";
            document.getElementById("medFrequency").value = "Once Daily";
            document.getElementById("medDuration").value = "";

            renderDraftedMedicines();
        });
    }

    function renderDraftedMedicines() {
        medicationListContainer.innerHTML = "";
        
        if (draftedMedicines.length === 0) {
            medicationListContainer.innerHTML = `<div class="text-center text-muted small py-3">No medications added to this prescription yet.</div>`;
            return;
        }

        draftedMedicines.forEach((med, idx) => {
            const div = document.createElement("div");
            div.className = "medication-badge-row";
            div.innerHTML = `
                <div>
                    <span class="fw-bold text-dark">${med.name}</span>
                    <span class="text-muted small ms-2">(${med.dosage} - ${med.frequency} for ${med.duration})</span>
                </div>
                <button type="button" class="btn btn-sm btn-link text-danger p-0 delete-draft-med" data-index="${idx}">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            medicationListContainer.appendChild(div);
        });

        // Attach delete handlers
        document.querySelectorAll(".delete-draft-med").forEach(btn => {
            btn.addEventListener("click", function() {
                const idx = parseInt(this.getAttribute("data-index"));
                draftedMedicines.splice(idx, 1);
                renderDraftedMedicines();
            });
        });
    }

    // Submit prescription
    if (prescForm) {
        prescForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const patientId = patientSelect.value;
            const patientName = patientSelect.options[patientSelect.selectedIndex].text.split(" (")[0];
            const notes = document.getElementById("prescNotes").value.trim();

            if (!patientId) {
                alert("Please select a patient.");
                return;
            }

            if (draftedMedicines.length === 0) {
                alert("Please add at least one medication to the prescription.");
                return;
            }

            const todayStr = new Date().toISOString().split("T")[0];

            const prescObj = {
                patientId,
                patientName,
                medicines: draftedMedicines,
                notes,
                date: todayStr
            };

            const saved = window.HospitalStore.savePrescription(prescObj);
            alert(`Prescription generated successfully!\n\nPatient: ${saved.patientName}\nTotal Medicines: ${saved.medicines.length}`);

            window.location.href = "prescription-history.html";
        });
    }

    // Default load empty state
    renderDraftedMedicines();
});
