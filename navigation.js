import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async function () {
  updateWebsiteName();
  await checkAuthStatus();
  setupMobileMenu();
});

// Update the website name with styling
function updateWebsiteName() {
  const titleElement = document.getElementById("dynamic-title"); //ETEducation Portal
  if (titleElement) {
    const pageName = document.title || "ETEducation Portal";
    document.title = pageName;
  }
}

// Setup mobile menu toggle functionality
function setupMobileMenu() {
  const menuBtn = document.getElementById("menu-btn"); // hamburger
  const mobileMenu = document.getElementById("mobile-menu"); //container for the mobile menu

  if (menuBtn && mobileMenu) {
    // Toggle menu on button click
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("hidden"); // Toggles the hidden CSS class
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        mobileMenu.classList.add("hidden");
      }
    });

    // Close menu when clicking on a menu item
    const menuItems = mobileMenu.querySelectorAll("a");
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }
}

// Check authentication status and update UI accordingly
async function checkAuthStatus() {
  const { data } = await supabase.auth.getSession();
  updateNavigation(data.session);
  return data.session;
}

// Update navigation UI based on authentication status
function updateNavigation(session) {
  // Update desktop navigation
  const loginBtn = document.getElementById("login-btn");
  const profileBtn = document.getElementById("profile-btn");

  // Update mobile navigation
  const mobileLoginBtn = document.getElementById("mobile-login-btn");
  const mobileProfileBtn = document.getElementById("mobile-profile-btn");

  if (session) {
    // User is logged in
    if (profileBtn) profileBtn.style.display = "block";
    if (mobileProfileBtn) mobileProfileBtn.style.display = "block";

    if (loginBtn) loginBtn.style.display = "none";
    if (mobileLoginBtn) mobileLoginBtn.style.display = "none";
  } else {
    // User is not logged in
    if (profileBtn) profileBtn.style.display = "none";
    if (mobileProfileBtn) mobileProfileBtn.style.display = "none";

    if (loginBtn) loginBtn.style.display = "block";
    if (mobileLoginBtn) mobileLoginBtn.style.display = "block";
  }
}

// Logout function
async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error logging out:", error.message);
    alert("Error logging out. Please try again.");
  }
}

// Export functions to be accessible globally
window.logout = logout;
window.checkAuthStatus = checkAuthStatus;

export {
  updateWebsiteName,
  checkAuthStatus,
  updateNavigation,
  setupMobileMenu,
  logout,
};
