
import { supabase } from "./supabase.js";

const form = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const submitButton = document.querySelector("#login-button");
const message = document.querySelector("#login-message");

const HOME_URL = `${window.location.origin}/`;

function showMessage(text, type = "info") {
  message.textContent = text;
  message.className = `login-message ${type}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();

  if (!email) {
    showMessage("Please enter your email address.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "SENDING...";
  showMessage("Sending your sign-in link...");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: HOME_URL
    }
  });

  submitButton.disabled = false;
  submitButton.textContent = "SEND SIGN-IN LINK";

  if (error) {
  console.error("Supabase login error:", error);

  showMessage(
    `Login error: ${error.message}`,
    "error"
  );

  return;
}

  showMessage(
    "Check your inbox! If your email is registered, you'll receive a sign-in link shortly.",
    "success"
  );

  form.reset();
});

// If someone is already signed in, send them to the homepage.
const {
  data: { session }
} = await supabase.auth.getSession();

if (session) {
  window.location.replace(HOME_URL);
}
