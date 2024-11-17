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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-25 15:04:17
