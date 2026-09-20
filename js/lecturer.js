// Wait until the HTML document has finished loading before running the code
document.addEventListener("DOMContentLoaded", () => {
  // If the lecturer profile page exists, initialize the profile page
  if (document.getElementById("lecturer-profile-wrap")) initProfilePage();

  // If the contact lecturer page exists, initialize the contact page
  if (document.getElementById("contact-grid")) initContactPage();

  // If the lecturers list page exists, initialize the lecturers list page
  if (document.getElementById("lecturers-list")) initLecturersListPage();
});

// Get the lecturer ID from the URL query string
function getLecturerId() {
  return new URLSearchParams(window.location.search).get("id");
}

// ---------- Lecturer Profile page ----------
// Loads and displays information about a specific lecturer
async function initProfilePage() {
  // Get the container where the lecturer profile will be displayed
  const wrap = document.getElementById("lecturer-profile-wrap");

  // Get the lecturer ID from the URL
  const id = getLecturerId();

  // Check if a lecturer ID was provided
  if (!id) {
    // Display an error message if no lecturer was specified
    wrap.innerHTML = `<p class="empty-state">No lecturer specified.</p>`;
    return;
  }

  try {
    // Request the lecturer's information from the API
    const l = await fetchJSON(
      `${API_BASE}/lecturers.php?id=${encodeURIComponent(id)}`,
    );

    // Insert the lecturer's profile information into the page
    wrap.innerHTML = `
      <div class="profile-card">
        <div class="profile-head">
          <span class="profile-avatar"><i class="fa-solid fa-user"></i></span>
          <div>
            <h1>${escapeHTML(l.name)}</h1>
            <p class="profile-role">Lecturer${l.department_name ? " - " + escapeHTML(l.department_name) + " Department" : ""}</p>
          </div>
        </div>

        <p class="profile-section-title">About</p>
        <p class="profile-about">${escapeHTML(l.name)} is a lecturer${l.department_name ? " in the " + escapeHTML(l.department_name) + " department" : ""}, currently teaching ${l.courses.length} course${l.courses.length === 1 ? "" : "s"} on the portal.</p>

        <div class="profile-facts">
          <div class="profile-fact">
            <i class="fa-solid fa-building-columns"></i>
            <span>
              <span class="fact-label">University</span><span class="fact-value">${escapeHTML(l.university || "—")}</span>
            </span>
          </div>
          <div class="profile-fact">
            <i class="fa-solid fa-building"></i>
            <span><span class="fact-label">Department</span><span class="fact-value">${escapeHTML(l.department_name || "—")}</span></span>
          </div>
          <div class="profile-fact">
            <i class="fa-solid fa-location-dot"></i>
            <span><span class="fact-label">Office</span><span class="fact-value">${escapeHTML(l.office || "—")}</span></span>
          </div>
          <div class="profile-fact">
            <i class="fa-solid fa-book"></i>
            <span><span class="fact-label">Courses</span><span class="fact-value">${l.courses.length}</span></span>
          </div>
        </div>
      </div>

      ${
        l.courses.length
          ? `
      <p class="section-label">Courses Taught</p>
      <div class="results-list" style="margin-bottom:24px;">
        ${l.courses
          .map((c) => {
            // Get the appropriate icon and color for the course
            const { icon, color } = iconForCourse(c.course_code);
            return `
          <a href="course-details.html?id=${c.id}" class="result-row">
            <span class="course-icon ${color}"><i class="fa-solid ${icon}"></i></span>
            <span class="result-text">
              <h3>${escapeHTML(c.course_code)} — ${escapeHTML(c.course_title)}</h3>
              <span class="result-meta">${escapeHTML(c.level || "")} Level • ${c.units} Units</span>
            </span>
            <i class="fa-solid fa-chevron-right chevron"></i>
          </a>`;
          })
          .join("")}
      </div>`
          : ""
      }

      <a href="contact-lecturer.html?id=${l.id}" class="btn btn-primary" style="color:#fff;display:inline-flex;">
        <i class="fa-solid fa-envelope"></i> Contact ${escapeHTML(l.name.split(" ")[0] || "Lecturer")}
      </a>`;
  } catch (e) {
    // Display an error message if the lecturer information cannot be loaded
    wrap.innerHTML = `<p class="empty-state">Couldn't load this lecturer.</p>`;
  }
}

// ---------- Contact Lecturer page ----------
// Loads the lecturer's contact information and displays the available contact options
async function initContactPage() {
  // Get the elements used on the contact page
  const grid = document.getElementById("contact-grid");
  const titleEl = document.getElementById("contact-title");
  const subEl = document.getElementById("contact-sub");

  // Get the lecturer ID from the URL
  const id = getLecturerId();

  // Check if a lecturer ID was provided
  if (!id) {
    // Display an error message if no lecturer was specified
    grid.innerHTML = `<p class="empty-state">No lecturer specified.</p>`;
    return;
  }

  try {
    // Get the lecturer's information from the API
    const l = await fetchJSON(
      `${API_BASE}/lecturers.php?id=${encodeURIComponent(id)}`,
    );

    // Set the page title and description
    titleEl.textContent = "Contact Lecturer";
    subEl.textContent = `Choose your preferred way to reach out to ${l.name}.`;

    // Create an empty array to store the available contact cards
    const cards = [];

    // Check if the lecturer has a WhatsApp number
    if (l.whatsapp) {
      // Remove any characters that are not numbers from the WhatsApp number
      const wa = l.whatsapp.replace(/[^0-9]/g, "");

      // Add a WhatsApp contact card
      cards.push(`
        <div class="contact-card">
          <span class="contact-icon contact-whatsapp"><i class="fa-brands fa-whatsapp"></i></span>
          <h3>WhatsApp</h3>
          <p>Chat directly on WhatsApp</p>
          <a class="btn-full contact-whatsapp" href="https://wa.me/${wa}" target="_blank" rel="noopener">Chat on WhatsApp</a>
        </div>`);
    }

    // Check if the lecturer has a phone number
    if (l.phone) {
      // Add a phone contact card
      cards.push(`
        <div class="contact-card">
          <span class="contact-icon contact-phone"><i class="fa-solid fa-phone"></i></span>
          <h3>Phone</h3>
          <p>Call the lecturer</p>
          <a class="btn-full contact-phone" href="tel:${escapeHTML(l.phone)}">Call Now</a>
        </div>`);
    }

    // Check if the lecturer has an email address
    if (l.email) {
      // Add an email contact card
      cards.push(`
        <div class="contact-card">
          <span class="contact-icon contact-email"><i class="fa-solid fa-envelope"></i></span>
          <h3>Email</h3>
          <p>Send an email</p>
          <a class="btn-full contact-email" href="mailto:${escapeHTML(l.email)}">Send Email</a>
        </div>`);
    }

    // Display all available contact cards
    // If there are no contact details, display an appropriate message
    grid.innerHTML = cards.length
      ? cards.join("")
      : `<p class="empty-state">No contact details on file for this lecturer yet.</p>`;
  } catch (e) {
    // Display an error message if the contact details cannot be loaded
    grid.innerHTML = `<p class="empty-state">Couldn't load contact details.</p>`;
  }
}

// ---------- Lecturers List page (read-only) ----------
// Loads and displays a list of lecturers
async function initLecturersListPage() {
  // Get the department filter area and lecturer list container
  const tabsWrap = document.getElementById("dept-tabs");
  const listWrap = document.getElementById("lecturers-list");

  // Create an empty array to store departments
  let departments = [];

  try {
    // Get the list of departments from the API
    departments = await fetchJSON(`${API_BASE}/departments.php`);
  } catch (e) {
    /* filters are optional, list still loads below */
  }

  // Create the department filter buttons
  tabsWrap.innerHTML = [
    `<button type="button" class="chip is-active" data-id="">All</button>`,
  ]
    .concat(
      departments.map(
        (d) =>
          `<button type="button" class="chip" data-id="${d.id}">${escapeHTML(d.name)}</button>`,
      ),
    )
    .join("");

  // Create an empty array to store all lecturers
  let allLecturers = [];

  // Function used to load the lecturers from the API
  async function load() {
    // Show a loading message while the data is being retrieved
    listWrap.innerHTML = `<p class="empty-state">Loading…</p>`;

    try {
      // Get all lecturers from the API
      allLecturers = await fetchJSON(`${API_BASE}/lecturers.php`);

      // Display all lecturers
      render("");
    } catch (e) {
      // Display an error message if the lecturers cannot be loaded
      listWrap.innerHTML = `<p class="empty-state">Couldn't load lecturers.</p>`;
    }
  }

  // Function used to display lecturers based on the selected department
  function render(deptId) {
    // Filter lecturers when a specific department is selected
    // Otherwise, display all lecturers
    const filtered = deptId
      ? allLecturers.filter((l) => String(l.department_id) === deptId)
      : allLecturers;

    // Convert each lecturer into HTML and display the results
    listWrap.innerHTML =
      filtered.map(rowHTML).join("") ||
      `<p class="empty-state">No lecturers in this department.</p>`;
  }

  // Creates the HTML structure for one lecturer in the list
  function rowHTML(l) {
    return `
      <a href="lecturer-profile.html?id=${l.id}" class="result-row">
        <span class="lecturer-avatar" style="margin-bottom:0;"><i class="fa-solid fa-user"></i></span>
        <span class="result-text">
          <h3>${escapeHTML(l.name)}</h3>
          <span class="result-meta">${escapeHTML(l.department_name || "")}${l.specialization ? " • " + escapeHTML(l.specialization) : ""}</span>
        </span>
        <i class="fa-solid fa-chevron-right chevron"></i>
      </a>`;
  }

  // Add a click event to each department filter button
  tabsWrap.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      // Remove the active class from all department buttons
      tabsWrap
        .querySelectorAll(".chip")
        .forEach((c) => c.classList.remove("is-active"));

      // Add the active class to the button that was clicked
      chip.classList.add("is-active");

      // Display lecturers from the selected department
      render(chip.dataset.id);
    });
  });

  // Load the lecturers when the page is initialized
  load();
}
