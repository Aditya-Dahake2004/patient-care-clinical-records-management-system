document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }
    const prescriptionTableBody = document.getElementById("prescriptionTableBody");
    const searchInput = document.getElementById("searchPrescription");

    function renderPrescriptions() {
        const prescs = window.HospitalStore.getPrescriptions();
        const query = searchInput ? searchInput.value.toLowerCase() : "";

        prescriptionTableBody.innerHTML = "";

        const filtered = prescs.filter(p => {
            const medMatch = p.medicines.some(m => m.name.toLowerCase().includes(query));
            return p.patientName.toLowerCase().includes(query) || medMatch;
        });

        if (filtered.length === 0) {
            prescriptionTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No prescription history records matching criteria found.</td></tr>`;
            return;
        }

        // Sort descending by date
        filtered.reverse().forEach(p => {
            let medSummary = p.medicines.map(m => `${m.name} (${m.dosage})`).join(", ");
            if (medSummary.length > 50) medSummary = medSummary.substring(0, 47) + "...";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-medium">${p.date}</td>
                <td class="fw-bold">${p.patientName}</td>
                <td class="small text-muted">${medSummary}</td>
                <td>
                    <div class="d-flex gap-1">
                        <button class="btn btn-outline-primary btn-sm view-btn" data-id="${p.id}">
                            <i class="bi bi-eye"></i> View
                        </button>
                        <button class="btn btn-outline-secondary btn-sm print-btn" data-id="${p.id}">
                            <i class="bi bi-printer"></i> Print
                        </button>
                    </div>
                </td>
            `;
            prescriptionTableBody.appendChild(row);
        });

        attachActionListeners();
    }

    function attachActionListeners() {
        // View Action
        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = this.getAttribute("data-id");
                const prescs = window.HospitalStore.getPrescriptions();
                const p = prescs.find(item => item.id == id);
                if (p) {
                    let medList = p.medicines.map(m => `- ${m.name} [Dose: ${m.dosage} | Freq: ${m.frequency} | Duration: ${m.duration}]`).join("\n");
                    alert(`Prescription Details:\n\nPatient: ${p.patientName}\nDate: ${p.date}\n\nMedications:\n${medList}\n\nIntake Notes: ${p.notes || 'None logged.'}`);
                }
            });
        });

        // Print Action
        document.querySelectorAll(".print-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = this.getAttribute("data-id");
                const prescs = window.HospitalStore.getPrescriptions();
                const p = prescs.find(item => item.id == id);
                if (p) {
                    alert(`Simulating document print job for patient ${p.patientName}...\n\nPrescription file successfully sent to clinical printer.`);
                }
            });
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderPrescriptions);

    renderPrescriptions();
});
