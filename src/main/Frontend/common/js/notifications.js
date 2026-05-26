// Global notifications board script
document.addEventListener("DOMContentLoaded", function() {
    const listContainer = document.getElementById("notificationsList");
    const clearBtn = document.getElementById("clearAllNotifications");

    const defaultNotifications = [
        { id: 1, category: "appt", stamp: "Just Now", title: "New Consultation Scheduled", text: "Patient David Miller has booked an appointment with Dr. Emily Blunt for Cardiology round.", icon: "bi-calendar2-check-fill text-primary" },
        { id: 2, category: "payment", stamp: "2 Hours Ago", title: "Outstanding Invoice Settled", text: "Billing transaction INV-90801 has been settled successfully via Credit Card checkout.", icon: "bi-credit-card-fill text-success" },
        { id: 3, category: "presc", stamp: "1 Day Ago", title: "Prescription Dispensary Update", text: "Outpatient pharmacy has processed Amoxicillin 500mg prescription for Patient Sophia Patel.", icon: "bi-prescription2 text-info" }
    ];

    let list = JSON.parse(localStorage.getItem("system_notifications")) || defaultNotifications;

    function renderNotifications() {
        if (!listContainer) return;
        listContainer.innerHTML = "";

        if (list.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-bell-slash fs-2 d-block mb-2"></i>
                    All notifications cleared! You are completely up to date.
                </div>
            `;
            return;
        }

        list.forEach(n => {
            const card = document.createElement("div");
            card.className = `card clinic-card p-3 alert-card-item ${n.category}`;
            card.innerHTML = `
                <div class="d-flex align-items-start gap-3">
                    <div class="rounded p-2 bg-light flex-shrink-0">
                        <i class="bi ${n.icon} fs-4"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between mb-1">
                            <h6 class="fw-bold mb-0 text-dark">${n.title}</h6>
                            <span class="text-muted small">${n.stamp}</span>
                        </div>
                        <p class="text-secondary small mb-0">${n.text}</p>
                    </div>
                    <button class="btn btn-link btn-sm text-secondary p-0 btn-dismiss" data-id="${n.id}">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            `;
            listContainer.appendChild(card);
        });

        // Bind dismiss buttons
        document.querySelectorAll(".btn-dismiss").forEach(btn => {
            btn.addEventListener("click", function() {
                const notifId = this.getAttribute("data-id");
                list = list.filter(item => item.id != notifId);
                localStorage.setItem("system_notifications", JSON.stringify(list));
                renderNotifications();
            });
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", function() {
            list = [];
            localStorage.setItem("system_notifications", JSON.stringify(list));
            renderNotifications();
        });
    }

    renderNotifications();
});
