<?php
date_default_timezone_set('America/Mexico_City');
if ($_SERVER['REQUEST_METHOD'] === 'POST'){

    $json = $_POST["json"];

    $data = json_decode($json);

    $id_Asesor = $data->idAsesor;
    $time_Logged = $data->timeLogged;

    $fecha = new DateTime();
    $timestamp = $fecha->format('Y-m-d H:i:s');



    $servername = "localhost";
    $username = "root";
    $password = ""; 
    $dbname= "dbname";
        

    if($time_Logged != 0){
        try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                        
        try{
            $conn->beginTransaction();
                            
            $sql = "INSERT INTO `timelog` (id_asesor, date, minutes, status) VALUES ('$id_Asesor', '$timestamp', '$time_Logged', 0)";
                            
            $stmt = $conn->prepare($sql);
                            
            $stmt->execute();


            $conn->commit();
            
            $data = $stmt->fetchAll();
            // and somewhere later:
            
            echo "Log out exitoso";
            
        }catch(Exception $e) {
            echo "Rollback";
            echo $e->getMessage();
            $conn->rollback();
        }
                        
                        
    }catch(PDOException $e){
        echo "Connection failed: " . $e->getMessage();
    }
    }

}


?>