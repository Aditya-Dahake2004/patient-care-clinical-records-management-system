document.addEventListener("DOMContentLoaded", function() {
    // Ensure HospitalStore is ready
    if (!window.HospitalStore) {
        console.error("HospitalStore state manager not found!");
        return;
    }

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Elements
    const todayApptsCountEl = document.getElementById("todayApptsCount");
    const newRegistrationsCountEl = document.getElementById("newRegistrationsCount");
    const pendingApptsCountEl = document.getElementById("pendingApptsCount");
    
    const recentPatientsBody = document.getElementById("recentPatientsBody");
    const upcomingApptsBody = document.getElementById("upcomingApptsBody");

    function renderDashboardData() {
        const patients = window.HospitalStore.getPatients();
        const appointments = window.HospitalStore.getAppointments();

        // Calculations
        // 1. Appointments Today
        const todayAppts = appointments.filter(a => a.date === todayStr || a.date === "2026-05-27"); // Simulating active date
        todayApptsCountEl.textContent = todayAppts.length;

        // 2. New registrations (let's say registered recently, matching our high id counts)
        newRegistrationsCountEl.textContent = patients.length;

        // 3. Pending/booked appointments
        const bookedCount = appointments.filter(a => a.status === "BOOKED").length;
        pendingApptsCountEl.textContent = bookedCount;

        // Render Recent Patients Table (limit to 3)
        recentPatientsBody.innerHTML = "";
        const recentPatients = [...patients].reverse().slice(0, 3);
        recentPatients.forEach(p => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold text-primary">${p.mrn}</td>
                <td class="fw-bold">${p.name}</td>
                <td>${p.gender}</td>
                <td>${p.phone}</td>
                <td>
                    <a href="patient-details.html?id=${p.id}" class="btn btn-outline-primary btn-sm">View</a>
                </td>
            `;
            recentPatientsBody.appendChild(row);
        });

        // Render Upcoming Appointments Table
        upcomingApptsBody.innerHTML = "";
        const activeAppts = appointments.filter(a => a.status === "BOOKED").slice(0, 3);
        
        if (activeAppts.length === 0) {
            upcomingApptsBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No upcoming appointments scheduled today.</td></tr>`;
            return;
        }

        activeAppts.forEach(a => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold text-primary">#APT-0${a.id}</td>
                <td>
                    <div class="fw-bold">${a.patientName}</div>
                </td>
                <td>
                    <div class="fw-semibold">${a.doctorName}</div>
                    <div class="text-muted small">${a.department}</div>
                </td>
                <td>${a.time}</td>
                <td>
                    <span class="badge badge-custom bg-primary-subtle text-primary">${a.status}</span>
                </td>
            `;
            upcomingApptsBody.appendChild(row);
        });
    }

    // Run render
    renderDashboardData();
});
