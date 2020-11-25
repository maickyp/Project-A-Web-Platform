<?php

    $servername = "localhost";
    $username = "root";
    $password = ""; 
    $dbname= "dbname";

    try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                        
        try{
            $conn->beginTransaction();
                            
            $sql = "SELECT `id_asesor`, SUM(`minutes`) AS `minutes` FROM `timelog` WHERE `status`=0 GROUP BY `id_asesor` ";
                            
            $stmt = $conn->prepare($sql);
                            
            $stmt->execute();


            $conn->commit();
            
            $data = $stmt->fetchAll();
            // and somewhere later:
            
            echo json_encode($data);
            
        }catch(Exception $e) {
            echo "Rollback";
            echo $e->getMessage();
            $conn->rollback();
        }
                        
                        
    }catch(PDOException $e){
        echo "Connection failed: " . $e->getMessage();
    }



?>