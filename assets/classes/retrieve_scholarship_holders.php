<?php
  header('Content-type:application/json;charset=utf-8');

  $host = 'beja.ufpa.br';
  $username = 'seminariopibic';
  $password = 'd2JjcnFGMHVkeHQyaGRY';
  $db_name = 'beja_seminariopibic';
  $charset = 'utf8';

try {
  $connect = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
  /*** echo a message saying we have connected ***/
  // echo 'Connected to database <br />';

  // Get data from database
  $stmt = $connect->prepare("SELECT id FROM inscricao_2018");
  $stmt->execute();

  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Convert retrieved data to JSON
  $json = json_encode($result, JSON_UNESCAPED_SLASHES);

  // Write in a JSON file
  echo $json;
}
catch (PDOException $e) {
    echo $e->getMessage();
}
