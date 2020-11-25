(function(){
    'use strict';

    const id_user = sessionStorage.getItem('idUser');
        
    if (sessionStorage.getItem('userType') == 3){
        let contable = document.querySelector("#Contable");
        contable.style.display = "none";
    }


    function task() {
        console.log("log out");
        let d = new Date();
        let timeLogout = d.getTime();
        let timeLogin = sessionStorage.getItem('login');

        let timeLogged = timeLogout - timeLogin;

        timeLogged /= 60000;
        timeLogged = Math.floor(timeLogged)

        console.log(timeLogged);

        const jsonString = {

            "idAsesor": sessionStorage.getItem('idUser'),
            "timeLogged": timeLogged
        }

        console.log(jsonString);
        console.log(JSON.stringify(jsonString));


        request("scripts/php/logout.php", JSON.stringify(jsonString)).then(function (resolve) {
            sessionStorage.clear();
            window.location.replace("index.html");
        }, function (error) {

        });
    }

    setTimeout(task, 1800000);
    // 1800000

    //función para mostrar los usuarios que hay
    function mostrarAsesores(){

        Asesorias("scripts/php/asesores.php").then(function(response){
            let obj = JSON.parse(response);
            let card = document.querySelector('#asesoresCard'); // Se selecciona la card objetivo donde se imprimiran
            let objLenght = Object.keys(obj).length;    // numero de asesores

            for (let i = 0; i < objLenght; i++) {
                let newCol = document.createElement("div");     // Se crea un nuevo div
                newCol.setAttribute("class", "col-2");          // se le da atributos

                let newA = document.createElement("a");         // enlace
                newA.setAttribute("href", "#");
                newA.setAttribute("class", "asesorInfo");
                newA.setAttribute("data-info", obj[i].id_user);

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
    

    //función para mostrar las ultimas asesorias subidas
    function lastAsesorias(){
        Asesorias("scripts/php/asesores.php").then(function (response) {

            let asesores = JSON.parse(response);

            Asesorias("scripts/php/last_asesories.php").then(function (response) {
                let asesorias = JSON.parse(response);       // Se recibe el array de las asesorias

                let card = document.querySelector('#AsesoriaLog');              // Se selecciona la card objetivo donde se imprimiran

                let asesoriasLenght = Object.keys(asesorias).length;

                for (let i = 0; i < asesoriasLenght; i++) {                      // numero de asesorias
                    let newLog = document.createElement('tr');              // Se crea un nueva entrada

                    let newAsesor = document.createElement('td');                                 //se crea nueva columna
                    let newImg = document.createElement('img');                               // se crea nueva imagen
                    newImg.setAttribute("src", getProfilePic(asesorias[i], asesores));          //se definen sus atribtutos
                    newImg.setAttribute("class", "img-circle img-size-32 mr-2 d-none d-md-inline");
                    let nombre = document.createTextNode(getAsesorName(asesorias[i], asesores));  // se defin el nombre del asesor



                    newAsesor.appendChild(newImg);              // se integran a la columna
                    newAsesor.appendChild(nombre);

                    let newCurso = document.createElement('td'); // nueva columna y su valor
                    newCurso.innerHTML = asesorias[i].curso;

                    let newHora = document.createElement('td');         // nueva columna y su valor
                    newHora.innerHTML = asesorias[i].date;

                    let newPath = document.createElement('td');          // nueva columna
                    let newA = document.createElement('a');             // enlace
                    newA.setAttribute("href", "#");
                    newA.setAttribute("class", "text-muted");


                    let newIcon = document.createElement('i');           // icono
                    newIcon.setAttribute("class", "far fa-eye");
                    newIcon.setAttribute("data-toggle", "modal");
                    newIcon.setAttribute("data-target", "#modal");
                    newIcon.setAttribute("data-path", asesoriaPathAttachment(asesorias[i]));  // target para el modal

                    newA.appendChild(newIcon); //se integra todo
                    newPath.appendChild(newA);

                    let newErase = document.createElement('td');
                    let newA2 = document.createElement('a');             // enlace
                    newA2.setAttribute("href", "#");
                    newA2.setAttribute("class", "text-muted");

                    newLog.appendChild(newAsesor);
                    newLog.appendChild(newCurso);
                    newLog.appendChild(newHora);
                    newLog.appendChild(newPath);
                    newLog.appendChild(newErase);

                    card.appendChild(newLog);  // se sube al DOM
                }

            }, function (error) {
                console.error('Failed', error);
            });

        }, function (error) {
            console.error('Failed', error);
        });


    }

    function loadProfileSettings(){
        let formData = new FormData();
        formData.append('id_user', id_user);
        let request = new XMLHttpRequest();

        request.open("POST", "scripts/php/load_user.php");
        
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(formData);

        request.onload = function (e){
            console.log('Request Status', request.status);
            let obj = JSON.parse(request.responseText);


            // Imagen de perfil
            let card = document.querySelector('#profilePic');

            let profilePic = document.createElement("img");
            profilePic.setAttribute("class", "profile-user-img img-fluid img-circle");
            profilePic.setAttribute("style","width: 150px");
            profilePic.setAttribute("src", profilePicPathAttachment(obj[0]));

            card.insertBefore(profilePic, card.childNodes[0]);

            // Nombre 
            card = document.querySelector("#profile-username");
            let name = document.createTextNode(obj[0].name);
            card.appendChild(name);

            // Usertype
            card = document.querySelector("#user_type");
            let usertype = "";
            if (obj[0].usertype == 1) {
                usertype = document.createTextNode("Administrador");
            }
            else if (obj[0].usertype == 2) {
                usertype = document.createTextNode("Asesor");
            }
            else if (obj[0].usertype == 3) {
                usertype = document.createTextNode("Evaluador");
            }
            card.appendChild(usertype);
        
        }
    }


    $('#example tbody').on('click', 'td.details-control', function () {
        
    });

    document.querySelector("#scheduleImg").addEventListener("input", function(){
        let formData = new FormData();

        const files = document.querySelector('[type=file]').files;
        if (files.length > 0) {
            formData.append('schedule', files[0]);
        }


        let request = new XMLHttpRequest();


        // do the request using form info
        request.open('POST', "scripts/php/updateSchedule.php");

        // want to distinguish from non-JS submits?
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(formData);

        request.onload = function (e) {

            let response = request.responseText;
            let error = "";

            if (response.includes("Extension not allowed")) {
                error += "La extensión del archivo no es la permitida. \n Debe ser: *.png, *.jpg, *.jpeg o *.gif.\n";
            }


            if (response.includes("File size exceeds limit")) {
                error += "El archivo excede el límite del tamaño permitido. \n El máximo permitido es 5 MB";
            }

            if (error.length > 0) {
                alert(error);
            }

            window.location.replace("adminIndex.html");



            // clean up the form eventually
            // console.log('Request Status', request.status);
            // console.log(request.responseText);
            // make this form usable again
            // submit.disabled = false;
            // enable the submit on abort/error too
            // to make the user able to retry
        };
     })

    document.querySelector('#scheduleUpload').addEventListener("submit", function (e) {
        e.preventDefault();
        let form = e.currentTarget;
 
    });

    document.addEventListener('DOMContentLoaded', function () {
        mostrarAsesores();
        lastAsesorias();
        loadProfileSettings(); 
        
        
    });

    function profilePicPathAttachment(obj){
        return "data/users/" + obj.picture;
    }
    
    function asesoriaPathAttachment(obj){
        return "data/asesorias/" + obj.path;
    }

    function getProfilePic(asesoria, asesores){
        let idAsesor = asesoria.id_asesor;

        let asesoresLenght = Object.keys(asesores).length;

        for(let i=0; i<asesoresLenght; i++){
            if(asesores[i].id_user == idAsesor)
                return profilePicPathAttachment(asesores[i]);
        }
    }

    function getAsesorName(asesoria, asesores){
        let idAsesor = asesoria.id_asesor;

        let asesoresLenght = Object.keys(asesores).length;

        for(let i=0; i<asesoresLenght; i++){
            if(asesores[i].id_user == idAsesor)
                return asesores[i].name;
        }
    }


    $('#modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('path') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('.embed-responsive-item').attr("src", recipient);
    })


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


    // $('#AsesoriaLog').click(
    //     function(e){
    //         let table = $('#AsesoriaLog').DataTable();

    //         $('#AsesoriaLog tbody').on('click', 'tr', function () {
    //             if ($(this).hasClass('selected')) {
    //                 $(this).removeClass('selected');
    //             }
    //             else {
    //                 table.$('tr.selected').removeClass('selected');
    //                 $(this).addClass('selected');
    //             }
    //         });

    //     }
    // )

})();