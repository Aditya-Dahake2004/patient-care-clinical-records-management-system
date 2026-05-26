document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get("id");

    if (!invoiceId) {
        alert("Invalid access or invoice code missing!");
        window.location.href = "my-bills.html";
        return;
    }

    const invoices = window.HospitalStore.getInvoices() || [];
    const item = invoices.find(i => i.id == invoiceId);

    if (!item) {
        alert("Statement record not found!");
        window.location.href = "my-bills.html";
        return;
    }

    // Populate Fields
    document.getElementById("lblInvoiceNo").textContent = item.invoiceNumber;
    document.getElementById("lblDate").textContent = item.date;
    
    const subtotalVal = parseFloat(item.subTotal).toFixed(2);
    const taxVal = parseFloat(item.tax || 0).toFixed(2);
    const insVal = parseFloat(item.insuranceCoverage || 0).toFixed(2);
    const payVal = parseFloat(item.patientPayable).toFixed(2);

    document.getElementById("lblSubtotal").textContent = `$${subtotalVal}`;
    document.getElementById("lblTax").textContent = `$${taxVal}`;
    document.getElementById("lblInsurance").textContent = `-$${insVal}`;
    document.getElementById("lblPayable").textContent = `$${payVal}`;

    const statusBadge = document.getElementById("lblStatus");
    const payBtn = document.getElementById("btnPayOnline");
    const payHelp = document.getElementById("lblPayHelp");

    statusBadge.textContent = item.status;
    if (item.status === "Paid") {
        statusBadge.className = "badge bg-success";
        if (payBtn) payBtn.style.display = "none";
        payHelp.textContent = "This bill has been paid and audited. Keep this statement for insurance verification.";
    } else if (item.status === "Pending") {
        statusBadge.className = "badge bg-warning text-dark";
    } else {
        statusBadge.className = "badge bg-danger";
    }

    if (payBtn) {
        payBtn.addEventListener("click", function() {
            const confirmPay = confirm(`Settle net liability of $${payVal} instantly via secure dummy sandbox portal?`);
            if (confirmPay) {
                // Settle invoice state in shared database
                window.HospitalStore.updateInvoiceStatus(invoiceId, "Paid");
                
                // Add dummy payment transaction log
                const todayStr = new Date().toISOString().split("T")[0];
                window.HospitalStore.savePayment({
                    invoiceNumber: item.invoiceNumber,
                    patientName: item.patientName,
                    amount: parseFloat(item.patientPayable),
                    date: todayStr,
                    method: "Card"
                });

                alert("Transaction successful! Your invoice is now paid.");
                window.location.reload();
            }
        });
    }

    // Bind Print button
    const printBtn = document.querySelector(".btn-print-invoice");
    if (printBtn) {
        printBtn.addEventListener("click", function() {
            window.print();
        });
    }
});
