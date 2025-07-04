const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginContainer = document.getElementById("loginFormContainer");
const registerContainer = document.getElementById("registerFormContainer");
const message = document.getElementById("message");

loginTab.addEventListener("click", () => {
  loginContainer.classList.remove("hidden");
  registerContainer.classList.add("hidden");
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  message.textContent = "";
});

registerTab.addEventListener("click", () => {
  loginContainer.classList.add("hidden");
  registerContainer.classList.remove("hidden");
  loginTab.classList.remove("active");
  registerTab.classList.add("active");
  message.textContent = "";
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  try {
    const res = await fetch("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "events.html";
    } else {
      message.textContent = data.message || "Error";
    }
  } catch (err) {
    message.textContent = "Server error";
  }
});

document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await fetch("/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        message.textContent = "Check your email to confirm.";
      } else {
        message.textContent = data.message || "Error";
      }
    } catch (err) {
      message.textContent = "Server error";
    }
  });
