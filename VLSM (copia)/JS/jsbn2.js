function bnClone(){
    var a=nbi();
    this.copyTo(a);
    return a
}
function bnIntValue(){
    if(this.s<0){
        if(this.t==1){
            return this[0]-this.DV
        }
        else{
            if(this.t==0){
            return-1
            }
        }
    }
    else{
        if(this.t==1){
            return this[0]
        }
        else{
            if(this.t==0){
                return 0
            }
        }
    }
    return((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0]
}
function bnByteValue(){
    return(this.t==0)?this.s:(this[0]<<24)>>24
}
function bnShortValue(){
    return(this.t==0)?this.s:(this[0]<<16)>>16
}
function bnpChunkSize(a){
    return Math.floor(Math.LN2*this.DB/Math.log(a))
}
function bnSigNum(){
    if(this.s<0){
        return-1
    }
    else{
        if(this.t<=0||(this.t==1&&this[0]<=0)){
            return 0
        }
        else{
            return 1
        }
    }
}
function bnpToRadix(c){
    if(c==null){
        c=10
    }
    if(this.signum()==0||c<2||c>36){
        return"0"
    }
    var f=this.chunkSize(c);
    var e=Math.pow(c,f);
    var i=nbv(e),j=nbi(),h=nbi(),g="";
    this.divRemTo(i,j,h);
    while(j.signum()>0){
        g=(e+h.intValue()).toString(c).substr(1)+g;j.divRemTo(i,j,h)
    }
    return h.intValue().toString(c)+g
}
function bnpFromRadix(m,h){
    this.fromInt(0);if(h==null){
        h=10
    }
    var f=this.chunkSize(h);
    var g=Math.pow(h,f),e=false,a=0,l=0;
    for(var c=0;c<m.length;++c){
        var k=intAt(m,c);
        if(k<0){
            if(m.charAt(c)=="-"&&this.signum()==0){
                e=true
            }
            continue
        }
        l=h*l+k;if(++a>=f){
            this.dMultiply(g);
            this.dAddOffset(l,0);
            a=0;l=0
        }
    }
    if(a>0){
        this.dMultiply(Math.pow(h,a));
        this.dAddOffset(l,0)
    }
    if(e){
        BigInteger.ZERO.subTo(this,this)
    }
}
function bnpFromNumber(f,e,h){
    if("number"==typeof e){
        if(f<2){
            this.fromInt(1)
        }
        else{
            this.fromNumber(f,h);
            if(!this.testBit(f-1)){
                this.bitwiseTo(BigInteger.ONE.shiftLeft(f-1),op_or,this)
            }
            if(this.isEven()){
                this.dAddOffset(1,0)
            }
            while(!this.isProbablePrime(e)){
                this.dAddOffset(2,0);
                if(this.bitLength()>f){
                    this.subTo(BigInteger.ONE.shiftLeft(f-1),this)
                }
            }
        }
    }
    else{
        var d=new Array(),g=f&7;
        d.length=(f>>3)+1;
        e.nextBytes(d);
        if(g>0){
            d[0]&=((1<<g)-1)
        }
        else{
            d[0]=0
        }
        this.fromString(d,256)
    }
}
function bnToByteArray(){
    var b=this.t,c=new Array();
    c[0]=this.s;
    var e=this.DB-(b*this.DB)%8,f,a=0;
    if(b-->0){
        if(e<this.DB&&(f=this[b]>>e)!=(this.s&this.DM)>>e){
            c[a++]=f|(this.s<<(this.DB-e))
        }
        while(b>=0){
            if(e<8){
                f=(this[b]&((1<<e)-1))<<(8-e);
                f|=this[--b]>>(e+=this.DB-8)
            }
            else{
                f=(this[b]>>(e-=8))&255;
                if(e<=0){
                    e+=this.DB;
                    --b
                }
            }
            if((f&128)!=0){
                f|=-256
            }
            if(a==0&&(this.s&128)!=(f&128)){
                ++a
            }
            if(a>0||f!=this.s){
                c[a++]=f
            }
        }
    }
    return c
}
function bnEquals(b){
    return(this.compareTo(b)==0)
}
function bnMin(b){
    return(this.compareTo(b)<0)?this:b
}
function bnMax(b){
    return(this.compareTo(b)>0)?this:b
}
function bnpBitwiseTo(c,h,e){
    var d,g,b=Math.min(c.t,this.t);
    for(d=0;d<b;++d){
        e[d]=h(this[d],c[d])
    }
    if(c.t<this.t){
        g=c.s&this.DM;
        for(d=b;d<this.t;++d){
            e[d]=h(this[d],g)
        }
        e.t=this.t
    }
    else{
        g=this.s&this.DM;
        for(d=b;d<c.t;++d){
            e[d]=h(g,c[d])
        }
        e.t=c.t
    }
    e.s=h(this.s,c.s);
    e.clamp()
}
function op_and(a,b){
    return a&b
}
function bnAnd(b){
    var c=nbi();
    this.bitwiseTo(b,op_and,c);
    return c
}
function op_or(a,b){
    return a|b
}
function bnOr(b){
    var c=nbi();
    this.bitwiseTo(b,op_or,c);
    return c
}
function op_xor(a,b){
    return a^b
}
function bnXor(b){
    var c=nbi();
    this.bitwiseTo(b,op_xor,c);
    return c
}
function op_andnot(a,b){
    return a&~b
}
function bnAndNot(b){
    var c=nbi();
    this.bitwiseTo(b,op_andnot,c);
    return c
}
function bnNot(){
    var b=nbi();
    for(var a=0;a<this.t;++a){
        b[a]=this.DM&~this[a]
    }
    b.t=this.t;
    b.s=~this.s;
    return b
}
function bnShiftLeft(b){
    var a=nbi();if(b<0){
        this.rShiftTo(-b,a)
    }
    else{
        this.lShiftTo(b,a)
    }
    return a
}
function bnShiftRight(b){
    var a=nbi();
    if(b<0){
        this.lShiftTo(-b,a)
    }
    else{
        this.rShiftTo(b,a)
    }
    return a
}
function lbit(a){
    if(a==0){
        return-1
    }
    var b=0;
    if((a&65535)==0){
        a>>=16;b+=16
    }
    if((a&255)==0){
        a>>=8;b+=8
    }
    if((a&15)==0){
        a>>=4;b+=4
    }
    if((a&3)==0){
        a>>=2;b+=2
    }
    if((a&1)==0){
        ++b
    }
    return b
}
function bnGetLowestSetBit(){
    for(var a=0;a<this.t;++a){
        if(this[a]!=0){
            return a*this.DB+lbit(this[a])
        }
    }
    if(this.s<0){
        return this.t*this.DB
    }
    return-1
}
function cbit(a){
    var b=0;while(a!=0){
        a&=a-1;++b
    }
    return b
}
function bnBitCount(){
    var c=0,a=this.s&this.DM;
    for(var b=0;b<this.t;++b){
        c+=cbit(this[b]^a)
    }
    return c
}
function bnTestBit(b){
    var a=Math.floor(b/this.DB);
    if(a>=this.t){
        return(this.s!=0)
    }
    return((this[a]&(1<<(b%this.DB)))!=0)
}
function bnpChangeBit(c,b){
    var a=BigInteger.ONE.shiftLeft(c);
    this.bitwiseTo(a,b,a);
    return a
}
function bnSetBit(a){
    return this.changeBit(a,op_or)
}
function bnClearBit(a){
    return this.changeBit(a,op_andnot)
}
function bnFlipBit(a){
    return this.changeBit(a,op_xor)
}
function bnpAddTo(d,f){
    var e=0,g=0,b=Math.min(d.t,this.t);
    while(e<b){
        g+=this[e]+d[e];
        f[e++]=g&this.DM;
        g>>=this.DB
    }
    if(d.t<this.t){
        g+=d.s;
        while(e<this.t){
            g+=this[e];
            f[e++]=g&this.DM;
            g>>=this.DB
        }
        g+=this.s
    }
    else{
        g+=this.s;
        while(e<d.t){
            g+=d[e];
            f[e++]=g&this.DM;g>>=this.DB
        }
        g+=d.s
    }
    f.s=(g<0)?-1:0;if(g>0){
        f[e++]=g
    }
    else{
        if(g<-1){
            f[e++]=this.DV+g
        }
    }
    f.t=e;
    f.clamp()
}
function bnAdd(b){
    var c=nbi();
    this.addTo(b,c);
    return c
}
function bnSubtract(b){
    var c=nbi();
    this.subTo(b,c);
    return c
}
function bnMultiply(b){
    var c=nbi();
    this.multiplyTo(b,c);
    return c
}
function bnSquare(){
    var a=nbi();
    this.squareTo(a);
    return a
}
function bnDivide(b){
    var c=nbi();
    this.divRemTo(b,c,null);
    return c
}
function bnRemainder(b){
    var c=nbi();
    this.divRemTo(b,null,c);
    return c
}
function bnDivideAndRemainder(b){
    var d=nbi(),c=nbi();
    this.divRemTo(b,d,c);
    return new Array(d,c)
}
function bnpDMultiply(a){
    this[this.t]=this.am(0,a-1,this,0,0,this.t);++this.t;this.clamp()
}
function bnpDAddOffset(b,a){
    if(b==0){
        return
    }
    while(this.t<=a){
        this[this.t++]=0
    }
    this[a]+=b;
    while(this[a]>=this.DV){
        this[a]-=this.DV;
        if(++a>=this.t){this[this.t++]=0}++this[a]
    }
}
function NullExp(){}
function nNop(a){
    return a
}
function nMulTo(a,c,b){
    a.multiplyTo(c,b)
}
function nSqrTo(a,b){
    a.squareTo(b)
}
NullExp.prototype.convert=nNop;
NullExp.prototype.revert=nNop;
NullExp.prototype.mulTo=nMulTo;
NullExp.prototype.sqrTo=nSqrTo;
function bnPow(a){
    return this.exp(a,new NullExp())
}
function bnpMultiplyLowerTo(b,f,e){
    var d=Math.min(this.t+b.t,f);
    e.s=0;
    e.t=d;
    while(d>0){
        e[--d]=0
    }
    var c;
    for(c=e.t-this.t;d<c;++d){
        e[d+this.t]=this.am(0,b[d],e,d,0,this.t)
    }
    for(c=Math.min(b.t,f);d<c;++d){
        this.am(0,b[d],e,d,0,f-d)
    }
    e.clamp()
}
function bnpMultiplyUpperTo(b,e,d){
    --e;var c=d.t=this.t+b.t-e;
    d.s=0;
    while(--c>=0){d[c]=0
    }
    for(c=Math.max(e-this.t,0);c<b.t;++c){
        d[this.t+c-e]=this.am(e-c,b[c],d,0,0,this.t+c-e)
    }
    d.clamp();
    d.drShiftTo(1,d)
}
function Barrett(a){
    this.r2=nbi();
    this.q3=nbi();
    BigInteger.ONE.dlShiftTo(2*a.t,this.r2);
    this.mu=this.r2.divide(a);
    this.m=a
}
function barrettConvert(a){
    if(a.s<0||a.t>2*this.m.t){
        return a.mod(this.m)
    }
    else{
        if(a.compareTo(this.m)<0){
            return a
        }
        else{
            var b=nbi();
            a.copyTo(b);
            this.reduce(b);
            return b
        }
    }
}
function barrettRevert(a){
    return a
}
function barrettReduce(a){
    a.drShiftTo(this.m.t-1,this.r2);
    if(a.t>this.m.t+1){
        a.t=this.m.t+1;a.clamp()
    }
    this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
    this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
    while(a.compareTo(this.r2)<0){
        a.dAddOffset(1,this.m.t+1)
    }
    a.subTo(this.r2,a);
    while(a.compareTo(this.m)>=0){
        a.subTo(this.m,a)
    }
}
function barrettSqrTo(a,b){
    a.squareTo(b);this.reduce(b)
}
function barrettMulTo(a,c,b){
    a.multiplyTo(c,b);
    this.reduce(b)
}
Barrett.prototype.convert=barrettConvert;
Barrett.prototype.revert=barrettRevert;
Barrett.prototype.reduce=barrettReduce;
Barrett.prototype.mulTo=barrettMulTo;
Barrett.prototype.sqrTo=barrettSqrTo;
function bnModPow(q,f){
    var o=q.bitLength(),h,b=nbv(1),v;
    if(o<=0){
        return b
    }
    else{
        if(o<18){h=1
        }
        else{
            if(o<48){
                h=3
            }
            else{
                if(o<144){
                    h=4
                }
                else{
                    if(o<768){
                        h=5
                    }
                    else{
                        h=6
                    }
                }
            }
        }
    }
    if(o<8){
        v=new Classic(f)
    }
    else{
        if(f.isEven()){
            v=new Barrett(f)
        }
        else{
            v=new Montgomery(f)
        }
    }
    var p=new Array(),d=3,s=h-1,a=(1<<h)-1;
    p[1]=v.convert(this);
    if(h>1){
        var A=nbi();
        v.sqrTo(p[1],A);
        while(d<=a){p[d]=nbi();
            v.mulTo(A,p[d-2],p[d]);
            d+=2
        }
    }
    var l=q.t-1,x,u=true,c=nbi(),y;
    o=nbits(q[l])-1;
    while(l>=0){
        if(o>=s){
            x=(q[l]>>(o-s))&a
        }
        else{
            x=(q[l]&((1<<(o+1))-1))<<(s-o);
            if(l>0){x|=q[l-1]>>(this.DB+o-s)
            }
        }
        d=h;while((x&1)==0){x>>=1;--d
        }
        if((o-=d)<0){
            o+=this.DB;--l
        }
        if(u){p[x].copyTo(b);
            u=false
        }
        else{
            while(d>1){
                v.sqrTo(b,c);
                v.sqrTo(c,b);
                d-=2
            }
            if(d>0){
                v.sqrTo(b,c)
            }
            else{
                y=b;
                b=c;
                c=y
            }
        v.mulTo(c,p[x],b)
        }
        while(l>=0&&(q[l]&(1<<o))==0){
            v.sqrTo(b,c);
            y=b;
            b=c;
            c=y;
            if(--o<0){
                o=this.DB-1;--l
            }
        }
    }
    return v.revert(b)
}
function bnGCD(c){
    var b=(this.s<0)?this.negate():this.clone();
    var h=(c.s<0)?c.negate():c.clone();
    if(b.compareTo(h)<0){
        var e=b;
        b=h;
        h=e
    }
    var d=b.getLowestSetBit(),f=h.getLowestSetBit();
    if(f<0){
        return b
    }
    if(d<f){
        f=d
    }
    if(f>0){
        b.rShiftTo(f,b);
        h.rShiftTo(f,h)
    }
    while(b.signum()>0){
        if((d=b.getLowestSetBit())>0){
            b.rShiftTo(d,b)
        }
        if((d=h.getLowestSetBit())>0){
            h.rShiftTo(d,h)
        }
        if(b.compareTo(h)>=0){
            b.subTo(h,b);
            b.rShiftTo(1,b)
        }
        else{
            h.subTo(b,h);
            h.rShiftTo(1,h)
        }
    }
    if(f>0){
        h.lShiftTo(f,h)
    }
    return h
}
function bnpModInt(e){
    if(e<=0){
        return 0
    }
    var c=this.DV%e,b=(this.s<0)?e-1:0;
    if(this.t>0){
        if(c==0){
            b=this[0]%e
        }
        else{
            for(var a=this.t-1;a>=0;--a){
                b=(c*b+this[a])%e
            }
        }
    }
    return b
}
function bnModInverse(f){
    var j=f.isEven();
    if((this.isEven()&&j)||f.signum()==0){
        return BigInteger.ZERO
    }
    var i=f.clone(),h=this.clone();
    var g=nbv(1),e=nbv(0),l=nbv(0),k=nbv(1);
    while(i.signum()!=0){
        while(i.isEven()){
            i.rShiftTo(1,i);
            if(j){
                if(!g.isEven()||!e.isEven()){
                    g.addTo(this,g);
                    e.subTo(f,e)
                }
                g.rShiftTo(1,g)
            }
            else{
                if(!e.isEven()){
                    e.subTo(f,e)
                }
            }
            e.rShiftTo(1,e)
        }
        while(h.isEven()){
            h.rShiftTo(1,h);
            if(j){
                if(!l.isEven()||!k.isEven()){
                    l.addTo(this,l);
                    k.subTo(f,k)
                }
                l.rShiftTo(1,l)
            }
            else{
                if(!k.isEven()){
                    k.subTo(f,k)
                }
            }
            k.rShiftTo(1,k)
        }
        if(i.compareTo(h)>=0){
            i.subTo(h,i);
            if(j){
                g.subTo(l,g)
            }
            e.subTo(k,e)
        }
        else{h.subTo(i,h);
            if(j){
                l.subTo(g,l)
            }
            k.subTo(e,k)
        }
    }
    if(h.compareTo(BigInteger.ONE)!=0){
        return BigInteger.ZERO
    }
    if(k.compareTo(f)>=0){
        return k.subtract(f)
    }
    if(k.signum()<0){
        k.addTo(f,k)
    }
    else{
        return k
    }
    if(k.signum()<0){
        return k.add(f)
    }
    else{
        return k
    }
}
var lowprimes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
var lplim=(1<<26)/lowprimes[lowprimes.length-1];
function bnIsProbablePrime(e){
    var d,b=this.abs();
    if(b.t==1&&b[0]<=lowprimes[lowprimes.length-1]){
        for(d=0;d<lowprimes.length;++d){
            if(b[0]==lowprimes[d]){
                return true
            }
        }
        return false
    }
    if(b.isEven()){
        return false
    }
    d=1;
    while(d<lowprimes.length){
        var a=lowprimes[d],c=d+1;
        while(c<lowprimes.length&&a<lplim){
            a*=lowprimes[c++]
        }
        a=b.modInt(a);   
        while(d<c){
            if(a%lowprimes[d++]==0){
                return false
            }
        }
    }
    return b.millerRabin(e)
}
function bnpMillerRabin(f){
    var g=this.subtract(BigInteger.ONE);
    var c=g.getLowestSetBit();
    if(c<=0){
        return false
    }
    var h=g.shiftRight(c);
    f=(f+1)>>1;
    if(f>lowprimes.length){
        f=lowprimes.length
    }
    var b=nbi();
    for(var e=0;e<f;++e){
        b.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
        var l=b.modPow(h,this);
        if(l.compareTo(BigInteger.ONE)!=0&&l.compareTo(g)!=0){
            var d=1;
            while(d++<c&&l.compareTo(g)!=0){
                l=l.modPowInt(2,this);
                if(l.compareTo(BigInteger.ONE)==0){
                    return false
                }
            }
            if(l.compareTo(g)!=0){
                return false
            }
        }
    }
    return true
}
    BigInteger.prototype.chunkSize=bnpChunkSize;
    BigInteger.prototype.toRadix=bnpToRadix;
    BigInteger.prototype.fromRadix=bnpFromRadix;
    BigInteger.prototype.fromNumber=bnpFromNumber;
    BigInteger.prototype.bitwiseTo=bnpBitwiseTo;
    BigInteger.prototype.changeBit=bnpChangeBit;
    BigInteger.prototype.addTo=bnpAddTo;
    BigInteger.prototype.dMultiply=bnpDMultiply;
    BigInteger.prototype.dAddOffset=bnpDAddOffset;
    BigInteger.prototype.multiplyLowerTo=bnpMultiplyLowerTo;
    BigInteger.prototype.multiplyUpperTo=bnpMultiplyUpperTo;
    BigInteger.prototype.modInt=bnpModInt;
    BigInteger.prototype.millerRabin=bnpMillerRabin;
    BigInteger.prototype.clone=bnClone;
    BigInteger.prototype.intValue=bnIntValue;
    BigInteger.prototype.byteValue=bnByteValue;
    BigInteger.prototype.shortValue=bnShortValue;
    BigInteger.prototype.signum=bnSigNum;
    BigInteger.prototype.toByteArray=bnToByteArray;
    BigInteger.prototype.equals=bnEquals;
    BigInteger.prototype.min=bnMin;
    BigInteger.prototype.max=bnMax;
    BigInteger.prototype.and=bnAnd;
    BigInteger.prototype.or=bnOr;
    BigInteger.prototype.xor=bnXor;
    BigInteger.prototype.andNot=bnAndNot;
    BigInteger.prototype.not=bnNot;
    BigInteger.prototype.shiftLeft=bnShiftLeft;
    BigInteger.prototype.shiftRight=bnShiftRight;
    BigInteger.prototype.getLowestSetBit=bnGetLowestSetBit;
    BigInteger.prototype.bitCount=bnBitCount;
    BigInteger.prototype.testBit=bnTestBit;
    BigInteger.prototype.setBit=bnSetBit;
    BigInteger.prototype.clearBit=bnClearBit;
    BigInteger.prototype.flipBit=bnFlipBit;
    BigInteger.prototype.add=bnAdd;
    BigInteger.prototype.subtract=bnSubtract;
    BigInteger.prototype.multiply=bnMultiply;
    BigInteger.prototype.divide=bnDivide;
    BigInteger.prototype.remainder=bnRemainder;
    BigInteger.prototype.divideAndRemainder=bnDivideAndRemainder;
    BigInteger.prototype.modPow=bnModPow;
    BigInteger.prototype.modInverse=bnModInverse;
    BigInteger.prototype.pow=bnPow;
    BigInteger.prototype.gcd=bnGCD;
    BigInteger.prototype.isProbablePrime=bnIsProbablePrime;
    BigInteger.prototype.square=bnSquare;