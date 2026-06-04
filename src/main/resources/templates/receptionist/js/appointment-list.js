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

    const searchInput = document.getElementById("searchAppt");
    const statusSelect = document.getElementById("filterStatus");

    function renderAppointments() {
        if (!window.HospitalStore) return;
        const appts = window.HospitalStore.getAppointments() || [];
        const tbody = document.getElementById("apptsTableBody");
        if (!tbody) return;
        tbody.innerHTML = "";

        const query = searchInput.value.toLowerCase().trim();
        const statusVal = statusSelect.value;

        const filtered = appts.filter(a => {
            const matchesSearch = a.patientName.toLowerCase().includes(query) || 
                                 a.doctorName.toLowerCase().includes(query);
            const matchesStatus = statusVal === "All" || a.status === statusVal;
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        <i class="bi bi-calendar-x fs-2 d-block mb-2"></i>
                        No scheduled appointments match search filters.
                    </td>
                </tr>
            `;
            return;
        }

        filtered.forEach(a => {
            const tr = document.createElement("tr");

            let statusBadgeClass = "bg-primary";
            if (a.status === "COMPLETED") statusBadgeClass = "bg-success";
            else if (a.status === "CANCELLED") statusBadgeClass = "bg-danger";

            tr.innerHTML = `
                <td><strong>${a.patientName}</strong></td>
                <td>${a.doctorName}</td>
                <td><span class="badge bg-light text-dark border">${a.department}</span></td>
                <td>${a.date}</td>
                <td>${a.time}</td>
                <td><span class="badge ${statusBadgeClass}">${a.status}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderAppointments);
    if (statusSelect) statusSelect.addEventListener("change", renderAppointments);

    renderAppointments();
});
