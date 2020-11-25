<?php

    $servername = "localhost";
    $username = "root";
    $password = ""; 
    $dbname= "dbname";

    $id_user = $_POST["id_user"];
    try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $asesorias;
        
        // Recuperamos las asesorias
        try{
            $conn->beginTransaction();
                            
            $sql = "SELECT * FROM `asesorias` WHERE `status` = '1'";
                            
            $stmt = $conn->prepare($sql);
                            
            $stmt->execute();


            $conn->commit();
            
            $asesorias = $stmt->fetchAll();
            // and somewhere later:
            
        }catch(Exception $e) {
            echo "Rollback";
            echo $e->getMessage();
            $conn->rollback();
        }

        // Recuperamos la tabla de evaluaciones
        foreach($asesorias as $element){
            $id_asesoria = $element["id_asesoria"];
            try{
                $conn->beginTransaction();
                                
                $sql = "SELECT * FROM `evaluaciones` WHERE (id_evaluador=$id_user AND id_asesoria = $id_asesoria)";
                                
                $stmt = $conn->prepare($sql);
                                
                $stmt->execute();
    
    
                $conn->commit();
                
                $evaluaciones = $stmt->fetchAll();

                if(sizeof($evaluaciones)==0){
                    echo json_encode($element);
                    die();
                }


                // and somewhere later:
                
            }catch(Exception $e) {
                echo "Rollback";
                echo $e->getMessage();
                $conn->rollback();
            }






        }


                        
                        
    }catch(PDOException $e){
        echo "Connection failed: " . $e->getMessage();
    }




?>