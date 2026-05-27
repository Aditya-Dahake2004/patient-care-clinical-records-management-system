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
        const prescs = window.HospitalStore.getPrescriptions() || [];
        const inventory = window.HospitalStore.getInventory() || [];

        const pending = prescs.filter(p => p.status === "PENDING");
        document.getElementById("cntPendingOrders").textContent = pending.length;

        const lowStock = inventory.filter(i => i.stock < 10);
        document.getElementById("cntLowStock").textContent = lowStock.length;

        const tbody = document.getElementById("pendingOrdersBody");
        if (tbody) {
            tbody.innerHTML = "";
            
            if (pending.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center text-muted py-3">
                            No pending pharmacy orders cataloged.
                        </td>
                    </tr>
                `;
            } else {
                pending.forEach(p => {
                    const tr = document.createElement("tr");
                    const medSummary = p.medicines.map(m => `${m.name} (${m.dosage})`).join(", ");
                    tr.innerHTML = `
                        <td><strong>${p.patientName}</strong></td>
                        <td><code class="text-dark small">${medSummary}</code></td>
                        <td>${p.date}</td>
                        <td>
                            <a href="dispense-medication.html?id=${p.id}" class="btn btn-primary btn-sm">
                                <i class="bi bi-capsule"></i> Dispense
                            </a>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }
    }
});
