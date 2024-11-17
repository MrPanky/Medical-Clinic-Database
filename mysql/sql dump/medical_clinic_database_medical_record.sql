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
-- Table structure for table `medical_record`
--

DROP TABLE IF EXISTS `medical_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_record` (
  `medical_ID` varchar(9) NOT NULL,
  `height` int DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `sex` varchar(6) NOT NULL,
  `age` int DEFAULT NULL,
  `birthdate` date NOT NULL,
  `patient_doctors` varchar(255) DEFAULT NULL,
  `previous_medical_conditions` varchar(255) DEFAULT NULL,
  `previous_treatments` varchar(255) DEFAULT NULL,
  `previous_medications` varchar(255) DEFAULT NULL,
  `family_history` varchar(255) DEFAULT NULL,
  `appointment_history` varchar(255) DEFAULT NULL,
  `current_medications` varchar(255) DEFAULT NULL,
  `active_conditions` varchar(255) DEFAULT NULL,
  `test_history` varchar(255) DEFAULT NULL,
  `allergies` varchar(200) DEFAULT NULL,
  `vaccination_record` varchar(255) DEFAULT NULL,
  `insurance` varchar(200) DEFAULT NULL,
  `emergency_contact_information` varchar(800) DEFAULT NULL,
  `created` datetime NOT NULL,
  `creatorID` varchar(255) DEFAULT NULL,
  `last_edited` datetime DEFAULT NULL,
  `last_editedID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`medical_ID`),
  CONSTRAINT `medical_record_ibfk_1` FOREIGN KEY (`medical_ID`) REFERENCES `patient` (`medical_ID`),
  CONSTRAINT `medical_record_chk_1` CHECK ((`medical_ID` like _utf8mb4'M%')),
  CONSTRAINT `medical_record_chk_2` CHECK ((`height` between 10 and 84)),
  CONSTRAINT `medical_record_chk_3` CHECK (((`weight` > 0) and (`weight` <= 1000))),
  CONSTRAINT `medical_record_chk_4` CHECK ((`age` between 0 and 110)),
  CONSTRAINT `medical_record_chk_5` CHECK ((`creatorID` like _utf8mb4'E%')),
  CONSTRAINT `medical_record_chk_6` CHECK ((`last_editedID` like _utf8mb4'E%'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_record`
--

LOCK TABLES `medical_record` WRITE;
/*!40000 ALTER TABLE `medical_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `medical_record` ENABLE KEYS */;
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
