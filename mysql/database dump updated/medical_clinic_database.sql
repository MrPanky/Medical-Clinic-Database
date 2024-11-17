CREATE DATABASE  IF NOT EXISTS `medical_clinic_database` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `medical_clinic_database`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: medical_clinic_database
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `appointment_ID` varchar(9) NOT NULL,
  `patientmedicalID` varchar(9) NOT NULL,
  `patientName` varchar(64) NOT NULL,
  `doctor` varchar(64) NOT NULL,
  `nurse` varchar(64) NOT NULL,
  `doctorID` varchar(9) NOT NULL,
  `appointment_type` varchar(50) NOT NULL,
  `nurseID` varchar(9) NOT NULL,
  `officeID` enum('North','South','East','West') DEFAULT NULL,
  `dateTime` datetime NOT NULL,
  `reason` varchar(100) NOT NULL,
  `treatments` varchar(150) DEFAULT NULL,
  `diagnoses` varchar(100) DEFAULT NULL,
  `allergies` varchar(100) DEFAULT NULL,
  `patientWeight` decimal(5,2) DEFAULT NULL,
  `patientBP` varchar(10) NOT NULL,
  `patientHR` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `created_by` varchar(9) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_edited_ID` varchar(9) DEFAULT NULL,
  PRIMARY KEY (`appointment_ID`),
  KEY `patientmedicalID` (`patientmedicalID`),
  KEY `doctorID` (`doctorID`),
  KEY `nurseID` (`nurseID`),
  KEY `appointment_ibfk_4` (`appointment_type`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`patientmedicalID`) REFERENCES `patient` (`medical_ID`),
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`doctorID`) REFERENCES `doctors` (`employee_ID`),
  CONSTRAINT `appointment_ibfk_3` FOREIGN KEY (`nurseID`) REFERENCES `nurses` (`employee_ID`),
  CONSTRAINT `appointment_ibfk_4` FOREIGN KEY (`appointment_type`) REFERENCES `billing_cost_table` (`appointment_type`),
  CONSTRAINT `appointment_chk_1` CHECK ((`appointment_ID` like _utf8mb4'A%')),
  CONSTRAINT `appointment_chk_2` CHECK (((`patientWeight` > 0) and (`patientWeight` < 1000))),
  CONSTRAINT `appointment_chk_3` CHECK ((`patientHR` between 50 and 150))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES ('A1234567','M12345678','Emily Johnson','John Doe','Jane Smith','E12345678','General Practitioner','E23456789','North','2023-10-15 10:00:00','Regular check-up',NULL,NULL,NULL,75.00,'120/80',72,'2023-10-01 12:00:00','admin',NULL,NULL),('A2345678','M12345678','Emily Johnson','Jimo Jones','Jane Smith','E5399533','Cardiologist','E23456789','South','2023-11-05 14:30:00','Review lab results',NULL,NULL,NULL,68.50,'115/75',68,'2023-10-01 12:00:00','admin',NULL,NULL),('A3456789','M12345678','Emily Johnson','John Smith','Jane Smith','E6552644','Radiologist','E23456789','East','2023-09-20 09:00:00','Flu symptoms',NULL,'Flu','None',82.00,'130/85',78,'2023-09-01 12:00:00','admin',NULL,NULL),('A4567890','M12345678','Emily Johnson','Mike Smith','Jane Smith','E88791285','Gastroenterologist','E23456789','West','2023-12-01 11:00:00','Routine vaccination',NULL,NULL,NULL,55.00,'110/70',65,'2023-10-01 12:00:00','admin',NULL,NULL),('A9876543','M12345678','Emily Johnson','Mike Smith','Jane Smith','E88791285','Gastroenterologist','E23456789','West','2025-12-15 10:00:00','Annual check-up','General health assessment',NULL,'Peanuts',68.50,'120/80',72,'2024-10-20 17:46:15','E12345678',NULL,NULL);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billing_cost_table`
--

DROP TABLE IF EXISTS `billing_cost_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billing_cost_table` (
  `appointment_type` varchar(50) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  PRIMARY KEY (`appointment_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billing_cost_table`
--

LOCK TABLES `billing_cost_table` WRITE;
/*!40000 ALTER TABLE `billing_cost_table` DISABLE KEYS */;
INSERT INTO `billing_cost_table` VALUES ('Cardiologist',250.00),('Gastroenterologist',175.00),('General Practitioner',100.00),('Immunologist',160.00),('Obstetrician',180.00),('Oncologist',200.00),('Pediatrician',120.00),('Radiologist',150.00);
/*!40000 ALTER TABLE `billing_cost_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingstaff`
--

DROP TABLE IF EXISTS `billingstaff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingstaff` (
  `employee_ID` varchar(9) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `availabilityMon` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityTues` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityWed` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityThurs` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityFri` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(50) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`employee_ID`),
  CONSTRAINT `billingstaff_ibfk_1` FOREIGN KEY (`employee_ID`) REFERENCES `employee` (`employee_ID`),
  CONSTRAINT `billingstaff_chk_1` CHECK ((`employee_ID` like _utf8mb4'E%')),
  CONSTRAINT `billingstaff_chk_2` CHECK ((`creatorID` like _utf8mb4'E%')),
  CONSTRAINT `billingstaff_chk_3` CHECK ((`last_editedID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingstaff`
--

LOCK TABLES `billingstaff` WRITE;
/*!40000 ALTER TABLE `billingstaff` DISABLE KEYS */;
INSERT INTO `billingstaff` VALUES ('E34567890','Bill','Jones','555-9876','bill.jones@example.com','789 Pine St','all day','all day','all day','all day','all day','2024-10-14 19:32:34','E34567890',NULL,NULL);
/*!40000 ALTER TABLE `billingstaff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `director`
--

DROP TABLE IF EXISTS `director`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `director` (
  `employee_ID` varchar(9) NOT NULL,
  `name` varchar(64) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `address` varchar(64) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(50) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  PRIMARY KEY (`employee_ID`),
  CONSTRAINT `director_chk_1` CHECK ((`employee_ID` like _utf8mb4'E%')),
  CONSTRAINT `director_chk_2` CHECK ((`creatorID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `director`
--

LOCK TABLES `director` WRITE;
/*!40000 ALTER TABLE `director` DISABLE KEYS */;
INSERT INTO `director` VALUES ('E56789012','Mike Davis','555-6789','654 Maple St','mike.davis@example.com','2024-10-14 19:32:34','E56789012',NULL),('E76543210','Olivia Newton','345-678-9012','789 Maple St, Gotham, USA','olivia.newton@gmail.com','2024-10-18 12:19:42','E76543210','2024-10-18 12:19:42'),('E87654321','James Tiberius','234-567-8901','456 Oak St, Metropolis, USA','james.tiberius@gmail.com','2024-10-18 12:19:42','E87654321','2024-10-18 12:19:42'),('E98765432','Samantha Carter','123-456-7890','123 Willow St, Springfield, USA','samantha.carter@gmail.com','2024-10-18 12:19:42','E98765432','2024-10-18 12:19:42');
/*!40000 ALTER TABLE `director` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `employee_ID` varchar(9) NOT NULL,
  `specialty` varchar(50) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `work_address` varchar(100) NOT NULL,
  `availabilityMon` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityTues` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityWed` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityThurs` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityFri` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(50) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`employee_ID`),
  KEY `idx_specialty` (`specialty`),
  CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`employee_ID`) REFERENCES `employee` (`employee_ID`),
  CONSTRAINT `doctors_chk_1` CHECK ((`employee_ID` like _utf8mb4'E%')),
  CONSTRAINT `doctors_chk_2` CHECK ((`creatorID` like _utf8mb4'E%')),
  CONSTRAINT `doctors_chk_3` CHECK ((`last_editedID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES ('E12345678','General Medicine','John','Doe','555-1234','john.doe@example.com','123 Main St','all day','all day','all day','all day','all day','2024-10-14 19:32:34','E12345678',NULL,NULL),('E5399533','Cardiologist','Jimo','Jones','3333333333',NULL,'123 sesame street','all day','all day','all day','all day','all day','2024-10-06 02:33:51',NULL,'2024-10-06 02:33:51',NULL),('E6552644','Radiologist','John','Smith','5555555555',NULL,'333 lucky ave','all day','all day','all day','all day','all day','2024-10-05 18:25:24',NULL,'2024-10-05 18:25:24',NULL),('E88791285','Gastroenterologist','Mike','Smith','5555555555',NULL,'122 milquetoast ln','all day','all day','all day','all day','all day','2024-10-19 17:21:06',NULL,'2024-10-19 17:21:06',NULL);
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors_patient`
--

DROP TABLE IF EXISTS `doctors_patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors_patient` (
  `doctor_ID` varchar(9) NOT NULL,
  `patient_ID` varchar(9) NOT NULL,
  PRIMARY KEY (`doctor_ID`,`patient_ID`),
  KEY `patient_ID` (`patient_ID`),
  CONSTRAINT `doctors_patient_ibfk_1` FOREIGN KEY (`doctor_ID`) REFERENCES `doctors` (`employee_ID`),
  CONSTRAINT `doctors_patient_ibfk_2` FOREIGN KEY (`patient_ID`) REFERENCES `patient` (`medical_ID`),
  CONSTRAINT `doctors_patient_chk_1` CHECK ((`doctor_ID` like _utf8mb4'E%')),
  CONSTRAINT `doctors_patient_chk_2` CHECK ((`patient_ID` like _utf8mb4'M%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors_patient`
--

LOCK TABLES `doctors_patient` WRITE;
/*!40000 ALTER TABLE `doctors_patient` DISABLE KEYS */;
INSERT INTO `doctors_patient` VALUES ('E12345678','M12345678');
/*!40000 ALTER TABLE `doctors_patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_ID` varchar(9) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `role` enum('Doctor','Nurse','BillingStaff','OfficeStaff','Director') NOT NULL,
  PRIMARY KEY (`employee_ID`),
  CONSTRAINT `employee_chk_1` CHECK ((`employee_ID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES ('E12345678','John','Doe','Doctor'),('E23456789','Jane','Smith','Nurse'),('E23483404','John','candy','OfficeStaff'),('E32646150','tim','jacks','OfficeStaff'),('E34567890','Bill','Jones','BillingStaff'),('E45678901','Alice','Brown','OfficeStaff'),('E5399533','Jimo','Jones','Doctor'),('E56789012','Mike','Davis','Director'),('E6552644','John','Smith','Doctor'),('E76543210','Olivia','Newton','Director'),('E80779948','John','Smith','Doctor'),('E87654321','James','Tiberius','Director'),('E88791285','Mike','Smith','Doctor'),('E98765432','Samantha','Carter','Director');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_password`
--

DROP TABLE IF EXISTS `employee_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_password` (
  `employee_ID` varchar(9) NOT NULL,
  `password` varchar(30) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_edited` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`employee_ID`),
  CONSTRAINT `employee_password_ibfk_1` FOREIGN KEY (`employee_ID`) REFERENCES `employee` (`employee_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_password`
--

LOCK TABLES `employee_password` WRITE;
/*!40000 ALTER TABLE `employee_password` DISABLE KEYS */;
INSERT INTO `employee_password` VALUES ('E12345678','Doctor','2024-10-14 19:33:47','2024-10-14 19:33:47'),('E23456789','Nurse','2024-10-14 19:33:47','2024-10-14 19:33:47'),('E34567890','BillingStaff','2024-10-14 19:33:47','2024-10-14 19:33:47'),('E45678901','OfficeStaff','2024-10-14 19:33:47','2024-10-14 19:33:47'),('E5399533','Abcd1234','2024-10-09 12:25:13','2024-10-09 12:25:13'),('E56789012','Director','2024-10-14 19:33:47','2024-10-14 19:33:47'),('E76543210','Director','2024-10-18 12:22:32','2024-10-18 12:22:32'),('E87654321','Director','2024-10-18 12:22:32','2024-10-18 12:22:32'),('E98765432','Director','2024-10-18 12:22:32','2024-10-18 12:22:32');
/*!40000 ALTER TABLE `employee_password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_schedule_location`
--

DROP TABLE IF EXISTS `employee_schedule_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_schedule_location` (
  `schedule_ID` varchar(9) NOT NULL,
  `mon_avail` enum('North','South','East','West') DEFAULT NULL,
  `tues_avail` enum('North','South','East','West') DEFAULT NULL,
  `wed_avail` enum('North','South','East','West') DEFAULT NULL,
  `thurs_avail` enum('North','South','East','West') DEFAULT NULL,
  `fri_avail` enum('North','South','East','West') DEFAULT NULL,
  `working_time` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(255) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`schedule_ID`),
  KEY `mon_avail` (`mon_avail`),
  KEY `tues_avail` (`tues_avail`),
  KEY `wed_avail` (`wed_avail`),
  KEY `thurs_avail` (`thurs_avail`),
  KEY `fri_avail` (`fri_avail`),
  CONSTRAINT `employee_schedule_location_ibfk_1` FOREIGN KEY (`mon_avail`) REFERENCES `office` (`location_ID`),
  CONSTRAINT `employee_schedule_location_ibfk_2` FOREIGN KEY (`tues_avail`) REFERENCES `office` (`location_ID`),
  CONSTRAINT `employee_schedule_location_ibfk_3` FOREIGN KEY (`wed_avail`) REFERENCES `office` (`location_ID`),
  CONSTRAINT `employee_schedule_location_ibfk_4` FOREIGN KEY (`thurs_avail`) REFERENCES `office` (`location_ID`),
  CONSTRAINT `employee_schedule_location_ibfk_5` FOREIGN KEY (`fri_avail`) REFERENCES `office` (`location_ID`),
  CONSTRAINT `employee_schedule_location_chk_1` CHECK ((`creatorID` like _utf8mb4'E%')),
  CONSTRAINT `employee_schedule_location_chk_2` CHECK ((`last_editedID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_schedule_location`
--

LOCK TABLES `employee_schedule_location` WRITE;
/*!40000 ALTER TABLE `employee_schedule_location` DISABLE KEYS */;
INSERT INTO `employee_schedule_location` VALUES ('','North','South','East','West','North','9 AM - 5 PM','2024-10-19 12:25:48',NULL,'2024-10-19 12:25:48',NULL),('E12345678','North','South','East','West','North','9 AM - 5 PM','2024-10-19 12:25:48',NULL,'2024-10-19 12:25:48',NULL),('E88791285','North','South','East','West','North','9 AM - 5 PM','2024-10-19 12:29:00','E88791285','2024-10-19 12:29:00','E88791285');
/*!40000 ALTER TABLE `employee_schedule_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `family_history`
--

DROP TABLE IF EXISTS `family_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `family_history` (
  `history_ID` int NOT NULL AUTO_INCREMENT,
  `medical_ID` varchar(9) NOT NULL,
  `relation` varchar(50) DEFAULT NULL,
  `conditions` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`history_ID`),
  KEY `medical_ID` (`medical_ID`),
  CONSTRAINT `family_history_ibfk_1` FOREIGN KEY (`medical_ID`) REFERENCES `medical_record` (`medical_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `family_history`
--

LOCK TABLES `family_history` WRITE;
/*!40000 ALTER TABLE `family_history` DISABLE KEYS */;
INSERT INTO `family_history` VALUES (1,'M12345678','Mother','Diabetes');
/*!40000 ALTER TABLE `family_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `appointment_ID` varchar(9) NOT NULL,
  `appointmentDateTime` datetime NOT NULL,
  `patientBillingID` varchar(9) NOT NULL,
  `InvoiceID` varchar(9) DEFAULT NULL,
  `patient_name` varchar(64) NOT NULL,
  `patient_address` varchar(100) NOT NULL,
  `patient_phone` varchar(15) NOT NULL,
  `patient_email` varchar(100) NOT NULL,
  `patient_insurance` varchar(100) NOT NULL,
  `services` varchar(150) NOT NULL,
  `amountCharged` decimal(10,2) NOT NULL,
  `amountDue` decimal(10,2) NOT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(50) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`appointment_ID`),
  KEY `patientBillingID` (`patientBillingID`),
  KEY `creatorID` (`creatorID`),
  CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`patientBillingID`) REFERENCES `patient` (`billingID`),
  CONSTRAINT `invoice_ibfk_2` FOREIGN KEY (`creatorID`) REFERENCES `billingstaff` (`employee_ID`),
  CONSTRAINT `invoice_chk_1` CHECK ((`appointment_ID` like _utf8mb4'A%')),
  CONSTRAINT `invoice_chk_2` CHECK ((`InvoiceID` like _utf8mb4'I%')),
  CONSTRAINT `invoice_chk_3` CHECK ((`creatorID` like _utf8mb4'E%')),
  CONSTRAINT `invoice_chk_4` CHECK ((`last_editedID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES ('A1234567','2023-10-15 10:00:00','B12345678','I1234567','Emily Johnson','123 Maple Ave, Apt 2, Springfield, IL, 62701','555-1234','emily.johnson@example.com','Insurance Co.','General Practitioner',100.00,100.00,'2023-10-01 12:00:00','E34567890',NULL,NULL),('A2345678','2023-11-05 14:30:00','B12345678','I2345678','Emily Johnson','123 Maple Ave, Apt 2, Springfield, IL, 62701','555-1234','emily.johnson@example.com','Insurance Co.','Cardiologist',250.00,250.00,'2023-10-01 12:00:00','E34567890',NULL,NULL),('A3456789','2023-09-20 09:00:00','B12345678','I3456789','Emily Johnson','123 Maple Ave, Apt 2, Springfield, IL, 62701','555-1234','emily.johnson@example.com','Insurance Co.','Radiologist',150.00,150.00,'2023-09-01 12:00:00','E34567890',NULL,NULL),('A4567890','2023-12-01 11:00:00','B12345678','I4567890','Emily Johnson','123 Maple Ave, Apt 2, Springfield, IL, 62701','555-1234','emily.johnson@example.com','Insurance Co.','Gastroenterologist',175.00,0.00,'2023-10-01 12:00:00','E34567890',NULL,NULL);
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_history`
--

DROP TABLE IF EXISTS `medical_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_history` (
  `history_ID` int NOT NULL AUTO_INCREMENT,
  `medical_ID` varchar(9) NOT NULL,
  `conditions` varchar(100) DEFAULT NULL,
  `treatment` varchar(100) DEFAULT NULL,
  `medication` varchar(100) DEFAULT NULL,
  `diagnosis_date` date DEFAULT NULL,
  `resolved` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`history_ID`),
  KEY `medical_ID` (`medical_ID`),
  CONSTRAINT `medical_history_ibfk_1` FOREIGN KEY (`medical_ID`) REFERENCES `medical_record` (`medical_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_history`
--

LOCK TABLES `medical_history` WRITE;
/*!40000 ALTER TABLE `medical_history` DISABLE KEYS */;
INSERT INTO `medical_history` VALUES (1,'M12345678','Hypertension','Lifestyle changes','Lisinopril','2024-01-10',0);
/*!40000 ALTER TABLE `medical_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_record`
--

DROP TABLE IF EXISTS `medical_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_record` (
  `medical_ID` varchar(9) NOT NULL,
  `height` int DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `sex` enum('Male','Female','Other') NOT NULL,
  `birthdate` date NOT NULL,
  `allergies` varchar(100) DEFAULT NULL,
  `emergency_contact_info` varchar(500) NOT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(50) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`medical_ID`),
  CONSTRAINT `medical_record_ibfk_1` FOREIGN KEY (`medical_ID`) REFERENCES `patient` (`medical_ID`),
  CONSTRAINT `medical_record_chk_1` CHECK ((`medical_ID` like _utf8mb4'M%')),
  CONSTRAINT `medical_record_chk_2` CHECK ((`height` between 10 and 84)),
  CONSTRAINT `medical_record_chk_3` CHECK (((`weight` > 0) and (`weight` <= 1000))),
  CONSTRAINT `medical_record_chk_4` CHECK ((`creatorID` like _utf8mb4'E%')),
  CONSTRAINT `medical_record_chk_5` CHECK ((`last_editedID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_record`
--

LOCK TABLES `medical_record` WRITE;
/*!40000 ALTER TABLE `medical_record` DISABLE KEYS */;
INSERT INTO `medical_record` VALUES ('M12345678',65,60.50,'Female','1994-06-15','None','John Johnson, 555-987-6543','2024-10-16 12:08:47','E12345678','2024-10-16 12:08:47','E12345678');
/*!40000 ALTER TABLE `medical_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nurses`
--

DROP TABLE IF EXISTS `nurses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nurses` (
  `employee_ID` varchar(9) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `work_address` varchar(100) NOT NULL,
  `availabilityMon` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityTues` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityWed` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityThurs` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityFri` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(50) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`employee_ID`),
  CONSTRAINT `nurses_ibfk_1` FOREIGN KEY (`employee_ID`) REFERENCES `employee` (`employee_ID`),
  CONSTRAINT `nurses_chk_1` CHECK ((`employee_ID` like _utf8mb4'E%')),
  CONSTRAINT `nurses_chk_2` CHECK ((`creatorID` like _utf8mb4'E%')),
  CONSTRAINT `nurses_chk_3` CHECK ((`last_editedID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nurses`
--

LOCK TABLES `nurses` WRITE;
/*!40000 ALTER TABLE `nurses` DISABLE KEYS */;
INSERT INTO `nurses` VALUES ('E23456789','Jane','Smith','555-5678','jane.smith@example.com','456 Elm St','all day','all day','all day','all day','all day','2024-10-14 19:32:34','E23456789',NULL,NULL);
/*!40000 ALTER TABLE `nurses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `office`
--

DROP TABLE IF EXISTS `office`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `office` (
  `location_ID` enum('North','South','East','West') NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `hours_of_operation` varchar(50) NOT NULL,
  `director_ID` varchar(9) NOT NULL,
  `holidays` varchar(150) DEFAULT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(50) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_edited_ID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`location_ID`),
  KEY `director_ID` (`director_ID`),
  CONSTRAINT `office_ibfk_1` FOREIGN KEY (`director_ID`) REFERENCES `director` (`employee_ID`),
  CONSTRAINT `office_chk_1` CHECK ((`creatorID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office`
--

LOCK TABLES `office` WRITE;
/*!40000 ALTER TABLE `office` DISABLE KEYS */;
INSERT INTO `office` VALUES ('North','North Office','123 North St, Houston','north.office@medcenter.com','555-0001','Mon-Fri 9am-5pm','E98765432','','2024-10-16 12:01:28','E56789012','2024-10-16 12:01:28','E56789012'),('South','South Office','456 South St, Houston','south.office@medcenter.com','555-0002','Mon-Fri 9am-5pm','E87654321','','2024-10-16 12:01:28','E56789012','2024-10-16 12:01:28','E56789012'),('East','East Office','789 East St, Houston','east.office@medcenter.com','555-0003','Mon-Fri 9am-5pm','E76543210','','2024-10-16 12:01:28','E56789012','2024-10-16 12:01:28','E56789012'),('West','West Office','321 West St, Houston','west.office@medcenter.com','555-0004','Mon-Fri 9am-5pm','E56789012','','2024-10-16 12:01:28','E56789012','2024-10-16 12:01:28','E56789012');
/*!40000 ALTER TABLE `office` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `officestaff`
--

DROP TABLE IF EXISTS `officestaff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `officestaff` (
  `employee_ID` varchar(9) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `manager` tinyint(1) DEFAULT NULL,
  `availabilityMon` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityTues` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityWed` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityThurs` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `availabilityFri` enum('morning','afternoon','all day','not available') DEFAULT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(50) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`employee_ID`),
  CONSTRAINT `officestaff_chk_1` CHECK ((`employee_ID` like _utf8mb4'E%')),
  CONSTRAINT `officestaff_chk_2` CHECK ((`creatorID` like _utf8mb4'E%')),
  CONSTRAINT `officestaff_chk_3` CHECK ((`last_editedID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `officestaff`
--

LOCK TABLES `officestaff` WRITE;
/*!40000 ALTER TABLE `officestaff` DISABLE KEYS */;
INSERT INTO `officestaff` VALUES ('E23483404','John','Candy','5555555555','john.candy@gmail.com','22 candy world',NULL,'all day','all day','all day','all day','all day','2024-10-20 21:43:26',NULL,'2024-10-20 21:43:26',NULL),('E32646150','tim','jacks','3333333333','timjacks@gmail.com','work world',NULL,'all day','all day','all day','all day','all day','2024-10-20 21:50:17',NULL,'2024-10-20 21:50:17',NULL),('E45678901','Alice','Brown','555-4321','alice.brown@example.com','321 Oak St',0,'all day','all day','all day','all day','all day','2024-10-14 19:32:34','E45678901',NULL,NULL);
/*!40000 ALTER TABLE `officestaff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `medical_ID` varchar(9) NOT NULL,
  `billingID` varchar(9) DEFAULT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `age` int DEFAULT NULL,
  `birthdate` date NOT NULL,
  `address_line_1` varchar(64) NOT NULL,
  `address_line_2` varchar(64) DEFAULT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `zip` varchar(10) NOT NULL,
  `personal_email` varchar(100) NOT NULL,
  `work_email` varchar(100) DEFAULT NULL,
  `home_phone` varchar(15) NOT NULL,
  `work_phone` varchar(15) DEFAULT NULL,
  `cell_phone` varchar(15) DEFAULT NULL,
  `emergency_contact_info` varchar(500) NOT NULL,
  `is_child` tinyint(1) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(50) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`medical_ID`),
  UNIQUE KEY `billingID` (`billingID`),
  CONSTRAINT `patient_chk_1` CHECK ((`medical_ID` like _utf8mb4'M%')),
  CONSTRAINT `patient_chk_2` CHECK ((`billingID` like _utf8mb4'B%')),
  CONSTRAINT `patient_chk_3` CHECK ((`age` between 0 and 110)),
  CONSTRAINT `patient_chk_4` CHECK ((length(`emergency_contact_info`) > 20)),
  CONSTRAINT `patient_chk_5` CHECK ((`creatorID` like _utf8mb4'E%')),
  CONSTRAINT `patient_chk_6` CHECK ((`last_editedID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES ('M12345678','B12345678','Emily','Johnson',30,'1994-06-15','123 Maple Ave','Apt 2','Springfield','IL','62701','emily.johnson@example.com',NULL,'555-1234',NULL,'555-5678','John Johnson, 555-9876',0,0.00,'2024-10-14 19:39:31','E12345678',NULL,NULL);
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_password`
--

DROP TABLE IF EXISTS `patient_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_password` (
  `medical_ID` varchar(9) NOT NULL,
  `password` varchar(30) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_edited` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `medical_ID` (`medical_ID`),
  CONSTRAINT `patient_password_ibfk_1` FOREIGN KEY (`medical_ID`) REFERENCES `patient` (`medical_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_password`
--

LOCK TABLES `patient_password` WRITE;
/*!40000 ALTER TABLE `patient_password` DISABLE KEYS */;
INSERT INTO `patient_password` VALUES ('M12345678','Patient','2024-10-14 19:39:31','2024-10-14 19:39:31');
/*!40000 ALTER TABLE `patient_password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referral`
--

DROP TABLE IF EXISTS `referral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referral` (
  `referral_ID` varchar(9) NOT NULL,
  `originating_doctor_ID` varchar(9) NOT NULL,
  `originating_doctor_contact_info` varchar(15) NOT NULL,
  `receiving_doctor_ID` varchar(9) NOT NULL,
  `receiving_doctor_contact_info` varchar(15) NOT NULL,
  `patient_ID` varchar(9) NOT NULL,
  `patient_contact_info` varchar(15) NOT NULL,
  `status` enum('not reviewed','accepted','rejected') DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `date_reviewed` datetime DEFAULT NULL,
  `reason` varchar(200) NOT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(255) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`referral_ID`),
  KEY `originating_doctor_ID` (`originating_doctor_ID`),
  KEY `receiving_doctor_ID` (`receiving_doctor_ID`),
  KEY `patient_ID` (`patient_ID`),
  CONSTRAINT `referral_ibfk_1` FOREIGN KEY (`originating_doctor_ID`) REFERENCES `doctors` (`employee_ID`),
  CONSTRAINT `referral_ibfk_2` FOREIGN KEY (`receiving_doctor_ID`) REFERENCES `doctors` (`employee_ID`),
  CONSTRAINT `referral_ibfk_3` FOREIGN KEY (`patient_ID`) REFERENCES `patient` (`medical_ID`),
  CONSTRAINT `referral_chk_1` CHECK ((`referral_ID` like _utf8mb4'R%')),
  CONSTRAINT `referral_chk_2` CHECK ((`creatorID` like _utf8mb4'E%')),
  CONSTRAINT `referral_chk_3` CHECK ((`last_editedID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referral`
--

LOCK TABLES `referral` WRITE;
/*!40000 ALTER TABLE `referral` DISABLE KEYS */;
/*!40000 ALTER TABLE `referral` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `schedule_ID` varchar(9) NOT NULL,
  `mon_avail` varchar(50) DEFAULT NULL,
  `tues_avail` varchar(50) DEFAULT NULL,
  `wed_avail` varchar(50) DEFAULT NULL,
  `thurs_avail` varchar(50) DEFAULT NULL,
  `fri_avail` varchar(50) DEFAULT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(50) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(50) DEFAULT NULL,
  `working_time` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`schedule_ID`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`schedule_ID`) REFERENCES `doctors` (`employee_ID`),
  CONSTRAINT `schedule_chk_1` CHECK ((`creatorID` like _utf8mb4'E%')),
  CONSTRAINT `schedule_chk_2` CHECK ((`last_editedID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_history`
--

DROP TABLE IF EXISTS `test_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_history` (
  `test_ID` int NOT NULL AUTO_INCREMENT,
  `medical_ID` varchar(9) NOT NULL,
  `test_name` varchar(100) DEFAULT NULL,
  `test_date` date DEFAULT NULL,
  `result` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`test_ID`),
  KEY `medical_ID` (`medical_ID`),
  CONSTRAINT `test_history_ibfk_1` FOREIGN KEY (`medical_ID`) REFERENCES `medical_record` (`medical_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_history`
--

LOCK TABLES `test_history` WRITE;
/*!40000 ALTER TABLE `test_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-23 16:32:37
