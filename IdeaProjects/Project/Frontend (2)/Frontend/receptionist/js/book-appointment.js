document.addEventListener("DOMContentLoaded", function() {
    if (!window.HospitalStore) {
        console.error("HospitalStore utility missing!");
        return;
    }

    const patientSelect = document.getElementById("apptPatient");
    const doctorSelect = document.getElementById("apptDoctor");
    const apptForm = document.getElementById("bookAppointmentForm");
    const slotContainer = document.getElementById("timeSlotContainer");

    // Static Doctors details mapped to departments
    const doctorsList = [
        { id: 1, name: "Dr. Sarah Connor", dept: "Cardiology" },
        { id: 2, name: "Dr. Robert Chen", dept: "Pediatrics" },
        { id: 3, name: "Dr. Emily Blunt", dept: "Neurology" },
        { id: 4, name: "Dr. James Carter", dept: "Orthopedics" }
    ];

    // Load registered patients into dropdown
    const patients = window.HospitalStore.getPatients();
    if (patientSelect) {
        patients.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = `${p.name} (${p.mrn})`;
            patientSelect.appendChild(opt);
        });

        // Pre-select patient from query param if available
        const urlParams = new URLSearchParams(window.location.search);
        const preSelectedPatientId = urlParams.get("patientId");
        if (preSelectedPatientId) {
            patientSelect.value = preSelectedPatientId;
        }
    }

    // Load doctors based on department selection
    const deptSelect = document.getElementById("apptDepartment");
    if (deptSelect && doctorSelect) {
        deptSelect.addEventListener("change", function() {
            const selectedDept = deptSelect.value;
            doctorSelect.innerHTML = '<option value="" disabled selected>Select Medical Practitioner</option>';
            
            const filteredDocs = doctorsList.filter(d => d.dept === selectedDept);
            filteredDocs.forEach(d => {
                const opt = document.createElement("option");
                opt.value = d.name;
                opt.textContent = d.name;
                doctorSelect.appendChild(opt);
            });
        });
    }

    // Time slot rendering and interactive selection
    let selectedTimeSlot = "";
    const slots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:45 AM", "11:30 AM", "01:15 PM", "02:00 PM", "02:30 PM", "03:15 PM"];
    
    if (slotContainer) {
        slots.forEach(slot => {
            const btn = document.createElement("div");
            btn.className = "slot-btn";
            btn.textContent = slot;
            
            // Randomly disable 2 slots for realistic simulation
            if (Math.random() < 0.22) {
                btn.classList.add("disabled");
            } else {
                btn.addEventListener("click", function() {
                    document.querySelectorAll(".slot-btn").forEach(s => s.classList.remove("selected"));
                    btn.classList.add("selected");
                    selectedTimeSlot = slot;
                });
            }
            slotContainer.appendChild(btn);
        });
    }

    // Book Appointment submission handler
    if (apptForm) {
        apptForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const patientId = patientSelect.value;
            const patientName = patientSelect.options[patientSelect.selectedIndex].text.split(" (")[0];
            const doctorName = doctorSelect.value;
            const department = deptSelect.value;
            const date = document.getElementById("apptDate").value;
            const reason = document.getElementById("apptReason").value.trim();

            if (!patientId || !doctorName || !department || !date) {
                alert("Please fill all required scheduling attributes.");
                return;
            }

            if (!selectedTimeSlot) {
                alert("Please select an available time slot.");
                return;
            }

            const apptObj = {
                patientId,
                patientName,
                doctorName,
                department,
                date,
                time: selectedTimeSlot,
                reason,
                status: "BOOKED"
            };

            const saved = window.HospitalStore.saveAppointment(apptObj);
            alert(`Appointment scheduled successfully!\n\nPatient: ${saved.patientName}\nDoctor: ${saved.doctorName}\nSlot: ${saved.date} @ ${saved.time}`);
            
            // Redirect to appointment lists
            window.location.href = "appointment-list.html";
        });
    }
});
