document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientId = 1;
    const searchDoctor = document.getElementById("searchDoctor");
    const filterStatus = document.getElementById("filterStatus");
    const grid = document.getElementById("appointmentsGrid");

    function renderAppointments() {
        const allAppts = window.HospitalStore.getAppointments() || [];
        const myAppts = allAppts.filter(a => a.patientId == patientId);
        
        const searchQuery = searchDoctor.value.toLowerCase().trim();
        const statusQuery = filterStatus.value;

        grid.innerHTML = "";

        const filtered = myAppts.filter(a => {
            const matchesSearch = a.doctorName.toLowerCase().includes(searchQuery) || 
                                 a.department.toLowerCase().includes(searchQuery);
            const matchesStatus = statusQuery === "All" || a.status === statusQuery;
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5 text-muted">
                    <i class="bi bi-calendar-x fs-1 d-block mb-3"></i>
                    No appointment records matching search filters.
                </div>
            `;
            return;
        }

        filtered.forEach(a => {
            const col = document.createElement("div");
            col.className = "col-md-6";

            let statusBadge = "";
            let cardClass = "";
            
            if (a.status === "BOOKED") {
                statusBadge = '<span class="badge bg-primary">Upcoming</span>';
                cardClass = "appt-card";
            } else if (a.status === "COMPLETED") {
                statusBadge = '<span class="badge bg-success">Completed</span>';
                cardClass = "appt-card completed";
            } else {
                statusBadge = '<span class="badge bg-danger">Cancelled</span>';
                cardClass = "appt-card cancelled";
            }

            col.innerHTML = `
                <div class="card clinic-card p-3 h-100 ${cardClass}">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="badge doctor-badge mb-2">${a.department}</span>
                            <h5 class="fw-bold mb-1">${a.doctorName}</h5>
                        </div>
                        ${statusBadge}
                    </div>
                    
                    <hr class="my-2 text-muted">

                    <div class="row g-2 mb-3 small">
                        <div class="col-6">
                            <span class="text-muted d-block">Scheduled Date:</span>
                            <strong><i class="bi bi-calendar-event me-1"></i>${a.date}</strong>
                        </div>
                        <div class="col-6 text-end">
                            <span class="text-muted d-block">Time Slot:</span>
                            <strong><i class="bi bi-clock me-1"></i>${a.time}</strong>
                        </div>
                    </div>

                    <p class="text-muted small mb-3 flex-grow-1">
                        <strong>Reason:</strong> ${a.reason}
                    </p>

                    <div class="d-flex justify-content-between">
                        <a href="appointment-details.html?id=${a.id}" class="btn btn-primary btn-sm px-3">
                            <i class="bi bi-file-earmark-text me-1"></i> View Details
                        </a>
                        <button class="btn btn-outline-secondary btn-sm px-3 btn-download-slip" data-id="${a.id}">
                            <i class="bi bi-download me-1"></i> Slip
                        </button>
                    </div>
                </div>
            `;

            grid.appendChild(col);
        });

        // Event listener for mock slip download
        document.querySelectorAll(".btn-download-slip").forEach(btn => {
            btn.addEventListener("click", function() {
                const apptId = this.getAttribute("data-id");
                alert(`Preparing mock appointment slip PDF for Appointment ID: APPT-00${apptId}\n\nDownload starting automatically...`);
            });
        });
    }

    if (searchDoctor) searchDoctor.addEventListener("input", renderAppointments);
    if (filterStatus) filterStatus.addEventListener("change", renderAppointments);

    renderAppointments();
});
