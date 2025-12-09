// Care section slider functionality
(function () {
  "use strict";

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const careSection = document.querySelector(".care");
    if (!careSection) return;

    const cardsContainer = careSection.querySelector(".care__cards");
    if (!cardsContainer) return;

    const cards = careSection.querySelectorAll(".care__card");
    if (cards.length === 0) return;

    // Use matchMedia for better performance
    const mobileMediaQuery = window.matchMedia("(max-width: 992px)");

    // Drag state
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    // Event handlers
    const handleMouseDown = (e) => {
      if (!mobileMediaQuery.matches) return;
      isDown = true;
      startX = e.pageX - cardsContainer.offsetLeft;
      scrollLeft = cardsContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e) => {
      if (!isDown || !mobileMediaQuery.matches) return;
      e.preventDefault();
      const x = e.pageX - cardsContainer.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed
      cardsContainer.scrollLeft = scrollLeft - walk;
    };

    // Add event listeners
    cardsContainer.addEventListener("mousedown", handleMouseDown);
    cardsContainer.addEventListener("mouseleave", handleMouseLeave);
    cardsContainer.addEventListener("mouseup", handleMouseUp);
    cardsContainer.addEventListener("mousemove", handleMouseMove);
  }
})();

(function () {
  "use strict";

  const footer = document.querySelector(".footer");
  if (!footer) return;

  const footerLogo = footer.querySelector(".footer__logo");
  const footerSocial = footer.querySelector(".footer__social");
  const footerBottom = footer.querySelector(".footer__bottom");
  const footerContent = footer.querySelector(".footer__content");

  if (!footerLogo || !footerSocial || !footerBottom || !footerContent) return;

  // Breakpoint for mobile devices
  const mobileBreakpoint = 1200; // $breakpoint-md

  // Function to check if we're on mobile
  function isMobile() {
    return window.innerWidth <= mobileBreakpoint;
  }

  // Function to rearrange elements for mobile
  function rearrangeForMobile() {
    if (!isMobile()) return;

    // Create container for logo and social media
    let logoSocialWrapper = footerContent.querySelector(
      ".footer__logo-social-wrapper"
    );
    if (!logoSocialWrapper) {
      logoSocialWrapper = document.createElement("div");
      logoSocialWrapper.className = "footer__logo-social-wrapper";

      // Insert at the beginning of footer__content
      footerContent.insertBefore(logoSocialWrapper, footerContent.firstChild);
    }

    // Move logo to wrapper (if not already there)
    if (footerLogo && !logoSocialWrapper.contains(footerLogo)) {
      logoSocialWrapper.appendChild(footerLogo);
    }

    // Move social media to wrapper (if not already there)
    if (footerSocial && !logoSocialWrapper.contains(footerSocial)) {
      logoSocialWrapper.appendChild(footerSocial);
    }

    // Move bottom menu (copyright + legal) to main content
    if (footerBottom && footerContent) {
      const copyright = footerBottom.querySelector(".footer__copyright");
      const legal = footerBottom.querySelector(".footer__legal");

      if (copyright && !footerContent.contains(copyright)) {
        footerContent.appendChild(copyright);
      }
      if (legal && !footerContent.contains(legal)) {
        footerContent.appendChild(legal);
      }
    }
  }

  // Function to restore elements for desktop
  function rearrangeForDesktop() {
    if (isMobile()) return;

    // Remove wrapper if it exists
    const logoSocialWrapper = footerContent.querySelector(
      ".footer__logo-social-wrapper"
    );
    if (logoSocialWrapper) {
      // Restore logo to footer__left
      if (footerLogo && logoSocialWrapper.contains(footerLogo)) {
        const footerLeft = footerContent.querySelector(".footer__left");
        if (footerLeft) {
          footerLeft.insertBefore(footerLogo, footerLeft.firstChild);
        }
      }

      // Restore social media to footer__bottom
      if (
        footerSocial &&
        logoSocialWrapper.contains(footerSocial) &&
        footerBottom
      ) {
        footerBottom.appendChild(footerSocial);
      }

      // Remove wrapper
      logoSocialWrapper.remove();
    }

    // Restore copyright and legal to footer__bottom
    if (footerBottom && footerContent) {
      const copyright = footerContent.querySelector(".footer__copyright");
      const legal = footerContent.querySelector(".footer__legal");

      if (copyright && !footerBottom.contains(copyright)) {
        footerBottom.insertBefore(copyright, footerBottom.firstChild);
      }
      if (legal && !footerBottom.contains(legal)) {
        // Insert before social media
        const social = footerBottom.querySelector(".footer__social");
        if (social) {
          footerBottom.insertBefore(legal, social);
        } else {
          footerBottom.appendChild(legal);
        }
      }
    }
  }

  // Initialize on load
  function init() {
    if (isMobile()) {
      rearrangeForMobile();
    } else {
      rearrangeForDesktop();
    }
  }

  // Handle window resize
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (isMobile()) {
        rearrangeForMobile();
      } else {
        rearrangeForDesktop();
      }
    }, 250);
  });

  // Run on DOM load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

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

  // Function to update link hrefs based on screen size
  function updateLinkHrefs() {
    navLinks.forEach((link) => {
      const dataHref = link.getAttribute("data-href");
      if (dataHref) {
        if (isMobile.matches) {
          // Mobile: keep href="#" for click behavior
          link.setAttribute("href", "#");
        } else {
          // Desktop: use actual URL
          link.setAttribute("href", dataHref);
        }
      }
    });
  }

  // Update link hrefs on load and resize
  updateLinkHrefs();

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

  // Hover timers for desktop submenu delay
  const hoverTimers = new Map();
  let hoverSetupDone = false;

  // Function to show submenu with delay (desktop only)
  function showSubmenuWithDelay(navItem, submenu, link, delay = 200) {
    // Clear any existing timer for this item
    const timerId = hoverTimers.get(navItem);
    if (timerId) {
      clearTimeout(timerId);
    }

    // Set new timer
    const timer = setTimeout(() => {
      // Close all other submenus
      submenus.forEach((s) => {
        if (s !== submenu) {
          s.classList.remove("active");
        }
      });
      navLinks.forEach((l) => {
        if (l !== link) {
          l.classList.remove("active");
        }
      });

      // Show current submenu
      submenu.classList.add("active");
      link.classList.add("active");
      hoverTimers.delete(navItem);
    }, delay);

    hoverTimers.set(navItem, timer);
  }

  // Function to hide submenu with delay (desktop only)
  function hideSubmenuWithDelay(navItem, submenu, link, delay = 150) {
    // Clear any pending show timer
    const showTimerId = hoverTimers.get(navItem);
    if (showTimerId) {
      clearTimeout(showTimerId);
      hoverTimers.delete(navItem);
    }

    // Set hide timer
    const hideTimer = setTimeout(() => {
      submenu.classList.remove("active");
      link.classList.remove("active");
      hoverTimers.delete(navItem + "_hide");
    }, delay);

    hoverTimers.set(navItem + "_hide", hideTimer);
  }

  // Function to hide submenu immediately (desktop only)
  function hideSubmenu(navItem, submenu, link) {
    // Clear any pending timers
    const showTimerId = hoverTimers.get(navItem);
    const hideTimerId = hoverTimers.get(navItem + "_hide");
    if (showTimerId) {
      clearTimeout(showTimerId);
      hoverTimers.delete(navItem);
    }
    if (hideTimerId) {
      clearTimeout(hideTimerId);
      hoverTimers.delete(navItem + "_hide");
    }

    // Hide submenu
    submenu.classList.remove("active");
    link.classList.remove("active");
  }

  // Add hover event listeners for desktop
  function setupDesktopHover() {
    if (!isMobile.matches && !hoverSetupDone) {
      const header = document.querySelector(".header");

      navItems.forEach((navItem) => {
        const link = navItem.querySelector(".header__nav-link");
        const submenuName = navItem.getAttribute("data-submenu");
        const submenu = document.querySelector(
          `.header__submenu[data-submenu-target="${submenuName}"]`
        );

        if (submenu && link) {
          // Mouse enter on nav item - show submenu with delay
          navItem.addEventListener("mouseenter", function () {
            showSubmenuWithDelay(navItem, submenu, link);
          });

          // Mouse leave from nav item - hide submenu with delay (to allow transition to submenu)
          navItem.addEventListener("mouseleave", function (e) {
            // Check if mouse is moving to submenu
            const relatedTarget = e.relatedTarget;
            if (relatedTarget) {
              const isMovingToSubmenu =
                submenu.contains(relatedTarget) || relatedTarget === submenu;
              const isMovingToNavItem = navItem.contains(relatedTarget);
              const isMovingToHeader =
                header &&
                (header.contains(relatedTarget) || relatedTarget === header);

              // Only hide if mouse is not moving to submenu, navItem, or header
              if (
                !isMovingToSubmenu &&
                !isMovingToNavItem &&
                !isMovingToHeader
              ) {
                // Mouse is leaving to somewhere else, hide with delay
                hideSubmenuWithDelay(navItem, submenu, link);
              }
            } else {
              // No related target, hide with delay
              hideSubmenuWithDelay(navItem, submenu, link);
            }
          });

          // Keep submenu open when hovering over it
          submenu.addEventListener("mouseenter", function () {
            // Clear any hide timer
            const hideTimerId = hoverTimers.get(navItem + "_hide");
            if (hideTimerId) {
              clearTimeout(hideTimerId);
              hoverTimers.delete(navItem + "_hide");
            }
            // Clear any show timer
            const showTimerId = hoverTimers.get(navItem);
            if (showTimerId) {
              clearTimeout(showTimerId);
              hoverTimers.delete(navItem);
            }
            submenu.classList.add("active");
            link.classList.add("active");
          });

          // Mouse leave from submenu - hide with delay
          submenu.addEventListener("mouseleave", function (e) {
            const relatedTarget = e.relatedTarget;
            if (relatedTarget) {
              const isMovingToNavItem =
                navItem.contains(relatedTarget) || relatedTarget === navItem;
              const isMovingToSubmenu =
                submenu.contains(relatedTarget) || relatedTarget === submenu;
              const isMovingToHeader =
                header &&
                (header.contains(relatedTarget) || relatedTarget === header);

              // Only hide if mouse is not moving to navItem, submenu, or header
              if (
                !isMovingToNavItem &&
                !isMovingToSubmenu &&
                !isMovingToHeader
              ) {
                // Mouse is leaving to somewhere else, hide with delay
                hideSubmenuWithDelay(navItem, submenu, link);
              }
            } else {
              // No related target, hide with delay
              hideSubmenuWithDelay(navItem, submenu, link);
            }
          });
        }
      });

      // Close submenu when mouse leaves header completely
      if (header) {
        header.addEventListener("mouseleave", function (e) {
          const relatedTarget = e.relatedTarget;
          // Only close if mouse is truly leaving (not moving to another element inside header)
          if (!relatedTarget || !header.contains(relatedTarget)) {
            // Clear all timers first
            hoverTimers.forEach((timer) => clearTimeout(timer));
            hoverTimers.clear();
            // Then close all submenus
            submenus.forEach((s) => s.classList.remove("active"));
            navLinks.forEach((l) => l.classList.remove("active"));
          }
        });
      }

      hoverSetupDone = true;
    } else if (isMobile.matches) {
      hoverSetupDone = false;
    }
  }

  // Setup desktop hover on load
  setupDesktopHover();

  // Handle menu item clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const navItem = this.parentElement;
      const submenuName = navItem.getAttribute("data-submenu");
      const submenu = document.querySelector(
        `.header__submenu[data-submenu-target="${submenuName}"]`
      );

      if (submenu) {
        if (isMobile.matches) {
          // Mobile: prevent default and toggle submenu
          e.preventDefault();
          e.stopPropagation(); // Prevent event from bubbling to document

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
          // Desktop: allow link to work normally (don't prevent default)
          // The hover functionality will handle submenu display
          // Only prevent default if clicking on the link while submenu is already open
          // (to allow navigation to the page)
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
        // Clear all hover timers
        hoverTimers.forEach((timer) => clearTimeout(timer));
        hoverTimers.clear();
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
    // For fixed header, position is handled by CSS, no JS update needed
  }

  // Handle window resize
  window.addEventListener("resize", function () {
    organizeSubmenusForMobile();
    updateLinkHrefs();

    if (!isMobile.matches) {
      // Close mobile menu if window is resized to desktop
      nav.classList.remove("active");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      navItems.forEach((item) => item.classList.remove("active"));
      updateSubmenuPosition();
      // Setup desktop hover (will only set up if not already done)
      hoverSetupDone = false;
      setupDesktopHover();
    } else {
      // Close desktop submenus if window is resized to mobile
      submenus.forEach((s) => {
        s.classList.remove("active");
        s.style.top = "";
      });
      navLinks.forEach((l) => l.classList.remove("active"));
      // Clear all hover timers
      hoverTimers.forEach((timer) => clearTimeout(timer));
      hoverTimers.clear();
      hoverSetupDone = false;
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

  // Handle search container click - focus input
  const searchContainers = document.querySelectorAll(".header__search");
  const isMediumScreen = window.matchMedia(
    "(min-width: 1025px) and (max-width: 1439px)"
  );

  searchContainers.forEach((searchContainer) => {
    const searchInput = searchContainer.querySelector(".header__search-input");
    const headerRight = searchContainer.closest(".header__right");
    const actionsContainer = headerRight
      ? headerRight.querySelector(".header__actions")
      : null;
    const ctaButton = actionsContainer
      ? actionsContainer.querySelector(".header__cta-primary")
      : null;

    if (searchInput) {
      searchContainer.addEventListener("click", function (e) {
        e.preventDefault();

        // For medium screens (1025px-1439px), toggle active state
        if (isMediumScreen.matches && ctaButton) {
          searchContainer.classList.add("header__search--active");
          if (actionsContainer) {
            actionsContainer.classList.add("header__actions--search-active");
          }
        }

        searchInput.focus();
      });

      // Handle blur - hide input and show button if input is empty (medium screens only)
      searchInput.addEventListener("blur", function () {
        if (isMediumScreen.matches && ctaButton && !this.value.trim()) {
          // Small delay to allow clicking on other elements
          setTimeout(() => {
            if (document.activeElement !== searchInput) {
              searchContainer.classList.remove("header__search--active");
              if (actionsContainer) {
                actionsContainer.classList.remove(
                  "header__actions--search-active"
                );
              }
            }
          }, 200);
        }
      });

      // Keep active state if input has value (medium screens only)
      searchInput.addEventListener("input", function () {
        if (isMediumScreen.matches && ctaButton) {
          if (this.value.trim()) {
            searchContainer.classList.add("header__search--active");
            if (actionsContainer) {
              actionsContainer.classList.add("header__actions--search-active");
            }
          } else {
            // Only remove if not focused
            if (document.activeElement !== this) {
              searchContainer.classList.remove("header__search--active");
              if (actionsContainer) {
                actionsContainer.classList.remove(
                  "header__actions--search-active"
                );
              }
            }
          }
        }
      });
    }
  });

  // Update on window resize
  window.addEventListener("resize", function () {
    if (!isMediumScreen.matches) {
      // Remove active class if resized outside medium screen range
      searchContainers.forEach((searchContainer) => {
        searchContainer.classList.remove("header__search--active");
        const headerRight = searchContainer.closest(".header__right");
        const actionsContainer = headerRight
          ? headerRight.querySelector(".header__actions")
          : null;
        if (actionsContainer) {
          actionsContainer.classList.remove("header__actions--search-active");
        }
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".experiences__slider");
  if (!slider) return;

  const slidesContainer = slider.querySelector(".experiences__slides");
  const originalSlides = slider.querySelectorAll(".experiences__slide");
  const dotsContainer = slider.querySelector(".experiences__dots");
  const prevBtn = slider.querySelector(".experiences__nav-btn--prev");
  const nextBtn = slider.querySelector(".experiences__nav-btn--next");

  if (originalSlides.length === 0) return;

  const totalRealSlides = originalSlides.length;
  let currentSlide = 1; // Start at first real slide (index 1, because 0 is clone)
  let isTransitioning = false;

  // Remove any existing active classes from slides
  originalSlides.forEach((slide) => {
    slide.classList.remove("experiences__slide--active");
  });

  // Create dots dynamically based on number of slides
  let dots = [];
  if (dotsContainer) {
    dotsContainer.innerHTML = ""; // Clear any existing dots
    for (let i = 0; i < totalRealSlides; i++) {
      const dot = document.createElement("button");
      dot.className = "experiences__dot";
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  }

  // Clone last slide and add to beginning
  const lastSlideClone = originalSlides[totalRealSlides - 1].cloneNode(true);
  lastSlideClone.classList.add("experiences__slide--clone");
  slidesContainer.insertBefore(lastSlideClone, originalSlides[0]);

  // Clone first slide and add to end
  const firstSlideClone = originalSlides[0].cloneNode(true);
  firstSlideClone.classList.add("experiences__slide--clone");
  slidesContainer.appendChild(firstSlideClone);

  // Get all slides including clones
  const allSlides = slidesContainer.querySelectorAll(".experiences__slide");

  function getSlideWidth() {
    if (window.innerWidth <= 768) {
      // For mobile (md and below), use 100% width
      return 100;
    } else if (window.innerWidth <= 992) {
      return 90;
    } else if (window.innerWidth <= 1200) {
      return 85;
    }
    return 80;
  }

  function getActualSlideWidth() {
    const slideWidthPercent = getSlideWidth();
    const containerWidth = slidesContainer.offsetWidth;

    // Get max-width from CSS custom property (use first real slide)
    const firstRealSlide = originalSlides[0];
    const computedStyle = window.getComputedStyle(firstRealSlide);
    const maxWidthValue = computedStyle
      .getPropertyValue("--slide-max-width")
      .trim();

    // Parse CSS value (can be px or %)
    let maxSlideWidth;
    if (maxWidthValue.includes("%")) {
      // If it's a percentage, calculate based on container width
      const percent = parseFloat(maxWidthValue);
      maxSlideWidth = (containerWidth * percent) / 100;
    } else if (maxWidthValue) {
      // If it's px or other unit, parse as pixels
      maxSlideWidth = parseFloat(maxWidthValue) || 800; // fallback to 800px
    } else {
      // Fallback if CSS variable is not found
      maxSlideWidth = 800;
    }

    // Calculate actual slide width (considering max-width)
    return Math.min((containerWidth * slideWidthPercent) / 100, maxSlideWidth);
  }

  function updateSlider(instant = false, force = false) {
    if (isTransitioning && !instant && !force) return;

    // Calculate real slide index (0-based for real slides)
    let realSlideIndex = currentSlide - 1;
    if (realSlideIndex < 0) realSlideIndex = totalRealSlides - 1;
    if (realSlideIndex >= totalRealSlides) realSlideIndex = 0;

    // Update active slide (only for real slides)
    allSlides.forEach((slide, index) => {
      const isClone = slide.classList.contains("experiences__slide--clone");
      if (!isClone) {
        // Real slide index: index - 1 (because first is clone)
        const slideRealIndex = index - 1;
        slide.classList.toggle(
          "experiences__slide--active",
          slideRealIndex === realSlideIndex
        );
      } else {
        // Clones are never active
        slide.classList.remove("experiences__slide--active");
      }
    });

    // Update active dot (0-based for real slides)
    dots.forEach((dot, index) => {
      dot.classList.toggle(
        "experiences__dot--active",
        index === realSlideIndex
      );
    });

    // Calculate transform
    const containerWidth = slidesContainer.offsetWidth;
    const slideWidthPx = getActualSlideWidth();

    // Calculate center offset
    const centerOffsetPx = (containerWidth - slideWidthPx) / 2;

    // Calculate translateX in pixels
    // Each slide takes slideWidthPx, and we need to center the active one
    const translateXPx = -(currentSlide * slideWidthPx) + centerOffsetPx;

    // Convert to percentage for consistency
    const translateX = (translateXPx / containerWidth) * 100;

    if (instant) {
      slidesContainer.style.transition = "none";
    } else {
      slidesContainer.style.transition = "transform 0.5s ease-in-out";
    }

    slidesContainer.style.transform = `translateX(${translateX}%)`;

    // Reset transition after instant move
    if (instant) {
      // Use requestAnimationFrame to ensure DOM update happens before transition reset
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          slidesContainer.style.transition = "transform 0.5s ease-in-out";
        });
      });
    }
  }

  function goToSlide(index, instant = false) {
    if (isTransitioning && !instant) return;

    currentSlide = index;
    updateSlider(instant);

    if (!instant) {
      isTransitioning = true;
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }
  }

  function handleCloneTransition(isNext) {
    // Remove transition temporarily for instant jump
    slidesContainer.style.transition = "none";

    if (isNext) {
      // Jump from last clone to first real slide
      currentSlide = 1;
    } else {
      // Jump from first clone to last real slide
      currentSlide = totalRealSlides;
    }

    updateSlider(true);

    // Force a reflow to ensure the instant position change is rendered
    slidesContainer.offsetHeight;

    // Re-enable transition after ensuring the browser has rendered the position change
    // Use double RAF to ensure smooth next transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        slidesContainer.style.transition = "transform 0.5s ease-in-out";
        isTransitioning = false;
      });
    });
  }

  function nextSlide() {
    if (isTransitioning) return;

    currentSlide++;
    isTransitioning = true;

    // If we're at the last clone (index = totalRealSlides + 1), jump to first real slide
    if (currentSlide >= totalRealSlides + 1) {
      // Animate to clone first, then handle transition
      updateSlider(false, true);

      slidesContainer.addEventListener(
        "transitionend",
        function handleTransition(event) {
          // Only handle transform transitions, ignore other property changes
          if (event.propertyName !== "transform") return;

          slidesContainer.removeEventListener(
            "transitionend",
            handleTransition
          );
          handleCloneTransition(true);
        },
        { once: true }
      );
    } else {
      updateSlider(false, true);
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }
  }

  function prevSlide() {
    if (isTransitioning) return;

    currentSlide--;
    isTransitioning = true;

    // If we're at the first clone (index = 0), jump to last real slide
    if (currentSlide < 1) {
      // Animate to clone first, then handle transition
      updateSlider(false, true);

      slidesContainer.addEventListener(
        "transitionend",
        function handleTransition(event) {
          // Only handle transform transitions, ignore other property changes
          if (event.propertyName !== "transform") return;

          slidesContainer.removeEventListener(
            "transitionend",
            handleTransition
          );
          handleCloneTransition(false);
        },
        { once: true }
      );
    } else {
      updateSlider(false, true);
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }
  }

  function goToRealSlide(realIndex) {
    // realIndex is 0-based for dots (0-5)
    // currentSlide is 1-based including clone (1-7)
    if (isTransitioning) return;

    // If clicking on the same slide, do nothing
    const targetSlide = realIndex + 1;
    if (currentSlide === targetSlide) return;

    isTransitioning = true;
    currentSlide = targetSlide;
    updateSlider(false, true);

    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;

  function handleTouchStart(e) {
    touchStartX = e.touches ? e.touches[0].clientX : e.clientX;
    isDragging = true;
    slidesContainer.style.transition = "none";
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    touchEndX = e.touches ? e.touches[0].clientX : e.clientX;

    const containerWidth = slidesContainer.offsetWidth;
    const slideWidthPx = getActualSlideWidth();
    const centerOffsetPx = (containerWidth - slideWidthPx) / 2;
    const currentTranslatePx = -(currentSlide * slideWidthPx) + centerOffsetPx;
    const diff = touchStartX - touchEndX;
    const newTranslatePx = currentTranslatePx - diff;
    const newTranslate = (newTranslatePx / containerWidth) * 100;

    slidesContainer.style.transform = `translateX(${newTranslate}%)`;
  }

  function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    slidesContainer.style.transition = "transform 0.5s ease-in-out";

    const diff = touchStartX - touchEndX;
    const minSwipeDistance = 50; // Minimum distance for swipe

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swipe left - next slide
        nextSlide();
      } else {
        // Swipe right - previous slide
        prevSlide();
      }
    } else {
      // Not enough swipe, return to current position
      updateSlider();
    }
  }

  // Event listeners for navigation
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      nextSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      prevSlide();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      goToRealSlide(index);
    });
  });

  // Touch event listeners
  slidesContainer.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  slidesContainer.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });
  slidesContainer.addEventListener("touchend", handleTouchEnd, {
    passive: true,
  });

  // Mouse drag support for desktop
  let mouseDown = false;
  let mouseStartX = 0;

  slidesContainer.addEventListener("mousedown", (e) => {
    mouseDown = true;
    mouseStartX = e.clientX;
    touchStartX = e.clientX;
    isDragging = true;
    slidesContainer.style.transition = "none";
    slidesContainer.style.cursor = "grabbing";
  });

  slidesContainer.addEventListener("mousemove", (e) => {
    if (!mouseDown) return;
    e.preventDefault();
    touchEndX = e.clientX;

    const containerWidth = slidesContainer.offsetWidth;
    const slideWidthPx = getActualSlideWidth();
    const centerOffsetPx = (containerWidth - slideWidthPx) / 2;
    const currentTranslatePx = -(currentSlide * slideWidthPx) + centerOffsetPx;
    const diff = touchStartX - touchEndX;
    const newTranslatePx = currentTranslatePx - diff;
    const newTranslate = (newTranslatePx / containerWidth) * 100;

    slidesContainer.style.transform = `translateX(${newTranslate}%)`;
  });

  slidesContainer.addEventListener("mouseup", () => {
    if (!mouseDown) return;
    mouseDown = false;
    isDragging = false;
    slidesContainer.style.transition = "transform 0.5s ease-in-out";
    slidesContainer.style.cursor = "grab";

    const diff = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    } else {
      updateSlider();
    }
  });

  slidesContainer.addEventListener("mouseleave", () => {
    if (mouseDown) {
      mouseDown = false;
      isDragging = false;
      slidesContainer.style.transition = "transform 0.5s ease-in-out";
      slidesContainer.style.cursor = "grab";
      updateSlider();
    }
  });

  // Set initial cursor
  slidesContainer.style.cursor = "grab";

  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateSlider(true);
    }, 100);
  });

  // Initialize - start at first real slide
  updateSlider(true);

  // Optional: Auto-play (uncomment if needed)
  // setInterval(nextSlide, 5000);
});
