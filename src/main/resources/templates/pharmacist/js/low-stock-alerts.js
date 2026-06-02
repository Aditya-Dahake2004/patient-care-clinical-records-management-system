document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const alertsContainer = document.getElementById("alertsContainer");
    const emptyState = document.getElementById("alertsEmptyState");

    function renderLowStockAlerts() {
        const inventory = window.HospitalStore.getInventory();
        const lowStocks = inventory.filter(i => i.stock < 10);

        alertsContainer.innerHTML = "";

        if (lowStocks.length === 0) {
            emptyState.classList.remove("d-none");
            return;
        }

        emptyState.classList.add("d-none");

        lowStocks.forEach(i => {
            const card = document.createElement("div");
            card.className = "col-12 col-md-6 col-lg-4";
            
            let statusClass = "text-danger";
            if (i.status === "Low Stock") statusClass = "text-warning";

            card.innerHTML = `
                <div class="card clinic-card p-3 mb-3 border-danger-subtle">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-danger-subtle text-danger small">${i.status}</span>
                        <span class="small text-muted"><i class="bi bi-clock"></i> Exp: ${i.expiry}</span>
                    </div>
                    <h4 class="h6 fw-bold text-dark mb-1">${i.name}</h4>
                    <p class="text-muted small mb-3">Therapeutic Class: ${i.category}</p>
                    <div class="d-flex justify-content-between align-items-center border-top pt-2">
                        <div class="small">Stock Remaining: <span class="${statusClass} fw-bold">${i.stock} units</span></div>
                        <button class="btn btn-outline-danger btn-sm restock-btn" data-id="${i.id}">
                            <i class="bi bi-arrow-repeat"></i> Restock +100
                        </button>
                    </div>
                </div>
            `;
            alertsContainer.appendChild(card);
        });

        attachActionListeners();
    }

    function attachActionListeners() {
        document.querySelectorAll(".restock-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = this.getAttribute("data-id");
                
                // Simulate restock addition
                const success = window.HospitalStore.restockInventoryItem(id, 100);
                if (success) {
                    alert("Medication restocked successfully! 100 units added to pharmacy vault.");
                    renderLowStockAlerts();
                } else {
                    alert("Error restocking item. Please try again.");
                }
            });
        });
    }

    renderLowStockAlerts();
});
