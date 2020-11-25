(function () {
    'use strict';

    //Función que crea la tabla
    document.addEventListener('DOMContentLoaded', function (e) {
        Asesorias("scripts/php/asesores.php").then(function (response) {

            let asesores = JSON.parse(response);

            Asesorias("scripts/php/asesorias.php").then(function (response) {
                let asesorias = JSON.parse(response);
                    Asesorias("scripts/php/countHours.php").then(function (response) {
                        let timelog = JSON.parse(response);

                        let table = $('#example').DataTable({
                            data: timelog,
                            dom: 'Bfrtip',
                            paging: false,

                            buttons: [
                                'copyHtml5',
                                'excelHtml5',
                                'csvHtml5',
                                'pdfHtml5',

                            ],
                            columns: [{
                                "data": "id_asesor",
                                render: function (data) {
                                    let nombre = getAsesorName(data, asesores);
                                    return `<img src=${getProfilePic(data, asesores)} class="img-circle img-size-32 mr-2 d-none d-md-inline "> ${nombre}`;
                                }
                            },
                            {
                                "data": "minutes"
                            },
                            {
                                "data": "id_asesor",
                                render: function(data){
                                    let numAs = 0;
                                    asesorias.forEach(element => {
                                        if (element.id_asesor == data && element.registered == '0'){
                                            numAs++;
                                        }
                                    });
                                    return numAs;
                                }
                            },
                            {
                                "data": {
                                    id_asesor: "id_asesor",
                                    minutes: "minutes",
                                },                             
                                render: function (data) {
                                    
                                    let numAs = 0;
                                    let horas = data.minutes/60;
                                    let ratio;
                                    asesorias.forEach(element => {
                                        if (element.id_asesor == data.id_asesor && element.registered == '0') {
                                            numAs++;
                                        }
                                    });
                                    
                                    ratio = numAs / horas;
                                    
                                    return ratio.toFixed(1);
                                }
                            }
                            ]
                        });

                        confirm("Seleccione en los botones de guardado su preferencia para guardar estos datos.\n NO se olvide de hacerlo ya que no se puede regresar a esta página.");
                        document.querySelector("button.buttons-pdf").click();
                    }, function (error) {
                        console.error('Failed', error);
                    });
            }, function (error) {
                console.error('Failed', error);
            });

        }, function (error) {
            console.error('Failed', error);
        });
        
        
    });


    

    $('#example tbody').on('click', 'tr', function () {
        var table = $('#example').DataTable();
    });

    // función para llamar contenido de la BD
    function Asesorias(url) {

        return new Promise(function (resolve, reject) {

            let request = new XMLHttpRequest();
            request.open('GET', url);

            request.setRequestHeader('X-Requested-Width', 'XMLHttpRequest');
            request.onload = function (e) {
                if (this.status == 200) {
                    resolve(this.responseText);
                } else {
                    reject(Error(this.status));
                }
            }

            request.onerror = function () {
                reject(Error('Network Error'));
            }

            request.send();
        });
    }

    // Funciones para obtener el profile pic de los usuarios,
    // nombre y de las asesorias
    function profilePicPathAttachment(obj) {
        return "data/users/" + obj.picture;
    }

    function asesoriaPathAttachment(obj) {
        return "data/asesorias/" + obj;
    }

    function getProfilePic(asesoria, asesores) {
        let idAsesor = asesoria;

        let asesoresLenght = Object.keys(asesores).length;

        for (let i = 0; i < asesoresLenght; i++) {
            if (asesores[i].id_user == idAsesor)
                return profilePicPathAttachment(asesores[i]);
        }
    }

    function getAsesorName(asesoria, asesores) {
        let idAsesor = asesoria;

        let asesoresLenght = Object.keys(asesores).length;

        for (let i = 0; i < asesoresLenght; i++) {
            if (asesores[i].id_user == idAsesor)
                return asesores[i].name;
        }
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