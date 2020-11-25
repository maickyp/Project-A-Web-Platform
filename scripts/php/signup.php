<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');

    $data = json_decode($json);

    $new_user_name = $data->username;
    $new_user_password = $data->password;
    $new_user_materias = $data->materias;
    $new_user_sucursal = $data->sucursal;
    $new_user_user_Type = $data->userType;

    $error=0;

    if($new_user_name == ""){
        $error++;
    }

    else if($new_user_password == ""){
        $error++;
    }

    else if(strlen($new_user_password) < 6){
        $error++;
    }
    
    if($error==0){


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
                
                $sql = "INSERT INTO `users` (user, password, usertype, name, subject, workplace) VALUES ('$new_user_name','$new_user_password', '$new_user_user_Type', '$new_user_name', '$new_user_materias', '$new_user_sucursal')";
                
                $stmt = $conn->prepare($sql);
                

                $stmt->execute();

                $conn->commit();
                echo "Escritura completada";

            }catch(Exception $e) {
                echo "Rollback";
                echo $e->getMessage();
                $conn->rollback();
            }
            
            
        }catch(PDOException $e){
            echo "Connection failed: " . $e->getMessage();
        }

    }
    else{
        echo "Hubo un error";
    }
}





?>