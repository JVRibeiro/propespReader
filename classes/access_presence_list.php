<?php
/**
* Send as JSON
*/
  //header("Content-Type: application/json", true);

  $host = 'localhost';
  $username = 'root';
  $password = '';
  $db_name = 'qr_scanner';
  $password = '';


try {
  $connect = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);


  function isValidJSON($str) {
     json_decode($str);
     return json_last_error() == JSON_ERROR_NONE;
  }

  $json_params = file_get_contents("php://input");

  if (strlen($json_params) > 0 && isValidJSON($json_params)) {
    $decoded_params = json_decode($json_params, true);
    $id_bolsista = $decoded_params['propesp']['id_bolsista'];

    foreach ($decoded_params as $elem) {
        $elem = $connect->prepare('update `presenca` set `presente` = 1 where `id_bolsista` = '.$id_bolsista);
        $elem->execute();
    }
  }
}

catch (PDOException $e) {
  echo $e->getMessage();
}
