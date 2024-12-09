"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1691],{92948:function(t,e,r){r.d(e,{Leak:function(){return u},a:function(){return l}});var n=r(88780),o=r(90118),i=r(58100),s=r(6246);function l(t){Object.assign(window,{...n,...i,...o,...t,PRNG:s.T})}function u(t){return l(t),null}},80536:function(t,e,r){r.d(e,{z:function(){return k},q3:function(){return X},eO:function(){return A}});var n,o,i,s,l,u,h=r(88780);(n=s||(s={}))[n.X=0]="X",n[n.Y=2]="Y",n[n.Z=4]="Z",(o=l||(l={}))[o.R=0]="R",o[o.L=1]="L",o[o.U=2]="U",o[o.D=3]="D",o[o.F=4]="F",o[o.B=5]="B",(i=u||(u={}))[i.None=0]="None",i[i.All=63]="All",i[i.R=1]="R",i[i.L=2]="L",i[i.U=4]="U",i[i.D=8]="D",i[i.F=16]="F",i[i.B=32]="B";let c=[5,4,0,1,0,1],a=[new h.Vector3(1,0,0),new h.Vector3(-1,0,0),new h.Vector3(0,1,0),new h.Vector3(0,-1,0),new h.Vector3(0,0,1),new h.Vector3(0,0,-1)],f=0,d=0,g=0,p=0,w=[],z={A:()=>(w[f++]=d,w[f++]=g,w[f++]=p,z),B:()=>(w[f++]=d,w[f++]=g,w[f++]=p+1,z),C:()=>(w[f++]=d,w[f++]=g+1,w[f++]=p,z),D:()=>(w[f++]=d,w[f++]=g+1,w[f++]=p+1,z),E:()=>(w[f++]=d+1,w[f++]=g,w[f++]=p,z),F:()=>(w[f++]=d+1,w[f++]=g,w[f++]=p+1,z),G:()=>(w[f++]=d+1,w[f++]=g+1,w[f++]=p,z),H:()=>(w[f++]=d+1,w[f++]=g+1,w[f++]=p+1,z)},y={R:()=>(w[f++]=1,w[f++]=0,w[f++]=0,y),L:()=>(w[f++]=-1,w[f++]=0,w[f++]=0,y),U:()=>(w[f++]=0,w[f++]=1,w[f++]=0,y),D:()=>(w[f++]=0,w[f++]=-1,w[f++]=0,y),F:()=>(w[f++]=0,w[f++]=0,w[f++]=1,y),B:()=>(w[f++]=0,w[f++]=0,w[f++]=-1,y),R6:()=>y.R().R().R().R().R().R(),L6:()=>y.L().L().L().L().L().L(),U6:()=>y.U().U().U().U().U().U(),D6:()=>y.D().D().D().D().D().D(),F6:()=>y.F().F().F().F().F().F(),B6:()=>y.B().B().B().B().B().B()};class S{clone(){return new this.constructor(this.position.clone(),this.direction,this.tangent)}positionToArray(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,{position:r,direction:n}=this;switch(w=t,f=e,d=r.x,g=r.y,p=r.z,n){case l.R:z.E().G().F().F().G().H();break;case l.L:z.A().B().D().A().D().C();break;case l.U:z.D().H().G().D().G().C();break;case l.D:z.A().E().F().A().F().B();break;case l.F:z.B().F().H().B().H().D();break;case l.B:z.A().C().E().E().C().G()}return t}normalToArray(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,{direction:r}=this;switch(w=t,f=e,r){case l.R:y.R6();break;case l.L:y.L6();break;case l.U:y.U6();break;case l.D:y.D6();break;case l.F:y.F6();break;case l.B:y.B6()}return t}constructor(t,e,r=c[e]){this.position=t,this.direction=e,this.tangent=r}}let x=new S(new h.Vector3,0);class k{get size(){return this.getSize()}getSize(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new h.Vector3;return t.set(this.sizeX,this.sizeY,this.sizeZ)}getVoxelStateAtIndex(t){if(t<0||t>=this.sizeXYZ)throw Error("Index out of bounds: ".concat(t,", size: ").concat(this.sizeXYZ));return new DataView(this.voxelState,t*this.voxelStateByteSize,this.voxelStateByteSize)}getVoxelState(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[n,o,i]=1===e.length?[e[0].x,e[0].y,e[0].z]:e,{sizeX:s,sizeY:l,sizeZ:u,sizeXY:h,voxelStateByteSize:c,voxelState:a}=this;if(n<0||n>=s||o<0||o>=l||i<0||i>=u)throw Error("Coordinates out of bounds: ".concat(n,", ").concat(o,", ").concat(i,", size: (").concat(s,", ").concat(l,", ").concat(u,")"));return new DataView(a,(n+o*s+i*h)*c,c)}*voxelStates(){let{sizeX:t,sizeXY:e,sizeY:r,sizeZ:n}=this,{voxelState:o,voxelStateByteSize:i}=this;for(let s=0;s<n;s++)for(let n=0;n<r;n++)for(let r=0;r<t;r++){let l=r+n*t+s*e;yield new DataView(o,l*i,i)}}computeBounds(){let{voxelIsFullDelegate:t=t=>0!==t.getUint8(0),out:e=new h.Box3}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e.makeEmpty();let{sizeX:r,sizeXY:n,sizeY:o,sizeZ:i,voxelState:s,voxelStateByteSize:l}=this;for(let u=0;u<i;u++)for(let i=0;i<o;i++)for(let o=0;o<r;o++)t(new DataView(s,(o+i*r+u*n)*l,l))&&e.expandByPoint(new h.Vector3(o,i,u));return e}tryGetVoxelState(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[n,o,i]=1===e.length?[e[0].x,e[0].y,e[0].z]:e,{sizeX:s,sizeY:l,sizeZ:u,sizeXY:h,voxelStateByteSize:c,voxelState:a}=this;return n<0||n>=s||o<0||o>=l||i<0||i>=u?null:this.getVoxelState(n,o,i)}*voxelFaces(){let{offset:{x:t,y:e,z:r}={x:0,y:0,z:0},voxelIsFullDelegate:n=t=>0!==t.getUint8(0)}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{sizeX:o,sizeY:i,sizeZ:s}=this;for(let l=0;l<s;l++)for(let s=0;s<i;s++)for(let i=0;i<o;i++)if(n(this.getVoxelState(i,s,l)))for(let o=0;o<6;o++){let u=a[o];u.x,u.y,u.z;let h=this.tryGetVoxelState(i+u.x,s+u.y,l+u.z);h&&n(h)||(x.position.set(t+i,e+s,r+l),x.direction=o,yield x)}}constructor(t=16,e=4){let[r,n,o]="number"==typeof t?[t,t,t]:[t.x,t.y,t.z];this.sizeX=r,this.sizeY=n,this.sizeZ=o,this.sizeXY=this.sizeX*this.sizeY,this.sizeXYZ=this.sizeX*this.sizeY*this.sizeZ,this.voxelStateByteSize=e,this.voxelState=new ArrayBuffer(this.sizeXYZ*e)}}class v{ensureSize(t){if(this.array.length<t){let e=new Float32Array(1<<Math.ceil(Math.log(t)/Math.log(2)));e.set(this.array),this.array=e}return this.array}copy(t){return new Float32Array(this.array.buffer,0,t).slice()}constructor(t=0){this.array=new Float32Array(0),this.ensureSize(t)}}let V=new v(768),m=new v(768);function A(t){let{geometry:e=new h.BufferGeometry}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r="function"==typeof t?t():t;V.array.fill(0),m.array.fill(0);let n=0;for(let t of r){let e=18*n;V.ensureSize(e+18),m.ensureSize(e+18),t.positionToArray(V.array,e),t.normalToArray(m.array,e),n++}return e.setAttribute("position",new h.BufferAttribute(V.copy(18*n),3)),e.setAttribute("normal",new h.BufferAttribute(m.copy(18*n),3)),e}class M extends h.Vector3{get superChunk(){return this.x}get chunk(){return this.y}get voxel(){return this.z}}function C(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,"_")}class B{get chunkSize(){return this.getChunkSize()}get superChunkSize(){return this.getSuperChunkSize()}clone(){return new B(this.chunkSizeX,this.chunkSizeY,this.chunkSizeZ,this.superChunkSizeX,this.superChunkSizeY,this.superChunkSizeZ,this.worldSizeX,this.worldSizeY,this.worldSizeZ)}getChunkSize(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new h.Vector3;return t.set(this.chunkSizeX,this.chunkSizeY,this.chunkSizeZ)}getSuperChunkSize(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new h.Vector3;return t.set(this.superChunkSizeX,this.superChunkSizeY,this.superChunkSizeZ)}getWorldSize(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new h.Vector3;return t.set(this.worldSizeX,this.worldSizeY,this.worldSizeZ)}computeSuperChunkIndex(t,e,r){let{worldSizeX:n,worldSizeY:o,worldSizeZ:i,worldSizeXY:s}=this;return+(t+(n>>1))+(e+(o>>1))*n+(r+(i>>1))*s}toIndexes(t,e,r){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:new M,{chunkSizeX:o,chunkSizeY:i,chunkSizeZ:s,chunkSizeXY:l,superChunkSizeX:u,superChunkSizeXY:h,superChunkVoxelSizeX:c,superChunkVoxelSizeY:a,superChunkVoxelSizeZ:f,worldSizeX:d,worldSizeY:g,worldSizeZ:p,worldSizeXY:w,worldVoxelSizeX:z,worldVoxelSizeY:y,worldVoxelSizeZ:S}=this,x=z>>1,k=y>>1,v=S>>1;if(t<-x||t>=x)throw Error("X coordinate out of bounds: ".concat(t,", interval: (-").concat(x," incl., ").concat(x," excl.)"));if(e<-k||e>=k)throw Error("Y coordinate out of bounds: ".concat(e,", interval: (-").concat(k," incl., ").concat(k," excl.)"));if(r<-v||r>=v)throw Error("Z coordinate out of bounds: ".concat(r,", interval: (-").concat(v," incl., ").concat(v," excl.)"));let V=Math.floor(t/c),m=Math.floor(e/a),A=Math.floor(r/f),C=t-V*c,B=e-m*a,b=r-A*f,X=Math.floor(C/this.chunkSizeX),Y=Math.floor(B/this.chunkSizeY),Z=Math.floor(b/this.chunkSizeZ);return n.set(+(V+(d>>1))+(m+(g>>1))*d+(A+(p>>1))*w,+X+Y*u+Z*h,+(C-X*o)+(B-Y*i)*o+(b-Z*s)*l),n}fromIndexes(t,e,r){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:new h.Vector3,{chunkSizeX:o,chunkSizeY:i,chunkSizeZ:s,chunkSizeXY:l,chunkSizeXYZ:u,superChunkSizeX:c,superChunkSizeXY:a,superChunkSizeXYZ:f,superChunkVoxelSizeX:d,superChunkVoxelSizeY:g,superChunkVoxelSizeZ:p,worldSizeX:w,worldSizeY:z,worldSizeZ:y,worldSizeXY:S,worldSizeXYZ:x}=this;if(t<0||t>=x)throw Error("Superchunk index out of bounds: ".concat(C(t),", size: ").concat(C(x),"\nReceived: ").concat(t,", ").concat(e,", ").concat(r));if(e<0||e>=f)throw Error("Chunk index out of bounds: ".concat(C(e),", size: ").concat(C(f),"\nReceived: ").concat(t,", ").concat(e,", ").concat(r));if(r<0||r>=u)throw Error("Voxel index out of bounds: ".concat(C(r),", size: ").concat(C(u),"\nReceived: ").concat(t,", ").concat(e,", ").concat(r));let k=0,v=Math.floor((k=t)/S),V=Math.floor((k-=v*S)/w),m=k-=V*w;m-=w>>1,V-=z>>1,v-=y>>1;let A=Math.floor((k=e)/a),M=Math.floor((k-=A*a)/c),B=k-=M*c,b=Math.floor((k=r)/l),X=Math.floor((k-=b*l)/o),Y=k-=X*o,Z=m*d+B*o+Y,D=V*g+M*i+X,F=v*p+A*s+b;return n.set(Z,D,F),n}constructor(t,e,r,n,o,i,s,l,u){this.chunkSizeX=t,this.chunkSizeY=e,this.chunkSizeZ=r,this.chunkSizeXY=t*e,this.chunkSizeXYZ=t*e*r,this.superChunkSizeX=n,this.superChunkSizeY=o,this.superChunkSizeZ=i,this.superChunkSizeXY=n*o,this.superChunkSizeXYZ=n*o*i,this.superChunkVoxelSizeX=this.superChunkSizeX*this.chunkSizeX,this.superChunkVoxelSizeY=this.superChunkSizeY*this.chunkSizeY,this.superChunkVoxelSizeZ=this.superChunkSizeZ*this.chunkSizeZ,this.worldSizeX=s,this.worldSizeY=l,this.worldSizeZ=u,this.worldSizeXY=s*l,this.worldSizeXYZ=s*l*u,this.worldVoxelSizeX=this.worldSizeX*this.superChunkVoxelSizeX,this.worldVoxelSizeY=this.worldSizeY*this.superChunkVoxelSizeY,this.worldVoxelSizeZ=this.worldSizeZ*this.superChunkVoxelSizeZ,this.worldVoxelSizeXY=this.worldVoxelSizeX*this.worldVoxelSizeY,this.worldVoxelSizeXYZ=this.worldVoxelSizeX*this.worldVoxelSizeY*this.worldVoxelSizeZ}}let b={metrics:new B(16,16,16,1024,1024,1024,1024,1024,1024),voxelStateByteSize:4};class X{computeChunkCount(){let t=0;for(let e of this.superChunks.values())t+=e.size;return t}*enumerateChunks(){for(let[t,e]of this.superChunks)for(let[r,n]of e)yield{superChunkIndex:t,chunkIndex:r,chunk:n}}computeBounds(){let{voxelIsFullDelegate:t=t=>0!==t.getUint8(0),out:e=new h.Box3}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e.makeEmpty();let r=new h.Vector3,n=new h.Box3;for(let{superChunkIndex:o,chunkIndex:i,chunk:s}of this.enumerateChunks())this.metrics.fromIndexes(o,i,0,r),s.computeBounds({voxelIsFullDelegate:t,out:n}),n.min.add(r),n.max.add(r),e.union(n);return e}tryGetChunk(){for(var t,e=arguments.length,r=Array(e),n=0;n<e;n++)r[n]=arguments[n];let[o,i,s]=1===r.length?[r[0].x,r[0].y,r[0].z]:r,{chunkSizeX:l,chunkSizeY:u,chunkSizeZ:h,superChunkSizeX:c,superChunkSizeY:a,superChunkSizeZ:f,superChunkSizeXY:d}=this.metrics,g=Math.floor(o/l),p=Math.floor(i/u),w=Math.floor(s/h),z=this.metrics.computeSuperChunkIndex(g,p,w),y=this.superChunks.get(z);if(!y)return null;let S=o-g*c,x=i-p*a,k=s-w*f;return null!==(t=y.get(+S+x*c+k*d))&&void 0!==t?t:null}getVoxelState(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[n,o,i]=1===e.length?[e[0].x,e[0].y,e[0].z]:e,s=this.metrics.toIndexes(n,o,i),l=this.superChunks.get(s.x);if(!l)return this.emptyVoxelState;let u=l.get(s.y);return u?u.getVoxelStateAtIndex(s.z):this.emptyVoxelState}setVoxelState(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[n,o,i,s]=2===e.length?[e[0].x,e[0].y,e[0].z,e[1]]:e,l=function(t){for(let e=0;e<t.byteLength;e++)if(0!==t.getUint8(e))return!1;return!0}(s),u=this.metrics.toIndexes(n,o,i),{superChunks:h,voxelStateByteSize:c}=this,a=h.get(u.superChunk);if(!a){if(l)return!1;a=new Map,h.set(u.superChunk,a)}let f=a.get(u.chunk);if(!f){if(l)return!1;f=new k(this.metrics.chunkSize,c),a.set(u.chunk,f)}let d=f.getVoxelStateAtIndex(u.voxel),g=!1;for(let t=0;t<c;t++){let e=s.getUint8(t);e!==d.getUint8(t)&&(d.setUint8(t,e),g=!0)}return g}constructor(t){this.superChunks=new Map;let{metrics:e,voxelStateByteSize:r}={...b,...t};this.metrics=e.clone(),this.voxelStateByteSize=r,this.emptyVoxelState=new DataView(new ArrayBuffer(r))}}},97219:function(t,e,r){r.d(e,{O:function(){return c}});var n=r(88780),o=r(23420),i=r(32219);let s=new n.Vector2,l=new n.Vector3,u=new n.Matrix4;function h(t,e,r){if(null==r?void 0:r.transform)for(let t of((0,i.Xe)(r.transform,u),e))t.applyMatrix4(u);(null==r?void 0:r.color)&&t.colors.set(t.points.length,new n.Color(r.color)),t.points.push(...e)}class c extends n.LineSegments{showOccludedLines(){let{opacity:t=.2}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=new n.LineBasicMaterial({color:this.material.color,transparent:!0,depthFunc:n.GreaterDepth,opacity:t}),r=new n.LineSegments(this.geometry,e);return this.add(r),this}clear(){return this.points.length=0,this.colors.clear(),this.geometry.setFromPoints([new n.Vector3,new n.Vector3]),this}draw(){if(this.geometry.setFromPoints(this.points),this.geometry.computeBoundingSphere(),this.material.vertexColors=this.colors.size>0,this.material.needsUpdate=!0,this.colors.size>0){var t;let e=new n.Color(null!==(t=this.colors.get(0))&&void 0!==t?t:"white"),r=this.points.length,o=function(t){let e=t.attributes.color;if(e)return e;{let e=new n.BufferAttribute(new Float32Array(3*t.attributes.position.count),3);return t.setAttribute("color",e),e}}(this.geometry);for(let t=0;t<r;t++){let r=this.colors.get(t);r&&e.copy(r),o.setXYZ(t,e.r,e.g,e.b)}}return this}line(t,e,r){return h(this,[(0,i.Q7)(t),(0,i.Q7)(e)],r),this}polygon(t,e){let r=t.map(t=>(0,i.Q7)(t)),n=[];for(let t=0;t<r.length;t++)n.push(r[t],r[(t+1)%r.length]);return h(this,n,e),this}polyline(t,e){let r=t.map(t=>(0,i.Q7)(t)),n=[];for(let t=0;t<r.length-1;t++)n.push(r[t],r[t+1]);return h(this,n,e),this}circle(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let{x:o,y:l,radius:u,segments:a,...f}={...c.circleDefaultOptions,...(()=>{if(e.length>1){let[t,r,n]=e,{x:o,y:l}=(0,i.iK)(t,s);return{x:o,y:l,radius:r,...n}}return e[0]})()},d=new n.Vector3(1,0,0),g=new n.Vector3(0,1,0),p=[];for(let t=0;t<a;t++){let e=t/a*Math.PI*2,r=(t+1)/a*Math.PI*2,i=Math.cos(e)*u,s=Math.sin(e)*u,h=Math.cos(r)*u,c=Math.sin(r)*u,f=new n.Vector3(o,l,0).addScaledVector(d,i).addScaledVector(g,s),w=new n.Vector3(o,l,0).addScaledVector(d,h).addScaledVector(g,c);p.push(f,w)}return h(this,p,f),this}rectangle(t,e){let{centerX:r,centerY:i,width:s,height:l}=o.Ae.from(t),u=s/2,c=l/2,a=new n.Vector3(r-u,i-c,0),f=new n.Vector3(r+u,i-c,0),d=new n.Vector3(r+u,i+c,0),g=new n.Vector3(r-u,i+c,0);return h(this,[a,f,f,d,d,g,g,a],e),this}box(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=0,r=0,o=0,s=1,u=1,h=1,{center:c,size:a,box3:f}=t;if(void 0!==c&&({x:e,y:r,z:o}=(0,i.Q7)(c,l)),void 0!==a&&({x:s,y:u,z:h}=(0,i.Q7)(a,l)),void 0!==f){let{min:n,max:i}=f,{x:l,y:c,z:a}=n,{x:d,y:g,z:p}=i;t.asIntBox3&&(d+=1,g+=1,p+=1),e=(l+d)/2,r=(c+g)/2,o=(a+p)/2,s=d-l,u=g-c,h=p-a}let d=s/2,g=u/2,p=h/2,w=new n.Vector3(e-d,r-g,o-p),z=new n.Vector3(e+d,r-g,o-p),y=new n.Vector3(e+d,r+g,o-p),S=new n.Vector3(e-d,r+g,o-p),x=new n.Vector3(e-d,r-g,o+p),k=new n.Vector3(e+d,r-g,o+p),v=new n.Vector3(e+d,r+g,o+p),V=new n.Vector3(e-d,r+g,o+p);return this.points.push(w,z,z,y,y,S,S,w),this.points.push(x,k,k,v,v,V,V,x),this.points.push(w,x,z,k,y,v,S,V),this}plus(t,e,r){let o=e/2,{x:l,y:u}=(0,i.iK)(t,s),c=new n.Vector3(l-o,u,0);return h(this,[c,new n.Vector3(l+o,u,0),new n.Vector3(l,u-o,0),new n.Vector3(l,u+o,0)],r),this}cross(t,e,r){let o=e/2,{x:l,y:u}=(0,i.iK)(t,s),c=new n.Vector3(l-o,u-o,0);return h(this,[c,new n.Vector3(l+o,u+o,0),new n.Vector3(l-o,u+o,0),new n.Vector3(l+o,u-o,0)],r),this}constructor(...t){super(...t),this.points=[],this.colors=new Map}}c.circleDefaultOptions={x:0,y:0,radius:.5,segments:96}},12042:function(t,e,r){r.d(e,{P:function(){return s}});var n=r(88780),o=r(23247);let i={luminosity:.5};class s extends n.MeshBasicMaterial{constructor(t){let{luminosity:e,...r}={...i,...t},s={uSunPosition:{value:new n.Vector3(.5,.7,.3)},uLuminosity:{value:e}};super(r),this.onBeforeCompile=t=>o.b.with(t).uniforms(s).varying({vWorldNormal:"vec3"}).vertex.mainAfterAll("\n          vWorldNormal = mat3(modelMatrix) * normal;\n      ").fragment.after("map_fragment","\n        vec3 lightDirection = normalize(uSunPosition);\n        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n        light = pow(light, 2.0);\n        light = mix(uLuminosity, 1.0, light);\n        diffuseColor *= light;\n      "),this.sunPosition=s.uSunPosition.value}}},67896:function(t,e,r){r.d(e,{w:function(){return i}});var n=r(88780);let o=new n.IcosahedronGeometry(1,4);class i extends n.Mesh{constructor(t){super(o,new n.MeshBasicMaterial({color:"#0c529d",...t,side:n.BackSide,depthWrite:!1,depthTest:!1})),this.renderOrder=-1,this.frustumCulled=!1,this.matrixAutoUpdate=!1,this.onBeforeRender=(t,e,r)=>{let n=(r.near+r.far)/2;this.position.copy(r.position),this.scale.setScalar(n),this.updateMatrix(),this.updateMatrixWorld()}}}},90118:function(t,e,r){function n(t,e){for(let r of t)if(e(r))return!0;return!1}function o(t,e){for(let r of t)if(!e(r))return!1;return!0}function i(t,e,r){let n=[];function o(t){let e=[];return n[t]=e,e}if(void 0!==r)for(let t=0;t<r;t++)o(t);for(let r of t){var i;let t=e(r);(null!==(i=n[t])&&void 0!==i?i:o(t)).push(r)}return n}r.r(e),r.d(e,{every:function(){return o},some:function(){return n},split:function(){return i}})},28104:function(t,e,r){function*n(t){let e=0,r={get i(){return e},get t(){return e/t},get p(){return e/(t-1)},clone(){return{...this}}};for(e=0;e<t;e++)yield r}function o(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let o=[];for(let t of n(...e))o.push(t.clone());return o}function*i(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let n=0,o=0;2===e.length?(n=e[0],o=e[1]):Array.isArray(e[0])?(n=e[0][0],o=e[0][1]):(n=e[0].x,o=e[0].y);let i=0,s=0,l=0,u={get i(){return i},get x(){return s},get y(){return l},get tx(){return s/n},get ty(){return l/o},get px(){return s/(n-1)},get py(){return l/(o-1)},clone(){return{...this}}};for(l=0;l<o;l++)for(s=0;s<n;s++)yield u,i++}function s(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let n=[];for(let t of i(...e))n.push(t.clone());return n}function*l(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let n=0,o=0,i=0;3===e.length?(n=e[0],o=e[1],i=e[2]):Array.isArray(e[0])?(n=e[0][0],o=e[0][1],i=e[0][2]):(n=e[0].x,o=e[0].y,i=e[0].z);let s=0,l=0,u=0,h=0,c={get i(){return s},get x(){return l},get y(){return u},get z(){return h},get tx(){return l/n},get ty(){return u/o},get tz(){return h/i},get px(){return l/(n-1)},get py(){return u/(o-1)},get pz(){return h/(i-1)},clone(){return{...this}}};for(h=0;h<i;h++)for(u=0;u<o;u++)for(l=0;l<n;l++)yield c,s++}function u(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let n=[];for(let t of l(...e))n.push(t.clone());return n}r.r(e),r.d(e,{loop:function(){return n},loop2:function(){return i},loop2Array:function(){return s},loop3:function(){return l},loop3Array:function(){return u},loopArray:function(){return o}})},6246:function(t,e,r){r.d(e,{T:function(){return h}});let n=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(t=(t=(7*t+Math.sqrt(t)+16087*Math.sin(t))%2147483647)<0?t+2147483647:t)>1?2147483647&t:0===t?345678:123456},o=t=>t=2147483647&Math.imul(t,48271),i=t=>(t-1)/2147483646,s=t=>t,l={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function u(){let t=o(o(n(123456)));function e(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof e&&(e=e.split("").reduce((t,e)=>7*t+e.charCodeAt(0),0)),t=o(o(n(e))),f}function r(){return i(t=o(t))}function u(t){switch(t.length){default:return[0,1,s];case 1:return[0,t[0],s];case 2:return[t[0],t[1],s];case 3:return[t[0],t[1],t[2]]}}function h(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];let[o,i,s]=u(e);return o+(i-o)*s(r())}function c(){for(var t,e=arguments.length,n=Array(e),o=0;o<e;o++)n[o]=arguments[o];let[i,s,{weightsAreNormalized:u,indexOffset:h,forbiddenItems:c}]=function(t){let[e,r=null,n]=t,o={...l,...n};if(Array.isArray(e))return[e,r,o];if("object"==typeof e)return[Object.values(e),r?Object.values(r):null,o];throw Error("pick: unsupported options type")}(n);if(c.length>0){let e=new Set;for(let t of c){let r=i.indexOf(t);r>=0&&e.add(r)}if(i=i.filter((t,r)=>!e.has(r)),s=null!==(t=null==s?void 0:s.filter((t,r)=>!e.has(r)))&&void 0!==t?t:null,0===i.length)throw Error("pick: all items are forbidden")}if(null===s){let t=Math.floor(r()*i.length);return h&&(t+=h,(t%=i.length)<0&&(t+=i.length)),i[t]}if(!u){let t=s.reduce((t,e)=>t+e,0);s=s.map(e=>e/t)}let a=r(),f=0;for(let t=0;t<i.length;t++)if(a<(f+=s[t]))return i[t];throw Error("among: unreachable")}function a(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=r(),o=r(),i=Math.sqrt(-2*Math.log(n)),s=2*Math.PI*o;return[t+e*i*Math.cos(s),t+e*i*Math.sin(s)]}let f={seed:e,seedMax:function(){return 2147483647},reset:function(){return e(123456),f},next:function(){return t=o(t),f},random:r,between:h,around:function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];let[o=1,i=s]=e,l=2*r();return(l>1?1:-1)*i(l>1?l-1:l)*o},int:function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];let[o,i,s]=u(e);return o+Math.floor(s(r())*(i-o))},chance:function(t){return r()<t},shuffle:function(t){let{mutate:e=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e&&Array.isArray(t)?t:[...t],o=n.length;for(let t=0;t<o;t++){let e=Math.floor(o*r()),i=n[t];n[t]=n[e],n[e]=i}return n},pick:c,createPicker:function(t){let e=t.map(t=>{let[e]=t;return e}),r=t.map(t=>{let[e,r]=t;return r}),n=r.reduce((t,e)=>t+e,0);for(let[t,e]of r.entries())r[t]=e/n;return()=>c(e,r,{weightsAreNormalized:!0})},vector:function(t,e){let[r=0,n=1]=Array.isArray(e)?e:[null==e?void 0:e.min,null==e?void 0:e.max];for(let e of Object.keys(t))t[e]=h(r,n);return t},unitVector2:function(t){let e=2*Math.PI*r();return t.x=Math.cos(e),t.y=Math.sin(e),t},unitVector3:function(t){let e=r(),n=r(),o=2*Math.PI*e,i=Math.acos(1-2*n);return t.x=Math.sin(i)*Math.cos(o),t.y=Math.sin(i)*Math.sin(o),t.z=Math.cos(i),t},normalVector:function(t){let e=Object.keys(t),r=e.length,n=Math.sqrt(r);for(let o=0;o<r;o+=2){let[i,s]=a();t[e[o]]=i/n,o+1<r&&(t[e[o+1]]=s/n)}return t},unitVector:function(t){let e=Object.keys(t),r=e.length,n=0;for(let o=0;o<r;o+=2){let[i,s]=a();t[e[o]]=i,n+=i*i,o+1<r&&(t[e[o+1]]=s,n+=s*s)}n=Math.sqrt(n);for(let o=0;o<r;o++)t[e[o]]/=n;return t},boxMuller:a};return f}let h=class{constructor(t){Object.assign(this,u().seed(t))}};Object.assign(h,u())}}]);