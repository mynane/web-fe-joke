<?php
	require_once('../includes/Db.php');
	$db= new DB();
	$sql='select Id,name from user';
	$result=$db->get_all($sql);
	$jsonData=null;
	if(count($result)>=0){
		$jsonData["data"]["allUser"] = $result;
		$jsonData["meta"]["code"] = 200;
		$jsonData["meta"]["message"]= "成功";
	}else{
	 	$jsonData["data"]=null;
	 	$jsonData["meta"]["code"]=500;
	 	$jsonData["meta"]["message"]="查寻失败";
	}
	echo json_encode($jsonData);
?>