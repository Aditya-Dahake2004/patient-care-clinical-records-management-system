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

    if (window.HospitalStore) {
        const prescs = window.HospitalStore.getPrescriptions() || [];
        const pending = prescs.filter(p => p.status === "PENDING");

        const selectPresc = document.getElementById("selectPrescription");
        const summaryCard = document.getElementById("dispenseSummaryCard");
        const dispenseBtn = document.getElementById("btnDispense");

        pending.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = `${p.patientName} - Signed on ${p.date}`;
            selectPresc.appendChild(opt);
        });

        // Pre-select if ID passed in query param
        const urlParams = new URLSearchParams(window.location.search);
        const preId = urlParams.get("id");
        if (preId) {
            selectPresc.value = preId;
            renderSummary(preId);
        }

        selectPresc.addEventListener("change", function() {
            renderSummary(this.value);
        });

        function renderSummary(prescId) {
            if (!prescId) {
                summaryCard.classList.add("d-none");
                dispenseBtn.classList.add("d-none");
                return;
            }

            const p = prescs.find(pr => pr.id == prescId);
            if (!p) return;

            summaryCard.classList.remove("d-none");
            dispenseBtn.classList.remove("d-none");

            document.getElementById("lblPatient").textContent = p.patientName;
            document.getElementById("lblDoctor").textContent = p.doctorName;

            const container = document.getElementById("medicinesContainer");
            container.innerHTML = "";

            p.medicines.forEach(m => {
                const div = document.createElement("div");
                div.className = "med-row d-flex justify-content-between align-items-center";
                div.innerHTML = `
                    <div>
                        <strong class="text-dark d-block">${m.name}</strong>
                        <span class="text-muted small">Dosage: ${m.dosage} | Frequency: ${m.frequency}</span>
                    </div>
                    <span class="badge bg-light text-dark border">Duration: ${m.duration}</span>
                `;
                container.appendChild(div);
            });
        }

        dispenseBtn.addEventListener("click", function() {
            const prescId = selectPresc.value;
            const p = prescs.find(pr => pr.id == prescId);

            if (p) {
                window.HospitalStore.updatePrescriptionStatus(prescId, "DISPENSED");
                
                // Decrement stock for the dispensed medicine if matches name
                p.medicines.forEach(m => {
                    window.HospitalStore.updateInventoryStock(m.name, 10);
                });

                alert(`Prescription order RX-00${prescId} for ${p.patientName} dispensed successfully!\n\nInventory stocks decremented by 10 units.`);
                window.location.href = "pharmacist-dashboard.html";
            }
        });
    }
});
