<?php
header('Access-Control-Allow-Origin: http://jvribeiro.github.io');

$host = 'beja.ufpa.br';
$username = 'seminariopibic';
$password = 'rjepk5VlmKnz2xt';
$db_name = 'beja_seminariopibic';
$charset = 'utf8';

$connect = new PDO("mysql:host=$host;dbname=$db_name;charset=$charset", $username, $password);
$connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {
  $json_params = $_POST['dados'];

  $decoded_params = json_decode($json_params, true);

  foreach ($decoded_params as $item) {
    $id_inscricao = $item['propesp']['id_inscricao'];

    $sql = 'UPDATE inscricao_2018 SET frequencia=:frequencia WHERE id_inscricao=:id_inscricao';
    $item = $connect->prepare($sql);

    $item->bindValue(':frequencia', 1);
    $item->bindValue(':id_inscricao', $id_inscricao);

    $item->execute();
  }
}

catch (PDOException $e) {
  echo $e->getMessage();
}
