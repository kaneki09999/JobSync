-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2025 at 01:56 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_jobsync`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `active_job_postings`
-- (See below for the actual view)
--
CREATE TABLE `active_job_postings` (
`job_id` int(11)
,`employer_id` int(11)
,`jobTitle` varchar(255)
,`jobTags` varchar(255)
,`jobRole` varchar(255)
,`minSalary` varchar(255)
,`maxSalary` varchar(255)
,`salaryType` varchar(255)
,`education` varchar(255)
,`experience` varchar(255)
,`jobType` varchar(255)
,`expirationDate` timestamp
,`jobLevel` varchar(255)
,`address` varchar(255)
,`city` varchar(255)
,`selectedBenefits` text
,`jobDescription` text
,`status` varchar(255)
,`job_created_at` timestamp
,`job_updated_at` text
,`company_name` varchar(255)
,`about_us` text
,`logo` text
,`banner` text
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `applicants_favorite_jobs`
-- (See below for the actual view)
--
CREATE TABLE `applicants_favorite_jobs` (
`favorite_job_id` int(11)
,`applicant_id` int(11)
,`added_at` timestamp
,`job_id` int(11)
,`employer_id` int(11)
,`jobTitle` varchar(255)
,`jobTags` varchar(255)
,`jobRole` varchar(255)
,`minSalary` varchar(255)
,`maxSalary` varchar(255)
,`salaryType` varchar(255)
,`education` varchar(255)
,`experience` varchar(255)
,`jobType` varchar(255)
,`expirationDate` timestamp
,`jobLevel` varchar(255)
,`address` varchar(255)
,`city` varchar(255)
,`selectedBenefits` text
,`jobDescription` text
,`status` varchar(255)
,`created_at` timestamp
,`updated_at` text
,`logo` text
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `applicant_answer`
-- (See below for the actual view)
--
CREATE TABLE `applicant_answer` (
`job_id` int(11)
,`application_id` int(11)
,`question_id` int(11)
,`question` varchar(500)
,`answer` varchar(255)
,`ideal_answer` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `applicant_applied_details`
-- (See below for the actual view)
--
CREATE TABLE `applicant_applied_details` (
`job_id` int(11)
,`applicant_id` int(11)
,`firstname` varchar(255)
,`middlename` varchar(255)
,`lastname` varchar(255)
,`suffix` varchar(25)
,`gender` varchar(25)
,`contact` bigint(11)
,`profile_picture` varchar(255)
,`email` varchar(255)
,`password` varchar(266)
,`verification_code` varchar(255)
,`email_verified_at` text
,`created_at` timestamp
,`updated_at` timestamp
,`headline` varchar(255)
,`birthday` varchar(255)
,`birthplace` varchar(255)
,`address` varchar(255)
,`city` varchar(255)
,`barangay` varchar(255)
,`postal` varchar(255)
,`status` varchar(223)
,`experience` varchar(255)
,`attainment` varchar(255)
,`biography` text
,`nationality` varchar(255)
,`application_id` int(11)
,`resumeName` varchar(255)
,`resumePath` varchar(255)
,`coverLetter` text
,`applied_status` varchar(255)
,`applied_at` timestamp
,`facebook_icon` varchar(255)
,`instagram_icon` varchar(255)
,`youtube_icon` varchar(255)
,`twitter_icon` varchar(255)
,`tiktok_icon` varchar(255)
,`dribble_icon` varchar(255)
,`github_icon` varchar(255)
,`reddit_icon` varchar(255)
,`freelancer_icon` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `applicant_details`
-- (See below for the actual view)
--
CREATE TABLE `applicant_details` (
`applicant_id` int(11)
,`firstname` varchar(255)
,`middlename` varchar(255)
,`lastname` varchar(255)
,`suffix` varchar(25)
,`gender` varchar(25)
,`contact` bigint(11)
,`profile_picture` varchar(255)
,`email` varchar(255)
,`password` varchar(266)
,`verification_code` varchar(255)
,`email_verified_at` text
,`headline` varchar(255)
,`birthday` varchar(255)
,`birthplace` varchar(255)
,`address` varchar(255)
,`city` varchar(255)
,`barangay` varchar(255)
,`postal` varchar(255)
,`status` varchar(223)
,`experience` varchar(255)
,`attainment` varchar(255)
,`biography` text
,`nationality` varchar(255)
,`personal_info_created_at` datetime
,`personal_info_updated_at` timestamp
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `applied_jobs`
-- (See below for the actual view)
--
CREATE TABLE `applied_jobs` (
`applicant_id` int(11)
,`job_id` int(11)
,`employer_id` int(11)
,`jobTitle` varchar(255)
,`jobTags` varchar(255)
,`jobRole` varchar(255)
,`minSalary` varchar(255)
,`maxSalary` varchar(255)
,`salaryType` varchar(255)
,`education` varchar(255)
,`experience` varchar(255)
,`jobType` varchar(255)
,`expirationDate` timestamp
,`jobLevel` varchar(255)
,`address` varchar(255)
,`city` varchar(255)
,`selectedBenefits` text
,`jobDescription` text
,`status` varchar(255)
,`created_at` timestamp
,`updated_at` text
,`logo` text
,`applied_at` timestamp
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `complete_company_profile`
-- (See below for the actual view)
--
CREATE TABLE `complete_company_profile` (
`company_id` int(11)
,`company_name` varchar(255)
,`about_us` text
,`logo` text
,`banner` text
,`company_created_at` timestamp
,`organization` varchar(255)
,`industry` varchar(255)
,`team_size` varchar(255)
,`year_establishment` varchar(255)
,`company_website` varchar(255)
,`company_vision` text
,`founding_info_created_at` timestamp
,`address` varchar(255)
,`contact_number` bigint(11)
,`company_email` varchar(255)
,`city` varchar(255)
,`contact_created_at` timestamp
,`facebook_icon` varchar(255)
,`instagram_icon` varchar(255)
,`youtube_icon` varchar(255)
,`twitter_icon` varchar(255)
,`pinterest_icon` varchar(255)
,`reddit_icon` varchar(255)
,`whatsapp_business_icon` varchar(255)
,`telegram_icon` varchar(255)
,`wechat_icon` varchar(255)
,`social_media_created_at` timestamp
,`job_post_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `employer_job_count`
-- (See below for the actual view)
--
CREATE TABLE `employer_job_count` (
`employer_id` int(11)
,`total_jobs` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `js_admin`
--

CREATE TABLE `js_admin` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_admin`
--

INSERT INTO `js_admin` (`id`, `name`, `username`, `password`, `email`, `created_at`) VALUES
(1, 'Admin', 'admin', '$2y$10$7WTBtkR6PMpW.bCJbesLHu8tKJBP5L9NaOtFn4LflI5HkWW3Gk2qa', 'me.jobsync@gmail.com', '2025-02-17 03:15:04');

-- --------------------------------------------------------

--
-- Table structure for table `js_applicants`
--

CREATE TABLE `js_applicants` (
  `applicant_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `middlename` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `suffix` varchar(25) DEFAULT NULL,
  `gender` varchar(25) NOT NULL,
  `contact` bigint(11) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(266) NOT NULL,
  `verification_code` varchar(255) NOT NULL,
  `email_verified_at` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_applicants`
--

INSERT INTO `js_applicants` (`applicant_id`, `firstname`, `middlename`, `lastname`, `suffix`, `gender`, `contact`, `profile_picture`, `email`, `password`, `verification_code`, `email_verified_at`, `created_at`, `updated_at`) VALUES
(77, 'Ajhay', 'Ramos', 'Arendayen', '', 'Male', 9123456789, 'uploads/profile_6752e19be781d.png', 'ajhayarendayen1@gmail.com', '$2y$10$BhYHIWCoMsqmIADapYmUweQ.g5dnnkOPeZCKZlwQVouRxBJdfxg1W', '350327', '2024-11-24 23:44:38', '2024-11-24 08:44:12', '2024-11-24 15:44:12'),
(93, 'Ricky James', '', 'Molina', '', 'male', 9123456789, 'uploads/profile_675582b9e0710.png', 'tanjirowkamado@gmail.com', '$2y$10$BhYHIWCoMsqmIADapYmUweQ.g5dnnkOPeZCKZlwQVouRxBJdfxg1W', '', '', '2024-12-08 11:22:55', '2024-12-08 11:22:55'),
(98, 'Bernal', '', 'Christian Dave', '', 'Male', 9123456789, 'uploads/profile_67974edfc8b01.png', 'arendayen.ajhaybsis2021@gmail.com', '$2y$10$BhYHIWCoMsqmIADapYmUweQ.g5dnnkOPeZCKZlwQVouRxBJdfxg1W', '', '', '2024-12-15 11:47:36', '2024-12-15 11:47:36'),
(119, 'Ajhay', NULL, 'Arendayen', 'Jr.', 'male', 912345678, NULL, 'ajhayarendayen@gmail.com', '$2y$10$rUKKmlt1e7qZcTYliR3xN.rxufu5KBvZo99PW7TtU/oMEQSqAX4Le', '150912', 'verified', '2025-03-04 10:36:10', '2025-03-04 17:36:10');

-- --------------------------------------------------------

--
-- Table structure for table `js_applicant_application`
--

CREATE TABLE `js_applicant_application` (
  `apply_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_applicant_application`
--

INSERT INTO `js_applicant_application` (`apply_id`, `application_id`, `question_id`, `answer`, `applied_at`) VALUES
(40, 23, 2, 'Yes', '2024-12-11 07:59:18'),
(41, 23, 3, 'Yes', '2024-12-11 07:59:18'),
(42, 23, 4, 'No', '2024-12-11 07:59:18'),
(43, 23, 5, 'Yes', '2024-12-11 07:59:18'),
(44, 23, 6, 'No', '2024-12-11 07:59:18'),
(53, 26, 7, 'Yes', '2024-12-15 12:37:02'),
(54, 26, 8, 'No', '2024-12-15 12:37:02'),
(55, 26, 9, 'Yes', '2024-12-15 12:37:02'),
(56, 26, 10, 'Yes', '2024-12-15 12:37:02'),
(57, 26, 11, 'No', '2024-12-15 12:37:02'),
(97, 39, 12, '1', '2025-03-03 04:37:32'),
(98, 39, 13, 'Yes', '2025-03-03 04:37:32'),
(99, 39, 14, 'No', '2025-03-03 04:37:32'),
(130, 48, 35, 'Yes', '2025-03-03 13:06:21'),
(131, 48, 36, 'Yes', '2025-03-03 13:06:21'),
(132, 49, 37, 'Yes', '2025-03-05 09:01:44');

-- --------------------------------------------------------

--
-- Table structure for table `js_applicant_application_resume`
--

CREATE TABLE `js_applicant_application_resume` (
  `application_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `resumeName` varchar(255) NOT NULL,
  `resumePath` varchar(255) NOT NULL,
  `coverLetter` text DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `applied_status` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_applicant_application_resume`
--

INSERT INTO `js_applicant_application_resume` (`application_id`, `applicant_id`, `job_id`, `resumeName`, `resumePath`, `coverLetter`, `type`, `applied_status`, `message`, `applied_at`) VALUES
(23, 93, 151, 'asdsadsad', 'uploads/resume/01 CANADA Checklist_v1_675581be729d7.pdf', '', 'assessment', 'To Interview', '', '2024-12-11 07:59:18'),
(26, 98, 152, 'Resume Arendayen', 'uploads/resume/regform_675ec3c40c784.pdf', '', 'assessment', 'Final Evaluation', '', '2024-12-15 12:37:02'),
(39, 77, 153, 'Resume Builder', 'uploads/resume/resume (46)_67c41a4039629.pdf', '', 'assessment', 'Final Evaluation', '', '2025-03-03 04:37:32'),
(48, 77, 159, 'Resume Builder', 'uploads/resume/resume (46)_67c41a4039629.pdf', '', 'assessment', 'On hold', NULL, '2025-03-03 13:06:21'),
(49, 77, 160, 'Resume Arendayen', 'uploads/resume/01 CANADA Checklist_v1_6752d5a3b28b5.pdf', '', NULL, 'Pending', NULL, '2025-03-05 09:01:44');

-- --------------------------------------------------------

--
-- Table structure for table `js_applicant_resume`
--

CREATE TABLE `js_applicant_resume` (
  `resume_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `resumeName` varchar(255) NOT NULL,
  `resumePath` varchar(255) NOT NULL,
  `primaryCv` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_applicant_resume`
--

INSERT INTO `js_applicant_resume` (`resume_id`, `applicant_id`, `resumeName`, `resumePath`, `primaryCv`, `created_at`) VALUES
(8, 77, 'Resume Arendayen', 'uploads/resume/01 CANADA Checklist_v1_6752d5a3b28b5.pdf', 0, '2024-12-06 10:44:51'),
(10, 77, 'Sample Resume', 'uploads/resume/1.1_6752d68a328df.pdf', 0, '2024-12-06 10:48:42'),
(11, 77, 'Pang apat na sample', 'uploads/resume/01 CANADA Checklist_v1_6752d6a159b63.pdf', 0, '2024-12-06 10:49:05'),
(13, 77, 'PANG LIMANGG RESUME', 'uploads/resume/01 CANADA Checklist_v1_6752db204785f.pdf', 0, '2024-12-06 11:08:16'),
(14, 93, 'asdsadsad', 'uploads/resume/01 CANADA Checklist_v1_675581be729d7.pdf', 0, '2024-12-08 11:23:42'),
(17, 98, 'Resume Arendayen', 'uploads/resume/regform_675ec3c40c784.pdf', 0, '2024-12-15 11:55:48'),
(20, 77, 'Resume Builder', 'uploads/resume/resume (46)_67c41a4039629.pdf', 1, '2025-03-02 08:43:44');

-- --------------------------------------------------------

--
-- Table structure for table `js_applicant_socialmedia`
--

CREATE TABLE `js_applicant_socialmedia` (
  `socialmedia_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `facebook_icon` varchar(255) DEFAULT NULL,
  `instagram_icon` varchar(255) DEFAULT NULL,
  `youtube_icon` varchar(255) DEFAULT NULL,
  `twitter_icon` varchar(255) DEFAULT NULL,
  `tiktok_icon` varchar(255) DEFAULT NULL,
  `dribble_icon` varchar(255) DEFAULT NULL,
  `github_icon` varchar(255) DEFAULT NULL,
  `reddit_icon` varchar(255) DEFAULT NULL,
  `freelancer_icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_applicant_socialmedia`
--

INSERT INTO `js_applicant_socialmedia` (`socialmedia_id`, `applicant_id`, `facebook_icon`, `instagram_icon`, `youtube_icon`, `twitter_icon`, `tiktok_icon`, `dribble_icon`, `github_icon`, `reddit_icon`, `freelancer_icon`, `created_at`, `updated_at`) VALUES
(17, 77, 'https://www.facebook.com/', 'https://www.facebook.com/', NULL, NULL, NULL, NULL, 'https://github.com/ajhay013', NULL, NULL, '2024-12-02 06:58:43', '2024-12-06 15:51:18'),
(19, 93, 'https://www.facebook.com/', 'https://www.facebook.com/', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-08 11:28:20', '2024-12-08 11:28:20'),
(21, 98, 'https://www.facebook.com/', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-15 11:55:23', '2024-12-15 11:55:23');

-- --------------------------------------------------------

--
-- Table structure for table `js_assessment`
--

CREATE TABLE `js_assessment` (
  `assessment_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `instructions` text NOT NULL,
  `correctAnswer` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `documents` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_assessment`
--

INSERT INTO `js_assessment` (`assessment_id`, `application_id`, `job_id`, `type`, `instructions`, `correctAnswer`, `image`, `documents`, `created_at`) VALUES
(314, 26, 152, 'Skill Tests', 'What is computer?', '', NULL, NULL, '2025-01-16 05:06:01'),
(315, 26, 152, 'Aptitude Tests', 'What does the passage suggest about the future of technology?\nA) Technology has reached its peak and will not advance further.\nB) The possibilities of technology are limited due to ethical concerns.\nC) Technology will continue to evolve and present both opportunities and challenges.\nD) Society should reject further technological advancements to avoid risks.', '', NULL, NULL, '2025-01-16 05:06:01'),
(319, 23, 151, 'Skill Tests', 'What is computer?', '', NULL, NULL, '2025-01-16 09:30:30'),
(320, 23, 151, 'Skill Tests', 'Give a sample of fruits', '', NULL, NULL, '2025-01-16 09:30:30'),
(321, 23, 151, 'Aptitude Tests', 'What does the passage suggest about the future of technology?\nA) Technology has reached its peak and will not advance further.\nB) The possibilities of technology are limited due to ethical concerns.\nC) Technology will continue to evolve and present both opportunities and challenges.\nD) Society should reject further technological advancements to avoid risks.', '', NULL, NULL, '2025-01-16 09:30:30'),
(342, 39, 153, 'Skill Tests', 'Give me one example of fruits that start with letter A', '', NULL, NULL, '2025-03-03 04:38:39'),
(343, 48, 159, 'Skill Tests', 'What is computer?', '', NULL, NULL, '2025-03-03 16:38:53');

-- --------------------------------------------------------

--
-- Table structure for table `js_assessment_answer`
--

CREATE TABLE `js_assessment_answer` (
  `answer_id` int(11) NOT NULL,
  `assessment_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_assessment_answer`
--

INSERT INTO `js_assessment_answer` (`answer_id`, `assessment_id`, `applicant_id`, `answer`, `created_at`) VALUES
(272, 319, 93, 'A computer is an electronic device that can store, process, and output information. Computers can perform a wide range of tasks, from writing letters to playing video games. ', '2025-02-13 10:50:59'),
(273, 320, 93, 'Apple', '2025-02-13 10:51:01'),
(274, 321, 93, 'C) Technology will continue to evolve and present both opportunities and challenges.', '2025-02-13 10:51:02'),
(276, 342, 77, 'Apple', '2025-03-03 04:39:06');

-- --------------------------------------------------------

--
-- Table structure for table `js_certifications`
--

CREATE TABLE `js_certifications` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `certification_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_certifications`
--

INSERT INTO `js_certifications` (`id`, `applicant_id`, `certification_name`, `created_at`) VALUES
(1, 93, 'Wala lang', '2025-01-30 09:32:50'),
(2, 77, 'Wala lang', '2025-02-18 15:37:39');

-- --------------------------------------------------------

--
-- Table structure for table `js_channel_interview`
--

CREATE TABLE `js_channel_interview` (
  `channel_id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `channel_name` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_channel_interview`
--

INSERT INTO `js_channel_interview` (`channel_id`, `employer_id`, `channel_name`, `created_at`) VALUES
(19, 41, 'Riot Games-9l9JCv51El8ydte4WkAnuqaXiY0LNG', '2025-01-23 03:04:30');

-- --------------------------------------------------------

--
-- Table structure for table `js_company_contact`
--

CREATE TABLE `js_company_contact` (
  `company_contact_id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `contact_number` bigint(11) NOT NULL,
  `company_email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `city` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_company_contact`
--

INSERT INTO `js_company_contact` (`company_contact_id`, `employer_id`, `address`, `contact_number`, `company_email`, `created_at`, `city`) VALUES
(1, 41, 'Ph9, Pkg6, Blk10, Lot4', 9123456789, 'riot@gmail.com', '2024-11-23 07:56:50', 'Caloocan City'),
(2, 42, 'Ph9, Pkg6, Blk10, Lot4', 9123456789, 'riot123@gmail.com', '2024-11-23 08:43:38', 'Caloocan City'),
(16, 56, 'Ph9, Pkg6, Blk10, Lot4', 9123456789, 'riot@gmail.com', '2025-01-04 11:37:00', 'Caloocan City'),
(17, 57, '', 0, '', '2025-01-04 11:42:25', NULL),
(18, 58, '', 0, '', '2025-02-28 14:40:17', NULL),
(19, 59, 'San Francisco, 88 Colin P. Kelly Jr. Street, United States', 912343566, 'githubwe@gmail.com', '2025-03-02 12:50:12', 'Caloocan City');

-- --------------------------------------------------------

--
-- Table structure for table `js_company_info`
--

CREATE TABLE `js_company_info` (
  `company_id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `about_us` text NOT NULL,
  `logo` text DEFAULT NULL,
  `banner` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_company_info`
--

INSERT INTO `js_company_info` (`company_id`, `employer_id`, `company_name`, `about_us`, `logo`, `banner`, `created_at`) VALUES
(31, 41, 'Riot Games', '<h2><strong>Who we are</strong></h2><p>Riot Games was founded in 2006 to develop, publish, and support the most player-focused games in the world. As we went from one game to many, we have expanded to over 4,500 Rioters across more than 20 offices around the world bringing a global perspective to the games we create and the characters in them. From the streets of Piltover to the Radianite labs of Alpha Earth, we are all about making games and serving the people who love them.</p>', 'uploads/logo_67407c2cee8f02.46827300.png', 'uploads/banner_67407c2cf0d2f4.11257937.jpg', '2024-11-22 12:40:16'),
(32, 42, 'Job Company', '<p>Hydrant’s&nbsp;<a href=\"https://www.drinkhydrant.com/pages/about\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--kmt-comp-a-color-base);\">About Us page</a>&nbsp;opens with an inviting image of two people toasting while holding the product in their hands. After reading the copy, one might guess that those hands belong to John and Jai, the company’s two founders.</p><p>The page is broken into three sections, making it easy to digest in chunks. This format is a perfect way to set up your page because it guides the reader slowly down in a way that isn’t overwhelming.</p><p>Each section is designed to hook the reader and bait them into reading a little more. Finally, the page ends with John and Jai’s signature, giving it a personal touch from the founders, who you feel like you can now call friends.</p>', 'uploads/logo_674195394e2de5.63422336.png', 'uploads/banner_674195394e5a48.97187302.png', '2024-11-23 08:41:29'),
(46, 56, 'Wedding Corp', '<p>akjdaskdjksadj lkajskldj aslkjd klamdcoiwdkmaiwjd</p>', 'uploads/logo_677a4077e72248.42142137.png', 'uploads/banner_677a4077e77b08.98478798.jpg', '2025-01-04 11:37:00'),
(47, 57, '', '', NULL, NULL, '2025-01-04 11:42:25'),
(48, 58, '', '', NULL, NULL, '2025-02-28 14:40:17'),
(49, 59, 'GitHub', '<p><span style=\"color: rgb(31, 31, 31);\">GitHub is a proprietary developer platform that allows developers to create, store, manage, and share their code. It uses Git to provide distributed version control and GitHub itself provides access control, bug tracking, software feature requests, task management, continuous integration, and wikis for every project.</span></p>', 'uploads/logo_67c455a47409c1.12276117.png', 'uploads/banner_67c455a4746d19.47886405.jpg', '2025-03-02 12:50:12');

-- --------------------------------------------------------

--
-- Table structure for table `js_declined_schedule`
--

CREATE TABLE `js_declined_schedule` (
  `decline_id` int(11) NOT NULL,
  `interview_id` int(11) NOT NULL,
  `reason` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_declined_schedule`
--

INSERT INTO `js_declined_schedule` (`decline_id`, `interview_id`, `reason`, `created_at`) VALUES
(50, 61, '<p>pa resched po</p>', '2025-02-13 11:18:05');

-- --------------------------------------------------------

--
-- Table structure for table `js_education`
--

CREATE TABLE `js_education` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `degree` varchar(255) NOT NULL,
  `field_of_study` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_education`
--

INSERT INTO `js_education` (`id`, `applicant_id`, `degree`, `field_of_study`, `created_at`) VALUES
(1, 93, 'Bachelor Degree', 'Bachelor of Science in Information Systems', '2025-01-30 14:19:04'),
(2, 77, 'Bachelor Degree', 'Bachelor of Science in Information Systems', '2025-02-18 15:30:52');

-- --------------------------------------------------------

--
-- Table structure for table `js_employer_info`
--

CREATE TABLE `js_employer_info` (
  `employer_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `middlename` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `suffix` varchar(255) NOT NULL,
  `contact` bigint(11) NOT NULL,
  `position` varchar(255) NOT NULL,
  `document_path` text NOT NULL,
  `back_side_path` text NOT NULL,
  `face_path` text NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `verification_code` varchar(255) DEFAULT NULL,
  `email_verified_at` text DEFAULT NULL,
  `decision` varchar(255) NOT NULL,
  `dti_document` varchar(255) DEFAULT NULL,
  `bir_document` varchar(255) DEFAULT NULL,
  `business_permit` varchar(255) DEFAULT NULL,
  `account_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_employer_info`
--

INSERT INTO `js_employer_info` (`employer_id`, `firstname`, `middlename`, `lastname`, `suffix`, `contact`, `position`, `document_path`, `back_side_path`, `face_path`, `email`, `password`, `verification_code`, `email_verified_at`, `decision`, `dti_document`, `bir_document`, `business_permit`, `account_status`, `created_at`) VALUES
(41, 'Ajhay', '', 'Arendayen', '', 9123456789, 'HR', 'uploads/document_67407b9fdab6a.png', 'uploads/back_67407b9fdab70.png', '', 'ajhayarendayen@gmail.com', '$2y$10$BhYHIWCoMsqmIADapYmUweQ.g5dnnkOPeZCKZlwQVouRxBJdfxg1W', '348168', '2025-03-02 20:52:08', 'accept', 'uploads/dti_certificate_67b5da2473a80.pdf', 'uploads/bir_certificate_67b5da2474323.pdf', 'uploads/business_permit_67b5da24748bb.pdf', 'Approved', '2024-11-22 12:40:16'),
(42, 'Christian Dave', '', 'Bernal', '', 9123456789, 'HR', 'uploads/document_67407b9fdab6a.png', 'uploads/back_67407b9fdab70.png', '', 'bernal@gmail.com', '$2y$10$BhYHIWCoMsqmIADapYmUweQ.g5dnnkOPeZCKZlwQVouRxBJdfxg1W', '348168', '2024-11-22 20:40:47', 'accept', NULL, NULL, NULL, 'Approved', '2024-11-22 12:40:16'),
(56, 'Washing Machine', '', 'Washing', '', 9123456789, 'Owner', 'uploads/document_67791d4b6623e.png', 'uploads/back_67791d4b66241.png', '', 'noyise4236@pofmagic.com', '$2y$10$XcD2dD9xcD4GPxEYh.l/wuSLT7bUcAfpbbL0e2Raq6VeV1KmndNeW', '285721', '2025-01-04 19:45:10', 'accept', 'uploads/dti_certificate_67791d4b661bc.pdf', 'uploads/bir_certificate_67791d4b661c1.pdf', 'uploads/business_permit_67791d4b661c2.pdf', 'Approved', '2025-01-04 11:37:00'),
(57, 'Washing Machine', '', 'Washing', '', 9123456789, 'Owner', 'uploads/document_67791e908d0c4.png', 'uploads/back_67791e908d0c6.png', '', 'riot@gmail.com', '$2y$10$VV4lEhgYMfyfVB1WJEMVT.pLNXQavtUKOn9bpTDt2Xf2XTzInDK9q', '472405', '2025-01-04 19:45:10', 'accept', 'uploads/dti_certificate_67791e908d04d.pdf', 'uploads/bir_certificate_67791e908d052.pdf', 'uploads/business_permit_67791e908d053.pdf', 'Rejected', '2025-01-04 11:42:25'),
(58, 'Ajhay', '', 'Arendayen', '', 9123456789, 'Owner', 'uploads/document_67c1cac40753d.png', 'uploads/back_67c1cac40753f.png', 'uploads/face_67c1cac40753e.png', 'me.jobsync@gmail.com', '$2y$10$czInB2cfxZxIPRLg8j1Sguu9liMnRy4QjGOxDoHhSer6lHWBWMyRm', '411168', '2025-02-28 22:40:39', 'accept', 'uploads/dti_certificate_67c1cac4074b3.pdf', 'uploads/bir_certificate_67c1cac4074b8.pdf', 'uploads/business_permit_67c1cac4074b9.pdf', 'Approved', '2025-02-28 14:40:17'),
(59, 'Ajhay', '', 'Arendayen', '', 9123334343, 'Owner', 'uploads/document_67c453e4358db.png', 'uploads/back_67c453e4358de.png', 'uploads/face_67c453e4358dd.png', 'ajhayarendayen123@gmail.com', '$2y$10$eI7eirg57glR31bAsMkND.ef2N0AAyEhXNN2BRRITqrVHGttkc1CW', '134892', '2025-03-02 20:52:08', 'accept', 'uploads/dti_certificate_67c453e435827.pdf', 'uploads/bir_certificate_67c453e43582c.pdf', 'uploads/business_permit_67c453e43582d.pdf', 'Approved', '2025-03-02 12:50:12');

-- --------------------------------------------------------

--
-- Table structure for table `js_employer_notification`
--

CREATE TABLE `js_employer_notification` (
  `notif_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `isRead` int(11) NOT NULL,
  `countRead` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_employer_notification`
--

INSERT INTO `js_employer_notification` (`notif_id`, `job_id`, `application_id`, `message`, `isRead`, `countRead`, `type`, `created_at`) VALUES
(43, 151, 23, 'The applicant has been qualified to proceed to the next phase of the recruitment process for the Programmer position. They are now eligible to schedule their interview.', 0, 1, 'qualified', '2025-02-13 10:51:03'),
(44, 151, 23, 'The applicant has requested to reschedule the interview for the Programmer position.', 0, 1, 'Reschedule', '2025-02-13 11:18:10'),
(45, 151, 23, 'The interview schedule for the Programmer position has been confirmed', 0, 1, 'confirm', '2025-02-13 11:20:03'),
(48, 153, 39, 'The applicant has been qualified to proceed to the next phase of the recruitment process for the Backend Developer position. They are now eligible to schedule their interview.', 0, 1, 'scheduled', '2025-03-03 04:39:10'),
(49, 153, 39, 'The interview schedule for the Backend Developer position has been confirmed', 0, 1, 'confirm', '2025-03-03 04:42:00'),
(56, 159, 48, 'A new applicant has applied for the job: Web Developer.', 0, 1, 'Pending', '2025-03-03 13:06:21'),
(57, 160, 49, 'A new applicant has applied for the job: Web Developer.', 0, 0, 'Pending', '2025-03-05 09:01:44');

-- --------------------------------------------------------

--
-- Table structure for table `js_favorite_jobs`
--

CREATE TABLE `js_favorite_jobs` (
  `favorite_job_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_favorite_jobs`
--

INSERT INTO `js_favorite_jobs` (`favorite_job_id`, `applicant_id`, `job_id`, `added_at`) VALUES
(121, 93, 153, '2024-12-11 08:52:01'),
(127, 77, 151, '2024-12-17 14:12:32'),
(128, 77, 153, '2024-12-18 03:23:16'),
(129, 77, 152, '2024-12-18 04:12:47'),
(132, 98, 159, '2025-02-07 07:26:11'),
(138, 98, 152, '2025-02-10 15:55:54'),
(145, 77, 159, '2025-03-04 03:38:24'),
(146, 77, 160, '2025-03-04 03:38:27');

-- --------------------------------------------------------

--
-- Table structure for table `js_founding_info`
--

CREATE TABLE `js_founding_info` (
  `founding_id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `organization` varchar(255) NOT NULL,
  `industry` varchar(255) NOT NULL,
  `team_size` varchar(255) NOT NULL,
  `year_establishment` varchar(255) NOT NULL,
  `company_website` varchar(255) NOT NULL,
  `company_vision` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_founding_info`
--

INSERT INTO `js_founding_info` (`founding_id`, `employer_id`, `organization`, `industry`, `team_size`, `year_establishment`, `company_website`, `company_vision`, `created_at`) VALUES
(47, 41, 'Public', 'Computer Games', '501-1000 Employees', '2006', 'http://www.riotgames.com', '&lt;p&gt;Foster a thriving ecosystem Our games should be fair, safe, and welcoming for anyone who wants to love them. &lt;/p&gt;&lt;p&gt;We push ourselves to design products and create environments that make it possible.&lt;/p&gt;', '2024-11-22 12:40:16'),
(48, 42, 'Private', 'Computer Games', '51-200 Employees', '2010', 'https://www.facebook.com/', '&lt;p&gt;The Zebra, Lemonade, and Clearcover are three companies in the insurance industry that are paving the way with amazing About Us pages.&lt;/p&gt;', '2024-11-23 08:42:19'),
(62, 56, 'Cooperative', 'Technology', '51-200 Employees', '2007', 'https://www.facebook.com/', '&lt;p&gt;Ahjasjd jasjdh asdjhajshd jhjashd jhasjhd hasnajnxcjal kasndlanc laksndla nclakhdlaksn&lt;/p&gt;', '2025-01-04 11:37:00'),
(63, 57, '', '', '', '', '', '', '2025-01-04 11:42:25'),
(64, 58, '', '', '', '', '', '', '2025-02-28 14:40:17'),
(65, 59, 'Public', 'Technology', '1-10 Employees', '2017', 'https://www.facebook.com/', '&lt;p&gt;&lt;span style=&quot;color: rgb(71, 71, 71);&quot;&gt;A company vision, usually expressed in a company vision statement,&amp;nbsp;&lt;/span&gt;&lt;span style=&quot;color: rgb(4, 12, 40); background-color: rgb(211, 227, 253);&quot;&gt;describes an organization&#039;s aspirational long-term goal&lt;/span&gt;&lt;span style=&quot;color: rgb(71, 71, 71);&quot;&gt;. &lt;/span&gt;&lt;/p&gt;&lt;p&gt;&lt;span style=&quot;color: rgb(71, 71, 71);&quot;&gt;Clearly defining your company vision helps guide decision-making, build your brand, and increase employee engagement.&lt;/span&gt;&lt;/p&gt;', '2025-03-02 12:50:12');

-- --------------------------------------------------------

--
-- Table structure for table `js_interview_schedule`
--

CREATE TABLE `js_interview_schedule` (
  `interview_id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `schedule` text NOT NULL,
  `time` text NOT NULL,
  `message` text NOT NULL,
  `channel_name` text NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_interview_schedule`
--

INSERT INTO `js_interview_schedule` (`interview_id`, `employer_id`, `application_id`, `job_id`, `schedule`, `time`, `message`, `channel_name`, `status`, `created_at`) VALUES
(43, 41, 26, 152, 'January 30, 2025', '7:00 PM', '&lt;p&gt;Dear Bernal Christian Dave,&lt;/p&gt;&lt;p&gt;We are delighted to inform you that Riot Games would like to invite you for an interview for the position you applied for. Please see the details below:&lt;/p&gt;&lt;p&gt;&lt;strong&gt;Company Name:&lt;/strong&gt; &lt;strong&gt;Riot Games&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;&lt;strong&gt;Interview Channel:&lt;/strong&gt; &lt;strong&gt;Riot Games-9l9JCv51El8ydte4WkAnuqaXiY0LNG&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;&lt;strong&gt;Interview Date:&lt;/strong&gt; &lt;strong&gt;January 30, 2025&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;&lt;strong&gt;Interview Time:&lt;/strong&gt; &lt;strong&gt;7:00 PM&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;The interview will be conducted through the &lt;strong&gt;JobSync video conference portal&lt;/strong&gt;. Please ensure you are in a quiet environment with a stable internet connection at the scheduled time.&lt;/p&gt;&lt;p&gt;We look forward to discussing your qualifications and how you can contribute to our team. Should you have any questions or need further information, please feel free to contact us.&lt;/p&gt;&lt;p&gt;Best regards,&lt;/p&gt;&lt;p&gt; HR Assistant&lt;/p&gt;&lt;p&gt; Riot Games&lt;/p&gt;', 'Riot Games-9l9JCv51El8ydte4WkAnuqaXiY0LNG', 'Final Evaluation', '2025-01-26 11:08:37'),
(61, 42, 23, 151, 'March 1, 2025', '7:30 AM', '&lt;h2&gt;&lt;strong&gt;Interview Invitation for Ricky James Molina&lt;/strong&gt;&lt;/h2&gt;&lt;p&gt;Dear Ricky James Molina,&lt;/p&gt;&lt;p&gt;We are pleased to invite you to an interview with &lt;strong&gt;Job Company&lt;/strong&gt; for the position you applied for. Details of the interview are as follows:&lt;/p&gt;&lt;ul&gt;&lt;li&gt;&lt;strong&gt;Company Name:&lt;/strong&gt; Job Company&lt;/li&gt;&lt;li&gt;&lt;strong&gt;Interview Channel Name:&lt;/strong&gt; Job Company-emZZ7AUqy4mXKMKpqlA5YXlqlS2BgS&lt;/li&gt;&lt;li&gt;&lt;strong&gt;Interview Date:&lt;/strong&gt; &lt;strong&gt;March 1, 2025&lt;/strong&gt;&lt;/li&gt;&lt;li&gt;&lt;strong&gt;Interview Time:&lt;/strong&gt; &lt;strong&gt;7:30 AM&lt;/strong&gt;&lt;/li&gt;&lt;/ul&gt;&lt;p&gt;The interview will be conducted in the &lt;strong&gt;JobSync video conference portal&lt;/strong&gt;. Please make sure you are in a quiet environment with a stable internet connection at the scheduled time.&lt;/p&gt;&lt;p&gt;We look forward to discussing your qualifications further and getting to know you better during the interview.&lt;/p&gt;&lt;p&gt;If you have any questions or need further information, please feel free to contact us.&lt;/p&gt;&lt;p&gt;Best regards,&lt;/p&gt;&lt;p&gt;HR Assistant&lt;/p&gt;&lt;p&gt;Job Company&lt;/p&gt;', 'Job Company-emZZ7AUqy4mXKMKpqlA5YXlqlS2BgS', 'Confirmed', '2025-02-13 11:05:27'),
(63, 41, 39, 153, 'March 29, 2025', '1:40 PM', '&lt;p&gt;&lt;strong&gt;Interview Invitation from Riot Games&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;&lt;br&gt;&lt;/p&gt;&lt;p&gt;Dear Ajhay Arendayen,&lt;/p&gt;&lt;p&gt;&lt;br&gt;&lt;/p&gt;&lt;p&gt;We are pleased to invite you to an interview with &lt;strong&gt;Riot Games&lt;/strong&gt; for the position you have applied for. Please find the details of your upcoming interview below:&lt;/p&gt;&lt;p&gt;&lt;br&gt;&lt;/p&gt;&lt;p&gt;&lt;strong&gt;Company Name:&lt;/strong&gt; Riot Games&lt;/p&gt;&lt;p&gt;&lt;strong&gt;Interview Date:&lt;/strong&gt; &lt;strong&gt;March 29, 2025&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;&lt;strong&gt;Interview Time:&lt;/strong&gt; &lt;strong&gt;1:40 PM&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;&lt;br&gt;&lt;/p&gt;&lt;p&gt;The interview will be conducted through the &lt;strong&gt;JobSync video conference portal&lt;/strong&gt;. Please make sure you are in a quiet environment with a stable internet connection at the scheduled time.&lt;/p&gt;&lt;p&gt;&lt;br&gt;&lt;/p&gt;&lt;p&gt;If you have any questions or need to reschedule, please feel free to contact us.&lt;/p&gt;&lt;p&gt;&lt;br&gt;&lt;/p&gt;&lt;p&gt;We look forward to speaking with you and wish you the best of luck for your interview!&lt;/p&gt;&lt;p&gt;&lt;br&gt;&lt;/p&gt;&lt;p&gt;Best regards,&lt;/p&gt;&lt;p&gt;HR Team&lt;/p&gt;', 'Riot Games-IyqYRWNvyjVJZ1Zb9TO3YJ1UXFALwG', 'Final Evaluation', '2025-03-03 04:41:04');

-- --------------------------------------------------------

--
-- Table structure for table `js_interview_status`
--

CREATE TABLE `js_interview_status` (
  `status_id` int(11) NOT NULL,
  `interview_id` int(11) NOT NULL,
  `banner` text NOT NULL,
  `messages` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_interview_status`
--

INSERT INTO `js_interview_status` (`status_id`, `interview_id`, `banner`, `messages`, `created_at`) VALUES
(2, 43, 'uploads/preview/preview.png', 'Thank you for confirming your interview schedule with Riot Games. We look forward to meeting you on January 30, 2025, at 7:00 PM. Please ensure that you are prepared and join the interview on time. Should you have any questions or require further assistance, feel free to contact us.', '2025-01-27 03:01:29'),
(9, 61, 'uploads/preview/preview.png', 'Thank you for confirming your interview schedule with Job Company. We look forward to meeting you on March 1, 2025, at 7:30 AM. Please ensure that you are prepared and join the interview on time. Should you have any questions or require further assistance, feel free to contact us.', '2025-02-13 11:20:03'),
(10, 63, 'uploads/preview/preview.png', 'Thank you for confirming your interview schedule with Riot Games. We look forward to meeting you on March 29, 2025, at 1:40 PM. Please ensure that you are prepared and join the interview on time. Should you have any questions or require further assistance, feel free to contact us.', '2025-03-03 04:42:00');

-- --------------------------------------------------------

--
-- Table structure for table `js_job_alert`
--

CREATE TABLE `js_job_alert` (
  `alert_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_job_alert`
--

INSERT INTO `js_job_alert` (`alert_id`, `job_id`, `status`, `created_at`, `is_read`) VALUES
(6, 153, 'Old', '2024-12-13 14:30:48', 1),
(7, 151, 'Old', '2024-12-16 14:47:42', 1),
(8, 152, 'Old', '2024-12-16 14:47:42', 1),
(9, 154, 'Old', '2024-12-16 15:18:15', 1),
(10, 155, 'Old', '2024-12-18 06:20:21', 1),
(11, 156, 'Old', '2024-12-18 06:24:33', 1),
(12, 157, 'Old', '2024-12-18 06:26:31', 1),
(13, 158, 'Old', '2025-02-01 10:32:24', 1),
(14, 159, 'Old', '2025-02-04 06:32:41', 1),
(15, 160, 'Old', '2025-02-04 06:34:38', 1),
(16, 161, 'Old', '2025-02-12 13:58:39', 1);

-- --------------------------------------------------------

--
-- Table structure for table `js_job_applicant_matches`
--

CREATE TABLE `js_job_applicant_matches` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `match_score` float NOT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_job_applicant_matches`
--

INSERT INTO `js_job_applicant_matches` (`id`, `applicant_id`, `job_id`, `match_score`, `last_updated`) VALUES
(1391, 77, 153, 0.9, '2025-03-05 07:21:28'),
(1393, 77, 159, 0.8, '2025-03-05 07:21:29'),
(1395, 77, 160, 0.8, '2025-03-05 07:21:29'),
(1397, 77, 151, 0.7, '2025-03-05 07:21:29');

-- --------------------------------------------------------

--
-- Table structure for table `js_job_match_alerts`
--

CREATE TABLE `js_job_match_alerts` (
  `alert_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `is_read` int(11) NOT NULL,
  `matched_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_job_match_alerts`
--

INSERT INTO `js_job_match_alerts` (`alert_id`, `applicant_id`, `job_id`, `status`, `is_read`, `matched_at`) VALUES
(1, 77, 159, 'New', 1, '2025-02-25 02:59:16'),
(2, 93, 159, 'New', 0, '2025-02-25 02:59:24'),
(3, 98, 159, 'New', 0, '2025-02-25 02:59:31'),
(4, 77, 153, 'New', 1, '2025-02-28 15:27:08'),
(5, 93, 153, 'New', 0, '2025-02-28 15:27:14'),
(6, 98, 153, 'New', 0, '2025-02-28 15:27:19');

-- --------------------------------------------------------

--
-- Table structure for table `js_join_request`
--

CREATE TABLE `js_join_request` (
  `request_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `channel_name` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected','cancel') DEFAULT 'pending',
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `approved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `js_join_request`
--
DELIMITER $$
CREATE TRIGGER `before_status_update` BEFORE UPDATE ON `js_join_request` FOR EACH ROW BEGIN
    IF NEW.status = 'approved' THEN
        SET NEW.approved_at = NOW();
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `js_languages`
--

CREATE TABLE `js_languages` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `language` varchar(255) NOT NULL,
  `proficiency` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_languages`
--

INSERT INTO `js_languages` (`id`, `applicant_id`, `language`, `proficiency`, `created_at`) VALUES
(1, 77, 'English', 'Filipino', '2025-02-18 15:34:06'),
(2, 77, 'Filipino', 'English', '2025-02-18 15:36:07');

-- --------------------------------------------------------

--
-- Table structure for table `js_licenses`
--

CREATE TABLE `js_licenses` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `license_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `js_notification`
--

CREATE TABLE `js_notification` (
  `notification_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `job_id` int(10) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `isRead` int(1) NOT NULL,
  `countRead` int(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_notification`
--

INSERT INTO `js_notification` (`notification_id`, `application_id`, `job_id`, `type`, `message`, `isRead`, `countRead`, `created_at`) VALUES
(130, 26, 152, '', 'You have received an assessment for the Programmer role.', 0, 1, '2025-01-16 05:06:01'),
(139, 23, 151, '', 'You have received an assessment for the Programmer role.', 0, 1, '2025-01-16 09:30:30'),
(162, 26, 152, '', 'Congratulations! You have successfully qualified for the next step. We look forward to your continued success!', 0, 1, '2025-01-22 15:42:58'),
(201, 26, 152, 'interview', 'Your interview has been successfully scheduled. Kindly make a note of this for your reference.', 0, 1, '2025-01-26 11:08:59'),
(202, 26, 152, 'confirm', 'Thank you for confirming your interview schedule with Riot Games', 0, 1, '2025-01-27 03:01:29'),
(248, 23, 151, '', 'Congratulations! You have successfully qualified for the next step. We look forward to your continued success!', 0, 1, '2025-02-13 10:51:03'),
(251, 23, 151, 'interview', 'Your interview has been successfully scheduled. Kindly make a note of this for your reference.', 0, 1, '2025-02-13 11:19:43'),
(252, 23, 151, 'confirm', 'Thank you for confirming your interview schedule with Job Company', 0, 1, '2025-02-13 11:20:03'),
(260, 39, 153, '', 'You have received an assessment for the  role.', 0, 1, '2025-03-03 04:38:39'),
(261, 39, 153, '', 'Congratulations! You have successfully qualified for the next step. We look forward to your continued success!', 0, 1, '2025-03-03 04:39:10'),
(262, 39, 153, 'interview', 'Your interview has been successfully scheduled. Kindly make a note of this for your reference.', 0, 1, '2025-03-03 04:41:09'),
(263, 39, 153, 'confirm', 'Thank you for confirming your interview schedule with Riot Games', 0, 1, '2025-03-03 04:42:00'),
(266, 48, 159, '', 'You have received an assessment for the  role.', 0, 1, '2025-03-03 16:38:53'),
(272, 26, 152, 'final', 'Your application is now in the Final Evaluation stage.', 0, 0, '2025-03-04 03:14:29'),
(273, 39, 153, 'final', 'Your application is now in the Final Evaluation stage.', 0, 1, '2025-03-04 03:17:35');

-- --------------------------------------------------------

--
-- Table structure for table `js_personal_info`
--

CREATE TABLE `js_personal_info` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `headline` varchar(255) NOT NULL,
  `birthday` varchar(255) NOT NULL,
  `birthplace` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `postal` varchar(255) NOT NULL,
  `status` varchar(223) NOT NULL,
  `experience` varchar(255) NOT NULL,
  `attainment` varchar(255) NOT NULL,
  `biography` text NOT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_personal_info`
--

INSERT INTO `js_personal_info` (`id`, `applicant_id`, `headline`, `birthday`, `birthplace`, `address`, `city`, `barangay`, `postal`, `status`, `experience`, `attainment`, `biography`, `nationality`, `created_at`, `updated_at`) VALUES
(46, 77, 'Backend Developer', '2003-01-13', 'Bagong Silang', 'Ph9, Pkg6, Blk10, Lot4', 'Caloocan City', 'Barangay 176', '1428', 'Single', 'Mid level', 'Bachelor Degree', '<p>A backend developer is the unsung hero of the tech world, responsible for ensuring that the digital experiences we enjoy daily run smoothly and securely. Working behind the scenes, they focus on building and maintaining the server-side of web applications, databases, and APIs that drive the functionality of websites and apps.</p><p>Most backend developers share a common thread in their stories—an early fascination with technology and problem-solving. Whether it’s tinkering with computers, exploring programming during their school days, or developing small scripts and tools out of curiosity, their journey often starts with a spark of technical creativity.</p><p>Backend developers usually pursue formal education in computer science, software engineering, or a related field. However, many self-taught professionals have entered the field by mastering essential skills such as programming languages like Python, PHP, Java, Ruby, or Node.js, and learning database management systems like MySQL, MongoDB, or PostgreSQL. Frameworks and tools such as Django, Laravel, and Express.js are also staples of their skillset.</p><p>The career path of a backend developer often begins with roles like junior developer or system administrator. Over time, they grow into positions with more responsibilities, such as full-stack developer, backend engineer, or DevOps specialist. Their expertise in optimizing server performance, ensuring data security, and implementing efficient algorithms makes them indispensable in software development teams.</p><p>Backend developers contribute to creating scalable, reliable, and secure systems. They enable seamless user experiences by ensuring that data flows smoothly between the frontend (what users see) and the backend (where logic and operations happen). Their work is pivotal in industries ranging from e-commerce to healthcare and entertainment, making life easier for millions of users worldwide.</p>', 'Filipino', '2024-11-24 16:44:12', '2024-11-24 15:44:12'),
(60, 93, 'Mobile App Developer', '2002-12-30', 'Manila City', 'Ph9, Pkg6, Blk10, Lot4', 'Caloocan City', 'Barangay 167', '1429', 'single', 'Entry level', 'Bachelor Degree', '<p>asdasdassdasd</p>', 'Filipino', '2024-12-08 19:22:55', '2024-12-08 11:22:55'),
(65, 98, 'Frontend Developer', '2004-01-02', 'Bagong Silang Caloocan City', 'Ph9, Pkg6, Blk10, Lot4', 'Caloocan City', 'Barangay 165', '1429', 'Single', 'Entry level', 'Bachelor Degree', '<p>A backend developer is the unsung hero of the tech world, responsible for ensuring that the digital experiences we enjoy daily run smoothly and securely. Working behind the scenes, they focus on building and maintaining the server-side of web applications, databases, and APIs that drive the functionality of websites and apps. Most backend developers share a common thread in their stories—an early fascination with technology and problem-solving. Whether it’s tinkering with computers, exploring programming during their school days, or developing small scripts and tools out of curiosity, their journey often starts with a spark of technical creativity.Backend developers usually pursue formal education in computer science, software engineering, or a related field. However, many self-taught professionals have entered the field by mastering essential skills such as programming languages like Python, PHP, Java, Ruby, or Node.js, and learning database management systems like MySQL, MongoDB, or PostgreSQL. Frameworks and tools such as Django, Laravel, and Express.js are also staples of their skillset. </p>', 'Filipino', '2024-12-15 19:47:36', '2024-12-15 11:47:36'),
(86, 119, '', '', '', '', '', '', '', '', '', '', '', NULL, '2025-03-04 18:36:10', '2025-03-04 17:36:10');

-- --------------------------------------------------------

--
-- Table structure for table `js_post_jobs`
--

CREATE TABLE `js_post_jobs` (
  `job_id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `jobTitle` varchar(255) NOT NULL,
  `jobTags` varchar(255) NOT NULL,
  `jobRole` varchar(255) NOT NULL,
  `minSalary` varchar(255) NOT NULL,
  `maxSalary` varchar(255) NOT NULL,
  `salaryType` varchar(255) NOT NULL,
  `education` varchar(255) NOT NULL,
  `experience` varchar(255) NOT NULL,
  `jobType` varchar(255) NOT NULL,
  `expirationDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `jobLevel` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `selectedBenefits` text NOT NULL,
  `jobDescription` text NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_post_jobs`
--

INSERT INTO `js_post_jobs` (`job_id`, `employer_id`, `jobTitle`, `jobTags`, `jobRole`, `minSalary`, `maxSalary`, `salaryType`, `education`, `experience`, `jobType`, `expirationDate`, `jobLevel`, `address`, `city`, `selectedBenefits`, `jobDescription`, `status`, `created_at`, `updated_at`) VALUES
(151, 42, 'Programmer', 'Programmer, Developer', 'Backend', '25,000', '45,000', 'Monthly', 'Bachelor Degree', '3 years - 4 years', 'Part-time', '2025-04-04 16:00:00', 'Mid Level', 'Ph9, Pkg6, Blk10, Lot4', 'Caloocan City', 'Work from Home,Bonuses,401(k),Paid Time Off,Health Insurance,Stock Options,Retirement Plans', '<p>A computer programmer job is to&nbsp;write, test, and modify code to create and maintain computer software and applications:&nbsp;</p><ul><li><strong>Writing code</strong></li><li>Programmers write code in a variety of languages, such as C++ and Java, to turn designs into instructions that computers can follow.&nbsp;</li><li><strong>Testing</strong></li><li>Programmers test new software and applications to ensure they produce the expected results.&nbsp;They also write unit tests to confirm that small portions of code function as intended.&nbsp;</li><li><strong>Updating programs</strong></li><li>Programmers update existing programs to fix bugs or improve functionality.&nbsp;</li><li><strong>Debugging</strong></li><li>Programmers identify and correct coding errors that cause programs to malfunction.&nbsp;</li><li><strong>Security</strong></li><li>Programmers develop security systems and procedures to protect users from hacks and programs from viruses.&nbsp;</li><li><strong>Documentation</strong></li><li>Programmers prepare reports, manuals, and other documentation on the status, operation, and maintenance of software.&nbsp;</li><li><strong>Training</strong></li><li>Programmers train new users to use updated programs or hardware.&nbsp;</li><li><strong>Collaboration</strong></li><li>Programmers work closely with software developers and may take on some of their tasks, such as designing programs.&nbsp;</li></ul><p>Programmers should have excellent critical thinking and problem-solving skills, as well as strong organizational skills and attention to detail.&nbsp;They should also be able to work under short deadlines and meet production schedules.&nbsp;Most programmers have a bachelor degree in computer science or a related subject.</p>', 'Active', '2025-02-23 06:10:36', '2024-12-17 05:28:04'),
(152, 41, 'Programmer', 'Programmer, Developer', 'Backend', '25,000', '45,000', 'Monthly', 'Bachelor Degree', '3 years - 4 years', 'Part-time', '2025-02-28 16:00:00', 'Manager Level', 'Ph9, Pkg6, Blk10, Lot4 Bagong Silang Caloocan City', 'Caloocan City', 'Stock Options,Health Insurance,Paid Time Off,Retirement Plans,Child Care,401(k),Bonuses,Work from Home', '<p>A computer programmer job is to&nbsp;write, test, and modify code to create and maintain computer software and applications:&nbsp;</p><ul><li><strong>Writing code</strong></li><li>Programmers write code in a variety of languages, such as C++ and Java, to turn designs into instructions that computers can follow.&nbsp;</li><li><strong>Testing</strong></li><li>Programmers test new software and applications to ensure they produce the expected results.&nbsp;They also write unit tests to confirm that small portions of code function as intended.&nbsp;</li><li><strong>Updating programs</strong></li><li>Programmers update existing programs to fix bugs or improve functionality.&nbsp;</li><li><strong>Debugging</strong></li><li>Programmers identify and correct coding errors that cause programs to malfunction.&nbsp;</li><li><strong>Security</strong></li><li>Programmers develop security systems and procedures to protect users from hacks and programs from viruses.&nbsp;</li><li><strong>Documentation</strong></li><li>Programmers prepare reports, manuals, and other documentation on the status, operation, and maintenance of software.&nbsp;</li><li><strong>Training</strong></li><li>Programmers train new users to use updated programs or hardware.&nbsp;</li><li><strong>Collaboration</strong></li><li>Programmers work closely with software developers and may take on some of their tasks, such as designing programs.&nbsp;</li></ul><p>Programmers should have excellent critical thinking and problem-solving skills, as well as strong organizational skills and attention to detail.&nbsp;They should also be able to work under short deadlines and meet production schedules.&nbsp;Most programmers have a bachelor degree in computer science or a related subject.</p>', 'Expired', '2025-02-07 06:57:54', NULL),
(153, 41, 'Backend Developer', 'Programmer, Developer', 'Backend', '25,000', '45,000', 'Monthly', 'Bachelor Degree', '3 years - 4 years', 'Part-time', '2025-04-04 16:00:00', 'Mid Level', 'Ph9, Pkg6, Blk10, Lot4 Bagong Silang Caloocan City', 'Caloocan City', 'Health Insurance,Stock Options,Retirement Plans,Paid Time Off,401(k),Bonuses,Work from Home,Dental Insurance,Life Insurance', '<p>A backend developer is&nbsp;responsible for the server-side components of web applications.&nbsp;Their responsibilities include:&nbsp;</p><ul><li><strong>Developing APIs</strong>:&nbsp;Creating server-side APIs&nbsp;</li><li><strong>Database operations</strong>:&nbsp;Handling database operations, including optimizing queries, ensuring data consistency, and managing large datasets&nbsp;</li><li><strong>Traffic management</strong>:&nbsp;Ensuring the backend can efficiently manage high traffic volumes&nbsp;</li></ul><p>Some skills and responsibilities of a backend developer include:</p><ul><li><strong>Programming languages</strong>:&nbsp;Being proficient in at least one server-side programming language, such as Python, Java, Ruby, or Node.js&nbsp;</li><li><strong>Version control systems</strong>:&nbsp;Using version control systems to track changes, revert to earlier versions, and safeguard source code&nbsp;</li><li><strong>Problem solving</strong>:&nbsp;Being able to come up with creative solutions to issues that arise&nbsp;</li><li><strong>Communication</strong>:&nbsp;Being able to effectively communicate in a team environment&nbsp;</li><li><strong>Database management systems (DBMS)</strong>:&nbsp;Using DBMS to ensure data integrity, security, and performance&nbsp;</li><li><strong>Adaptability to emerging technologies</strong>:&nbsp;Being aware of new technologies and being able to quickly identify, locate, and correct errors</li></ul><p><br></p>', 'Active', '2025-02-28 08:25:37', NULL),
(154, 41, 'UI-UX Designer', 'Programmer, Developer', 'Backend', '25,000', '60,000', 'Monthly', 'Bachelor Degree', '3 years - 4 years', 'Temporary', '2025-03-04 16:00:00', 'Senior Level', 'Ph9, Pkg6, Blk10, Lot4', 'Caloocan City', 'Health Insurance,Paid Time Off,Bonuses,Gym Membership,Work from Home,Dental Insurance,Child Care,Retirement Plans', '<p>A UI/UX designer&nbsp;creates user-centered designs for digital products, such as websites, mobile apps, and software interfaces.&nbsp;Their responsibilities include:&nbsp;</p><ul><li><strong>Gathering user requirements</strong>:&nbsp;Collaborating with product managers to understand user needs&nbsp;</li><li><strong>Illustrating design ideas</strong>:&nbsp;Using storyboards, process flows, or sitemaps to communicate design concepts&nbsp;</li><li><strong>Designing user interface elements</strong>:&nbsp;Creating graphic elements like menus, tabs, and widgets&nbsp;</li><li><strong>Improving user satisfaction</strong>:&nbsp;Enhancing the accessibility, efficiency, and aesthetics of the product&nbsp;</li><li><strong>Creating prototypes</strong>:&nbsp;Working with teams to create high-fidelity screens and prototypes&nbsp;</li><li><strong>Performing user testing</strong>:&nbsp;Testing the product to ensure it enjoyable and easy to use&nbsp;</li></ul><p>Some skills that are useful for UI/UX designers include:</p><ul><li>Prototyping, wireframing, user flows, and mockups</li><li>Visual design and design software</li><li>User research and usability testing</li><li>Agile</li><li>Information architecture</li><li>Application development</li><li>Collaboration</li><li>Communication and presentation&nbsp;</li></ul><p><br></p>', 'Expired', '2025-02-07 06:58:02', NULL),
(155, 42, 'Engineering Director', 'Engineer', 'Director', '70,000', '120,000', 'Monthly', 'Master Degree', '3 years - 4 years', 'Full-time', '2025-02-27 16:00:00', 'Director Level', 'Ph9, Pkg6, Blk10, Lot4', 'Caloocan City', 'Health Insurance,Paid Time Off,401(k),Bonuses,Paid Holidays,Employee Assistance Program,Disability Insurance', '<p>An engineering director, also known as the head of engineering or vice president of engineering, is&nbsp;a leader who manages the engineering department of a company.&nbsp;They are responsible for the strategic direction of the department, ensuring that engineering projects align with business goals, and that the department is running efficiently.&nbsp;</p><p><br></p><p>Some of the responsibilities of an engineering director include:</p><ul><li><strong>Developing strategies</strong>:&nbsp;Creating and implementing strategies that drive the company growth and success&nbsp;</li><li><strong>Managing budgets</strong>:&nbsp;Overseeing the department budget and cost estimations&nbsp;</li><li><strong>Hiring and training</strong>:&nbsp;Hiring and training new team members, including engineering managers&nbsp;</li><li><strong>Managing projects</strong>:&nbsp;Overseeing the development of new products and managing technical projects&nbsp;</li><li><strong>Ensuring compliance</strong>:&nbsp;Verifying that projects comply with engineering best practices&nbsp;</li><li><strong>Collaborating</strong>:&nbsp;Working with company stakeholders to promote the success of the department&nbsp;</li><li><strong>Updating policies</strong>:&nbsp;Updating department policies and procedures&nbsp;</li></ul><p>The role of an engineering director can vary depending on the employer and the individual engineering specialty.&nbsp;For example, a director who specializes in structural engineering might analyze proposed project plans to ensure they meet safety standards.</p>', 'Expired', '2025-01-30 08:27:10', NULL),
(156, 41, 'Maintenance Engineer', 'Engineering', 'Maintenance planning, Equipment repair', '60,000', '100,000', 'Monthly', 'Bachelor Degree', '3 years - 4 years', 'Contract', '2025-02-27 16:00:00', 'Mid Level', 'Ph9, Pkg6, Blk10, Lot4 Bagong Silang Caloocan City', 'Manila City', 'Paid Time Off,Health Insurance,Stock Options,Retirement Plans,Child Care,Dental Insurance,Life Insurance,Flexible Hours', '<p>A maintenance engineer job is to&nbsp;ensure that equipment and processes run smoothly and reliably, and that a business machinery is safe and efficient:&nbsp;</p><ul><li><strong>Maintenance planning</strong>:&nbsp;Design and implement maintenance strategies and procedures&nbsp;</li><li><strong>Equipment maintenance</strong>:&nbsp;Perform scheduled maintenance, respond to breakdowns, and diagnose faults&nbsp;</li><li><strong>Equipment repair</strong>:&nbsp;Fit new parts, repair equipment, and test repairs&nbsp;</li><li><strong>Quality assurance</strong>:&nbsp;Perform quality inspections to ensure compliance with health and safety regulations&nbsp;</li><li><strong>Communication</strong>:&nbsp;Liaise with clients, customers, and other engineering and production colleagues&nbsp;</li><li><strong>Cost management</strong>:&nbsp;Monitor and control maintenance costs&nbsp;</li><li><strong>Emergency response</strong>:&nbsp;Deal with emergencies, unplanned problems, and repairs&nbsp;</li><li><strong>Safety</strong>:&nbsp;Improve health and safety policies and procedures&nbsp;</li><li><strong>Equipment installation</strong>:&nbsp;Install new equipment and perform checks and tests to ensure it working properly&nbsp;</li></ul><p>Maintenance engineers may work in a specific area or line, or across an entire site.&nbsp;They often work with maintenance technicians, who carry out the practical work.</p>', 'Expired', '2025-01-30 08:26:28', NULL),
(157, 42, 'Accountants', 'Accountants', 'Analyzing financial data', '25,000', '50,000', 'Monthly', 'Bachelor Degree', '1 year - 2 years', 'Full-time', '2025-03-27 16:00:00', 'Entry Level', 'Ph9, Pkg6, Blk10, Lot4 Bagong Silang Caloocan City', 'Caloocan City', 'Health Insurance,Paid Time Off,Gym Membership,Flexible Hours,Life Insurance,Dental Insurance', '<p>An accountant job is to&nbsp;analyze financial data, prepare financial statements, and provide financial advice to help an organization run efficiently.&nbsp;Their responsibilities include:&nbsp;</p><ul><li><strong>Analyzing financial data</strong>:&nbsp;Accountants analyze financial data to identify areas of risk and opportunity.&nbsp;</li><li><strong>Preparing financial statements</strong>:&nbsp;Accountants prepare financial statements, budgets, forecasts, and reports.&nbsp;</li><li><strong>Recommending financial actions</strong>:&nbsp;Accountants recommend financial actions based on their analysis.&nbsp;</li><li><strong>Ensuring accuracy</strong>:&nbsp;Accountants ensure that financial records are accurate and comply with state and federal laws.&nbsp;</li><li><strong>Managing accounting processes</strong>:&nbsp;Accountants manage accounting processes, including reconciling accounts, recording expenses, and recording disbursements and payments.&nbsp;</li><li><strong>Providing financial advice</strong>:&nbsp;Accountants provide financial advice to clients, including individuals, small businesses, governmental bodies, and multinational organizations.&nbsp;</li></ul><p><br></p>', 'Active', '2025-02-23 06:32:05', NULL),
(158, 42, 'Backend Developer', 'Programmer, Developer', 'Backend', '25,000', '45,000', 'Monthly', 'Bachelor Degree', '3 years - 4 years', 'Part-time', '2025-02-27 08:00:00', 'Mid Level', 'Ph9, Pkg6, Blk10, Lot4 Bagong Silang', 'Caloocan City', 'Health Insurance,Stock Options,Retirement Plans,Life Insurance,Child Care,Dental Insurance', '<p>We are looking for a skilled <strong>Backend Developer</strong> to join our growing team. You will be responsible for designing, developing, and maintaining the backend systems that power our applications. Your work will ensure high performance, security, and scalability while collaborating closely with frontend developers, DevOps, and other team members.</p><h3><strong>Key Responsibilities:</strong></h3><ul><li>Develop, test, and maintain server-side applications, APIs, and databases.</li><li>Optimize backend architecture for performance, scalability, and security.</li><li>Collaborate with frontend developers to integrate user-facing elements with server-side logic.</li><li>Write clean, efficient, and well-documented code following best practices.</li><li>Implement and maintain database structures, ensuring data integrity and efficiency.</li><li>Troubleshoot, debug, and resolve backend issues as they arise.</li><li>Work with DevOps teams to deploy and maintain applications in cloud environments.</li><li>Stay updated with emerging technologies and contribute to technical discussions.</li></ul><h3><strong>Requirements:</strong></h3><ul><li><strong>Experience:</strong> [X+] years of experience in backend development.</li><li><strong>Languages &amp; Frameworks:</strong> Proficiency in [e.g., Node.js, Python, Java, Ruby, PHP, .NET, etc.].</li><li><strong>Databases:</strong> Experience with relational (e.g., PostgreSQL, MySQL) and/or NoSQL databases (e.g., MongoDB, Redis).</li><li><strong>API Development:</strong> Strong understanding of RESTful APIs and/or GraphQL.</li><li><strong>Cloud &amp; DevOps:</strong> Familiarity with AWS, Azure, Google Cloud, Docker, Kubernetes, CI/CD pipelines.</li><li><strong>Security &amp; Performance:</strong> Knowledge of authentication, authorization, data encryption, and backend performance optimization.</li><li><strong>Version Control:</strong> Experience with Git and collaborative development workflows.</li><li><strong>Soft Skills:</strong> Strong problem-solving skills, teamwork, and the ability to work in an agile environment.</li></ul><h3><strong>Benefits &amp; Perks:</strong></h3><ul><li>Competitive salary and performance-based bonuses.</li><li>Flexible working hours and remote work options.</li><li>Health insurance and wellness programs.</li><li>Learning and development opportunities.</li><li>Fun team events and an inclusive company culture.</li></ul><p><br></p>', 'Expired', '2025-02-01 10:32:24', NULL),
(159, 41, 'Web Developer', 'Programmer, Developer', 'Front End', '25,000', '60,000', 'Monthly', 'Bachelor Degree', '3 years - 4 years', 'Full-time', '2025-03-28 16:00:00', 'Mid Level', '11F, One Ayala West Tower, Ayala Avenue, corner Edsa, Makati, 1223 Metro Manila', 'Manila City', 'Pet Insurance,Commuter Benefits,Stock Options,Retirement Plans,Child Care,Dental Insurance,Tuition Reimbursement,Disability Insurance,Mental Health Days', '<p>A web developer job is to&nbsp;design, code, and maintain websites.&nbsp;They ensure that websites are functional, user-friendly, and aesthetically pleasing.&nbsp;</p><p><br></p><p>Responsibilities&nbsp;</p><ul><li><strong>Design</strong>:&nbsp;Create the layout, navigation, and user interface for a website</li><li><strong>Code</strong>:&nbsp;Write and review code for the website, often using HTML, JavaScript, or XML</li><li><strong>Test</strong>:&nbsp;Test the website functionality and performance</li><li><strong>Troubleshoot</strong>:&nbsp;Identify and fix issues with the website performance or user experience</li><li><strong>Integrate content</strong>:&nbsp;Add multimedia content to the website</li><li><strong>Create content</strong>:&nbsp;Write content for the website</li></ul><p>Skills&nbsp;</p><ul><li>Strong understanding of design and usability</li><li>Proficiency in HTML, JavaScript, and CSS</li><li>Knowledge of programming languages and technical terminology</li><li>Ability to solve complex problems</li><li>Good communication skills</li><li>Ability to work well in a fast-paced environment</li></ul><p>Education&nbsp;</p><ul><li>A bachelor degree in computer science, information technology, or a related field</li><li>Relevant experience</li><li>Online courses or bootcamps</li></ul><p><br></p>', 'Active', '2025-02-24 19:54:43', NULL),
(160, 42, 'Web Developer', 'Designer', 'Front-End', '25,000', '60,000', 'Monthly', 'Bachelor Degree', '5 years - 6 years', 'Contract', '2025-03-25 16:00:00', 'Mid Level', '11F, One Ayala West Tower, Metro Manila', 'Manila City', 'Mental Health Days,Health Insurance,Paid Time Off,401(k),Bonuses,Work from Home,Paid Holidays', '<p>A web developer job is to&nbsp;design, code, and maintain websites.&nbsp;They ensure that websites are functional, user-friendly, and aesthetically pleasing.&nbsp;</p><p><br></p><p>Responsibilities&nbsp;</p><ul><li><strong>Design</strong>:&nbsp;Create the layout, navigation, and user interface for a website</li><li><strong>Code</strong>:&nbsp;Write and review code for the website, often using HTML, JavaScript, or XML</li><li><strong>Test</strong>:&nbsp;Test the website functionality and performance</li><li><strong>Troubleshoot</strong>:&nbsp;Identify and fix issues with the website performance or user experience</li><li><strong>Integrate content</strong>:&nbsp;Add multimedia content to the website</li><li><strong>Create content</strong>:&nbsp;Write content for the website</li></ul><p>Skills&nbsp;</p><ul><li>Strong understanding of design and usability</li><li>Proficiency in HTML, JavaScript, and CSS</li><li>Knowledge of programming languages and technical terminology</li><li>Ability to solve complex problems</li><li>Good communication skills</li><li>Ability to work well in a fast-paced environment</li></ul><p>Education&nbsp;</p><ul><li>A bachelor degree in computer science, information technology, or a related field</li><li>Relevant experience</li><li>Online courses or bootcamps</li></ul>', 'Active', '2025-02-23 06:47:07', NULL),
(161, 42, 'Web Developer', 'Web Development, Programming', 'Frontend Developer', '25,000', '100,000', 'Monthly', 'Bachelor Degree', '1 year - 2 years', 'Full-time', '2025-02-28 08:00:00', 'Entry Level', '261 Delfina Bldg. 10th Ave. cor. Baltazar St', 'Pasig City', 'Health Insurance,Paid Time Off,Child Care,Paid time off & Holidays,Competitive Salary', '<p># Job Title: Frontend Web Developer</p><p><br></p><p> ## Job Summary:</p><p> We are seeking a talented Frontend Web Developer to join our team and help us develop dynamic and user-friendly websites. The ideal candidate will have a strong background in front-end web development and design, with a focus on creating visually appealing and engaging user interfaces. You will work closely with our design and backend development teams to bring our projects to life and ensure seamless user experiences across all platforms.</p><p><br></p><p> ## <strong>Responsibilities:</strong></p><p> - Develop responsive websites and web applications using HTML, CSS, and JavaScript frameworks (e.g., React, Angular, Vue.js)</p><p> - Collaborate with UI/UX designers to implement user-friendly interfaces and designs</p><p> - Optimize websites for maximum speed, scalability, and accessibility</p><p> - Conduct code reviews and work closely with backend developers to ensure seamless integration and functionality</p><p> - Stay up-to-date on emerging technologies, trends, and best practices in frontend web development</p><p> - Troubleshoot and debug issues to ensure smooth performance and functionality</p><p> - Test and optimize websites across multiple browsers and devices</p><p> - Work closely with project managers to meet project deadlines and requirements</p><p> - Continuously improve and optimize website performance, user experience, and overall quality</p><p><br></p><p> ## <strong>Requirements:</strong></p><p> - Bachelor degree in Computer Science, Web Development, or related field</p><p> - Proven experience as a Frontend Web Developer or similar role</p><p> - Proficiency in HTML, CSS, JavaScript, and frontend frameworks (React, Angular, Vue.js)</p><p> - Solid understanding of responsive design principles and best practices</p><p> - Experience with version control systems (e.g., Git)</p><p> - Strong problem-solving skills and attention to detail</p><p> - Excellent communication and teamwork skills</p><p> - Ability to work in a fast-paced environment and manage multiple projects simultaneously</p><p> - Familiarity with backend technologies and databases is a plus</p><p><br></p><p> ## Preferred <strong>Qualifications:</strong></p><p> - Experience with graphic design tools (e.g., Adobe Photoshop, Sketch)</p><p> - Knowledge of SEO best practices and website optimization techniques</p><p> - Experience with web performance optimization tools (e.g., Lighthouse, PageSpeed Insights)</p><p> - Understanding of accessibility standards (e.g., WCAG)</p><p> - Familiarity with Agile development methodologies</p><p><br></p><p> ## Company <strong>Benefits:</strong></p><p> - Competitive salary and benefits package</p><p> - Opportunities for professional growth and development</p><p> - Dynamic and collaborative work environment</p><p> - Flexible work hours and remote work options</p><p> - Health and wellness programs</p><p> - Company-sponsored events and team-building activities</p><p><br></p><p> If you are a creative and talented Frontend Web Developer looking to work on exciting projects and contribute to innovative web solutions, we would love to hear from you. Apply now to join our team and help us shape the future of web development!</p>', 'Expired', '2025-02-12 13:58:39', NULL);

--
-- Triggers `js_post_jobs`
--
DELIMITER $$
CREATE TRIGGER `after_job_insert` AFTER INSERT ON `js_post_jobs` FOR EACH ROW BEGIN
    INSERT INTO js_job_alert (job_id, status) 
    VALUES (NEW.job_id, 'New');
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_job_update` AFTER UPDATE ON `js_post_jobs` FOR EACH ROW BEGIN
    IF OLD.expirationDate <> NEW.expirationDate AND OLD.created_at <> NEW.created_at THEN
        UPDATE js_job_alert 
        SET status = 'New', is_read = 0
        WHERE job_id = NEW.job_id;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_js_post_jobs_update` AFTER UPDATE ON `js_post_jobs` FOR EACH ROW BEGIN
    DELETE FROM js_job_applicant_matches;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_new_job_insert` AFTER INSERT ON `js_post_jobs` FOR EACH ROW BEGIN
    DELETE FROM js_job_applicant_matches;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_insert_js_post_jobs` BEFORE INSERT ON `js_post_jobs` FOR EACH ROW BEGIN
    IF NEW.expirationDate < NOW() THEN
        SET NEW.status = 'Expired';
    ELSE
        SET NEW.status = 'Active';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_update_js_post_jobs` BEFORE UPDATE ON `js_post_jobs` FOR EACH ROW BEGIN
    IF NEW.expirationDate < NOW() THEN
        SET NEW.status = 'Expired';
    ELSE
        SET NEW.status = 'Active';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `js_resubmit_tokens`
--

CREATE TABLE `js_resubmit_tokens` (
  `id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_resubmit_tokens`
--

INSERT INTO `js_resubmit_tokens` (`id`, `employer_id`, `token`, `expires_at`, `used`) VALUES
(2, 41, 'cdf7e1b5928e14757d924dafc5f4f004ea013a01c04d6c11a0a170bdaa286322', '2025-02-20 13:32:19', 0),
(3, 41, '83387409ddd82c9b73afc94a10ac548708a9686ebc87f4fc9f2ad76b55e7bdd7', '2025-02-20 13:32:55', 0),
(4, 41, '', '2025-02-20 13:33:24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `js_resume_builder`
--

CREATE TABLE `js_resume_builder` (
  `builder_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `birthdate` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `postal` varchar(255) NOT NULL,
  `nationality` varchar(255) NOT NULL,
  `education` varchar(255) NOT NULL,
  `program` varchar(255) NOT NULL,
  `profileSummary` text NOT NULL,
  `country` varchar(255) NOT NULL,
  `profile_picture` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_resume_builder`
--

INSERT INTO `js_resume_builder` (`builder_id`, `applicant_id`, `firstname`, `lastname`, `contact`, `email`, `birthdate`, `address`, `city`, `postal`, `nationality`, `education`, `program`, `profileSummary`, `country`, `profile_picture`, `created_at`) VALUES
(10, 77, 'Ajhay', 'Arendayen', '9123456789', 'ajhayarendayen@gmail.com', '2003-01-13', 'Ph9, Pkg6, Blk10, Lot4', 'Caloocan City', '1428', 'Filipino', 'Bachelor Degree', 'Bachelor of Science in Education', '<p>Experienced web developer with a strong background in designing and developing dynamic, user-friendly websites. Proficient in a variety of programming languages and frameworks, with a focus on creating responsive and visually appealing interfaces. Skilled in both front-end and back-end development, with a keen eye for detail and a passion for staying current with the latest trends and technologies in the industry. Dedicated to delivering high-quality, functional websites that meet and exceed client expectations.</p>', 'Philippines', 'uploads/profile_77.png', '2025-03-01 13:27:47');

-- --------------------------------------------------------

--
-- Table structure for table `js_resume_skills`
--

CREATE TABLE `js_resume_skills` (
  `skill_id` int(11) NOT NULL,
  `builder_id` int(11) NOT NULL,
  `skill_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_resume_skills`
--

INSERT INTO `js_resume_skills` (`skill_id`, `builder_id`, `skill_name`, `created_at`) VALUES
(1159, 10, 'HTML', '2025-03-02 08:25:48'),
(1160, 10, 'CSS', '2025-03-02 08:25:48'),
(1161, 10, 'JavaScript', '2025-03-02 08:25:48'),
(1162, 10, 'jQuery', '2025-03-02 08:25:48'),
(1163, 10, 'Bootstrap', '2025-03-02 08:25:48'),
(1164, 10, 'Angular', '2025-03-02 08:25:48'),
(1165, 10, 'React', '2025-03-02 08:25:48'),
(1166, 10, 'Node.js', '2025-03-02 08:25:48'),
(1167, 10, 'PHP', '2025-03-02 08:25:48'),
(1168, 10, 'MySQL', '2025-03-02 08:25:48'),
(1169, 10, 'MongoDB', '2025-03-02 08:25:48'),
(1170, 10, 'RESTful APIs', '2025-03-02 08:25:48'),
(1171, 10, 'Git', '2025-03-02 08:25:48'),
(1172, 10, 'Responsive Design', '2025-03-02 08:25:48'),
(1173, 10, 'Cross-Browser Compatibility', '2025-03-02 08:25:48'),
(1174, 10, 'Problem-Solving Skills', '2025-03-02 08:25:48');

-- --------------------------------------------------------

--
-- Table structure for table `js_resume_work_experience`
--

CREATE TABLE `js_resume_work_experience` (
  `work_id` int(11) NOT NULL,
  `builder_id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `prevcity` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_resume_work_experience`
--

INSERT INTO `js_resume_work_experience` (`work_id`, `builder_id`, `company_name`, `job_title`, `prevcity`, `description`, `created_at`) VALUES
(107, 10, 'Riot Games', 'Web Developer', 'Caloocan City', '<ul><li class=\"ql-align-justify\">Developed and maintained responsive websites using HTML, CSS, and JavaScript to ensure optimal user experience across various devices and browsers</li><li class=\"ql-align-justify\">Collaborated with designers and content creators to implement visually appealing and functional web interfaces</li><li class=\"ql-align-justify\">Integrated APIs and third-party services to enhance website functionality and user engagement</li><li class=\"ql-align-justify\">Conducted thorough testing and debugging to identify and resolve issues in code and ensure high performance and reliability</li><li class=\"ql-align-justify\">Implemented SEO best practices to improve search engine rankings and increase organic traffic to websites</li><li class=\"ql-align-justify\">Stayed current with industry trends and technologies to continuously enhance web development skills and deliver innovative solutions</li></ul>', '2025-03-02 08:25:48');

-- --------------------------------------------------------

--
-- Table structure for table `js_saved_assessment`
--

CREATE TABLE `js_saved_assessment` (
  `assessment_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `instructions` varchar(255) NOT NULL,
  `correctAnswer` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `documents` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `js_screening_question`
--

CREATE TABLE `js_screening_question` (
  `question_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `question` varchar(500) NOT NULL,
  `response_type` varchar(255) DEFAULT NULL,
  `ideal_answer` varchar(255) NOT NULL,
  `mustHave` varchar(255) DEFAULT NULL,
  `qualification_setting` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_screening_question`
--

INSERT INTO `js_screening_question` (`question_id`, `job_id`, `question`, `response_type`, `ideal_answer`, `mustHave`, `qualification_setting`, `created_at`) VALUES
(2, 151, 'Have you completed any level of education?', 'yesno', 'Yes', '1', '', '2024-12-09 10:22:48'),
(3, 151, 'Are you interested in applying for this position?', 'yesno', 'Yes', '1', '', '2024-12-09 10:22:48'),
(4, 151, 'Do you have relevant experience for this job?', 'yesno', 'Yes', '1', '', '2024-12-09 10:22:48'),
(5, 151, 'Are you open to relocating for this job?', 'yesno', 'Yes', '', NULL, '2024-12-09 10:22:48'),
(6, 151, 'Are you located in the required area?', 'yesno', 'Yes', '', NULL, '2024-12-09 10:22:48'),
(7, 152, 'Have you completed any level of education?', 'yesno', 'Yes', '', NULL, '2024-12-09 12:27:49'),
(8, 152, 'Do you speak any of the required languages fluently?', 'yesno', 'Yes', '', NULL, '2024-12-09 12:27:49'),
(9, 152, 'Do you have professional references available?', 'yesno', 'Yes', '', NULL, '2024-12-09 12:27:49'),
(10, 152, 'Do you have a preference for a work environment?', 'yesno', 'Yes', '', NULL, '2024-12-09 12:27:49'),
(11, 152, 'Are you interested in applying for this position?', 'yesno', 'Yes', '', NULL, '2024-12-09 12:27:49'),
(12, 153, 'How many Jobs have you entered in this position?', 'numeric', '1', '1', '', '2024-12-10 04:24:19'),
(13, 153, 'Do you possess any relevant skills for this job?', 'yesno', 'Yes', '', NULL, '2024-12-10 04:24:19'),
(14, 153, 'Does the offered salary range meet your expectations?', 'yesno', 'Yes', '', NULL, '2024-12-10 04:24:19'),
(15, 154, 'How many times you can eat in a day?', 'numeric', '2', '1', '', '2024-12-16 15:18:15'),
(16, 154, 'Have you completed any level of education?', 'yesno', 'Yes', '', NULL, '2024-12-16 15:18:16'),
(17, 154, 'Do you have relevant experience for this job?', 'yesno', 'Yes', '1', '', '2024-12-16 15:18:16'),
(18, 154, 'Do you hold any relevant certifications?', 'yesno', 'Yes', '', NULL, '2024-12-16 15:18:16'),
(19, 155, 'Do you have a preference for a work environment?', 'yesno', 'Yes', '', NULL, '2024-12-18 06:20:21'),
(20, 155, 'Do you have relevant experience for this job?', 'yesno', 'Yes', '1', '', '2024-12-18 06:20:21'),
(21, 155, 'Are you interested in applying for this position?', 'yesno', 'Yes', '1', '', '2024-12-18 06:20:21'),
(22, 155, 'Do you consider yourself to be detail-oriented?', 'yesno', 'Yes', '1', '', '2024-12-18 06:20:21'),
(23, 155, 'Have you worked in a team-based environment?', 'yesno', 'Yes', '1', '', '2024-12-18 06:20:21'),
(24, 156, 'Are you open to relocating for this job?', 'yesno', 'Yes', '', NULL, '2024-12-18 06:24:33'),
(25, 156, 'Do you have relevant experience for this job?', 'yesno', 'Yes', '1', '', '2024-12-18 06:24:33'),
(26, 156, 'How many Maintenance engineer jobs have you applied for?', 'numeric', '1', '1', '', '2024-12-18 06:24:33'),
(27, 156, 'Do you have professional references available?', 'yesno', 'Yes', '', NULL, '2024-12-18 06:24:33'),
(28, 157, 'Do you possess any relevant skills for this job?', 'yesno', 'Yes', '', NULL, '2024-12-18 06:26:31'),
(29, 157, 'Do you hold any relevant certifications?', 'yesno', 'Yes', '', NULL, '2024-12-18 06:26:31'),
(30, 157, 'Are you located in the required area?', 'yesno', 'Yes', '1', '', '2024-12-18 06:26:31'),
(31, 158, 'Have you completed any level of education?', 'yesno', 'Yes', '', NULL, '2025-02-01 10:32:24'),
(32, 158, 'Do you possess any relevant skills for this job?', 'yesno', 'Yes', '', NULL, '2025-02-01 10:32:24'),
(33, 158, 'Are you interested in applying for this position?', 'yesno', 'Yes', '', NULL, '2025-02-01 10:32:24'),
(34, 158, 'Do you have a preference for a work environment?', 'yesno', 'Yes', '', NULL, '2025-02-01 10:32:24'),
(35, 159, 'Have you completed any level of education?', 'yesno', 'Yes', '', NULL, '2025-02-04 06:32:42'),
(36, 159, 'Do you possess any relevant skills for this job?', 'yesno', 'Yes', '', NULL, '2025-02-04 06:32:42'),
(37, 160, '', 'yesno', 'Yes', '', NULL, '2025-02-04 06:34:38'),
(38, 161, 'Have you completed any level of education?', 'yesno', 'Yes', '1', '', '2025-02-12 13:58:39'),
(39, 161, 'Do you possess any relevant skills for this job?', 'yesno', 'Yes', '', NULL, '2025-02-12 13:58:39'),
(40, 161, 'Are you available to start immediately?', 'yesno', 'Yes', '', NULL, '2025-02-12 13:58:39');

-- --------------------------------------------------------

--
-- Table structure for table `js_skills`
--

CREATE TABLE `js_skills` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `skill_name` varchar(255) NOT NULL,
  `years` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_skills`
--

INSERT INTO `js_skills` (`id`, `applicant_id`, `skill_name`, `years`, `created_at`) VALUES
(5, 93, 'PHP', '2 years', '2025-01-30 14:50:44'),
(6, 93, 'SQL', '2 years', '2025-01-30 14:50:50'),
(7, 93, 'PHP', '2 years', '2025-01-30 14:55:04'),
(17, 77, 'PHP', '2 years', '2025-01-31 16:03:37'),
(18, 77, 'MySQL', '4 Years', '2025-01-31 16:03:45'),
(19, 77, 'JavaScript', '2 years', '2025-01-31 16:03:49'),
(23, 77, 'HTML', '2 years', '2025-02-01 11:22:17'),
(24, 98, 'ReactJs', '2 years', '2025-02-01 13:43:28'),
(25, 98, 'HTML', '2 years', '2025-02-01 13:43:34'),
(26, 98, 'TailWind', '2 years', '2025-02-01 13:43:45'),
(27, 98, 'CSS', '2 years', '2025-02-01 13:43:52'),
(28, 98, 'PHP', '1 year', '2025-02-01 13:44:05'),
(34, 77, 'CSS', '2 years', '2025-02-18 14:50:53'),
(36, 77, 'ReactJs', '2 years', '2025-02-18 15:26:58');

--
-- Triggers `js_skills`
--
DELIMITER $$
CREATE TRIGGER `after_skill_insert` AFTER INSERT ON `js_skills` FOR EACH ROW BEGIN
    DELETE FROM js_job_applicant_matches WHERE applicant_id = NEW.applicant_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_skill_update` AFTER UPDATE ON `js_skills` FOR EACH ROW BEGIN
    DELETE FROM js_job_applicant_matches WHERE applicant_id = NEW.applicant_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `js_social_media_company`
--

CREATE TABLE `js_social_media_company` (
  `social_media_id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `facebook_icon` varchar(255) DEFAULT NULL,
  `instagram_icon` varchar(255) DEFAULT NULL,
  `youtube_icon` varchar(255) DEFAULT NULL,
  `twitter_icon` varchar(255) DEFAULT NULL,
  `pinterest_icon` varchar(255) DEFAULT NULL,
  `reddit_icon` varchar(255) DEFAULT NULL,
  `whatsapp_business_icon` varchar(255) DEFAULT NULL,
  `telegram_icon` varchar(255) DEFAULT NULL,
  `wechat_icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_social_media_company`
--

INSERT INTO `js_social_media_company` (`social_media_id`, `employer_id`, `facebook_icon`, `instagram_icon`, `youtube_icon`, `twitter_icon`, `pinterest_icon`, `reddit_icon`, `whatsapp_business_icon`, `telegram_icon`, `wechat_icon`, `created_at`) VALUES
(1, 41, 'https://www.facebook.com/', 'https://www.facebook.com/', 'https://www.facebook.com/', NULL, NULL, NULL, NULL, 'https://www.facebook.com/', NULL, '2024-12-18 15:03:02'),
(2, 42, 'https://www.facebook.com/', 'https://www.facebook.com/', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-11-23 08:42:29'),
(3, 56, 'https://www.facebook.com/', 'https://www.facebook.com/', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-01-05 08:19:53'),
(4, 59, 'https://www.facebook.com/', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-02 12:58:00');

-- --------------------------------------------------------

--
-- Table structure for table `js_work_experience`
--

CREATE TABLE `js_work_experience` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `years` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `js_work_experience`
--

INSERT INTO `js_work_experience` (`id`, `applicant_id`, `job_title`, `years`, `created_at`) VALUES
(7, 77, 'Backend Developer', '4 Years', '2025-01-31 16:03:23'),
(8, 77, 'Web Developer', '2 years', '2025-01-31 16:03:32'),
(9, 98, 'Web Developer', '4 Years', '2025-02-01 13:39:08');

--
-- Triggers `js_work_experience`
--
DELIMITER $$
CREATE TRIGGER `after_experience_insert` AFTER INSERT ON `js_work_experience` FOR EACH ROW BEGIN
    DELETE FROM js_job_applicant_matches WHERE applicant_id = NEW.applicant_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_experience_update` AFTER UPDATE ON `js_work_experience` FOR EACH ROW BEGIN
    DELETE FROM js_job_applicant_matches WHERE applicant_id = NEW.applicant_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `notification_employer`
-- (See below for the actual view)
--
CREATE TABLE `notification_employer` (
`firstname` varchar(255)
,`middlename` varchar(255)
,`lastname` varchar(255)
,`applied_at` timestamp
,`job_id` int(11)
,`employer_id` int(11)
,`jobTitle` varchar(255)
,`jobTags` varchar(255)
,`jobRole` varchar(255)
,`minSalary` varchar(255)
,`maxSalary` varchar(255)
,`salaryType` varchar(255)
,`education` varchar(255)
,`experience` varchar(255)
,`jobType` varchar(255)
,`expirationDate` timestamp
,`jobLevel` varchar(255)
,`address` varchar(255)
,`city` varchar(255)
,`selectedBenefits` text
,`jobDescription` text
,`status` varchar(255)
,`created_at` timestamp
,`updated_at` text
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `recent_active_jobs`
-- (See below for the actual view)
--
CREATE TABLE `recent_active_jobs` (
`job_id` int(11)
,`employer_id` int(11)
,`jobTitle` varchar(255)
,`jobTags` varchar(255)
,`jobRole` varchar(255)
,`minSalary` varchar(255)
,`maxSalary` varchar(255)
,`salaryType` varchar(255)
,`education` varchar(255)
,`experience` varchar(255)
,`jobType` varchar(255)
,`expirationDate` timestamp
,`jobLevel` varchar(255)
,`address` varchar(255)
,`city` varchar(255)
,`selectedBenefits` text
,`jobDescription` text
,`status` varchar(255)
,`created_at` timestamp
,`updated_at` text
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_applicant_count`
-- (See below for the actual view)
--
CREATE TABLE `view_applicant_count` (
`job_id` int(11)
,`employer_id` int(11)
,`applicant_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_applicant_notification`
-- (See below for the actual view)
--
CREATE TABLE `view_applicant_notification` (
`applicant_id` int(11)
,`application_id` int(11)
,`job_id` int(10)
,`company_name` varchar(255)
,`message` varchar(255)
,`isRead` int(1)
,`countRead` int(1)
,`type` varchar(255)
,`created_at` timestamp
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_applications`
-- (See below for the actual view)
--
CREATE TABLE `view_applications` (
`application_id` int(11)
,`employer_id` int(11)
,`job_id` int(11)
,`jobTitle` varchar(255)
,`applicant_id` int(11)
,`firstname` varchar(255)
,`middlename` varchar(255)
,`lastname` varchar(255)
,`resumeName` varchar(255)
,`resumePath` varchar(255)
,`applied_status` varchar(255)
,`applied_at` timestamp
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_employer_notification`
-- (See below for the actual view)
--
CREATE TABLE `view_employer_notification` (
`employer_id` int(11)
,`firstname` varchar(255)
,`lastname` varchar(255)
,`middlename` varchar(255)
,`profile_picture` varchar(255)
,`notif_id` int(11)
,`job_id` int(11)
,`application_id` int(11)
,`message` text
,`isRead` int(11)
,`countRead` int(11)
,`type` varchar(255)
,`created_at` timestamp
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_join_request`
-- (See below for the actual view)
--
CREATE TABLE `view_join_request` (
`request_id` int(11)
,`application_id` int(11)
,`job_id` int(11)
,`channel_name` varchar(255)
,`status` enum('pending','approved','rejected','cancel')
,`requested_at` timestamp
,`updated_at` timestamp
,`applicant_id` int(11)
,`firstname` varchar(255)
,`middlename` varchar(255)
,`lastname` varchar(255)
,`suffix` varchar(25)
,`email` varchar(255)
,`profile_picture` varchar(255)
,`schedule` text
,`time` text
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_job_alert`
-- (See below for the actual view)
--
CREATE TABLE `v_job_alert` (
`alert_id` int(11)
,`freshness` varchar(255)
,`job_id` int(11)
,`employer_id` int(11)
,`jobTitle` varchar(255)
,`jobTags` varchar(255)
,`jobRole` varchar(255)
,`minSalary` varchar(255)
,`maxSalary` varchar(255)
,`salaryType` varchar(255)
,`education` varchar(255)
,`experience` varchar(255)
,`jobType` varchar(255)
,`expirationDate` timestamp
,`jobLevel` varchar(255)
,`address` varchar(255)
,`city` varchar(255)
,`selectedBenefits` text
,`jobDescription` text
,`status` varchar(255)
,`created_at` timestamp
,`updated_at` text
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_job_match_alerts`
-- (See below for the actual view)
--
CREATE TABLE `v_job_match_alerts` (
`alert_id` int(11)
,`applicant_id` int(11)
,`freshness` varchar(255)
,`job_id` int(11)
,`employer_id` int(11)
,`jobTitle` varchar(255)
,`jobTags` varchar(255)
,`jobRole` varchar(255)
,`minSalary` varchar(255)
,`maxSalary` varchar(255)
,`salaryType` varchar(255)
,`education` varchar(255)
,`experience` varchar(255)
,`jobType` varchar(255)
,`expirationDate` timestamp
,`jobLevel` varchar(255)
,`address` varchar(255)
,`city` varchar(255)
,`selectedBenefits` text
,`jobDescription` text
,`status` varchar(255)
,`created_at` timestamp
,`updated_at` text
);

-- --------------------------------------------------------

--
-- Structure for view `active_job_postings`
--
DROP TABLE IF EXISTS `active_job_postings`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `active_job_postings`  AS SELECT `j`.`job_id` AS `job_id`, `j`.`employer_id` AS `employer_id`, `j`.`jobTitle` AS `jobTitle`, `j`.`jobTags` AS `jobTags`, `j`.`jobRole` AS `jobRole`, `j`.`minSalary` AS `minSalary`, `j`.`maxSalary` AS `maxSalary`, `j`.`salaryType` AS `salaryType`, `j`.`education` AS `education`, `j`.`experience` AS `experience`, `j`.`jobType` AS `jobType`, `j`.`expirationDate` AS `expirationDate`, `j`.`jobLevel` AS `jobLevel`, `j`.`address` AS `address`, `j`.`city` AS `city`, `j`.`selectedBenefits` AS `selectedBenefits`, `j`.`jobDescription` AS `jobDescription`, `j`.`status` AS `status`, `j`.`created_at` AS `job_created_at`, `j`.`updated_at` AS `job_updated_at`, `c`.`company_name` AS `company_name`, `c`.`about_us` AS `about_us`, `c`.`logo` AS `logo`, `c`.`banner` AS `banner` FROM (`js_post_jobs` `j` join `js_company_info` `c` on(`j`.`employer_id` = `c`.`employer_id`)) WHERE `j`.`status` = 'active' AND `j`.`expirationDate` > current_timestamp() ORDER BY `j`.`created_at` DESC  ;

-- --------------------------------------------------------

--
-- Structure for view `applicants_favorite_jobs`
--
DROP TABLE IF EXISTS `applicants_favorite_jobs`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `applicants_favorite_jobs`  AS SELECT `fj`.`favorite_job_id` AS `favorite_job_id`, `fj`.`applicant_id` AS `applicant_id`, `fj`.`added_at` AS `added_at`, `pj`.`job_id` AS `job_id`, `pj`.`employer_id` AS `employer_id`, `pj`.`jobTitle` AS `jobTitle`, `pj`.`jobTags` AS `jobTags`, `pj`.`jobRole` AS `jobRole`, `pj`.`minSalary` AS `minSalary`, `pj`.`maxSalary` AS `maxSalary`, `pj`.`salaryType` AS `salaryType`, `pj`.`education` AS `education`, `pj`.`experience` AS `experience`, `pj`.`jobType` AS `jobType`, `pj`.`expirationDate` AS `expirationDate`, `pj`.`jobLevel` AS `jobLevel`, `pj`.`address` AS `address`, `pj`.`city` AS `city`, `pj`.`selectedBenefits` AS `selectedBenefits`, `pj`.`jobDescription` AS `jobDescription`, `pj`.`status` AS `status`, `pj`.`created_at` AS `created_at`, `pj`.`updated_at` AS `updated_at`, `ci`.`logo` AS `logo` FROM ((`js_post_jobs` `pj` join `js_favorite_jobs` `fj` on(`pj`.`job_id` = `fj`.`job_id`)) join `js_company_info` `ci` on(`pj`.`employer_id` = `ci`.`employer_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `applicant_answer`
--
DROP TABLE IF EXISTS `applicant_answer`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `applicant_answer`  AS SELECT `res`.`job_id` AS `job_id`, `res`.`application_id` AS `application_id`, `app`.`question_id` AS `question_id`, `q`.`question` AS `question`, `app`.`answer` AS `answer`, `q`.`ideal_answer` AS `ideal_answer` FROM ((`js_applicant_application_resume` `res` join `js_applicant_application` `app` on(`res`.`application_id` = `app`.`application_id`)) join `js_screening_question` `q` on(`app`.`question_id` = `q`.`question_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `applicant_applied_details`
--
DROP TABLE IF EXISTS `applicant_applied_details`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `applicant_applied_details`  AS SELECT `job`.`job_id` AS `job_id`, `app`.`applicant_id` AS `applicant_id`, `app`.`firstname` AS `firstname`, `app`.`middlename` AS `middlename`, `app`.`lastname` AS `lastname`, `app`.`suffix` AS `suffix`, `app`.`gender` AS `gender`, `app`.`contact` AS `contact`, `app`.`profile_picture` AS `profile_picture`, `app`.`email` AS `email`, `app`.`password` AS `password`, `app`.`verification_code` AS `verification_code`, `app`.`email_verified_at` AS `email_verified_at`, `app`.`created_at` AS `created_at`, `app`.`updated_at` AS `updated_at`, `per`.`headline` AS `headline`, `per`.`birthday` AS `birthday`, `per`.`birthplace` AS `birthplace`, `per`.`address` AS `address`, `per`.`city` AS `city`, `per`.`barangay` AS `barangay`, `per`.`postal` AS `postal`, `per`.`status` AS `status`, `per`.`experience` AS `experience`, `per`.`attainment` AS `attainment`, `per`.`biography` AS `biography`, `per`.`nationality` AS `nationality`, `res`.`application_id` AS `application_id`, `res`.`resumeName` AS `resumeName`, `res`.`resumePath` AS `resumePath`, `res`.`coverLetter` AS `coverLetter`, `res`.`applied_status` AS `applied_status`, `res`.`applied_at` AS `applied_at`, `soc`.`facebook_icon` AS `facebook_icon`, `soc`.`instagram_icon` AS `instagram_icon`, `soc`.`youtube_icon` AS `youtube_icon`, `soc`.`twitter_icon` AS `twitter_icon`, `soc`.`tiktok_icon` AS `tiktok_icon`, `soc`.`dribble_icon` AS `dribble_icon`, `soc`.`github_icon` AS `github_icon`, `soc`.`reddit_icon` AS `reddit_icon`, `soc`.`freelancer_icon` AS `freelancer_icon` FROM ((((`js_applicant_application_resume` `res` join `js_applicants` `app` on(`res`.`applicant_id` = `app`.`applicant_id`)) join `js_personal_info` `per` on(`app`.`applicant_id` = `per`.`applicant_id`)) join `js_applicant_socialmedia` `soc` on(`app`.`applicant_id` = `soc`.`applicant_id`)) join `js_post_jobs` `job` on(`res`.`job_id` = `job`.`job_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `applicant_details`
--
DROP TABLE IF EXISTS `applicant_details`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `applicant_details`  AS SELECT `a`.`applicant_id` AS `applicant_id`, `a`.`firstname` AS `firstname`, `a`.`middlename` AS `middlename`, `a`.`lastname` AS `lastname`, `a`.`suffix` AS `suffix`, `a`.`gender` AS `gender`, `a`.`contact` AS `contact`, `a`.`profile_picture` AS `profile_picture`, `a`.`email` AS `email`, `a`.`password` AS `password`, `a`.`verification_code` AS `verification_code`, `a`.`email_verified_at` AS `email_verified_at`, `p`.`headline` AS `headline`, `p`.`birthday` AS `birthday`, `p`.`birthplace` AS `birthplace`, `p`.`address` AS `address`, `p`.`city` AS `city`, `p`.`barangay` AS `barangay`, `p`.`postal` AS `postal`, `p`.`status` AS `status`, `p`.`experience` AS `experience`, `p`.`attainment` AS `attainment`, `p`.`biography` AS `biography`, `p`.`nationality` AS `nationality`, `p`.`created_at` AS `personal_info_created_at`, `p`.`updated_at` AS `personal_info_updated_at` FROM (`js_applicants` `a` join `js_personal_info` `p` on(`a`.`applicant_id` = `p`.`applicant_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `applied_jobs`
--
DROP TABLE IF EXISTS `applied_jobs`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `applied_jobs`  AS SELECT `ar`.`applicant_id` AS `applicant_id`, `jp`.`job_id` AS `job_id`, `jp`.`employer_id` AS `employer_id`, `jp`.`jobTitle` AS `jobTitle`, `jp`.`jobTags` AS `jobTags`, `jp`.`jobRole` AS `jobRole`, `jp`.`minSalary` AS `minSalary`, `jp`.`maxSalary` AS `maxSalary`, `jp`.`salaryType` AS `salaryType`, `jp`.`education` AS `education`, `jp`.`experience` AS `experience`, `jp`.`jobType` AS `jobType`, `jp`.`expirationDate` AS `expirationDate`, `jp`.`jobLevel` AS `jobLevel`, `jp`.`address` AS `address`, `jp`.`city` AS `city`, `jp`.`selectedBenefits` AS `selectedBenefits`, `jp`.`jobDescription` AS `jobDescription`, `jp`.`status` AS `status`, `jp`.`created_at` AS `created_at`, `jp`.`updated_at` AS `updated_at`, `cf`.`logo` AS `logo`, `ar`.`applied_at` AS `applied_at` FROM ((`js_post_jobs` `jp` join `js_applicant_application_resume` `ar` on(`jp`.`job_id` = `ar`.`job_id`)) join `js_company_info` `cf` on(`jp`.`employer_id` = `cf`.`employer_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `complete_company_profile`
--
DROP TABLE IF EXISTS `complete_company_profile`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `complete_company_profile`  AS SELECT `ci`.`company_id` AS `company_id`, `ci`.`company_name` AS `company_name`, `ci`.`about_us` AS `about_us`, `ci`.`logo` AS `logo`, `ci`.`banner` AS `banner`, `ci`.`created_at` AS `company_created_at`, `fi`.`organization` AS `organization`, `fi`.`industry` AS `industry`, `fi`.`team_size` AS `team_size`, `fi`.`year_establishment` AS `year_establishment`, `fi`.`company_website` AS `company_website`, `fi`.`company_vision` AS `company_vision`, `fi`.`created_at` AS `founding_info_created_at`, `co`.`address` AS `address`, `co`.`contact_number` AS `contact_number`, `co`.`company_email` AS `company_email`, `co`.`city` AS `city`, `co`.`created_at` AS `contact_created_at`, `smc`.`facebook_icon` AS `facebook_icon`, `smc`.`instagram_icon` AS `instagram_icon`, `smc`.`youtube_icon` AS `youtube_icon`, `smc`.`twitter_icon` AS `twitter_icon`, `smc`.`pinterest_icon` AS `pinterest_icon`, `smc`.`reddit_icon` AS `reddit_icon`, `smc`.`whatsapp_business_icon` AS `whatsapp_business_icon`, `smc`.`telegram_icon` AS `telegram_icon`, `smc`.`wechat_icon` AS `wechat_icon`, `smc`.`created_at` AS `social_media_created_at`, count(case when `j`.`status` <> 'expired' then `j`.`status` end) AS `job_post_count` FROM ((((`js_company_info` `ci` join `js_founding_info` `fi` on(`ci`.`employer_id` = `fi`.`employer_id`)) join `js_company_contact` `co` on(`ci`.`employer_id` = `co`.`employer_id`)) join `js_social_media_company` `smc` on(`ci`.`employer_id` = `smc`.`employer_id`)) left join `js_post_jobs` `j` on(`ci`.`employer_id` = `j`.`employer_id`)) GROUP BY `ci`.`company_id`, `ci`.`company_name`, `ci`.`about_us`, `ci`.`logo`, `ci`.`banner`, `ci`.`created_at`, `fi`.`organization`, `fi`.`industry`, `fi`.`team_size`, `fi`.`year_establishment`, `fi`.`company_website`, `fi`.`company_vision`, `fi`.`created_at`, `co`.`address`, `co`.`contact_number`, `co`.`company_email`, `co`.`city`, `co`.`created_at`, `smc`.`facebook_icon`, `smc`.`instagram_icon`, `smc`.`youtube_icon`, `smc`.`twitter_icon`, `smc`.`pinterest_icon`, `smc`.`reddit_icon`, `smc`.`whatsapp_business_icon`, `smc`.`telegram_icon`, `smc`.`wechat_icon`, `smc`.`created_at`  ;

-- --------------------------------------------------------

--
-- Structure for view `employer_job_count`
--
DROP TABLE IF EXISTS `employer_job_count`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `employer_job_count`  AS SELECT `js_post_jobs`.`employer_id` AS `employer_id`, count(0) AS `total_jobs` FROM `js_post_jobs` GROUP BY `js_post_jobs`.`employer_id`  ;

-- --------------------------------------------------------

--
-- Structure for view `notification_employer`
--
DROP TABLE IF EXISTS `notification_employer`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `notification_employer`  AS SELECT `app`.`firstname` AS `firstname`, `app`.`middlename` AS `middlename`, `app`.`lastname` AS `lastname`, `res`.`applied_at` AS `applied_at`, `job`.`job_id` AS `job_id`, `job`.`employer_id` AS `employer_id`, `job`.`jobTitle` AS `jobTitle`, `job`.`jobTags` AS `jobTags`, `job`.`jobRole` AS `jobRole`, `job`.`minSalary` AS `minSalary`, `job`.`maxSalary` AS `maxSalary`, `job`.`salaryType` AS `salaryType`, `job`.`education` AS `education`, `job`.`experience` AS `experience`, `job`.`jobType` AS `jobType`, `job`.`expirationDate` AS `expirationDate`, `job`.`jobLevel` AS `jobLevel`, `job`.`address` AS `address`, `job`.`city` AS `city`, `job`.`selectedBenefits` AS `selectedBenefits`, `job`.`jobDescription` AS `jobDescription`, `job`.`status` AS `status`, `job`.`created_at` AS `created_at`, `job`.`updated_at` AS `updated_at` FROM (((`js_notification` `notif` join `js_applicant_application_resume` `res` on(`notif`.`application_id` = `res`.`application_id`)) join `js_applicants` `app` on(`res`.`applicant_id` = `app`.`applicant_id`)) join `js_post_jobs` `job` on(`res`.`job_id` = `job`.`job_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `recent_active_jobs`
--
DROP TABLE IF EXISTS `recent_active_jobs`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `recent_active_jobs`  AS SELECT `js_post_jobs`.`job_id` AS `job_id`, `js_post_jobs`.`employer_id` AS `employer_id`, `js_post_jobs`.`jobTitle` AS `jobTitle`, `js_post_jobs`.`jobTags` AS `jobTags`, `js_post_jobs`.`jobRole` AS `jobRole`, `js_post_jobs`.`minSalary` AS `minSalary`, `js_post_jobs`.`maxSalary` AS `maxSalary`, `js_post_jobs`.`salaryType` AS `salaryType`, `js_post_jobs`.`education` AS `education`, `js_post_jobs`.`experience` AS `experience`, `js_post_jobs`.`jobType` AS `jobType`, `js_post_jobs`.`expirationDate` AS `expirationDate`, `js_post_jobs`.`jobLevel` AS `jobLevel`, `js_post_jobs`.`address` AS `address`, `js_post_jobs`.`city` AS `city`, `js_post_jobs`.`selectedBenefits` AS `selectedBenefits`, `js_post_jobs`.`jobDescription` AS `jobDescription`, `js_post_jobs`.`status` AS `status`, `js_post_jobs`.`created_at` AS `created_at`, `js_post_jobs`.`updated_at` AS `updated_at` FROM `js_post_jobs` WHERE `js_post_jobs`.`status` = 'active' AND `js_post_jobs`.`expirationDate` > current_timestamp() AND `js_post_jobs`.`created_at` >= current_timestamp() - interval 30 day  ;

-- --------------------------------------------------------

--
-- Structure for view `view_applicant_count`
--
DROP TABLE IF EXISTS `view_applicant_count`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_applicant_count`  AS SELECT `r`.`job_id` AS `job_id`, `j`.`employer_id` AS `employer_id`, count(`r`.`applicant_id`) AS `applicant_count` FROM (`js_applicant_application_resume` `r` join `js_post_jobs` `j` on(`r`.`job_id` = `j`.`job_id`)) GROUP BY `r`.`job_id`, `j`.`employer_id` ;

-- --------------------------------------------------------

--
-- Structure for view `view_applicant_notification`
--
DROP TABLE IF EXISTS `view_applicant_notification`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_applicant_notification`  AS SELECT `a`.`applicant_id` AS `applicant_id`, `n`.`application_id` AS `application_id`, `n`.`job_id` AS `job_id`, `c`.`company_name` AS `company_name`, `n`.`message` AS `message`, `n`.`isRead` AS `isRead`, `n`.`countRead` AS `countRead`, `n`.`type` AS `type`, `n`.`created_at` AS `created_at` FROM (((`js_notification` `n` join `js_post_jobs` `j` on(`n`.`job_id` = `j`.`job_id`)) join `js_company_info` `c` on(`j`.`employer_id` = `c`.`employer_id`)) join `js_applicant_application_resume` `a` on(`n`.`application_id` = `a`.`application_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `view_applications`
--
DROP TABLE IF EXISTS `view_applications`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_applications`  AS SELECT `res`.`application_id` AS `application_id`, `emp`.`employer_id` AS `employer_id`, `job`.`job_id` AS `job_id`, `job`.`jobTitle` AS `jobTitle`, `res`.`applicant_id` AS `applicant_id`, `app`.`firstname` AS `firstname`, `app`.`middlename` AS `middlename`, `app`.`lastname` AS `lastname`, `res`.`resumeName` AS `resumeName`, `res`.`resumePath` AS `resumePath`, `res`.`applied_status` AS `applied_status`, `res`.`applied_at` AS `applied_at` FROM (((`js_applicant_application_resume` `res` join `js_post_jobs` `job` on(`res`.`job_id` = `job`.`job_id`)) join `js_applicants` `app` on(`res`.`applicant_id` = `app`.`applicant_id`)) join `js_employer_info` `emp` on(`job`.`employer_id` = `emp`.`employer_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `view_employer_notification`
--
DROP TABLE IF EXISTS `view_employer_notification`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_employer_notification`  AS SELECT `c`.`employer_id` AS `employer_id`, `a`.`firstname` AS `firstname`, `a`.`lastname` AS `lastname`, `a`.`middlename` AS `middlename`, `a`.`profile_picture` AS `profile_picture`, `n`.`notif_id` AS `notif_id`, `n`.`job_id` AS `job_id`, `n`.`application_id` AS `application_id`, `n`.`message` AS `message`, `n`.`isRead` AS `isRead`, `n`.`countRead` AS `countRead`, `n`.`type` AS `type`, `n`.`created_at` AS `created_at` FROM ((((`js_employer_notification` `n` join `js_applicant_application_resume` `res` on(`n`.`application_id` = `res`.`application_id`)) join `js_applicants` `a` on(`res`.`applicant_id` = `a`.`applicant_id`)) join `js_post_jobs` `j` on(`n`.`job_id` = `j`.`job_id`)) join `js_company_info` `c` on(`j`.`employer_id` = `c`.`employer_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `view_join_request`
--
DROP TABLE IF EXISTS `view_join_request`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_join_request`  AS SELECT `r`.`request_id` AS `request_id`, `r`.`application_id` AS `application_id`, `r`.`job_id` AS `job_id`, `r`.`channel_name` AS `channel_name`, `r`.`status` AS `status`, `r`.`requested_at` AS `requested_at`, `r`.`updated_at` AS `updated_at`, `a`.`applicant_id` AS `applicant_id`, `a`.`firstname` AS `firstname`, `a`.`middlename` AS `middlename`, `a`.`lastname` AS `lastname`, `a`.`suffix` AS `suffix`, `a`.`email` AS `email`, `a`.`profile_picture` AS `profile_picture`, `i`.`schedule` AS `schedule`, `i`.`time` AS `time` FROM (((`js_join_request` `r` join `js_applicant_application_resume` `res` on(`r`.`application_id` = `res`.`application_id`)) join `js_applicants` `a` on(`res`.`applicant_id` = `a`.`applicant_id`)) join `js_interview_schedule` `i` on(`r`.`application_id` = `i`.`application_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `v_job_alert`
--
DROP TABLE IF EXISTS `v_job_alert`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_job_alert`  AS SELECT `a`.`alert_id` AS `alert_id`, `a`.`status` AS `freshness`, `j`.`job_id` AS `job_id`, `j`.`employer_id` AS `employer_id`, `j`.`jobTitle` AS `jobTitle`, `j`.`jobTags` AS `jobTags`, `j`.`jobRole` AS `jobRole`, `j`.`minSalary` AS `minSalary`, `j`.`maxSalary` AS `maxSalary`, `j`.`salaryType` AS `salaryType`, `j`.`education` AS `education`, `j`.`experience` AS `experience`, `j`.`jobType` AS `jobType`, `j`.`expirationDate` AS `expirationDate`, `j`.`jobLevel` AS `jobLevel`, `j`.`address` AS `address`, `j`.`city` AS `city`, `j`.`selectedBenefits` AS `selectedBenefits`, `j`.`jobDescription` AS `jobDescription`, `j`.`status` AS `status`, `j`.`created_at` AS `created_at`, `j`.`updated_at` AS `updated_at` FROM (`js_job_alert` `a` join `js_post_jobs` `j` on(`a`.`job_id` = `j`.`job_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `v_job_match_alerts`
--
DROP TABLE IF EXISTS `v_job_match_alerts`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_job_match_alerts`  AS SELECT `a`.`alert_id` AS `alert_id`, `a`.`applicant_id` AS `applicant_id`, `a`.`status` AS `freshness`, `j`.`job_id` AS `job_id`, `j`.`employer_id` AS `employer_id`, `j`.`jobTitle` AS `jobTitle`, `j`.`jobTags` AS `jobTags`, `j`.`jobRole` AS `jobRole`, `j`.`minSalary` AS `minSalary`, `j`.`maxSalary` AS `maxSalary`, `j`.`salaryType` AS `salaryType`, `j`.`education` AS `education`, `j`.`experience` AS `experience`, `j`.`jobType` AS `jobType`, `j`.`expirationDate` AS `expirationDate`, `j`.`jobLevel` AS `jobLevel`, `j`.`address` AS `address`, `j`.`city` AS `city`, `j`.`selectedBenefits` AS `selectedBenefits`, `j`.`jobDescription` AS `jobDescription`, `j`.`status` AS `status`, `j`.`created_at` AS `created_at`, `j`.`updated_at` AS `updated_at` FROM (`js_job_match_alerts` `a` join `js_post_jobs` `j` on(`a`.`job_id` = `j`.`job_id`))  ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `js_admin`
--
ALTER TABLE `js_admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `js_applicants`
--
ALTER TABLE `js_applicants`
  ADD PRIMARY KEY (`applicant_id`);

--
-- Indexes for table `js_applicant_application`
--
ALTER TABLE `js_applicant_application`
  ADD PRIMARY KEY (`apply_id`),
  ADD KEY `application_id` (`application_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `js_applicant_application_resume`
--
ALTER TABLE `js_applicant_application_resume`
  ADD PRIMARY KEY (`application_id`),
  ADD KEY `applicant_id` (`applicant_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `js_applicant_resume`
--
ALTER TABLE `js_applicant_resume`
  ADD PRIMARY KEY (`resume_id`),
  ADD KEY `fk_applicant_id` (`applicant_id`);

--
-- Indexes for table `js_applicant_socialmedia`
--
ALTER TABLE `js_applicant_socialmedia`
  ADD PRIMARY KEY (`socialmedia_id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `js_assessment`
--
ALTER TABLE `js_assessment`
  ADD PRIMARY KEY (`assessment_id`),
  ADD KEY `fk_application_id_assessment` (`application_id`),
  ADD KEY `fk_job_id_assessment` (`job_id`);

--
-- Indexes for table `js_assessment_answer`
--
ALTER TABLE `js_assessment_answer`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `fk_application_id_assessment_answer` (`applicant_id`),
  ADD KEY `fk_assessment_id_answer` (`assessment_id`);

--
-- Indexes for table `js_certifications`
--
ALTER TABLE `js_certifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `js_channel_interview`
--
ALTER TABLE `js_channel_interview`
  ADD PRIMARY KEY (`channel_id`),
  ADD KEY `fk_employer_id_channel_interview` (`employer_id`);

--
-- Indexes for table `js_company_contact`
--
ALTER TABLE `js_company_contact`
  ADD PRIMARY KEY (`company_contact_id`),
  ADD KEY `employer_id` (`employer_id`);

--
-- Indexes for table `js_company_info`
--
ALTER TABLE `js_company_info`
  ADD PRIMARY KEY (`company_id`),
  ADD KEY `fk_employer_company` (`employer_id`);

--
-- Indexes for table `js_declined_schedule`
--
ALTER TABLE `js_declined_schedule`
  ADD PRIMARY KEY (`decline_id`),
  ADD KEY `fk_interview_id_declined_schedule` (`interview_id`);

--
-- Indexes for table `js_education`
--
ALTER TABLE `js_education`
  ADD PRIMARY KEY (`id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `js_employer_info`
--
ALTER TABLE `js_employer_info`
  ADD PRIMARY KEY (`employer_id`);

--
-- Indexes for table `js_employer_notification`
--
ALTER TABLE `js_employer_notification`
  ADD PRIMARY KEY (`notif_id`),
  ADD KEY `fk_application_id_employer_notification` (`application_id`),
  ADD KEY `fk_job_id_employer_notification` (`job_id`);

--
-- Indexes for table `js_favorite_jobs`
--
ALTER TABLE `js_favorite_jobs`
  ADD PRIMARY KEY (`favorite_job_id`),
  ADD KEY `fk_applicant_id` (`applicant_id`),
  ADD KEY `fk_job_id` (`job_id`);

--
-- Indexes for table `js_founding_info`
--
ALTER TABLE `js_founding_info`
  ADD PRIMARY KEY (`founding_id`),
  ADD KEY `employer_id` (`employer_id`);

--
-- Indexes for table `js_interview_schedule`
--
ALTER TABLE `js_interview_schedule`
  ADD PRIMARY KEY (`interview_id`),
  ADD KEY `fk_application_id_new` (`application_id`),
  ADD KEY `fk_job_id_interview_schedule` (`job_id`),
  ADD KEY `fk_employer_id_interview_schedule` (`employer_id`);

--
-- Indexes for table `js_interview_status`
--
ALTER TABLE `js_interview_status`
  ADD PRIMARY KEY (`status_id`),
  ADD KEY `fk_interview_id_interview_status` (`interview_id`);

--
-- Indexes for table `js_job_alert`
--
ALTER TABLE `js_job_alert`
  ADD PRIMARY KEY (`alert_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `js_job_applicant_matches`
--
ALTER TABLE `js_job_applicant_matches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_match` (`applicant_id`,`job_id`),
  ADD KEY `fk_job_id_applicant_matches` (`job_id`);

--
-- Indexes for table `js_job_match_alerts`
--
ALTER TABLE `js_job_match_alerts`
  ADD PRIMARY KEY (`alert_id`),
  ADD KEY `applicant_id` (`applicant_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `js_join_request`
--
ALTER TABLE `js_join_request`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `fk_application_id_join_request` (`application_id`),
  ADD KEY `fk_job_id_join_request` (`job_id`);

--
-- Indexes for table `js_languages`
--
ALTER TABLE `js_languages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `js_licenses`
--
ALTER TABLE `js_licenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `js_notification`
--
ALTER TABLE `js_notification`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `fk_application_id` (`application_id`),
  ADD KEY `fk_job_id_notification` (`job_id`);

--
-- Indexes for table `js_personal_info`
--
ALTER TABLE `js_personal_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_applicant_personal_info` (`applicant_id`);

--
-- Indexes for table `js_post_jobs`
--
ALTER TABLE `js_post_jobs`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `employer_id` (`employer_id`);

--
-- Indexes for table `js_resubmit_tokens`
--
ALTER TABLE `js_resubmit_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `js_resume_builder`
--
ALTER TABLE `js_resume_builder`
  ADD PRIMARY KEY (`builder_id`),
  ADD KEY `fk_resume_builder_id` (`applicant_id`);

--
-- Indexes for table `js_resume_skills`
--
ALTER TABLE `js_resume_skills`
  ADD PRIMARY KEY (`skill_id`),
  ADD KEY `fk_skills_id` (`builder_id`);

--
-- Indexes for table `js_resume_work_experience`
--
ALTER TABLE `js_resume_work_experience`
  ADD PRIMARY KEY (`work_id`),
  ADD KEY `fk_experience_id` (`builder_id`);

--
-- Indexes for table `js_saved_assessment`
--
ALTER TABLE `js_saved_assessment`
  ADD PRIMARY KEY (`assessment_id`);

--
-- Indexes for table `js_screening_question`
--
ALTER TABLE `js_screening_question`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `fk_job_id` (`job_id`);

--
-- Indexes for table `js_skills`
--
ALTER TABLE `js_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `js_social_media_company`
--
ALTER TABLE `js_social_media_company`
  ADD PRIMARY KEY (`social_media_id`),
  ADD KEY `employer_id` (`employer_id`);

--
-- Indexes for table `js_work_experience`
--
ALTER TABLE `js_work_experience`
  ADD PRIMARY KEY (`id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `js_admin`
--
ALTER TABLE `js_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `js_applicants`
--
ALTER TABLE `js_applicants`
  MODIFY `applicant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `js_applicant_application`
--
ALTER TABLE `js_applicant_application`
  MODIFY `apply_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `js_applicant_application_resume`
--
ALTER TABLE `js_applicant_application_resume`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `js_applicant_resume`
--
ALTER TABLE `js_applicant_resume`
  MODIFY `resume_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `js_applicant_socialmedia`
--
ALTER TABLE `js_applicant_socialmedia`
  MODIFY `socialmedia_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `js_assessment`
--
ALTER TABLE `js_assessment`
  MODIFY `assessment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=344;

--
-- AUTO_INCREMENT for table `js_assessment_answer`
--
ALTER TABLE `js_assessment_answer`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=277;

--
-- AUTO_INCREMENT for table `js_certifications`
--
ALTER TABLE `js_certifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `js_channel_interview`
--
ALTER TABLE `js_channel_interview`
  MODIFY `channel_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `js_company_contact`
--
ALTER TABLE `js_company_contact`
  MODIFY `company_contact_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `js_company_info`
--
ALTER TABLE `js_company_info`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `js_declined_schedule`
--
ALTER TABLE `js_declined_schedule`
  MODIFY `decline_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `js_education`
--
ALTER TABLE `js_education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `js_employer_info`
--
ALTER TABLE `js_employer_info`
  MODIFY `employer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `js_employer_notification`
--
ALTER TABLE `js_employer_notification`
  MODIFY `notif_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `js_favorite_jobs`
--
ALTER TABLE `js_favorite_jobs`
  MODIFY `favorite_job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT for table `js_founding_info`
--
ALTER TABLE `js_founding_info`
  MODIFY `founding_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `js_interview_schedule`
--
ALTER TABLE `js_interview_schedule`
  MODIFY `interview_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `js_interview_status`
--
ALTER TABLE `js_interview_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `js_job_alert`
--
ALTER TABLE `js_job_alert`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `js_job_applicant_matches`
--
ALTER TABLE `js_job_applicant_matches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1399;

--
-- AUTO_INCREMENT for table `js_job_match_alerts`
--
ALTER TABLE `js_job_match_alerts`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `js_join_request`
--
ALTER TABLE `js_join_request`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `js_languages`
--
ALTER TABLE `js_languages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `js_licenses`
--
ALTER TABLE `js_licenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `js_notification`
--
ALTER TABLE `js_notification`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=274;

--
-- AUTO_INCREMENT for table `js_personal_info`
--
ALTER TABLE `js_personal_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `js_post_jobs`
--
ALTER TABLE `js_post_jobs`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=162;

--
-- AUTO_INCREMENT for table `js_resubmit_tokens`
--
ALTER TABLE `js_resubmit_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `js_resume_builder`
--
ALTER TABLE `js_resume_builder`
  MODIFY `builder_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `js_resume_skills`
--
ALTER TABLE `js_resume_skills`
  MODIFY `skill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1175;

--
-- AUTO_INCREMENT for table `js_resume_work_experience`
--
ALTER TABLE `js_resume_work_experience`
  MODIFY `work_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `js_screening_question`
--
ALTER TABLE `js_screening_question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `js_skills`
--
ALTER TABLE `js_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `js_social_media_company`
--
ALTER TABLE `js_social_media_company`
  MODIFY `social_media_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `js_work_experience`
--
ALTER TABLE `js_work_experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `js_applicant_application`
--
ALTER TABLE `js_applicant_application`
  ADD CONSTRAINT `js_applicant_application_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `js_applicant_application_resume` (`application_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `js_applicant_application_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `js_screening_question` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_applicant_application_resume`
--
ALTER TABLE `js_applicant_application_resume`
  ADD CONSTRAINT `js_applicant_application_resume_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `js_applicant_application_resume_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `js_post_jobs` (`job_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_applicant_resume`
--
ALTER TABLE `js_applicant_resume`
  ADD CONSTRAINT `fk_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_applicant_socialmedia`
--
ALTER TABLE `js_applicant_socialmedia`
  ADD CONSTRAINT `js_applicant_socialmedia_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_assessment`
--
ALTER TABLE `js_assessment`
  ADD CONSTRAINT `fk_application_id_assessment` FOREIGN KEY (`application_id`) REFERENCES `js_applicant_application_resume` (`application_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_job_id_assessment` FOREIGN KEY (`job_id`) REFERENCES `js_post_jobs` (`job_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_assessment_answer`
--
ALTER TABLE `js_assessment_answer`
  ADD CONSTRAINT `fk_application_id_assessment_answer` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_assessment_id_answer` FOREIGN KEY (`assessment_id`) REFERENCES `js_assessment` (`assessment_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_certifications`
--
ALTER TABLE `js_certifications`
  ADD CONSTRAINT `js_certifications_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_channel_interview`
--
ALTER TABLE `js_channel_interview`
  ADD CONSTRAINT `fk_employer_id_channel_interview` FOREIGN KEY (`employer_id`) REFERENCES `js_employer_info` (`employer_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_company_contact`
--
ALTER TABLE `js_company_contact`
  ADD CONSTRAINT `js_company_contact_ibfk_1` FOREIGN KEY (`employer_id`) REFERENCES `js_employer_info` (`employer_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_company_info`
--
ALTER TABLE `js_company_info`
  ADD CONSTRAINT `fk_employer_company` FOREIGN KEY (`employer_id`) REFERENCES `js_employer_info` (`employer_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_declined_schedule`
--
ALTER TABLE `js_declined_schedule`
  ADD CONSTRAINT `fk_interview_id_declined_schedule` FOREIGN KEY (`interview_id`) REFERENCES `js_interview_schedule` (`interview_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_education`
--
ALTER TABLE `js_education`
  ADD CONSTRAINT `js_education_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_employer_notification`
--
ALTER TABLE `js_employer_notification`
  ADD CONSTRAINT `fk_application_id_employer_notification` FOREIGN KEY (`application_id`) REFERENCES `js_applicant_application_resume` (`application_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_job_id_employer_notification` FOREIGN KEY (`job_id`) REFERENCES `js_post_jobs` (`job_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_favorite_jobs`
--
ALTER TABLE `js_favorite_jobs`
  ADD CONSTRAINT `fk_js_favorite_jobs_applicant` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_js_favorite_jobs_job` FOREIGN KEY (`job_id`) REFERENCES `js_post_jobs` (`job_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_founding_info`
--
ALTER TABLE `js_founding_info`
  ADD CONSTRAINT `js_founding_info_ibfk_1` FOREIGN KEY (`employer_id`) REFERENCES `js_employer_info` (`employer_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_interview_schedule`
--
ALTER TABLE `js_interview_schedule`
  ADD CONSTRAINT `fk_application_id_new` FOREIGN KEY (`application_id`) REFERENCES `js_applicant_application_resume` (`application_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_employer_id_interview_schedule` FOREIGN KEY (`employer_id`) REFERENCES `js_employer_info` (`employer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_job_id_interview_schedule` FOREIGN KEY (`job_id`) REFERENCES `js_post_jobs` (`job_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_interview_status`
--
ALTER TABLE `js_interview_status`
  ADD CONSTRAINT `fk_interview_id_interview_status` FOREIGN KEY (`interview_id`) REFERENCES `js_interview_schedule` (`interview_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_job_alert`
--
ALTER TABLE `js_job_alert`
  ADD CONSTRAINT `js_job_alert_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `js_post_jobs` (`job_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_job_applicant_matches`
--
ALTER TABLE `js_job_applicant_matches`
  ADD CONSTRAINT `fk_applicant_id_applicant_matches` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_job_id_applicant_matches` FOREIGN KEY (`job_id`) REFERENCES `js_post_jobs` (`job_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_job_match_alerts`
--
ALTER TABLE `js_job_match_alerts`
  ADD CONSTRAINT `js_job_match_alerts_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`),
  ADD CONSTRAINT `js_job_match_alerts_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `js_post_jobs` (`job_id`);

--
-- Constraints for table `js_join_request`
--
ALTER TABLE `js_join_request`
  ADD CONSTRAINT `fk_application_id_join_request` FOREIGN KEY (`application_id`) REFERENCES `js_applicant_application_resume` (`application_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_job_id_join_request` FOREIGN KEY (`job_id`) REFERENCES `js_post_jobs` (`job_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_languages`
--
ALTER TABLE `js_languages`
  ADD CONSTRAINT `js_languages_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_licenses`
--
ALTER TABLE `js_licenses`
  ADD CONSTRAINT `js_licenses_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_notification`
--
ALTER TABLE `js_notification`
  ADD CONSTRAINT `fk_application_id` FOREIGN KEY (`application_id`) REFERENCES `js_applicant_application_resume` (`application_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_job_id_notification` FOREIGN KEY (`job_id`) REFERENCES `js_post_jobs` (`job_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_personal_info`
--
ALTER TABLE `js_personal_info`
  ADD CONSTRAINT `fk_applicant_personal_info` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_post_jobs`
--
ALTER TABLE `js_post_jobs`
  ADD CONSTRAINT `fk_employer_id_job_post` FOREIGN KEY (`employer_id`) REFERENCES `js_employer_info` (`employer_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_resume_builder`
--
ALTER TABLE `js_resume_builder`
  ADD CONSTRAINT `fk_resume_builder_id` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_resume_skills`
--
ALTER TABLE `js_resume_skills`
  ADD CONSTRAINT `fk_skills_id` FOREIGN KEY (`builder_id`) REFERENCES `js_resume_builder` (`builder_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_resume_work_experience`
--
ALTER TABLE `js_resume_work_experience`
  ADD CONSTRAINT `fk_experience_id` FOREIGN KEY (`builder_id`) REFERENCES `js_resume_builder` (`builder_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_screening_question`
--
ALTER TABLE `js_screening_question`
  ADD CONSTRAINT `fk_job_id` FOREIGN KEY (`job_id`) REFERENCES `js_post_jobs` (`job_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_skills`
--
ALTER TABLE `js_skills`
  ADD CONSTRAINT `js_skills_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_social_media_company`
--
ALTER TABLE `js_social_media_company`
  ADD CONSTRAINT `js_social_media_company_ibfk_1` FOREIGN KEY (`employer_id`) REFERENCES `js_employer_info` (`employer_id`) ON DELETE CASCADE;

--
-- Constraints for table `js_work_experience`
--
ALTER TABLE `js_work_experience`
  ADD CONSTRAINT `js_work_experience_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `js_applicants` (`applicant_id`) ON DELETE CASCADE;

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `update_job_alert_status` ON SCHEDULE EVERY 1 SECOND STARTS '2024-12-16 22:33:26' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE js_job_alert
    SET status = 'Old'
    WHERE status = 'New' AND created_at < NOW() - INTERVAL 1 DAY;
END$$

CREATE DEFINER=`root`@`localhost` EVENT `delete_rejected_requests` ON SCHEDULE EVERY 10 SECOND STARTS '2025-02-13 09:36:55' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM js_join_request WHERE status = 'rejected'$$

CREATE DEFINER=`root`@`localhost` EVENT `delete_approved_requests` ON SCHEDULE EVERY 1 MINUTE STARTS '2025-02-13 09:44:24' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM js_join_request WHERE status = 'approved' AND approved_at <= NOW() - INTERVAL 15 MINUTE$$

CREATE DEFINER=`root`@`localhost` EVENT `delete_pending_requests` ON SCHEDULE EVERY 1 MINUTE STARTS '2025-02-13 17:44:04' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM js_join_request WHERE status = 'pending' AND created_at <= NOW() - INTERVAL 5 MINUTE$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
