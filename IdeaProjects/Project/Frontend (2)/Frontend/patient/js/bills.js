document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientId = 1;
    const searchBill = document.getElementById("searchBill");
    const filterStatus = document.getElementById("filterStatus");
    const tbody = document.getElementById("billsTableBody");

    function renderBills() {
        const allInvoices = window.HospitalStore.getInvoices() || [];
        const myInvoices = allInvoices.filter(i => i.patientId == patientId);

        const searchQuery = searchBill.value.toLowerCase().trim();
        const statusQuery = filterStatus.value;

        tbody.innerHTML = "";

        const filtered = myInvoices.filter(i => {
            const matchesSearch = i.invoiceNumber.toLowerCase().includes(searchQuery);
            const matchesStatus = statusQuery === "All" || i.status === statusQuery;
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        <i class="bi bi-wallet2 fs-2 d-block mb-2"></i>
                        No invoice statements matching criteria.
                    </td>
                </tr>
            `;
            return;
        }

        filtered.forEach(i => {
            const tr = document.createElement("tr");

            let statusBadge = "";
            if (i.status === "Paid") {
                statusBadge = '<span class="badge bg-success">Paid</span>';
            } else if (i.status === "Pending") {
                statusBadge = '<span class="badge bg-warning text-dark">Pending</span>';
            } else {
                statusBadge = '<span class="badge bg-danger">Overdue</span>';
            }

            const grossTotal = parseFloat(i.subTotal + (i.tax || 0)).toFixed(2);
            const insurance = parseFloat(i.insuranceCoverage || 0).toFixed(2);
            const netPayable = parseFloat(i.patientPayable).toFixed(2);

            tr.innerHTML = `
                <td class="fw-semibold text-primary">${i.invoiceNumber}</td>
                <td>${i.date}</td>
                <td>$${grossTotal}</td>
                <td>$${insurance}</td>
                <td class="fw-bold">$${netPayable}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="d-flex gap-2">
                        <a href="bill-details.html?id=${i.id}" class="btn btn-primary btn-sm">
                            <i class="bi bi-file-earmark-spreadsheet me-1"></i> Details
                        </a>
                        <button class="btn btn-outline-secondary btn-sm btn-print-bill" data-id="${i.id}">
                            <i class="bi bi-printer"></i>
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Print invoice handler
        document.querySelectorAll(".btn-print-bill").forEach(btn => {
            btn.addEventListener("click", function() {
                const bId = this.getAttribute("data-id");
                alert(`Directing to physical print utility for Statement: INV-00${bId}`);
            });
        });
    }

    if (searchBill) searchBill.addEventListener("input", renderBills);
    if (filterStatus) filterStatus.addEventListener("change", renderBills);

    renderBills();
});
