(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6341],{15480:function(e,t,n){Promise.resolve().then(n.t.bind(n,34709,23)),Promise.resolve().then(n.bind(n,75915))},75915:function(e,t,n){"use strict";n.d(t,{default:function(){return l}});var i=n(32617),r=n(88780),a=n(38794),s=n(5693);function o(){return(0,s.Ky)(async function*(e){e.useOrbitControls();{let t=new r.Mesh(new a.k,new r.MeshPhysicalMaterial({color:"indigo",clearcoat:.66,clearcoatRoughness:.2}));e.scene.add(t),yield e.onTick(e=>{t.rotation.x+=.1*e.deltaTime,t.rotation.y+=.1*e.deltaTime})}{let t=new r.Mesh(new r.IcosahedronGeometry(1,8),new r.MeshPhysicalMaterial({roughness:.1,metalness:.9,color:"indigo",iridescence:.5}));t.position.set(2,0,0),e.scene.add(t)}let t=await e.loader.loadRgbe("https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr");t.mapping=r.EquirectangularReflectionMapping;let n=new r.PMREMGenerator(e.renderer),i=n.fromEquirectangular(t);n.dispose(),e.scene.environment=i.texture},"always"),null}function l(){return(0,i.jsxs)(s.H7,{className:"Client absolute-through flex flex-col p-4",children:[(0,i.jsx)("h1",{children:"Client"}),(0,i.jsx)(o,{})]})}},5693:function(e,t,n){"use strict";n.d(t,{H7:function(){return b},Ky:function(){return f},_v:function(){return h},ur:function(){return y}});var i=n(32617),r=n(87200),a=n(88780),s=n(23657),o=n(15721),l=n(9258),u=n(29368),c=n(74707);let d=(0,r.createContext)(null);function f(e,t){let n=(0,r.useContext)(d);return(0,s.sv)(async function*(t,i){if(e){let t=e(n,i);if(t&&"function"==typeof t.next)do{let{value:e,done:n}=await t.next();if(n)break;yield e}while(i.mounted)}},null!=t?t:"always"),n}function h(e,t,n){let i=(0,r.useMemo)(()=>new a.Group,[]);return i.name=e,f(async function*(e,n){if(e.scene.add(i),yield()=>{i.clear(),i.removeFromParent()},t){let r=t(i,e,n);if(r&&"function"==typeof r.next)do{let{value:e,done:t}=await r.next();if(t)break;yield e}while(n.mounted)}},n),i}function y(e){let{value:t}=e,n=(0,r.useMemo)(()=>"function"==typeof t?new t:t,[t]);return f(async function*(e){if(e.scene.add(n),"initialize"in n){let t=n.initialize(e);if(t&&"function"==typeof t.next)for(;;){let{value:e,done:n}=await t.next();if(n)break;yield e}}yield()=>{if(n.removeFromParent(),"destroy"in n){var e;null===(e=n.destroy)||void 0===e||e.call(n)}}},[n]),null}let x={className:"",assetsPath:"/",vertigoControls:!1};function m(e){let{children:t,className:n,assetsPath:a,vertigoControls:c}={...x,...e},f=(0,r.useMemo)(()=>new l.Vu,[]);f.loader.setPath(a);let{ref:h}=(0,s.Nv)({debounce:!0},function*(e,t){yield f.initialize(e.firstElementChild),t.triggerRender(),Object.assign(window,{three:f})},[]);(0,s.sv)(function*(){if(c){let e=new o.F("object"==typeof c?c:{}).initialize(h.current).start();yield e.destroy,yield(0,u.RC)("three",t=>{e.update(f.camera,f.aspect,t.deltaTime)})}},[c]);let y={position:"absolute",inset:0};return(0,i.jsx)("div",{ref:h,className:n,style:y,children:(0,i.jsxs)(d.Provider,{value:f,children:[(0,i.jsx)("div",{style:y}),(0,i.jsx)("div",{style:y,className:"thru",children:f.initialized&&t})]})})}function b(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,c.O)()&&(0,i.jsx)(m,{...t[0]})}},74707:function(e,t,n){"use strict";n.d(t,{O:function(){return r}});var i=n(87200);function r(){let[e,t]=(0,i.useState)(!1);return(0,i.useLayoutEffect)(()=>{t(!0)},[]),e}},38794:function(e,t,n){"use strict";n.d(t,{k:function(){return s}});var i=n(88780);let r=new i.Vector3;function a(e,t,n,i,a,s){let o=2*Math.PI*a/4,l=Math.max(s-2*a,0);r.copy(t),r[i]=0,r.normalize();let u=.5*o/(o+l),c=1-r.angleTo(e)/(Math.PI/4);return 1===Math.sign(r[n])?c*u:l/(o+l)+u+u*(1-c)}class s extends i.BoxGeometry{constructor(e=1,t=1,n=1,r=2,s=.1){if(r=2*r+1,s=Math.min(e/2,t/2,n/2,s),super(1,1,1,r,r,r),1===r)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let l=new i.Vector3,u=new i.Vector3,c=new i.Vector3(e,t,n).divideScalar(2).subScalar(s),d=this.attributes.position.array,f=this.attributes.normal.array,h=this.attributes.uv.array,y=d.length/6,x=new i.Vector3,m=.5/r;for(let i=0,r=0;i<d.length;i+=3,r+=2)switch(l.fromArray(d,i),u.copy(l),u.x-=Math.sign(u.x)*m,u.y-=Math.sign(u.y)*m,u.z-=Math.sign(u.z)*m,u.normalize(),d[i+0]=c.x*Math.sign(l.x)+u.x*s,d[i+1]=c.y*Math.sign(l.y)+u.y*s,d[i+2]=c.z*Math.sign(l.z)+u.z*s,f[i+0]=u.x,f[i+1]=u.y,f[i+2]=u.z,Math.floor(i/y)){case 0:x.set(1,0,0),h[r+0]=a(x,u,"z","y",s,n),h[r+1]=1-a(x,u,"y","z",s,t);break;case 1:x.set(-1,0,0),h[r+0]=1-a(x,u,"z","y",s,n),h[r+1]=1-a(x,u,"y","z",s,t);break;case 2:x.set(0,1,0),h[r+0]=1-a(x,u,"x","z",s,e),h[r+1]=a(x,u,"z","x",s,n);break;case 3:x.set(0,-1,0),h[r+0]=1-a(x,u,"x","z",s,e),h[r+1]=1-a(x,u,"z","x",s,n);break;case 4:x.set(0,0,1),h[r+0]=1-a(x,u,"x","y",s,e),h[r+1]=1-a(x,u,"y","x",s,t);break;case 5:x.set(0,0,-1),h[r+0]=a(x,u,"x","y",s,e),h[r+1]=1-a(x,u,"y","x",s,t)}}}}},function(e){e.O(0,[7512,1561,7834,6158,3956,1067,3310,4709,812,3420,1540,6567,9258,5721,5694,2840,1744],function(){return e(e.s=15480)}),_N_E=e.O()}]);