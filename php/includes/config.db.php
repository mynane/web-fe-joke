<?php
	header('Content-Type:text/html;Charset=utf-8');
    $db_config["hostname"] = "localhost"; //服务器地址
    $db_config["username"] = "root"; //数据库用户名
    $db_config["password"] = "root"; //数据库密码
    $db_config["database"] = "yun"; //数据库名称
    $db_config["charset"] = "utf8";//数据库编码
    $db_config["pconnect"] = 1;//开启持久连接
    $db_config["log"] = 1;//开启日志
    $db_config["logfilepath"] = './';//开启日志
?>