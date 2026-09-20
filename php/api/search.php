<?php
require_once __DIR__ . '/_helpers.php';

$pdo = getDB();
$q = input_get('q', '');

if ($q === '') json_out([]);

$stmt = $pdo->prepare(
    "SELECT c.*, d.name AS department_name
     FROM courses c
     LEFT JOIN departments d ON d.id = c.department_id
     WHERE c.course_code LIKE ? OR c.course_title LIKE ?
     ORDER BY c.course_code ASC"
);
$like = "%$q%";
$stmt->execute([$like, $like]);
json_out($stmt->fetchAll());
