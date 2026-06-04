package com.genc.pccrms.controller;


import com.genc.pccrms.model.Prescription;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class PrescriptionController {


    @GetMapping("/prescription/form")
    public String showForm(Model model) {
        model.addAttribute("prescription", new Prescription());
        model.addAttribute("statuses", Prescription.DispenseStatus.values());
        return "prescription-form";
    }

    @PostMapping("/prescription/save")
    public String savePrescription(@ModelAttribute Prescription prescription, Model model) {
        model.addAttribute("prescription", prescription);
        return "prescription-result";
    }
}