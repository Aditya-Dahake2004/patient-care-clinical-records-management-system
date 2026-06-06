package com.genc.pccrms.controller;

import com.genc.pccrms.model.ClinicalRecord;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class EhrController {

    @GetMapping("/varun")
    public String showEncounterForm(Model model) {
        model.addAttribute("clinicalRecord", new ClinicalRecord());
        return "index";
    }
    @PostMapping("/varun")
    public String submitEncounterForm(@ModelAttribute ClinicalRecord clinicalRecord, Model model) {
        System.out.println("Form submitted for Patient ID: " + clinicalRecord.getPatientId());
        model.addAttribute("successMessage", "Encounter saved successfully!");
        model.addAttribute("savedPatientId", clinicalRecord.getPatientId());
        model.addAttribute("savedDiagnosisCode", clinicalRecord.getDiagnosisCode());
        model.addAttribute("savedNotes", clinicalRecord.getClinicalNotes());

        model.addAttribute("clinicalRecord", new ClinicalRecord());
        // html file
        return "index";
    }
}