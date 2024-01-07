-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 07, 2024 at 01:39 PM
-- Server version: 10.6.12-MariaDB-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `maritalk`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `owner_id` int(10) UNSIGNED NOT NULL,
  `likes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `dislikes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` varchar(20) NOT NULL DEFAULT '""'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `content`, `owner_id`, `likes`, `dislikes`, `created_at`, `updated_at`, `category`) VALUES
(1, 'post title', 'oh shit oh shit', 2, 24, 2, '2024-01-05 05:16:57', '2024-01-05 05:16:57', '\"\"'),
(2, 'new question', 'Pogi si?', 2, 12, 52, '2024-01-06 06:02:31', '2024-01-06 06:02:31', 'question'),
(3, 'new idea', 'Maglaro ng apoy sa ilalim ng tubig', 2, 0, 1521, '2024-01-06 06:07:51', '2024-01-06 06:07:51', 'idea'),
(4, 'new article', 'Ewan ko ba kung bakit', 2, 231, 23, '2024-01-06 06:09:00', '2024-01-06 06:09:00', 'article'),
(5, 'new issue', 'Si ano nag ganun', 2, 231, 0, '2024-01-06 06:09:32', '2024-01-06 06:09:32', 'issue'),
(6, 'Saksi Ni Java', 'Sali kayo', 2, 0, 0, '2024-01-06 13:40:59', '2024-01-06 13:40:59', 'idea'),
(7, 'test', 'test', 10, 3, 4, '2024-01-06 19:02:35', '2024-01-06 19:02:35', '\"\"'),
(11, 'test', 'test', 2, 10, 7, '2024-01-06 19:02:35', '2024-01-06 19:02:35', '\"\"'),
(12, 'test test', 'test', 2, 0, 0, '2024-01-06 19:02:35', '2024-01-06 19:02:35', 'Select category'),
(13, 'dada', 'dada', 10, 2, 2, '2024-01-06 21:40:17', '2024-01-06 21:40:17', '\"\"');

-- --------------------------------------------------------

--
-- Table structure for table `replies`
--

CREATE TABLE `replies` (
  `id` int(10) UNSIGNED NOT NULL,
  `owner_id` int(10) UNSIGNED NOT NULL,
  `content` longtext NOT NULL,
  `parent_id` int(10) UNSIGNED NOT NULL,
  `likes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `dislikes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `replies`
--

INSERT INTO `replies` (`id`, `owner_id`, `content`, `parent_id`, `likes`, `dislikes`, `created_at`, `updated_at`) VALUES
(1, 2, 'San yan?', 6, 0, 0, '2024-01-06 13:58:01', '2024-01-06 13:58:01'),
(2, 2, 'test din', 7, 0, 0, '2024-01-06 21:25:12', '2024-01-06 21:25:12'),
(3, 2, 'ows', 7, 0, 0, '2024-01-06 21:25:18', '2024-01-06 21:25:18'),
(4, 2, 'yown', 12, 0, 0, '2024-01-06 22:03:11', '2024-01-06 22:03:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `photo` varchar(255) NOT NULL DEFAULT '"https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `name`, `role`, `email`, `created_at`, `photo`) VALUES
(2, '$argon2id$v=19$m=65536,t=3,p=4$N97Ki1lsH9nGBMv9vtRJ7A$Kew65d0mkb6b2XXK3VCbcqoE7exAmpzOQ+y6trc2EJ4', 'Romar Macaraeg', 'user', 'romar@mail.com', '2023-12-26 17:55:44', 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'),
(10, '$argon2id$v=19$m=65536,t=3,p=4$N97Ki1lsH9nGBMv9vtRJ7A$Kew65d0mkb6b2XXK3VCbcqoE7exAmpzOQ+y6trc2EJ4', 'Marbert Cerda', 'user', 'marbert@mail.com', '2024-01-06 21:37:46', '\"https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg\"');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_owner` (`owner_id`);

--
-- Indexes for table `replies`
--
ALTER TABLE `replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `replied_to_post` (`parent_id`),
  ADD KEY `reply_owner` (`owner_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `replies`
--
ALTER TABLE `replies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `post_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `replies`
--
ALTER TABLE `replies`
  ADD CONSTRAINT `replied_to_post` FOREIGN KEY (`parent_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `reply_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
