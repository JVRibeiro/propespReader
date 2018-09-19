<?php
  header('Content-type:application/json;charset=utf-8');
  header('Access-Control-Allow-Origin: http://jvribeiro.github.io');

  $host = 'beja.ufpa.br';
  $username = 'seminariopibic';
  $password = 'rjepk5VlmKnz2xt';
  $db_name = 'beja_seminariopibic';
  $charset = 'utf8';

  $connect = new PDO("mysql:host=$host;dbname=$db_name;charset=$charset", $username, $password);
  $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  try {
    // Get data from database
    $stmt = $connect->prepare("SELECT id FROM inscricao_2018");
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convert retrieved data to JSON
    $json = json_encode($result, JSON_UNESCAPED_SLASHES);


    echo $json;
  }
  catch (PDOException $e) {
      echo $e->getMessage();
  }
