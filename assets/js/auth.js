
import { supabase } from "./supabase.js";

const form = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const submitButton = document.querySelector("#login-button");
const message = document.querySelector("#login-message");

function showMessage(text, type = "info") {
  message.textContent = text;
  message.className = `login-message ${type}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();

  if (!email) {
    showMessage("Please enter your email address", "Error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "SENDING...";
  showMessage("Sending your sign-in link...");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${window.location.origin}/career-combine/`
    }
  });

  submitButton.disabled = false;
  submitButton.textContent = "SEND SIGN-IN LINK";

  if (error) {
    console.error(error);
    showMessage(
      "We couldn't send a sign-in link. Check that your email is registered and try again.",
      "error"
    );
    return;
  }

  showMessage(
    "Check your inbox! If your email is registered, you'll receive a sign-in link shortly.",
    "Success"
  );

  form.reset();
});

// If someone is already signed in, send them to the event.
const { data: { session } } = await supabase.auth.getSession();

if (session) {
  window.location.replace("/career-combine/");
}
