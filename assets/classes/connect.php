<?php

function connectQRApp() {
  $host = 'beja.ufpa.br';
  $username = 'seminariopibic';
  $password = 'd2JjcnFGMHVkeHQyaGRY';
  $db_name = 'beja_seminariopibic';
  $charset = 'utf8';

  $connect = new PDO("mysql:host=$host;dbname=$db_name;charset=$charset", $username, $password);
  $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  return $connect;
}
