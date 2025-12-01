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
