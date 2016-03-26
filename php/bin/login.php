<?php
	require_once('../includes/Db.php');
	$db= new DB();
	$sql='select Id from user where name="huazaierli"';
	$result=$db->get_one($sql);
	$jsonData=null;
	if($result['Id']){
		$jsonData["data"]["Id"] = $result['Id'];
		$jsonData["meta"]["code"] = 200;
		$jsonData["meta"]["message"]= "成功";
	}else{
	 	$jsonData["data"]=null;
	 	$jsonData["meta"]["code"]=500;
	 	$jsonData["meta"]["message"]="查寻失败";
	}
	echo json_encode($jsonData);
?>