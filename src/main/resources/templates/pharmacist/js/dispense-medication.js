document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const prescId = urlParams.get("id");

    if (!prescId) {
        alert("Error: No prescription specified. Redirecting to queue.");
        window.location.href = "pending-prescriptions.html";
        return;
    }

    const prescription = window.HospitalStore.getPrescriptions().find(p => p.id == prescId);
    if (!prescription) {
        alert("Error: Prescription order not found. Redirecting to queue.");
        window.location.href = "pending-prescriptions.html";
        return;
    }

    // Render demographics
    document.getElementById("patName").textContent = prescription.patientName;
    document.getElementById("prescDate").textContent = prescription.date;
    document.getElementById("prescIdTitle").textContent = `#PRC-0${prescription.id}`;

    // Query patient MRN
    const patients = window.HospitalStore.getPatients();
    const patientObj = patients.find(p => p.id == prescription.patientId);
    document.getElementById("patMRN").textContent = patientObj ? patientObj.mrn : "Not Specified";

    // Render Medicine List inside review card
    const medListBody = document.getElementById("medListBody");
    medListBody.innerHTML = "";

    prescription.medicines.forEach(m => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="fw-bold">${m.name}</td>
            <td>${m.dosage}</td>
            <td>${m.frequency}</td>
            <td>${m.duration}</td>
            <td><span class="badge bg-success-subtle text-success">Verified</span></td>
        `;
        medListBody.appendChild(row);
    });

    document.getElementById("intakeNotes").textContent = prescription.notes || "No special intake guidelines logged by the physician.";

    // Dispense Button handler
    const dispenseBtn = document.getElementById("confirmDispenseBtn");
    if (dispenseBtn) {
        dispenseBtn.addEventListener("click", function() {
            if (confirm("Are you sure you want to dispense this outpatient order set?")) {
                // 1. Decrement inventory stock counts for each medicine
                prescription.medicines.forEach(m => {
                    // Subtract a default quantity (e.g. 1 packet/bottle or 30 pills as simulated)
                    window.HospitalStore.updateInventoryStock(m.name, 10);
                });

                // 2. Shift prescription status to DISPENSED
                window.HospitalStore.updatePrescriptionStatus(prescId, "DISPENSED");

                alert("Prescription order dispensed successfully!\n\nInventory updated. Outpatient labels generated.");
                window.location.href = "dispensed-history.html";
            }
        });
    }

    // Cancel Button handler
    const cancelBtn = document.getElementById("cancelDispenseBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function() {
            window.history.back();
        });
    }
});
