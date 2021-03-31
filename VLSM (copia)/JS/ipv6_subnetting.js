var drop_down="";
for(i=0;i<120;i++){
    drop_down+="<option value="+(i+8)+">/"+(i+8)+"</option>"
}
document.getElementById("slashes").innerHTML=drop_down;
function calculate(){
    var a=document.getElementById("ip").value;a=a.replace(/\s/g,"");
    var c=a.split("/");a=c[0];c=c[1];if(!checkipv6(a)){
        document.getElementById("address").innerHTML="<span style='background-color:yellow;'>Esto no parece una dirección IPv6 válida</span>";
        document.getElementById("first").innerHTML="";
        document.getElementById("last").innerHTML="";
        document.getElementById("expanded").innerHTML="";
        document.getElementById("64s").innerHTML="";
        document.getElementById("prefix").innerHTML="";
        return
    }
    a=formatipv6preferred(a);
    document.getElementById("address").innerHTML=a+"/"+c;
    var b=expand(a);
    document.getElementById("expanded").innerHTML=b+"/"+c;
    document.getElementById("64s").innerHTML=Math.pow(2,64-c);
    var d=findprefix(c)+"::";
    d=expand(d);
    document.getElementById("prefix").innerHTML=d;
    var e=bitand(d,b);
    document.getElementById("first").innerHTML=e;
    document.getElementById("last").innerHTML=last(d,e)
}
function subnet_subnet(){
    var b=document.getElementById("subnets").value;var l=document.getElementById("ip").value;l=l.replace(/\s/g,"");
    var d=l.split("/");
    l=expand(d[0]);d=d[1];
    if(!checkipv6(l)){
        document.getElementById("facts").innerHTML="<span style='background-color:yellow;'>Parece una dirección IPv6 no válida</span>";
        return
    }
    if(splitnewslash(d,b)==false){
        document.getElementById("facts").innerHTML="<span style='background-color:yellow;'>Parece que la red IPv6 dada no se puede dividir en tantas subredes nuevas</span>";
        return
    }
    var m=splitnewslash(d,b);
    var k=Math.pow(2,m-d);
    var h=findprefix(d)+"::";
    h=expand(h);
    var g=bitand(h,l);
    g=expand(g);
    var c=g.replace(/:/g,"");
    c=new BigInteger(c,16);
    var f=new BigInteger("2").pow(128-m);
    var a=new Array;
    a[0]=c.toString(16);
    for(var e=1;e<k;e++){
        a[e]=c.add(f).toString(16);
        c=c.add(f);
        if(e>999){
            break
        }
    }
    var n="<b>Para conseguir al menos "+b+" nuevas subredes se dividen "+formatipv6preferred(l)+"/"+d+" dentro"+k+" nuevas subredes. Cada una de estas subredes es una /"+m+" conteniendo "+Math.pow(2,(64-m))+" / 64s. Las nuevas subredes son las siguientes:</b><p>";
    for(var e=0;e<k;e++){
        n+=formatipv6preferred(biginttoipv6(a[e]))+"/"+m+"<br>";
        if(e>999){
            break
        }
    }
    n+="</p>";
    document.getElementById("facts").innerHTML="";
    document.getElementById("subnetted").innerHTML=n
}
function subnet_slashes(){
    var l=document.getElementById("slashes").value;
    var k=document.getElementById("ip").value;k=k.replace(/\s/g,"");
    var d=k.split("/");k=expand(d[0]);
    d=parseInt(d[1]);
    if(!checkipv6(k)){
        document.getElementById("facts").innerHTML="<span style='background-color:yellow;'>Parece una dirección IPv6 no válida</span>";
        return
    }
    var b=Math.pow(2,l-d);
    if(l<d){
        document.getElementById("facts").innerHTML="<span style='background-color:yellow;'>Asegúrese de que las barras diagonales seleccionadas encajen en la red dada. La barra diagonal seleccionada debe tener un valor numérico mayor que la barra de la red original.</span>";
        return
    }
    var h=findprefix(d)+"::";
    h=expand(h);
    var f=bitand(h,k);
    f=expand(f);
    var c=f.replace(/:/g,"");
    c=new BigInteger(c,16);
    var g=new BigInteger("2").pow(128-l);
    var a=new Array;
    a[0]=c.toString(16);
    for(var e=1;e<b;e++){
        a[e]=c.add(g).toString(16);c=c.add(g);
        if(e>999){
            break
        }
    }
    var m="<b>Subneteo "+formatipv6preferred(k)+"/"+d+" dentro /"+l+"s da "+b+" subredes, todas las cuales tienen "+Math.pow(2,64-l)+" /64s.</b><p>";
    for(var e=0;e<b;e++){
        m+=formatipv6preferred(biginttoipv6(a[e]))+"/"+l+"<br>";
        if(e>999){
            break
        }
    }
    m+="</p>";
    document.getElementById("subnetted").innerHTML=m;
    document.getElementById("facts").innerHTML=""
}
function biginttoipv6(b){
    var a=[];
    var c;
    for(var c=0;c<8;c++){
        a.push(b.slice(c*4,(c+1)*4))
    }
    return a.join(":")
}
function splitnewslash(c,d){
    var a=0;
    for(var b=0;b<(128-c);b++){
        a=Math.pow(2,b);
        if(a>=d){
            return parseInt(c)+b
        }
    }
    return false
}
function last(b,c){
    c=c.split(":");
    b=b.split(":");
    anded=new Array;
    for(var a=0;a<8;a++){
        c[a]=parseInt(c[a],16);
        b[a]=parseInt(b[a],16);
        b[a]=b[a]^65535;
        anded[a]=b[a]^c[a];
        anded[a]=anded[a].toString(16)
    }
    return anded.join(":")
}
function bitand(c,a){
    c=c.split(":");a=a.split(":");
    anded=new Array;
    for(var b=0;b<8;b++){
        c[b]=parseInt(c[b],16);
        a[b]=parseInt(a[b],16);
        anded[b]=c[b]&a[b];
        anded[b]=anded[b].toString(16)
    }
    return anded.join(":")
}
function findprefix(b){
    var c=b;var d="";
    for(var a=0;a<c;a++){
        d+="1";
        if((a+1)%16==0){
            d+=":"
        }
    }
    d=d.split(":");
    while(d[d.length-1].length<16){
        d[d.length-1]+="0"
    }
    for(var a=0;a<d.length;a++){
        d[a]=parseInt(d[a],2);d[a]=d[a].toString(16)
    }
    return d.join(":");
    console.log(d)
}
function checkipv6(a){
    return(/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))\s*$/.test(a))
}
function formatipv6preferred(e){
    var d;
    var b="Not a valid IPv6 Address";
    var c;
    var a;
    if(checkipv6(e)){
        d=e.toLowerCase();
        c=d.split(":");
        trimcolonsfromends(c);
        fillemptysegment(c);
        stripleadingzeroes(c);
        removeconsecutivezeroes(c);
        b=assemblebestrepresentation(c)
    }
    return b
}
function trimcolonsfromends(a){
    var b=a.length;
    if((a[0]=="")&&(a[1]=="")&&(a[2]=="")){
        a.shift();a.shift()
    }
    else{
        if((a[0]=="")&&(a[1]=="")){
            a.shift()
        }
        else{
            if((a[b-1]=="")&&(a[b-2]=="")){
                a.pop()
            }
        }
    }
}
function fillemptysegment(b){
    var c;
    var a=8;
    if(b[b.length-1].indexOf(".")!=-1){
        a=7
    }
    for(c=0;c<a;c++){
        if(b[c]==""){
            b[c]="0";break
        }
    }
    while(b.length<a){
        b.splice(c,0,"0")
    }
}
function stripleadingzeroes(a){
    var b=a.length;var c;for(i=0;i<b;i++){
        segs=a[i].split("");
        for(j=0;j<3;j++){
            if((segs[0]=="0")&&(segs.length>1)){
                segs.splice(0,1)
            }
            else{
                break
            }
        }
        a[i]=segs.join("")
    }
}
function removeconsecutivezeroes(d){
    var a=-1;
    var f=0;
    var c=false;
    var b=0;
    var g=-1;
    var e;
    for(e=0;e<8;e++){
        if(c){
            if(d[e]=="0"){
                b+=1
            }
            else{
                c=false;
                if(b>f){
                    a=g;f=b
                }
            }
        }
        else{
            if(d[e]=="0"){
                c=true;
                g=e;
                b=1
            }
        }
    }
    if(b>f){
        a=g;f=b
    }
    if(f>1){
        d.splice(a,f,"")
    }
}
function assemblebestrepresentation(c){
    var a="";
    var b=c.length;
    if(c[0]==""){
        a=":"
    }
    for(i=0;i<b;i++){
        a=a+c[i];
        if(i==b-1){
            break
        }
        a=a+":"
    }
    if(c[b-1]==""){
        a=a+":"
    }
    return a
}
function expand(k){
    var a="";
    var h="";
    var e=8;
    var b=4;
    if(k.indexOf("::")==-1){
        a=k
    }
    else{
        var d=k.split("::");
        var g=0;
        for(var f=0;f<d.length;f++){
            g+=d[f].split(":").length
        }
        a+=d[0]+":";
        for(var f=0;f<e-g;f++){
            a+="0000:"
        }
        a+=d[1]
    }
    var c=a.split(":");
    for(var f=0;f<e;f++){
        while(c[f].length<b){
            c[f]="0"+c[f]
        }
        h+=(f!=e-1)?c[f]+":":c[f]
    }
    return h
};