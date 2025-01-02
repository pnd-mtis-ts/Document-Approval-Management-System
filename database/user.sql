-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 02, 2025 at 05:50 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `user`
--

-- --------------------------------------------------------

--
-- Table structure for table `aplikasi`
--

CREATE TABLE `aplikasi` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `aplikasi`
--

INSERT INTO `aplikasi` (`id`, `name`, `company_id`) VALUES
(1, 'Payment', 1),
(2, 'PO', 1);

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `no_phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `name`, `address`, `no_phone`) VALUES
(1, 'PT Tiga Serangkai Pustaka Mandiri', 'Jl. Prof. DR. Supomo No.23, Sriwedari, Kec. Laweyan, Kota Surakarta, Jawa Tengah 57141', '(0271) 714344'),
(2, 'PT. Tisera Distribusindo', 'Jl. Prof. DR. Supomo No.23, Sriwedari, Kec. Laweyan, Kota Surakarta, Jawa Tengah 57141', '0815-4875-6209'),
(3, 'PT K33 Distribusi', 'Jl. Ahmadi Yani, No. 308, Pabelan, Kartasura, Sukoharjo, Jawa Tengah', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dokumen`
--

CREATE TABLE `dokumen` (
  `id` int NOT NULL,
  `nomor_dokumen` varchar(50) DEFAULT NULL,
  `judul_dokumen` varchar(255) NOT NULL,
  `user_ID` int UNSIGNED NOT NULL,
  `status` varchar(255) NOT NULL,
  `tgl_pengajuan` date DEFAULT NULL,
  `transaksi_id` int DEFAULT NULL,
  `masterflow_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dokumen`
--

INSERT INTO `dokumen` (`id`, `nomor_dokumen`, `judul_dokumen`, `user_ID`, `status`, `tgl_pengajuan`, `transaksi_id`, `masterflow_id`) VALUES
(1, '1TSPM2024', 'Document Request', 1, 'pending', '2024-12-31', NULL, NULL),
(2, '111TSPM2025', 'Payment Request', 1, 'pending', '2024-12-31', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dokumenapproval`
--

CREATE TABLE `dokumenapproval` (
  `id` int NOT NULL,
  `dokumen_id` int DEFAULT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `jabatan` varchar(20) DEFAULT NULL,
  `index` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `group_index` int DEFAULT NULL,
  `jenis_group` varchar(50) DEFAULT NULL,
  `tgl_deadline` date DEFAULT NULL,
  `alasan_reject` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `approval_status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dokumenapproval`
--

INSERT INTO `dokumenapproval` (`id`, `dokumen_id`, `user_id`, `nama`, `email`, `jabatan`, `index`, `group_index`, `jenis_group`, `tgl_deadline`, `alasan_reject`, `note`, `approval_status`) VALUES
(1, 1, NULL, 'Erwin', 'erwintra88@gmail.com', 'Sekretaris', '1', 1, 'all', '2025-01-03', NULL, NULL, 'pending'),
(2, 1, NULL, 'Nanang', 'nanang@gmail.com', 'Manager', '1', 2, 'all', '2025-01-03', NULL, NULL, 'pending'),
(3, 1, NULL, 'Wulan', 'wulan@gmail.com', 'GM', '1', 3, 'all', '2025-01-03', NULL, NULL, 'pending'),
(4, 2, NULL, 'Yuka', 'yuka@gmail.com', 'Manager', '1', 1, 'all', '2025-01-02', NULL, NULL, 'pending'),
(5, 2, NULL, 'Jot', 's@gmail.com', 'Supervisor', '1', 2, 'all', '2025-01-02', NULL, NULL, 'pending'),
(6, 2, NULL, 'Darto', 'omesh@gmail.com', 'GM', '1', 3, 'all', '2025-01-02', NULL, NULL, 'pending'),
(7, 2, NULL, 'Yuka', 'yuka@gmail.com', 'Manager', '1', 1, 'all', '2025-01-02', NULL, NULL, 'pending'),
(8, 2, NULL, 'Jot', 's@gmail.com', 'Supervisor', '1', 2, 'all', '2025-01-02', NULL, NULL, 'pending'),
(9, 2, NULL, 'Darto', 'omesh@gmail.com', 'GM', '1', 3, 'all', '2025-01-02', NULL, NULL, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `dokumenversion`
--

CREATE TABLE `dokumenversion` (
  `id` int NOT NULL,
  `nama_file` varchar(255) NOT NULL,
  `tgl_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipe_file` varchar(100) DEFAULT NULL,
  `size_file` bigint DEFAULT NULL,
  `dokumen_id` int NOT NULL,
  `deskripsi` text,
  `status` varchar(50) DEFAULT 'pending',
  `version` int DEFAULT '1',
  `file_url` varchar(255) DEFAULT NULL,
  `id_multer` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dokumenversion`
--

INSERT INTO `dokumenversion` (`id`, `nama_file`, `tgl_upload`, `tipe_file`, `size_file`, `dokumen_id`, `deskripsi`, `status`, `version`, `file_url`, `id_multer`) VALUES
(1, '1TSPM2024-Document Request_versi_1.pdf', '2024-12-31 14:51:26', 'pdf', 82050, 1, NULL, 'pending', 1, 'uploads\\1TSPM2024-Document Request_versi_1.pdf', 17356314860026),
(2, '111TSPM2025-Payment Request_versi_1.pdf', '2024-12-31 16:35:24', 'pdf', 81450, 2, NULL, 'pending', 1, 'uploads\\111TSPM2025-Payment Request_versi_1.pdf', 17356377239070),
(3, '111TSPM2025-Payment Request_versi_2.pdf', '2024-12-31 16:35:55', 'pdf', 81450, 2, NULL, 'pending', 2, 'uploads\\111TSPM2025-Payment Request_versi_2.pdf', 17356377548565);

-- --------------------------------------------------------

--
-- Table structure for table `jabatan`
--

CREATE TABLE `jabatan` (
  `id` int NOT NULL,
  `nama_jabatan` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `jabatan`
--

INSERT INTO `jabatan` (`id`, `nama_jabatan`) VALUES
(1, 'Supervisor'),
(2, 'Manager'),
(3, 'Karyawan');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, '20240924031603_users.js', 1, '2024-09-24 04:19:30'),
(2, '20240924040516_users.js', 2, '2024-09-24 04:22:32'),
(3, '20240924082153_add_role_to_users.js', 3, '2024-09-24 08:25:03'),
(4, '20240930055257_add_aplikasi_role_to_users.js', 4, '2024-09-30 06:59:29'),
(5, '20241008040746_create_usersprofile_table.js', 5, '2024-10-08 04:15:13');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int UNSIGNED NOT NULL,
  `is_locked` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `signature`
--

CREATE TABLE `signature` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `file_signature` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `aplikasi_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `googleId` varchar(255) DEFAULT NULL,
  `sub` varchar(255) DEFAULT NULL,
  `pin` varchar(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`, `googleId`, `sub`, `pin`) VALUES
(1, 'Erwin Saputro', 'erwintra88@gmail.com', '$2b$10$kRMkrKlWGgM2oEl2ckpvaOfNZMtrFP0CADyFVVv8NJ0qSX3f2ggFG', '2024-12-19 00:43:15', '2024-12-19 00:43:15', NULL, NULL, '123'),
(7, 'Dias', 'dias@gmail.com', '$2b$10$IzaHYla5f90GRh0.wV0m6OLuQNUCC78p3X8B2Q.Esz/CjtlNGRe4G', '2024-12-19 06:40:02', '2024-12-19 06:40:02', NULL, NULL, '123');

-- --------------------------------------------------------

--
-- Table structure for table `usersauth`
--

CREATE TABLE `usersauth` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `role_id` int UNSIGNED DEFAULT NULL,
  `company_id` int DEFAULT NULL,
  `jabatan_id` int DEFAULT NULL,
  `aplikasi_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usersauth`
--

INSERT INTO `usersauth` (`id`, `user_id`, `role_id`, `company_id`, `jabatan_id`, `aplikasi_id`) VALUES
(1, 1, 2, 1, 3, 1),
(2, 1, 3, 2, 2, 2),
(10, 7, 3, 1, 2, 1),
(11, 7, 2, 1, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `usersprofile`
--

CREATE TABLE `usersprofile` (
  `user_id` int UNSIGNED NOT NULL,
  `alamat` varchar(100) NOT NULL,
  `nomor_telepon` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usersprofile`
--

INSERT INTO `usersprofile` (`user_id`, `alamat`, `nomor_telepon`, `created_at`, `updated_at`) VALUES
(1, 'Karanganyar', '082242615523', '2024-12-19 00:43:15', '2024-12-19 00:43:15'),
(7, 'Jl.Kancil No.144\nPerum Winong', '081234567890', '2024-12-19 06:40:02', '2024-12-19 06:40:02');

-- --------------------------------------------------------

--
-- Table structure for table `usersrole`
--

CREATE TABLE `usersrole` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usersrole`
--

INSERT INTO `usersrole` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'SuperAdmin', '2024-10-14 05:16:27', '2024-10-14 05:16:27'),
(2, 'User', '2024-10-14 05:48:28', '2024-10-14 05:48:28'),
(3, 'Admin', '2024-10-16 04:58:06', '2024-10-16 04:58:06'),
(4, 'Aplikasi', '2024-10-21 04:52:08', '2024-10-21 04:52:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aplikasi`
--
ALTER TABLE `aplikasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dokumen`
--
ALTER TABLE `dokumen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_ID` (`user_ID`);

--
-- Indexes for table `dokumenapproval`
--
ALTER TABLE `dokumenapproval`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dokumenapproval_dokumen_id_foreign` (`dokumen_id`),
  ADD KEY `dokumenapproval_user_id_foreign` (`user_id`);

--
-- Indexes for table `dokumenversion`
--
ALTER TABLE `dokumenversion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dokumen_id` (`dokumen_id`);

--
-- Indexes for table `jabatan`
--
ALTER TABLE `jabatan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indexes for table `signature`
--
ALTER TABLE `signature`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aplikasi_id` (`aplikasi_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_name_unique` (`name`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `usersauth`
--
ALTER TABLE `usersauth`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usersauth_ibfk_2` (`role_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `jabatan_id` (`jabatan_id`),
  ADD KEY `aplikasi_id` (`aplikasi_id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Indexes for table `usersprofile`
--
ALTER TABLE `usersprofile`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `usersrole`
--
ALTER TABLE `usersrole`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aplikasi`
--
ALTER TABLE `aplikasi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `dokumen`
--
ALTER TABLE `dokumen`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `dokumenapproval`
--
ALTER TABLE `dokumenapproval`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `dokumenversion`
--
ALTER TABLE `dokumenversion`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jabatan`
--
ALTER TABLE `jabatan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `signature`
--
ALTER TABLE `signature`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `usersauth`
--
ALTER TABLE `usersauth`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `usersrole`
--
ALTER TABLE `usersrole`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `aplikasi`
--
ALTER TABLE `aplikasi`
  ADD CONSTRAINT `aplikasi_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `dokumen`
--
ALTER TABLE `dokumen`
  ADD CONSTRAINT `user_ID` FOREIGN KEY (`user_ID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `dokumenapproval`
--
ALTER TABLE `dokumenapproval`
  ADD CONSTRAINT `dokumenapproval_dokumen_id_foreign` FOREIGN KEY (`dokumen_id`) REFERENCES `dokumen` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `dokumenapproval_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `dokumenversion`
--
ALTER TABLE `dokumenversion`
  ADD CONSTRAINT `dokumen_id` FOREIGN KEY (`dokumen_id`) REFERENCES `dokumen` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `signature`
--
ALTER TABLE `signature`
  ADD CONSTRAINT `signature_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`aplikasi_id`) REFERENCES `aplikasi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usersauth`
--
ALTER TABLE `usersauth`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usersauth_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `usersauth_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `usersrole` (`id`),
  ADD CONSTRAINT `usersauth_ibfk_3` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `usersauth_ibfk_4` FOREIGN KEY (`jabatan_id`) REFERENCES `jabatan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `usersauth_ibfk_5` FOREIGN KEY (`aplikasi_id`) REFERENCES `aplikasi` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `usersprofile`
--
ALTER TABLE `usersprofile`
  ADD CONSTRAINT `fk_user_profile` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usersprofile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
