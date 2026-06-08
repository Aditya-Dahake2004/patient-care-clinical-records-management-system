document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientTableBody = document.getElementById("patientTableBody");
    const searchInput = document.getElementById("searchPatient");

    function renderTodaysRound() {
        const appointments = window.HospitalStore.getAppointments();
        const patients = window.HospitalStore.getPatients();
        const query = searchInput ? searchInput.value.toLowerCase() : "";

        // Today's round appointments (booked or completed)
        const scheduledToday = appointments.filter(a => a.status === "BOOKED" || a.status === "COMPLETED");

        patientTableBody.innerHTML = "";

        const filtered = scheduledToday.filter(a => {
            return a.patientName.toLowerCase().includes(query) || a.doctorName.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            patientTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No scheduled patient consultations found for today.</td></tr>`;
            return;
        }

        filtered.forEach(a => {
            const patient = patients.find(p => p.id == a.patientId);
            const mrn = patient ? patient.mrn : "Not Set";

            let statusBadge = "bg-primary-subtle text-primary";
            if (a.status === "COMPLETED") statusBadge = "bg-success-subtle text-success";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold text-primary">${mrn}</td>
                <td class="fw-bold">${a.patientName}</td>
                <td>${a.time}</td>
                <td><span class="badge badge-custom ${statusBadge}">${a.status}</span></td>
                <td>
                    <div class="d-flex gap-1">
                        <a href="patient-record-details.html?id=${a.patientId}" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-folder2-open"></i> View Chart
                        </a>
                        <a href="create-diagnosis.html?patientId=${a.patientId}" class="btn btn-primary btn-sm">
                            <i class="bi bi-patch-question"></i> Diagnose
                        </a>
                    </div>
                </td>
            `;
            patientTableBody.appendChild(row);
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderTodaysRound);

    renderTodaysRound();
});
