<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');

    $data = json_decode($json);
       
        $servername = "localhost";
        $username = "root";
        $password = ""; 
        $dbname= "dbname";
        $user = $data->username;


    try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        try{
            $conn->beginTransaction();
            
            $sql = "SELECT user FROM `users` WHERE user='$user'";
            
            $stmt = $conn->prepare($sql);
            

            $stmt->execute();

            $conn->commit();

            $data = $stmt->fetchAll();

            if(!count($data)){
                echo "freeUser";
            }
            else{
                echo "NOT";
            }

        }catch(Exception $e) {
            echo "Rollback";
            echo $e->getMessage();
            $conn->rollback();
        }
        
        
    }catch(PDOException $e){
        echo "Connection failed: " . $e->getMessage();
    }


    }




?>