// Shared helper functions used across different pages in the website


// Check if the current page is inside the "pages" folder
// This helps us know how to correctly locate the PHP API files
const IS_SUBFOLDER = /\/pages\//.test(window.location.pathname);


// Set the correct path to the API folder
// If we are inside /pages/, go one folder back using ../
// Otherwise, use the normal php/api path
const API_BASE = IS_SUBFOLDER ? '../php/api' : 'php/api';


// Set the correct path to the authentication folder
// Same logic as API_BASE above
const AUTH_BASE = IS_SUBFOLDER ? '../php/auth' : 'php/auth';


// A helper function for making requests to PHP APIs
async function fetchJSON(url, options) {

  // Send the request to the provided URL
  const res = await fetch(url, options);

  // Try to convert the response into JSON
  // If the response is not valid JSON, use an empty object instead
  const data = await res.json().catch(() => ({}));

  // Check if the request was successful
  // If not, show the error returned by the server
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  // Return the data received from the server
  return data;
}


// Map course code prefixes to icons and colors
// This makes different course cards look different
const COURSE_ICON_MAP = {

  // Computer Science courses
  CS: {
    icon: 'fa-code',
    color: 'icon-blue'
  },

  // Mathematics courses
  MTH: {
    icon: 'fa-calculator',
    color: 'icon-navy'
  },

  // Physics courses
  PHY: {
    icon: 'fa-atom',
    color: 'icon-purple'
  },

  // General Studies courses
  GST: {
    icon: 'fa-leaf',
    color: 'icon-green'
  },

  // Statistics courses
  STA: {
    icon: 'fa-chart-simple',
    color: 'icon-navy'
  },

  // Software Engineering courses
  SEN: {
    icon: 'fa-laptop-code',
    color: 'icon-blue'
  },
};


// Find the correct icon and color for a course
function iconForCourse(courseCode) {

  // Remove the numbers from the course code
  // Example: "CS202" becomes "CS"
  // Then convert it to uppercase
  const prefix = (courseCode || '')
    .replace(/[0-9].*/, '')
    .toUpperCase();


  // Look for the course prefix in COURSE_ICON_MAP
  // If it doesn't exist, use a default book icon and teal color
  return COURSE_ICON_MAP[prefix] || {
    icon: 'fa-book',
    color: 'icon-teal'
  };
}


// Prevent HTML code from being inserted directly into the page
// This helps protect the website from malicious HTML/JavaScript
function escapeHTML(str) {

  // Create a temporary div element
  const div = document.createElement('div');

  // Put the text inside the div as text instead of HTML
  div.textContent = str ?? '';

  // Return the safely escaped HTML
  return div.innerHTML;
}


// Initialize the authentication section in the header
// It shows either "Login" or the logged-in user's name and Logout button
async function initAuthHeader() {

  // Find the element where the authentication information should appear
  const slot = document.getElementById('auth-slot');

  // If the element does not exist on this page, stop the function
  if (!slot) return;


  try {

    // Ask the PHP server whether the user is currently logged in
    const data = await fetchJSON(`${AUTH_BASE}/session.php`);


    // Check if the server says the user is logged in
    if (data.logged_in) {

      // Replace the login section with the user's name and Logout button
      slot.innerHTML = `
        <span class="user-pill">
          <i class="fa-regular fa-circle-user"></i>
          ${escapeHTML(data.name)}
          <button type="button" id="logout-btn">Logout</button>
        </span>`;


      // Find the Logout button and listen for a click
      document.getElementById('logout-btn').addEventListener('click', async () => {

        // Send a POST request to the logout PHP file
        await fetchJSON(`${AUTH_BASE}/logout.php`, {
          method: 'POST'
        });


       // Redirect the user to the login page after logging out
      window.location.href = IS_SUBFOLDER ? 'login.html' : 'pages/login.html';
      });
    }

  } catch (e) {

    // If checking the session fails,
    // don't break the rest of the webpage.
    // The normal Login link will remain visible.
  }
}


// Wait until the HTML page has completely loaded
// Then run the authentication header function
document.addEventListener('DOMContentLoaded', initAuthHeader);