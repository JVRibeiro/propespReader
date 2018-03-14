<?php

$host = 'localhost';
$username = 'root';
$password = '';
$db_name = 'qr_scanner';
$password = '';

try {
  $connect = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
  /*** echo a message saying we have connected ***/
  // echo 'Connected to database <br />';

  // Get data from database
  $stmt = $connect->prepare("SELECT nome, matricula, cpf FROM bolsistas");
  $stmt->execute();

  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Convert retrieved data to JSON
  $json = json_encode($result, JSON_UNESCAPED_SLASHES);

  // Write in a JSON file
  file_put_contents('results.json', $json);

  // Open a new window with out JSON file (just for testing purposes)
  echo '<pre>'.$json.'</pre>';
}
catch (PDOException $e) {
    echo $e->getMessage();
}
