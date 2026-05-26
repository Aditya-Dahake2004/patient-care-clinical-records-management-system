document.addEventListener("DOMContentLoaded", () => {
    routeAppointmentModule();
});

function routeAppointmentModule() {
    const path = window.location.pathname;
    
    if (path.includes("module2-appointment-management/index.html") || path.endsWith("module2-appointment-management/")) {
        renderAppointmentDashboard();
    } else if (path.includes("book-appointment.html")) {
        handleBookAppointment();
    } else if (path.includes("list-appointments.html")) {
        renderAppointmentList();
    } else if (path.includes("details-appointment.html")) {
        renderAppointmentDetails();
    } else if (path.includes("doctor-slots.html")) {
        renderDoctorSlots();
    } else if (path.includes("reschedule-appointment.html")) {
        handleRescheduleAppointment();
    }
}

function renderAppointmentDashboard() {
    const appts = getBasicAppointments();
    document.getElementById("widget-total-appts").innerText = appts.length;
    document.getElementById("widget-booked-appts").innerText = appts.filter(a => a.status === "BOOKED").length;
    document.getElementById("widget-completed-appts").innerText = appts.filter(a => a.status === "COMPLETED").length;
}

function handleBookAppointment() {
    const patientDropdown = document.getElementById("appt-patient");
    if (patientDropdown) {
        const patients = getBasicPatients();
        patientDropdown.innerHTML = '<option value="" disabled selected>Select Patient</option>';
        patients.forEach(p => {
            patientDropdown.innerHTML += `<option value="${p.patientId}">${p.fullName} (${p.mrn})</option>`;
        });
    }

    const form = document.getElementById("bookAppointmentForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const patId = document.getElementById("appt-patient").value;
            const doctor = document.getElementById("appt-doctor").value;
            const date = document.getElementById("appt-date").value;
            const time = document.getElementById("appt-time").value;
            
            if (!patId || !doctor || !date || !time) {
                alert("Please fill in all details to book appointment.");
                return;
            }
            
            let appts = getBasicAppointments();
            const newId = appts.length > 0 ? Math.max(...appts.map(a => a.apptId)) + 1 : 101;
            
            const newAppt = { apptId: newId, patientId: parseInt(patId), doctor, date, time, status: "BOOKED" };
            appts.push(newAppt);
            saveBasicEntity("b_appointments", appts);
            
            showBasicAlert("Appointment successfully booked!", "success");
            setTimeout(() => {
                window.location.href = "list-appointments.html";
            }, 1500);
        });
    }
}

function renderAppointmentList() {
    const appts = getBasicAppointments();
    const patients = getBasicPatients();
    const tableBody = document.getElementById("appt-table-body");
    
    if (tableBody) {
        tableBody.innerHTML = "";
        appts.forEach(a => {
            const p = patients.find(pat => pat.patientId == a.patientId);
            const patName = p ? p.fullName : "Unknown Patient";
            
            let badgeClass = "bg-warning-subtle text-warning";
            if (a.status === "COMPLETED") badgeClass = "bg-success-subtle text-success";
            else if (a.status === "CANCELLED") badgeClass = "bg-danger-subtle text-danger";
            
            tableBody.innerHTML += `
                <tr>
                    <td>#${a.apptId}</td>
                    <td>${patName}</td>
                    <td>${a.doctor}</td>
                    <td>${a.date}</td>
                    <td>${a.time}</td>
                    <td><span class="badge ${badgeClass}">${a.status}</span></td>
                    <td>
                        <a href="details-appointment.html?id=${a.apptId}" class="btn btn-sm btn-outline-primary">Details</a>
                        <a href="reschedule-appointment.html?id=${a.apptId}" class="btn btn-sm btn-outline-secondary ${a.status !== 'BOOKED' ? 'disabled' : ''}">Reschedule</a>
                    </td>
                </tr>
            `;
        });
    }
}

function renderAppointmentDetails() {
    const params = new URLSearchParams(window.location.search);
    const apptId = params.get("id") || 101;
    const a = getBasicAppointments().find(app => app.apptId == apptId);
    
    if (a) {
        const p = getBasicPatients().find(pat => pat.patientId == a.patientId);
        document.getElementById("det-id").innerText = `#${a.apptId}`;
        document.getElementById("det-patient").innerText = p ? p.fullName : "Unknown Patient";
        document.getElementById("det-doctor").innerText = a.doctor;
        document.getElementById("det-date").innerText = a.date;
        document.getElementById("det-time").innerText = a.time;
        document.getElementById("det-status").innerText = a.status;
        
        const rescheduleLink = document.getElementById("det-reschedule-link");
        if (rescheduleLink) {
            if (a.status === "BOOKED") {
                rescheduleLink.href = `reschedule-appointment.html?id=${a.apptId}`;
            } else {
                rescheduleLink.classList.add("disabled");
            }
        }

        // Cancel Appointment Trigger
        const cancelBtn = document.getElementById("det-cancel-btn");
        if (cancelBtn) {
            if (a.status !== "BOOKED") {
                cancelBtn.classList.add("disabled");
            } else {
                cancelBtn.addEventListener("click", () => {
                    let appts = getBasicAppointments();
                    const idx = appts.findIndex(app => app.apptId == apptId);
                    if (idx !== -1) {
                        appts[idx].status = "CANCELLED";
                        saveBasicEntity("b_appointments", appts);
                        showBasicAlert("Appointment successfully cancelled.", "danger");
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                });
            }
        }
    }
}

function handleRescheduleAppointment() {
    const params = new URLSearchParams(window.location.search);
    const apptId = params.get("id") || 101;
    let appts = getBasicAppointments();
    const a = appts.find(app => app.apptId == apptId);
    
    if (a) {
        document.getElementById("appt-doctor").value = a.doctor;
        document.getElementById("appt-date").value = a.date;
        document.getElementById("appt-time").value = a.time;
    }
    
    const form = document.getElementById("rescheduleForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const doctor = document.getElementById("appt-doctor").value;
            const date = document.getElementById("appt-date").value;
            const time = document.getElementById("appt-time").value;
            
            const idx = appts.findIndex(app => app.apptId == apptId);
            if (idx !== -1) {
                appts[idx] = { ...appts[idx], doctor, date, time };
                saveBasicEntity("b_appointments", appts);
                
                showBasicAlert("Appointment rescheduled successfully!", "success");
                setTimeout(() => {
                    window.location.href = `details-appointment.html?id=${apptId}`;
                }, 1500);
            }
        });
    }
}

function renderDoctorSlots() {
    const doctorSelect = document.getElementById("slot-doctor");
    const slotsList = document.getElementById("slots-list-body");
    
    if (doctorSelect && slotsList) {
        const displaySlots = () => {
            const doc = doctorSelect.value;
            slotsList.innerHTML = "";
            
            const mockSlots = [
                { time: "09:00 AM", status: "Available" },
                { time: "10:00 AM", status: "Booked" },
                { time: "11:00 AM", status: "Available" },
                { time: "02:00 PM", status: "Available" },
                { time: "03:00 PM", status: "Booked" }
            ];
            
            mockSlots.forEach(s => {
                const btn = s.status === "Available" ? 
                    `<a href="book-appointment.html?doctor=${encodeURIComponent(doc)}&time=${s.time}" class="btn btn-sm btn-outline-primary">Book</a>` :
                    `<button class="btn btn-sm btn-light border text-muted" disabled>Unavailable</button>`;
                
                slotsList.innerHTML += `
                    <div class="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
                        <div>
                            <strong>${s.time}</strong> - <span class="text-secondary">${doc}</span>
                        </div>
                        <div>
                            <span class="badge ${s.status === 'Available' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} me-3">${s.status}</span>
                            ${btn}
                        </div>
                    </div>
                `;
            });
        };
        
        doctorSelect.addEventListener("change", displaySlots);
        displaySlots();
    }
}
