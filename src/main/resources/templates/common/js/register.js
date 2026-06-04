// Public Register feedback scripting
document.addEventListener("DOMContentLoaded", function() {
    const regForm = document.getElementById("registerForm");
    if (regForm) {
        regForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name = document.getElementById("regName").value;
            const pass = document.getElementById("regPass").value;
            const confirm = document.getElementById("regConfirm").value;

            if (pass !== confirm) {
                alert("Passwords do not match! Recheck confirm inputs.");
                return;
            }

            alert(`Registration query successful!\n\nHealthcare Member: ${name}\n\nSession keys assigned. Please sign in to authenticate.`);
            window.location.href = "login.html";
        });
    }
});
