document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const searchInput = document.getElementById("searchPayment");
    const filterMethod = document.getElementById("filterMethod");
    const tableBody = document.getElementById("paymentTableBody");
    const receiptModal = new bootstrap.Modal(document.getElementById("receiptModal"));
    const receiptModalBody = document.getElementById("receiptModalBody");

    function loadPayments() {
        const payments = window.HospitalStore.getPayments() || [];
        const searchQuery = searchInput.value.toLowerCase().trim();
        const methodFilter = filterMethod.value;

        // Clear existing table contents
        tableBody.innerHTML = "";

        // Filter payments
        const filteredPayments = payments.filter(p => {
            const matchesQuery = p.patientName.toLowerCase().includes(searchQuery) || 
                                 p.invoiceNumber.toLowerCase().includes(searchQuery);
            const matchesMethod = methodFilter === "All" || p.method === methodFilter;
            return matchesQuery && matchesMethod;
        });

        if (filteredPayments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        <i class="bi bi-wallet2 fs-2 d-block mb-2"></i>
                        No payment transactions recorded matching criteria.
                    </td>
                </tr>
            `;
            return;
        }

        // Render rows
        filteredPayments.forEach(p => {
            const row = document.createElement("tr");

            // Format Receipt ID like REC-00101
            const receiptId = `REC-${String(p.id).padStart(5, '0')}`;
            const formattedAmount = parseFloat(p.amount).toFixed(2);

            let methodBadgeClass = "bg-primary-light text-primary";
            if (p.method === "Cash") methodBadgeClass = "bg-success-subtle text-success";
            else if (p.method === "Card") methodBadgeClass = "bg-info-subtle text-info";
            else if (p.method === "UPI") methodBadgeClass = "bg-warning-subtle text-warning";
            else if (p.method === "Insurance") methodBadgeClass = "bg-secondary-subtle text-secondary";

            row.innerHTML = `
                <td class="fw-semibold text-primary">${receiptId}</td>
                <td>${p.date}</td>
                <td><span class="badge bg-light text-dark border">${p.invoiceNumber}</span></td>
                <td><strong>${p.patientName}</strong></td>
                <td><span class="badge ${methodBadgeClass}">${p.method}</span></td>
                <td class="fw-bold">$${formattedAmount}</td>
                <td>
                    <button class="btn btn-outline-primary btn-sm btn-view-receipt" data-id="${p.id}">
                        <i class="bi bi-receipt-cutoff me-1"></i> Receipt Details
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Add event listeners to the buttons
        document.querySelectorAll(".btn-view-receipt").forEach(btn => {
            btn.addEventListener("click", function() {
                const payId = this.getAttribute("data-id");
                showReceiptModal(payId);
            });
        });
    }

    function showReceiptModal(paymentId) {
        const payments = window.HospitalStore.getPayments() || [];
        const payment = payments.find(p => p.id == paymentId);
        if (!payment) return;

        const receiptId = `REC-${String(payment.id).padStart(5, '0')}`;

        receiptModalBody.innerHTML = `
            <div class="text-center mb-4">
                <h4 class="fw-bold mb-1">CareRecord Clinic</h4>
                <p class="text-muted small mb-0">123 Healthway Blvd, Medical Plaza Suite 100</p>
                <p class="text-muted small">Tel: +1 (555) 019-2000</p>
                <hr>
                <h5 class="text-success fw-bold">TRANSACTION SUCCESSFUL</h5>
            </div>
            
            <div class="row mb-3 small">
                <div class="col-6">
                    <span class="text-muted d-block">Receipt ID:</span>
                    <strong>${receiptId}</strong>
                </div>
                <div class="col-6 text-end">
                    <span class="text-muted d-block">Payment Date:</span>
                    <strong>${payment.date}</strong>
                </div>
            </div>

            <div class="row mb-4 small">
                <div class="col-6">
                    <span class="text-muted d-block">Patient Name:</span>
                    <strong>${payment.patientName}</strong>
                </div>
                <div class="col-6 text-end">
                    <span class="text-muted d-block">Invoice Number:</span>
                    <strong>${payment.invoiceNumber}</strong>
                </div>
            </div>

            <div class="card bg-light p-3 border-0 rounded mb-4">
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Settlement Method:</span>
                    <span class="fw-semibold">${payment.method}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span class="text-muted">Paid Status:</span>
                    <span class="text-success fw-bold"><i class="bi bi-check-circle-fill me-1"></i> FULLY SETTLED</span>
                </div>
                <hr class="my-2">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-dark">TOTAL AMOUNT PAID:</span>
                    <span class="fs-4 fw-bold text-primary">$${parseFloat(payment.amount).toFixed(2)}</span>
                </div>
            </div>

            <div class="text-center text-muted small mt-2">
                <p class="mb-1">Billed & Audited by: <strong>Clara Oswald (Billing Officer)</strong></p>
                <p class="mb-0">Thank you for your payment. Keep this copy for insurance claims references.</p>
            </div>
        `;

        receiptModal.show();
    }

    // Bind event listeners
    if (searchInput) {
        searchInput.addEventListener("input", loadPayments);
    }
    if (filterMethod) {
        filterMethod.addEventListener("change", loadPayments);
    }

    // Initial load
    loadPayments();
});
