<?php

    if ($_SERVER['REQUEST_METHOD'] === 'POST'){

        $json = $_POST["json"];

        $data = json_decode($json);

        $user = $data->username;
        $newpassword = $data->password;



    $servername = "localhost";
    $username = "root";
    $password = ""; 
    $dbname= "dbname";

        if($user != ""){
            try {
                $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
                // set the PDO error mode to exception
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                                
                try{

                    $conn->beginTransaction();

                    $sql = "UPDATE `users` SET `password` = '$newpassword' WHERE `users`.`user` = '$user'";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute();
                    $conn->commit();
                    
                    echo "Se ha reestablecido la contraseña";
                }catch(Exception $e) {
                    echo "Rollback ";
                    echo $e->getMessage();
                    $conn->rollback();
                }
                                
                                
            }catch(PDOException $e){
                echo "Connection failed: " . $e->getMessage();
            }
        }
        else{
            echo "No usuario";
        }
    }


?>


