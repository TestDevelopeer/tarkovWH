<?php

// Подключение к бд
define("HOST", "192.168.1.2");
define("USER", "root");
define("PASSWORD", "");
define("DB", "cheaters");

// Соединение с бд
$GLOBALS["db"] = mysqli_connect(HOST, USER, PASSWORD, DB) or die("Ошибка подключения MySql");
// Кодировка для текущего соединения
mysqli_set_charset($GLOBALS["db"], 'utf8');