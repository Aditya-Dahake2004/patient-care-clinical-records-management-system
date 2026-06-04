document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const dispensedTableBody = document.getElementById("dispensedTableBody");
    const searchInput = document.getElementById("searchHistory");

    function renderDispensedHistory() {
        const prescs = window.HospitalStore.getPrescriptions();
        const query = searchInput ? searchInput.value.toLowerCase() : "";

        // Only display DISPENSED prescriptions
        const dispensedList = prescs.filter(p => p.status === "DISPENSED");

        dispensedTableBody.innerHTML = "";

        const filtered = dispensedList.filter(p => {
            return p.patientName.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            dispensedTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No dispensed medication records found in the archive.</td></tr>`;
            return;
        }

        filtered.reverse().forEach(p => {
            let medNames = p.medicines.map(m => `${m.name} (${m.dosage})`).join(", ");
            if (medNames.length > 50) medNames = medNames.substring(0, 47) + "...";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-medium">${p.date}</td>
                <td class="fw-bold">${p.patientName}</td>
                <td class="small text-muted">${medNames}</td>
                <td><span class="badge badge-custom bg-success-subtle text-success">DISPENSED</span></td>
                <td>
                    <button class="btn btn-outline-primary btn-sm view-btn" data-id="${p.id}">
                        <i class="bi bi-eye"></i> View details
                    </button>
                </td>
            `;
            dispensedTableBody.appendChild(row);
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
                    alert(`Dispensed Medication Order:\n\nPatient: ${p.patientName}\nDate: ${p.date}\n\nMedications Dispensed:\n${medList}\n\nNotes: ${p.notes || 'None'}`);
                }
            });
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderDispensedHistory);

    renderDispensedHistory();
});
