document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById("menu-toggle");
    const wrapper = document.getElementById("wrapper");
    if (menuToggle) {
        menuToggle.addEventListener("click", function(e) {
            e.preventDefault();
            wrapper.classList.toggle("toggled");
        });
    }

    const signOutBtn = document.getElementById("sign-out-btn");
    if (signOutBtn) {
        signOutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            if (confirm("Are you sure you want to sign out?")) {
                alert("Successfully signed out. Redirecting...");
                window.location.href = "../../common/pages/home.html";
            }
        });
    }

    if (window.HospitalStore) {
        const patientId = 1; // Simulated Patient: John Doe

        const appts = (window.HospitalStore.getAppointments() || []).filter(a => a.patientId == patientId);
        const prescs = (window.HospitalStore.getPrescriptions() || []).filter(p => p.patientId == patientId);
        const invoices = (window.HospitalStore.getInvoices() || []).filter(i => i.patientId == patientId);

        document.getElementById("cntAppointments").textContent = appts.length;
        document.getElementById("cntPrescriptions").textContent = prescs.filter(p => p.status === "PENDING").length;
        document.getElementById("cntBills").textContent = invoices.filter(i => i.status === "Pending" || i.status === "Overdue").length;

        // Populate upcoming visit card
        const container = document.getElementById("nextApptContainer");
        const next = appts.find(a => a.status === "BOOKED");

        if (next) {
            container.innerHTML = `
                <div class="card p-3 bg-light border-0 rounded">
                    <span class="badge bg-primary mb-2 align-self-start">Confirmed</span>
                    <h5 class="fw-bold mb-1">${next.doctorName}</h5>
                    <p class="text-secondary small mb-2"><i class="bi bi-tag-fill me-1"></i>${next.department} | Visit: ${next.reason}</p>
                    <div class="d-flex gap-3 small text-dark">
                        <span><i class="bi bi-calendar-event text-primary me-1"></i>${next.date}</span>
                        <span><i class="bi bi-clock text-primary me-1"></i>${next.time}</span>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="bi bi-calendar-x fs-3 d-block mb-2"></i>
                    No upcoming consultation visits scheduled.
                </div>
            `;
        }
    }
});
