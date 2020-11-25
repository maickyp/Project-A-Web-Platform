(function(){
    'use strict';


    $('#example tbody').on('click', 'td.details-control', function () {
        let table = $('#example').DataTable();
        let tr = $(this).closest('tr');
        let trIcon = $(this).closest('td');
        let row = table.row(tr);

        let data = row.data();

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
            trIcon.removeClass('fa-chevron-up');
            trIcon.addClass('fa-chevron-down');
        }
        else {
            // Open this row
            format(row.data()).then(function (response){
                row.child(response).show();
            });
                
            tr.addClass('shown');
            trIcon.removeClass('fa-chevron-down');
            trIcon.addClass('fa-chevron-up');
            
        }
    });


    // Poner información de evaluación de cada asesoria 
    function format(d) {
        // `d` is the original data object for the row
        return new Promise(function (resolve){

            
            Asesorias("scripts/php/load_ev_asesorie.php", d.id_asesoria, 'id_asesoria').then(function (response) {
                let obj = JSON.parse(response);
               
                let Alength = obj.length;

                let rate, rateAseorias = 0;
                obj.forEach(element => {
                    rateAseorias += parseInt(element.evaluation);
                });
                rate = rateAseorias / Alength;
                let mean = rate.toFixed(4);

                
                resolve('<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
                    '<tr>' +
                    '<td> Número de evaluaciones :</td>' +
                    '<td>' + Alength + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td> Promedio de evaluación</td>' +
                    '<td>' + mean + '/5 </td>' +
                    '</tr>' +
                    '</table>'+
                    `<a href="#" class="btn btn-block btn-outline-danger borrar-asesoria" data-asesoria="${d.id_asesoria}"><b>Borrar asesoria</b></a>`);

            }, function (error) {
                console.error('Failed', error);
            });

        });
    }

    // El modal de las asesorias
    $('#modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('path') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('.embed-responsive-item').attr("src", recipient);
    })

    //Función que crea la tabla
    document.addEventListener('DOMContentLoaded', function (e) {
        Asesorias("scripts/php/asesores.php").then(function (response) {

            let asesores = JSON.parse(response);

            Asesorias("scripts/php/asesorias.php").then(function (response) {
                let asesorias = JSON.parse(response);

                let table = $('#example').DataTable({
                    data: asesorias,
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
                            "className": 'fas fa-chevron-down details-control',
                            "orderable": false,
                            "data": null,
                            "defaultContent": ''
                        },
                        {
                            "data": "id_asesor",
                            render: function (data) {
                                let nombre = getAsesorName(data, asesores);
                                return `<img src=${getProfilePic(data, asesores)} class="img-circle img-size-32 mr-2 d-none d-md-inline "> ${nombre}`;
                            }
                        },
                        { "data": "curso" },
                        { "data": "date" },
                        {
                            "data": "path",
                            "render": function (data) {
                                return `<a class="text-muted" href="#">
                                <i class="far fa-eye" data-toggle="modal" data-target="#modal" data-path="${asesoriaPathAttachment(data)}"></i> 
                                </a>`;
                            }
                        }
                    ]
                });
                document.querySelector("thead tr th").setAttribute("class", "details-control");

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

    $('#example tbody ').on('click', '.borrar-asesoria', function(){
        let asesoriaId = $(this)[0].attributes['data-asesoria'].value;

        if (window.confirm("¿Estas seguro de borrar la asesoria?")) {
            Asesorias("scripts/php/eliminarAsesoria.php", asesoriaId, "id_asesoria").then(function () {
                alert("Asesoria borrada satisfactoriamente");
                window.location.replace('asesories.html')
            }, function (error) {
                console.error('Failed', error);
            });
        }
    })


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

    // $('#example tbody').on('click', 'td.details-control', function () {
    //     let table = $('#example').DataTable();
    //     let tr = $(this).closest('tr');
    //     let trIcon = $(this).closest('td');
    //     console.log(trIcon);
    //     let row = table.row(tr);

    //     if (row.child.isShown()) {
    //         // This row is already open - close it
    //         row.child.hide();
    //         tr.removeClass('shown');
    //         trIcon.removeClass('fa-minus');
    //         trIcon.addClass('fa-plus');



    //     }
    //     else {
    //         // Open this row
    //         row.child(format(row.data())).show();
    //         tr.addClass('shown');
    //         trIcon.removeClass('fa-plus');
    //         trIcon.addClass('fa-minus');



    //     }
    // });

    // Poner información de evaluación de cada asesoria 
    // function format(d) {
    //     // `d` is the original data object for the row

    //     let Alenght, mean;
    //     Asesorias("scripts/php/load_ev_asesorie.php", '60', 'id_asesoria').then(function (response) {
    //         let obj = JSON.parse(response);
    //         console.log(obj);

    //         Alenght = obj.lenght;

    //     }, function (error) {
    //         console.error('Failed', error);
    //     });


    //     return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
    //         '<tr>' +
    //         '<td> Número de evaluaciones :</td>' +
    //         '<td>' + Alenght + '</td>' +
    //         '</tr>' +
    //         '<tr>' +
    //         '<td> Promedio de evaluación</td>' +
    //         '<td>' + '#' + '/5 </td>' +
    //         '</tr>' +
    //         '</table>';


    // }
})();