(function (){

    function ranking() {

        let asesores, asesorias;
        let ranking= [];
        let request = new XMLHttpRequest();
        request.open("GET", "scripts/php/asesores.php");                       // se define el metodo y el archivo

        // want to distinguish from non-JS submits?
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send();                                                         // Se envia el request

        request.onload = function (e) {
            asesores = JSON.parse(request.responseText); // Se recibe el array de los usuarios
            
            request.open("GET", "scripts/php/load_user_all_ev_asesories.php");                       // se define el metodo y el archivo

            // want to distinguish from non-JS submits?
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.send();
            
            request.onload = function(e){
                asesorias = JSON.parse(request.responseText); // Se recibe el array de los usuarios
                //console.log(asesorias);

                asesores.forEach(asesor => {
                    let idUser = asesor.id_user;
                    let user, rate;
                    let sumAsesories=0, numAsesories=0;

                    asesorias.forEach(asesoria => {
                        if (asesoria.id_asesor == idUser){
                            sumAsesories += parseInt(asesoria.evaluation);
                            numAsesories++;
                        };

                   
                    });

                    rate = sumAsesories / numAsesories;

                    if(rate){
                        user = {
                            "name": asesor.name,
                            "rate": rate
                        };

                        ranking.push(user);
                    }
                });


                ranking.sort((a, b) => {
                    return b.rate - a.rate;
                });

                
                let card = document.querySelector("#ranking");
                
                for(let i=0; i< ranking.length; i++){
                    let newRow = document.createElement("tr");
                    
                    let column1 = document.createElement("td");
                    column1.innerHTML= ranking[i].name;
                    column1.className = "text-center";
                    
                    let column2 = document.createElement("td");
                    column2.innerHTML = ranking[i].rate.toFixed(4);
                    column2.className = "text-center";

                    let column3 = document.createElement("td");
                    column3.innerHTML = `${i+1}`;
                    column3.className = "text-center";


                    newRow.appendChild(column1);
                    newRow.appendChild(column2);
                    newRow.appendChild(column3); 
                    
                    card.appendChild(newRow);
                }
            }

        }
        
    };

    document.addEventListener("DOMContentLoaded", function(){
        ranking();
    });


})();