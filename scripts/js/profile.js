(function(){
    'use strict';

    const id_user = sessionStorage.getItem('idUser');

    if(sessionStorage.getItem("userType")==2){
        let hide = document.querySelectorAll(".admin");
        hide.forEach(element =>{
            element.style.display = "none";
        })
    }

    document.querySelector('.custom-file-input').addEventListener('change', function (e) {
        let fileName = document.getElementById("fileName").files[0].name;
        let nextSibling = e.target.nextElementSibling
        nextSibling.innerText = fileName
    });

    document.querySelector('#asesoriaUpload').addEventListener("submit", function (e) {
        e.preventDefault();
        let form = e.currentTarget;

        const files = document.querySelector('[type=file]').files
        const curso = document.querySelector('#curso');
        let formData = new FormData();
        let submit = form.querySelector('[type=submit]');
        let request = new XMLHttpRequest();

        for (let i = 0; i < files.length; i++) {
            let file = files[i]
            formData.append('fileName[]', file);
        }

        formData.append('id_user', id_user);
        formData.append('curso', curso.value);
        submit.disabled = true;

        // do the request using form info
        request.open(form.method, form.action);

        // want to distinguish from non-JS submits?
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(formData);

        request.onload = function (e) {

            let response= request.responseText;
            let error = "";

            if (response.includes("Extension not allowed")){
                error+= "La extensión del archivo no es la permitida. \n Debe ser: *.png, *.jpg, *.jpeg o *.gif.\n";
            }

            if (response.includes("File size exceeds limit")){
                error += "El archivo excede el límite del tamaño permitido. \n El máximo permitido es 5 MB";
            }

            if(error.length>0){
                alert(error);
            }

            location.reload();
            // clean up the form eventually
            // console.log('Request Status', request.status);
            // console.log(request.responseText);
            // make this form usable again
            // submit.disabled = false;
            // enable the submit on abort/error too
            // to make the user able to retry
        };       
    });





    //thumbnail
    function handleFileSelect(evt) {
        let files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (let i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            let reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    let span = document.createElement('span');
                    span.innerHTML = ['<img class="thumb" height="100px" src="', e.target.result,
                        '" title="', escape(theFile.name), '"/>'].join('');
                    
                    document.getElementById('list').insertBefore(span, null);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    document.getElementById('fileName').addEventListener('change', handleFileSelect, false);


    $('#modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('path') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('.embed-responsive-item').attr("src", recipient);
    })
    
    function createAsesories() {
        let formData = new FormData();
        formData.append('id_user', id_user);
        let request = new XMLHttpRequest();
        request.open("POST", "scripts/php/user_asesories.php");

        // want to distinguish from non-JS submits?
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(formData);

        request.onload = function (e) {
            // clean up the form eventually
            // console.log('Request Status', request.status);
            let obj = JSON.parse(request.responseText);

            let card = document.querySelector('#user-asesorias');

            let objLenght = Object.keys(obj).length;

            for (let i = 0; i < objLenght; i++) {
                if (i % 12 === 0) {
                    let newElement = document.createElement("div");
                    newElement.setAttribute("class", "row justify-content-left");

                    let newDiv = document.createElement("div");
                    newDiv.setAttribute("class", "col");

                    newElement.appendChild(newDiv);

                    card.appendChild(newElement);
                }

                let newA = document.createElement("a");
                newA.setAttribute("href", "#");
                newA.setAttribute("data-toggle", "lightbox");
                newA.setAttribute("data-gallery", "gallery");

                let newImg = document.createElement("img");
                newImg.setAttribute("src", `https://via.placeholder.com/100/007bff/FFFFFF?text=${i+1}`);
                newImg.setAttribute("class", "img-fluid mb-2");
                newImg.setAttribute("data-toggle", "modal");
                newImg.setAttribute("data-target", "#modal");
                newImg.setAttribute("data-path", asesoriaPathAttachment(obj[i]));

                newA.appendChild(newImg);

                let row = document.querySelector("#user-asesorias").lastChild;

                row = row.querySelector("div div");

                row.appendChild(newA);
            }


        };

    }

    function loadProfileSettings(){
        let formData = new FormData();
        formData.append('id_user', id_user);
        let request = new XMLHttpRequest();

        request.open("POST", "scripts/php/load_user.php");
        
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(formData);

        request.onload = function (e){
            // console.log('Request Status', request.status);
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
            

            // Materias
            card = document.querySelector("#user_materias");
            const subjects = ["Matematicas","LecturayRedaccion","Ingles"]
            let materias = "";
            for(let i=0; i<subjects.length; i++){
                if(obj[0].subject.includes(subjects[i])){
                    
                    switch(subjects[i]){
                        case "Matematicas":
                            materias += "Matemáticas"
                            materias += ", ";
                            break;
                        case "LecturayRedaccion":
                            materias += "Lectura y Redacción"
                            materias += ", ";
                            break;
                        case "Ingles":
                            materias += "Inglés"
                            materias += ", ";
                            break; 
                    }
                }
            }
            materias = materias.slice(0,-2);

            let usersubjects = document.createTextNode(materias);
            card.appendChild(usersubjects);
            


            // Sucursales           
            card = document.querySelector("#user_Sucursal");
            let userSucursal = document.createTextNode(`${obj[0].workplace}`);
            card.appendChild(userSucursal);

            // Usertype
            card = document.querySelector("#user_type");
            let usertype="";
            if(obj[0].usertype == 1){
                usertype = document.createTextNode("Administrador");
            }
            else if (obj[0].usertype == 2){
                usertype = document.createTextNode("Asesor");
            }
            else if (obj[0].usertype == 3){
                usertype = document.createTextNode("Evaluador");
            }           
            card.appendChild(usertype);


            // Conteo de Asesorias
            request.open("POST", "scripts/php/load_user_one_asesories.php");
            request.send(formData);
    
            request.onload = function (e){
                let obj = JSON.parse(this.responseText);
                //console.log(obj);
    
                let element = document.querySelector("#asesoriaCount");
                element.innerHTML = obj.length;

                if(obj.length>0){
                    request.open("POST", "scripts/php/rate_user.php");
                    request.send(formData);

                    request.onload = function (e){
                        let rate = JSON.parse(this.responseText);
                        // console.log(rate);                    
                            element = document.querySelector("#asesoriasRate");
                            let numAsesorias = 0;
                            let rateAseorias = 0;
                            rate.forEach(element => {
                                    numAsesorias++;
                                    rateAseorias += parseInt(element.evaluation);                          
                            });
                        rate = rateAseorias/numAsesorias;
                        
                        element.innerHTML = `${rate.toFixed(4)} / 5`
                    }
                }else{
                    element = document.querySelector("#asesoriasRate");
                    element.innerHTML= `Asesorias no calificadas`
                }
            }

        }



    }

    document.addEventListener('DOMContentLoaded', function () {
        createAsesories();
        loadProfileSettings();
    });

    function asesoriaPathAttachment(obj){
        return "data/asesorias/" + obj.path;
    }
    
    function profilePicPathAttachment(obj){
        return "data/users/" + obj.picture;
    }

})();
