<?php
  require_once('connect.php');
  header('Access-Control-Allow-Origin: https://seminic.000webhostapp.com');

try {
  $connect = connectQRApp();

  $json_params = $_POST['dados'];

  $decoded_params = json_decode($json_params, true);

  foreach ($decoded_params as $item) {
    $id = $item['propesp']['id'];

    $sql = 'UPDATE inscricao_2018 SET frequencia=:frequencia WHERE id=:id';
    $item = $connect->prepare($sql);

    $item->bindValue(':frequencia', 1);
    $item->bindValue(':id', $id);

    $item->execute();
  }
}

catch (PDOException $e) {
  echo $e->getMessage();
}
