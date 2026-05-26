document.addEventListener("DOMContentLoaded", function() {
    // Dynamic Greeting based on time of day
    const greetingEl = document.getElementById("admin-greeting");
    if (greetingEl) {
        const hour = new Date().getHours();
        let message = "Good Evening, Admin";
        if (hour < 12) {
            message = "Good Morning, Admin";
        } else if (hour < 17) {
            message = "Good Afternoon, Admin";
        }
        greetingEl.textContent = message;
    }

    // Refresh Dashboard simulation
    const refreshBtn = document.getElementById("refresh-btn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", function() {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Refreshing...';
            
            setTimeout(() => {
                // Slightly randomize revenue or appointments for simulation
                const revenueEl = document.getElementById("stat-revenue");
                const appointmentsEl = document.getElementById("stat-appointments");
                
                if (revenueEl) {
                    const currentRev = 45200;
                    const change = Math.floor(Math.random() * 500) - 100;
                    revenueEl.textContent = `$${(currentRev + change).toLocaleString()}`;
                }
                
                if (appointmentsEl) {
                    const currentApp = 18;
                    const change = Math.floor(Math.random() * 4) - 2;
                    appointmentsEl.textContent = (currentApp + change).toString();
                }

                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Refresh Stats';
                
                // Show a brief Toast or Alert
                alert("Dashboard stats refreshed successfully!");
            }, 800);
        });
    }

    // View Appointment Details handler
    const viewButtons = document.querySelectorAll(".view-appt-btn");
    viewButtons.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            const row = btn.closest("tr");
            const patient = row.cells[1].textContent.trim();
            const doctor = row.cells[2].textContent.trim();
            const time = row.cells[3].textContent.trim();
            const status = row.cells[4].textContent.trim();

            alert(`Appointment Details:\n\nPatient: ${patient}\nDoctor: ${doctor}\nTime: ${time}\nStatus: ${status}`);
        });
    });
});
