"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7579],{48178:function(e,t,r){r.d(t,{I:function(){return Z}});var n=r(64740),l={},i=Uint8Array,a=Uint16Array,o=Int32Array,s=new i([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),f=new i([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),u=new i([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),c=function(e,t){for(var r=new a(31),n=0;n<31;++n)r[n]=t+=1<<e[n-1];for(var l=new o(r[30]),n=1;n<30;++n)for(var i=r[n];i<r[n+1];++i)l[i]=i-r[n]<<5|n;return{b:r,r:l}},h=c(s,2),p=h.b,d=h.r;p[28]=258,d[258]=28;for(var v=c(f,0),w=v.b,y=v.r,g=new a(32768),m=0;m<32768;++m){var b=(43690&m)>>1|(21845&m)<<1;b=(61680&(b=(52428&b)>>2|(13107&b)<<2))>>4|(3855&b)<<4,g[m]=((65280&b)>>8|(255&b)<<8)>>1}for(var E=function(e,t,r){for(var n,l=e.length,i=0,o=new a(t);i<l;++i)e[i]&&++o[e[i]-1];var s=new a(t);for(i=1;i<t;++i)s[i]=s[i-1]+o[i-1]<<1;if(r){n=new a(1<<t);var f=15-t;for(i=0;i<l;++i)if(e[i])for(var u=i<<4|e[i],c=t-e[i],h=s[e[i]-1]++<<c,p=h|(1<<c)-1;h<=p;++h)n[g[h]>>f]=u}else for(i=0,n=new a(l);i<l;++i)e[i]&&(n[i]=g[s[e[i]-1]++]>>15-e[i]);return n},S=new i(288),m=0;m<144;++m)S[m]=8;for(var m=144;m<256;++m)S[m]=9;for(var m=256;m<280;++m)S[m]=7;for(var m=280;m<288;++m)S[m]=8;for(var M=new i(32),m=0;m<32;++m)M[m]=5;var A=E(S,9,1),C=E(M,5,1),U=function(e){for(var t=e[0],r=1;r<e.length;++r)e[r]>t&&(t=e[r]);return t},R=function(e,t,r){var n=t/8|0;return(e[n]|e[n+1]<<8)>>(7&t)&r},k=function(e,t){var r=t/8|0;return(e[r]|e[r+1]<<8|e[r+2]<<16)>>(7&t)},O=function(e){return(e+7)/8|0},x=function(e,t,r){return(null==t||t<0)&&(t=0),(null==r||r>e.length)&&(r=e.length),new i(e.subarray(t,r))},L=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],T=function(e,t,r){var n=Error(t||L[e]);if(n.code=e,Error.captureStackTrace&&Error.captureStackTrace(n,T),!r)throw n;return n},I=function(e,t,r,n){var l=e.length,a=n?n.length:0;if(!l||t.f&&!t.l)return r||new i(0);var o=!r,c=o||2!=t.i,h=t.i;o&&(r=new i(3*l));var d=function(e){var t=r.length;if(e>t){var n=new i(Math.max(2*t,e));n.set(r),r=n}},v=t.f||0,y=t.p||0,g=t.b||0,m=t.l,b=t.d,S=t.m,M=t.n,L=8*l;do{if(!m){v=R(e,y,1);var I=R(e,y+1,3);if(y+=3,I){if(1==I)m=A,b=C,S=9,M=5;else if(2==I){var P=R(e,y,31)+257,N=R(e,y+10,15)+4,H=P+R(e,y+5,31)+1;y+=14;for(var z=new i(H),F=new i(19),_=0;_<N;++_)F[u[_]]=R(e,y+3*_,7);y+=3*N;for(var D=U(F),B=(1<<D)-1,V=E(F,D,1),_=0;_<H;){var W=V[R(e,y,B)];y+=15&W;var X=W>>4;if(X<16)z[_++]=X;else{var G=0,Y=0;for(16==X?(Y=3+R(e,y,3),y+=2,G=z[_-1]):17==X?(Y=3+R(e,y,7),y+=3):18==X&&(Y=11+R(e,y,127),y+=7);Y--;)z[_++]=G}}var Z=z.subarray(0,P),$=z.subarray(P);S=U(Z),M=U($),m=E(Z,S,1),b=E($,M,1)}else T(1)}else{var X=O(y)+4,q=e[X-4]|e[X-3]<<8,j=X+q;if(j>l){h&&T(0);break}c&&d(g+q),r.set(e.subarray(X,j),g),t.b=g+=q,t.p=y=8*j,t.f=v;continue}if(y>L){h&&T(0);break}}c&&d(g+131072);for(var J=(1<<S)-1,K=(1<<M)-1,Q=y;;Q=y){var G=m[k(e,y)&J],ee=G>>4;if((y+=15&G)>L){h&&T(0);break}if(G||T(2),ee<256)r[g++]=ee;else if(256==ee){Q=y,m=null;break}else{var et=ee-254;if(ee>264){var _=ee-257,er=s[_];et=R(e,y,(1<<er)-1)+p[_],y+=er}var en=b[k(e,y)&K],el=en>>4;en||T(3),y+=15&en;var $=w[el];if(el>3){var er=f[el];$+=k(e,y)&(1<<er)-1,y+=er}if(y>L){h&&T(0);break}c&&d(g+131072);var ei=g+et;if(g<$){var ea=a-$,eo=Math.min($,ei);for(ea+g<0&&T(3);g<eo;++g)r[g]=n[ea+g]}for(;g<ei;++g)r[g]=r[g-$]}}t.l=m,t.p=Q,t.b=g,t.f=v,m&&(v=1,t.m=S,t.d=b,t.n=M)}while(!v);return g!=r.length&&o?x(r,0,g):r.subarray(0,g)},P=function(e,t,r){r<<=7&t;var n=t/8|0;e[n]|=r,e[n+1]|=r>>8},N=function(e,t,r){r<<=7&t;var n=t/8|0;e[n]|=r,e[n+1]|=r>>8,e[n+2]|=r>>16},H=function(e,t){for(var r=[],n=0;n<e.length;++n)e[n]&&r.push({s:n,f:e[n]});var l=r.length,o=r.slice();if(!l)return{t:W,l:0};if(1==l){var s=new i(r[0].s+1);return s[r[0].s]=1,{t:s,l:1}}r.sort(function(e,t){return e.f-t.f}),r.push({s:-1,f:25001});var f=r[0],u=r[1],c=0,h=1,p=2;for(r[0]={s:-1,f:f.f+u.f,l:f,r:u};h!=l-1;)f=r[r[c].f<r[p].f?c++:p++],u=r[c!=h&&r[c].f<r[p].f?c++:p++],r[h++]={s:-1,f:f.f+u.f,l:f,r:u};for(var d=o[0].s,n=1;n<l;++n)o[n].s>d&&(d=o[n].s);var v=new a(d+1),w=z(r[h-1],v,0);if(w>t){var n=0,y=0,g=w-t,m=1<<g;for(o.sort(function(e,t){return v[t.s]-v[e.s]||e.f-t.f});n<l;++n){var b=o[n].s;if(v[b]>t)y+=m-(1<<w-v[b]),v[b]=t;else break}for(y>>=g;y>0;){var E=o[n].s;v[E]<t?y-=1<<t-v[E]++-1:++n}for(;n>=0&&y;--n){var S=o[n].s;v[S]==t&&(--v[S],++y)}w=t}return{t:new i(v),l:w}},z=function(e,t,r){return -1==e.s?Math.max(z(e.l,t,r+1),z(e.r,t,r+1)):t[e.s]=r},F=function(e){for(var t=e.length;t&&!e[--t];);for(var r=new a(++t),n=0,l=e[0],i=1,o=function(e){r[n++]=e},s=1;s<=t;++s)if(e[s]==l&&s!=t)++i;else{if(!l&&i>2){for(;i>138;i-=138)o(32754);i>2&&(o(i>10?i-11<<5|28690:i-3<<5|12305),i=0)}else if(i>3){for(o(l),--i;i>6;i-=6)o(8304);i>2&&(o(i-3<<5|8208),i=0)}for(;i--;)o(l);i=1,l=e[s]}return{c:r.subarray(0,n),n:t}},_=function(e,t){for(var r=0,n=0;n<t.length;++n)r+=e[n]*t[n];return r},D=function(e,t,r){var n=r.length,l=O(t+2);e[l]=255&n,e[l+1]=n>>8,e[l+2]=255^e[l],e[l+3]=255^e[l+1];for(var i=0;i<n;++i)e[l+i+4]=r[i];return(l+4+n)*8},B=function(e,t,r,n,l,i,o,c,h,p,d){P(t,d++,r),++l[256];for(var v,w,y,g,m=H(l,15),b=m.t,A=m.l,C=H(i,15),U=C.t,R=C.l,k=F(b),O=k.c,x=k.n,L=F(U),T=L.c,I=L.n,z=new a(19),B=0;B<O.length;++B)++z[31&O[B]];for(var B=0;B<T.length;++B)++z[31&T[B]];for(var V=H(z,7),W=V.t,X=V.l,G=19;G>4&&!W[u[G-1]];--G);var Y=p+5<<3,Z=_(l,S)+_(i,M)+o,$=_(l,b)+_(i,U)+o+14+3*G+_(z,W)+2*z[16]+3*z[17]+7*z[18];if(h>=0&&Y<=Z&&Y<=$)return D(t,d,e.subarray(h,h+p));if(P(t,d,1+($<Z)),d+=2,$<Z){v=E(b,A,0),w=b,y=E(U,R,0),g=U;var q=E(W,X,0);P(t,d,x-257),P(t,d+5,I-1),P(t,d+10,G-4),d+=14;for(var B=0;B<G;++B)P(t,d+3*B,W[u[B]]);d+=3*G;for(var j=[O,T],J=0;J<2;++J)for(var K=j[J],B=0;B<K.length;++B){var Q=31&K[B];P(t,d,q[Q]),d+=W[Q],Q>15&&(P(t,d,K[B]>>5&127),d+=K[B]>>12)}}else v=null,w=S,y=null,g=M;for(var B=0;B<c;++B){var ee=n[B];if(ee>255){var Q=ee>>18&31;N(t,d,v[Q+257]),d+=w[Q+257],Q>7&&(P(t,d,ee>>23&31),d+=s[Q]);var et=31&ee;N(t,d,y[et]),d+=g[et],et>3&&(N(t,d,ee>>5&8191),d+=f[et])}else N(t,d,v[ee]),d+=w[ee]}return N(t,d,v[256]),d+w[256]},V=new o([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),W=new i(0),X=function(e,t,r,n,l,u){var c=u.z||e.length,h=new i(n+c+5*(1+Math.ceil(c/7e3))+l),p=h.subarray(n,h.length-l),v=u.l,w=7&(u.r||0);if(t){w&&(p[0]=u.r>>3);for(var g=V[t-1],m=g>>13,b=8191&g,E=(1<<r)-1,S=u.p||new a(32768),M=u.h||new a(E+1),A=Math.ceil(r/3),C=2*A,U=function(t){return(e[t]^e[t+1]<<A^e[t+2]<<C)&E},R=new o(25e3),k=new a(288),L=new a(32),T=0,I=0,P=u.i||0,N=0,H=u.w||0,z=0;P+2<c;++P){var F=U(P),_=32767&P,W=M[F];if(S[_]=W,M[F]=_,H<=P){var X=c-P;if((T>7e3||N>24576)&&(X>423||!v)){w=B(e,p,0,R,k,L,I,N,z,P-z,w),N=T=I=0,z=P;for(var G=0;G<286;++G)k[G]=0;for(var G=0;G<30;++G)L[G]=0}var Y=2,Z=0,$=b,q=_-W&32767;if(X>2&&F==U(P-q))for(var j=Math.min(m,X)-1,J=Math.min(32767,P),K=Math.min(258,X);q<=J&&--$&&_!=W;){if(e[P+Y]==e[P+Y-q]){for(var Q=0;Q<K&&e[P+Q]==e[P+Q-q];++Q);if(Q>Y){if(Y=Q,Z=q,Q>j)break;for(var ee=Math.min(q,Q-2),et=0,G=0;G<ee;++G){var er=P-q+G&32767,en=S[er],el=er-en&32767;el>et&&(et=el,W=er)}}}W=S[_=W],q+=_-W&32767}if(Z){R[N++]=268435456|d[Y]<<18|y[Z];var ei=31&d[Y],ea=31&y[Z];I+=s[ei]+f[ea],++k[257+ei],++L[ea],H=P+Y,++T}else R[N++]=e[P],++k[e[P]]}}for(P=Math.max(P,H);P<c;++P)R[N++]=e[P],++k[e[P]];w=B(e,p,v,R,k,L,I,N,z,P-z,w),v||(u.r=7&w|p[w/8|0]<<3,w-=7,u.h=M,u.p=S,u.i=P,u.w=H)}else{for(var P=u.w||0;P<c+v;P+=65535){var eo=P+65535;eo>=c&&(p[w/8|0]=v,eo=c),w=D(p,w+1,e.subarray(P,eo))}u.i=c}return x(h,0,n+O(w)+l)};function G(e,t){var r;return I(e.subarray((r=t&&t.dictionary,((15&e[0])!=8||e[0]>>4>7||(e[0]<<8|e[1])%31)&&T(6,"invalid zlib data"),(e[1]>>5&1)==+!r&&T(6,"invalid zlib data: "+(32&e[1]?"need":"unexpected")+" dictionary"),(e[1]>>3&4)+2),-4),{i:2},t&&t.out,t&&t.dictionary)}var Y="undefined"!=typeof TextDecoder&&new TextDecoder;try{Y.decode(W,{stream:!0})}catch(e){}"function"==typeof queueMicrotask?queueMicrotask:"function"==typeof setTimeout&&setTimeout;class Z extends n.DataTextureLoader{constructor(e){super(e),this.type=n.HalfFloatType}parse(e){let t={l:0,c:0,lc:0};function r(e,r,n,l,i){for(;n<e;)r=r<<8|U(l,i),n+=8;n-=e,t.l=r>>n&(1<<e)-1,t.c=r,t.lc=n}let l=Array(59),i={c:0,lc:0};function a(e,t,r,n){e=e<<8|U(r,n),t+=8,i.c=e,i.lc=t}let o={c:0,lc:0};function s(e,t,r,n,l,s,f,u,c){if(e==t){n<8&&(a(r,n,l,s),r=i.c,n=i.lc);let e=r>>(n-=8);if(e=new Uint8Array([e])[0],u.value+e>c)return!1;let t=f[u.value-1];for(;e-- >0;)f[u.value++]=t}else{if(!(u.value<c))return!1;f[u.value++]=e}o.c=r,o.lc=n}function f(e){let t=65535&e;return t>32767?t-65536:t}let u={a:0,b:0};function c(e,t){let r=f(e),n=f(t),l=r+(1&n)+(n>>1),i=l-n;u.a=l,u.b=i}function h(e,t){let r=65535&t,n=(65535&e)-(r>>1)&65535;u.a=r+n-32768&65535,u.b=n}function p(e,n,f,u,c,h){let p=f.value,d=C(n,f),v=C(n,f);f.value+=4;let w=C(n,f);if(f.value+=4,d<0||d>=65537||v<0||v>=65537)throw Error("Something wrong with HUF_ENCSIZE");let y=Array(65537),g=Array(16384);!function(e){for(let t=0;t<16384;t++)e[t]={},e[t].len=0,e[t].lit=0,e[t].p=null}(g);let m=u-(f.value-p);if(!function(e,n,i,a,o,s){let f=0,u=0;for(;a<=o;a++){if(n.value-n.value>i)return!1;r(6,f,u,e,n);let l=t.l;if(f=t.c,u=t.lc,s[a]=l,63==l){if(n.value-n.value>i)throw Error("Something wrong with hufUnpackEncTable");r(8,f,u,e,n);let l=t.l+6;if(f=t.c,u=t.lc,a+l>o+1)throw Error("Something wrong with hufUnpackEncTable");for(;l--;)s[a++]=0;a--}else if(l>=59){let e=l-59+2;if(a+e>o+1)throw Error("Something wrong with hufUnpackEncTable");for(;e--;)s[a++]=0;a--}}!function(e){for(let e=0;e<=58;++e)l[e]=0;for(let t=0;t<65537;++t)l[e[t]]+=1;let t=0;for(let e=58;e>0;--e){let r=t+l[e]>>1;l[e]=t,t=r}for(let t=0;t<65537;++t){let r=e[t];r>0&&(e[t]=r|l[r]++<<6)}}(s)}(e,f,m,d,v,y),w>8*(u-(f.value-p)))throw Error("Something wrong with hufUncompress");!function(e,t,r,n){for(;t<=r;t++){let r=e[t]>>6,l=63&e[t];if(r>>l)throw Error("Invalid table entry");if(l>14){let e=n[r>>l-14];if(e.len)throw Error("Invalid table entry");if(e.lit++,e.p){let t=e.p;e.p=Array(e.lit);for(let r=0;r<e.lit-1;++r)e.p[r]=t[r]}else e.p=[,];e.p[e.lit-1]=t}else if(l){let e=0;for(let i=1<<14-l;i>0;i--){let i=n[(r<<14-l)+e];if(i.len||i.p)throw Error("Invalid table entry");i.len=l,i.lit=t,e++}}}}(y,d,v,g),function(e,t,r,n,l,f,u,c,h){let p=0,d=0,v=Math.trunc(n.value+(l+7)/8);for(;n.value<v;)for(a(p,d,r,n),p=i.c,d=i.lc;d>=14;){let l=t[p>>d-14&16383];if(l.len)d-=l.len,s(l.lit,f,p,d,r,n,c,h,u),p=o.c,d=o.lc;else{let t;if(!l.p)throw Error("hufDecode issues");for(t=0;t<l.lit;t++){let w=63&e[l.p[t]];for(;d<w&&n.value<v;)a(p,d,r,n),p=i.c,d=i.lc;if(d>=w&&e[l.p[t]]>>6==(p>>d-w&(1<<w)-1)){d-=w,s(l.p[t],f,p,d,r,n,c,h,u),p=o.c,d=o.lc;break}}if(t==l.lit)throw Error("hufDecode issues")}}let w=8-l&7;for(p>>=w,d-=w;d>0;){let e=t[p<<14-d&16383];if(e.len)d-=e.len,s(e.lit,f,p,d,r,n,c,h,u),p=o.c,d=o.lc;else throw Error("hufDecode issues")}}(y,g,e,f,w,v,h,c,{value:0})}function d(e){for(let t=1;t<e.length;t++){let r=e[t-1]+e[t]-128;e[t]=r}}function v(e,t){let r=0,n=Math.floor((e.length+1)/2),l=0,i=e.length-1;for(;!(l>i)&&(t[l++]=e[r++],!(l>i));)t[l++]=e[n++]}function w(e){let t=e.byteLength,r=[],n=0,l=new DataView(e);for(;t>0;){let e=l.getInt8(n++);if(e<0){let i=-e;t-=i+1;for(let e=0;e<i;e++)r.push(l.getUint8(n++))}else{t-=2;let i=l.getUint8(n++);for(let t=0;t<e+1;t++)r.push(i)}}return r}function y(e){return new DataView(e.array.buffer,e.offset.value,e.size)}function g(e){let t=new Uint8Array(w(e.viewer.buffer.slice(e.offset.value,e.offset.value+e.size))),r=new Uint8Array(t.length);return d(t),v(t,r),new DataView(r.buffer)}function m(e){let t=G(e.array.slice(e.offset.value,e.offset.value+e.size)),r=new Uint8Array(t.length);return d(t),v(t,r),new DataView(r.buffer)}function b(e){let t=e.viewer,r={value:e.offset.value},n=new Uint16Array(e.columns*e.lines*(e.inputChannels.length*e.type)),l=new Uint8Array(8192),i=0,a=Array(e.inputChannels.length);for(let t=0,r=e.inputChannels.length;t<r;t++)a[t]={},a[t].start=i,a[t].end=a[t].start,a[t].nx=e.columns,a[t].ny=e.lines,a[t].size=e.type,i+=a[t].nx*a[t].ny*a[t].size;let o=T(t,r),s=T(t,r);if(s>=8192)throw Error("Something is wrong with PIZ_COMPRESSION BITMAP_SIZE");if(o<=s)for(let e=0;e<s-o+1;e++)l[e+o]=R(t,r);let f=new Uint16Array(65536),d=function(e,t){let r=0;for(let n=0;n<65536;++n)(0==n||e[n>>3]&1<<(7&n))&&(t[r++]=n);let n=r-1;for(;r<65536;)t[r++]=0;return n}(l,f),v=C(t,r);p(e.array,t,r,v,n,i);for(let t=0;t<e.inputChannels.length;++t){let e=a[t];for(let r=0;r<a[t].size;++r)!function(e,t,r,n,l,i,a){let o,s;let f=a<16384,p=r>l?l:r,d=1;for(;d<=p;)d<<=1;for(d>>=1,o=d,d>>=1;d>=1;){let a,p,v,w;let y=(s=0)+i*(l-o),g=i*d,m=i*o,b=n*d,E=n*o;for(;s<=y;s+=m){let l=s,i=s+n*(r-o);for(;l<=i;l+=E){let r=l+b,n=l+g,i=n+b;f?(c(e[l+t],e[n+t]),a=u.a,v=u.b,c(e[r+t],e[i+t]),p=u.a,w=u.b,c(a,p),e[l+t]=u.a,e[r+t]=u.b,c(v,w)):(h(e[l+t],e[n+t]),a=u.a,v=u.b,h(e[r+t],e[i+t]),p=u.a,w=u.b,h(a,p),e[l+t]=u.a,e[r+t]=u.b,h(v,w)),e[n+t]=u.a,e[i+t]=u.b}if(r&d){let r=l+g;f?c(e[l+t],e[r+t]):h(e[l+t],e[r+t]),a=u.a,e[r+t]=u.b,e[l+t]=a}}if(l&d){let l=s,i=s+n*(r-o);for(;l<=i;l+=E){let r=l+b;f?c(e[l+t],e[r+t]):h(e[l+t],e[r+t]),a=u.a,e[r+t]=u.b,e[l+t]=a}}o=d,d>>=1}}(n,e.start+r,e.nx,e.size,e.ny,e.nx*e.size,d)}!function(e,t,r){for(let n=0;n<r;++n)t[n]=e[t[n]]}(f,n,i);let w=0,y=new Uint8Array(n.buffer.byteLength);for(let t=0;t<e.lines;t++)for(let t=0;t<e.inputChannels.length;t++){let e=a[t],r=e.nx*e.size,l=new Uint8Array(n.buffer,2*e.end,2*r);y.set(l,w),w+=2*r,e.end+=r}return new DataView(y.buffer)}function E(e){let t=G(e.array.slice(e.offset.value,e.offset.value+e.size)),r=new DataView(new ArrayBuffer(e.inputChannels.length*e.lines*e.columns*e.totalBytes)),n=0,l=0,i=[,,,,];for(let a=0;a<e.lines;a++)for(let a=0;a<e.inputChannels.length;a++){let o=0;switch(e.inputChannels[a].pixelType){case 1:i[0]=n,i[1]=i[0]+e.columns,n=i[1]+e.columns;for(let n=0;n<e.columns;++n)o+=t[i[0]++]<<8|t[i[1]++],r.setUint16(l,o,!0),l+=2;break;case 2:i[0]=n,i[1]=i[0]+e.columns,i[2]=i[1]+e.columns,n=i[2]+e.columns;for(let n=0;n<e.columns;++n)o+=t[i[0]++]<<24|t[i[1]++]<<16|t[i[2]++]<<8,r.setUint32(l,o,!0),l+=4}}return r}function S(e){let t,r,l;let i=e.viewer,a={value:e.offset.value},o=new Uint8Array(e.columns*e.lines*(e.inputChannels.length*e.type*2)),s={version:k(i,a),unknownUncompressedSize:k(i,a),unknownCompressedSize:k(i,a),acCompressedSize:k(i,a),dcCompressedSize:k(i,a),rleCompressedSize:k(i,a),rleUncompressedSize:k(i,a),rleRawSize:k(i,a),totalAcUncompressedCount:k(i,a),totalDcUncompressedCount:k(i,a),acCompression:k(i,a)};if(s.version<2)throw Error("EXRLoader.parse: "+D.compression+" version "+s.version+" is unsupported");let f=[],u=T(i,a)-2;for(;u>0;){let e=M(i.buffer,a),t=R(i,a),r=t>>2&3,n=new Int8Array([(t>>4)-1])[0],l=R(i,a);f.push({name:e,index:n,type:l,compression:r}),u-=e.length+3}let c=D.channels,h=Array(e.inputChannels.length);for(let t=0;t<e.inputChannels.length;++t){let r=h[t]={},n=c[t];r.name=n.name,r.compression=0,r.decoded=!1,r.type=n.pixelType,r.pLinear=n.pLinear,r.width=e.columns,r.height=e.lines}let d={idx:[,,,]};for(let t=0;t<e.inputChannels.length;++t){let e=h[t];for(let r=0;r<f.length;++r){let n=f[r];e.name==n.name&&(e.compression=n.compression,n.index>=0&&(d.idx[n.index]=t),e.offset=t)}}if(s.acCompressedSize>0)switch(s.acCompression){case 0:t=new Uint16Array(s.totalAcUncompressedCount),p(e.array,i,a,s.acCompressedSize,t,s.totalAcUncompressedCount);break;case 1:t=new Uint16Array(G(e.array.slice(a.value,a.value+s.totalAcUncompressedCount)).buffer),a.value+=s.totalAcUncompressedCount}s.dcCompressedSize>0&&(r=new Uint16Array(m({array:e.array,offset:a,size:s.dcCompressedSize}).buffer),a.value+=s.dcCompressedSize),s.rleRawSize>0&&(l=w(G(e.array.slice(a.value,a.value+s.rleCompressedSize)).buffer),a.value+=s.rleCompressedSize);let v=0,y=Array(h.length);for(let e=0;e<y.length;++e)y[e]=[];for(let t=0;t<e.lines;++t)for(let t=0;t<h.length;++t)y[t].push(v),v+=h[t].width*e.type*2;!function(e,t,r,l,i,a){let o=new DataView(a.buffer),s=r[e.idx[0]].width,f=r[e.idx[0]].height,u=Math.floor(s/8),c=Math.ceil(s/8),h=Math.ceil(f/8),p=s-(c-1)*8,d=f-(h-1)*8,v={value:0},w=[,,,],y=[,,,],g=[,,,],m=[,,,],b=[,,,];for(let r=0;r<3;++r)b[r]=t[e.idx[r]],w[r]=r<1?0:w[r-1]+c*h,y[r]=new Float32Array(64),g[r]=new Uint16Array(64),m[r]=new Uint16Array(64*c);for(let t=0;t<h;++t){let a=8;t==h-1&&(a=d);let s=8;for(let e=0;e<c;++e){e==c-1&&(s=p);for(let e=0;e<3;++e){var E,S;g[e].fill(0),g[e][0]=i[w[e]++],function(e,t,r){let n;let l=1;for(;l<64;)65280==(n=t[e.value])?l=64:n>>8==255?l+=255&n:(r[l]=n,l++),e.value++}(v,l,g[e]),E=g[e],(S=y[e])[0]=L(E[0]),S[1]=L(E[1]),S[2]=L(E[5]),S[3]=L(E[6]),S[4]=L(E[14]),S[5]=L(E[15]),S[6]=L(E[27]),S[7]=L(E[28]),S[8]=L(E[2]),S[9]=L(E[4]),S[10]=L(E[7]),S[11]=L(E[13]),S[12]=L(E[16]),S[13]=L(E[26]),S[14]=L(E[29]),S[15]=L(E[42]),S[16]=L(E[3]),S[17]=L(E[8]),S[18]=L(E[12]),S[19]=L(E[17]),S[20]=L(E[25]),S[21]=L(E[30]),S[22]=L(E[41]),S[23]=L(E[43]),S[24]=L(E[9]),S[25]=L(E[11]),S[26]=L(E[18]),S[27]=L(E[24]),S[28]=L(E[31]),S[29]=L(E[40]),S[30]=L(E[44]),S[31]=L(E[53]),S[32]=L(E[10]),S[33]=L(E[19]),S[34]=L(E[23]),S[35]=L(E[32]),S[36]=L(E[39]),S[37]=L(E[45]),S[38]=L(E[52]),S[39]=L(E[54]),S[40]=L(E[20]),S[41]=L(E[22]),S[42]=L(E[33]),S[43]=L(E[38]),S[44]=L(E[46]),S[45]=L(E[51]),S[46]=L(E[55]),S[47]=L(E[60]),S[48]=L(E[21]),S[49]=L(E[34]),S[50]=L(E[37]),S[51]=L(E[47]),S[52]=L(E[50]),S[53]=L(E[56]),S[54]=L(E[59]),S[55]=L(E[61]),S[56]=L(E[35]),S[57]=L(E[36]),S[58]=L(E[48]),S[59]=L(E[49]),S[60]=L(E[57]),S[61]=L(E[58]),S[62]=L(E[62]),S[63]=L(E[63]),function(e){let t=.5*Math.cos(3*3.14159/16),r=.5*Math.cos(3*3.14159/8),n=[,,,,],l=[,,,,],i=[,,,,],a=[,,,,];for(let o=0;o<8;++o){let s=8*o;n[0]=.4619398297234211*e[s+2],n[1]=r*e[s+2],n[2]=.4619398297234211*e[s+6],n[3]=r*e[s+6],l[0]=.4903926563794112*e[s+1]+t*e[s+3]+.2777854612564676*e[s+5]+.09754573032714427*e[s+7],l[1]=t*e[s+1]-.09754573032714427*e[s+3]-.4903926563794112*e[s+5]-.2777854612564676*e[s+7],l[2]=.2777854612564676*e[s+1]-.4903926563794112*e[s+3]+.09754573032714427*e[s+5]+t*e[s+7],l[3]=.09754573032714427*e[s+1]-.2777854612564676*e[s+3]+t*e[s+5]-.4903926563794112*e[s+7],i[0]=.35355362513961314*(e[s+0]+e[s+4]),i[3]=.35355362513961314*(e[s+0]-e[s+4]),i[1]=n[0]+n[3],i[2]=n[1]-n[2],a[0]=i[0]+i[1],a[1]=i[3]+i[2],a[2]=i[3]-i[2],a[3]=i[0]-i[1],e[s+0]=a[0]+l[0],e[s+1]=a[1]+l[1],e[s+2]=a[2]+l[2],e[s+3]=a[3]+l[3],e[s+4]=a[3]-l[3],e[s+5]=a[2]-l[2],e[s+6]=a[1]-l[1],e[s+7]=a[0]-l[0]}for(let o=0;o<8;++o)n[0]=.4619398297234211*e[16+o],n[1]=r*e[16+o],n[2]=.4619398297234211*e[48+o],n[3]=r*e[48+o],l[0]=.4903926563794112*e[8+o]+t*e[24+o]+.2777854612564676*e[40+o]+.09754573032714427*e[56+o],l[1]=t*e[8+o]-.09754573032714427*e[24+o]-.4903926563794112*e[40+o]-.2777854612564676*e[56+o],l[2]=.2777854612564676*e[8+o]-.4903926563794112*e[24+o]+.09754573032714427*e[40+o]+t*e[56+o],l[3]=.09754573032714427*e[8+o]-.2777854612564676*e[24+o]+t*e[40+o]-.4903926563794112*e[56+o],i[0]=.35355362513961314*(e[o]+e[32+o]),i[3]=.35355362513961314*(e[o]-e[32+o]),i[1]=n[0]+n[3],i[2]=n[1]-n[2],a[0]=i[0]+i[1],a[1]=i[3]+i[2],a[2]=i[3]-i[2],a[3]=i[0]-i[1],e[0+o]=a[0]+l[0],e[8+o]=a[1]+l[1],e[16+o]=a[2]+l[2],e[24+o]=a[3]+l[3],e[32+o]=a[3]-l[3],e[40+o]=a[2]-l[2],e[48+o]=a[1]-l[1],e[56+o]=a[0]-l[0]}(y[e])}!function(e){for(let t=0;t<64;++t){let r=e[0][t],n=e[1][t],l=e[2][t];e[0][t]=r+1.5747*l,e[1][t]=r-.1873*n-.4682*l,e[2][t]=r+1.8556*n}}(y);for(let t=0;t<3;++t)!function(e,t,r){for(let i=0;i<64;++i){var l;t[r+i]=n.DataUtils.toHalfFloat((l=e[i])<=1?Math.sign(l)*Math.pow(Math.abs(l),2.2):Math.sign(l)*Math.pow(9.025013291561939,Math.abs(l)-1))}}(y[t],m[t],64*e)}let f=0;for(let n=0;n<3;++n){let l=r[e.idx[n]].type;for(let e=8*t;e<8*t+a;++e){f=b[n][e];for(let t=0;t<u;++t){let r=64*t+(7&e)*8;o.setUint16(f+0*l,m[n][r+0],!0),o.setUint16(f+2*l,m[n][r+1],!0),o.setUint16(f+4*l,m[n][r+2],!0),o.setUint16(f+6*l,m[n][r+3],!0),o.setUint16(f+8*l,m[n][r+4],!0),o.setUint16(f+10*l,m[n][r+5],!0),o.setUint16(f+12*l,m[n][r+6],!0),o.setUint16(f+14*l,m[n][r+7],!0),f+=16*l}}if(u!=c)for(let e=8*t;e<8*t+a;++e){let t=b[n][e]+8*u*2*l,r=64*u+(7&e)*8;for(let e=0;e<s;++e)o.setUint16(t+2*e*l,m[n][r+e],!0)}}}let M=new Uint16Array(s);o=new DataView(a.buffer);for(let t=0;t<3;++t){r[e.idx[t]].decoded=!0;let n=r[e.idx[t]].type;if(2==r[t].type)for(let e=0;e<f;++e){let r=b[t][e];for(let e=0;e<s;++e)M[e]=o.getUint16(r+2*e*n,!0);for(let e=0;e<s;++e)o.setFloat32(r+2*e*n,L(M[e]),!0)}}}(d,y,h,t,r,o);for(let t=0;t<h.length;++t){let r=h[t];if(!r.decoded){if(2===r.compression){let n=0,i=0;for(let a=0;a<e.lines;++a){let e=y[t][n];for(let t=0;t<r.width;++t){for(let t=0;t<2*r.type;++t)o[e++]=l[i+t*r.width*r.height];i++}n++}}else throw Error("EXRLoader.parse: unsupported channel compression")}}return new DataView(o.buffer)}function M(e,t){let r=new Uint8Array(e),n=0;for(;0!=r[t.value+n];)n+=1;let l=new TextDecoder().decode(r.slice(t.value,t.value+n));return t.value=t.value+n+1,l}function A(e,t){let r=e.getInt32(t.value,!0);return t.value=t.value+4,r}function C(e,t){let r=e.getUint32(t.value,!0);return t.value=t.value+4,r}function U(e,t){let r=e[t.value];return t.value=t.value+1,r}function R(e,t){let r=e.getUint8(t.value);return t.value=t.value+1,r}let k=function(e,t){let r;return"getBigInt64"in DataView.prototype?r=Number(e.getBigInt64(t.value,!0)):r=e.getUint32(t.value+4,!0)+Number(e.getUint32(t.value,!0)<<32),t.value+=8,r};function O(e,t){let r=e.getFloat32(t.value,!0);return t.value+=4,r}function x(e,t){return n.DataUtils.toHalfFloat(O(e,t))}function L(e){let t=(31744&e)>>10,r=1023&e;return(e>>15?-1:1)*(t?31===t?r?NaN:1/0:Math.pow(2,t-15)*(1+r/1024):r/1024*6103515625e-14)}function T(e,t){let r=e.getUint16(t.value,!0);return t.value+=2,r}function I(e,t){return L(T(e,t))}function P(e,t,r,n){let l=Array(e);for(let i=0;i<e;i++){let e=1<<i,a=t/e|0;"ROUND_UP"==n&&a*e<t&&(a+=1);let o=Math.max(a,1);l[i]=(o+r-1)/r|0}return l}function N(){let e=this.offset,t={value:0};for(let r=0;r<this.tileCount;r++){let r=A(this.viewer,e),n=A(this.viewer,e);e.value+=8,this.size=C(this.viewer,e);let l=r*this.blockWidth,i=n*this.blockHeight;this.columns=l+this.blockWidth>this.width?this.width-l:this.blockWidth,this.lines=i+this.blockHeight>this.height?this.height-i:this.blockHeight;let a=this.columns*this.totalBytes,o=this.size<this.lines*a?this.uncompress(this):y(this);e.value+=this.size;for(let e=0;e<this.lines;e++){let r=e*this.columns*this.totalBytes;for(let n=0;n<this.inputChannels.length;n++){let a=D.channels[n].name,s=this.channelByteOffsets[a]*this.columns,f=this.decodeChannels[a];if(void 0===f)continue;t.value=r+s;let u=(this.height-(1+i+e))*this.outLineWidth;for(let e=0;e<this.columns;e++){let r=u+(e+l)*this.outputChannels+f;this.byteArray[r]=this.getter(o,t)}}}}}function H(){let e=this.offset,t={value:0};for(let r=0;r<this.height/this.blockHeight;r++){let n=A(this.viewer,e)-D.dataWindow.yMin;this.size=C(this.viewer,e),this.lines=n+this.blockHeight>this.height?this.height-n:this.blockHeight;let l=this.columns*this.totalBytes,i=this.size<this.lines*l?this.uncompress(this):y(this);e.value+=this.size;for(let e=0;e<this.blockHeight;e++){let n=r*this.blockHeight,a=e+this.scanOrder(n);if(a>=this.height)continue;let o=e*l,s=(this.height-1-a)*this.outLineWidth;for(let e=0;e<this.inputChannels.length;e++){let r=D.channels[e].name,n=this.channelByteOffsets[r]*this.columns,l=this.decodeChannels[r];if(void 0!==l){t.value=o+n;for(let e=0;e<this.columns;e++){let r=s+e*this.outputChannels+l;this.byteArray[r]=this.getter(i,t)}}}}}}let z={value:0},F=new DataView(e),_=new Uint8Array(e),D=function(e,t,r){let n={};if(20000630!=e.getUint32(0,!0))throw Error("THREE.EXRLoader: Provided file doesn't appear to be in OpenEXR format.");n.version=e.getUint8(4);let l=e.getUint8(5);n.spec={singleTile:!!(2&l),longName:!!(4&l),deepFormat:!!(8&l),multiPart:!!(16&l)},r.value=8;let i=!0;for(;i;){let l=M(t,r);if(0==l)i=!1;else{let i=M(t,r),a=C(e,r),o=function(e,t,r,n,l){if("string"===n||"stringvector"===n||"iccProfile"===n)return function(e,t,r){let n=new TextDecoder().decode(new Uint8Array(e).slice(t.value,t.value+r));return t.value=t.value+r,n}(t,r,l);if("chlist"===n)return function(e,t,r,n){let l=r.value,i=[];for(;r.value<l+n-1;){let n=M(t,r),l=A(e,r),a=R(e,r);r.value+=3;let o=A(e,r),s=A(e,r);i.push({name:n,pixelType:l,pLinear:a,xSampling:o,ySampling:s})}return r.value+=1,i}(e,t,r,l);if("chromaticities"===n)return function(e,t){let r=O(e,t),n=O(e,t),l=O(e,t),i=O(e,t),a=O(e,t);return{redX:r,redY:n,greenX:l,greenY:i,blueX:a,blueY:O(e,t),whiteX:O(e,t),whiteY:O(e,t)}}(e,r);if("compression"===n)return["NO_COMPRESSION","RLE_COMPRESSION","ZIPS_COMPRESSION","ZIP_COMPRESSION","PIZ_COMPRESSION","PXR24_COMPRESSION","B44_COMPRESSION","B44A_COMPRESSION","DWAA_COMPRESSION","DWAB_COMPRESSION"][R(e,r)];if("box2i"===n)return function(e,t){let r=A(e,t);return{xMin:r,yMin:A(e,t),xMax:A(e,t),yMax:A(e,t)}}(e,r);if("envmap"===n)return["ENVMAP_LATLONG","ENVMAP_CUBE"][R(e,r)];if("tiledesc"===n)return function(e,t){let r=C(e,t),n=C(e,t),l=R(e,t);return{xSize:r,ySize:n,levelMode:["ONE_LEVEL","MIPMAP_LEVELS","RIPMAP_LEVELS"][15&l],roundingMode:["ROUND_DOWN","ROUND_UP"][l>>4]}}(e,r);if("lineOrder"===n)return["INCREASING_Y","DECREASING_Y","RANDOM_Y"][R(e,r)];if("float"===n)return O(e,r);if("v2f"===n)return[O(e,r),O(e,r)];if("v3f"===n){var i,a;return[O(i=e,a=r),O(i,a),O(i,a)]}return"int"===n?A(e,r):"rational"===n?[A(e,r),C(e,r)]:"timecode"===n?[C(e,r),C(e,r)]:"preview"===n?(r.value+=l,"skipped"):void(r.value+=l)}(e,t,r,i,a);void 0===o?console.warn(`THREE.EXRLoader: Skipped unknown header attribute type '${i}'.`):n[l]=o}}if((-7&l)!=0)throw console.error("THREE.EXRHeader:",n),Error("THREE.EXRLoader: Provided file is currently unsupported.");return n}(F,e,z),B=function(e,t,r,l,i){let a={size:0,viewer:t,array:r,offset:l,width:e.dataWindow.xMax-e.dataWindow.xMin+1,height:e.dataWindow.yMax-e.dataWindow.yMin+1,inputChannels:e.channels,channelByteOffsets:{},scanOrder:null,totalBytes:null,columns:null,lines:null,type:null,uncompress:null,getter:null,format:null,colorSpace:n.LinearSRGBColorSpace};switch(e.compression){case"NO_COMPRESSION":a.blockHeight=1,a.uncompress=y;break;case"RLE_COMPRESSION":a.blockHeight=1,a.uncompress=g;break;case"ZIPS_COMPRESSION":a.blockHeight=1,a.uncompress=m;break;case"ZIP_COMPRESSION":a.blockHeight=16,a.uncompress=m;break;case"PIZ_COMPRESSION":a.blockHeight=32,a.uncompress=b;break;case"PXR24_COMPRESSION":a.blockHeight=16,a.uncompress=E;break;case"DWAA_COMPRESSION":a.blockHeight=32,a.uncompress=S;break;case"DWAB_COMPRESSION":a.blockHeight=256,a.uncompress=S;break;default:throw Error("EXRLoader.parse: "+e.compression+" is unsupported")}let o={};for(let t of e.channels)switch(t.name){case"Y":case"R":case"G":case"B":case"A":o[t.name]=!0,a.type=t.pixelType}let s=!1;if(o.R&&o.G&&o.B)s=!o.A,a.outputChannels=4,a.decodeChannels={R:0,G:1,B:2,A:3};else if(o.Y)a.outputChannels=1,a.decodeChannels={Y:0};else throw Error("EXRLoader.parse: file contains unsupported data channels.");if(1==a.type)switch(i){case n.FloatType:a.getter=I;break;case n.HalfFloatType:a.getter=T}else if(2==a.type)switch(i){case n.FloatType:a.getter=O;break;case n.HalfFloatType:a.getter=x}else throw Error("EXRLoader.parse: unsupported pixelType "+a.type+" for "+e.compression+".");a.columns=a.width;let f=a.width*a.height*a.outputChannels;switch(i){case n.FloatType:a.byteArray=new Float32Array(f),s&&a.byteArray.fill(1,0,f);break;case n.HalfFloatType:a.byteArray=new Uint16Array(f),s&&a.byteArray.fill(15360,0,f);break;default:console.error("THREE.EXRLoader: unsupported type: ",i)}let u=0;for(let t of e.channels)void 0!==a.decodeChannels[t.name]&&(a.channelByteOffsets[t.name]=u),u+=2*t.pixelType;if(a.totalBytes=u,a.outLineWidth=a.width*a.outputChannels,"INCREASING_Y"===e.lineOrder?a.scanOrder=e=>e:a.scanOrder=e=>a.height-1-e,4==a.outputChannels?(a.format=n.RGBAFormat,a.colorSpace=n.LinearSRGBColorSpace):(a.format=n.RedFormat,a.colorSpace=n.NoColorSpace),e.spec.singleTile){a.blockHeight=e.tiles.ySize,a.blockWidth=e.tiles.xSize;let r=function(e,t,r){let n=0;switch(e.levelMode){case"ONE_LEVEL":n=1;break;case"MIPMAP_LEVELS":n=function(e,t){let r=Math.log2(e);return"ROUND_DOWN"==t?Math.floor(r):Math.ceil(r)}(Math.max(t,r),e.roundingMode)+1;break;case"RIPMAP_LEVELS":throw Error("THREE.EXRLoader: RIPMAP_LEVELS tiles currently unsupported.")}return n}(e.tiles,a.width,a.height),n=P(r,a.width,e.tiles.xSize,e.tiles.roundingMode),i=P(r,a.height,e.tiles.ySize,e.tiles.roundingMode);a.tileCount=n[0]*i[0];for(let e=0;e<r;e++)for(let r=0;r<i[e];r++)for(let r=0;r<n[e];r++)k(t,l);a.decode=N.bind(a)}else{a.blockWidth=a.width;let e=Math.ceil(a.height/a.blockHeight);for(let r=0;r<e;r++)k(t,l);a.decode=H.bind(a)}return a}(D,F,_,z,this.type);return B.decode(),{header:D,width:B.width,height:B.height,data:B.byteArray,format:B.format,colorSpace:B.colorSpace,type:this.type}}setDataType(e){return this.type=e,this}load(e,t,r,l){return super.load(e,function(e,r){e.colorSpace=r.colorSpace,e.minFilter=n.LinearFilter,e.magFilter=n.LinearFilter,e.generateMipmaps=!1,e.flipY=!1,t&&t(e,r)},r,l)}}},91310:function(e,t,r){r.d(t,{x:function(){return l}});var n=r(64740);class l extends n.DataTextureLoader{constructor(e){super(e),this.type=n.HalfFloatType}parse(e){let t,r,l;let i=function(e,t){switch(e){case 1:throw Error("THREE.RGBELoader: Read Error: "+(t||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(t||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(t||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(t||""))}},a=function(e,t,r){t=t||1024;let n=e.pos,l=-1,i=0,a="",o=String.fromCharCode.apply(null,new Uint16Array(e.subarray(n,n+128)));for(;0>(l=o.indexOf("\n"))&&i<t&&n<e.byteLength;)a+=o,i+=o.length,n+=128,o+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(n,n+128)));return -1<l&&(!1!==r&&(e.pos+=i+l+1),a+o.slice(0,l))},o=new Uint8Array(e);o.pos=0;let s=function(e){let t,r;let n=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,l=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,o=/^\s*FORMAT=(\S+)\s*$/,s=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,f={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};for(!(e.pos>=e.byteLength)&&(t=a(e))||i(1,"no header found"),(r=t.match(/^#\?(\S+)/))||i(3,"bad initial token"),f.valid|=1,f.programtype=r[1],f.string+=t+"\n";!1!==(t=a(e));){if(f.string+=t+"\n","#"===t.charAt(0)){f.comments+=t+"\n";continue}if((r=t.match(n))&&(f.gamma=parseFloat(r[1])),(r=t.match(l))&&(f.exposure=parseFloat(r[1])),(r=t.match(o))&&(f.valid|=2,f.format=r[1]),(r=t.match(s))&&(f.valid|=4,f.height=parseInt(r[1],10),f.width=parseInt(r[2],10)),2&f.valid&&4&f.valid)break}return 2&f.valid||i(3,"missing format specifier"),4&f.valid||i(3,"missing image size specifier"),f}(o),f=s.width,u=s.height,c=function(e,t,r){if(t<8||t>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);t!==(e[2]<<8|e[3])&&i(3,"wrong scanline width");let n=new Uint8Array(4*t*r);n.length||i(4,"unable to allocate buffer space");let l=0,a=0,o=4*t,s=new Uint8Array(4),f=new Uint8Array(o),u=r;for(;u>0&&a<e.byteLength;){a+4>e.byteLength&&i(1),s[0]=e[a++],s[1]=e[a++],s[2]=e[a++],s[3]=e[a++],(2!=s[0]||2!=s[1]||(s[2]<<8|s[3])!=t)&&i(3,"bad rgbe scanline format");let r=0,c;for(;r<o&&a<e.byteLength;){let t=(c=e[a++])>128;if(t&&(c-=128),(0===c||r+c>o)&&i(3,"bad scanline data"),t){let t=e[a++];for(let e=0;e<c;e++)f[r++]=t}else f.set(e.subarray(a,a+c),r),r+=c,a+=c}for(let e=0;e<t;e++){let r=0;n[l]=f[e+r],r+=t,n[l+1]=f[e+r],r+=t,n[l+2]=f[e+r],r+=t,n[l+3]=f[e+r],l+=4}u--}return n}(o.subarray(o.pos),f,u);switch(this.type){case n.FloatType:let h=new Float32Array(4*(l=c.length/4));for(let e=0;e<l;e++)!function(e,t,r,n){let l=Math.pow(2,e[t+3]-128)/255;r[n+0]=e[t+0]*l,r[n+1]=e[t+1]*l,r[n+2]=e[t+2]*l,r[n+3]=1}(c,4*e,h,4*e);t=h,r=n.FloatType;break;case n.HalfFloatType:let p=new Uint16Array(4*(l=c.length/4));for(let e=0;e<l;e++)!function(e,t,r,l){let i=Math.pow(2,e[t+3]-128)/255;r[l+0]=n.DataUtils.toHalfFloat(Math.min(e[t+0]*i,65504)),r[l+1]=n.DataUtils.toHalfFloat(Math.min(e[t+1]*i,65504)),r[l+2]=n.DataUtils.toHalfFloat(Math.min(e[t+2]*i,65504)),r[l+3]=n.DataUtils.toHalfFloat(1)}(c,4*e,p,4*e);t=p,r=n.HalfFloatType;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:f,height:u,data:t,header:s.string,gamma:s.gamma,exposure:s.exposure,type:r}}setDataType(e){return this.type=e,this}load(e,t,r,l){return super.load(e,function(e,r){switch(e.type){case n.FloatType:case n.HalfFloatType:e.colorSpace=n.LinearSRGBColorSpace,e.minFilter=n.LinearFilter,e.magFilter=n.LinearFilter,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,r)},r,l)}}}}]);