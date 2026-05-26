// Public Login authentication script
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const role = document.getElementById("loginRole").value;

            alert(`Authentizing CareRecord session keys...\n\nUser: ${email}\nRole Group: ${role}`);

            // Direct route redirecting to correct clinical dashboard base
            if (role === "Admin") {
                window.location.href = "../../admin/pages/admin-dashboard.html";
            } else if (role === "Receptionist") {
                window.location.href = "../../receptionist/pages/receptionist-dashboard.html";
            } else if (role === "Doctor") {
                window.location.href = "../../doctor/pages/doctor-dashboard.html";
            } else if (role === "Pharmacist") {
                window.location.href = "../../pharmacist/pages/pharmacist-dashboard.html";
            } else if (role === "Billing Officer") {
                window.location.href = "../../billing/pages/billing-dashboard.html";
            } else if (role === "Patient") {
                window.location.href = "../../patient/pages/patient-dashboard.html";
            } else {
                alert("Unauthorized clinical role code!");
            }
        });
    }
});
