<?php
// необходимые HTTP-заголовки
//$http_origin = $_SERVER['HTTP_ORIGIN'];
//var_dump($http_origin);
/*if ($http_origin == "*"){  
    header("Access-Control-Allow-Origin: $http_origin");
}*/
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Set-Cookie: key=value; path=/; HttpOnly; SameSite=None; Secure");

include_once '../config/config.php';
include_once '../config/db.php';
include_once '../library/mainFunctions.php';

session_start();

$controllerName = isset($_GET['controller']) ? ucfirst($_GET['controller']) : 'Index';
$smarty->assign('controllerName', $controllerName);

$actionName = isset($_GET['action']) ? $_GET['action'] : 'index';
$smarty->assign('actionName', $actionName);

loadPage($smarty, $controllerName, $actionName);