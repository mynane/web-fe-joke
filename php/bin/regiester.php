<?php
	require_once('../includes/Db.php');
	$db= new DB();
	$time=date("Y-m-d H:i:s",time());
	$dataArr=array('name'=>'shijinhua','password'=>'12345678','create_time'=>$time);
	$result=$db->insert('user',$dataArr);
	$jsonData=null;
	if($result){
		$jsonData["data"] = null;
		$jsonData["meta"]["code"] = 200;
		$jsonData["meta"]["message"]= "插入成功";
	}else{
	 	$jsonData["data"]=null;
	 	$jsonData["meta"]["code"]=500;
	 	$jsonData["meta"]["message"]="插入失败";
	}
	echo json_encode($jsonData);
?>