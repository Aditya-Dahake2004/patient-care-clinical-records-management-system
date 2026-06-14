package com.genc.pccrms.controller;

// Prescription Controller - handles prescription management operations

import com.genc.pccrms.model.Prescription;
import com.genc.pccrms.service.PatientService;
import com.genc.pccrms.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private PatientService patientService;

    @GetMapping
    public String listPrescriptions(Model model) {
        model.addAttribute("prescriptions", prescriptionService.getAllPrescriptions());
        return "prescription/list";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("prescription", new Prescription());
        model.addAttribute("patients", patientService.getAllPatients());
        return "prescription/create";
    }

    @PostMapping("/create")
    public String createPrescription(@ModelAttribute("prescription") Prescription prescription,
                                     @RequestParam("patientId") Integer patientId) {
        prescriptionService.createPrescription(patientId, prescription);
        return "redirect:/prescriptions";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Integer id, Model model) {
        Prescription prescription = prescriptionService.getPrescriptionById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        model.addAttribute("prescription", prescription);
        model.addAttribute("patients", patientService.getAllPatients());
        model.addAttribute("statuses", Prescription.DispenseStatus.values());
        return "prescription/edit";
    }

    @PostMapping("/edit/{id}")
    public String updatePrescription(@PathVariable Integer id,
                                     @ModelAttribute("prescription") Prescription prescription,
                                     @RequestParam("patientId") Integer patientId) {
        prescriptionService.updatePrescription(id, prescription, patientId);
        return "redirect:/prescriptions";
    }

    @GetMapping("/dispense/{id}")
    public String dispenseMedication(@PathVariable Integer id) {
        prescriptionService.dispenseMedication(id);
        return "redirect:/prescriptions";
    }

    @GetMapping("/delete/{id}")
    public String deletePrescription(@PathVariable Integer id) {
        prescriptionService.deletePrescription(id);
        return "redirect:/prescriptions";
    }
}