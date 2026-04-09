document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isMenuOpen = mobileMenu.style.display === "flex";
      mobileMenu.style.display = isMenuOpen ? "none" : "flex";
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        mobileMenu.style.display = "none";
      }
    });
  }
});
