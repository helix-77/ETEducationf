import { supabase } from "./supabase.js";
import { checkAuthStatus } from "./navigation.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Check if we have a hash in the URL (from email confirmation)
  if (window.location.hash) {
    // The hash contains auth tokens - let Supabase handle it
    const { data, error } = await supabase.auth.getSession();

    if (data?.session) {
      // Successfully got session from the hash
      window.location.href = "profile.html";
      return;
    } else if (error) {
      console.error("Error processing authentication:", error);
      alert("Authentication error: " + error.message);
    }
  }

  // Regular auth check
  const session = await checkAuthStatus();

  // If user is already logged in, redirect to profile page
  if (session) {
    window.location.href = "profile.html";
  }
});

async function signUp() {
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate form inputs
  if (!validateSignupForm()) {
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullname,
        },
      },
    });

    if (error) {
      throw error;
    }

    alert("Registration successful! Please check your email for verification.");
    window.location.href = "login.html";
  } catch (error) {
    alert("Error during signup: " + error.message);
    console.error(error);
  }
}

function validateSignupForm() {
  var fullname = document.getElementById("fullname").value;
  var email = document.getElementById("signup-email").value;
  var password = document.getElementById("signup-password").value;
  var confirmPassword = document.getElementById("confirm-password").value;

  if (
    fullname.trim() === "" ||
    email.trim() === "" ||
    password.trim() === "" ||
    confirmPassword.trim() === ""
  ) {
    alert("Please fill in all fields.");
    return false;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }

  return true;
}

function toggleSignupPassword() {
  var passwordField = document.getElementById("signup-password");
  var confirmPasswordField = document.getElementById("confirm-password");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    confirmPasswordField.type = "text";
  } else {
    passwordField.type = "password";
    confirmPasswordField.type = "password";
  }
}

// Expose functions to global scope for inline event handlers
window.signUp = signUp;
window.validateSignupForm = validateSignupForm;
window.toggleSignupPassword = toggleSignupPassword;
