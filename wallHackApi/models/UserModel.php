<?php

function getUserByKey($licKey){
    $sql = "SELECT * FROM `users` WHERE `user_licKey` = '{$licKey}' LIMIT 1";
    $rs = mysqli_query($GLOBALS["db"],$sql);
    return mysqli_fetch_assoc($rs);
}

function setUserInfo($pathCheat, $userIdSync, $licKey){
    $sql = "UPDATE `users` SET `user_cheatPath` = '{$pathCheat}', `user_uniqueKey` = '{$userIdSync}' WHERE `user_licKey` = '{$licKey}'";
    $rs = mysqli_query($GLOBALS["db"],$sql);
    return $rs;
}

function setCheatPath($pathCheat, $userIdSync, $licKey){
    $sql = "UPDATE `users` SET `user_cheatPath` = '{$pathCheat}' WHERE `user_licKey` = '{$licKey}' AND `user_uniqueKey` = '{$userIdSync}'";
    $rs = mysqli_query($GLOBALS["db"],$sql);
    return $rs;
}

function setGamePath($licKey, $pathTarkov, $userIdSync){
    $sql = "UPDATE `users` SET `user_gamePath` = '{$pathTarkov}' WHERE `user_licKey` = '{$licKey}' AND `user_uniqueKey` = '{$userIdSync}'";
    $rs = mysqli_query($GLOBALS["db"],$sql);
    return $rs;
}

function checkLicKey($licKey, $userIdSync){
    $sql = "SELECT `user_licKey` FROM `users` WHERE `user_licKey` = '{$licKey}' AND `user_uniqueKey` = '{$userIdSync}' LIMIT 1";
    $rs = mysqli_query($GLOBALS["db"],$sql);
    return mysqli_fetch_assoc($rs); 
}