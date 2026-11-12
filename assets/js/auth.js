
import { supabase } from "./supabase.js";

const form = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const submitButton = document.querySelector("#login-button");
const message = document.querySelector("#login-message");

const OTP_URL = `${window.location.origin}/`;

function showMessage(text, type = "info") {
  message.textContent = text;
  message.className = `login-message ${type}`;
}

// Check whether someone is already signed in
async function checkSession() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    await routeUser(session.user);
  }
}

async function routeUser(user) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Profile lookup error:", error);
    showMessage("Unable to load your profile. Please try again.", "error");
    return;
  }

  if (!profile?.full_name?.trim()) {
    window.location.replace("/complete-profile.html");
  } else {
    window.location.replace("/dashboard.html");
  }
}

// Send the 6-digit code
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();

  if (!email) {
    showMessage("Please enter your email address.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "SENDING CODE...";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false
    }
  });

  submitButton.disabled = false;
  submitButton.textContent = "SEND VERIFICATION CODE";

  if (error) {
    console.error("OTP error:", error);
    showMessage(error.message, "error");
    return;
  }

  // Show the code-entry screen
  document.querySelector("#email-step").hidden = true;
  document.querySelector("#code-step").hidden = false;

  document.querySelector("#code-email").textContent = email;
  document.querySelector("#verification-code").focus();

  showMessage("Your 6-digit code has been sent.", "success");
});

// Verify the code
document.querySelector("#verify-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const token = document.querySelector("#verification-code").value.trim();

  const verifyButton = document.querySelector("#verify-button");

  if (!/^\d{6}$/.test(token)) {
    showMessage("Please enter your 6-digit verification code.", "error");
    return;
  }

  verifyButton.disabled = true;
  verifyButton.textContent = "VERIFYING...";

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email"
  });

  verifyButton.disabled = false;
  verifyButton.textContent = "VERIFY CODE";

  if (error) {
    console.error("Verification error:", error);
    showMessage("That code is invalid or expired. Please try again.", "error");
    return;
  }

  await routeUser(data.user);
});

// Start session check
checkSession();
