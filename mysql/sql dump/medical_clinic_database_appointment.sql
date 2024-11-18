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
  `appointment_type` varchar(255) NOT NULL,
  `nurseID` varchar(9) NOT NULL,
  `officeID` int DEFAULT NULL,
  `dateTime` datetime NOT NULL,
  `reason` varchar(100) NOT NULL,
  `treatments` varchar(200) DEFAULT NULL,
  `diagnoses` varchar(100) DEFAULT NULL,
  `allergies` varchar(200) DEFAULT NULL,
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
  KEY `appointment_type` (`appointment_type`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`patientmedicalID`) REFERENCES `patient` (`medical_ID`),
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`doctorID`) REFERENCES `doctors` (`employee_ID`),
  CONSTRAINT `appointment_ibfk_3` FOREIGN KEY (`nurseID`) REFERENCES `nurses` (`employee_ID`),
  CONSTRAINT `appointment_ibfk_4` FOREIGN KEY (`appointment_type`) REFERENCES `doctors` (`specialty`),
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
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-25 15:04:18
