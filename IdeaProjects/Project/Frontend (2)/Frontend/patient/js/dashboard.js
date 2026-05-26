document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientId = 1; // Simulated Logged In Patient: John Doe

    function initDashboard() {
        const patientObj = window.HospitalStore.getPatientById(patientId);
        if (!patientObj) return;

        // Render Demographics
        const initials = patientObj.name.split(" ").map(n => n[0]).join("");
        document.getElementById("welcomeAvatar").textContent = initials;
        document.getElementById("lblWelcomeName").textContent = `Welcome Back, ${patientObj.name}`;
        document.getElementById("topNavPatientName").textContent = patientObj.name;
        document.getElementById("lblMrn").textContent = patientObj.mrn;

        // Fetch user data arrays
        const appts = (window.HospitalStore.getAppointments() || []).filter(a => a.patientId == patientId);
        const prescs = (window.HospitalStore.getPrescriptions() || []).filter(p => p.patientId == patientId);
        const invoices = (window.HospitalStore.getInvoices() || []).filter(i => i.patientId == patientId);
        const diagnoses = (window.HospitalStore.getDiagnoses() || []).filter(d => d.patientId == patientId);

        // Stats counts
        document.getElementById("cntAppointments").textContent = appts.length;
        document.getElementById("cntPrescriptions").textContent = prescs.filter(p => p.status === "PENDING").length;
        document.getElementById("cntBills").textContent = invoices.filter(i => i.status === "Pending" || i.status === "Overdue").length;
        document.getElementById("cntHistory").textContent = diagnoses.length;

        // Populate Nearest Upcoming Appointment
        const upcomingApptContainer = document.getElementById("upcomingApptContainer");
        const nextAppt = appts.find(a => a.status === "BOOKED");

        if (nextAppt) {
            upcomingApptContainer.innerHTML = `
                <div class="card p-3 border-left border-primary bg-light-subtle rounded">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <span class="badge bg-primary mb-2">Confirmed Scheduled Visit</span>
                            <h5 class="fw-bold mb-1">${nextAppt.doctorName}</h5>
                            <p class="text-muted small mb-2"><i class="bi bi-tag-fill me-1"></i>${nextAppt.department} | Reason: ${nextAppt.reason}</p>
                            <div class="d-flex flex-wrap gap-3">
                                <span class="text-dark small"><i class="bi bi-calendar3 text-primary me-1"></i>${nextAppt.date}</span>
                                <span class="text-dark small"><i class="bi bi-clock text-primary me-1"></i>${nextAppt.time}</span>
                            </div>
                        </div>
                        <div class="col-md-4 text-md-end mt-3 mt-md-0">
                            <a href="appointment-details.html?id=${nextAppt.id}" class="btn btn-primary btn-sm">
                                <i class="bi bi-eye-fill me-1"></i> View Prep Slip
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            upcomingApptContainer.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="bi bi-calendar2-x fs-3 d-block mb-2"></i>
                    No upcoming appointments scheduled.
                </div>
            `;
        }

        // Populate Recent Prescriptions
        const recentPrescBody = document.getElementById("recentPrescBody");
        recentPrescBody.innerHTML = "";

        // Flatten prescription medicines from the last 3 prescriptions
        const recentPrescs = prescs.slice(-3).reverse();
        let renderedAny = false;

        recentPrescs.forEach(pr => {
            pr.medicines.forEach(m => {
                renderedAny = true;
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><strong>${m.name}</strong> <span class="text-muted small">(${m.dosage})</span></td>
                    <td><span class="badge bg-light text-dark border">${m.frequency}</span></td>
                    <td class="text-secondary small">${pr.date}</td>
                `;
                recentPrescBody.appendChild(row);
            });
        });

        if (!renderedAny) {
            recentPrescBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted py-3">
                        No active prescription records available.
                    </td>
                </tr>
            `;
        }
    }

    initDashboard();
});
