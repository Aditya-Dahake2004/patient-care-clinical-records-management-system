document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const apptTableBody = document.getElementById("apptTableBody");
    const searchInput = document.getElementById("searchAppt");
    const statusFilter = document.getElementById("filterStatus");

    function renderAppointments() {
        const appts = window.HospitalStore.getAppointments();
        const query = searchInput ? searchInput.value.toLowerCase() : "";
        const statusVal = statusFilter ? statusFilter.value : "All";

        apptTableBody.innerHTML = "";

        const filtered = appts.filter(a => {
            const matchesQuery = a.patientName.toLowerCase().includes(query) || a.doctorName.toLowerCase().includes(query) || a.department.toLowerCase().includes(query);
            const matchesStatus = statusVal === "All" || a.status === statusVal;
            return matchesQuery && matchesStatus;
        });

        if (filtered.length === 0) {
            apptTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No appointments scheduled matching the selected filters.</td></tr>`;
            return;
        }

        // Sort descending so recent/upcoming appear nicely
        filtered.reverse().forEach(a => {
            let statusBadge = "bg-primary-subtle text-primary";
            if (a.status === "COMPLETED") statusBadge = "bg-success-subtle text-success";
            if (a.status === "CANCELLED") statusBadge = "bg-danger-subtle text-danger";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold text-primary">#APT-0${a.id}</td>
                <td class="fw-bold">${a.patientName}</td>
                <td>
                    <div class="fw-semibold">${a.doctorName}</div>
                    <div class="text-muted small">${a.department}</div>
                </td>
                <td>${a.date}</td>
                <td>${a.time}</td>
                <td><span class="badge badge-custom ${statusBadge}">${a.status}</span></td>
                <td>
                    <div class="d-flex gap-1">
                        <a href="appointment-details.html?id=${a.id}" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-eye"></i> View
                        </a>
                        ${a.status === 'BOOKED' ? `
                            <a href="reschedule-appointment.html?id=${a.id}" class="btn btn-outline-warning btn-sm text-dark">
                                <i class="bi bi-calendar-event"></i> Reschedule
                            </a>
                        ` : ''}
                    </div>
                </td>
            `;
            apptTableBody.appendChild(row);
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderAppointments);
    if (statusFilter) statusFilter.addEventListener("change", renderAppointments);

    // Initial render
    renderAppointments();
});
