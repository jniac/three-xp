(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6341],{98006:function(e,t,n){Promise.resolve().then(n.t.bind(n,77601,23)),Promise.resolve().then(n.bind(n,7312))},7312:function(e,t,n){"use strict";n.d(t,{default:function(){return c}});var r=n(41291),i=n(64740);let a=new i.Vector3;function s(e,t,n,r,i,s){let o=2*Math.PI*i/4,l=Math.max(s-2*i,0);a.copy(t),a[r]=0,a.normalize();let u=.5*o/(o+l),c=1-a.angleTo(e)/(Math.PI/4);return 1===Math.sign(a[n])?c*u:l/(o+l)+u+u*(1-c)}class o extends i.BoxGeometry{constructor(e=1,t=1,n=1,r=2,a=.1){if(r=2*r+1,a=Math.min(e/2,t/2,n/2,a),super(1,1,1,r,r,r),1===r)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let l=new i.Vector3,u=new i.Vector3,c=new i.Vector3(e,t,n).divideScalar(2).subScalar(a),h=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,y=h.length/6,x=new i.Vector3,m=.5/r;for(let r=0,i=0;r<h.length;r+=3,i+=2)switch(l.fromArray(h,r),u.copy(l),u.x-=Math.sign(u.x)*m,u.y-=Math.sign(u.y)*m,u.z-=Math.sign(u.z)*m,u.normalize(),h[r+0]=c.x*Math.sign(l.x)+u.x*a,h[r+1]=c.y*Math.sign(l.y)+u.y*a,h[r+2]=c.z*Math.sign(l.z)+u.z*a,d[r+0]=u.x,d[r+1]=u.y,d[r+2]=u.z,Math.floor(r/y)){case 0:x.set(1,0,0),f[i+0]=s(x,u,"z","y",a,n),f[i+1]=1-s(x,u,"y","z",a,t);break;case 1:x.set(-1,0,0),f[i+0]=1-s(x,u,"z","y",a,n),f[i+1]=1-s(x,u,"y","z",a,t);break;case 2:x.set(0,1,0),f[i+0]=1-s(x,u,"x","z",a,e),f[i+1]=s(x,u,"z","x",a,n);break;case 3:x.set(0,-1,0),f[i+0]=1-s(x,u,"x","z",a,e),f[i+1]=1-s(x,u,"z","x",a,n);break;case 4:x.set(0,0,1),f[i+0]=1-s(x,u,"x","y",a,e),f[i+1]=1-s(x,u,"y","x",a,t);break;case 5:x.set(0,0,-1),f[i+0]=s(x,u,"x","y",a,e),f[i+1]=1-s(x,u,"y","x",a,t)}}}var l=n(47804);function u(){return(0,l.Ky)(async function*(e){e.useOrbitControls();{let t=new i.Mesh(new o,new i.MeshPhysicalMaterial({color:"indigo",clearcoat:.66,clearcoatRoughness:.2}));e.scene.add(t),yield e.onTick(e=>{t.rotation.x+=.1*e.deltaTime,t.rotation.y+=.1*e.deltaTime})}{let t=new i.Mesh(new i.IcosahedronGeometry(1,8),new i.MeshPhysicalMaterial({roughness:.1,metalness:.9,color:"indigo",iridescence:.5}));t.position.set(2,0,0),e.scene.add(t)}let t=await e.loader.loadRgbe("https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr");t.mapping=i.EquirectangularReflectionMapping;let n=new i.PMREMGenerator(e.renderer),r=n.fromEquirectangular(t);n.dispose(),e.scene.environment=r.texture},"always"),null}function c(){return(0,r.jsxs)(l.H7,{className:"Client absolute-through flex flex-col p-4",children:[(0,r.jsx)("h1",{children:"Client"}),(0,r.jsx)(u,{})]})}},5714:function(e,t,n){"use strict";n.d(t,{v:function(){return r}});let r={development:!1}},47804:function(e,t,n){"use strict";n.d(t,{H7:function(){return y},Ky:function(){return h},_v:function(){return d}});var r=n(41291),i=n(81406),a=n(64740),s=n(13841),o=n(80550),l=n(5714),u=n(92605);let c=(0,i.createContext)(null);function h(e,t){let n=(0,i.useContext)(c);return(0,s.sv)(async function*(t,r){if(e){let t=e(n,r);if(t&&"function"==typeof t.next)do{let{value:e,done:n}=await t.next();if(n)break;yield e}while(r.mounted)}},null!=t?t:"always"),n}function d(e,t,n){let r=(0,i.useMemo)(()=>new a.Group,[]);return r.name=e,h(async function*(e,n){if(e.scene.add(r),yield()=>{r.clear(),r.removeFromParent()},t){let i=t(r,e,n);if(i&&"function"==typeof i.next)do{let{value:e,done:t}=await i.next();if(t)break;yield e}while(n.mounted)}},n),r}function f(e){let{children:t,className:n}=e,u=(0,i.useMemo)(()=>new o.Vu,[]),{ref:h}=(0,s.sv)(function*(e){let t=l.v.development?"/assets/":"/three-xp/assets/";u.loader.setPath(t),yield u.initialize(e),Object.assign(window,{three:u,THREE:a})},[]);return(0,r.jsx)("div",{ref:h,className:"ThreeProvider absolute-through ".concat(null!=n?n:""),children:(0,r.jsx)(c.Provider,{value:u,children:t})})}function y(e){return(0,u.O)()&&(0,r.jsx)(f,{...e})}},92605:function(e,t,n){"use strict";n.d(t,{O:function(){return i}});var r=n(81406);function i(){let[e,t]=(0,r.useState)(!1);return(0,r.useLayoutEffect)(()=>{t(!0)},[]),e}}},function(e){e.O(0,[5244,8423,3662,7579,893,2290,7601,6626,550,1658,3510,1744],function(){return e(e.s=98006)}),_N_E=e.O()}]);