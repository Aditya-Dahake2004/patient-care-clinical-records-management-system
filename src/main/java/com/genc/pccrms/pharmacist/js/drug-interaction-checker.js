document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const selectA = document.getElementById("drugA");
    const selectB = document.getElementById("drugB");
    const checkBtn = document.getElementById("checkBtn");
    const resultCard = document.getElementById("interactionResultCard");
    const severityBadge = document.getElementById("severityBadge");
    const resultTitle = document.getElementById("resultTitle");
    const resultText = document.getElementById("resultText");
    const recommendationText = document.getElementById("recommendationText");

    // Load drugs list
    const inventory = window.HospitalStore.getInventory();
    [selectA, selectB].forEach(select => {
        if (select) {
            inventory.forEach(item => {
                const opt = document.createElement("option");
                opt.value = item.name.split(" ")[0]; // Just generic name
                opt.textContent = item.name;
                select.appendChild(opt);
            });
        }
    });

    if (checkBtn) {
        checkBtn.addEventListener("click", function() {
            const drugAVal = selectA.value;
            const drugBVal = selectB.value;

            if (!drugAVal || !drugBVal) {
                alert("Please select both medications to evaluate conflicts.");
                return;
            }

            if (drugAVal === drugBVal) {
                alert("Error: Cannot check interaction between the identical medication. Please choose different items.");
                return;
            }

            // Mock interaction matrix
            let severity = "low";
            let title = "No Serious Interaction Detected";
            let desc = `No documented major clinical conflicts found between ${drugAVal} and ${drugBVal}.`;
            let rec = "Standard therapeutic administration is safe. Advise patient to monitor for generic nausea or headaches.";

            const pair = [drugAVal, drugBVal].sort().join(" + ");

            if (pair === "Lisinopril + Sumatriptan") {
                severity = "medium";
                title = "Moderate Interaction Warning";
                desc = "Concomitant use may result in moderate fluctuations of blood pressure or reduced efficacy of hypertensive therapy.";
                rec = "Monitor patient blood pressure closely. Consider spacing administration times by at least 4 hours.";
            } else if (pair === "Amoxicillin + Sumatriptan") {
                severity = "low";
                title = "Negligible Interaction Detected";
                desc = "No serious pharmacological contraindications noted between this antibiotic and triptan.";
                rec = "Safe to administer. Ensure complete course of antibiotics is consumed as directed.";
            } else if (pair === "Atorvastatin + Lisinopril") {
                severity = "medium";
                title = "Minor / Moderate Interaction";
                desc = "Combined therapy may slightly elevate serum potassium levels or amplify risk of muscle weakness (myalgia).";
                rec = "Routine renal panels advised for long-term therapy. Advise patient to report any unexplained muscle tenderness.";
            } else if (pair === "Atorvastatin + Sumatriptan") {
                severity = "high";
                title = "CRITICAL: Severe Conflict Warning";
                desc = "High alert! Combination dramatically heightens risk of cardiac spasm or severe vasoconstrictive responses in patients with coronary risk.";
                rec = "Avoid administration! Consult prescribing physician immediately to seek alternative statin or abortive therapies.";
            }

            // Render result
            resultCard.className = `card clinic-card p-4 interaction-result-card ${severity}`;
            severityBadge.className = `badge badge-custom`;
            if (severity === "low") {
                severityBadge.classList.add("bg-success", "text-white");
                severityBadge.textContent = "LOW RISK";
            } else if (severity === "medium") {
                severityBadge.classList.add("bg-warning", "text-dark");
                severityBadge.textContent = "MODERATE WARNING";
            } else if (severity === "high") {
                severityBadge.classList.add("bg-danger", "text-white");
                severityBadge.textContent = "HIGH ALERT";
            }

            resultTitle.textContent = title;
            resultText.textContent = desc;
            recommendationText.textContent = rec;

            resultCard.classList.remove("d-none");
        });
    }
});
