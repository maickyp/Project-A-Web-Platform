(function(){
    'use strict';


    //Función que crea la tabla
    document.addEventListener('DOMContentLoaded', function (e) {
        Asesorias("scripts/php/asesores.php").then(function (response) {

            let asesores = JSON.parse(response);
            let userSelect = document.querySelector("#user-too-add");
            asesores.forEach(element => {
                let newUser = document.createElement("option");
                newUser.setAttribute("value", element.id_user); 
                let name = document.createTextNode(element.name);
                newUser.appendChild(name);
                userSelect.appendChild(newUser);
            
            });

            Asesorias("scripts/php/mostrarContable.php").then(function (response) {
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
                    columns: [
                        {
                            "data": "id_asesor",
                            render: function (data) {
                                let nombre = getAsesorName(data, asesores);
                                return `<img src=${getProfilePic(data, asesores)} class="img-circle img-size-32 mr-2 d-none d-md-inline "> ${nombre}`;
                            }
                        },
                        { "data": "date" },
                        { "data": "minutes" },
                        { "data": "status",
                          render: function (data) {
                              return data=="0" ? "No registrado": "Registrado";
                          }
                        }
                    ]
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
                }
                else {
                    reject(Error(this.status));
                }
            }

            request.onerror = function () {
                reject(Error('Network Error'));
            }

            request.send();
        });
    }


    document.querySelector("#Count-Hour").addEventListener("click", function (e) {
        if (window.confirm("¿Estas seguro de registrar las horas? \n Se va a generar una tabla con la suma de los minutos no registrados por usuario\n y se actualizarán en la base de datos")) {
            window.location.replace("countHour.html");
        }
    })

    document.querySelector("#addHourCount").addEventListener('submit', function (e) {
        let form = e.currentTarget;

        const user = document.querySelector('#user-too-add');
        const date = document.querySelector("#date-too-add");
        const mins = document.querySelector("#mins-too-add");

        let errorCount = 0;

        if (date.value.length == 0) {
            alert("Seleccione una fecha");
            errorCount++;
        }
        else if (mins.value <= 0) {
            alert("Minutos no válidos");
            errorCount++;
        }

        if (errorCount == 0) {

            let addHours = {
                "user": user.value,
                "date": date.value,
                "mins": mins.value
            };


            Asesorias("scripts/php/addHours.php", JSON.stringify(addHours)).then(function (resolve) {
            }, function (error) {

            });
        }

    })

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