-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: user
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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `googleId` varchar(255) DEFAULT NULL,
  `sub` varchar(255) DEFAULT NULL,
  `pin` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_name_unique` (`name`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'anwar','anwar@gmail.com','123','2024-09-24 06:03:52','2024-09-24 06:03:52',NULL,NULL,NULL),(2,'sugeng','sugeng@gmail.com','1234','2024-09-24 06:56:43','2024-09-24 06:56:43',NULL,NULL,NULL),(7,'toni','toni@gmail.com','$2b$10$ilLM.aZRUIbNYLM9xCIN6.it2SA8YAPB4SM8X9ZVBSxo2WZLA8ABm','2024-09-24 08:52:35','2024-09-24 08:52:35',NULL,NULL,NULL),(8,'lukas','lukas@gmail.com','$2b$10$POmBvAQ1R/8QiCHUYrtqseLL/X3eWVbYiC3XR2ULf8aLc/YN0KcN.','2024-09-24 09:50:04','2024-09-24 09:50:04',NULL,NULL,NULL),(10,'adawd','asd@gmail.com','$2b$10$wpsn32EPG5aauoJdtJt4veXoNTF0N0OJK/N6dU.P6o6sOMAQPhv9.','2024-09-24 09:52:38','2024-09-24 09:52:38',NULL,NULL,NULL),(11,'arif','arif@gmail.com','$2b$10$n1nwBbc4ANZP7m9QV0111uyLybU5AqcUu19TNZdjS79.3q.KVuGSe','2024-09-24 10:31:59','2024-09-24 10:31:59',NULL,NULL,NULL),(12,'speed','speed@gmail.com','$2b$10$R2rcL2DBRxSRbH/459YoJOSV317.fekfGac2kyCYN/BscNr2zsu/W','2024-09-24 10:34:01','2024-09-24 10:34:01',NULL,NULL,NULL),(14,'obeng ','obeng@gmail.com','$2b$10$MQVdL2ofQdRG0KatfC1cNOvmyjOOeLnNK2Hn2vXYrf8ObY5ImEfeO','2024-09-25 04:30:28','2024-09-25 04:30:28',NULL,NULL,NULL),(15,'bryan','bryan@gmail.com','$2b$10$aCqkaVPXCEnjDddL7Y6kv.Pte16JZ0h72nf6wP1cfqUNpCXJMRLYK','2024-09-25 05:05:26','2024-09-25 05:05:26',NULL,NULL,NULL),(16,'andre','andre@gmail.com','$2b$10$nzEr1ytJMUaRALxzWET.O.q4lOOGmXyJloW73Jtbgdp6iy/nmtR9q','2024-09-25 05:09:58','2024-09-25 05:09:58',NULL,NULL,NULL),(18,'ipank','ipank@gmail.com','$2b$10$JmoqYM6IA11uuR8zpcUgruEyJij.6y7HmAa9yFK4cTFjFIk6oiIYi','2024-09-25 09:53:32','2024-09-25 09:53:32',NULL,NULL,NULL),(19,'ani','ani@gmail.com','$2b$10$emp1ECvV8YmDC7kRwUWzLOLGGKek2J9JpTHpCXf0MotDve5dYUCuy','2024-09-27 08:29:08','2024-09-27 08:29:08',NULL,NULL,NULL),(21,'anton','anton@gmail.com','$2b$10$0QD2GUsDUSh3n4KjLGwtReihPPp6QswWzkGH.MICFudBEmZJOP6Li','2024-09-30 05:02:15','2024-09-30 05:02:15',NULL,NULL,NULL),(25,'wijaya','wijaya@gmail.com','$2b$10$yn43ZQFaZzZaiCPC9XrdCuF0luKErb1rAZDXXj5i8aCjyxXpJ/wTG','2024-09-30 05:49:58','2024-09-30 05:49:58',NULL,NULL,NULL),(26,'lintang','lintang@gmail.com','$2b$10$ZIS7aaTOXPwzQX971FAAAObxldRArj.b3/CW3i.AtdeckXIOfwG92','2024-09-30 07:00:55','2024-09-30 07:00:55',NULL,NULL,NULL),(32,'gelang','gelang@gmail.com','$2b$10$4FlPpZezTUYFOrm848ti7OmNBOJ14u6.TN7ClsW3Zga9SlLih0Y7O','2024-09-30 07:30:57','2024-09-30 07:30:57',NULL,NULL,NULL),(33,'fika','fika@gmail.com','$2b$10$MFDtVkz2L/fHCMEcsFewheHwbQ9E3i4etbJI790YA7GNoehfuxRhm','2024-09-30 07:34:30','2024-09-30 07:34:30',NULL,NULL,NULL),(34,'surya','surya@gmail.com','$2b$10$LQKzjAm0K4IG9t1OhqW5t.ytfKy1TJBPwVWxsuGtopQR7NmjCVneK','2024-09-30 07:48:14','2024-09-30 07:48:14',NULL,NULL,NULL),(35,'liu','liu@gmail.com','$2b$10$H8/y9bzrvN0sRwsQgyVek.kzbzAM37whAisUMFViwbm5bRsBo147K','2024-09-30 08:26:27','2024-09-30 08:26:27',NULL,NULL,NULL),(43,'luky','luky@gmail.com','$2b$10$sOWUoRsmv9bEaDUV0PBlnePyeKuslE840ebAmSEurzF3HOoFNhqE2','2024-10-01 03:22:39','2024-10-01 03:22:39',NULL,NULL,NULL),(44,'anas','anas@gmail.com','$2b$10$33b672ZrUxc5JBh6KJOQk.wDt2PVySebOizanSj9mqUOcnaGbA2pG','2024-10-01 03:56:07','2024-10-01 03:56:07',NULL,NULL,NULL),(45,'ruda','ruda@gmail.com','$2b$10$bthZLVHhzyFTqmbP0NMnh.559M7fns7Acvw2EhLsIqI6FqUVgd/72','2024-10-01 04:19:22','2024-10-01 04:19:22',NULL,NULL,NULL),(46,'sutris','sutris@gmail.com','$2b$10$ygxndanvTFi7I3SX7wLv2ey0J/Sag8M20fYHWtJFK4tssxtEv9F7S','2024-10-01 04:24:38','2024-10-01 04:24:38',NULL,NULL,NULL),(47,'badung','badung@gmail.com','$2b$10$A24gS3m2SVW8D645MNLaz.ydrHTtQ9.oVe0WDkIyNankr23TCY5Uy','2024-10-01 04:30:52','2024-10-01 04:30:52',NULL,NULL,NULL),(48,'pasti','pasti@gmail.com','$2b$10$dG63CZS1TF7gKEamz6aesOMc4j1IQAZacm0P6ebijFqvW8r0LfJLi','2024-10-01 04:33:27','2024-10-01 04:33:27',NULL,NULL,NULL),(49,'alok','alok@gmail.com','$2b$10$DDiXP0gB2/Ep17hc3hipv.LGeoAASUAziI6c7zvGV1vcXLxKHEzfG','2024-10-01 04:35:33','2024-10-01 04:35:33',NULL,NULL,NULL),(50,'wanto','wanto@gmail.com','$2b$10$5Yv9qo11iSmocOb5LwdopOcNiPnPDy.3mcmuNASyLM9pzg/2AJg5u','2024-10-02 02:50:43','2024-10-02 02:50:43',NULL,NULL,NULL),(53,'Nabil Amirudin (A710210032_Nabil)','nabilamirudin365@gmail.com',NULL,'2024-10-02 04:34:09','2024-10-02 04:34:09','109033652686528167312','109033652686528167312','000000'),(59,'yusa','yusa@gmail.com','$2b$10$xC0n.eNOHBTZhN6FQKWGYe0P5GirUDwU0CVbwovLxwpDGIYmVhp3S','2024-10-02 07:47:18','2024-10-02 07:47:18',NULL,NULL,NULL),(60,'andri','andri@gmail.com','$2b$10$fTupsjfyfzZAf87AOHDoq.Wnvsqs2bxydtIvzOLOOJEq1FAH4PshC','2024-10-02 08:52:49','2024-10-02 08:52:49',NULL,NULL,NULL),(61,'badru','badru@gmail.com','$2b$10$7m8yqdfInUk1XZzqLWaRV.pvdJ0hq06ftiPCrovS5vKUzgo27PEFy','2024-10-02 09:10:39','2024-10-02 09:10:39',NULL,NULL,NULL),(62,'labu','labu@gmail.com','$2b$10$9t9oWcAjte8DNdw8TgbhUuQ.Y8qDb1HxRCgDxqROPBYjWnGK6CBh.','2024-10-02 09:21:32','2024-10-02 09:21:32',NULL,NULL,NULL),(68,'nopal','nopal@gmail.com','$2b$10$17KqFla0C1pWBQEuVRzdEegNEjPNHVONGj/e7zXh8GsEjx82fP9jK','2024-10-03 09:11:22','2024-10-03 09:11:22',NULL,NULL,NULL),(69,'arman','arman@gmail.com','$2b$10$7OnJRXd/psZDvuNxOUK7r.eGVOdO2rY2ZzLB3Ce1YjRhPYbTO6ZWy','2024-10-09 04:13:31','2024-10-09 04:13:31',NULL,NULL,NULL),(70,'maulana','maulana@gmail.com','$2b$10$hdCriC0UgySHNP7x5satL.Zu.5961yt8UcSJQm9FWSK1C1ozpsq6O','2024-10-09 04:19:57','2024-10-09 04:19:57',NULL,NULL,NULL),(73,'iwan','iwan@gmail.com','$2b$10$5i1E34EN8V5RDiVnd/Y.e.vQ1I7pL5a6hyEkssg6lYYPM0fpKZnB.','2024-10-11 08:03:49','2024-10-11 08:03:49',NULL,NULL,NULL),(74,'lukman','lukman@gmail.com','$2b$10$PCve0.JEzjlw1kT76gcVo.XibEKdFF4XuWngMZkm11lwj/SMk/KZm','2024-10-11 08:07:03','2024-10-11 08:07:03',NULL,NULL,NULL),(75,'faje','faje@gmail.com','$2b$10$b/AN7Vh4EGBbvYwzGaxY.ex7PCkBcex2JZ3PbuAvTX4MYf/rhV3uO','2024-10-14 03:30:16','2024-10-14 03:30:16',NULL,NULL,NULL),(77,'surdi','surdi@gmail.com','$2b$10$G1W0qALErU9CrOiGep12Cu2Vs9StzfLgn0pQOeS6FXgbdlILesm4.','2024-10-14 05:16:27','2024-10-14 05:16:27',NULL,NULL,NULL),(78,'totok','totok@gmail.com','$2b$10$DIo53EU8vIj2BPtScjkSVupGe98fD.N0DiCOqVyyI/IJaFprvDNgC','2024-10-14 05:50:21','2024-10-14 05:50:21',NULL,NULL,NULL),(79,'alif','alif@gmail.com','$2b$10$RLkdYavBoIEtS/wSHMOrkuCo2/EpwedglwSvfrxPdlTEhJJRX8XJ2','2024-10-14 08:27:17','2024-10-14 08:27:17',NULL,NULL,'123456'),(80,'Nabil','a710210032@student.ums.ac.id',NULL,'2024-10-15 03:30:28','2024-10-15 03:30:28','102482406392740922630','102482406392740922630','000000');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-17 20:58:05
