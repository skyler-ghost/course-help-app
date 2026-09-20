<?php
require_once __DIR__ . '/_helpers.php';

$pdo = getDB();

$id        = input_get('id');
$course_id = input_get('course_id');

if ($id) {
    $stmt = $pdo->prepare(
        "SELECT l.*, d.name AS department_name
         FROM lecturers l
         LEFT JOIN departments d ON d.id = l.department_id
         WHERE l.id = ?"
    );
    $stmt->execute([$id]);
    $lecturer = $stmt->fetch();

    if (!$lecturer) json_out(['error' => 'Lecturer not found'], 404);

    $courseStmt = $pdo->prepare(
        "SELECT c.id, c.course_code, c.course_title, c.level, c.units
         FROM courses c
         JOIN course_lecturers cl ON cl.course_id = c.id
         WHERE cl.lecturer_id = ?"
    );
    $courseStmt->execute([$id]);
    $lecturer['courses'] = $courseStmt->fetchAll();

    json_out($lecturer);
}

if ($course_id) {
    $stmt = $pdo->prepare(
        "SELECT l.id, l.name, l.university, l.email, l.phone, l.whatsapp,
                l.office, l.specialization, l.department_id
         FROM lecturers l
         JOIN course_lecturers cl ON cl.lecturer_id = l.id
         WHERE cl.course_id = ?"
    );
    $stmt->execute([$course_id]);
    json_out($stmt->fetchAll());
}

$stmt = $pdo->query(
    "SELECT l.*, d.name AS department_name
     FROM lecturers l
     LEFT JOIN departments d ON d.id = l.department_id
     ORDER BY l.name ASC"
);

json_out($stmt->fetchAll());