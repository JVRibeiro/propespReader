<?php

include_once('connect.pdo.php');

function get_resumos(){
  $link = connectDB();
  
  $sql = "SELECT * FROM resumos_2018 WHERE tipo_bolsa=:tipo";
  $stmt = $link->prepare($sql);
  $stmt->bindValue(':tipo','PRODOUTOR RENOVACAO');
  $stmt->execute();
  $resumos = $stmt->fetchAll(PDO::FETCH_OBJ);
  return $resumos;
}

function get_resumo($id) {
  $link = connectDB();
  $sql = "SELECT * FROM resumos_2018 
        WHERE 
          id = :id LIMIT 1";
  $stmt = $link->prepare($sql);
  $stmt->bindValue(':id',$id);
  $stmt->execute();
  $res = $stmt->fetch(PDO::FETCH_OBJ);
  return $res;
}

function salvar_resumo(){
  
  $id = $_POST['id'];
  $titulo = $_POST['titulo'];
  $resumo = $_POST['resumo'];
  $palavras_chave = $_POST['palavras_chave'];
  //var_dump($_POST);exit;
  
  $link = connectDB();
  $sql = "UPDATE resumos_2018 SET titulo_plano_trabalho=:titulo,resumo=:resumo,palavras_chave=:palavras_chave WHERE id=:id";
  $stmt = $link->prepare($sql);
  $stmt->bindValue(':id', $id);
  $stmt->bindValue(':titulo', $titulo);
  $stmt->bindValue(':resumo', $resumo);
  $stmt->bindValue(':palavras_chave', $palavras_chave);
  $stmt->execute();
}



if(isset($_POST['salvar_resumo'])){
  //var_dump($_POST);exit; 
  salvar_resumo();
}elseif(isset($_GET['id']) && !empty($_GET['id'])){
  $res = get_resumo($_GET['id']);
}else{
  $resumos = get_resumos();
}
//var_dump($_POST);
?>

<!doctype html>
<html lang='pt-BR'>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no' />
    
    <style>

    tr:nth-child(even) {background-color: #f2f2f2;}
    </style>
  </head>
  
  <body>

  <h3>Conferência de Abertura</h3>
  
  <?php if(isset($res)) : ?>
    <form action="" id="cad-resumo" method="POST">
      <?php echo $res->nome_bolsista ?><br>
      <?php echo $res->area ?><br>
      Título:
      <textarea name="titulo" form="cad-resumo" rows="2" cols="100"><?php echo $res->titulo_plano_trabalho ?></textarea><br>
      Resumo:
      <textarea name="resumo" form="cad-resumo" rows="5" cols="100"><?php echo $res->resumo ?></textarea><br>
      Palavras-chaves:
      <textarea name="palavras_chave" form="cad-resumo" rows="1" cols="100"><?php echo $res->palavras_chave ?></textarea><br>
      <input type="hidden" name="id" value="<?php echo $res->id ?>">
      <input type="submit" name="salvar_resumo" value="Salvar">
      <button type="button" onclick="document.location.href='renov.php'">Voltar</button>
    </form> 
  <?php endif; ?>  
  
  <?php if(isset($resumos)) : ?>
  
  <?php endif; ?>
    
  <?php if(isset($resumos)) : ?>
  <table>
    <tr>
      <th>Bolsista</th>
      <th>Título</th>
      <th>Resumo</th>
    </tr>
    <?php foreach($resumos as $resumo) : ?>
      <tr>
        <td><a href="?id=<?php echo $resumo->id ?>" target="_self">Resumo</a></td>
        <td><?php echo $resumo->nome_bolsista ?></td>
        <td><?php echo $resumo->titulo_plano_trabalho ?></td>
      </tr>
    <?php endforeach; ?>
  </table>
  <?php endif; ?>
</body>
</html>

