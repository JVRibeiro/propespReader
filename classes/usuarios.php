<?php

$host = 'localhost';
$username = "root";
$password = "";
$db_name = 'qr_scanner';
$password = '';

try {
  $connect = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
  /*** echo a message saying we have connected ***/
  //echo 'Connected to database <br />';

  $stmt = $connect->prepare("SELECT nome, matricula, cpf FROM bolsistas");
  $stmt->execute();

  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

  $json = json_encode($result,JSON_UNESCAPED_SLASHES);

  file_put_contents('results.json', $json);
  echo "<script>window.open('results.json');</script>";
}
catch (PDOException $e) {
    echo $e->getMessage();
}
