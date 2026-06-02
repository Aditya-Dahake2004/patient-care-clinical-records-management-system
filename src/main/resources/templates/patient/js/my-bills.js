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

    function renderBills() {
        if (!window.HospitalStore) return;
        const patientId = 1;
        const invoices = (window.HospitalStore.getInvoices() || []).filter(i => i.patientId == patientId);
        const tbody = document.getElementById("billsBody");

        if (tbody) {
            tbody.innerHTML = "";

            if (invoices.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center text-muted py-3">
                            No invoices generated for your account.
                        </td>
                    </tr>
                `;
                return;
            }

            invoices.forEach(i => {
                const tr = document.createElement("tr");

                let badgeClass = "bg-success";
                let actionBtn = `<span class="text-secondary small">Sattled</span>`;

                if (i.status === "Pending") {
                    badgeClass = "bg-warning text-dark";
                    actionBtn = `<button class="btn btn-primary btn-sm btn-pay" data-id="${i.id}">Pay Now</button>`;
                } else if (i.status === "Overdue") {
                    badgeClass = "bg-danger";
                    actionBtn = `<button class="btn btn-primary btn-sm btn-pay" data-id="${i.id}">Pay Now</button>`;
                }

                const gross = parseFloat(i.subTotal + (i.tax || 0)).toFixed(2);
                const ins = parseFloat(i.insuranceCoverage || 0).toFixed(2);
                const payable = parseFloat(i.patientPayable).toFixed(2);

                tr.innerHTML = `
                    <td><strong>${i.invoiceNumber}</strong></td>
                    <td>${i.date}</td>
                    <td>$${gross}</td>
                    <td>$${ins}</td>
                    <td class="fw-bold">$${payable}</td>
                    <td><span class="badge ${badgeClass}">${i.status}</span></td>
                    <td>${actionBtn}</td>
                `;
                tbody.appendChild(tr);
            });

            // Bind pay click
            document.querySelectorAll(".btn-pay").forEach(btn => {
                btn.addEventListener("click", function() {
                    const billId = this.getAttribute("data-id");
                    const bill = invoices.find(i => i.id == billId);
                    if (confirm(`Settle your net patient liability of $${parseFloat(bill.patientPayable).toFixed(2)} now?`)) {
                        window.HospitalStore.updateInvoiceStatus(billId, "Paid");
                        
                        // Log payment
                        window.HospitalStore.savePayment({
                            invoiceNumber: bill.invoiceNumber,
                            patientName: bill.patientName,
                            amount: bill.patientPayable,
                            date: new Date().toISOString().split("T")[0],
                            method: "Card"
                        });

                        alert(`Payment successful! Invoice ${bill.invoiceNumber} has been settled.`);
                        renderBills();
                    }
                });
            });
        }
    }

    renderBills();
});
