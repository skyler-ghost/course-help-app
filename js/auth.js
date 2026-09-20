// Wait until the HTML document has completely loaded
document.addEventListener('DOMContentLoaded', () => {

  // Get the login form, registration form, and error message element
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const errorBox = document.getElementById('form-error');

  // Function to display an error message to the user
  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add('is-visible');
  }

  // Function to hide the error message
  function hideError() {
    errorBox.classList.remove('is-visible');
  }

  // Check if the login form exists on the current page
  if (loginForm) {

    // Listen for the login form being submitted
    loginForm.addEventListener('submit', async (e) => {

      // Prevent the browser from refreshing/submitting the form normally
      e.preventDefault();

      // Hide any previous error message
      hideError();

      // Find the submit button inside the login form
      const btn = loginForm.querySelector('button[type="submit"]');

      // Disable the button to prevent multiple submissions
      btn.disabled = true;

      try {
        // Send the login information to the PHP login API
        await fetchJSON(`${AUTH_BASE}/login.php`, {
          method: 'POST',

          // Tell the server that we are sending JSON data
          headers: { 'Content-Type': 'application/json' },

          // Convert the email and password into a JSON string
          body: JSON.stringify({
            email: loginForm.email.value.trim(),
            password: loginForm.password.value,
          }),
        });

        // If login is successful, redirect the user to the home page
        window.location.href = '../index.html';

      } catch (err) {

        // Display the error message if the login request fails
        showError(err.message);

        // Enable the submit button again so the user can try again
        btn.disabled = false;
      }
    });
  }

  // Check if the registration form exists on the current page
  if (registerForm) {

    // Listen for the registration form being submitted
    registerForm.addEventListener('submit', async (e) => {

      // Prevent the browser from refreshing/submitting the form normally
      e.preventDefault();

      // Hide any previous error message
      hideError();

      // Find the submit button inside the registration form
      const btn = registerForm.querySelector('button[type="submit"]');

      // Disable the button to prevent multiple submissions
      btn.disabled = true;

      try {
        // Send the registration information to the PHP registration API
        await fetchJSON(`${AUTH_BASE}/register.php`, {
          method: 'POST',

          // Tell the server that we are sending JSON data
          headers: { 'Content-Type': 'application/json' },

          // Convert the user's registration details into JSON
          body: JSON.stringify({
            name: registerForm.name.value.trim(),
            email: registerForm.email.value.trim(),
            password: registerForm.password.value,
          }),
        });

        // If registration is successful, redirect the user to the home page
        window.location.href = '../index.html';
        // the  catch method for error checking 
      } catch (err) {

        // Display the error message if registration fails
        showError(err.message);

        // Enable the submit button again so the user can try again
        btn.disabled = false;
      }
    });
  }
});