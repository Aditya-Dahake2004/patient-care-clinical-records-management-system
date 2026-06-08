document.addEventListener("DOMContentLoaded", function() {
    // Export simulation
    const exportPdfBtn = document.getElementById("exportPdfBtn");
    const exportCsvBtn = document.getElementById("exportCsvBtn");

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener("click", function() {
            alert("Exporting report details as PDF document...");
            setTimeout(() => {
                alert("Download complete: Hospital_Activity_Report_2026.pdf");
            }, 1000);
        });
    }

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener("click", function() {
            alert("Generating spreadsheets report file (CSV)...");
            setTimeout(() => {
                alert("Download complete: Hospital_Financial_Data_2026.csv");
            }, 800);
        });
    }

    // Interactive category filtering
    const monthSelect = document.getElementById("reportMonthFilter");
    if (monthSelect) {
        monthSelect.addEventListener("change", function(e) {
            const selectedMonth = e.target.value;
            alert(`Filtering hospital reports data for: ${selectedMonth}`);
            // In a real application, this would trigger an API or redraw content.
        });
    }
});
