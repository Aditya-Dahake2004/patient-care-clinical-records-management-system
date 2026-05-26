document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get("id");

    if (!invoiceId) {
        alert("Error: No invoice specified. Redirecting to ledger.");
        window.location.href = "invoice-list.html";
        return;
    }

    function renderInvoiceDetails() {
        const item = window.HospitalStore.getInvoiceById(invoiceId);
        if (!item) {
            alert("Error: Invoice record not found. Redirecting to ledger.");
            window.location.href = "invoice-list.html";
            return;
        }

        // Fetch patient MRN
        const patient = window.HospitalStore.getPatientById(item.patientId);

        // Render Values
        document.getElementById("invNo").textContent = item.invoiceNumber;
        document.getElementById("invNoTitle").textContent = item.invoiceNumber;
        document.getElementById("invDate").textContent = item.date;
        document.getElementById("patName").textContent = item.patientName;
        document.getElementById("patMRN").textContent = patient ? patient.mrn : "Not Set";
        document.getElementById("patPhone").textContent = patient ? patient.phone : "Not Set";

        // Charges breakdown (reconstructed or exact)
        // For simulation, consultation charge defaults to $100 and medicine is subtotal - 100
        const consultVal = 100.00;
        const medicineVal = Math.max(0, parseFloat(item.subTotal) - consultVal);

        document.getElementById("lblConsult").textContent = `$${consultVal.toFixed(2)}`;
        document.getElementById("lblMedicine").textContent = `$${medicineVal.toFixed(2)}`;
        
        document.getElementById("lblSubtotal").textContent = `$${parseFloat(item.subTotal).toFixed(2)}`;
        document.getElementById("lblTax").textContent = `$${parseFloat(item.tax).toFixed(2)}`;
        document.getElementById("lblTotal").textContent = `$${parseFloat(item.subTotal + item.tax).toFixed(2)}`;
        document.getElementById("lblInsurance").textContent = `$${parseFloat(item.insuranceCoverage).toFixed(2)}`;
        document.getElementById("lblPayable").textContent = `$${parseFloat(item.patientPayable).toFixed(2)}`;

        // Status Badge
        const badge = document.getElementById("invStatusBadge");
        badge.className = "invoice-badge";
        if (item.status === "Paid") {
            badge.classList.add("Paid");
            badge.textContent = "Paid";
        } else if (item.status === "Pending") {
            badge.classList.add("Pending");
            badge.textContent = "Pending";
        } else if (item.status === "Overdue") {
            badge.classList.add("Overdue");
            badge.textContent = "Overdue";
        }

        // Actions: Pay Now button (only visible if pending)
        const payNowBtn = document.getElementById("payNowBtn");
        if (item.status === "Pending") {
            payNowBtn.classList.remove("d-none");
            payNowBtn.setAttribute("href", `payment-records.html?id=${item.id}`);
        } else {
            payNowBtn.classList.add("d-none");
        }
    }

    // Print Button
    const printBtn = document.getElementById("printInvoiceBtn");
    if (printBtn) {
        printBtn.addEventListener("click", function() {
            window.print();
        });
    }

    renderInvoiceDetails();
});
