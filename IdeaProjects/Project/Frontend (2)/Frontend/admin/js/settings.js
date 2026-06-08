document.addEventListener("DOMContentLoaded", function() {
    const profileForm = document.getElementById("profileForm");
    const passwordForm = document.getElementById("passwordForm");
    const saveNotificationBtn = document.getElementById("saveNotificationBtn");

    // Profile Save Simulation
    if (profileForm) {
        profileForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("profileName").value;
            const email = document.getElementById("profileEmail").value;
            
            alert(`Profile settings updated successfully!\n\nName: ${name}\nEmail: ${email}`);
        });
    }

    // Password Update Simulation
    if (passwordForm) {
        passwordForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const currentPass = document.getElementById("currentPassword").value;
            const newPass = document.getElementById("newPassword").value;
            const confirmPass = document.getElementById("confirmPassword").value;

            if (newPass !== confirmPass) {
                alert("Error: New Password and Confirm Password do not match.");
                return;
            }

            if (currentPass === "") {
                alert("Error: Current Password is required.");
                return;
            }

            alert("Password updated successfully! Please note your credentials for future sessions.");
            passwordForm.reset();
        });
    }

    // Notifications Toggles Simulation
    if (saveNotificationBtn) {
        saveNotificationBtn.addEventListener("click", function() {
            const emailAlerts = document.getElementById("emailAlerts").checked;
            const smsAlerts = document.getElementById("smsAlerts").checked;
            const securityLogs = document.getElementById("securityLogs").checked;

            alert(`System Preferences Saved:\n\nEmail Alerts: ${emailAlerts ? "ON" : "OFF"}\nSMS Alerts: ${smsAlerts ? "ON" : "OFF"}\nSecurity Logging: ${securityLogs ? "ON" : "OFF"}`);
        });
    }

    // Theme Picker Simulation
    const themes = document.querySelectorAll(".theme-preview-box");
    themes.forEach(theme => {
        theme.addEventListener("click", function() {
            themes.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            const themeName = this.querySelector(".fw-bold").textContent;
            alert(`Hospital Dashboard theme switched to: ${themeName} (Simulation mode)`);
        });
    });
});
