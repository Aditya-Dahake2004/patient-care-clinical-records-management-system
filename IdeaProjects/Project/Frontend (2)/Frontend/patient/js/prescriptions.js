document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientId = 1;
    const searchPresc = document.getElementById("searchPresc");
    const filterStatus = document.getElementById("filterStatus");
    const tbody = document.getElementById("prescriptionTableBody");

    function renderPrescriptions() {
        const allPrescs = window.HospitalStore.getPrescriptions() || [];
        const myPrescs = allPrescs.filter(p => p.patientId == patientId);

        const searchQuery = searchPresc.value.toLowerCase().trim();
        const statusQuery = filterStatus.value;

        tbody.innerHTML = "";

        const filtered = myPrescs.filter(p => {
            const medNames = p.medicines.map(m => m.name.toLowerCase()).join(" ");
            const matchesSearch = medNames.includes(searchQuery) || 
                                 p.patientName.toLowerCase().includes(searchQuery);
            const matchesStatus = statusQuery === "All" || p.status === statusQuery;
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        <i class="bi bi-prescription2 fs-2 d-block mb-2"></i>
                        No prescriptions matching search filters.
                    </td>
                </tr>
            `;
            return;
        }

        filtered.forEach(p => {
            const tr = document.createElement("tr");

            const prescCode = `RX-${String(p.id).padStart(5, '0')}`;
            const date = p.date || new Date().toISOString().split("T")[0];
            const doctor = p.doctorName || "Dr. Robert Chen";
            const medicineCount = p.medicines.length;

            let statusBadge = "";
            if (p.status === "PENDING") {
                statusBadge = '<span class="badge bg-warning text-dark">Active / Pending Dispense</span>';
            } else {
                statusBadge = '<span class="badge bg-success">Dispensed / Fulfilled</span>';
            }

            tr.innerHTML = `
                <td class="fw-semibold text-primary">${prescCode}</td>
                <td>${date}</td>
                <td><strong>${doctor}</strong></td>
                <td><span class="badge bg-light text-dark border">${medicineCount} Medication(s)</span></td>
                <td>${statusBadge}</td>
                <td>
                    <div class="d-flex gap-2">
                        <a href="prescription-details.html?id=${p.id}" class="btn btn-primary btn-sm">
                            <i class="bi bi-eye-fill me-1"></i> View Dosage
                        </a>
                        <button class="btn btn-outline-secondary btn-sm btn-print-rx" data-id="${p.id}">
                            <i class="bi bi-printer"></i>
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Print prescription handler
        document.querySelectorAll(".btn-print-rx").forEach(btn => {
            btn.addEventListener("click", function() {
                const rxId = this.getAttribute("data-id");
                alert(`Directing to physical print utility for Prescription: RX-00${rxId}`);
            });
        });
    }

    if (searchPresc) searchPresc.addEventListener("input", renderPrescriptions);
    if (filterStatus) filterStatus.addEventListener("change", renderPrescriptions);

    renderPrescriptions();
});
