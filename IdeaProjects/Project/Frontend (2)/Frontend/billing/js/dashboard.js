document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const recentInvoicesBody = document.getElementById("recentInvoicesBody");
    const pendingClaimsBody = document.getElementById("pendingClaimsBody");

    function renderDashboardData() {
        const invoices = window.HospitalStore.getInvoices();
        const payments = window.HospitalStore.getPayments();
        const claims = window.HospitalStore.getClaims();

        // 1. Calculate stats cards
        const pendingInvs = invoices.filter(i => i.status === "Pending");
        const pendingTotal = pendingInvs.reduce((sum, i) => sum + parseFloat(i.patientPayable), 0);
        document.getElementById("statPendingCount").textContent = `$${pendingTotal.toFixed(2)}`;

        const paidList = invoices.filter(i => i.status === "Paid");
        document.getElementById("statPaidCount").textContent = paidList.length;

        const activeClaims = claims.filter(c => c.status === "Pending");
        document.getElementById("statClaimsCount").textContent = activeClaims.length;

        const revenueSum = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        document.getElementById("statRevenueCount").textContent = `$${revenueSum.toFixed(2)}`;

        // 2. Render Recent Invoices Table
        recentInvoicesBody.innerHTML = "";
        const activeInvs = invoices.slice(0, 3);
        
        if (activeInvs.length === 0) {
            recentInvoicesBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No invoices found.</td></tr>`;
        } else {
            activeInvs.forEach(i => {
                let badgeClass = "Paid";
                if (i.status === "Pending") badgeClass = "Pending";
                
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="fw-semibold text-primary">${i.invoiceNumber}</td>
                    <td class="fw-bold">${i.patientName}</td>
                    <td>$${parseFloat(i.patientPayable).toFixed(2)}</td>
                    <td><span class="invoice-badge ${badgeClass}">${i.status}</span></td>
                    <td>
                        <a href="invoice-details.html?id=${i.id}" class="btn btn-outline-primary btn-sm">View details</a>
                    </td>
                `;
                recentInvoicesBody.appendChild(row);
            });
        }

        // 3. Render Pending Claims list
        pendingClaimsBody.innerHTML = "";
        const pClaims = claims.filter(c => c.status === "Pending").slice(0, 3);
        
        if (pClaims.length === 0) {
            pendingClaimsBody.innerHTML = `<div class="text-center text-success small py-3"><i class="bi bi-shield-check"></i> All insurance claims successfully adjudicated!</div>`;
        } else {
            pClaims.forEach(c => {
                const item = document.createElement("div");
                item.className = "d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded";
                item.innerHTML = `
                    <div>
                        <div class="fw-bold small text-dark">${c.patientName}</div>
                        <div class="text-muted small">Provider: <span class="fw-semibold">${c.provider}</span> | Claim: <span class="fw-bold">$${parseFloat(c.amount).toFixed(2)}</span></div>
                    </div>
                    <a href="claim-details.html?id=${c.id}" class="btn btn-link btn-sm p-0 text-decoration-none">Review</a>
                `;
                pendingClaimsBody.appendChild(item);
            });
        }
    }

    renderDashboardData();
});
