# Loka Boardgame Cafe: PHP + MySQL (phpMyAdmin)

Data disimpan di database MySQL (`loka_cafe`), bisa dilihat dan diubah lewat phpMyAdmin.

## Struktur folder
```
loka-web/
  index.html  style.css  script.js
  database.sql   <- diimpor ke phpMyAdmin
  setup.php      <- buat akun admin (hapus setelah dipakai)
  api/
    config.php  bootstrap.php  auth.php  user.php  admin.php
```

## Langkah menjalankan (XAMPP)
1. Nyalakan **Apache** dan **MySQL** di XAMPP Control Panel.
2. Salin folder `loka-web` ke `C:\xampp\htdocs\`.
3. Buka http://localhost/phpmyadmin, tab **Import**, pilih `database.sql`, klik **Go**.
4. Jika MySQL kamu punya kata sandi, ubah `api/config.php`.
5. Buka http://localhost/loka-web/setup.php sekali untuk membuat admin, lalu **hapus setup.php**.
6. Buka http://localhost/loka-web/

Akun admin awal: `admin@loka.id` / `admin123` (ganti kata sandinya di `setup.php` sebelum dijalankan).

Catatan: jangan buka dengan klik dua kali `index.html` atau Live Server, karena PHP tidak jalan di sana.

## Fitur
- Pelanggan: daftar, masuk, pesan menu, booking meja, batalkan, riwayat, edit profil.
- Admin: statistik, ubah status pesanan dan booking, kelola menu, hapus pelanggan, riwayat login.
