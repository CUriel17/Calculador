$(document).ready(function() {
    //obtenemos el valor de los input
    
    $('#adicionar').click(function() {
      var ID = document.getElementById("ID").value;
      var NOMBRE = document.getElementById("NOMBRE").value;
      var MODEDELO= document.getElementById("MODEDELO").value;
      var DIRECCION_MAC = document.getElementById("DIRECCION_MAC").value
      var DIRECCION_IP = document.getElementById("DIRECCION_IP").value
      var UBICACION = document.getElementById("UBICACION").value
      var FECHA = document.getElementById("FECHA").value
      var DESCRIPCION = document.getElementById("DESCRIPCION").value
      var i = 1; //contador para asignar id al boton que borrara la fila
      var fila = '<tr id="row' + i + '"><td>' + ID + '</td><td>' + NOMBRE + '</td><td>' + MODEDELO+ '</td><td>' + DIRECCION_MAC + '</td><td>' + DIRECCION_IP + '</td><td>' + UBICACION + '</td><td>' + FECHA+ '</td><td>' + DESCRIPCION+'</td><td><button type="button" name="remove" id="' + i + '" class="btn btn-danger btn_remove">Quitar</button></td></tr>'; //esto seria lo que contendria la fila
    
      i++;
    
      $('#mytable tr:first').after(fila);
        $("#adicionados").text(""); //esta instruccion limpia el div adicioandos para que no se vayan acumulando
        var nFilas = $("#mytable tr").length;
        $("#adicionados").append(nFilas - 1);
        //le resto 1 para no contar la fila del header
        document.getElementById("NOMBRE").value ="";
        document.getElementById("MODEDELO").value = "";
        document.getElementById("DIRECCION_MAC").value = "";
        document.getElementById("DIRECCION_IP").value = "";
        document.getElementById("FECHA").value = "";
        document.getElementById("DESCRIPCION").value = "";
        document.getElementById("ID").value = "";
        document.getElementById("ID").focus();
      });
    $(document).on('click', '.btn_remove', function() {
      var button_id = $(this).attr("id");
        //cuando da click obtenemos el id del boton
        $('#row' + button_id + '').remove(); //borra la fila
        //limpia el para que vuelva a contar las filas de la tabla
        $("#adicionados").text("");
        var nFilas = $("#mytable tr").length;
        $("#adicionados").append(nFilas - 1);
      });
    });