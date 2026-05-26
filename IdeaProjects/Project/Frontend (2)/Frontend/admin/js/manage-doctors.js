document.addEventListener("DOMContentLoaded", function() {
    // Initial static list of doctors
    let doctors = [
        { id: 1, name: "Dr. Sarah Connor", specialization: "Cardiology", email: "s.connor@hospital.com", phone: "+1 555-0192", status: "Active" },
        { id: 2, name: "Dr. Robert Chen", specialization: "Pediatrics", email: "r.chen@hospital.com", phone: "+1 555-0183", status: "Active" },
        { id: 3, name: "Dr. Emily Blunt", specialization: "Neurology", email: "e.blunt@hospital.com", phone: "+1 555-0174", status: "On Leave" },
        { id: 4, name: "Dr. James Carter", specialization: "Orthopedics", email: "j.carter@hospital.com", phone: "+1 555-0165", status: "Active" }
    ];

    const doctorTableBody = document.getElementById("doctorTableBody");
    const searchInput = document.getElementById("searchDoctor");
    const doctorForm = document.getElementById("doctorForm");
    const saveDoctorBtn = document.getElementById("saveDoctorBtn");
    const addDoctorModalEl = document.getElementById("addDoctorModal");
    let editMode = false;
    let editDoctorId = null;

    // Instance of Bootstrap Modal
    const doctorModal = new bootstrap.Modal(addDoctorModalEl);

    // Render Table function
    function renderDoctors(filteredDoctors = doctors) {
        doctorTableBody.innerHTML = "";
        if (filteredDoctors.length === 0) {
            doctorTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No doctors found matching the search criteria.</td></tr>`;
            return;
        }

        filteredDoctors.forEach((doc) => {
            const statusClass = doc.status === "Active" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning";
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold">#DOC-0${doc.id}</td>
                <td>
                    <div class="fw-bold">${doc.name}</div>
                    <div class="text-muted small">${doc.email}</div>
                </td>
                <td><span class="badge specialization-badge px-2.5 py-1.5">${doc.specialization}</span></td>
                <td>${doc.phone}</td>
                <td><span class="badge badge-custom ${statusClass}">${doc.status}</span></td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn btn-outline-primary btn-sm edit-btn" data-id="${doc.id}">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${doc.id}">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            doctorTableBody.appendChild(row);
        });

        attachActionListeners();
    }

    // Attach actions (edit/delete)
    function attachActionListeners() {
        // Edit Button Handler
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = parseInt(this.getAttribute("data-id"));
                const doc = doctors.find(d => d.id === id);
                if (doc) {
                    editMode = true;
                    editDoctorId = id;
                    document.getElementById("modalTitle").textContent = "Edit Doctor Details";
                    document.getElementById("docName").value = doc.name;
                    document.getElementById("docSpecialization").value = doc.specialization;
                    document.getElementById("docEmail").value = doc.email;
                    document.getElementById("docPhone").value = doc.phone;
                    document.getElementById("docStatus").value = doc.status;

                    doctorModal.show();
                }
            });
        });

        // Delete Button Handler
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = parseInt(this.getAttribute("data-id"));
                const doc = doctors.find(d => d.id === id);
                if (confirm(`Are you sure you want to remove ${doc.name}?`)) {
                    doctors = doctors.filter(d => d.id !== id);
                    renderDoctors();
                }
            });
        });
    }

    // Search input handler
    if (searchInput) {
        searchInput.addEventListener("input", function(e) {
            const query = e.target.value.toLowerCase();
            const filtered = doctors.filter(d => 
                d.name.toLowerCase().includes(query) || 
                d.specialization.toLowerCase().includes(query) ||
                d.email.toLowerCase().includes(query)
            );
            renderDoctors(filtered);
        });
    }

    // Modal Trigger to clear form for Add New Doctor
    const openAddModalBtn = document.getElementById("openAddModalBtn");
    if (openAddModalBtn) {
        openAddModalBtn.addEventListener("click", function() {
            editMode = false;
            editDoctorId = null;
            document.getElementById("modalTitle").textContent = "Add New Doctor";
            doctorForm.reset();
        });
    }

    // Save Doctor Handler
    if (doctorForm) {
        doctorForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const name = document.getElementById("docName").value.trim();
            const specialization = document.getElementById("docSpecialization").value;
            const email = document.getElementById("docEmail").value.trim();
            const phone = document.getElementById("docPhone").value.trim();
            const status = document.getElementById("docStatus").value;

            if (!name || !email || !phone) {
                alert("Please fill all the fields.");
                return;
            }

            if (editMode) {
                // Update doctor details
                const docIndex = doctors.findIndex(d => d.id === editDoctorId);
                if (docIndex !== -1) {
                    doctors[docIndex] = {
                        id: editDoctorId,
                        name,
                        specialization,
                        email,
                        phone,
                        status
                    };
                }
            } else {
                // Add new doctor
                const newId = doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
                doctors.push({
                    id: newId,
                    name,
                    specialization,
                    email,
                    phone,
                    status
                });
            }

            doctorModal.hide();
            renderDoctors();
            doctorForm.reset();
        });
    }

    // Initial render
    renderDoctors();
});
