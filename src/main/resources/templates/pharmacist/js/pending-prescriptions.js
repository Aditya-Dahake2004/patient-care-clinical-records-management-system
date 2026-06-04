document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const pendingTableBody = document.getElementById("pendingTableBody");
    const searchInput = document.getElementById("searchPending");

    function renderPendingPrescriptions() {
        const prescs = window.HospitalStore.getPrescriptions();
        const query = searchInput ? searchInput.value.toLowerCase() : "";

        // Only display PENDING prescriptions
        const pendingList = prescs.filter(p => p.status === "PENDING" || !p.status);

        pendingTableBody.innerHTML = "";

        const filtered = pendingList.filter(p => {
            return p.patientName.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            pendingTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No pending medication orders found.</td></tr>`;
            return;
        }

        filtered.reverse().forEach(p => {
            let medNames = p.medicines.map(m => `${m.name} (${m.dosage})`).join(", ");
            if (medNames.length > 45) medNames = medNames.substring(0, 42) + "...";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold text-primary">#PRC-0${p.id}</td>
                <td class="fw-bold">${p.patientName}</td>
                <td>${p.date}</td>
                <td class="small text-muted">${medNames}</td>
                <td><span class="badge badge-custom bg-warning-subtle text-warning">PENDING</span></td>
                <td>
                    <div class="d-flex gap-1">
                        <button class="btn btn-outline-primary btn-sm view-btn" data-id="${p.id}">
                            <i class="bi bi-eye"></i> View
                        </button>
                        <a href="dispense-medication.html?id=${p.id}" class="btn btn-success btn-sm">
                            <i class="bi bi-check-lg"></i> Dispense
                        </a>
                    </div>
                </td>
            `;
            pendingTableBody.appendChild(row);
        });

        attachActionListeners();
    }

    function attachActionListeners() {
        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = this.getAttribute("data-id");
                const prescs = window.HospitalStore.getPrescriptions();
                const p = prescs.find(item => item.id == id);
                if (p) {
                    let medList = p.medicines.map(m => `- ${m.name} [Dose: ${m.dosage} | Freq: ${m.frequency} | Duration: ${m.duration}]`).join("\n");
                    alert(`Prescription Review:\n\nPatient: ${p.patientName}\nDate: ${p.date}\n\nMedications Ordered:\n${medList}\n\nIntake Guidelines: ${p.notes || 'None'}`);
                }
            });
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderPendingPrescriptions);

    renderPendingPrescriptions();
});
