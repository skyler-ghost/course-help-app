// Wait until the HTML document has completely loaded
document.addEventListener('DOMContentLoaded', () => {

  // Get the search form and the elements needed for the search page
  const form = document.getElementById('search-form');
  const input = document.getElementById('q');
  const chipsWrap = document.getElementById('popular-chips');
  const resultsWrap = document.getElementById('results-wrap');

  // Stop the script if the search form does not exist
  if (!form) return;

  // Get the search parameters from the current URL
  const params = new URLSearchParams(window.location.search);

  // Get the existing search query from the URL
  const initialQ = params.get('q') || '';

  // Put the existing search query into the search input
  if (initialQ) input.value = initialQ;

  // Load the popular course search buttons
  loadPopularChips();

  // Automatically perform a search if a query already exists in the URL
  if (initialQ) runSearch(initialQ);

  // Listen for the search form being submitted
  form.addEventListener('submit', (e) => {

    // Prevent the page from refreshing when the form is submitted
    e.preventDefault();

    // Get the search text and remove unnecessary spaces
    const q = input.value.trim();

    // Only perform the search if the user entered something
    if (q) runSearch(q);
  });

  // Store the user's session information so it does not need to be requested repeatedly
  let cachedSession = null;

  // Function used to get the current user's login session
  async function getSession() {

    // Return the saved session if it has already been retrieved
    if (cachedSession) return cachedSession;

    try {
      // Request the current session information from the authentication API
      cachedSession = await fetchJSON(`${AUTH_BASE}/session.php`);
    } catch (e) {

      // If the session request fails, treat the user as logged out
      cachedSession = { logged_in: false };
    }

    // Return the user's session information
    return cachedSession;
  }

  // Function used to load popular course search buttons
  async function loadPopularChips() {
    try {
      // Get the available courses from the API
      const courses = await fetchJSON(`${API_BASE}/courses.php`);

      // Take the first six courses to use as popular search options
      const popular = courses.slice(0, 6);

      // Create a button for each popular course
      chipsWrap.innerHTML = popular.map(c =>
        `<button type="button" class="chip" data-code="${escapeHTML(c.course_code)}">${escapeHTML(c.course_code)}</button>`
      ).join('');

      // Add a click event to each popular course button
      chipsWrap.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {

          // Put the selected course code into the search input
          input.value = chip.dataset.code;

          // Search for the selected course
          runSearch(chip.dataset.code);
        });
      });
    } catch (e) { /* silently skip popular chips if API isn't reachable yet */ }
  }

  // Function used to perform a course search
  async function runSearch(q) {

    // Display a loading message while the search is being performed
    resultsWrap.innerHTML = `<p class="empty-state">Searching…</p>`;

    // Get the user's current login session
    const session = await getSession();

    // Check if the user is logged in before allowing the search
    if (!session.logged_in) {

      // Tell the user that they need to log in before searching
      resultsWrap.innerHTML = `
        <div class="notice-box">
          <i class="fa-solid fa-lock"></i>
          <span>Please <a href="login.html" style="color:var(--blue-500);font-weight:700;">log in</a> to search for a course.</span>
        </div>`;

      // Stop the search if the user is not logged in
      return;
    }

    try {
      // Send the search query to the search API
      const results = await fetchJSON(`${API_BASE}/search.php?q=${encodeURIComponent(q)}`);

      // Check if the search returned no results
      if (!results.length) {

        // Display a message when no matching courses are found
        resultsWrap.innerHTML = `<p class="empty-state">No courses found for "${escapeHTML(q)}".</p>`;
        return;
      }

      // Display the number of search results and the results themselves
      resultsWrap.innerHTML = `
        <p class="section-label">Found ${results.length} result${results.length > 1 ? 's' : ''} for "${escapeHTML(q)}"</p>
        <div class="results-list">
          ${results.map(rowHTML).join('')}
        </div>`;
    } catch (e) {

      // Display an error message if the server cannot be reached
      resultsWrap.innerHTML = `<p class="empty-state">Couldn't reach the server. Make sure the PHP backend and database are running.</p>`;
    }
  }

  // Function used to create the HTML for each course search result
  function rowHTML(c) {

    // Get the appropriate icon and color for the course
    const { icon, color } = iconForCourse(c.course_code);

    // Return the HTML structure for one course result
    return `
      <a href="course-details.html?id=${c.id}" class="result-row">
        <span class="course-icon ${color}"><i class="fa-solid ${icon}"></i></span>
        <span class="result-text">
          <h3>${escapeHTML(c.course_code)} — ${escapeHTML(c.course_title)}</h3>
          <span class="result-meta">${escapeHTML(c.level || '')} Level • ${c.units} Units • ${escapeHTML(c.department_name || '')}</span>
        </span>
        <i class="fa-solid fa-chevron-right chevron"></i>
      </a>`;
  }
});