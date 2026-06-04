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

    if (window.HospitalStore) {
        const patients = window.HospitalStore.getPatients() || [];
        const appts = window.HospitalStore.getAppointments() || [];
        const invoices = window.HospitalStore.getInvoices() || [];
        
        document.getElementById("lblTotalPatients").textContent = patients.length;
        document.getElementById("lblTotalAppts").textContent = appts.length;
        
        let totalRev = 0;
        invoices.filter(i => i.status === "Paid").forEach(i => {
            totalRev += (parseFloat(i.patientPayable) || 0);
        });
        document.getElementById("lblRevenue").textContent = `$${totalRev.toFixed(2)}`;
    }
});
