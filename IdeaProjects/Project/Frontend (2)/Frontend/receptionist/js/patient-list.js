document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore data manager missing!");
        return;
    }

    const patientTableBody = document.getElementById("patientTableBody");
    const searchInput = document.getElementById("searchPatient");
    const genderFilter = document.getElementById("filterGender");

    function renderPatients() {
        const patients = window.HospitalStore.getPatients();
        const searchQuery = searchInput ? searchInput.value.toLowerCase() : "";
        const genderVal = genderFilter ? genderFilter.value : "All";

        patientTableBody.innerHTML = "";

        const filtered = patients.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.mrn.toLowerCase().includes(searchQuery) || p.phone.includes(searchQuery);
            const matchesGender = genderVal === "All" || p.gender === genderVal;
            return matchesSearch && matchesGender;
        });

        if (filtered.length === 0) {
            patientTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No patients registered in the database matching criteria.</td></tr>`;
            return;
        }

        filtered.forEach(p => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold text-primary">${p.mrn}</td>
                <td class="fw-bold">${p.name}</td>
                <td>${p.dob}</td>
                <td>${p.gender}</td>
                <td>${p.phone}</td>
                <td>
                    <div class="d-flex gap-1">
                        <a href="patient-details.html?id=${p.id}" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-eye"></i> View
                        </a>
                        <a href="update-patient.html?id=${p.id}" class="btn btn-outline-secondary btn-sm">
                            <i class="bi bi-pencil"></i> Edit
                        </a>
                    </div>
                </td>
            `;
            patientTableBody.appendChild(row);
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderPatients);
    if (genderFilter) genderFilter.addEventListener("change", renderPatients);

    // Initial render
    renderPatients();
});
