<?php
// Requires a PHP host and an explicitly configured, domain-owned MAIL_FROM.
header('Content-Type: text/plain; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function fail_request($status, $message) {
    http_response_code($status);
    echo $message;
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail_request(405, 'Metodă nepermisă.');
}

// Reject arrays, missing fields and oversized input before processing it.
$limits = ['name' => 100, 'email' => 254, 'message' => 5000, 'website' => 200];
$fields = [];
foreach ($limits as $key => $limit) {
    $value = $_POST[$key] ?? ($key === 'website' ? '' : null);
    if (!is_string($value) || strlen($value) > $limit * 4
        || preg_match('//u', $value) !== 1 || strpos($value, "\0") !== false) {
        fail_request(400, 'Date invalide. Înapoi și încearcă din nou.');
    }
    $fields[$key] = trim($value);
    $length = preg_match_all('/./us', $fields[$key]);
    if ($length === false || $length > $limit) {
        fail_request(400, 'Date invalide. Înapoi și încearcă din nou.');
    }
}

// A filled honeypot is acknowledged without calling mail().
if ($fields['website'] !== '') {
    echo 'OK';
    exit;
}

$name = $fields['name'];
$email = $fields['email'];
$message = $fields['message'];
if (preg_match_all('/./us', $name) < 2
    || preg_match('/[\r\n]/', $name . $email)
    || strlen($email) > 254
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || preg_match_all('/./us', $message) < 10) {
    fail_request(400, 'Date invalide. Înapoi și încearcă din nou.');
}

// Configure these in the hosting environment; no .env loader is included.
$to = getenv('MAIL_TO') ?: 'ftanase2006@gmail.com';
$from = getenv('MAIL_FROM') ?: '';
foreach ([$to, $from] as $address) {
    if (preg_match('/[\r\n\x00]/', $address)
        || !filter_var($address, FILTER_VALIDATE_EMAIL)) {
        fail_request(503, 'Formularul nu este configurat. Folosește linkul de email din pagina Contact.');
    }
}
if (!function_exists('mail')) {
    fail_request(503, 'Formularul nu este disponibil. Folosește linkul de email din pagina Contact.');
}

// Use a fixed subject and sender. Only the validated email enters Reply-To.
$subject = 'Mesaj nou de pe portofoliu';
$body = "Nume: {$name}\nEmail: {$email}\n\nMesaj:\n{$message}\n";
$headers = [
    'From' => $from,
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
];

try {
    $sent = @mail($to, $subject, $body, $headers);
} catch (Throwable $error) {
    $sent = false;
}

if ($sent) {
    // Acceptance by the mail transport does not guarantee inbox delivery.
    header('Location: index.html?contact=accepted#contact', true, 303);
    exit;
}

fail_request(500, 'Nu am putut trimite mesajul. Folosește linkul de email din pagina Contact.');