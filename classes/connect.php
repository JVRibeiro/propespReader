<?php

function connectQRApp() {
  $host = 'localhost';
  $username = 'root';
  $password = '';
  $db_name = 'qr_scanner';
  $password = '';
  $charset = 'utf8';

  $connect = new PDO("mysql:host=$host;dbname=$db_name;charset=$charset", $username, $password);
  $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  return $connect;
}
