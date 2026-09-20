// Wait until the HTML document has finished loading
document.addEventListener("DOMContentLoaded", () => {

  // Select the mobile menu toggle button
  const toggle = document.querySelector(".menu-toggle");

  // Select the mobile navigation menu
  const mobileNav = document.getElementById("mobile-nav");

  // Check that both the toggle button and mobile navigation exist
  if (toggle && mobileNav) {

    // Listen for a click on the mobile menu toggle
    toggle.addEventListener("click", () => {

      // Toggle the "is-open" class on the mobile navigation
      // and store whether the menu is currently open
      const isOpen = mobileNav.classList.toggle("is-open");

      // Update the aria-expanded attribute for accessibility
      // "true" means the menu is open, "false" means it is closed
      toggle.setAttribute("aria-expanded", String(isOpen));

    });
  }
});