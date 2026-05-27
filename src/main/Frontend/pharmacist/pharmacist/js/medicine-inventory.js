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

    function renderInventory() {
        if (!window.HospitalStore) return;
        const inventory = window.HospitalStore.getInventory() || [];
        const tbody = document.getElementById("inventoryTableBody");
        if (!tbody) return;
        tbody.innerHTML = "";

        inventory.forEach(i => {
            const tr = document.createElement("tr");

            let badgeClass = "bg-success";
            if (i.status === "Low Stock") badgeClass = "bg-warning text-dark";
            else if (i.status === "Out of Stock") badgeClass = "bg-danger";

            tr.innerHTML = `
                <td><strong>${i.name}</strong></td>
                <td><span class="badge bg-light text-dark border">${i.dosage}</span></td>
                <td class="fw-bold">${i.stock}</td>
                <td>${i.category}</td>
                <td><span class="badge ${badgeClass}">${i.status}</span></td>
                <td>
                    <button class="btn btn-outline-primary btn-sm btn-restock" data-id="${i.id}">
                        <i class="bi bi-plus-lg"></i> Restock (+100)
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Bind restock
        document.querySelectorAll(".btn-restock").forEach(btn => {
            btn.addEventListener("click", function() {
                const medId = this.getAttribute("data-id");
                window.HospitalStore.restockInventoryItem(medId, 100);
                renderInventory();
                alert("Inventory stocks successfully replenished with 100 units!");
            });
        });
    }

    renderInventory();
});
