document.addEventListener("DOMContentLoaded", function() {
    const passwordForm = document.getElementById("passwordForm");
    const notificationsForm = document.getElementById("notificationsForm");
    const themeBtn = document.getElementById("btnThemeToggle");

    // Load existing settings or initialize defaults
    let notificationSettings = JSON.parse(localStorage.getItem("patient_notify_settings")) || {
        sms: true,
        email: true
    };

    // Populate checklist
    if (document.getElementById("notifySms")) {
        document.getElementById("notifySms").checked = notificationSettings.sms;
    }
    if (document.getElementById("notifyEmail")) {
        document.getElementById("notifyEmail").checked = notificationSettings.email;
    }

    // Bind password submit
    if (passwordForm) {
        passwordForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const newPass = document.getElementById("newPass").value;
            const confirmPass = document.getElementById("confirmPass").value;

            if (newPass !== confirmPass) {
                alert("Passwords do not match! Please re-type.");
                return;
            }

            alert("Security Password updated successfully!");
            passwordForm.reset();
        });
    }

    // Bind notifications submit
    if (notificationsForm) {
        notificationsForm.addEventListener("submit", function(e) {
            e.preventDefault();
            notificationSettings.sms = document.getElementById("notifySms").checked;
            notificationSettings.email = document.getElementById("notifyEmail").checked;

            localStorage.setItem("patient_notify_settings", JSON.stringify(notificationSettings));
            alert("Notification dispatch preferences saved successfully!");
        });
    }

    // Bind mock Theme toggle
    if (themeBtn) {
        themeBtn.addEventListener("click", function() {
            alert("Dark Contrast theme toggle is simulated in sandboxed frontend mode. Full CSS theme configurations are applied in corporate production environments.");
        });
    }
});
