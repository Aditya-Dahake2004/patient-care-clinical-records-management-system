document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientForm = document.getElementById("addPatientForm");
    const mrnField = document.getElementById("patientMRN");

    // Pre-populate a fake simulated MRN just to look realistic
    if (mrnField) {
        mrnField.value = "MRN-(Auto Generated)";
    }

    if (patientForm) {
        patientForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name = document.getElementById("fullName").value.trim();
            const dob = document.getElementById("dob").value;
            const gender = document.getElementById("gender").value;
            const phone = document.getElementById("contactNumber").value.trim();
            const address = document.getElementById("address").value.trim();
            const emergencyContactName = document.getElementById("emergencyName").value.trim();
            const emergencyContactPhone = document.getElementById("emergencyPhone").value.trim();

            if (!name || !dob || !gender || !phone) {
                alert("Please fill all required demographics.");
                return;
            }

            const patientObj = {
                name,
                dob,
                gender,
                phone,
                address,
                emergencyContactName,
                emergencyContactPhone
            };

            const saved = window.HospitalStore.savePatient(patientObj);
            alert(`Patient registered successfully!\n\nName: ${saved.name}\nAssigned MRN: ${saved.mrn}`);
            
            // Redirect to patient list page
            window.location.href = "patient-list.html";
        });
    }
});
