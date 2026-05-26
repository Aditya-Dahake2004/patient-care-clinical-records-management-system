document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientSelect = document.getElementById("invoicePatient");
    const chargeInputs = ["chargeConsult", "chargeMedicine", "chargeService", "chargeInsurance"];
    const invoiceForm = document.getElementById("generateInvoiceForm");

    // Load patients dropdown
    const patients = window.HospitalStore.getPatients();
    if (patientSelect) {
        patients.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = `${p.name} (${p.mrn})`;
            patientSelect.appendChild(opt);
        });
    }

    function calculateInvoiceTotals() {
        const consult = parseFloat(document.getElementById("chargeConsult").value) || 0;
        const medicine = parseFloat(document.getElementById("chargeMedicine").value) || 0;
        const service = parseFloat(document.getElementById("chargeService").value) || 0;
        const insurance = parseFloat(document.getElementById("chargeInsurance").value) || 0;

        const subtotal = consult + medicine + service;
        const tax = subtotal * 0.10; // Fixed 10% tax rate
        const total = subtotal + tax;
        const patientPayable = Math.max(0, total - insurance);

        document.getElementById("summarySubtotal").textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById("summaryTax").textContent = `$${tax.toFixed(2)}`;
        document.getElementById("summaryTotal").textContent = `$${total.toFixed(2)}`;
        document.getElementById("summaryPayable").textContent = `$${patientPayable.toFixed(2)}`;
    }

    // Attach real-time calculation listeners
    chargeInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", calculateInvoiceTotals);
        }
    });

    if (invoiceForm) {
        invoiceForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const patientId = patientSelect.value;
            const patientName = patientSelect.options[patientSelect.selectedIndex].text.split(" (")[0];
            
            const consult = parseFloat(document.getElementById("chargeConsult").value) || 0;
            const medicine = parseFloat(document.getElementById("chargeMedicine").value) || 0;
            const service = parseFloat(document.getElementById("chargeService").value) || 0;
            const insurance = parseFloat(document.getElementById("chargeInsurance").value) || 0;

            const subTotal = consult + medicine + service;
            const tax = subTotal * 0.10;
            const total = subTotal + tax;
            const patientPayable = Math.max(0, total - insurance);

            if (!patientId || subTotal === 0) {
                alert("Please select a patient and enter at least one charge item.");
                return;
            }

            const todayStr = new Date().toISOString().split("T")[0];

            const invoiceObj = {
                patientId,
                patientName,
                date: todayStr,
                subTotal,
                tax,
                insuranceCoverage: insurance,
                patientPayable,
                status: "Pending"
            };

            const savedInvoice = window.HospitalStore.saveInvoice(invoiceObj);

            // If insurance is specified, automatically generate a claim record in localStorage
            if (insurance > 0) {
                const claimObj = {
                    invoiceNumber: savedInvoice.invoiceNumber,
                    patientName: savedInvoice.patientName,
                    provider: document.getElementById("insuranceProvider").value || "General Blue Shield Payer",
                    amount: insurance,
                    status: "Pending",
                    date: todayStr
                };
                window.HospitalStore.saveClaim(claimObj);
            }

            alert(`Invoice ${savedInvoice.invoiceNumber} generated successfully!\n\nPatient: ${savedInvoice.patientName}\nAmount Payable: $${savedInvoice.patientPayable.toFixed(2)}`);
            window.location.href = "invoice-list.html";
        });
    }

    // Run initial calculate
    calculateInvoiceTotals();
});
