(function(){
    'use strict';

    document.querySelector("#login").addEventListener("submit",function(e){
        e.preventDefault();

        const username = document.querySelector("#username").value;

        let password = document.querySelector("#password");
        const hashpass = CryptoJS.SHA1(password.value).toString();

        const credenciales = {
            "username" : username,
            "password" : hashpass
        }


        Asesorias("scripts/php/login.php", JSON.stringify(credenciales)).then(function (response) {

            const phpResponse = response;
            if (phpResponse == "Contraseña incorreta" || phpResponse == "Usuario no existe") {
                alert("Usuario o contraseña incorrectos")
            }
            else{
            let loggedUser = JSON.parse(response);

            //console.log(loggedUser);
            let d = new Date();
            // let timeLogin = d.getTime();

            sessionStorage.setItem('idUser', loggedUser.id_user);
            sessionStorage.setItem('userType', loggedUser.usertype);
            sessionStorage.setItem('login', d.getTime());


            // console.log(sessionStorage.getItem('idUser'));
            // console.log(sessionStorage.getItem('userType'));
            // console.log(sessionStorage.getItem('login'));

            if (sessionStorage.getItem('userType') == 2) {
                window.location.replace("profile.html");
            } else {
                window.location.replace("adminIndex.html");
            }
        }
        }, function (error) {

        });

    });


    document.querySelector('#resetPasswordBtn').addEventListener("click", function (e) {

        let username = document.querySelector('.modal-body [type=text]').value;

        // console.log(username);

        let hashpass = CryptoJS.SHA1("12345678").toString()

        const jsonString = {
            "username": username,
            "password": hashpass
        }

        // console.log(jsonString);
        Asesorias("scripts/php/resetPassword.php", JSON.stringify(jsonString)).then(function (response) {


        alert(response);
        window.location.replace("index.html");
        
        }, function (error) {
                console.log(error);
        });
    });


    function Asesorias(url, body) {

        return new Promise(function (resolve, reject) {

            let request = new XMLHttpRequest();
            let formData = new FormData();
            formData.append("json", body);

            request.open('POST', url);

            request.setRequestHeader('X-Requested-Width', 'XMLHttpRequest');
            request.onload = function (e) {
                if (this.status == 200) {
                    resolve(this.response);
                }
                else {
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