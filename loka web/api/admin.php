<?php
require __DIR__ . '/bootstrap.php';
$admin = require_admin();

const OSTAT = ['baru', 'diproses', 'selesai', 'dibatalkan'];
const BSTAT = ['menunggu', 'dikonfirmasi', 'selesai', 'dibatalkan'];

function one(string $sql, array $p = []) {
    $s = db()->prepare($sql);
    $s->execute($p);
    return $s->fetchColumn();
}

switch (action()) {
    case 'stats':
        out([
            'users' => (int)one("SELECT COUNT(*) FROM users WHERE role = 'user'"),
            'orders' => (int)one('SELECT COUNT(*) FROM orders'),
            'bookings' => (int)one('SELECT COUNT(*) FROM bookings'),
            'revenue' => (int)one("SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'selesai'"),
            'orders_new' => (int)one("SELECT COUNT(*) FROM orders WHERE status = 'baru'"),
            'bookings_pending' => (int)one("SELECT COUNT(*) FROM bookings WHERE status = 'menunggu'"),
            'logins_today' => (int)one("SELECT COUNT(*) FROM login_history WHERE status = 'berhasil' AND DATE(created_at) = CURDATE()"),
        ]);

    case 'orders':
        $r = db()->query('SELECT o.id, o.item_name, o.qty, o.total, o.status, o.created_at, u.name AS user_name, u.email AS user_email
            FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC, o.id DESC LIMIT 500')->fetchAll();
        out(['orders' => $r]);

    case 'order_status':
        $d = body();
        if (!in_array($d['status'] ?? '', OSTAT, true)) fail('Status tidak valid.');
        $s = db()->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $s->execute([$d['status'], (int)($d['id'] ?? 0)]);
        out(['ok' => true]);

    case 'bookings':
        $r = db()->query('SELECT b.id, b.booking_date, b.booking_time, b.people, b.status, u.name AS user_name, u.phone AS user_phone
            FROM bookings b JOIN users u ON u.id = b.user_id ORDER BY b.booking_date DESC, b.booking_time DESC, b.id DESC LIMIT 500')->fetchAll();
        out(['bookings' => $r]);

    case 'booking_status':
        $d = body();
        if (!in_array($d['status'] ?? '', BSTAT, true)) fail('Status tidak valid.');
        $s = db()->prepare('UPDATE bookings SET status = ? WHERE id = ?');
        $s->execute([$d['status'], (int)($d['id'] ?? 0)]);
        out(['ok' => true]);

    case 'menu':
        out(['menu' => db()->query('SELECT id, name, price, is_active FROM menu ORDER BY name')->fetchAll()]);

    case 'menu_save':
        $d = body();
        $name = trim((string)($d['name'] ?? ''));
        $price = (int)($d['price'] ?? 0);
        $active = !empty($d['active']) ? 1 : 0;
        if ($name === '' || mb_strlen($name) > 100 || $price < 1) fail('Nama dan harga menu belum benar.');
        if (!empty($d['id'])) {
            db()->prepare('UPDATE menu SET name = ?, price = ?, is_active = ? WHERE id = ?')
                ->execute([$name, $price, $active, (int)$d['id']]);
        } else {
            db()->prepare('INSERT INTO menu (name, price, is_active) VALUES (?, ?, ?)')->execute([$name, $price, $active]);
        }
        out(['ok' => true]);

    case 'menu_delete':
        $d = body();
        db()->prepare('DELETE FROM menu WHERE id = ?')->execute([(int)($d['id'] ?? 0)]);
        out(['ok' => true]);

    case 'users':
        $r = db()->query('SELECT u.id, u.name, u.email, u.phone, u.role,
                (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS orders,
                (SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.id) AS bookings
            FROM users u ORDER BY u.created_at DESC, u.id DESC')->fetchAll();
        out(['users' => $r]);

    case 'user_delete':
        $d = body();
        $id = (int)($d['id'] ?? 0);
        if ($id === (int)$admin['id']) fail('Tidak bisa menghapus akun sendiri.');
        $s = db()->prepare("DELETE FROM users WHERE id = ? AND role = 'user'");
        $s->execute([$id]);
        if (!$s->rowCount()) fail('Pengguna tidak ditemukan atau bukan akun pelanggan.', 404);
        out(['ok' => true]);

    case 'logins':
        $r = db()->query('SELECT h.id, h.email, h.status, h.ip_address, h.user_agent, h.created_at, u.name AS user_name
            FROM login_history h LEFT JOIN users u ON u.id = h.user_id
            ORDER BY h.created_at DESC, h.id DESC LIMIT 300')->fetchAll();
        out(['logins' => $r]);

    default:
        fail('Aksi tidak dikenal.', 404);
}
