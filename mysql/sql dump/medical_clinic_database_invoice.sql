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
  `patient_address` varchar(64) NOT NULL,
  `patient_phone` varchar(15) NOT NULL,
  `patient_email` varchar(255) NOT NULL,
  `patient_insurance` varchar(200) NOT NULL,
  `services` varchar(400) NOT NULL,
  `amountCharged` decimal(10,2) NOT NULL,
  `amountDue` decimal(10,2) NOT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(255) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`appointment_ID`),
  KEY `patientBillingID` (`patientBillingID`),
  CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`patientBillingID`) REFERENCES `patient` (`billingID`),
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
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
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
