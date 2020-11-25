(function(){
    'use strict';

    document.querySelector("#logout").addEventListener("click",function(e){

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


        Asesorias("scripts/php/logout.php", JSON.stringify(jsonString)).then(function(resolve){
            sessionStorage.clear();
            window.location.replace("index.html");
        },function(error){

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