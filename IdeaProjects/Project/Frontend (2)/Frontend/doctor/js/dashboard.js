document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const todayApptsBody = document.getElementById("todayApptsBody");
    const recentVisitsBody = document.getElementById("recentVisitsBody");

    function renderDashboardData() {
        const patients = window.HospitalStore.getPatients();
        const appointments = window.HospitalStore.getAppointments();
        const diagnoses = window.HospitalStore.getDiagnoses();
        const prescriptions = window.HospitalStore.getPrescriptions();

        // 1. Calculate stats cards
        // Today's scheduled patients (booked or completed)
        const scheduledToday = appointments.filter(a => a.status === "BOOKED" || a.status === "COMPLETED");
        document.getElementById("statPatientsCount").textContent = scheduledToday.length;

        // Upcoming appointments
        const upcomingCount = appointments.filter(a => a.status === "BOOKED").length;
        document.getElementById("statUpcomingCount").textContent = upcomingCount;

        // Diagnoses recorded in the database
        document.getElementById("statDiagnosesCount").textContent = diagnoses.length;

        // Prescriptions issued
        document.getElementById("statPrescriptionsCount").textContent = prescriptions.length;

        // 2. Render Today's Scheduled Appointments Table
        todayApptsBody.innerHTML = "";
        const activeAppts = appointments.filter(a => a.status === "BOOKED" || a.status === "COMPLETED").slice(0, 3);
        
        if (activeAppts.length === 0) {
            todayApptsBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No patients scheduled for consultation today.</td></tr>`;
        } else {
            activeAppts.forEach(a => {
                let badgeClass = "bg-primary-subtle text-primary";
                if (a.status === "COMPLETED") badgeClass = "bg-success-subtle text-success";
                
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="fw-semibold text-primary">#APT-0${a.id}</td>
                    <td class="fw-bold">${a.patientName}</td>
                    <td>${a.time}</td>
                    <td><span class="badge badge-custom ${badgeClass}">${a.status}</span></td>
                    <td>
                        <a href="patient-record-details.html?id=${a.patientId}" class="btn btn-outline-primary btn-sm">Record Chart</a>
                    </td>
                `;
                todayApptsBody.appendChild(row);
            });
        }

        // 3. Render Recent Patient Visits
        recentVisitsBody.innerHTML = "";
        const recentPatients = patients.slice(0, 3);
        recentPatients.forEach(p => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-bold">${p.name}</td>
                <td>${p.gender}</td>
                <td>${p.phone}</td>
                <td>
                    <a href="patient-medical-history.html?id=${p.id}" class="btn btn-link btn-sm p-0 text-decoration-none">View History</a>
                </td>
            `;
            recentVisitsBody.appendChild(row);
        });
    }

    renderDashboardData();
});
