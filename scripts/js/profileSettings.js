(function(){
    'use strict';
    const id_user = sessionStorage.getItem('idUser');

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
            card = document.querySelector("#newName");
            card.setAttribute("value", obj[0].name);
            

            // Materias
            card = document.querySelector("#materias");
            const subjects = ["Matematicas","LecturayRedaccion","Ingles"]
            for(let i=0; i<subjects.length; i++){
                if(obj[0].subject.includes(subjects[i])){
                    let checkbox = card.querySelector(`#${subjects[i]}Checkbox`);
                    checkbox.setAttribute("checked","checked");
                }
            }

            // Sucursales           
            let userSucursal = obj[0].workplace;
            card = document.querySelector(`#sucursales #${userSucursal}`);
            card.setAttribute("checked","checked");


        }
    }

    document.querySelector('#profileSettings').addEventListener("submit", function (e) {
        e.preventDefault();
        let form = e.currentTarget;

        const newName = document.querySelector('#newName');
        let submit = form.querySelector('[type=submit]');

        let formData = new FormData();
        let request = new XMLHttpRequest();

        //usuario
        formData.append('id_user', id_user);

        // Profile pic
        const profilePic = document.querySelector('[type=file]').files;
        if(profilePic.length>0){
            formData.append('profilePic', profilePic[0]);
        }

        // Nombre
        formData.append('newName', newName.value);

        // password
        const password = document.querySelector('#newPassword');
        if(password.value!=""){
            let errorCount = 0;
            if (password.value.length == 0) {
                alert("El usuario debe de tener una contraseña");
                errorCount++;
            } else if (password.value.length < 6) {
                alert("La contraseña del usuario debe tener 6 caractéres o más");
                errorCount++;
            }

            if (errorCount==0){
            const hashPass = CryptoJS.SHA1(password.value);
            formData.append('newPassword', hashPass);
            }
        }

        // materias
        let materias = "";

        $("[name=materia]:checked").each(function(){
            materias += this.value;
            materias += ", "
        });
        materias = materias.slice(0,-2);
        formData.append('materias', materias);


        // sucursal
        let sucursal = "";
        $("[name=sucursal]:checked").each(function(){
            sucursal += this.value;
        });
        formData.append('sucursal', sucursal);


        submit.disabled = true;

        // do the request using form info
        request.open('POST', 'scripts/php/update_Profile_Settings.php');

        // want to distinguish from non-JS submits?
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(formData);

        request.onload = function (e) {
            // clean up the form eventually
            // console.log(request.responseText);
            if (request.responseText.includes("error")){
                alert("Hubo un error");
            }
            // make this form usable again
            submit.disabled = false;

            if(sessionStorage.getItem('userType')==2){
                window.location.replace("profile.html");
            }else{
                window.location.replace("adminIndex.html");
            }
            // enable the submit on abort/error too
            // to make the user able to retry
        };       
    });

    document.querySelector('.custom-file-input').addEventListener('change', function (e) {
        let fileName = document.getElementById("newProfilePic").files[0].name;
        let nextSibling = e.target.nextElementSibling
        nextSibling.innerText = fileName
    });

    document.addEventListener("DOMContentLoaded", function(){
        loadProfileSettings();
    })

    function profilePicPathAttachment(obj){
        return "data/users/" + obj.picture;
    }

})();