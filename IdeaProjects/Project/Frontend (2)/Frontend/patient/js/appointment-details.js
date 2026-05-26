document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const apptId = urlParams.get("id");

    if (!apptId) {
        alert("Invalid access or appointment code missing!");
        window.location.href = "my-appointments.html";
        return;
    }

    const appt = window.HospitalStore.getAppointmentById(apptId);
    if (!appt) {
        alert("Consultation record not found!");
        window.location.href = "my-appointments.html";
        return;
    }

    // Populate Fields
    document.getElementById("lblDocName").textContent = appt.doctorName;
    document.getElementById("lblDept").textContent = appt.department;
    document.getElementById("lblDate").textContent = appt.date;
    document.getElementById("lblTime").textContent = appt.time;
    document.getElementById("lblReason").textContent = appt.reason;

    const statusBadge = document.getElementById("lblStatus");
    statusBadge.textContent = appt.status;
    if (appt.status === "BOOKED") {
        statusBadge.className = "badge bg-primary";
        statusBadge.textContent = "Upcoming Scheduled";
    } else if (appt.status === "COMPLETED") {
        statusBadge.className = "badge bg-success";
        statusBadge.textContent = "Completed Visit";
    } else {
        statusBadge.className = "badge bg-danger";
        statusBadge.textContent = "Cancelled Visit";
    }

    // Bind Print button
    const printBtn = document.querySelector(".btn-print-details");
    if (printBtn) {
        printBtn.addEventListener("click", function() {
            window.print();
        });
    }

    // Cancel Reschedule request
    const cancelBtn = document.getElementById("btnCancelAppt");
    if (cancelBtn) {
        if (appt.status !== "BOOKED") {
            cancelBtn.disabled = true;
            cancelBtn.classList.add("text-muted");
        }
        cancelBtn.addEventListener("click", function() {
            if (appt.status === "BOOKED") {
                alert(`Reschedule / Cancellation request for appointment APPT-00${apptId} has been sent successfully!\n\nOur clinic receptionist will contact you via registered phone shortly.`);
            }
        });
    }
});
