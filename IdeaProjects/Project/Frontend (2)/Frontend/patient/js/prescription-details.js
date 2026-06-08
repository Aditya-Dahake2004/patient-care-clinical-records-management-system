document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const rxId = urlParams.get("id");

    if (!rxId) {
        alert("Invalid access or prescription code missing!");
        window.location.href = "my-prescriptions.html";
        return;
    }

    const prescriptions = window.HospitalStore.getPrescriptions() || [];
    const rx = prescriptions.find(p => p.id == rxId);

    if (!rx) {
        alert("Prescription record not found!");
        window.location.href = "my-prescriptions.html";
        return;
    }

    // Populate demographics
    document.getElementById("lblDoc").textContent = rx.doctorName || "Dr. Emily Blunt";
    document.getElementById("lblDate").textContent = rx.date || new Date().toISOString().split("T")[0];
    document.getElementById("lblNotes").textContent = rx.notes || "Take medicines as per schedule. Complete the full course.";

    const statusBadge = document.getElementById("lblStatus");
    const statusText = document.getElementById("lblStatusText");

    if (rx.status === "PENDING") {
        statusBadge.className = "badge bg-warning text-dark";
        statusBadge.textContent = "Pending Dispensing";
        statusText.textContent = "This prescription is actively queued at the outpatient pharmacy dispensary. Please present your MRN card at the hospital counter to collect your medicines.";
    } else {
        statusBadge.className = "badge bg-success";
        statusBadge.textContent = "Dispensed / Completed";
        statusText.textContent = "This prescription was dispensed and collected successfully. If you need refills, please schedule a follow-up consultation with your doctor.";
    }

    // Populate Medicines
    const container = document.getElementById("medicinesContainer");
    container.innerHTML = "";

    rx.medicines.forEach(m => {
        const div = document.createElement("div");
        div.className = "prescription-item-row";
        div.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-5">
                    <h6 class="fw-bold mb-1 text-dark">${m.name}</h6>
                    <span class="text-muted small">Dosage: ${m.dosage}</span>
                </div>
                <div class="col-md-4">
                    <span class="badge bg-light text-dark border me-1"><i class="bi bi-clock me-1 text-primary"></i>${m.frequency}</span>
                </div>
                <div class="col-md-3 text-md-end mt-2 mt-md-0">
                    <span class="text-secondary small fw-semibold">Duration: ${m.duration}</span>
                </div>
            </div>
        `;
        container.appendChild(div);
    });

    // Bind Print button
    const printBtn = document.querySelector(".btn-print-sheet");
    if (printBtn) {
        printBtn.addEventListener("click", function() {
            window.print();
        });
    }
});
