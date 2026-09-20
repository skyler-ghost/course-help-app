<?php
require_once __DIR__ . '/_helpers.php';

$pdo = getDB();
$stmt = $pdo->query("SELECT id, name FROM departments ORDER BY name ASC");
json_out($stmt->fetchAll());
