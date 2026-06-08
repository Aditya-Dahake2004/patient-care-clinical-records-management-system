document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientSelect = document.getElementById("diagPatient");
    const diagForm = document.getElementById("createDiagnosisForm");

    // Load patients dropdown
    const patients = window.HospitalStore.getPatients();
    if (patientSelect) {
        patients.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = `${p.name} (${p.mrn})`;
            patientSelect.appendChild(opt);
        });

        // Pre-select patient if ID query is passed
        const urlParams = new URLSearchParams(window.location.search);
        const preSelectedId = urlParams.get("patientId");
        if (preSelectedId) {
            patientSelect.value = preSelectedId;
        }
    }

    if (diagForm) {
        diagForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const patientId = patientSelect.value;
            const patientName = patientSelect.options[patientSelect.selectedIndex].text.split(" (")[0];
            const symptoms = document.getElementById("diagSymptoms").value.trim();
            const diagnosis = document.getElementById("diagName").value.trim();
            const icdCode = document.getElementById("diagICD").value.trim();
            const notes = document.getElementById("diagNotes").value.trim();

            if (!patientId || !symptoms || !diagnosis || !icdCode) {
                alert("Please fill all the required diagnostic values.");
                return;
            }

            const todayStr = new Date().toISOString().split("T")[0];

            const diagObj = {
                patientId,
                patientName,
                symptoms,
                diagnosis,
                icdCode,
                notes,
                date: todayStr
            };

            const saved = window.HospitalStore.saveDiagnosis(diagObj);
            alert(`Diagnosis logged successfully!\n\nPatient: ${saved.patientName}\nDiagnosis: ${saved.diagnosis}\nICD Code: ${saved.icdCode}`);

            window.location.href = "diagnosis-history.html";
        });
    }
});
