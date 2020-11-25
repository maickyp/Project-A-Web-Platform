(function(){
    'use strict';

    document.querySelector('#newUserCreationForm').addEventListener("submit", function (e) {
        e.preventDefault();
        let form = e.currentTarget;

        let errorCount=0;
    
        
        const userName = document.querySelector('#username');
        if (userName.value.length == 0){
            alert("El usuario debe de tener nombre");
            errorCount++;
        }
        else if (!userName.value.search(" ")) {
            alert("El usuario no debe tener espacios");
            errorCount++;
        }
        const password = document.querySelector('#password');
        if (password.value.length == 0){
            alert("El usuario debe de tener una contraseña");
            errorCount++;
        }
        else if (password.value.length < 6){
            alert("La contraseña del usuario debe tener 6 caractéres o más");
            errorCount++;
        }
        

        let materias = "";

        let sucursal = "";

        let userType = 0;


        $("[name=materia]:checked").each(function(){
            materias += this.value;
            materias += ", "
        });

        $("[name=sucursal]:checked").each(function(){
            sucursal += this.value;
        });

        $("[name=userType]:checked").each(function(){
            userType = this.value;
        });

        const hashPass = CryptoJS.SHA1(password.value);

        materias = materias.slice(0,-2);
               
        let newUser = {     
            "username": userName.value,
            "password": hashPass.toString(),
            "materias": materias,
            "sucursal": sucursal,
            "userType": userType
        };

        if(errorCount==0){
            //Creamos un nuevo request para validar el nombre de usuario y no esté repetido
            let request = new XMLHttpRequest();
            request.open("POST", "scripts/php/validateUserName.php");

            // want to distinguish from non-JS submits?
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.send(JSON.stringify(newUser));

            request.onload = function (e) {
                // clean up the form eventually
                if (request.responseTex == "Hubo un error"){
                    alert("Ha habido un error en la creación del usuario. Usuario o contraseña incorrectos");
                }
                else{          
                    if(request.responseText == "freeUser"){
                        //Creamos un nuevo request para escribir
                        request.open("POST", "scripts/php/signup.php");

                        // want to distinguish from non-JS submits?
                        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                        request.send(JSON.stringify(newUser));

                        request.onload = function (e) {
                            // clean up the form eventually    
                            console.log('Request Status', request.status);
                            console.log(request.responseText);
                            window.location.replace("adminIndex.html");
                        };
                    }
                    else{
                        alert("Usuario ya existente");
                    }
                }   

            };
        }

        //Creamos un nuevo request para escribir
        // let request = new XMLHttpRequest();
        // request.open("POST", "scripts/php/signup.php");

        // // want to distinguish from non-JS submits?
        // request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        // request.send(JSON.stringify(newUser));

        // request.onload = function (e) {
        //     // clean up the form eventually    
        //     console.log('Request Status', request.status);
        //     console.log(request.responseText);
        //     window.location.replace("adminIndex.html");
        // };
        
    });





    function request(url, body) {

        return new Promise(function (resolve, reject) {

            let request = new XMLHttpRequest();
            let formData = new FormData();
            formData.append("json", body);

            request.open('POST', url);

            request.setRequestHeader('X-Requested-Width', 'XMLHttpRequest');
            request.onload = function (e) {
                if (this.status == 200) {
                    resolve(this.response);
                } else {
                    reject(Error(this.status));
                }
            }

            request.onerror = function () {
                reject(Error('Network Error'));
            }

            request.send(formData);
        });
    }
})();