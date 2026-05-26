document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const apptId = urlParams.get("id");

    if (!apptId) {
        alert("Error: No appointment specified. Redirecting to appointment list.");
        window.location.href = "appointment-list.html";
        return;
    }

    function renderAppointmentDetails() {
        const appt = window.HospitalStore.getAppointmentById(apptId);
        if (!appt) {
            alert("Error: Appointment record not found. Redirecting to appointment list.");
            window.location.href = "appointment-list.html";
            return;
        }

        // Query matching patient details for extensive stats
        const patient = window.HospitalStore.getPatientById(appt.patientId);

        // Render Values
        document.getElementById("apptIdTitle").textContent = `#APT-0${appt.id}`;
        document.getElementById("apptStatusBadge").textContent = appt.status;
        
        // Remove old status classes and set new one
        const badge = document.getElementById("apptStatusBadge");
        badge.className = "badge badge-custom";
        if (appt.status === "BOOKED") badge.classList.add("bg-primary-subtle", "text-primary");
        if (appt.status === "COMPLETED") badge.classList.add("bg-success-subtle", "text-success");
        if (appt.status === "CANCELLED") badge.classList.add("bg-danger-subtle", "text-danger");

        document.getElementById("summaryCard").className = `card clinic-card p-4 mb-4 appt-summary-card ${appt.status}`;

        document.getElementById("patName").textContent = appt.patientName;
        document.getElementById("patMRN").textContent = patient ? patient.mrn : "Not Specified";
        document.getElementById("patDOB").textContent = patient ? patient.dob : "Not Specified";
        document.getElementById("patPhone").textContent = patient ? patient.phone : "Not Specified";

        document.getElementById("docName").textContent = appt.doctorName;
        document.getElementById("docDept").textContent = appt.department;
        document.getElementById("apptDate").textContent = appt.date;
        document.getElementById("apptTime").textContent = appt.time;
        document.getElementById("apptReason").textContent = appt.reason || "Routine Medical Checkup";

        // Action Buttons highlighters
        const actionArea = document.getElementById("apptActionsArea");
        if (appt.status === "BOOKED") {
            actionArea.innerHTML = `
                <a href="reschedule-appointment.html?id=${appt.id}" class="btn btn-warning text-dark px-4">
                    <i class="bi bi-calendar-event me-1"></i> Reschedule Appointment
                </a>
                <button id="cancelApptBtn" class="btn btn-outline-danger px-4">
                    <i class="bi bi-x-circle me-1"></i> Cancel Appointment
                </button>
            `;

            // Bind cancel action
            document.getElementById("cancelApptBtn").addEventListener("click", function() {
                if (confirm("Are you sure you want to cancel this outpatient appointment?")) {
                    window.HospitalStore.updateAppointment(appt.id, { status: "CANCELLED" });
                    alert("Appointment cancelled successfully!");
                    renderAppointmentDetails();
                }
            });
        } else {
            actionArea.innerHTML = `<span class="text-muted small"><i class="bi bi-info-circle me-1"></i> Schedules that are completed or cancelled cannot be rescheduled.</span>`;
        }
    }

    // Run render
    renderAppointmentDetails();
});
