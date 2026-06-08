document.addEventListener("DOMContentLoaded", function() {
    const taxForm = document.getElementById("taxSettingsForm");
    const payerForm = document.getElementById("payerSettingsForm");
    const templateForm = document.getElementById("templateSettingsForm");
    const auditLogsBody = document.getElementById("auditLogsBody");

    // Initialize mock settings or load existing
    const defaultSettings = {
        taxRate: 10.0,
        currencySymbol: "$",
        consultationFee: 120,
        roomRent: 250,
        payers: ["Aetna", "Cigna", "Blue Cross"],
        mockPayerApi: "https://api.careclinic-sandbox.fhir/payers/v1/auth",
        autoFileClaims: true,
        hospitalName: "CareRecord Clinic Ltd.",
        templateColor: "blue",
        receiptNotes: "Thank you for your payment. Keep this copy for insurance claims references."
    };

    let settings = JSON.parse(localStorage.getItem("billing_settings")) || defaultSettings;

    // Default Audit Logs
    let auditLogs = JSON.parse(localStorage.getItem("billing_audit_logs")) || [
        { stamp: "2026-05-26 10:15:30", category: "Security", details: "Billing Officer session authorized successfully", actor: "Clara Oswald" },
        { stamp: "2026-05-26 11:42:15", category: "Policy", details: "Tax rate set to default (10%)", actor: "System Init" },
        { stamp: "2026-05-26 14:02:40", category: "Integration", details: "Aetna Gateway endpoint pinged successfully", actor: "Clara Oswald" }
    ];

    // Populate Fields on Load
    function populateFields() {
        if (document.getElementById("taxRate")) document.getElementById("taxRate").value = settings.taxRate;
        if (document.getElementById("currencySymbol")) document.getElementById("currencySymbol").value = settings.currencySymbol;
        if (document.getElementById("consultationFee")) document.getElementById("consultationFee").value = settings.consultationFee;
        if (document.getElementById("roomRent")) document.getElementById("roomRent").value = settings.roomRent;

        if (document.getElementById("providerAetna")) document.getElementById("providerAetna").checked = settings.payers.includes("Aetna");
        if (document.getElementById("providerCigna")) document.getElementById("providerCigna").checked = settings.payers.includes("Cigna");
        if (document.getElementById("providerBlue")) document.getElementById("providerBlue").checked = settings.payers.includes("Blue Cross");
        if (document.getElementById("mockPayerApi")) document.getElementById("mockPayerApi").value = settings.mockPayerApi;
        if (document.getElementById("autoFileClaims")) document.getElementById("autoFileClaims").checked = settings.autoFileClaims;

        if (document.getElementById("hospitalName")) document.getElementById("hospitalName").value = settings.hospitalName;
        if (document.getElementById("templateColor")) document.getElementById("templateColor").value = settings.templateColor;
        if (document.getElementById("receiptNotes")) document.getElementById("receiptNotes").value = settings.receiptNotes;

        renderAuditLogs();
    }

    function renderAuditLogs() {
        if (!auditLogsBody) return;
        auditLogsBody.innerHTML = "";

        // Reverse to show latest first
        [...auditLogs].reverse().forEach(log => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><span class="text-secondary">${log.stamp}</span></td>
                <td><span class="badge bg-light text-dark border">${log.category}</span></td>
                <td><code>${log.details}</code></td>
                <td><span class="fw-semibold">${log.actor}</span></td>
            `;
            auditLogsBody.appendChild(row);
        });
    }

    function addAuditEntry(category, details) {
        const today = new Date();
        const stampStr = today.getFullYear() + '-' + 
                         String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(today.getDate()).padStart(2, '0') + ' ' + 
                         String(today.getHours()).padStart(2, '0') + ':' + 
                         String(today.getMinutes()).padStart(2, '0') + ':' + 
                         String(today.getSeconds()).padStart(2, '0');

        auditLogs.push({
            stamp: stampStr,
            category: category,
            details: details,
            actor: "Clara Oswald"
        });

        localStorage.setItem("billing_audit_logs", JSON.stringify(auditLogs));
        renderAuditLogs();
    }

    // Bind Forms Submission
    if (taxForm) {
        taxForm.addEventListener("submit", function(e) {
            e.preventDefault();
            settings.taxRate = parseFloat(document.getElementById("taxRate").value);
            settings.currencySymbol = document.getElementById("currencySymbol").value;
            settings.consultationFee = parseInt(document.getElementById("consultationFee").value);
            settings.roomRent = parseInt(document.getElementById("roomRent").value);

            localStorage.setItem("billing_settings", JSON.stringify(settings));
            addAuditEntry("Policy", `Financial policies updated. Tax: ${settings.taxRate}%, Currency: ${settings.currencySymbol}`);
            alert("Financial Policy & Taxation settings saved successfully!");
        });
    }

    if (payerForm) {
        payerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const payersArr = [];
            if (document.getElementById("providerAetna").checked) payersArr.push("Aetna");
            if (document.getElementById("providerCigna").checked) payersArr.push("Cigna");
            if (document.getElementById("providerBlue").checked) payersArr.push("Blue Cross");

            settings.payers = payersArr;
            settings.mockPayerApi = document.getElementById("mockPayerApi").value;
            settings.autoFileClaims = document.getElementById("autoFileClaims").checked;

            localStorage.setItem("billing_settings", JSON.stringify(settings));
            addAuditEntry("Integration", "Payer pre-authorization networks updated");
            alert("Insurance networks & Payer integration settings saved successfully!");
        });
    }

    if (templateForm) {
        templateForm.addEventListener("submit", function(e) {
            e.preventDefault();
            settings.hospitalName = document.getElementById("hospitalName").value;
            settings.templateColor = document.getElementById("templateColor").value;
            settings.receiptNotes = document.getElementById("receiptNotes").value;

            localStorage.setItem("billing_settings", JSON.stringify(settings));
            addAuditEntry("Layout", `Receipt layout branding changed to ${settings.hospitalName}`);
            alert("Invoice branding and receipt design preferences saved successfully!");
        });
    }

    // Initialize Fields
    populateFields();
});
