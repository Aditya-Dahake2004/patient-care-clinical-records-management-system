document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const invoiceTableBody = document.getElementById("invoiceTableBody");
    const searchInput = document.getElementById("searchInvoice");
    const statusFilter = document.getElementById("filterStatus");

    function renderInvoices() {
        const invs = window.HospitalStore.getInvoices();
        const query = searchInput ? searchInput.value.toLowerCase() : "";
        const statusVal = statusFilter ? statusFilter.value : "All";

        invoiceTableBody.innerHTML = "";

        const filtered = invs.filter(i => {
            const matchesQuery = i.patientName.toLowerCase().includes(query) || i.invoiceNumber.toLowerCase().includes(query);
            const matchesStatus = statusVal === "All" || i.status === statusVal;
            return matchesQuery && matchesStatus;
        });

        if (filtered.length === 0) {
            invoiceTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No invoices matching the filters found.</td></tr>`;
            return;
        }

        filtered.reverse().forEach(i => {
            let statusClass = "Pending";
            if (i.status === "Paid") statusClass = "Paid";
            if (i.status === "Overdue") statusClass = "Overdue";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold text-primary">${i.invoiceNumber}</td>
                <td class="fw-bold text-dark">${i.patientName}</td>
                <td>$${parseFloat(i.subTotal + i.tax).toFixed(2)}</td>
                <td>$${parseFloat(i.insuranceCoverage).toFixed(2)}</td>
                <td class="fw-bold text-danger">$${parseFloat(i.patientPayable).toFixed(2)}</td>
                <td><span class="invoice-badge ${statusClass}">${i.status}</span></td>
                <td>
                    <div class="d-flex gap-1">
                        <a href="invoice-details.html?id=${i.id}" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-eye"></i> View
                        </a>
                        <button class="btn btn-outline-secondary btn-sm print-btn" data-id="${i.id}">
                            <i class="bi bi-printer"></i> Print
                        </button>
                    </div>
                </td>
            `;
            invoiceTableBody.appendChild(row);
        });

        attachActionListeners();
    }

    function attachActionListeners() {
        document.querySelectorAll(".print-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = this.getAttribute("data-id");
                const item = window.HospitalStore.getInvoiceById(id);
                if (item) {
                    alert(`Simulating invoice print job...\n\nInvoice statement ${item.invoiceNumber} sent to accountant printer.`);
                }
            });
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderInvoices);
    if (statusFilter) statusFilter.addEventListener("change", renderInvoices);

    renderInvoices();
});
