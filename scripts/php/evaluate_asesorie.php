<?php
    $servername = "localhost";
    $username = "root";
    $password = ""; 
    $dbname= "dbname";

    $id_evaluador = $_POST["id_evaluador"];
    $id_asesoria = $_POST["id_asesoria"];
    $id_asesor = $_POST["id_asesor"];
    $id_evaluation = $_POST["evaluation"];

    try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                        
        try{
            $conn->beginTransaction();
                            
            $sql = "INSERT INTO `evaluaciones` (id_evaluador, id_asesoria, id_asesor, evaluation) VALUES ($id_evaluador,$id_asesoria,$id_asesor,$id_evaluation)";
                            
            $stmt = $conn->prepare($sql);
                            
            $stmt->execute();


            $conn->commit();
            
            echo "Evaluación con éxito";
            
        }catch(Exception $e) {
            echo "Rollback";
            echo $e->getMessage();
            $conn->rollback();
        }
                        
                        
    }catch(PDOException $e){
        echo "Connection failed: " . $e->getMessage();
    }


?>