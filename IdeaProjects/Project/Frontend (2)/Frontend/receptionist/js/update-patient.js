document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("id");

    if (!patientId) {
        alert("Error: No patient specified for updates. Redirecting to patient list.");
        window.location.href = "patient-list.html";
        return;
    }

    const patient = window.HospitalStore.getPatientById(patientId);
    if (!patient) {
        alert("Error: Patient record not found. Redirecting to patient list.");
        window.location.href = "patient-list.html";
        return;
    }

    // Pre-fill form fields
    document.getElementById("patientMRN").value = patient.mrn;
    document.getElementById("fullName").value = patient.name;
    document.getElementById("dob").value = patient.dob;
    document.getElementById("gender").value = patient.gender;
    document.getElementById("contactNumber").value = patient.phone;
    document.getElementById("address").value = patient.address || "";
    document.getElementById("emergencyName").value = patient.emergencyContactName || "";
    document.getElementById("emergencyPhone").value = patient.emergencyContactPhone || "";

    const updatePatientForm = document.getElementById("updatePatientForm");
    if (updatePatientForm) {
        updatePatientForm.addEventListener("submit", function(e) {
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

            const updatedObj = {
                name,
                dob,
                gender,
                phone,
                address,
                emergencyContactName,
                emergencyContactPhone
            };

            const success = window.HospitalStore.updatePatient(patientId, updatedObj);
            if (success) {
                alert("Patient demographic records updated successfully!");
                window.location.href = `patient-details.html?id=${patientId}`;
            } else {
                alert("Error updating record. Please try again.");
            }
        });
    }

    // Cancel Button Handler
    const cancelBtn = document.getElementById("cancelUpdateBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function(e) {
            e.preventDefault();
            window.location.href = `patient-details.html?id=${patientId}`;
        });
    }
});
