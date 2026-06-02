document.addEventListener("DOMContentLoaded", function() {
    // Sidebar toggle functionality
    const menuToggle = document.getElementById("menu-toggle");
    const wrapper = document.getElementById("wrapper");
    
    if (menuToggle) {
        menuToggle.addEventListener("click", function(e) {
            e.preventDefault();
            wrapper.classList.toggle("toggled");
        });
    }

    // Dismiss sidebar when clicking outside on mobile devices
    document.addEventListener("click", function(e) {
        if (window.innerWidth <= 768 && wrapper.classList.contains("toggled")) {
            const sidebar = document.getElementById("sidebar-wrapper");
            const toggleBtn = document.getElementById("menu-toggle");
            if (sidebar && !sidebar.contains(e.target) && toggleBtn && !toggleBtn.contains(e.target)) {
                wrapper.classList.remove("toggled");
            }
        }
    });

    // Auto-highlight active sidebar navigation item based on path
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    const sidebarLinks = document.querySelectorAll("#sidebar-wrapper .list-group-item");
    sidebarLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href && href.includes(page)) {
            // Remove active from any other
            sidebarLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        }
    });

    // Simulate simple sign out (support sidebar, dropdown and class triggers)
    const signOutElements = document.querySelectorAll("#sign-out-btn, #sign-out-btn-dropdown, .sign-out-btn");
    signOutElements.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            if (confirm("Are you sure you want to sign out?")) {
                alert("Successfully signed out. Redirecting...");
                if (window.location.pathname.includes("/common/pages/")) {
                    window.location.href = "home.html";
                } else {
                    window.location.href = "../../common/pages/home.html";
                }
            }
        });
    });
});
