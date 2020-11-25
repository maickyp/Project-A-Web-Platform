<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST'){

    $id_user = $_POST["id_user"];
    //Imagen de perfil
    if (isset($_FILES['profilePic'])){
        $errors = [];                                                                   // Aqui se guardarán los errores 
                                                           // Aqui se guardarán las imágenes 
        $extensions = ['jpg', 'jpeg', 'png', 'gif'];

        $id_user = $_POST['id_user'];
        $path = '../../data/users/'; 
        $file_name = $_FILES['profilePic']['name'];                                  // Nombre
        $file_tmp = $_FILES['profilePic']['tmp_name'];                               // Nombre temporal
        $file_type = $_FILES['profilePic']['type'];                                  // Tipo de archivo
        $file_size = $_FILES['profilePic']['size'];

        

        $temp= explode('.', $_FILES['profilePic']['name']);
        $end_temp = end($temp);
        $file_ext = strtolower($end_temp);    // Extensión 


        $date = new DateTime();
        $file = $path . $date->getTimestamp().$file_name;

        if (!in_array($file_ext, $extensions)) {                                    // El archivo subido tiene las extensiones permitidas
            $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;  // Sino, lo mete en error
        }
        
        if ($file_size > 2097152) {                                                 // El archivo subido tiene el tamaño permitido?
            $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;// Sino, lo mete en error
        }

        if (empty($errors)){
            $servername = "localhost";
            $username = "root";
            $password = ""; 
            $dbname= "dbname";

            $temp = explode('../../data/users/', $file);
            $end_temp = end($temp);
            $path = $end_temp;

            try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
                // set the PDO error mode to exception
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                try{
                    $conn->beginTransaction();
                    
                    $sql = "SELECT picture FROM users WHERE id_user='$id_user'";
                    
                    $stmt = $conn->prepare($sql);
                    

                    $stmt->execute();

                    $conn->commit();

                    $data = $stmt->fetch();

                    if($data["picture"]!="default.jpg"){
                        unlink('../../data/users/'.$data["picture"]);
                    }

                }catch(Exception $e) {
                    echo "Rollback";
                    echo $e->getMessage();
                    $conn->rollback();
                }

                try{
                    $conn->beginTransaction();
                    
                    $sql = "UPDATE `users` SET `picture` = '$path' WHERE `users`.`id_user` = '$id_user'; ";
                    
                    $stmt = $conn->prepare($sql);
                    

                    $stmt->execute();

                    $conn->commit();
                    move_uploaded_file($file_tmp, $file);

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
    // Password
    if(isset($_POST["newPassword"])){
        $servername = "localhost";
        $username = "root";
        $password = ""; 
        $dbname= "dbname";
        $error=0;

        $newPassword = $_POST["newPassword"];

        if($newPassword == ""){
        $error++;
        }

        else if(strlen($newPassword) < 6){
            $error++;
        }

        if($error==0){
            try {
                $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
                // set the PDO error mode to exception
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                try{
                    $conn->beginTransaction();
                    
                    $sql = "UPDATE `users` SET `password` = '$newPassword' WHERE `users`.`id_user` = '$id_user'; ";
                    
                    $stmt = $conn->prepare($sql);
                    

                    $stmt->execute();

                    $conn->commit();
                }catch(Exception $e) {
                    echo "Rollback";
                    echo $e->getMessage();
                    $conn->rollback();
                }
                
                
            }catch(PDOException $e){
                echo "Connection failed: " . $e->getMessage();
            }
        }
        else(
        echo "Hubo un error";
    )

    }

    //newName
    if(isset($_POST["newName"])){
        $servername = "localhost";
        $username = "root";
        $password = ""; 
        $dbname= "dbname";

        $newName = $_POST["newName"];

        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            try{
                $conn->beginTransaction();
                
                $sql = "SELECT name FROM users WHERE id_user='$id_user'";
                
                $stmt = $conn->prepare($sql);
                

                $stmt->execute();

                $conn->commit();

                $data = $stmt->fetch();

                if($data["name"]!= "$newName"){
                    try{
                        $conn->beginTransaction();
                        
                        $sql = "UPDATE `users` SET `name` = '$newName' WHERE `users`.`id_user` = '$id_user'; ";
                        
                        $stmt = $conn->prepare($sql);
                        
        
                        $stmt->execute();
        
                        $conn->commit();
        
                    }catch(Exception $e) {
                        echo "Rollback";
                        echo $e->getMessage();
                        $conn->rollback();
                    }
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

    //materias
    if(isset($_POST["materias"])){
        $servername = "localhost";
        $username = "root";
        $password = ""; 
        $dbname= "dbname";

        $materias = $_POST["materias"];

        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            try{
                $conn->beginTransaction();
                
                $sql = "SELECT name FROM users WHERE id_user='$id_user'";
                
                $stmt = $conn->prepare($sql);
                

                $stmt->execute();

                $conn->commit();

                $data = $stmt->fetch();

                if($data["subject"]!= "$materias"){
                    try{
                        $conn->beginTransaction();
                        
                        $sql = "UPDATE `users` SET `subject` = '$materias' WHERE `users`.`id_user` = '$id_user'; ";
                        
                        $stmt = $conn->prepare($sql);
                        
        
                        $stmt->execute();
        
                        $conn->commit();
        
                    }catch(Exception $e) {
                        echo "Rollback";
                        echo $e->getMessage();
                        $conn->rollback();
                    }
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

    //sucursal
    if(isset($_POST["sucursal"])){
        $servername = "localhost";
        $username = "root";
        $password = ""; 
        $dbname= "dbname";

        $sucursal = $_POST["sucursal"];

        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            try{
                $conn->beginTransaction();
                
                $sql = "SELECT name FROM users WHERE id_user='$id_user'";
                
                $stmt = $conn->prepare($sql);
                

                $stmt->execute();

                $conn->commit();

                $data = $stmt->fetch();

                if($data["workplace"]!= "$sucursal"){
                    try{
                        $conn->beginTransaction();
                        
                        $sql = "UPDATE `users` SET `workplace` = '$sucursal' WHERE `users`.`id_user` = '$id_user'; ";
                        
                        $stmt = $conn->prepare($sql);
                        
        
                        $stmt->execute();
        
                        $conn->commit();
        
                    }catch(Exception $e) {
                        echo "Rollback";
                        echo $e->getMessage();
                        $conn->rollback();
                    }
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


}



?>






