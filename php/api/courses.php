<?php
require_once __DIR__ . '/_helpers.php';

$pdo = getDB();

$id            = input_get('id');
$department_id = input_get('department_id');
$level         = input_get('level');

if ($id) {
    // single course + department + lecturers
    $stmt = $pdo->prepare(
        "SELECT c.*, d.name AS department_name
         FROM courses c
         LEFT JOIN departments d ON d.id = c.department_id
         WHERE c.id = ?"
    );
    $stmt->execute([$id]);
    $course = $stmt->fetch();

    if (!$course) json_out(['error' => 'Course not found'], 404);

    $lecStmt = $pdo->prepare(
        "SELECT l.* FROM lecturers l
         JOIN course_lecturers cl ON cl.lecturer_id = l.id
         WHERE cl.course_id = ?"
    );
    $lecStmt->execute([$id]);
    $course['lecturers'] = $lecStmt->fetchAll();

    json_out($course);
}

// list courses, optionally filtered
$sql = "SELECT c.*, d.name AS department_name
        FROM courses c
        LEFT JOIN departments d ON d.id = c.department_id
        WHERE 1=1";
$params = [];

if ($department_id) {
    $sql .= " AND c.department_id = ?";
    $params[] = $department_id;
}
if ($level) {
    $sql .= " AND c.level = ?";
    $params[] = $level;
}

$sql .= " ORDER BY c.course_code ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
json_out($stmt->fetchAll());
