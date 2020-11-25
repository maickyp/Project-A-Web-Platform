<?php

    if ($_SERVER['REQUEST_METHOD'] === 'POST'){
        $json = $_POST["json"];

        $data = json_decode($json);

        $user = $data->username;
        $pass = $data->password;

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
                
                $sql = "SELECT * FROM `users` WHERE user='$user' and status=1";           
                
                $stmt = $conn->prepare($sql);

                $stmt->execute();

                $conn->commit();

                $data = $stmt->fetch();

                if($stmt->rowCount()==1){
                    if($data['password']==$pass){
                        $data[2] = "";
                        $data['password'] = "";
                        echo json_encode($data);
                    }
                    else{
                        echo "Contraseña incorreta";
                    } 
                }
                else{
                    echo "Usuario no existe";
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