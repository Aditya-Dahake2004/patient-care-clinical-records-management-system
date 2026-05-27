document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const claimsTableBody = document.getElementById("claimsTableBody");
    const searchInput = document.getElementById("searchClaim");
    const statusFilter = document.getElementById("filterStatus");

    function renderClaims() {
        const claims = window.HospitalStore.getClaims();
        const query = searchInput ? searchInput.value.toLowerCase() : "";
        const statusVal = statusFilter ? statusFilter.value : "All";

        claimsTableBody.innerHTML = "";

        const filtered = claims.filter(c => {
            const matchesQuery = c.patientName.toLowerCase().includes(query) || c.invoiceNumber.toLowerCase().includes(query) || c.provider.toLowerCase().includes(query);
            const matchesStatus = statusVal === "All" || c.status === statusVal;
            return matchesQuery && matchesStatus;
        });

        if (filtered.length === 0) {
            claimsTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No insurance pre-auth claims matching criteria found.</td></tr>`;
            return;
        }

        filtered.reverse().forEach(c => {
            let statusBadge = "bg-primary-subtle text-primary";
            if (c.status === "Approved") statusBadge = "bg-success-subtle text-success";
            if (c.status === "Rejected") statusBadge = "bg-danger-subtle text-danger";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold text-primary">#CLM-0${c.id}</td>
                <td class="fw-bold">${c.patientName}</td>
                <td class="small text-muted">${c.invoiceNumber}</td>
                <td>${c.provider}</td>
                <td class="fw-bold">$${parseFloat(c.amount).toFixed(2)}</td>
                <td><span class="badge badge-custom ${statusBadge}">${c.status}</span></td>
                <td>
                    <div class="d-flex gap-1">
                        <a href="claim-details.html?id=${c.id}" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-eye"></i> View
                        </a>
                        ${c.status === 'Pending' ? `
                            <button class="btn btn-success btn-sm approve-btn" data-id="${c.id}">
                                <i class="bi bi-check-lg"></i> Approve
                            </button>
                        ` : ''}
                    </div>
                </td>
            `;
            claimsTableBody.appendChild(row);
        });

        attachActionListeners();
    }

    function attachActionListeners() {
        document.querySelectorAll(".approve-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = this.getAttribute("data-id");
                if (confirm("Are you sure you want to approve this pre-authorization insurance claim?")) {
                    window.HospitalStore.updateClaimStatus(id, "Approved");
                    alert("Claim approved successfully!");
                    renderClaims();
                }
            });
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderClaims);
    if (statusFilter) statusFilter.addEventListener("change", renderClaims);

    renderClaims();
});
