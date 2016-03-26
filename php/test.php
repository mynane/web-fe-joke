<?php
	header('Content-Type:text/html;Charset=utf-8');
	require_once('./includes/M.class.php');

	$m=new mysql();
	$data=$m->query('select * from user');
	echo $data;
?>