<?php
  require_once('connect.php');

try {
  $connect = connectQRApp();

  $json_params = $_POST['dados'];

  $decoded_params = json_decode($json_params, true);

  foreach ($decoded_params as $item) {
    $id_bolsista = $item['propesp']['id_bolsista'];

    $sql = 'UPDATE frequencia SET presente=:presente WHERE id_bolsista=:id_bolsista';
    $item = $connect->prepare($sql);

    $item->bindValue(':presente', 1);
    $item->bindValue(':id_bolsista', $id_bolsista);

    $item->execute();
  }
}

catch (PDOException $e) {
  echo $e->getMessage();
}
