# README — Loka Boardgame Cafe

**Proyek Website E-Commerce dan Reservasi Boardgame Cafe**

## Identitas Kelompok

- **Kelompok:** 4
- **Anggota:**
  1. Selvi Tri Jayanti
  2. Miskatul Jannah
  3. Azzika Adzahila
  4. Hasrah Taskia

## 1. Deskripsi Proyek

Loka Boardgame Cafe merupakan proyek pengembangan website untuk sebuah kafe yang menyediakan fasilitas bermain boardgame. Website ini dirancang untuk memudahkan pelanggan dalam melihat menu, melakukan pemesanan, melakukan booking meja, serta mengelola informasi akun secara online.

Website ini dilengkapi dengan dua jenis pengguna, yaitu pelanggan (user) dan administrator (admin). Setiap jenis pengguna memiliki hak akses dan fitur yang berbeda sesuai dengan kebutuhannya.

Proyek ini menggunakan HTML, CSS, dan JavaScript untuk membangun antarmuka website, PHP untuk memproses logika aplikasi, serta MySQL sebagai database yang dapat dikelola melalui phpMyAdmin.

## 2. Tujuan Proyek

Tujuan pengembangan website Loka Boardgame Cafe adalah:

1. Mempermudah pelanggan dalam mengakses informasi menu dan layanan kafe.
2. Menyediakan sistem pemesanan menu dan booking meja secara online.
3. Mengimplementasikan sistem registrasi dan login dengan hak akses berbeda.
4. Membantu admin dalam mengelola data pelanggan, menu, pesanan, dan booking.
5. Menerapkan penggunaan database untuk menyimpan dan mengelola data aplikasi.

## 3. Fitur Website

### A. Fitur User (Pelanggan)

- Registrasi akun dan login.
- Melihat menu yang tersedia.
- Melakukan pemesanan menu.
- Melakukan booking meja.
- Membatalkan pesanan atau booking sesuai ketentuan sistem.
- Melihat riwayat pesanan.
- Mengubah informasi profil akun.

### B. Fitur Admin

- Melihat statistik website.
- Mengelola data menu.
- Melihat dan mengelola pesanan pelanggan.
- Mengubah status pesanan dan booking.
- Melihat data pelanggan.
- Menghapus akun pelanggan.
- Melihat riwayat login.

## 4. Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| HTML | Membuat struktur halaman website. |
| CSS | Mengatur tampilan dan desain website. |
| JavaScript | Menangani interaksi pada halaman website. |
| PHP | Memproses registrasi, login, pemesanan, dan pengelolaan data. |
| MySQL | Menyimpan data aplikasi. |
| phpMyAdmin | Mengelola database MySQL melalui antarmuka web. |
| XAMPP | Menjalankan server Apache, PHP, dan MySQL secara lokal. |

## 5. Struktur Folder

```text
loka-web/
├── index.html
├── style.css
├── script.js
├── database.sql
├── setup.php
└── api/
    ├── config.php
    ├── bootstrap.php
    ├── auth.php
    ├── user.php
    └── admin.php
```

**Keterangan:**

- `index.html`: halaman utama website.
- `style.css`: pengaturan tampilan website.
- `script.js`: interaksi dan komunikasi halaman dengan backend.
- `database.sql`: struktur tabel dan data awal database jika disertakan.
- `setup.php`: skrip untuk menyiapkan akun administrator.
- `api/config.php`: konfigurasi koneksi database.
- `api/bootstrap.php`: komponen pendukung backend.
- `api/auth.php`: proses autentikasi dan akun.
- `api/user.php`: proses yang berkaitan dengan fitur pelanggan.
- `api/admin.php`: proses yang berkaitan dengan fitur administrator.

## 7. Database

Database proyek menggunakan MySQL dengan nama `loka_cafe`. Database berfungsi untuk menyimpan informasi akun pengguna serta data yang diperlukan dalam proses pemesanan menu, booking meja, dan pengelolaan website.

Database dapat diperiksa dan dikelola melalui phpMyAdmin. Struktur tabel yang digunakan mengikuti isi file `database.sql`.

## 8. Keamanan Sistem

Website dirancang dengan pemisahan hak akses antara pelanggan dan administrator. Kata sandi akun perlu disimpan dalam bentuk hash, sedangkan akses ke fitur admin harus dibatasi untuk akun dengan peran administrator.

Konfigurasi database dan skrip setup perlu dijaga agar tidak dapat diakses atau disalahgunakan oleh pihak yang tidak berwenang.

## 9. Penutup

Melalui proyek Loka Boardgame Cafe, Kelompok 4 menerapkan pengembangan website yang mengintegrasikan antarmuka pengguna, pemrosesan backend, autentikasi, dan pengelolaan database. Website ini diharapkan dapat menjadi contoh penerapan teknologi digital untuk mendukung pelayanan dan operasional bisnis kafe secara lebih praktis.

**Dikembangkan oleh Kelompok 4: Azzika, Miska, Kia, dan Selvi.**
