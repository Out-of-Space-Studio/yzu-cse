document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".header");
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.querySelector(".menu");

    // Close navbar when clicking outside
    document.addEventListener("click", function (event) {
        if (!header.contains(event.target) && menuBtn.checked) {
            closeMenu();
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", handleAnchorClick);
    });

    // Header scroll effect
    if (header) {
        window.addEventListener("scroll", handleHeaderScroll);
    } else {
        console.error("Header element not found");
    }

    // Toggle menu visibility
    menuBtn.addEventListener("change", toggleMenu);

    console.log("Header script loaded and running");
});

function closeMenu() {
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.querySelector(".menu");
    menuBtn.checked = false;
    menu.style.display = "none";
}

function handleAnchorClick(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        const menuBtn = document.getElementById("menu-btn");
        if (menuBtn.checked) {
            closeMenu();
        }
    }
}

function handleHeaderScroll() {
    const header = document.querySelector(".header");
    header.classList.toggle("scrolled", window.scrollY > 50);
}

function toggleMenu() {
    const menu = document.querySelector(".menu");
    menu.style.display = this.checked ? "block" : "none";
}