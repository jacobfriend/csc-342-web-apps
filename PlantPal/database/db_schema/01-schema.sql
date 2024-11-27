-- MySQL Workbench Forward Engineering
SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS,
    UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS,
    FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE,
    SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
-- -----------------------------------------------------
-- Schema plantpal
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema plantpal
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `plantpal` DEFAULT CHARACTER SET utf8;
USE `plantpal`;
-- -----------------------------------------------------
-- Table `plantpal`.`Profiles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plantpal`.`Profiles`;
CREATE TABLE IF NOT EXISTS `plantpal`.`Profiles` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL UNIQUE,
    `image` VARCHAR(45) NOT NULL DEFAULT '/default.jpg',
    `water` DECIMAL(4, 2) NOT NULL,
    `sun` INT UNSIGNED NOT NULL,
    `soil` DECIMAL(4, 2) NOT NULL,
    `temp` INT UNSIGNED NOT NULL,
    `info` TEXT NULL,
    `tags` JSON NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `plantpal`.`Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plantpal`.`Users`;
CREATE TABLE IF NOT EXISTS `plantpal`.`Users` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `hash` VARCHAR(255) NOT NULL,
    `salt` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `plantpal`.`Plants`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plantpal`.`Plants`;
CREATE TABLE IF NOT EXISTS `plantpal`.`Plants` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `profile_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_watered` TIMESTAMP NULL,
    `images` JSON NULL,
    PRIMARY KEY (`id`),
    INDEX `profile_id_idx` (`profile_id` ASC) VISIBLE,
    INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
    CONSTRAINT `profile_id` FOREIGN KEY (`profile_id`) REFERENCES `plantpal`.`Profiles` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `plantpal`.`Users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `plantpal`.`JournalEntries`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plantpal`.`JournalEntries`;
CREATE TABLE IF NOT EXISTS `plantpal`.`JournalEntries` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plant_id` INT UNSIGNED NOT NULL,
    `content` VARCHAR(250) NOT NULL,
    `time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `plant_id_idx` (`plant_id` ASC) VISIBLE,
    CONSTRAINT `plant_id` FOREIGN KEY (`plant_id`) REFERENCES `plantpal`.`Plants` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `plantpal`.`HeightMeasurements`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plantpal`.`HeightMeasurements`;
CREATE TABLE IF NOT EXISTS `plantpal`.`HeightMeasurements` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plant_id` INT UNSIGNED NOT NULL,
    `value` DECIMAL(6, 2) NOT NULL,
    `time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `plant_id_idx` (`plant_id` ASC) VISIBLE,
    CONSTRAINT `plant_id0` FOREIGN KEY (`plant_id`) REFERENCES `plantpal`.`Plants` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `plantpal`.`SoilMeasurements`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plantpal`.`SoilMeasurements`;
CREATE TABLE IF NOT EXISTS `plantpal`.`SoilMeasurements` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plant_id` INT UNSIGNED NOT NULL,
    `value` DECIMAL(4, 2) NOT NULL,
    `time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `plant_id_idx` (`plant_id` ASC) VISIBLE,
    CONSTRAINT `plant_id00` FOREIGN KEY (`plant_id`) REFERENCES `plantpal`.`Plants` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `plantpal`.`LeafMeasurements`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plantpal`.`LeafMeasurements`;
CREATE TABLE IF NOT EXISTS `plantpal`.`LeafMeasurements` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plant_id` INT UNSIGNED NOT NULL,
    `value` INT NOT NULL,
    `time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `plant_id_idx` (`plant_id` ASC) VISIBLE,
    CONSTRAINT `plant_id01` FOREIGN KEY (`plant_id`) REFERENCES `plantpal`.`Plants` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `plantpal`.`FruitMeasurements`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plantpal`.`FruitMeasurements`;
CREATE TABLE IF NOT EXISTS `plantpal`.`FruitMeasurements` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plant_id` INT UNSIGNED NOT NULL,
    `value` INT NOT NULL,
    `time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `plant_id_idx` (`plant_id` ASC) VISIBLE,
    CONSTRAINT `plant_id02` FOREIGN KEY (`plant_id`) REFERENCES `plantpal`.`Plants` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB;
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;