(function(){
    'use strict';

    function mostrarAsesores() {

        Asesorias("scripts/php/asesores.php").then(function (response) {
            let obj = JSON.parse(response);
            let card = document.querySelector('#asesoresCard'); // Se selecciona la card objetivo donde se imprimiran
            let objLenght = Object.keys(obj).length;    // numero de asesores

            console.log(obj);

            for (let i = 0; i < objLenght; i++) {
                let newCol = document.createElement("div");     // Se crea un nuevo div
                newCol.setAttribute("class", "col-2");          // se le da atributos

                let newA = document.createElement("a");         // enlace
                newA.setAttribute("data-profile", obj[i].id_user);
                newA.setAttribute("class", "user");
                newA.setAttribute("href", "#");

                let newImg = document.createElement("img");     // imagen
                newImg.setAttribute("class", "img-fluid img-circle");
                newImg.setAttribute("src", profilePicPathAttachment(obj[i])); // se llama la función para obtener el path de la imagen

                let newUserName = document.createElement("div");
                newUserName.setAttribute("class", "row justify-content-center img-fluid d-md-block");
                newUserName.setAttribute("style", "color:black");
                newUserName.innerHTML = obj[i].name;

                newA.appendChild(newImg);               // se van agregando como hijos
                newA.appendChild(newUserName);

                newCol.appendChild(newA);

                card.appendChild(newCol);               // se inserta en el DOM
            }
        }, function (error) {
            console.error('Failed', error);
        });

    }


    function Asesorias(url, body, bodytag) {
        return new Promise(function (resolve, reject) {

            let request = new XMLHttpRequest();
            let formData = new FormData();
            formData.append(`${bodytag}`, body);

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

    
    
    $('#asesoresCard').on('click', "a",function () {
        let user_id = $(this)[0].attributes[0].value;
        if (window.confirm("¿Estas seguro de borrar el usuario?")) {
            Asesorias("scripts/php/eliminarUser.php", user_id, "id_user").then(function () {
                alert("Usuario Borrado satisfactoriamente");
                if (sessionStorage.getItem('idUser') == user_id){
                    sessionStorage.clear();
                    window.location.replace("index.html");
                }
                else(
                    window.location.replace('eliminarUsers.html')
                )
                

            }, function (error) {
                console.error('Failed', error);
            });
        }
    
    });

    document.addEventListener('DOMContentLoaded', function () {
        mostrarAsesores();

        
    });

    function profilePicPathAttachment(obj) {
        return "data/users/" + obj.picture;
    }

    // function asesoriaPathAttachment(obj) {
    //     return "data/asesorias/" + obj.path;
    // }

    // function getProfilePic(asesoria, asesores) {
    //     let idAsesor = asesoria.id_asesor;

    //     let asesoresLenght = Object.keys(asesores).length;

    //     for (let i = 0; i < asesoresLenght; i++) {
    //         if (asesores[i].id_user == idAsesor)
    //             return profilePicPathAttachment(asesores[i]);
    //     }
    // }

    // function getAsesorName(asesoria, asesores) {
    //     let idAsesor = asesoria.id_asesor;

    //     let asesoresLenght = Object.keys(asesores).length;

    //     for (let i = 0; i < asesoresLenght; i++) {
    //         if (asesores[i].id_user == idAsesor)
    //             return asesores[i].name;
    //     }
    // }
})();