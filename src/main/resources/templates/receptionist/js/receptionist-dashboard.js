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
        const patients = window.HospitalStore.getPatients() || [];
        const appts = window.HospitalStore.getAppointments() || [];

        document.getElementById("cntNewPatients").textContent = patients.length;
        document.getElementById("cntTodayAppts").textContent = appts.length;

        const tbody = document.getElementById("todayApptsBody");
        if (tbody) {
            tbody.innerHTML = "";
            appts.forEach(a => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${a.patientName}</strong></td>
                    <td>${a.doctorName}</td>
                    <td><span class="badge bg-light text-dark border">${a.time}</span></td>
                    <td><span class="badge bg-success-subtle text-success">${a.status}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
    }
});
