<?php

date_default_timezone_set('America/Mexico_City');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {                                            // El server recibió algo por POST
    if (isset($_FILES['schedule'])) {                               // Son Archivos con el key fileName
        $errors = [];                                                                   // Aqui se guardarán los errores 
                                                            // Aqui se guardarán las imágenes 
        $extensions = ['jpg', 'jpeg', 'png', 'gif'];                                    // Las extensiones permitidas 
        
        
        $path = '../../data/'; 
        $file_name = $_FILES['schedule']['name'];                                  // Nombre
        $file_tmp = $_FILES['schedule']['tmp_name'];                               // Nombre temporal
        $file_type = $_FILES['schedule']['type'];                                  // Tipo de archivo
        $file_size = $_FILES['schedule']['size'];                                  // Tamaño en Bytes
            
        $temp = explode('.', $_FILES['schedule']['name']);
        $end_temp = end($temp);
        $file_ext = strtolower($end_temp);    // Extensión 
            
        $file = $path . 'schedule' . '.' . $file_ext;
            
        if (!in_array($file_ext, $extensions)) {                                    // El archivo subido tiene las extensiones permitidas
            $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;  // Sino, lo mete en error
        }
            
        if ($file_size > 5242880) {                                                 // El archivo subido tiene el tamaño permitido?
           $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;// Sino, lo mete en error
        }
            
        if (empty($errors)) {
            move_uploaded_file($file_tmp, $file);
            // header('Location: adminIndex.html');
            die();        
        }           


        if ($errors) print_r($errors);
    }
    

}


?>