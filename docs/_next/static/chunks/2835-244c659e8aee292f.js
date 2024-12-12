"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2835],{92948:function(t,e,r){r.d(e,{Leak:function(){return l},a:function(){return u}});var n=r(88780),i=r(90118),o=r(58100),s=r(6246);function u(t){Object.assign(window,{...n,...o,...i,...t,PRNG:s.T})}function l(t){return u(t),null}},80536:function(t,e,r){r.d(e,{z:function(){return m},q3:function(){return Y},eO:function(){return V}});var n,i,o,s,u,l,h=r(88780);(n=s||(s={}))[n.X=0]="X",n[n.Y=2]="Y",n[n.Z=4]="Z",(i=u||(u={}))[i.R=0]="R",i[i.L=1]="L",i[i.U=2]="U",i[i.D=3]="D",i[i.F=4]="F",i[i.B=5]="B",(o=l||(l={}))[o.None=0]="None",o[o.All=63]="All",o[o.R=1]="R",o[o.L=2]="L",o[o.U=4]="U",o[o.D=8]="D",o[o.F=16]="F",o[o.B=32]="B";let a=[5,4,0,1,0,1],c=[new h.Vector3(1,0,0),new h.Vector3(-1,0,0),new h.Vector3(0,1,0),new h.Vector3(0,-1,0),new h.Vector3(0,0,1),new h.Vector3(0,0,-1)],f=0,d=0,g=0,z=0,x=[],y={A:()=>(x[f++]=d,x[f++]=g,x[f++]=z,y),B:()=>(x[f++]=d,x[f++]=g,x[f++]=z+1,y),C:()=>(x[f++]=d,x[f++]=g+1,x[f++]=z,y),D:()=>(x[f++]=d,x[f++]=g+1,x[f++]=z+1,y),E:()=>(x[f++]=d+1,x[f++]=g,x[f++]=z,y),F:()=>(x[f++]=d+1,x[f++]=g,x[f++]=z+1,y),G:()=>(x[f++]=d+1,x[f++]=g+1,x[f++]=z,y),H:()=>(x[f++]=d+1,x[f++]=g+1,x[f++]=z+1,y)},S={R:()=>(x[f++]=1,x[f++]=0,x[f++]=0,S),L:()=>(x[f++]=-1,x[f++]=0,x[f++]=0,S),U:()=>(x[f++]=0,x[f++]=1,x[f++]=0,S),D:()=>(x[f++]=0,x[f++]=-1,x[f++]=0,S),F:()=>(x[f++]=0,x[f++]=0,x[f++]=1,S),B:()=>(x[f++]=0,x[f++]=0,x[f++]=-1,S),R6:()=>S.R().R().R().R().R().R(),L6:()=>S.L().L().L().L().L().L(),U6:()=>S.U().U().U().U().U().U(),D6:()=>S.D().D().D().D().D().D(),F6:()=>S.F().F().F().F().F().F(),B6:()=>S.B().B().B().B().B().B()};class p{clone(){return new this.constructor(this.position.clone(),this.direction,this.tangent)}positionToArray(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,{position:r,direction:n}=this;switch(x=t,f=e,d=r.x,g=r.y,z=r.z,n){case u.R:y.E().G().F().F().G().H();break;case u.L:y.A().B().D().A().D().C();break;case u.U:y.D().H().G().D().G().C();break;case u.D:y.A().E().F().A().F().B();break;case u.F:y.B().F().H().B().H().D();break;case u.B:y.A().C().E().E().C().G()}return t}normalToArray(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,{direction:r}=this;switch(x=t,f=e,r){case u.R:S.R6();break;case u.L:S.L6();break;case u.U:S.U6();break;case u.D:S.D6();break;case u.F:S.F6();break;case u.B:S.B6()}return t}constructor(t,e,r=a[e]){this.position=t,this.direction=e,this.tangent=r}}let k=new p(new h.Vector3,0),w=t=>0!==t.getUint8(0);class m{get size(){return this.getSize()}mount(t,e,r){let n=t.metrics.fromIndexes(e,r,0),i=t.metrics.getAdjacentChunkIndexes(e,r);this.mountState={world:t,superChunkIndex:e,chunkIndex:r,position:n,adjacentChunksIndexes:i}}unmount(){this.mountState=null}getAdjacentChunk(t){let{mountState:e}=this;if(!e)return null;let{world:r,adjacentChunksIndexes:n}=e,i=n[t];return r.tryGetChunkByIndexes(i)}getSize(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new h.Vector3;return t.set(this.sizeX,this.sizeY,this.sizeZ)}getVoxelStateAtIndex(t){if(t<0||t>=this.sizeXYZ)throw Error("Index out of bounds: ".concat(t,", size: ").concat(this.sizeXYZ));return new DataView(this.voxelState,t*this.voxelStateByteSize,this.voxelStateByteSize)}getVoxelState(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[n,i,o]=1===e.length?[e[0].x,e[0].y,e[0].z]:e,{sizeX:s,sizeY:u,sizeZ:l,sizeXY:h,voxelStateByteSize:a,voxelState:c}=this;if(n<0||n>=s||i<0||i>=u||o<0||o>=l)throw Error("Coordinates out of bounds: ".concat(n,", ").concat(i,", ").concat(o,", size: (").concat(s,", ").concat(u,", ").concat(l,")"));return new DataView(c,(n+i*s+o*h)*a,a)}*voxelStates(){let{sizeX:t,sizeXY:e,sizeY:r,sizeZ:n}=this,{voxelState:i,voxelStateByteSize:o}=this;for(let s=0;s<n;s++)for(let n=0;n<r;n++)for(let r=0;r<t;r++){let u=r+n*t+s*e;yield new DataView(i,u*o,o)}}computeBounds(){let{voxelIsFullDelegate:t=t=>0!==t.getUint8(0),out:e=new h.Box3}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e.makeEmpty();let{sizeX:r,sizeXY:n,sizeY:i,sizeZ:o,voxelState:s,voxelStateByteSize:u}=this;for(let l=0;l<o;l++)for(let o=0;o<i;o++)for(let i=0;i<r;i++)t(new DataView(s,(i+o*r+l*n)*u,u))&&e.expandByPoint(new h.Vector3(i,o,l));return e}tryGetVoxelState(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[n,i,o]=1===e.length?[e[0].x,e[0].y,e[0].z]:e,{sizeX:s,sizeY:u,sizeZ:l}=this;return n<0||n>=s||i<0||i>=u||o<0||o>=l?null:this.getVoxelState(n,i,o)}*voxelFaces(){let{offset:{x:t,y:e,z:r}={x:0,y:0,z:0},voxelIsFullDelegate:n=w,ignoreAdjacentChunks:i=!1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=(t,e)=>t<0?e+t:t>=e?t-e:t,{sizeX:s,sizeXY:u,sizeY:l,sizeZ:h,voxelState:a,voxelStateByteSize:f}=this;for(let z=0;z<h;z++)for(let x=0;x<l;x++)for(let y=0;y<s;y++)if(n(new DataView(a,(y+x*s+z*u)*f,f)))for(let S=0;S<6;S++){let p=c[S],w=y+p.x,m=x+p.y,v=z+p.z,A=w<0||w>=s||m<0||m>=l||v<0||v>=h?S:null,C=!1;if(null===A)C=n(new DataView(a,(w+m*s+v*u)*f,f));else if(!i){var d,g;let t=null!==(g=null===(d=this.getAdjacentChunk(A))||void 0===d?void 0:d.getVoxelState(o(w,s),o(m,l),o(v,h)))&&void 0!==g?g:null;C=!!t&&n(t)}C||(k.position.set(t+y,e+x,r+z),k.direction=S,yield k)}}constructor(t=16,e=4){this.mountState=null;let[r,n,i]="number"==typeof t?[t,t,t]:[t.x,t.y,t.z];this.sizeX=r,this.sizeY=n,this.sizeZ=i,this.sizeXY=this.sizeX*this.sizeY,this.sizeXYZ=this.sizeX*this.sizeY*this.sizeZ,this.voxelStateByteSize=e,this.voxelState=new ArrayBuffer(this.sizeXYZ*e)}}class v{ensureSize(t){if(this.array.length<t){let e=new Float32Array(1<<Math.ceil(Math.log(t)/Math.log(2)));e.set(this.array),this.array=e}return this.array}copy(t){return new Float32Array(this.array.buffer,0,t).slice()}constructor(t=0){this.array=new Float32Array(0),this.ensureSize(t)}}let A=new v(768),C=new v(768);function V(t){let{geometry:e=new h.BufferGeometry}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r="function"==typeof t?t():t;A.array.fill(0),C.array.fill(0);let n=0;for(let t of r){let e=18*n;A.ensureSize(e+18),C.ensureSize(e+18),t.positionToArray(A.array,e),t.normalToArray(C.array,e),n++}return 0===n?(e.setAttribute("position",new h.BufferAttribute(new Float32Array(9),3)),e.setAttribute("normal",new h.BufferAttribute(new Float32Array(9),3))):(e.setAttribute("position",new h.BufferAttribute(A.copy(18*n),3)),e.setAttribute("normal",new h.BufferAttribute(C.copy(18*n),3))),e}class M extends h.Vector3{get superChunk(){return this.x}get chunk(){return this.y}get voxel(){return this.z}}function B(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,"_")}class b{get chunkSize(){return this.getChunkSize()}get superChunkSize(){return this.getSuperChunkSize()}clone(){return new b(this.chunkSizeX,this.chunkSizeY,this.chunkSizeZ,this.superChunkSizeX,this.superChunkSizeY,this.superChunkSizeZ,this.worldSizeX,this.worldSizeY,this.worldSizeZ)}getChunkSize(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new h.Vector3;return t.set(this.chunkSizeX,this.chunkSizeY,this.chunkSizeZ)}getSuperChunkSize(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new h.Vector3;return t.set(this.superChunkSizeX,this.superChunkSizeY,this.superChunkSizeZ)}getWorldSize(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new h.Vector3;return t.set(this.worldSizeX,this.worldSizeY,this.worldSizeZ)}computeSuperChunkIndex(t,e,r){let{worldSizeX:n,worldSizeY:i,worldSizeZ:o,worldSizeXY:s}=this;return+(t+(n>>1))+(e+(i>>1))*n+(r+(o>>1))*s}toIndexes(t,e,r){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:new M,{chunkSizeX:i,chunkSizeY:o,chunkSizeZ:s,chunkSizeXY:u,superChunkSizeX:l,superChunkSizeXY:h,superChunkVoxelSizeX:a,superChunkVoxelSizeY:c,superChunkVoxelSizeZ:f,worldSizeX:d,worldSizeY:g,worldSizeZ:z,worldSizeXY:x,worldVoxelSizeX:y,worldVoxelSizeY:S,worldVoxelSizeZ:p}=this,k=y>>1,w=S>>1,m=p>>1;if(t<-k||t>=k)throw Error("X coordinate out of bounds: ".concat(t,", interval: (-").concat(k," incl., ").concat(k," excl.)"));if(e<-w||e>=w)throw Error("Y coordinate out of bounds: ".concat(e,", interval: (-").concat(w," incl., ").concat(w," excl.)"));if(r<-m||r>=m)throw Error("Z coordinate out of bounds: ".concat(r,", interval: (-").concat(m," incl., ").concat(m," excl.)"));let v=Math.floor(t/a),A=Math.floor(e/c),C=Math.floor(r/f),V=t-v*a,B=e-A*c,b=r-C*f,X=Math.floor(V/this.chunkSizeX),Y=Math.floor(B/this.chunkSizeY),Z=Math.floor(b/this.chunkSizeZ);return n.set(+(v+(d>>1))+(A+(g>>1))*d+(C+(z>>1))*x,+X+Y*l+Z*h,+(V-X*i)+(B-Y*o)*i+(b-Z*s)*u),n}fromIndexes(t,e,r){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:new h.Vector3,{chunkSizeX:i,chunkSizeY:o,chunkSizeZ:s,chunkSizeXY:u,chunkSizeXYZ:l,superChunkSizeX:a,superChunkSizeXY:c,superChunkSizeXYZ:f,superChunkVoxelSizeX:d,superChunkVoxelSizeY:g,superChunkVoxelSizeZ:z,worldSizeX:x,worldSizeY:y,worldSizeZ:S,worldSizeXY:p,worldSizeXYZ:k}=this;if(t<0||t>=k)throw Error("Superchunk index out of bounds: ".concat(B(t),", size: ").concat(B(k),"\nReceived: ").concat(t,", ").concat(e,", ").concat(r));if(e<0||e>=f)throw Error("Chunk index out of bounds: ".concat(B(e),", size: ").concat(B(f),"\nReceived: ").concat(t,", ").concat(e,", ").concat(r));if(r<0||r>=l)throw Error("Voxel index out of bounds: ".concat(B(r),", size: ").concat(B(l),"\nReceived: ").concat(t,", ").concat(e,", ").concat(r));let w=0,m=Math.floor((w=t)/p),v=Math.floor((w-=m*p)/x),A=w-=v*x;A-=x>>1,v-=y>>1,m-=S>>1;let C=Math.floor((w=e)/c),V=Math.floor((w-=C*c)/a),M=w-=V*a,b=Math.floor((w=r)/u),X=Math.floor((w-=b*u)/i),Y=w-=X*i,Z=A*d+M*i+Y,I=v*g+V*o+X,D=m*z+C*s+b;return n.set(Z,I,D),n}getAdjacentChunkIndexes(t,e){let{chunkSizeX:r,chunkSizeY:n,chunkSizeZ:i}=this,{x:o,y:s,z:u}=this.fromIndexes(t,e,0);return[this.toIndexes(o+r,s,u),this.toIndexes(o-r,s,u),this.toIndexes(o,s+n,u),this.toIndexes(o,s-n,u),this.toIndexes(o,s,u+i),this.toIndexes(o,s,u-i)]}constructor(t,e,r,n,i,o,s,u,l){this.chunkSizeX=t,this.chunkSizeY=e,this.chunkSizeZ=r,this.chunkSizeXY=t*e,this.chunkSizeXYZ=t*e*r,this.superChunkSizeX=n,this.superChunkSizeY=i,this.superChunkSizeZ=o,this.superChunkSizeXY=n*i,this.superChunkSizeXYZ=n*i*o,this.superChunkVoxelSizeX=this.superChunkSizeX*this.chunkSizeX,this.superChunkVoxelSizeY=this.superChunkSizeY*this.chunkSizeY,this.superChunkVoxelSizeZ=this.superChunkSizeZ*this.chunkSizeZ,this.worldSizeX=s,this.worldSizeY=u,this.worldSizeZ=l,this.worldSizeXY=s*u,this.worldSizeXYZ=s*u*l,this.worldVoxelSizeX=this.worldSizeX*this.superChunkVoxelSizeX,this.worldVoxelSizeY=this.worldSizeY*this.superChunkVoxelSizeY,this.worldVoxelSizeZ=this.worldSizeZ*this.superChunkVoxelSizeZ,this.worldVoxelSizeXY=this.worldVoxelSizeX*this.worldVoxelSizeY,this.worldVoxelSizeXYZ=this.worldVoxelSizeX*this.worldVoxelSizeY*this.worldVoxelSizeZ}}let X={metrics:new b(16,16,16,1024,1024,1024,1024,1024,1024),voxelStateByteSize:4};class Y{computeChunkCount(){let t=0;for(let e of this.superChunks.values())t+=e.size;return t}*enumerateChunks(){for(let[t,e]of this.superChunks)for(let[r,n]of e)yield{superChunkIndex:t,chunkIndex:r,chunk:n}}computeVoxelBounds(){let{voxelIsFullDelegate:t=t=>0!==t.getUint8(0),out:e=new h.Box3}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e.makeEmpty();let r=new h.Vector3,n=new h.Box3;for(let{superChunkIndex:i,chunkIndex:o,chunk:s}of this.enumerateChunks())this.metrics.fromIndexes(i,o,0,r),s.computeBounds({voxelIsFullDelegate:t,out:n}),n.min.add(r),n.max.add(r),e.union(n);return e}computeChunkBounds(){let{out:t=new h.Box3}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t.makeEmpty();let e=new h.Vector3;for(let{superChunkIndex:r,chunkIndex:n}of this.enumerateChunks())this.metrics.fromIndexes(r,n,0,e),t.expandByPoint(e);return t.max.x+=this.metrics.chunkSizeX-1,t.max.y+=this.metrics.chunkSizeY-1,t.max.z+=this.metrics.chunkSizeZ-1,t}tryGetChunk(){for(var t,e=arguments.length,r=Array(e),n=0;n<e;n++)r[n]=arguments[n];let[i,o,s]=1===r.length?[r[0].x,r[0].y,r[0].z]:r,{chunkSizeX:u,chunkSizeY:l,chunkSizeZ:h,superChunkSizeX:a,superChunkSizeY:c,superChunkSizeZ:f,superChunkSizeXY:d}=this.metrics,g=Math.floor(i/u),z=Math.floor(o/l),x=Math.floor(s/h),y=this.metrics.computeSuperChunkIndex(g,z,x),S=this.superChunks.get(y);if(!S)return null;let p=i-g*a,k=o-z*c,w=s-x*f;return null!==(t=S.get(+p+k*a+w*d))&&void 0!==t?t:null}tryGetSurroundingChunkAt(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[n,i,o]=1===e.length?[e[0].x,e[0].y,e[0].z]:e,s=this.metrics.toIndexes(n,i,o);return this.tryGetChunkByIndexes(s)}tryGetChunkByIndexes(){for(var t,e=arguments.length,r=Array(e),n=0;n<e;n++)r[n]=arguments[n];let[i,o]=1===r.length?[r[0].superChunk,r[0].chunk]:r,s=this.superChunks.get(i);return s&&null!==(t=s.get(o))&&void 0!==t?t:null}getVoxelState(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[n,i,o]=1===e.length?[e[0].x,e[0].y,e[0].z]:e,s=this.metrics.toIndexes(n,i,o),u=this.superChunks.get(s.x);if(!u)return this.emptyVoxelState;let l=u.get(s.y);return l?l.getVoxelStateAtIndex(s.z):this.emptyVoxelState}setVoxelState(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[n,i,o,s]=2===e.length?[e[0].x,e[0].y,e[0].z,e[1]]:e,u=function(t){for(let e=0;e<t.byteLength;e++)if(0!==t.getUint8(e))return!1;return!0}(s),l=this.metrics.toIndexes(n,i,o),{superChunks:h,voxelStateByteSize:a}=this,c=h.get(l.superChunk);if(!c){if(u)return!1;c=new Map,h.set(l.superChunk,c)}let f=c.get(l.chunk);if(!f){if(u)return!1;(f=new m(this.metrics.chunkSize,a)).mount(this,l.superChunk,l.chunk),c.set(l.chunk,f)}let d=f.getVoxelStateAtIndex(l.voxel),g=!1;for(let t=0;t<a;t++){let e=s.getUint8(t);e!==d.getUint8(t)&&(d.setUint8(t,e),g=!0)}return g}*chunkVoxelFaces(t){let{voxelIsFullDelegate:e=w}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{chunkSize:r,chunkSizeX:n,chunkSizeY:i,chunkSizeZ:o}=this.metrics,{x:s,y:u,z:l}=t.min.clone().divide(r).floor(),{x:a,y:c,z:f}=t.max.clone().divide(r).ceil(),d=new h.Vector3;for(let t=l;t<f;t++)for(let r=u;r<c;r++)for(let u=s;u<a;u++){let s=this.tryGetChunk(u,r,t);s&&(d.set(u*n,r*i,t*o),yield*s.voxelFaces({offset:d,voxelIsFullDelegate:e}))}}constructor(t){this.superChunks=new Map;let{metrics:e,voxelStateByteSize:r}={...X,...t};this.metrics=e.clone(),this.voxelStateByteSize=r,this.emptyVoxelState=new DataView(new ArrayBuffer(r))}}},12042:function(t,e,r){r.d(e,{P:function(){return s}});var n=r(88780),i=r(23247);let o={luminosity:.5};class s extends n.MeshBasicMaterial{constructor(t){let{luminosity:e,...r}={...o,...t},s={uSunPosition:{value:new n.Vector3(.5,.7,.3)},uLuminosity:{value:e}};super(r),this.onBeforeCompile=t=>i.b.with(t).uniforms(s).varying({vWorldNormal:"vec3"}).vertex.mainAfterAll("\n          vWorldNormal = mat3(modelMatrix) * normal;\n      ").fragment.after("map_fragment","\n        vec3 lightDirection = normalize(uSunPosition);\n        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n        light = pow(light, 2.0);\n        light = mix(uLuminosity, 1.0, light);\n        diffuseColor *= light;\n      "),this.sunPosition=s.uSunPosition.value}}},67896:function(t,e,r){r.d(e,{w:function(){return o}});var n=r(88780);let i=new n.IcosahedronGeometry(1,4);class o extends n.Mesh{constructor(t){super(i,new n.MeshBasicMaterial({color:"#0c529d",...t,side:n.BackSide,depthWrite:!1,depthTest:!1})),this.renderOrder=-1,this.frustumCulled=!1,this.matrixAutoUpdate=!1,this.onBeforeRender=(t,e,r)=>{let n=(r.near+r.far)/2;this.position.copy(r.position),this.scale.setScalar(n),this.updateMatrix(),this.updateMatrixWorld()}}}},90118:function(t,e,r){function n(t,e){for(let r of t)if(e(r))return!0;return!1}function i(t,e){for(let r of t)if(!e(r))return!1;return!0}function o(t,e,r){let n=[];function i(t){let e=[];return n[t]=e,e}if(void 0!==r)for(let t=0;t<r;t++)i(t);for(let r of t){var o;let t=e(r);(null!==(o=n[t])&&void 0!==o?o:i(t)).push(r)}return n}r.r(e),r.d(e,{every:function(){return i},some:function(){return n},split:function(){return o}})},28104:function(t,e,r){function*n(t){let e=0,r={get i(){return e},get t(){return e/t},get p(){return e/(t-1)},clone(){return{...this}}};for(e=0;e<t;e++)yield r}function i(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let i=[];for(let t of n(...e))i.push(t.clone());return i}function*o(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let n=0,i=0;2===e.length?(n=e[0],i=e[1]):Array.isArray(e[0])?(n=e[0][0],i=e[0][1]):(n=e[0].x,i=e[0].y);let o=0,s=0,u=0,l={get i(){return o},get x(){return s},get y(){return u},get tx(){return s/n},get ty(){return u/i},get px(){return s/(n-1)},get py(){return u/(i-1)},clone(){return{...this}}};for(u=0;u<i;u++)for(s=0;s<n;s++)yield l,o++}function s(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let n=[];for(let t of o(...e))n.push(t.clone());return n}function*u(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let n=0,i=0,o=0;3===e.length?(n=e[0],i=e[1],o=e[2]):Array.isArray(e[0])?(n=e[0][0],i=e[0][1],o=e[0][2]):(n=e[0].x,i=e[0].y,o=e[0].z);let s=0,u=0,l=0,h=0,a={get i(){return s},get x(){return u},get y(){return l},get z(){return h},get tx(){return u/n},get ty(){return l/i},get tz(){return h/o},get px(){return u/(n-1)},get py(){return l/(i-1)},get pz(){return h/(o-1)},clone(){return{...this}}};for(h=0;h<o;h++)for(l=0;l<i;l++)for(u=0;u<n;u++)yield a,s++}function l(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let n=[];for(let t of u(...e))n.push(t.clone());return n}r.r(e),r.d(e,{loop:function(){return n},loop2:function(){return o},loop2Array:function(){return s},loop3:function(){return u},loop3Array:function(){return l},loopArray:function(){return i}})},6246:function(t,e,r){r.d(e,{T:function(){return h}});let n=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(t=(t=(7*t+Math.sqrt(t)+16087*Math.sin(t))%2147483647)<0?t+2147483647:t)>1?2147483647&t:0===t?345678:123456},i=t=>t=2147483647&Math.imul(t,48271),o=t=>(t-1)/2147483646,s=t=>t,u={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function l(){let t=i(i(n(123456)));function e(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof e&&(e=e.split("").reduce((t,e)=>7*t+e.charCodeAt(0),0)),t=i(i(n(e))),f}function r(){return o(t=i(t))}function l(t){switch(t.length){default:return[0,1,s];case 1:return[0,t[0],s];case 2:return[t[0],t[1],s];case 3:return[t[0],t[1],t[2]]}}function h(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];let[i,o,s]=l(e);return i+(o-i)*s(r())}function a(){for(var t,e=arguments.length,n=Array(e),i=0;i<e;i++)n[i]=arguments[i];let[o,s,{weightsAreNormalized:l,indexOffset:h,forbiddenItems:a}]=function(t){let[e,r=null,n]=t,i={...u,...n};if(Array.isArray(e))return[e,r,i];if("object"==typeof e)return[Object.values(e),r?Object.values(r):null,i];throw Error("pick: unsupported options type")}(n);if(a.length>0){let e=new Set;for(let t of a){let r=o.indexOf(t);r>=0&&e.add(r)}if(o=o.filter((t,r)=>!e.has(r)),s=null!==(t=null==s?void 0:s.filter((t,r)=>!e.has(r)))&&void 0!==t?t:null,0===o.length)throw Error("pick: all items are forbidden")}if(null===s){let t=Math.floor(r()*o.length);return h&&(t+=h,(t%=o.length)<0&&(t+=o.length)),o[t]}if(!l){let t=s.reduce((t,e)=>t+e,0);s=s.map(e=>e/t)}let c=r(),f=0;for(let t=0;t<o.length;t++)if(c<(f+=s[t]))return o[t];throw Error("among: unreachable")}function c(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=r(),i=r(),o=Math.sqrt(-2*Math.log(n)),s=2*Math.PI*i;return[t+e*o*Math.cos(s),t+e*o*Math.sin(s)]}let f={seed:e,seedMax:function(){return 2147483647},reset:function(){return e(123456),f},next:function(){return t=i(t),f},random:r,between:h,around:function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];let[i=1,o=s]=e,u=2*r();return(u>1?1:-1)*o(u>1?u-1:u)*i},int:function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];let[i,o,s]=l(e);return i+Math.floor(s(r())*(o-i))},chance:function(t){return r()<t},shuffle:function(t){let{mutate:e=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e&&Array.isArray(t)?t:[...t],i=n.length;for(let t=0;t<i;t++){let e=Math.floor(i*r()),o=n[t];n[t]=n[e],n[e]=o}return n},pick:a,createPicker:function(t){let e=t.map(t=>{let[e]=t;return e}),r=t.map(t=>{let[e,r]=t;return r}),n=r.reduce((t,e)=>t+e,0);for(let[t,e]of r.entries())r[t]=e/n;return()=>a(e,r,{weightsAreNormalized:!0})},vector:function(t,e){let[r=0,n=1]=Array.isArray(e)?e:[null==e?void 0:e.min,null==e?void 0:e.max];for(let e of Object.keys(t))t[e]=h(r,n);return t},unitVector2:function(t){let e=2*Math.PI*r();return t.x=Math.cos(e),t.y=Math.sin(e),t},unitVector3:function(t){let e=r(),n=r(),i=2*Math.PI*e,o=Math.acos(1-2*n);return t.x=Math.sin(o)*Math.cos(i),t.y=Math.sin(o)*Math.sin(i),t.z=Math.cos(o),t},normalVector:function(t){let e=Object.keys(t),r=e.length,n=Math.sqrt(r);for(let i=0;i<r;i+=2){let[o,s]=c();t[e[i]]=o/n,i+1<r&&(t[e[i+1]]=s/n)}return t},unitVector:function(t){let e=Object.keys(t),r=e.length,n=0;for(let i=0;i<r;i+=2){let[o,s]=c();t[e[i]]=o,n+=o*o,i+1<r&&(t[e[i+1]]=s,n+=s*s)}n=Math.sqrt(n);for(let i=0;i<r;i++)t[e[i]]/=n;return t},boxMuller:c};return f}let h=class{constructor(t){Object.assign(this,l().seed(t))}};Object.assign(h,l())}}]);