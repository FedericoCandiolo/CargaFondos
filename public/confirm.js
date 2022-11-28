function EliminarMovimiento(mov, url){
    if(
        window.confirm('Usted desea eliminar el movimiento del ' + mov)
    ) window.location.href = url;
}