<?php 

include_once('../models/UserModel.php');

function checkInput($str) {
	$invalid_characters = array("$", "%", "#", "<", ">", "|");
	$str = str_replace($invalid_characters, "", $str);
    $str = strip_tags($str);
    $str = stripslashes($str);
    $str = htmlspecialchars($str);
    $str = trim($str);
    return $str;
}

function initializeAction(){
	$info = json_decode(file_get_contents('php://input'), true);
	$licKey = checkInput($info['licKey']);
	$pathCheat = checkInput($info['pathCheat']);
	$userIdSync = checkInput($info['userIdSync']);
	if (strlen($licKey) == 16 && strlen($pathCheat) > 3 && strlen($userIdSync) > 3) {
		$user = getUserByKey($licKey);
		if ($user) {
			if (strlen($user['user_uniqueKey']) == 0){
				if (setUserInfo($pathCheat, $userIdSync, $licKey)) {
					$res['resultCode'] = 1;
				} else {
					$res['message'] = 'Не удалось инициализировать данные пользователя';
					$res['resultCode'] = 0;
					$res['showButtons'] = false;
				}
			} else {
				if (setCheatPath($pathCheat, $userIdSync, $licKey)) {
					$res['resultCode'] = 1;
				} else {
					$res['message'] = 'Ошибка инициализации';
					$res['resultCode'] = 0;
					$res['showButtons'] = false;
				}
			}
			$user = getUserByKey($licKey);
			$res['user'] = $user;
		} else {
			$res['message'] = 'Пользователь не найден, обратитесь к администратору';
			$res['resultCode'] = 0;
			$res['showButtons'] = false;
		}
	} else {
		$res['message'] = 'Неверные данные';
		$res['resultCode'] = 0;
		$res['showButtons'] = false;
	}
	http_response_code(200);
	echo json_encode($res, JSON_UNESCAPED_UNICODE);
}

function setgamepathAction(){
	$info = json_decode(file_get_contents('php://input'), true);
	$licKey = checkInput($info['licKey']);
	$pathTarkov = checkInput($info['pathTarkov']);
	$userIdSync = checkInput($info['userIdSync']);
	if (strlen($licKey) == 16 && strlen($pathTarkov) > 3 && strlen($userIdSync) > 3) {
		if (setGamePath($licKey, $pathTarkov, $userIdSync)) {
			$res['resultCode'] = 1;
			$res['gamePath'] = $pathTarkov;
		} else {
			$res['resultCode'] = 0;
			$res['message'] = 'Не удалось сохранить путь к игре';
			$res['showButtons'] = false;
		}
	} else {
		$res['message'] = 'Неверные данные';
		$res['resultCode'] = 0;
		$res['showButtons'] = false;
	}
	http_response_code(200);
	echo json_encode($res, JSON_UNESCAPED_UNICODE);
}

function checkuserAction(){
	$info = json_decode(file_get_contents('php://input'), true);
	$licKey = checkInput($info['licKey']);
	$userIdSync = checkInput($info['userIdSync']);
	if (strlen($licKey) == 16 && strlen($userIdSync) > 3) {
		$userLicKey = checkLicKey($licKey, $userIdSync);
		if ($userLicKey['user_licKey'] == $licKey) {
			$user = getUserByKey($licKey);
			if ($user) {
				$endDate = explode('.', $user['user_endDate']);
				$day = date("j");
				$month = date("n");
				$year = date("Y");
				if ($endDate[2] - $year == 0){
					if ($endDate[1] - $month == 0){
						if ($endDate[0] - $day > 0) {
							$res['resultCode'] = 1;
						} else {
							$res['resultCode'] = 0;
						}
					} else if ($endDate[1] - $month > 0) {
						$res['resultCode'] = 1;
					} else {
						$res['resultCode'] = 0;
					}
				} else if ($endDate[2] - $year > 0) {
					$res['resultCode'] = 1;
				} else {
					$res['resultCode'] = 0;
				}
				if ($res['resultCode'] == 0) {
					$res['message'] = 'Срок действия вашей лицензии истек! Оплатите, чтобы получить доступ!';
				}
			} else {
				$res['resultCode'] = 0;
				$res['message'] = 'Пользователь не найден';
			}
			
		} else {
			$res['resultCode'] = 0;
			$res['message'] = 'Неверный ключ для данного пользователя';
		}
	} else {
		$res['message'] = 'Неверные данные';
		$res['resultCode'] = 0;
		$res['showButtons'] = false;
	}
	http_response_code(200);
	echo json_encode($res, JSON_UNESCAPED_UNICODE);
}

 ?>