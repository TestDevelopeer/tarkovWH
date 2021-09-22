<?php
//основные функции
/*  
    Формирование стр
    $controllerName название контроллера
    $actionName название функции обработки стр
*/
function loadPage($smarty, $controllerName, $actionName = 'index') {
   include_once PathPrefix . $controllerName . PathPostfix;
    
    $function = $actionName . 'Action';
    $function($smarty);
}
/*
    загр шаблона
    $smarty объект шаблонизатора
    $templateName название фала шаблона
*/
function loadTemplate($smarty, $templateName) {
    $smarty ->display($templateName . TemplatePostfix);
}
/*
    d отладка, останавливает работу выводя значение переменной
    $value переменная для вывода ее на страницу
*/
function d($value = null, $die = 1) {
    echo 'Debug: <br><pre>';
    print_r($value);
    echo '<pre>';
    
    if($die) die;
}
/*
    преобр результата работы функции выборки в ассоц массив
    recordset $rs набор строк - рез работы select
*/
function createSmartyRsArray($rs) {
    if(!$rs) return false;
    $smartyRs = array();
    while($row = mysqli_fetch_assoc($rs)) {
        $smartyRs[] = $row;
    }
    return $smartyRs;
}

/*
    редирект
*/
function redirect($url) {
    if(!$url) $url = '/';
    header("Location: {$url}");
    exit;
}