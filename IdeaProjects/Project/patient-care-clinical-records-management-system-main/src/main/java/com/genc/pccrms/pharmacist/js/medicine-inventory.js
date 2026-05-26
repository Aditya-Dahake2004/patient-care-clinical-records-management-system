document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const inventoryTableBody = document.getElementById("inventoryTableBody");
    const searchInput = document.getElementById("searchInventory");
    const categoryFilter = document.getElementById("filterCategory");

    function renderInventory() {
        const inv = window.HospitalStore.getInventory();
        const query = searchInput ? searchInput.value.toLowerCase() : "";
        const categoryVal = categoryFilter ? categoryFilter.value : "All";

        inventoryTableBody.innerHTML = "";

        const filtered = inv.filter(i => {
            const matchesQuery = i.name.toLowerCase().includes(query) || i.category.toLowerCase().includes(query);
            const matchesCategory = categoryVal === "All" || i.category === categoryVal;
            return matchesQuery && matchesCategory;
        });

        if (filtered.length === 0) {
            inventoryTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No medication items found matching selected filters.</td></tr>`;
            return;
        }

        filtered.forEach(i => {
            let statusBadge = "available";
            if (i.status === "Low Stock") statusBadge = "low";
            if (i.status === "Out of Stock") statusBadge = "out";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold">#MED-0${i.id}</td>
                <td class="fw-bold text-dark">${i.name}</td>
                <td>${i.category}</td>
                <td class="fw-semibold">${i.stock} units</td>
                <td>${i.expiry}</td>
                <td><span class="stock-badge ${statusBadge}">${i.status}</span></td>
                <td>
                    <a href="medicine-details.html?id=${i.id}" class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-eye"></i> Details
                    </a>
                </td>
            `;
            inventoryTableBody.appendChild(row);
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderInventory);
    if (categoryFilter) categoryFilter.addEventListener("change", renderInventory);

    renderInventory();
});
