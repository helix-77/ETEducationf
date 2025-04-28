import { supabase } from "./supabase.js";
import { checkAuthStatus } from "./navigation.js";

document.addEventListener("DOMContentLoaded", async function () {
  const session = await checkAuthStatus();
  const hash = window.location.hash;

  // If user is not authenticated and there's no hash in the URL, redirect to login
  if (!session && (!hash || !hash.includes("type=recovery"))) {
    window.location.href = "login.html";
    return;
  }

  // If there is a hash with recovery type, we're in a password reset flow
  if (hash && hash.includes("type=recovery")) {
    // Hash is present from password reset email
    // The URL contains the access token needed to reset the password
    console.log("Password reset flow detected");
  }
});

// Function to validate password strength
function validatePassword(password) {
  // Password must be at least 8 characters long
  // and contain at least one uppercase letter, one lowercase letter, and one number
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return (
    password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber
  );
}

// Function to update password
async function updatePassword() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const errorElement = document.getElementById("password-error");

  // Check if passwords match and are strong enough
  if (password !== confirmPassword) {
    errorElement.textContent = "Passwords do not match.";
    errorElement.classList.remove("hidden");
    return;
  }

  if (!validatePassword(password)) {
    errorElement.textContent =
      "Password must be at least 8 characters long and contain uppercase letters, lowercase letters, and numbers.";
    errorElement.classList.remove("hidden");
    return;
  }

  try {
    // Show loading state
    const resetButton = document.getElementById("reset-btn");
    resetButton.disabled = true;
    resetButton.textContent = "Updating...";

    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      throw error;
    }

    // Password updated successfully
    alert("Password has been reset successfully!");

    // Redirect to login page
    window.location.href = "login.html";
  } catch (error) {
    alert("Error: " + error.message);
    console.error(error);

    // Reset button state
    const resetButton = document.getElementById("reset-btn");
    resetButton.disabled = false;
    resetButton.textContent = "Reset Password";
  }
}

// Expose the updatePassword function to global scope for inline event handlers
window.updatePassword = updatePassword;
