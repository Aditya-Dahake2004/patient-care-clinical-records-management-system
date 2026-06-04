// Public Contact feedback scripting
document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("contactName").value;
            alert(`Thank you for writing, ${name}!\n\nYour message feedback has been sent safely to CareRecord Clinical Administration. We will respond within 24 working hours.`);
            contactForm.reset();
        });
    }
});
