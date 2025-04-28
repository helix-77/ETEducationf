import { supabase } from "./supabase.js";
import { checkAuthStatus } from "./navigation.js";

document.addEventListener("DOMContentLoaded", async function () {
  const session = await checkAuthStatus();

  // If user is already logged in, redirect to profile page
  if (session) {
    window.location.href = "profile.html";
  }
});

// Function to request password reset link
async function requestPasswordReset() {
  const email = document.getElementById("email").value;

  try {
    // Show loading state
    document.getElementById("request-reset-btn").disabled = true;
    document.getElementById("request-reset-btn").textContent = "Sending...";

    // Get the current site URL for proper redirection
    const siteUrl = window.location.origin;
    const githubPagesUrl = "https://helix-77.github.io/ETEducationf"; // Update with your actual GitHub Pages URL

    // Use the appropriate URL based on environment
    const redirectUrl =
      siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1")
        ? `${siteUrl}/reset_password.html`
        : `${githubPagesUrl}/reset_password.html`;

    // Use Supabase to send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      throw error;
    }

    // Success - show confirmation message
    document.getElementById("email-container").classList.add("hidden");
    document
      .getElementById("confirmation-container")
      .classList.remove("hidden");
    document.getElementById(
      "confirmation-message"
    ).textContent = `We've sent a password reset link to ${email}`;

    // Reset button state
    document.getElementById("request-reset-btn").disabled = false;
    document.getElementById("request-reset-btn").textContent =
      "Send Reset Link";
  } catch (error) {
    alert("Error: " + error.message);
    console.error(error);

    // Reset button state
    document.getElementById("request-reset-btn").disabled = false;
    document.getElementById("request-reset-btn").textContent =
      "Send Reset Link";
  }
}

// Expose functions to global scope for inline event handlers
window.requestPasswordReset = requestPasswordReset;
