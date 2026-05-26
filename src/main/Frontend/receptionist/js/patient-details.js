document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore data manager missing!");
        return;
    }

    // Get patient ID from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("id");

    if (!patientId) {
        alert("Error: No patient specified. Redirecting to patient list.");
        window.location.href = "patient-list.html";
        return;
    }

    const patient = window.HospitalStore.getPatientById(patientId);
    if (!patient) {
        alert("Error: Patient record not found. Redirecting to patient list.");
        window.location.href = "patient-list.html";
        return;
    }

    // Render demographic details
    document.getElementById("patientNameTitle").textContent = patient.name;
    document.getElementById("patientMRNBadge").textContent = patient.mrn;
    document.getElementById("avatarInitials").textContent = patient.name.split(" ").map(n => n[0]).join("");
    
    document.getElementById("detailMRN").textContent = patient.mrn;
    document.getElementById("detailName").textContent = patient.name;
    document.getElementById("detailDOB").textContent = patient.dob;
    document.getElementById("detailGender").textContent = patient.gender;
    document.getElementById("detailPhone").textContent = patient.phone;
    document.getElementById("detailAddress").textContent = patient.address || "Not Provided";
    document.getElementById("detailEmergencyName").textContent = patient.emergencyContactName || "Not Provided";
    document.getElementById("detailEmergencyPhone").textContent = patient.emergencyContactPhone || "Not Provided";

    // Set Edit profile link
    document.getElementById("editPatientBtn").setAttribute("href", `update-patient.html?id=${patient.id}`);
    document.getElementById("bookPatientApptBtn").setAttribute("href", `book-appointment.html?patientId=${patient.id}`);

    // Render Patient's Appointments
    const appointments = window.HospitalStore.getAppointments();
    const patientAppts = appointments.filter(a => a.patientId == patient.id);
    const appointmentHistoryBody = document.getElementById("appointmentHistoryBody");

    if (patientAppts.length === 0) {
        appointmentHistoryBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No appointments scheduled for this patient.</td></tr>`;
        return;
    }

    patientAppts.forEach(a => {
        const row = document.createElement("tr");
        let badgeClass = "bg-primary-subtle text-primary";
        if (a.status === "COMPLETED") badgeClass = "bg-success-subtle text-success";
        if (a.status === "CANCELLED") badgeClass = "bg-danger-subtle text-danger";

        row.innerHTML = `
            <td class="fw-semibold">#APT-0${a.id}</td>
            <td>${a.doctorName} (${a.department})</td>
            <td>${a.date}</td>
            <td>${a.time}</td>
            <td><span class="badge badge-custom ${badgeClass}">${a.status}</span></td>
        `;
        appointmentHistoryBody.appendChild(row);
    });
});
