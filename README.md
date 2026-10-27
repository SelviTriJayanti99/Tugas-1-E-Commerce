# Loka Boardgame Cafe: PHP + MySQL (phpMyAdmin)

**Kelompok 4**
- Azzika
- Miska
- Kia
- Selvi

Data disimpan di database MySQL (`loka_cafe`) dan dapat dilihat serta dikelola melalui phpMyAdmin.

## Struktur Folder

```text
loka-web/
  index.html
  style.css
  script.js
  database.sql
  setup.php
  api/
    config.php
    bootstrap.php
    auth.php
    user.php
    admin.php
```

## Langkah Menjalankan Website (XAMPP)

1. Nyalakan **Apache** dan **MySQL** melalui XAMPP Control Panel.
2. Salin folder `loka-web` ke `C:\xampp\htdocs\`.
3. Buka `http://localhost/phpmyadmin`, pilih tab **Import**, pilih file `database.sql`, lalu klik **Go**.
4. Jika MySQL menggunakan kata sandi, sesuaikan konfigurasi pada `api/config.php`.
5. Buka `http://localhost/loka-web/setup.php` satu kali untuk membuat akun admin, lalu hapus `setup.php` setelah selesai digunakan.
6. Buka website melalui `http://localhost/loka-web/`.

**Akun admin awal:**
- Email: `admin@loka.id`
- Kata sandi: `admin123`

Ganti kata sandi bawaan sebelum digunakan. Hapus atau nonaktifkan skrip setup setelah akun admin berhasil dibuat.

**Catatan:** Jangan membuka website dengan mengeklik dua kali `index.html` atau menggunakan Live Server karena PHP tidak berjalan melalui metode tersebut.

## Fitur Website

### 1. Pelanggan (User)
- Registrasi dan login akun.
- Melihat serta memesan menu.
- Melakukan booking meja.
- Membatalkan pesanan atau booking.
- Melihat riwayat pesanan.
- Mengedit profil akun.

### 2. Admin
- Melihat statistik website.
- Mengubah status pesanan dan booking.
- Mengelola menu.
- Menghapus akun pelanggan.
- Melihat riwayat login.

## Teknologi yang Digunakan
- HTML
- CSS
- JavaScript
- PHP
- MySQL
- phpMyAdmin
- XAMPP

**Tujuan proyek:** Mengembangkan website Loka Boardgame Cafe dengan sistem registrasi, login, pemesanan, booking meja, dan dashboard admin yang terhubung dengan database MySQL.
