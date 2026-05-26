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

    const appt = window.HospitalStore.getAppointmentById(apptId);
    if (!appt) {
        alert("Error: Appointment record not found. Redirecting to appointment list.");
        window.location.href = "appointment-list.html";
        return;
    }

    // Pre-fill fields
    document.getElementById("patName").value = appt.patientName;
    document.getElementById("docName").value = appt.doctorName;
    document.getElementById("deptName").value = appt.department;
    document.getElementById("currentDate").value = appt.date;
    document.getElementById("currentTime").value = appt.time;
    document.getElementById("reschedDate").value = appt.date;

    // Time slots renderer
    let selectedTimeSlot = appt.time; // Default to existing
    const slotContainer = document.getElementById("timeSlotContainer");
    const slots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:45 AM", "11:30 AM", "01:15 PM", "02:00 PM", "02:30 PM", "03:15 PM"];

    if (slotContainer) {
        slots.forEach(slot => {
            const btn = document.createElement("div");
            btn.className = "slot-btn";
            btn.textContent = slot;

            if (slot === appt.time) {
                btn.classList.add("selected");
            }

            // Random disabling
            if (Math.random() < 0.2 && slot !== appt.time) {
                btn.classList.add("disabled");
            } else {
                btn.addEventListener("click", function() {
                    document.querySelectorAll(".slot-btn").forEach(s => s.classList.remove("selected"));
                    btn.classList.add("selected");
                    selectedTimeSlot = slot;
                });
            }
            slotContainer.appendChild(btn);
        });
    }

    // Reschedule form submission
    const reschedForm = document.getElementById("rescheduleApptForm");
    if (reschedForm) {
        reschedForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const date = document.getElementById("reschedDate").value;

            if (!date) {
                alert("Please select a new date.");
                return;
            }

            if (!selectedTimeSlot) {
                alert("Please select a valid time slot.");
                return;
            }

            const success = window.HospitalStore.updateAppointment(apptId, {
                date: date,
                time: selectedTimeSlot
            });

            if (success) {
                alert("Appointment rescheduled successfully!");
                window.location.href = `appointment-details.html?id=${apptId}`;
            } else {
                alert("Error rescheduling. Please try again.");
            }
        });
    }

    // Cancel Button
    const cancelBtn = document.getElementById("cancelReschedBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function(e) {
            e.preventDefault();
            window.location.href = `appointment-details.html?id=${apptId}`;
        });
    }
});
