document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const recentPrescsBody = document.getElementById("recentPrescsBody");
    const lowStockAlertsBody = document.getElementById("lowStockAlertsBody");

    function renderDashboardData() {
        const prescs = window.HospitalStore.getPrescriptions();
        const inventory = window.HospitalStore.getInventory();

        // 1. Calculate stats cards
        const pendingList = prescs.filter(p => p.status === "PENDING" || !p.status);
        document.getElementById("statPendingCount").textContent = pendingList.length;

        const dispensedList = prescs.filter(p => p.status === "DISPENSED");
        document.getElementById("statDispensedCount").textContent = dispensedList.length;

        const lowStockList = inventory.filter(i => i.stock < 10);
        document.getElementById("statLowStockCount").textContent = lowStockList.length;

        const availableList = inventory.filter(i => i.stock >= 10);
        document.getElementById("statAvailableCount").textContent = availableList.length;

        // 2. Render Recent Prescriptions Table
        recentPrescsBody.innerHTML = "";
        const activePrescs = prescs.slice(0, 3);
        
        if (activePrescs.length === 0) {
            recentPrescsBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No prescriptions found.</td></tr>`;
        } else {
            activePrescs.forEach(p => {
                let badgeClass = "bg-primary-subtle text-primary";
                if (p.status === "DISPENSED") badgeClass = "bg-success-subtle text-success";
                
                let medNames = p.medicines.map(m => m.name).join(", ");
                if (medNames.length > 30) medNames = medNames.substring(0, 27) + "...";

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="fw-semibold text-primary">#PRC-0${p.id}</td>
                    <td class="fw-bold">${p.patientName}</td>
                    <td class="small text-muted">${medNames}</td>
                    <td><span class="badge badge-custom ${badgeClass}">${p.status || 'PENDING'}</span></td>
                    <td>
                        <a href="dispense-medication.html?id=${p.id}" class="btn btn-outline-primary btn-sm">Review & Dispense</a>
                    </td>
                `;
                recentPrescsBody.appendChild(row);
            });
        }

        // 3. Render Low Stock Alerts Section
        lowStockAlertsBody.innerHTML = "";
        const lowStocks = inventory.filter(i => i.stock < 10).slice(0, 3);
        
        if (lowStocks.length === 0) {
            lowStockAlertsBody.innerHTML = `<div class="text-center text-success small py-3"><i class="bi bi-shield-check"></i> All pharmaceutical inventory levels are sufficient!</div>`;
        } else {
            lowStocks.forEach(i => {
                const item = document.createElement("div");
                item.className = "d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded";
                item.innerHTML = `
                    <div>
                        <div class="fw-bold small text-dark">${i.name}</div>
                        <div class="text-muted small">Qty Remaining: <span class="text-danger fw-bold">${i.stock}</span></div>
                    </div>
                    <a href="low-stock-alerts.html" class="btn btn-link btn-sm p-0 text-decoration-none">Restock</a>
                `;
                lowStockAlertsBody.appendChild(item);
            });
        }
    }

    renderDashboardData();
});
