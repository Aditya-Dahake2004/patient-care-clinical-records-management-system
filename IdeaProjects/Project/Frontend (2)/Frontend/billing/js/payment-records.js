document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const selectInvoice = document.getElementById("checkoutInvoice");
    const checkoutSummaryCard = document.getElementById("checkoutSummaryCard");
    const checkoutForm = document.getElementById("checkoutForm");

    // Load pending invoices
    const invoices = window.HospitalStore.getInvoices();
    const pendingInvs = invoices.filter(i => i.status === "Pending");

    if (selectInvoice) {
        pendingInvs.forEach(i => {
            const opt = document.createElement("option");
            opt.value = i.id;
            opt.textContent = `${i.patientName} (${i.invoiceNumber}) - Due: $${parseFloat(i.patientPayable).toFixed(2)}`;
            selectInvoice.appendChild(opt);
        });

        // Pre-select if passed in query param
        const urlParams = new URLSearchParams(window.location.search);
        const preId = urlParams.get("id");
        if (preId) {
            selectInvoice.value = preId;
            renderCheckoutSummary(preId);
        }

        selectInvoice.addEventListener("change", function() {
            renderCheckoutSummary(this.value);
        });
    }

    function renderCheckoutSummary(invoiceId) {
        if (!invoiceId) {
            checkoutSummaryCard.classList.add("d-none");
            return;
        }

        const item = window.HospitalStore.getInvoiceById(invoiceId);
        if (!item) return;

        checkoutSummaryCard.classList.remove("d-none");
        document.getElementById("lblInvNo").textContent = item.invoiceNumber;
        document.getElementById("lblPatient").textContent = item.patientName;
        document.getElementById("lblGross").textContent = `$${parseFloat(item.subTotal + item.tax).toFixed(2)}`;
        document.getElementById("lblInsurance").textContent = `$${parseFloat(item.insuranceCoverage).toFixed(2)}`;
        document.getElementById("lblPayable").textContent = `$${parseFloat(item.patientPayable).toFixed(2)}`;
        
        // Fill amount field automatically
        document.getElementById("paymentAmount").value = parseFloat(item.patientPayable).toFixed(2);
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const invoiceId = selectInvoice.value;
            if (!invoiceId) {
                alert("Please select a pending invoice statement.");
                return;
            }

            const item = window.HospitalStore.getInvoiceById(invoiceId);
            const method = document.getElementById("paymentMethod").value;
            const amountVal = parseFloat(document.getElementById("paymentAmount").value) || 0;

            if (amountVal <= 0) {
                alert("Payment amount must be greater than zero.");
                return;
            }

            const todayStr = new Date().toISOString().split("T")[0];

            // 1. Save payment record
            const paymentObj = {
                invoiceNumber: item.invoiceNumber,
                patientName: item.patientName,
                amount: amountVal,
                date: todayStr,
                method: method
            };
            window.HospitalStore.savePayment(paymentObj);

            // 2. Shift invoice status to Paid
            window.HospitalStore.updateInvoiceStatus(invoiceId, "Paid");

            // 3. Adjudicate claims status to Approved if paying via insurance
            if (method === "Insurance") {
                const claims = window.HospitalStore.getClaims();
                const matchedClaim = claims.find(c => c.invoiceNumber === item.invoiceNumber);
                if (matchedClaim) {
                    window.HospitalStore.updateClaimStatus(matchedClaim.id, "Approved");
                }
            }

            alert(`Checkout transaction successful!\n\nInvoice: ${item.invoiceNumber}\nAmount Paid: $${amountVal.toFixed(2)}\nMethod: ${method}`);
            window.location.href = "payment-history.html";
        });
    }
});
