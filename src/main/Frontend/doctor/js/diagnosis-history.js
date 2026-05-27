document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const diagnosisTableBody = document.getElementById("diagnosisTableBody");
    const searchInput = document.getElementById("searchDiagnosis");


    function renderDiagnoses() {
        const diags = window.HospitalStore.getDiagnoses();
        const query = searchInput ? searchInput.value.toLowerCase() : "";

        diagnosisTableBody.innerHTML = "";

        const filtered = diags.filter(d => {
            return d.patientName.toLowerCase().includes(query) || d.diagnosis.toLowerCase().includes(query) || d.icdCode.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            diagnosisTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No diagnostic history records matching criteria found.</td></tr>`;
            return;
        }

        // Sort descending by date
        filtered.reverse().forEach(d => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-medium">${d.date}</td>
                <td class="fw-bold">${d.patientName}</td>
                <td>${d.diagnosis}</td>
                <td><span class="badge bg-purple text-white px-2 py-1" style="background-color: #9333ea;">${d.icdCode}</span></td>
                <td>
                    <button class="btn btn-outline-primary btn-sm view-btn" data-id="${d.id}">
                        <i class="bi bi-eye"></i> View details
                    </button>
                </td>
            `;
            diagnosisTableBody.appendChild(row);
        });

        attachActionListeners();
    }

    function attachActionListeners() {
        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = this.getAttribute("data-id");
                const diags = window.HospitalStore.getDiagnoses();
                const d = diags.find(item => item.id == id);
                if (d) {
                    alert(`Diagnosis Details:\n\nPatient: ${d.patientName}\nDate: ${d.date}\nSymptoms: ${d.symptoms}\nDiagnosis: ${d.diagnosis} (${d.icdCode})\nTreatment notes: ${d.notes || 'None logged.'}`);
                }
            });
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderDiagnoses);

    renderDiagnoses();
});
