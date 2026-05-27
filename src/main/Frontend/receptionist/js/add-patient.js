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

    const form = document.getElementById("addPatientForm");
    if (form && window.HospitalStore) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const patientObj = {
                name: document.getElementById("patName").value,
                dob: document.getElementById("patDob").value,
                gender: document.getElementById("patGender").value,
                phone: document.getElementById("patPhone").value,
                address: document.getElementById("patAddress").value,
                emergencyContactName: document.getElementById("patContactName").value,
                emergencyContactPhone: document.getElementById("patContactPhone").value
            };

            const saved = window.HospitalStore.savePatient(patientObj);
            alert(`Admission registration successful!\n\nPatient Name: ${saved.name}\nMRN Assigned: ${saved.mrn}`);
            form.reset();
            window.location.href = "receptionist-dashboard.html";
        });
    }
});
