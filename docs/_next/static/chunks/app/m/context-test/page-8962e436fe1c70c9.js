(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[700],{7508:function(e,t,n){Promise.resolve().then(n.bind(n,7312))},7312:function(e,t,n){"use strict";n.d(t,{default:function(){return c}});var r=n(41291),s=n(64740);let a=new s.Vector3;function i(e,t,n,r,s,i){let o=2*Math.PI*s/4,u=Math.max(i-2*s,0);a.copy(t),a[r]=0,a.normalize();let l=.5*o/(o+u),c=1-a.angleTo(e)/(Math.PI/4);return 1===Math.sign(a[n])?c*l:u/(o+u)+l+l*(1-c)}class o extends s.BoxGeometry{constructor(e=1,t=1,n=1,r=2,a=.1){if(r=2*r+1,a=Math.min(e/2,t/2,n/2,a),super(1,1,1,r,r,r),1===r)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let u=new s.Vector3,l=new s.Vector3,c=new s.Vector3(e,t,n).divideScalar(2).subScalar(a),d=this.attributes.position.array,h=this.attributes.normal.array,v=this.attributes.uv.array,m=d.length/6,y=new s.Vector3,w=.5/r;for(let r=0,s=0;r<d.length;r+=3,s+=2)switch(u.fromArray(d,r),l.copy(u),l.x-=Math.sign(l.x)*w,l.y-=Math.sign(l.y)*w,l.z-=Math.sign(l.z)*w,l.normalize(),d[r+0]=c.x*Math.sign(u.x)+l.x*a,d[r+1]=c.y*Math.sign(u.y)+l.y*a,d[r+2]=c.z*Math.sign(u.z)+l.z*a,h[r+0]=l.x,h[r+1]=l.y,h[r+2]=l.z,Math.floor(r/m)){case 0:y.set(1,0,0),v[s+0]=i(y,l,"z","y",a,n),v[s+1]=1-i(y,l,"y","z",a,t);break;case 1:y.set(-1,0,0),v[s+0]=1-i(y,l,"z","y",a,n),v[s+1]=1-i(y,l,"y","z",a,t);break;case 2:y.set(0,1,0),v[s+0]=1-i(y,l,"x","z",a,e),v[s+1]=i(y,l,"z","x",a,n);break;case 3:y.set(0,-1,0),v[s+0]=1-i(y,l,"x","z",a,e),v[s+1]=1-i(y,l,"z","x",a,n);break;case 4:y.set(0,0,1),v[s+0]=1-i(y,l,"x","y",a,e),v[s+1]=1-i(y,l,"y","x",a,t);break;case 5:y.set(0,0,-1),v[s+0]=i(y,l,"x","y",a,e),v[s+1]=1-i(y,l,"y","x",a,t)}}}var u=n(63293);function l(){return(0,u.Ky)(async function*(e){e.useOrbitControls();{let t=new s.Mesh(new o,new s.MeshPhysicalMaterial({color:"indigo",clearcoat:.66,clearcoatRoughness:.2}));e.scene.add(t),yield e.onTick(e=>{t.rotation.x+=.1*e.deltaTime,t.rotation.y+=.1*e.deltaTime})}{let t=new s.Mesh(new s.IcosahedronGeometry(1,8),new s.MeshPhysicalMaterial({roughness:.1,metalness:.9,color:"indigo",iridescence:.5}));t.position.set(2,0,0),e.scene.add(t)}let t=await e.loadRgbe("https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr");t.mapping=s.EquirectangularReflectionMapping;let n=new s.PMREMGenerator(e.renderer),r=n.fromEquirectangular(t);n.dispose(),e.scene.environment=r.texture},"always"),null}function c(){return(0,r.jsxs)(u.H7,{className:"Client absolute-through flex flex-col p-4",children:[(0,r.jsx)("h1",{children:"Client"}),(0,r.jsx)(l,{})]})}},51845:function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[r,s]=1===t.length?[window,t[0]]:t,a=()=>{s()};return r.addEventListener("mousemove",a),r.addEventListener("mousedown",a),r.addEventListener("mouseup",a),r.addEventListener("touchstart",a),r.addEventListener("touchmove",a),r.addEventListener("wheel",a),r.addEventListener("keydown",a),r.addEventListener("keyup",a),window.addEventListener("resize",a),{destroy:()=>{r.removeEventListener("mousemove",a),r.removeEventListener("mousedown",a),r.removeEventListener("mouseup",a),r.removeEventListener("touchstart",a),r.removeEventListener("touchmove",a),r.removeEventListener("wheel",a),r.removeEventListener("keydown",a),r.removeEventListener("keyup",a),window.removeEventListener("resize",a)}}}n.d(t,{s:function(){return r}})}},function(e){e.O(0,[244,803,662,579,893,290,626,293,658,510,744],function(){return e(e.s=7508)}),_N_E=e.O()}]);