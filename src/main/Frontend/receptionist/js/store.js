// Central LocalStorage Store for Patient Care & Clinical Records Management System

(function() {
    const DEFAULT_PATIENTS = [
        {
            id: 1,
            mrn: "MRN-10824",
            name: "John Doe",
            dob: "1988-11-14",
            gender: "Male",
            phone: "+1 555-0192",
            address: "742 Evergreen Terrace, Springfield",
            emergencyContactName: "Jane Doe",
            emergencyContactPhone: "+1 555-0193"
        },
        {
            id: 2,
            mrn: "MRN-30512",
            name: "Alice Vance",
            dob: "1995-04-23",
            gender: "Female",
            phone: "+1 555-0183",
            address: "123 Main St, Metro City",
            emergencyContactName: "Greg Vance",
            emergencyContactPhone: "+1 555-0184"
        },
        {
            id: 3,
            mrn: "MRN-40291",
            name: "David Miller",
            dob: "1972-08-05",
            gender: "Male",
            phone: "+1 555-0174",
            address: "456 Oak Ave, Pleasantville",
            emergencyContactName: "Sarah Miller",
            emergencyContactPhone: "+1 555-0175"
        },
        {
            id: 4,
            mrn: "MRN-60913",
            name: "Elena Rostova",
            dob: "1990-12-01",
            gender: "Female",
            phone: "+1 555-0165",
            address: "89 Pine Rd, Silverlake",
            emergencyContactName: "Dmitri Rostov",
            emergencyContactPhone: "+1 555-0166"
        }
    ];

    const DEFAULT_APPOINTMENTS = [
        {
            id: 1,
            patientId: 1,
            patientName: "John Doe",
            doctorId: 1,
            doctorName: "Dr. Sarah Connor",
            department: "Cardiology",
            date: "2026-05-27",
            time: "09:30 AM",
            reason: "Routine cardiovascular wellness screening.",
            status: "BOOKED"
        },
        {
            id: 2,
            patientId: 2,
            patientName: "Alice Vance",
            doctorId: 2,
            doctorName: "Dr. Robert Chen",
            department: "Pediatrics",
            date: "2026-05-27",
            time: "10:45 AM",
            reason: "Allergy consultation and prescription checkup.",
            status: "BOOKED"
        },
        {
            id: 3,
            patientId: 3,
            patientName: "David Miller",
            doctorId: 3,
            doctorName: "Dr. Emily Blunt",
            department: "Neurology",
            date: "2026-05-26",
            time: "01:15 PM",
            reason: "Follow-up discussion on chronic migraines.",
            status: "COMPLETED"
        },
        {
            id: 4,
            patientId: 4,
            patientName: "Elena Rostova",
            doctorId: 2,
            doctorName: "Dr. Robert Chen",
            department: "Pediatrics",
            date: "2026-05-28",
            time: "02:30 PM",
            reason: "Child immunization records update.",
            status: "CANCELLED"
        }
    ];

    const DEFAULT_DIAGNOSES = [
        {
            id: 1,
            patientId: 3,
            patientName: "David Miller",
            symptoms: "Severe throbbing unilateral headache accompanied by nausea and photophobia.",
            diagnosis: "Chronic Migraine without Aura",
            icdCode: "G43.009",
            notes: "Patient advised to track triggers and maintain a headache diary. Recommended quiet dark rooms during acute onset.",
            date: "2026-05-26"
        }
    ];

    const DEFAULT_PRESCRIPTIONS = [
        {
            id: 1,
            patientId: 3,
            patientName: "David Miller",
            medicines: [
                { name: "Sumatriptan 50mg", dosage: "1 Tablet", frequency: "As needed for onset", duration: "10 Days" }
            ],
            notes: "Take at first sign of migraine headache. Do not exceed 2 tablets in 24 hours.",
            date: "2026-05-26",
            status: "PENDING"
        }
    ];

    const DEFAULT_CLINICAL_NOTES = [
        {
            id: 1,
            patientId: 3,
            patientName: "David Miller",
            vitals: { temp: "98.6°F", bp: "120/80 mmHg", hr: "72 bpm", rr: "16 bpm" },
            note: "Patient presented with a history of recurrent headaches. Visual check normal. Neurological exam intact. Diagnosed and treated accordingly.",
            date: "2026-05-26"
        }
    ];

    const DEFAULT_INVENTORY = [
        { id: 1, name: "Sumatriptan 50mg", stock: 8, category: "Analgesics", expiry: "2027-04-12", status: "Low Stock", dosage: "50mg", manufacturer: "GlaxoSmithKline", sideEffects: "Dizziness, drowsiness, nausea" },
        { id: 2, name: "Amoxicillin 500mg", stock: 150, category: "Antibiotics", expiry: "2028-09-20", status: "Available", dosage: "500mg", manufacturer: "Sandoz", sideEffects: "Diarrhea, nausea, skin rash" },
        { id: 3, name: "Lisinopril 10mg", stock: 0, category: "Antihypertensives", expiry: "2026-11-05", status: "Out of Stock", dosage: "10mg", manufacturer: "Pfizer", sideEffects: "Cough, dizziness, headache" },
        { id: 4, name: "Atorvastatin 20mg", stock: 85, category: "Statins", expiry: "2027-12-15", status: "Available", dosage: "20mg", manufacturer: "Merck", sideEffects: "Joint pain, diarrhea, nasopharyngitis" }
    ];

    const DEFAULT_INVOICES = [
        { id: 1, invoiceNumber: "INV-90801", patientId: 3, patientName: "David Miller", date: "2026-05-26", subTotal: 180.00, tax: 18.00, insuranceCoverage: 150.00, patientPayable: 48.00, status: "Paid" }
    ];

    const DEFAULT_PAYMENTS = [
        { id: 1, invoiceNumber: "INV-90801", patientName: "David Miller", amount: 48.00, date: "2026-05-26", method: "Card" }
    ];

    const DEFAULT_CLAIMS = [
        { id: 1, invoiceNumber: "INV-90801", patientName: "David Miller", provider: "Aetna Healthcare", amount: 150.00, status: "Approved", date: "2026-05-26" }
    ];

    // Initialize mock database
    if (!localStorage.getItem("patients")) {
        localStorage.setItem("patients", JSON.stringify(DEFAULT_PATIENTS));
    }
    if (!localStorage.getItem("appointments")) {
        localStorage.setItem("appointments", JSON.stringify(DEFAULT_APPOINTMENTS));
    }
    if (!localStorage.getItem("diagnoses")) {
        localStorage.setItem("diagnoses", JSON.stringify(DEFAULT_DIAGNOSES));
    }
    if (!localStorage.getItem("prescriptions")) {
        localStorage.setItem("prescriptions", JSON.stringify(DEFAULT_PRESCRIPTIONS));
    }
    if (!localStorage.getItem("clinical_notes")) {
        localStorage.setItem("clinical_notes", JSON.stringify(DEFAULT_CLINICAL_NOTES));
    }
    if (!localStorage.getItem("inventory")) {
        localStorage.setItem("inventory", JSON.stringify(DEFAULT_INVENTORY));
    }
    if (!localStorage.getItem("invoices")) {
        localStorage.setItem("invoices", JSON.stringify(DEFAULT_INVOICES));
    }
    if (!localStorage.getItem("payments")) {
        localStorage.setItem("payments", JSON.stringify(DEFAULT_PAYMENTS));
    }
    if (!localStorage.getItem("claims")) {
        localStorage.setItem("claims", JSON.stringify(DEFAULT_CLAIMS));
    }

    // Export Store utility to window
    window.HospitalStore = {
        getPatients: function() {
            return JSON.parse(localStorage.getItem("patients"));
        },
        getPatientById: function(id) {
            const patients = this.getPatients();
            return patients.find(p => p.id == id);
        },
        savePatient: function(patient) {
            const patients = this.getPatients();
            // Generate next ID
            const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
            patient.id = newId;
            patient.mrn = "MRN-" + Math.floor(10000 + Math.random() * 90000);
            patients.push(patient);
            localStorage.setItem("patients", JSON.stringify(patients));
            return patient;
        },
        updatePatient: function(id, updatedData) {
            const patients = this.getPatients();
            const index = patients.findIndex(p => p.id == id);
            if (index !== -1) {
                patients[index] = { ...patients[index], ...updatedData };
                localStorage.setItem("patients", JSON.stringify(patients));
                return true;
            }
            return false;
        },
        getAppointments: function() {
            return JSON.parse(localStorage.getItem("appointments"));
        },
        getAppointmentById: function(id) {
            const appts = this.getAppointments();
            return appts.find(a => a.id == id);
        },
        saveAppointment: function(appt) {
            const appts = this.getAppointments();
            const newId = appts.length > 0 ? Math.max(...appts.map(a => a.id)) + 1 : 1;
            appt.id = newId;
            appts.push(appt);
            localStorage.setItem("appointments", JSON.stringify(appts));
            return appt;
        },
        updateAppointment: function(id, updatedData) {
            const appts = this.getAppointments();
            const index = appts.findIndex(a => a.id == id);
            if (index !== -1) {
                appts[index] = { ...appts[index], ...updatedData };
                localStorage.setItem("appointments", JSON.stringify(appts));
                return true;
            }
            return false;
        },
        getDiagnoses: function() {
            return JSON.parse(localStorage.getItem("diagnoses"));
        },
        saveDiagnosis: function(diag) {
            const diags = this.getDiagnoses();
            const newId = diags.length > 0 ? Math.max(...diags.map(d => d.id)) + 1 : 1;
            diag.id = newId;
            diags.push(diag);
            localStorage.setItem("diagnoses", JSON.stringify(diags));
            return diag;
        },
        getPrescriptions: function() {
            return JSON.parse(localStorage.getItem("prescriptions"));
        },
        savePrescription: function(presc) {
            const prescs = this.getPrescriptions();
            const newId = prescs.length > 0 ? Math.max(...prescs.map(p => p.id)) + 1 : 1;
            presc.id = newId;
            presc.status = "PENDING";
            prescs.push(presc);
            localStorage.setItem("prescriptions", JSON.stringify(prescs));
            return presc;
        },
        updatePrescriptionStatus: function(id, status) {
            const prescs = this.getPrescriptions();
            const index = prescs.findIndex(p => p.id == id);
            if (index !== -1) {
                prescs[index].status = status;
                localStorage.setItem("prescriptions", JSON.stringify(prescs));
                return true;
            }
            return false;
        },
        getClinicalNotes: function() {
            return JSON.parse(localStorage.getItem("clinical_notes"));
        },
        saveClinicalNote: function(note) {
            const notes = this.getClinicalNotes();
            const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
            note.id = newId;
            notes.push(note);
            localStorage.setItem("clinical_notes", JSON.stringify(notes));
            return note;
        },
        getInventory: function() {
            return JSON.parse(localStorage.getItem("inventory"));
        },
        getInventoryItemById: function(id) {
            const inv = this.getInventory();
            return inv.find(item => item.id == id);
        },
        updateInventoryStock: function(medName, qty) {
            const inv = this.getInventory();
            // Try to match by containing string (case insensitive)
            const item = inv.find(i => medName.toLowerCase().includes(i.name.split(" ")[0].toLowerCase()));
            if (item) {
                item.stock = Math.max(0, item.stock - qty);
                if (item.stock === 0) item.status = "Out of Stock";
                else if (item.stock < 10) item.status = "Low Stock";
                else item.status = "Available";

                localStorage.setItem("inventory", JSON.stringify(inv));
                return true;
            }
            return false;
        },
        restockInventoryItem: function(id, qty) {
            const inv = this.getInventory();
            const item = inv.find(i => i.id == id);
            if (item) {
                item.stock += qty;
                if (item.stock === 0) item.status = "Out of Stock";
                else if (item.stock < 10) item.status = "Low Stock";
                else item.status = "Available";

                localStorage.setItem("inventory", JSON.stringify(inv));
                return true;
            }
            return false;
        },
        getInvoices: function() {
            return JSON.parse(localStorage.getItem("invoices"));
        },
        getInvoiceById: function(id) {
            const invs = this.getInvoices();
            return invs.find(i => i.id == id);
        },
        saveInvoice: function(inv) {
            const invs = this.getInvoices();
            const newId = invs.length > 0 ? Math.max(...invs.map(i => i.id)) + 1 : 1;
            inv.id = newId;
            inv.invoiceNumber = "INV-" + Math.floor(10000 + Math.random() * 90000);
            invs.push(inv);
            localStorage.setItem("invoices", JSON.stringify(invs));
            return inv;
        },
        updateInvoiceStatus: function(id, status) {
            const invs = this.getInvoices();
            const index = invs.findIndex(i => i.id == id);
            if (index !== -1) {
                invs[index].status = status;
                localStorage.setItem("invoices", JSON.stringify(invs));
                return true;
            }
            return false;
        },
        getPayments: function() {
            return JSON.parse(localStorage.getItem("payments"));
        },
        savePayment: function(pay) {
            const pays = this.getPayments();
            const newId = pays.length > 0 ? Math.max(...pays.map(p => p.id)) + 1 : 1;
            pay.id = newId;
            pays.push(pay);
            localStorage.setItem("payments", JSON.stringify(pays));
            return pay;
        },
        getClaims: function() {
            return JSON.parse(localStorage.getItem("claims"));
        },
        getClaimById: function(id) {
            const clms = this.getClaims();
            return clms.find(c => c.id == id);
        },
        saveClaim: function(clm) {
            const clms = this.getClaims();
            const newId = clms.length > 0 ? Math.max(...clms.map(c => c.id)) + 1 : 1;
            clm.id = newId;
            clms.push(clm);
            localStorage.setItem("claims", JSON.stringify(clms));
            return clm;
        },
        updateClaimStatus: function(id, status) {
            const clms = this.getClaims();
            const index = clms.findIndex(c => c.id == id);
            if (index !== -1) {
                clms[index].status = status;
                localStorage.setItem("claims", JSON.stringify(clms));
                return true;
            }
            return false;
        }
    };
})();



