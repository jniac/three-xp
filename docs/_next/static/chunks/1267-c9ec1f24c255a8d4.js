(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1267],{70749:function(e,t,n){"use strict";n.d(t,{Client:function(){return K}});var o=n(32617),r=n(83119),i=n(74259),s=n(47365),l=n(15721),a=n(9258),c=n(78780),u=n(29368),f=n(5693),d=n(92948),h=n(37186),y=n(80536),p=n(30636),x=n(97219),w=n(12042),m=n(67896),v=n(28104),g=n(6246);function k(e,t,n,o,r){let i=o-e,s=r-t,l=Math.sqrt(i*i+s*s);return[e+i/l*n,t+s/l*n]}class P extends h.ZAu{constructor(...e){super(...e),this.parts=(()=>{(0,c.cY)(new h.Kj0(new h.FE5(10,.4,512,64),new w.P),this),(0,c.cY)(new p.K,{parent:this,rotationX:"90deg"});let e=(0,c.cY)(new m.w,this),t=new h.Pa4,n=new h.Pa4;{let e=new y.z(16);for(let{x:o,y:r,z:i}of(0,v.loop3)(16,16,16)){t.set(o,r,i);let[s,l]=k(8,8,16/3,o,i);n.set(s,16/6,l);let a=t.distanceTo(n)<16/6;e.getVoxelState(o,r,i).setUint8(0,a?1:0)}(0,c.cY)(new h.Kj0((0,y.eO)(e.voxelFaces()),new w.P({color:"#ffdd55"})),{parent:this,x:-16,z:-16})}{let e=new y.z(16);for(let{x:o,y:r,z:i}of(0,v.loop3)(16,16,16)){t.set(o,r,i);let[s,l]=k(8,8,8,o,i);n.set(s,4,l);let a=4>t.distanceTo(n);e.getVoxelState(o,r,i).setUint8(0,a?1:0)}(0,c.cY)(new h.Kj0((0,y.eO)(e.voxelFaces()),new w.P({color:"#ff5566"})),{parent:this,x:0,z:-16})}{let e=new y.z(16);for(let{x:n,y:o,z:r}of(0,v.loop3)(16,16,16)){let i=15>t.set(n,o,r).length();e.getVoxelState(n,o,r).setUint8(0,i?1:0)}(0,c.cY)(new h.Kj0((0,y.eO)(e.voxelFaces()),new w.P({color:"#55ff96"})),{parent:this,x:-32})}{let e=new y.z(new h.Pa4(12,24,4),1);for(let{x:t,y:n,z:o}of(0,v.loop3)(e.size)){let r=.5>Math.random();e.getVoxelState(t,n,o).setUint8(0,r?1:0)}(0,c.cY)(new h.Kj0((0,y.eO)(e.voxelFaces()),new w.P({color:"#cfedff"})),{parent:this,position:[16,0,-12]})}{let e=new y.z(16);for(let{x:t,y:n,z:o}of(0,v.loop3)(16,16,16)){let r=(0===t||0===n||0===o||15===t||15===n||15===o)&&g.T.chance(.66);e.getVoxelState(t,n,o).setUint8(0,r?1:0)}console.log(e.computeBounds()),(0,c.cY)(new h.Kj0((0,y.eO)(e.voxelFaces()),new w.P({color:"#9900ff"})),{parent:this,x:-16,z:-32})}{let e=new y.z(16),t=new h.Pa4;for(let{x:n,y:o,z:r}of(0,v.loop3)(16,16,16)){t.set(n-8,o-8,r-8);let i=t.lengthSq()-16;g.T.chance(1-.05*i)&&e.getVoxelState(n,o,r).setUint8(0,1)}let n=(0,c.cY)(new h.Kj0((0,y.eO)(e.voxelFaces()),new w.P({color:"#00ddff"})),{parent:this,x:-16,z:0});(0,c.cY)(new x.O,{parent:n}).box({box3:e.computeBounds(),asIntBox3:!0}).draw()}return{sky:e}})()}}var j=n(96915),z=n.n(j);function b(){return(0,f.Ky)(function*(e){(0,d.a)({three:e});let t=new l.F({size:60,perspective:1,focus:[0,5,0],rotation:["-20deg","30deg",0]});yield t.start(e.renderer.domElement),u.vB.get("three").set({minActiveDuration:60}),yield(0,u.RC)("three",n=>{let{aspect:o,camera:r}=e;t.update(r,o,n.deltaTime)}),yield(0,s.p)([[{code:"Space",modifiers:"shift"},()=>{document.body.requestFullscreen()}]]);let n=new i.n(e.scene,e.camera);n.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:100,radiusExponent:2,rings:2,samples:16}),e.pipeline.addPass(n,{type:a.GR.PostProcessing})},[]),null}function C(){return(0,f._v)("main",function*(e){(0,c.cY)(new P,e)},[]),null}function K(){return(0,o.jsx)("div",{children:(0,o.jsxs)(f.H7,{children:[(0,o.jsx)(b,{}),(0,o.jsx)(C,{}),(0,o.jsx)("div",{className:"layer thru flex flex-col p-4 gap-2",children:(0,o.jsx)(r.U,{className:z().Markdown,children:"# Chunk demo\n\nPure chunk demo (no world).\n\n- Chunks are sized, when trying to access a voxel out of the chunk's bounds, an\n  error is thrown.\n- Chunk are not necessarily cubes, they can have different sizes in each dimension.\n"})})]})})}},5693:function(e,t,n){"use strict";n.d(t,{H7:function(){return x},Ky:function(){return d},_v:function(){return h}});var o=n(32617),r=n(87200),i=n(37186),s=n(23657),l=n(15721),a=n(9258),c=n(29368),u=n(74707);let f=(0,r.createContext)(null);function d(e,t){let n=(0,r.useContext)(f);return(0,s.sv)(async function*(t,o){if(e){let t=e(n,o);if(t&&"function"==typeof t.next)do{let{value:e,done:n}=await t.next();if(n)break;yield e}while(o.mounted)}},null!=t?t:"always"),n}function h(e,t,n){let o=(0,r.useMemo)(()=>new i.ZAu,[]);return o.name=e,d(async function*(e,n){if(e.scene.add(o),yield()=>{o.clear(),o.removeFromParent()},t){let r=t(o,e,n);if(r&&"function"==typeof r.next)do{let{value:e,done:t}=await r.next();if(t)break;yield e}while(n.mounted)}},n),o}let y={className:"",assetsPath:"/",vertigoControls:!1};function p(e){let{children:t,className:n,assetsPath:i,vertigoControls:u}={...y,...e},d=(0,r.useMemo)(()=>new a.Vu,[]);d.loader.setPath(i);let{ref:h}=(0,s.Nv)({debounce:!0},function*(e,t){yield d.initialize(e.firstElementChild),t.triggerRender(),Object.assign(window,{three:d})},[]);(0,s.sv)(function*(){if(u){let e=new l.F("object"==typeof u?u:{}).initialize(h.current).start();yield e.destroy,yield(0,c.RC)("three",t=>{e.update(d.camera,d.aspect,t.deltaTime)})}},[u]);let p={position:"absolute",inset:0};return(0,o.jsx)("div",{ref:h,className:n,style:p,children:(0,o.jsxs)(f.Provider,{value:d,children:[(0,o.jsx)("div",{style:p}),(0,o.jsx)("div",{style:p,className:"thru",children:d.initialized&&t})]})})}function x(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,u.O)()&&(0,o.jsx)(p,{...t[0]})}},74707:function(e,t,n){"use strict";n.d(t,{O:function(){return r}});var o=n(87200);function r(){let[e,t]=(0,o.useState)(!1);return(0,o.useLayoutEffect)(()=>{t(!0)},[]),e}},47365:function(e,t,n){"use strict";function o(e,t){return"*"===t||("string"==typeof t?t===e:t instanceof RegExp?t.test(e):"function"==typeof t&&t(e))}n.d(t,{p:function(){return s}});let r={preventDefault:!1,strictTarget:void 0},i={key:"*",keyCaseInsensitive:!0,code:"*",noModifiers:!1,modifiers:""};function s(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[s,l,a]=1===t.length?[document.body,{},t[0]]:2===t.length?[t[0],{},t[1]]:t,{preventDefault:c}={...r,...l},u=e=>{var t;if((null!==(t=l.strictTarget)&&void 0!==t?!!t:s===document.body)&&e.target!==s)return;let{ctrlKey:n,altKey:r,shiftKey:u,metaKey:f}=e,d={event:e,modifiers:{ctrl:n,alt:r,shift:u,meta:f}};for(let t=0,s=a.length;t<s;t++){let[s,l]=a[t],{key:h,keyCaseInsensitive:y,code:p,noModifiers:x,modifiers:w}=function(e){let t="string"==typeof e?{...i,key:e}:{...i,...e};return t.keyCaseInsensitive&&"string"==typeof t.key&&(t.key=t.key.toLowerCase()),t}(s);Object.values({key:o(y?e.key.toLowerCase():e.key,h),code:o(e.code,p),noModifiers:!x||!1===n&&!1===r&&!1===u&&!1===f,modifiers:function(e,t){let{ctrlKey:n,altKey:o,shiftKey:r,metaKey:i}=e;if("function"==typeof t)return t({ctrl:n,alt:o,shift:r,meta:i});let{ctrl:s=!1,alt:l=!1,shift:a=!1,meta:c=!1}=Object.fromEntries(t.split("-").map(e=>[e,!0]));return s===n&&l===o&&a===r&&c===i}(e,w)}).every(Boolean)&&(c&&e.preventDefault(),l(d))}};return s.addEventListener("keydown",u,{passive:!1}),{destroy:()=>{s.removeEventListener("keydown",u)}}}},30636:function(e,t,n){"use strict";n.d(t,{K:function(){return s}});var o=n(88780),r=n(32219);let i={color:"white",opacity:.5,size:[8,8],step:1,frame:!0};class s extends o.ejS{set(e){let{color:t,opacity:n,size:s,step:l,frame:a}={...i,...e},c=(0,r.iK)(s),u=(0,r.iK)(null!=l?l:c),f=[],d=(e,t)=>f.push(new o.Pa4(e,t,0));a&&(d(-c.x/2,+c.y/2),d(+c.x/2,+c.y/2),d(+c.x/2,+c.y/2),d(+c.x/2,-c.y/2),d(+c.x/2,-c.y/2),d(-c.x/2,-c.y/2),d(-c.x/2,-c.y/2),d(-c.x/2,+c.y/2));let h=Math.ceil(-c.x/2/u.x)*u.x;h===-c.x/2&&(h+=u.x);do d(h,-c.y/2),d(h,+c.y/2),h+=u.x;while(h<c.x/2);let y=Math.ceil(-c.y/2/u.y)*u.y;y===-c.y/2&&(y+=u.y);do d(-c.x/2,y),d(+c.x/2,y),y+=u.y;while(y<c.y/2);return this.geometry.setFromPoints(f),this.material.color.set(t),this.material.opacity=n,this.material.transparent=n<1,this}constructor(e){super(),this.set(null!=e?e:i)}}},96915:function(e){e.exports={Markdown:"md_Markdown__RP0EZ"}}}]);