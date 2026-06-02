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
        const patientId = 1;
        const prescs = (window.HospitalStore.getPrescriptions() || []).filter(p => p.patientId == patientId);
        const tbody = document.getElementById("prescriptionsBody");

        if (tbody) {
            tbody.innerHTML = "";

            if (prescs.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-muted py-3">
                            No active medications cataloged in your EMR files.
                        </td>
                    </tr>
                `;
                return;
            }

            prescs.forEach(p => {
                p.medicines.forEach(m => {
                    const tr = document.createElement("tr");

                    let badgeClass = "bg-warning text-dark";
                    if (p.status === "DISPENSED") badgeClass = "bg-success";

                    tr.innerHTML = `
                        <td><strong>${m.name}</strong></td>
                        <td><span class="badge bg-light text-dark border">${m.dosage}</span></td>
                        <td>${m.frequency}</td>
                        <td>${m.duration}</td>
                        <td>${p.date}</td>
                        <td><span class="badge ${badgeClass}">${p.status}</span></td>
                    `;
                    tbody.appendChild(tr);
                });
            });
        }
    }
});
