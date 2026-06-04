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

    // Default doctors list
    const DEFAULT_DOCTORS = [
        { name: "Dr. Sarah Connor", dept: "Cardiology", email: "sarah.connor@carerecord.med.org" },
        { name: "Dr. Robert Chen", dept: "Pediatrics", email: "robert.chen@carerecord.med.org" },
        { name: "Dr. Emily Blunt", dept: "Neurology", email: "emily.blunt@carerecord.med.org" }
    ];

    let doctors = JSON.parse(localStorage.getItem("admin_doctors")) || DEFAULT_DOCTORS;

    function renderDoctors() {
        const tbody = document.getElementById("doctorsTableBody");
        if (!tbody) return;
        tbody.innerHTML = "";

        doctors.forEach((d, idx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${d.name}</strong></td>
                <td><span class="badge bg-primary-light text-primary">${d.dept}</span></td>
                <td><code class="text-secondary">${d.email}</code></td>
                <td>
                    <button class="btn btn-outline-danger btn-sm btn-delete-doc" data-idx="${idx}">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Bind delete
        document.querySelectorAll(".btn-delete-doc").forEach(btn => {
            btn.addEventListener("click", function() {
                const idx = parseInt(this.getAttribute("data-idx"));
                if (confirm(`Remove access credentials for ${doctors[idx].name}?`)) {
                    doctors.splice(idx, 1);
                    localStorage.setItem("admin_doctors", JSON.stringify(doctors));
                    renderDoctors();
                }
            });
        });
    }

    // Bind Add Doctor Form
    const addForm = document.getElementById("addDoctorForm");
    if (addForm) {
        addForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("docName").value;
            const dept = document.getElementById("docDept").value;
            const email = document.getElementById("docEmail").value;

            doctors.push({ name, dept, email });
            localStorage.setItem("admin_doctors", JSON.stringify(doctors));

            // Hide Modal
            const modalEl = document.getElementById("addDoctorModal");
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            addForm.reset();
            renderDoctors();
            alert(`Credentials for ${name} registered successfully!`);
        });
    }

    renderDoctors();
});
