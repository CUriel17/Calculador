function Insert(){
    var f=document.getElementById("ip").value;f=f.replace(/^\s+|\s+$/g,"");
    if(!validateIP(f)){
        alert("La dirección IP parece inválida");
        return
    }
    f=f.split(".");
    var a=document.getElementById("mask").value;
    a=a.replace(/^\s+|\s+$/g,"");a=clean_mask(a);
    if(!validate_mask(a)){
        alert("Esa máscara no parece válida")
    }
    var c=mask_to_slash(a);
    var e=find_wildcard(a);
    var b=find_net_add(f,a);
    var d=find_broadcast(e,f);
    
    document.getElementById("netmask").innerHTML=print_ip(a);
}