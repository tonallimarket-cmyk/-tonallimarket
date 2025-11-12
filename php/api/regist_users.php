<?php
header('Content-Type: application/json; charset=utf-8');

// Permitir sólo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido, use POST']);
    exit;
}

// Cargar conexión
require_once __DIR__ . '/../conexion.php';

// Obtener entrada (acepta JSON o form-urlencoded)
$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!is_array($data)) {
    // intentar POST estándar
    $data = $_POST;
}

// Campos esperados: nombre, apellido, email, telefono, contrasena
$nombre = isset($data['nombre']) ? trim($data['nombre']) : null;
$apellido = isset($data['apellido']) ? trim($data['apellido']) : null;
$email = isset($data['email']) ? trim($data['email']) : null;
$telefono = isset($data['telefono']) ? trim($data['telefono']) : (isset($data['numero']) ? trim($data['numero']) : null);
$contrasena = isset($data['contrasena']) ? $data['contrasena'] : null;

$errors = [];
if (!$nombre) $errors[] = 'El campo nombre es requerido.';
if (!$apellido) $errors[] = 'El campo apellido es requerido.';
if (!$email) $errors[] = 'El campo email es requerido.';
if (!$telefono) $errors[] = 'El campo telefono es requerido.';
if (!$contrasena) $errors[] = 'El campo contrasena es requerido.';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['error' => 'Datos inválidos', 'details' => $errors]);
    exit;
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Email inválido']);
    exit;
}

try {
    // Verificar si el email ya existe
    $stmt = $pdo->prepare('SELECT id_cliente FROM clientes WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Ya existe una cuenta con ese correo.']);
        exit;
    }

    // Hashear contraseña
    $hash = password_hash($contrasena, PASSWORD_DEFAULT);

    // Insertar
    $ins = $pdo->prepare('INSERT INTO clientes (nombre, apellido, email, telefono, contrasena) VALUES (:nombre, :apellido, :email, :telefono, :contrasena)');
    $ins->execute([
        'nombre' => $nombre,
        'apellido' => $apellido,
        'email' => $email,
        'telefono' => $telefono,
        'contrasena' => $hash
    ]);

    $id = $pdo->lastInsertId();
    echo json_encode(['success' => true, 'id' => $id]);
    exit;
} catch (PDOException $e) {
    http_response_code(500);
    error_log('DB error in regist_users.php: ' . $e->getMessage());
    echo json_encode(['error' => 'Error interno del servidor']);
    exit;
}

?>
