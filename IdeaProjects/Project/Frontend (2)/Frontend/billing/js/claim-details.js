document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const claimId = urlParams.get("id");

    if (!claimId) {
        alert("Error: No claim specified. Redirecting to registry.");
        window.location.href = "insurance-claims.html";
        return;
    }

    function renderClaimDetails() {
        const claim = window.HospitalStore.getClaimById(claimId);
        if (!claim) {
            alert("Error: Claim record not found. Redirecting to registry.");
            window.location.href = "insurance-claims.html";
            return;
        }

        // Render Values
        document.getElementById("claimIdTitle").textContent = `#CLM-0${claim.id}`;
        document.getElementById("claimStatusBadge").textContent = claim.status;

        // Status badge classes
        const badge = document.getElementById("claimStatusBadge");
        badge.className = "badge badge-custom";
        if (claim.status === "Pending") badge.classList.add("bg-primary-subtle", "text-primary");
        if (claim.status === "Approved") badge.classList.add("bg-success-subtle", "text-success");
        if (claim.status === "Rejected") badge.classList.add("bg-danger-subtle", "text-danger");

        document.getElementById("patName").textContent = claim.patientName;
        document.getElementById("providerName").textContent = claim.provider;
        document.getElementById("claimAmount").textContent = `$${parseFloat(claim.amount).toFixed(2)}`;
        document.getElementById("claimDate").textContent = claim.date;
        document.getElementById("invoiceNo").textContent = claim.invoiceNumber;

        // Actions
        const actionsArea = document.getElementById("claimActionsArea");
        if (claim.status === "Pending") {
            actionsArea.innerHTML = `
                <button id="approveClaimBtn" class="btn btn-success px-4"><i class="bi bi-check-circle me-1"></i> Approve Claim</button>
                <button id="rejectClaimBtn" class="btn btn-outline-danger px-4"><i class="bi bi-x-circle me-1"></i> Reject Claim</button>
            `;

            // Bind Actions
            document.getElementById("approveClaimBtn").addEventListener("click", function() {
                if (confirm("Are you sure you want to approve this pre-auth payer claim?")) {
                    window.HospitalStore.updateClaimStatus(claimId, "Approved");
                    alert("Claim approved successfully!");
                    renderClaimDetails();
                }
            });

            document.getElementById("rejectClaimBtn").addEventListener("click", function() {
                if (confirm("Are you sure you want to reject this pre-auth payer claim?")) {
                    window.HospitalStore.updateClaimStatus(claimId, "Rejected");
                    alert("Claim rejected successfully!");
                    renderClaimDetails();
                }
            });
        } else {
            actionsArea.innerHTML = `<span class="text-muted small"><i class="bi bi-info-circle me-1"></i> This claim has been adjudicated and closed.</span>`;
        }
    }

    renderClaimDetails();
});
