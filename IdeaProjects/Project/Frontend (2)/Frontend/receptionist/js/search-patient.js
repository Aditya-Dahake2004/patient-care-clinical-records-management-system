document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const searchForm = document.getElementById("patientSearchForm");
    const resultsContainer = document.getElementById("searchResultsContainer");
    const searchResultsBody = document.getElementById("searchResultsBody");
    const emptyState = document.getElementById("searchEmptyState");

    if (searchForm) {
        searchForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const nameQuery = document.getElementById("searchName").value.trim().toLowerCase();
            const mrnQuery = document.getElementById("searchMRN").value.trim().toLowerCase();
            const phoneQuery = document.getElementById("searchPhone").value.trim().toLowerCase();

            if (!nameQuery && !mrnQuery && !phoneQuery) {
                alert("Please specify at least one search criterion.");
                return;
            }

            const patients = window.HospitalStore.getPatients();

            const filtered = patients.filter(p => {
                const nameMatch = nameQuery ? p.name.toLowerCase().includes(nameQuery) : true;
                const mrnMatch = mrnQuery ? p.mrn.toLowerCase().includes(mrnQuery) : true;
                const phoneMatch = phoneQuery ? p.phone.toLowerCase().includes(phoneQuery) : true;
                
                return nameMatch && mrnMatch && phoneMatch;
            });

            searchResultsBody.innerHTML = "";

            if (filtered.length === 0) {
                resultsContainer.classList.add("d-none");
                emptyState.classList.remove("d-none");
            } else {
                emptyState.classList.add("d-none");
                resultsContainer.classList.remove("d-none");

                filtered.forEach(p => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td class="fw-semibold text-primary">${p.mrn}</td>
                        <td class="fw-bold">${p.name}</td>
                        <td>${p.gender}</td>
                        <td>${p.phone}</td>
                        <td>
                            <a href="patient-details.html?id=${p.id}" class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-eye"></i> View Profile
                            </a>
                            <a href="book-appointment.html?patientId=${p.id}" class="btn btn-primary btn-sm ms-1">
                                <i class="bi bi-calendar-plus"></i> Book
                            </a>
                        </td>
                    `;
                    searchResultsBody.appendChild(row);
                });
            }
        });
    }

    // Reset button should clear results too
    const resetBtn = document.getElementById("resetSearchBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", function() {
            resultsContainer.classList.add("d-none");
            emptyState.classList.add("d-none");
        });
    }
});
