// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

// Sample delivery agents data
const agents = [
  { id: 1, name: "Kamal Perera", area: "Colombo 03", distance: "1.2 km", phone: "071-1234567", eta: "20 mins" },
  { id: 2, name: "Nadeesha Silva", area: "Colombo 05", distance: "2.5 km", phone: "072-9876543", eta: "25 mins" },
  { id: 3, name: "Ruwan Fernando", area: "Bambalapitiya", distance: "3.1 km", phone: "077-4567890", eta: "30 mins" }
];

// Render nearby agents
function renderAgents(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  agents.forEach((agent) => {
    const div = document.createElement("div");
    div.className = "agent-item";
    div.innerHTML = `
      <h4>${agent.name}</h4>
      <p><strong>Area:</strong> ${agent.area}</p>
      <p><strong>Distance:</strong> ${agent.distance}</p>
      <p><strong>ETA:</strong> ${agent.eta}</p>
      <p><strong>Phone:</strong> ${agent.phone}</p>
    `;

    div.addEventListener("click", () => {
      document.querySelectorAll(".agent-item").forEach(item => item.classList.remove("selected"));
      div.classList.add("selected");
      localStorage.setItem("selectedAgent", JSON.stringify(agent));
    });

    container.appendChild(div);
  });
}

// Show message helper
function showMessage(id, text, type = "success") {
  const box = document.getElementById(id);
  if (!box) return;
  box.className = `message-box ${type}`;
  box.style.display = "block";
  box.textContent = text;
}

// Registration forms
function handleRegistration(formId, messageId, role) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");

    const username = name.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);
    const password = "FG" + Math.floor(1000 + Math.random() * 9000);

    const userData = {
      role,
      name,
      email,
      username,
      password
    };

    localStorage.setItem(role + "User", JSON.stringify(userData));

    showMessage(
      messageId,
      `${role} registered successfully. Email notification sent with Username: ${username} and Password: ${password}`,
      "success"
    );
    form.reset();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1800);
  });
}

handleRegistration("customerRegisterForm", "customerRegisterMsg", "customer");
handleRegistration("deliveryRegisterForm", "deliveryRegisterMsg", "delivery");

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Admin fixed login
    if (role === "admin") {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("loggedInRole", "admin");
        showMessage("loginMsg", "Admin login successful. Redirecting to CSR page...", "success");

        setTimeout(() => {
          window.location.href = "csr-order.html";
        }, 1200);
      } else {
        showMessage("loginMsg", "Invalid admin username or password.", "error");
      }
      return;
    }

    // Customer / Delivery login from registered users
    const storedUser = JSON.parse(localStorage.getItem(role + "User"));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
      localStorage.setItem("loggedInRole", role);
      showMessage("loginMsg", "Login successful. Redirecting...", "success");

      setTimeout(() => {
        if (role === "customer") {
          window.location.href = "customer-dashboard.html";
        } else if (role === "delivery") {
          window.location.href = "agent-location.html";
        }
      }, 1200);
    } else {
      showMessage("loginMsg", "Invalid username, password, or role.", "error");
    }
  });
}

// Place order form
const orderForm = document.getElementById("orderForm");
if (orderForm) {
  renderAgents("agentList");

  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const selectedAgent = JSON.parse(localStorage.getItem("selectedAgent"));

    if (!selectedAgent) {
      showMessage("orderMsg", "Please select a nearby delivery agent.", "error");
      return;
    }

    showMessage(
      "orderMsg",
      `Order confirmed. SMS sent with agent ${selectedAgent.name}, phone ${selectedAgent.phone}, ETA ${selectedAgent.eta}.`,
      "success"
    );

    orderForm.reset();
    localStorage.removeItem("selectedAgent");
  });
}

// CSR order form
const csrForm = document.getElementById("csrOrderForm");
if (csrForm) {
  renderAgents("csrAgentList");

  csrForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const selectedAgent = JSON.parse(localStorage.getItem("selectedAgent"));

    if (!selectedAgent) {
      showMessage("csrMsg", "Please choose a delivery agent for the order.", "error");
      return;
    }

    const phone = document.getElementById("customerPhone").value;

    showMessage(
      "csrMsg",
      `Manual order created successfully. SMS confirmation sent to customer phone ${phone}. Agent: ${selectedAgent.name}, ETA: ${selectedAgent.eta}.`,
      "success"
    );

    csrForm.reset();
    localStorage.removeItem("selectedAgent");
  });
}

// Agent location update
const locationForm = document.getElementById("locationForm");
if (locationForm) {
  locationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const area = document.getElementById("agentArea").value;
    const notes = document.getElementById("locationNotes").value;

    localStorage.setItem("agentLocation", JSON.stringify({ area, notes }));
    showMessage("locationMsg", `Location updated successfully to ${area}.`, "success");
    locationForm.reset();
  });
}

// Rating stars
const stars = document.querySelectorAll(".star");
let selectedRating = 0;

if (stars.length > 0) {
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = star.dataset.value;
      stars.forEach((s) => s.classList.remove("active"));
      for (let i = 0; i < selectedRating; i++) {
        stars[i].classList.add("active");
      }
    });
  });
}

const ratingForm = document.getElementById("ratingForm");
if (ratingForm) {
  ratingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (selectedRating === 0) {
      showMessage("ratingMsg", "Please select a rating before submitting.", "error");
      return;
    }

    showMessage("ratingMsg", `Thank you. You rated the delivery service ${selectedRating} star(s).`, "success");
    ratingForm.reset();
    stars.forEach((s) => s.classList.remove("active"));
    selectedRating = 0;
  });
}