document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientId = 1;

    function populateProfile() {
        const p = window.HospitalStore.getPatientById(patientId);
        if (!p) return;

        // Populate fields
        document.getElementById("lblProfileName").textContent = p.name;
        document.getElementById("lblProfileMrn").textContent = p.mrn;
        document.getElementById("txtFullName").textContent = p.name;
        document.getElementById("txtDob").textContent = p.dob;
        document.getElementById("txtGender").textContent = p.gender;
        document.getElementById("txtPhone").textContent = p.phone;
        document.getElementById("txtAddress").textContent = p.address;

        document.getElementById("txtContactName").textContent = p.emergencyContactName;
        document.getElementById("txtContactPhone").textContent = p.emergencyContactPhone;

        const editBtn = document.getElementById("btnEditProfile");
        if (editBtn) {
            editBtn.addEventListener("click", function() {
                alert("To modify demographic details or emergency contacts, please present authorized ID verification papers at CareRecord Clinic's front desk registration office.");
            });
        }
    }

    populateProfile();
});
