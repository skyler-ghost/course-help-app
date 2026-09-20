document.addEventListener('DOMContentLoaded', () => {

  // Check if this page contains the area where courses will be displayed.
  // If it does, load the course browsing page.
  if (document.getElementById('course-grid')) initBrowsePage();

  // Check if this page contains the area for course details.
  // If it does, load the course details page.
  if (document.getElementById('course-detail-wrap')) initDetailPage();
});

// ---------- Browse Courses page ----------

// This function controls the page where users can browse courses.
async function initBrowsePage() {

  // Find the area where the department buttons will be displayed.
  const tabsWrap = document.getElementById('dept-tabs');

  // Find the area where the courses will be displayed.
  const grid = document.getElementById('course-grid');

  // Create an empty list that will later contain the departments.
  let departments = [];

  try {

    // Get the list of departments from the website's server.
    departments = await fetchJSON(`${API_BASE}/departments.php`);

  } catch (e) {

    // If the server cannot be reached, show an error message.
    grid.innerHTML = `<p class="empty-state">Couldn't reach the server. Make sure the PHP backend and database are running.</p>`;

    // Stop running this part because the departments could not be loaded.
    return;
  }

  // Create the department buttons.
  // The "All" button shows courses from every department.
  // The other buttons show the departments received from the server.
  tabsWrap.innerHTML = [`<button type="button" class="chip is-active" data-id="">All</button>`]
    .concat(departments.map(d => `<button type="button" class="chip" data-id="${d.id}">${escapeHTML(d.name)}</button>`))
    .join('');

  // Find all the department buttons and give each one a click action.
  tabsWrap.querySelectorAll('.chip').forEach(chip => {

    // This runs when the user clicks a department button.
    chip.addEventListener('click', () => {

      // Remove the selected style from all department buttons.
      tabsWrap.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));

      // Make the button the user clicked look selected.
      chip.classList.add('is-active');

      // Load the courses belonging to the selected department.
      loadCourses(chip.dataset.id);
    });
  });

  // When the page first opens, show all courses.
  loadCourses('');

  // This function loads courses from the server.
  async function loadCourses(departmentId) {

    // Show "Loading..." while the courses are being fetched.
    grid.innerHTML = `<p class="empty-state">Loading…</p>`;

    // If a department was selected, load courses from that department.
    // If no department was selected, load all courses.
    const url = departmentId
      ? `${API_BASE}/courses.php?department_id=${departmentId}`
      : `${API_BASE}/courses.php`;

    try {

      // Get the courses from the website's server.
      const courses = await fetchJSON(url);

      // Check if there are no courses available.
      if (!courses.length) {

        // Tell the user that there are no courses in this department.
        grid.innerHTML = `<p class="empty-state">No courses in this department yet.</p>`;

        // Stop here because there are no courses to display.
        return;
      }

      // Display all the courses on the page.
      grid.innerHTML = courses.map(cardHTML).join('');

    } catch (e) {

      // Show an error message if the courses could not be loaded.
      grid.innerHTML = `<p class="empty-state">Couldn't load courses.</p>`;
    }
  }

  // This function creates the appearance of one course card.
  function cardHTML(c) {

    // Choose an icon and color for the course.
    const { icon, color } = iconForCourse(c.course_code);

    // Create the course card using the information from the database.
    return `
      <a href="course-details.html?id=${c.id}" class="course-card">

        <!-- Show the course icon -->
        <span class="course-icon ${color}"><i class="fa-solid ${icon}"></i></span>

        <!-- Show the course code -->
        <h3>${escapeHTML(c.course_code)}</h3>

        <!-- Show the full course name -->
        <p class="course-sub">${escapeHTML(c.course_title)}</p>

        <!-- Show the student's level and the number of course units -->
        <span class="course-meta">
          <span>${escapeHTML(c.level || '')} Level • ${c.units} Units</span>

          <!-- Show an arrow to indicate that the course can be opened -->
          <i class="fa-solid fa-chevron-right chevron"></i>
        </span>
      </a>`;
  }
}

// ---------- Course Details page ----------

// This function controls the page that shows information about one course.
async function initDetailPage() {

  // Find the area where the course information will be displayed.
  const wrap = document.getElementById('course-detail-wrap');

  // Look at the web address to find out which course the user selected.
  const params = new URLSearchParams(window.location.search);

  // Get the course ID from the web address.
  const id = params.get('id');

  // Check if a course was selected.
  if (!id) {

    // If no course was selected, show this message.
    wrap.innerHTML = `<p class="empty-state">No course specified.</p>`;

    // Stop because there is no course to display.
    return;
  }

  try {

    // Get the information about the selected course from the server.
    const c = await fetchJSON(`${API_BASE}/courses.php?id=${encodeURIComponent(id)}`);

    // Choose an icon and color for the selected course.
    const { icon, color } = iconForCourse(c.course_code);

    // Get the lecturer's information if a lecturer is available.
    const lecturer = (c.lecturers && c.lecturers[0]) || null;

    // Display all the information about the selected course.
    wrap.innerHTML = `
      <div class="detail-card">
        <div class="detail-head">

          <!-- Display the course icon -->
          <span class="course-icon ${color}" style="width:48px;height:48px;font-size:18px;"><i class="fa-solid ${icon}"></i></span>

          <div>

            <!-- Display the course code and course name -->
            <h1>${escapeHTML(c.course_code)} — ${escapeHTML(c.course_title)}</h1>

            <!-- Display the level, number of units and department -->
            <p class="detail-tags">${escapeHTML(c.level || '')} Level • ${c.units} Units • ${escapeHTML(c.department_name || '')}</p>
          </div>
        </div>

        <!-- Display a description of the course -->
        <p class="detail-desc">${escapeHTML(c.description || 'No description available yet.')}</p>

        <!-- Display important information about the course -->
        <div class="detail-grid">

          <!-- Display the course code -->
          <div class="detail-stat"><span class="stat-label">Course Code</span><span class="stat-value">${escapeHTML(c.course_code)}</span></div>

          <!-- Display the student's level -->
          <div class="detail-stat"><span class="stat-label">Level</span><span class="stat-value">${escapeHTML(c.level || '—')}</span></div>

          <!-- Display the number of course units -->
          <div class="detail-stat"><span class="stat-label">Unit(s)</span><span class="stat-value">${c.units}</span></div>

          <!-- Display the department offering the course -->
          <div class="detail-stat"><span class="stat-label">Department</span><span class="stat-value">${escapeHTML(c.department_name || '—')}</span></div>
        </div>

        ${lecturer ? `

        <!-- Show the lecturer's information if a lecturer is available -->
        <p class="section-heading"><i class="fa-solid fa-user"></i> About the Lecturer</p>

        <div class="lecturer-strip">

          <!-- Show the lecturer icon -->
          <span class="lecturer-avatar"><i class="fa-solid fa-user"></i></span>

          <div class="lecturer-info">

            <!-- Show the lecturer's name -->
            <h3>${escapeHTML(lecturer.name)}</h3>

            <!-- Show the lecturer's department -->
            <p>${escapeHTML(c.department_name || '')}</p>
          </div>

          <!-- Button that takes the user to the lecturer's profile -->
          <a href="lecturer-profile.html?id=${lecturer.id}" class="btn btn-primary" style="color:#fff;">View Profile</a>
        </div>` : ''}
      </div>`;

  } catch (e) {

    // If the course information cannot be loaded,
    // show an error message to the user.
    wrap.innerHTML = `<p class="empty-state">Couldn't load this course.</p>`;
  }
}