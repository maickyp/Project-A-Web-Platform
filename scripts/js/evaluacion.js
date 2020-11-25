(function(){
    'use strict';

    const id_evaluador = sessionStorage.getItem('idUser');
    let id_asesor, id_asesoria;
    
    function ShowLastAsesorie() {

        let formData = new FormData();
        formData.append('id_user', id_evaluador);
        let request = new XMLHttpRequest();
        request.open("POST", "scripts/php/load_asesorie.php");

        // want to distinguish from non-JS submits?
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(formData);

        request.onload = function (e) {
            // clean up the form eventually
            //console.log(request.responseText);

            if(request.responseText!=""){
            const obj = JSON.parse(request.responseText);

            let card = document.querySelector("#asesoria");

            let img = document.createElement("img");
            img.setAttribute("src", asesoriaPathAttachment(obj))
            img.setAttribute("class", "d-block w-100");

            card.appendChild(img); 


            id_asesor=obj.id_asesor;
            id_asesoria = obj.id_asesoria;
            }else{
                
                alert("No tienes nada que revisar! :D\nPuedes ir a tomarte un cafe tranquilamente");
                window.location.replace("adminIndex.html");
            }
        };
    }

    
    document.querySelector("#evaluacion").addEventListener('submit',function(e){
        e.preventDefault();
        
        let stars=0;
        $("[name=stars]:checked").each(function(){
            stars += parseInt(this.value);
        });

        let formData = new FormData();
        formData.append("id_evaluador", id_evaluador);
        formData.append("id_asesor", id_asesor);
        formData.append("id_asesoria",id_asesoria);
        formData.append("evaluation", stars);

        let request = new XMLHttpRequest();
        request.open("POST", "scripts/php/evaluate_asesorie.php");
        // want to distinguish from non-JS submits?
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(formData);

        request.onload = function (e) {
            // clean up the form eventually
            //console.log(request.responseText);
            console.log(request.responseText);
            window.location.reload();
        };
        

    });







    document.addEventListener('DOMContentLoaded', function () {
        
        ShowLastAsesorie();
    });




    function asesoriaPathAttachment(obj){
         return "data/asesorias/" + obj.path;
    }


})();