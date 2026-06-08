document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const medId = urlParams.get("id");

    if (!medId) {
        alert("Error: No medication specified. Redirecting to inventory.");
        window.location.href = "medicine-inventory.html";
        return;
    }

    function renderMedicineDetails() {
        const item = window.HospitalStore.getInventoryItemById(medId);
        if (!item) {
            alert("Error: Medication record not found. Redirecting to inventory.");
            window.location.href = "medicine-inventory.html";
            return;
        }

        // Render Values
        document.getElementById("medNameTitle").textContent = item.name;
        document.getElementById("medClassBadge").textContent = item.category;

        document.getElementById("medName").textContent = item.name;
        document.getElementById("medCategory").textContent = item.category;
        document.getElementById("medDosage").textContent = item.dosage || "Standard Dose";
        document.getElementById("medStock").textContent = `${item.stock} units`;
        document.getElementById("medExpiry").textContent = item.expiry;
        document.getElementById("medManufacturer").textContent = item.manufacturer || "Not Specified";
        document.getElementById("medSideEffects").textContent = item.sideEffects || "None Documented";

        // Stock status badge
        const badge = document.getElementById("medStockStatusBadge");
        badge.className = "badge";
        if (item.status === "Available") {
            badge.classList.add("bg-success-subtle", "text-success");
            badge.textContent = "AVAILABLE";
        } else if (item.status === "Low Stock") {
            badge.classList.add("bg-warning-subtle", "text-warning");
            badge.textContent = "LOW STOCK WARNING";
        } else if (item.status === "Out of Stock") {
            badge.classList.add("bg-danger-subtle", "text-danger");
            badge.textContent = "OUT OF STOCK";
        }
    }

    renderMedicineDetails();
});
