# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 11.5.2-MariaDB-ubu2404)
# Database: ncparksdb
# Generation Time: 2024-10-30 17:03:42 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table county
# ------------------------------------------------------------

DROP TABLE IF EXISTS `county`;

CREATE TABLE `county` (
  `cty_id` int(11) NOT NULL AUTO_INCREMENT,
  `cty_name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`cty_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;



# Dump of table park
# ------------------------------------------------------------

DROP TABLE IF EXISTS `park`;

CREATE TABLE `park` (
  `par_id` int(11) NOT NULL AUTO_INCREMENT,
  `par_name` varchar(100) NOT NULL DEFAULT '',
  `par_lat` decimal(10,8) DEFAULT NULL,
  `par_lon` decimal(10,8) DEFAULT NULL,
  PRIMARY KEY (`par_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;



# Dump of table park_county
# ------------------------------------------------------------

DROP TABLE IF EXISTS `park_county`;

CREATE TABLE `park_county` (
  `pct_cty_id` int(11) NOT NULL,
  `pct_par_id` int(11) NOT NULL,
  PRIMARY KEY (`pct_cty_id`,`pct_par_id`),
  KEY `FK_PK` (`pct_par_id`),
  CONSTRAINT `FK_CTY` FOREIGN KEY (`pct_cty_id`) REFERENCES `county` (`cty_id`),
  CONSTRAINT `FK_PK` FOREIGN KEY (`pct_par_id`) REFERENCES `park` (`par_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `usr_id` int(11) NOT NULL AUTO_INCREMENT,
  `usr_first_name` varchar(100) NOT NULL DEFAULT '',
  `usr_last_name` varchar(100) NOT NULL DEFAULT '',
  `usr_username` varchar(150) NOT NULL DEFAULT '',
  `usr_password` varchar(255) NOT NULL DEFAULT '',
  `usr_salt` varchar(100) NOT NULL DEFAULT '',
  `usr_avatar` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;



# Dump of table user_visit
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_visit`;

CREATE TABLE `user_visit` (
  `uvs_usr_id` int(11) NOT NULL,
  `uvs_par_id` int(11) NOT NULL,
  PRIMARY KEY (`uvs_usr_id`,`uvs_par_id`),
  KEY `FK_PAR` (`uvs_par_id`),
  CONSTRAINT `FK_PAR` FOREIGN KEY (`uvs_par_id`) REFERENCES `park` (`par_id`),
  CONSTRAINT `FK_USR` FOREIGN KEY (`uvs_usr_id`) REFERENCES `user` (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
