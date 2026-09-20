<?php
// Returns the currently logged-in user, if any. Used by pages to show/hide the Login link
// and to gate search behind login.
session_start();
header('Content-Type: application/json');

if (!empty($_SESSION['user_id'])) {
    echo json_encode([
        'logged_in' => true,
        'name'      => $_SESSION['user_name'],
        'email'     => $_SESSION['user_email'],
    ]);
} else {
    echo json_encode(['logged_in' => false]);
}
