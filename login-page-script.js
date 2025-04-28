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

  // Regular auth check for already logged in users
  const session = await checkAuthStatus();

  // If user is already logged in, redirect to profile page
  if (session) {
    window.location.href = "profile.html";
  }
});

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("remember-me").checked;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      throw error;
    }

    window.location.href = "profile.html";
  } catch (error) {
    alert("Login failed: " + error.message);
    console.error(error);
  }
}

function validateForm() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  if (email.trim() === "" || password.trim() === "") {
    alert("Please fill in all fields.");
    return false;
  }
  return true;
}

function togglePassword() {
  var passwordField = document.getElementById("password");
  if (passwordField.type === "password") {
    passwordField.type = "text";
  } else {
    passwordField.type = "password";
  }
}

// Expose functions to global scope for inline event handlers
window.login = login;
window.togglePassword = togglePassword;
window.validateForm = validateForm;
