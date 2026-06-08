document.addEventListener("DOMContentLoaded", function() {
    // Initial static list of staff
    let staffMembers = [
        { id: 1, name: "Marcus Vance", role: "Receptionist", email: "m.vance@hospital.com", phone: "+1 555-0211", status: "Active" },
        { id: 2, name: "Elena Rostova", role: "Nurse", email: "e.rostova@hospital.com", phone: "+1 555-0222", status: "Active" },
        { id: 3, name: "Lucas Scott", role: "Pharmacist", email: "l.scott@hospital.com", phone: "+1 555-0233", status: "Active" },
        { id: 4, name: "Clara Oswald", role: "Billing Officer", email: "c.oswald@hospital.com", phone: "+1 555-0244", status: "On Leave" }
    ];

    const staffTableBody = document.getElementById("staffTableBody");
    const searchInput = document.getElementById("searchStaff");
    const filterRole = document.getElementById("filterRole");
    const staffForm = document.getElementById("staffForm");
    const staffModalEl = document.getElementById("addStaffModal");
    let editMode = false;
    let editStaffId = null;

    const staffModal = new bootstrap.Modal(staffModalEl);

    // Get color badge based on staff role
    function getRoleBadgeClass(role) {
        switch (role) {
            case "Receptionist": return "bg-info-subtle text-info";
            case "Nurse": return "bg-primary-subtle text-primary";
            case "Pharmacist": return "bg-warning-subtle text-warning";
            case "Billing Officer": return "bg-success-subtle text-success";
            default: return "bg-secondary-subtle text-secondary";
        }
    }

    // Render staff table
    function renderStaff() {
        const query = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedRole = filterRole ? filterRole.value : "All";

        staffTableBody.innerHTML = "";

        const filtered = staffMembers.filter(s => {
            const matchesQuery = s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query);
            const matchesRole = selectedRole === "All" || s.role === selectedRole;
            return matchesQuery && matchesRole;
        });

        if (filtered.length === 0) {
            staffTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No staff members found matching criteria.</td></tr>`;
            return;
        }

        filtered.forEach(s => {
            const statusClass = s.status === "Active" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning";
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold">#STF-0${s.id}</td>
                <td>
                    <div class="fw-bold">${s.name}</div>
                    <div class="text-muted small">${s.email}</div>
                </td>
                <td><span class="badge role-badge ${getRoleBadgeClass(s.role)}">${s.role}</span></td>
                <td>${s.phone}</td>
                <td><span class="badge badge-custom ${statusClass}">${s.status}</span></td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn btn-outline-primary btn-sm edit-btn" data-id="${s.id}">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${s.id}">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            staffTableBody.appendChild(row);
        });

        attachActionListeners();
    }

    function attachActionListeners() {
        // Edit Handler
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = parseInt(this.getAttribute("data-id"));
                const member = staffMembers.find(s => s.id === id);
                if (member) {
                    editMode = true;
                    editStaffId = id;
                    document.getElementById("modalTitle").textContent = "Edit Staff Details";
                    document.getElementById("staffName").value = member.name;
                    document.getElementById("staffRole").value = member.role;
                    document.getElementById("staffEmail").value = member.email;
                    document.getElementById("staffPhone").value = member.phone;
                    document.getElementById("staffStatus").value = member.status;

                    staffModal.show();
                }
            });
        });

        // Delete Handler
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = parseInt(this.getAttribute("data-id"));
                const member = staffMembers.find(s => s.id === id);
                if (confirm(`Are you sure you want to remove ${member.name} (${member.role})?`)) {
                    staffMembers = staffMembers.filter(s => s.id !== id);
                    renderStaff();
                }
            });
        });
    }

    // Bind filters
    if (searchInput) searchInput.addEventListener("input", renderStaff);
    if (filterRole) filterRole.addEventListener("change", renderStaff);

    // Reset Form for New Staff
    const openAddStaffModalBtn = document.getElementById("openAddStaffModalBtn");
    if (openAddStaffModalBtn) {
        openAddStaffModalBtn.addEventListener("click", function() {
            editMode = false;
            editStaffId = null;
            document.getElementById("modalTitle").textContent = "Add New Staff Member";
            staffForm.reset();
        });
    }

    // Submit Staff Form
    if (staffForm) {
        staffForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const name = document.getElementById("staffName").value.trim();
            const role = document.getElementById("staffRole").value;
            const email = document.getElementById("staffEmail").value.trim();
            const phone = document.getElementById("staffPhone").value.trim();
            const status = document.getElementById("staffStatus").value;

            if (editMode) {
                const index = staffMembers.findIndex(s => s.id === editStaffId);
                if (index !== -1) {
                    staffMembers[index] = { id: editStaffId, name, role, email, phone, status };
                }
            } else {
                const newId = staffMembers.length > 0 ? Math.max(...staffMembers.map(s => s.id)) + 1 : 1;
                staffMembers.push({ id: newId, name, role, email, phone, status });
            }

            staffModal.hide();
            renderStaff();
            staffForm.reset();
        });
    }

    // Render initially
    renderStaff();
});
