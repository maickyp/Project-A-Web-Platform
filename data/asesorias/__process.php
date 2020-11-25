<?php

date_default_timezone_set('America/Mexico_City');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {                                            // El server recibió algo por POST
    if (isset($_FILES['fileName'])) {                                                   // Son Archivos con el key fileName
        $errors = [];                                                                   // Aqui se guardarán los errores 
                                                            // Aqui se guardarán las imágenes 
        $extensions = ['jpg', 'jpeg', 'png', 'gif'];                                    // Las extensiones permitidas 
        
        $curso = $_POST["curso"];
        
        $all_files = count($_FILES['fileName']['tmp_name']);                            // Contar el numero de archivos subidos
        
        
        

        for ($i = 0; $i < $all_files; $i++) {                                           // Recorrimiento de cada uno de los archivos
            $path = '../../data/asesorias/'; 
            $file_name = $_FILES['fileName']['name'][$i];                                  // Nombre
            $file_tmp = $_FILES['fileName']['tmp_name'][$i];                               // Nombre temporal
            $file_type = $_FILES['fileName']['type'][$i];                                  // Tipo de archivo
            $file_size = $_FILES['fileName']['size'][$i];                                  // Tamaño en Bytes
            
            $temp= explode('.', $_FILES['fileName']['name'][$i]);
            $end_temp = end($temp);
            $file_ext = strtolower($end_temp);    // Extensión 

            $fecha = new DateTime();
            $timestamp = $fecha->format('Y-m-d H:i:s');

            $id_user = $_POST["id_user"];
            
            $file = $path . "$id_user". "_". $timestamp . '.' . $file_ext;
            
            if (!in_array($file_ext, $extensions)) {                                    // El archivo subido tiene las extensiones permitidas
                $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;  // Sino, lo mete en error
            }
            
            if ($file_size > 5242880) {                                                 // El archivo subido tiene el tamaño permitido?
                $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;// Sino, lo mete en error
            }
            
            if (empty($errors)) {
                
                if(isset($_POST["curso"])){
                    $servername = "localhost";
                    $username = "root";
                    $password = ""; 
                    $dbname= "dbname";
                    
                    
                    $temp = explode('../../data/asesorias/', $file);
                    $end_temp = end($temp);
                    $path = $end_temp;
                    
                    switch($_POST["curso"]){
                        case 1:
                            $curso = "Altos Puntajes + Material";
                        break;
                        
                        case 2:
                            $curso = "Altos Puntajes";
                        break;
                        
                        case 3:
                            $curso = "Dinámico";
                        break;
                        
                        case 4:
                            $curso = "Exani II";
                        break;
                    }

                    try {
                        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
                        // set the PDO error mode to exception
                        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                        
                        try{
                            $conn->beginTransaction();
                            
                            $sql = "INSERT INTO `asesorias` (path, curso, date, id_asesor, status) VALUES ('$path', '$curso', '$timestamp','$id_user', 1)";
                            
                            $stmt = $conn->prepare($sql);
                            

                            $stmt->execute();

                            $conn->commit();
                            echo "Escritura completada";
                            echo $file;
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
        
        sleep(1);
        }
    if ($errors) print_r($errors);
    }
    

}

?>