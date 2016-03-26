-- MySQL dump 10.13  Distrib 5.5.40, for Win32 (x86)
--
-- Host: localhost    Database: yun
-- ------------------------------------------------------
-- Server version	5.5.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `joke`
--

DROP TABLE IF EXISTS `joke`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `joke` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `joke_type` int(2) DEFAULT NULL,
  `joke_title` varchar(16) NOT NULL DEFAULT '',
  `joke_content` text NOT NULL,
  `create-time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updata_time` datetime DEFAULT NULL,
  `up_userId` int(6) NOT NULL DEFAULT '0',
  `love` int(5) NOT NULL DEFAULT '0',
  `hate` int(5) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `joke`
--

LOCK TABLES `joke` WRITE;
/*!40000 ALTER TABLE `joke` DISABLE KEYS */;
/*!40000 ALTER TABLE `joke` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `joke_comment`
--

DROP TABLE IF EXISTS `joke_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `joke_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `joke_id` int(11) NOT NULL DEFAULT '0',
  `coment_userId` int(5) NOT NULL DEFAULT '0',
  `comment_createTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `comment_upTime` datetime DEFAULT '0000-00-00 00:00:00',
  `content` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `joke_comment`
--

LOCK TABLES `joke_comment` WRITE;
/*!40000 ALTER TABLE `joke_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `joke_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `joke_type`
--

DROP TABLE IF EXISTS `joke_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `joke_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `joke_type`
--

LOCK TABLES `joke_type` WRITE;
/*!40000 ALTER TABLE `joke_type` DISABLE KEYS */;
INSERT INTO `joke_type` VALUES (1,'内涵'),(2,'经典笑话'),(3,'休闲笑话'),(4,'搞笑笑话'),(5,'冷笑话');
/*!40000 ALTER TABLE `joke_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `level`
--

DROP TABLE IF EXISTS `level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `level`
--

LOCK TABLES `level` WRITE;
/*!40000 ALTER TABLE `level` DISABLE KEYS */;
INSERT INTO `level` VALUES (1,'初级笑匠'),(2,'中级笑匠'),(3,'高级笑匠'),(4,'初级笑星'),(5,'中级笑星'),(6,'高级笑星'),(7,'初级门主'),(8,'中级门主'),(9,'高级门主');
/*!40000 ALTER TABLE `level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL DEFAULT '',
  `password` varchar(16) NOT NULL DEFAULT '',
  `sex` bit(1) DEFAULT NULL,
  `age` int(3) DEFAULT NULL,
  `phone_num` varchar(11) DEFAULT '',
  `level` int(11) NOT NULL DEFAULT '1',
  `email` varchar(20) DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `up-time` datetime DEFAULT NULL,
  `follow` int(5) NOT NULL DEFAULT '0',
  `dynamic` int(5) NOT NULL DEFAULT '0',
  `love` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'huazaierli','12345678','',25,'18381333613',2,'755836844@qq.com','0000-00-00 00:00:00',NULL,0,0,100),(2,'zhushunyuan','12345678','',15,'18381333613',4,'755836844@qq.com','0000-00-00 00:00:00',NULL,0,0,0),(3,'denyouming','12345678','\0',14,'18381333613',6,'755836844@qq.com','0000-00-00 00:00:00',NULL,0,0,0),(4,'shijinhua','12345678',NULL,NULL,'',0,NULL,'0000-00-00 00:00:00',NULL,0,0,0),(5,'shijinhua','12345678',NULL,NULL,'',0,NULL,'2016-02-28 22:16:14',NULL,0,0,0),(6,'shijinhua','12345678',NULL,NULL,'',0,NULL,'2016-02-28 22:16:52',NULL,0,0,0),(7,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:01',NULL,0,0,0),(8,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:01',NULL,0,0,0),(9,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:01',NULL,0,0,0),(10,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:01',NULL,0,0,0),(11,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:02',NULL,0,0,0),(12,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:02',NULL,0,0,0),(13,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:02',NULL,0,0,0),(14,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:02',NULL,0,0,0),(15,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:03',NULL,0,0,0),(16,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:03',NULL,0,0,0),(17,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:03',NULL,0,0,0),(18,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:03',NULL,0,0,0),(19,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:04',NULL,0,0,0),(20,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:04',NULL,0,0,0),(21,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:04',NULL,0,0,0),(22,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:05',NULL,0,0,0),(23,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:05',NULL,0,0,0),(24,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:05',NULL,0,0,0),(25,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:06',NULL,0,0,0),(26,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:06',NULL,0,0,0),(27,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:06',NULL,0,0,0),(28,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:07',NULL,0,0,0),(29,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:07',NULL,0,0,0),(30,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:07',NULL,0,0,0),(31,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:08',NULL,0,0,0),(32,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:08',NULL,0,0,0),(33,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:08',NULL,0,0,0),(34,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:09',NULL,0,0,0),(35,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:09',NULL,0,0,0),(36,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:09',NULL,0,0,0),(37,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:09',NULL,0,0,0),(38,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:10',NULL,0,0,0),(39,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:10',NULL,0,0,0),(40,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:10',NULL,0,0,0),(41,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:10',NULL,0,0,0),(42,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:11',NULL,0,0,0),(43,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:11',NULL,0,0,0),(44,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:11',NULL,0,0,0),(45,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:11',NULL,0,0,0),(46,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:12',NULL,0,0,0),(47,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:12',NULL,0,0,0),(48,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:12',NULL,0,0,0),(49,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:12',NULL,0,0,0),(50,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:13',NULL,0,0,0),(51,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:13',NULL,0,0,0),(52,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:13',NULL,0,0,0),(53,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:13',NULL,0,0,0),(54,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:14',NULL,0,0,0),(55,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:14',NULL,0,0,0),(56,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:14',NULL,0,0,0),(57,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:14',NULL,0,0,0),(58,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:15',NULL,0,0,0),(59,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:15',NULL,0,0,0),(60,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:15',NULL,0,0,0),(61,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:16',NULL,0,0,0),(62,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:16',NULL,0,0,0),(63,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:16',NULL,0,0,0),(64,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:16',NULL,0,0,0),(65,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:17',NULL,0,0,0),(66,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:17',NULL,0,0,0),(67,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:17',NULL,0,0,0),(68,'shijinhua','12345678',NULL,NULL,'',1,NULL,'2016-02-28 22:18:17',NULL,0,0,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-03-26 10:48:33
