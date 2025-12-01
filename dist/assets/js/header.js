// Header functionality
document.addEventListener("DOMContentLoaded", function () {
  const burgerBtn = document.querySelector(".header__burger");
  const nav = document.querySelector(".header__nav");
  const navClose = document.querySelector(".header__nav-close");
  const navItems = document.querySelectorAll(".header__nav-item--has-submenu");
  const navLinks = document.querySelectorAll(
    ".header__nav-item--has-submenu > .header__nav-link"
  );
  const submenus = document.querySelectorAll(".header__submenu");
  const isMobile = window.matchMedia("(max-width: 1024px)");

  // Move submenus inside nav items on mobile for proper accordion behavior
  function organizeSubmenusForMobile() {
    if (isMobile.matches) {
      navItems.forEach((navItem) => {
        const submenuName = navItem.getAttribute("data-submenu");
        if (submenuName) {
          const submenu = document.querySelector(
            `.header__submenu[data-submenu-target="${submenuName}"]`
          );
          if (submenu && !navItem.contains(submenu)) {
            // Reset any desktop styles
            submenu.style.top = "";
            submenu.style.position = "";
            navItem.appendChild(submenu);
          }
        }
      });
    } else {
      // Move submenus back to header for desktop
      const header = document.querySelector(".header");
      if (header) {
        submenus.forEach((submenu) => {
          // Check if submenu is inside a nav item
          const parentNavItem = submenu.closest(".header__nav-item");
          if (parentNavItem && !header.contains(submenu)) {
            header.appendChild(submenu);
          }
        });
      }
    }
  }

  // Organize submenus on load and resize
  organizeSubmenusForMobile();

  // Function to close mobile menu
  function closeMobileMenu() {
    nav.classList.remove("active");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    // Close all submenus and reset subcategory states
    navItems.forEach((item) => item.classList.remove("active"));
    submenus.forEach((s) => {
      s.classList.remove("active");
      // Reset subcategory states
      const subCategories = s.querySelectorAll(".header__submenu-title");
      subCategories.forEach((subCategory) => {
        delete subCategory.dataset.toggled;
        subCategory.classList.remove("active");
        const subCategoryList = subCategory.nextElementSibling;
        if (
          subCategoryList &&
          subCategoryList.classList.contains("header__submenu-list")
        ) {
          subCategoryList.classList.remove("active");
        }
      });
    });
    navLinks.forEach((l) => l.classList.remove("active"));
  }

  // Toggle mobile menu with burger button
  if (burgerBtn) {
    burgerBtn.addEventListener("click", function () {
      if (nav.classList.contains("active")) {
        // If menu is open, close it
        closeMobileMenu();
      } else {
        // If menu is closed, open it
        nav.classList.add("active");
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      }
    });
  }

  // Close mobile menu
  if (navClose) {
    navClose.addEventListener("click", function () {
      closeMobileMenu();
    });
  }

  // Handle menu item clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling to document

      const navItem = this.parentElement;
      const submenuName = navItem.getAttribute("data-submenu");
      const submenu = document.querySelector(
        `.header__submenu[data-submenu-target="${submenuName}"]`
      );

      if (submenu) {
        if (isMobile.matches) {
          // Mobile: allow multiple menus open, subcategories open by default
          const isActive = navItem.classList.contains("active");

          // Ensure submenu is inside navItem for mobile
          if (!navItem.contains(submenu)) {
            navItem.appendChild(submenu);
          }

          // Toggle current submenu
          navItem.classList.toggle("active");
          submenu.classList.toggle("active");

          // When opening a submenu, open all subcategories by default
          // If closing and reopening, reset to default open state unless manually toggled
          if (submenu.classList.contains("active")) {
            const subCategories = submenu.querySelectorAll(
              ".header__submenu-title"
            );
            subCategories.forEach((subCategory) => {
              // If this is a fresh open (was closed before), open all subcategories
              // If it was already open and user hasn't manually toggled, keep default open state
              if (!isActive || !subCategory.dataset.toggled) {
                const subCategoryList = subCategory.nextElementSibling;
                if (
                  subCategoryList &&
                  subCategoryList.classList.contains("header__submenu-list")
                ) {
                  subCategoryList.classList.add("active");
                  subCategory.classList.add("active");
                }
              }
            });
          }

          // Reset any desktop positioning styles on mobile
          submenu.style.top = "";
          submenu.style.position = "";
        } else {
          // Desktop: click to toggle
          const isActive = submenu.classList.contains("active");

          // Close all submenus
          submenus.forEach((s) => {
            s.classList.remove("active");
            s.style.top = "";
          });
          navLinks.forEach((l) => l.classList.remove("active"));

          // Toggle current submenu
          if (!isActive) {
            // Calculate header bottom position for submenu
            const header = document.querySelector(".header");
            if (header) {
              const headerRect = header.getBoundingClientRect();
              const headerBottom = headerRect.bottom + window.scrollY;
              submenu.style.top = headerBottom + "px";
            }
            submenu.classList.add("active");
            this.classList.add("active");
          } else {
            // Reset position when closing
            submenu.style.top = "";
          }
        }
      }
    });
  });

  // Close desktop submenu when clicking outside
  document.addEventListener("click", function (e) {
    if (!isMobile.matches) {
      const clickedNavLink = e.target.closest(".header__nav-link");
      const isNavItem = e.target.closest(".header__nav-item--has-submenu");
      const isSubmenu = e.target.closest(".header__submenu");

      // Don't close if clicking on a nav link (it's handled separately) or inside submenu
      if (!clickedNavLink && !isNavItem && !isSubmenu) {
        submenus.forEach((s) => s.classList.remove("active"));
        navLinks.forEach((l) => l.classList.remove("active"));
      }
    }
  });

  // Keep desktop submenu open when clicking inside it
  if (!isMobile.matches) {
    submenus.forEach((submenu) => {
      submenu.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    });
  }

  // Update submenu position on scroll (for desktop)
  function updateSubmenuPosition() {
    if (!isMobile.matches) {
      const header = document.querySelector(".header");
      const activeSubmenu = document.querySelector(".header__submenu.active");
      if (header && activeSubmenu) {
        const headerRect = header.getBoundingClientRect();
        const headerBottom = headerRect.bottom + window.scrollY;
        activeSubmenu.style.top = headerBottom + "px";
      }
    }
  }

  // Handle window resize
  window.addEventListener("resize", function () {
    organizeSubmenusForMobile();

    if (!isMobile.matches) {
      // Close mobile menu if window is resized to desktop
      nav.classList.remove("active");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      navItems.forEach((item) => item.classList.remove("active"));
      updateSubmenuPosition();
    } else {
      // Close desktop submenus if window is resized to mobile
      submenus.forEach((s) => {
        s.classList.remove("active");
        s.style.top = "";
      });
      navLinks.forEach((l) => l.classList.remove("active"));
    }
  });

  // Update submenu position on scroll
  window.addEventListener("scroll", updateSubmenuPosition);

  // Handle subcategory clicks on mobile (toggle subcategory lists)
  function initSubcategoryToggles() {
    if (isMobile.matches) {
      // Use event delegation for dynamically added elements
      document.addEventListener("click", function (e) {
        if (!isMobile.matches) return;

        const subCategoryTitle = e.target.closest(".header__submenu-title");
        if (subCategoryTitle) {
          e.preventDefault();
          e.stopPropagation();

          const subCategoryList = subCategoryTitle.nextElementSibling;
          if (
            subCategoryList &&
            subCategoryList.classList.contains("header__submenu-list")
          ) {
            // Mark as manually toggled
            subCategoryTitle.dataset.toggled = "true";

            // Toggle subcategory
            subCategoryTitle.classList.toggle("active");
            subCategoryList.classList.toggle("active");
          }
        }
      });
    }
  }

  // Initialize subcategory toggles
  initSubcategoryToggles();

  // Reinitialize when window resizes
  window.addEventListener("resize", function () {
    initSubcategoryToggles();
  });
});
