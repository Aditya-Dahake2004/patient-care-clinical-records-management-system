// Public Forgot password specific scripting
document.addEventListener("DOMContentLoaded", function() {
    const forgotForm = document.getElementById("forgotForm");
    if (forgotForm) {
        forgotForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.getElementById("forgotEmail").value;
            alert(`A security password reset token has been dispatched to: ${email}\n\nRecheck your inbox shortly.`);
            forgotForm.reset();
        });
    }
});
