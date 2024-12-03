(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6028],{87518:function(e,t,n){Promise.resolve().then(n.bind(n,81289))},81289:function(e,t,n){"use strict";n.d(t,{Client:function(){return M}});var r=n(32617),i=n(83119),s=n(87062),o=n(47365),l=n(62274),u=n(9258),a=n(78780),c=n(29368),f=n(5693),d=n(92948),y=n(88780),h=n(80536),p=n(30636),x=n(12042),m=n(67896),v=n(28104),w=n(6246);let k=new y.Raycaster;class g extends y.Group{constructor(...e){super(...e),this.parts=(()=>{w.T.reset();let e=(0,a.cY)(new y.Mesh(new y.TorusKnotGeometry(10,3,32,6),new x.P({wireframe:!0,side:y.DoubleSide})),this);e.visible=!1,(0,a.cY)(new p.K({size:24}),{parent:this,rotationX:"90deg"});let t=(0,a.cY)(new m.w,this),n=new h.q3;(0,d.a)({world:n});let r=new DataView(new ArrayBuffer(n.voxelStateByteSize));r.setUint8(0,1);let i=new y.Vector3;for(let{x:t,y:s,z:o}of(0,v.loop3)(24,24,24))t-=12,s-=12,o-=12,i.set(t+.5,s+.5,o+.5),k.set(i,new y.Vector3(1,0,0)),k.intersectObject(e,!0).length%2==1&&n.setVoxelState(t,s,o,r);for(let{x:e,y:t,z:r}of(0,v.loop3)(2,2,2)){e-=1,t-=1,r-=1;let i=n.tryGetChunk(e,t,r);if(i){let n=w.T.pick(["#ffdd55","#55ddff","#dd55ff","#55ffdd","#ff55dd","#ddff55","#ff5555"]);(0,a.cY)(new y.Mesh((0,h.eO)(i.voxelFaces()),new x.P({color:n})),{parent:this,x:16*e,y:16*t,z:16*r})}}return{sky:t}})()}}var P=n(96915),b=n.n(P);function j(){return(0,f.Ky)(function*(e){(0,d.a)({three:e});let t=new l.F({size:10,perspective:1});yield t.start(e.renderer.domElement),c.vB.get("three").set({minActiveDuration:60}),yield(0,c.RC)("three",n=>{let{aspect:r,camera:i}=e;t.update(i,r,n.deltaTime)}),yield(0,o.p)([[{code:"Space",modifiers:"shift"},()=>{document.body.requestFullscreen()}]]);let n=new s.n(e.scene,e.camera);n.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:100,radiusExponent:2,rings:2,samples:16}),e.pipeline.addPass(n,{type:u.GR.PostProcessing})},[]),null}function E(){return(0,f._v)("main",function*(e){(0,a.cY)(new g,e)},[]),null}function M(){return(0,r.jsx)("div",{children:(0,r.jsxs)(f.H7,{children:[(0,r.jsx)(j,{}),(0,r.jsx)(E,{}),(0,r.jsx)("div",{className:"layer thru flex flex-col p-4 gap-2",children:(0,r.jsx)(i.U,{className:b().Markdown,children:"# World\n\nWorld handles chunks under the hood.\n"})})]})})}},62411:function(e,t,n){"use strict";n.d(t,{v:function(){return i}});let r="/three-xp/assets/",i={development:!1,assetsPath:r,assets:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return"".concat(r).concat(e)}}},5693:function(e,t,n){"use strict";n.d(t,{H7:function(){return h},Ky:function(){return f},_v:function(){return d}});var r=n(32617),i=n(87200),s=n(88780),o=n(23657),l=n(9258),u=n(62411),a=n(74707);let c=(0,i.createContext)(null);function f(e,t){let n=(0,i.useContext)(c);return(0,o.sv)(async function*(t,r){if(e){let t=e(n,r);if(t&&"function"==typeof t.next)do{let{value:e,done:n}=await t.next();if(n)break;yield e}while(r.mounted)}},null!=t?t:"always"),n}function d(e,t,n){let r=(0,i.useMemo)(()=>new s.Group,[]);return r.name=e,f(async function*(e,n){if(e.scene.add(r),yield()=>{r.clear(),r.removeFromParent()},t){let i=t(r,e,n);if(i&&"function"==typeof i.next)do{let{value:e,done:t}=await i.next();if(t)break;yield e}while(n.mounted)}},n),r}function y(e){let{children:t,className:n}=e,a=(0,i.useMemo)(()=>new l.Vu,[]),{ref:f}=(0,o.sv)(function*(e){a.loader.setPath(u.v.assetsPath),yield a.initialize(e),Object.assign(window,{three:a,THREE:s})},[]);return(0,r.jsx)("div",{ref:f,className:"ThreeProvider absolute-through ".concat(null!=n?n:""),children:(0,r.jsx)(c.Provider,{value:a,children:t})})}function h(e){return(0,a.O)()&&(0,r.jsx)(y,{...e})}},74707:function(e,t,n){"use strict";n.d(t,{O:function(){return i}});var r=n(87200);function i(){let[e,t]=(0,r.useState)(!1);return(0,r.useLayoutEffect)(()=>{t(!0)},[]),e}},47365:function(e,t,n){"use strict";function r(e,t){return"*"===t||("string"==typeof t?t===e:t instanceof RegExp?t.test(e):"function"==typeof t&&t(e))}n.d(t,{p:function(){return o}});let i={preventDefault:!1,strictTarget:void 0},s={key:"*",keyCaseInsensitive:!0,code:"*",noModifiers:!1,modifiers:""};function o(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[o,l,u]=1===t.length?[document.body,{},t[0]]:2===t.length?[t[0],{},t[1]]:t,{preventDefault:a}={...i,...l},c=e=>{var t;if((null!==(t=l.strictTarget)&&void 0!==t?!!t:o===document.body)&&e.target!==o)return;let{ctrlKey:n,altKey:i,shiftKey:c,metaKey:f}=e,d={event:e,modifiers:{ctrl:n,alt:i,shift:c,meta:f}};for(let t=0,o=u.length;t<o;t++){let[o,l]=u[t],{key:y,keyCaseInsensitive:h,code:p,noModifiers:x,modifiers:m}=function(e){let t="string"==typeof e?{...s,key:e}:{...s,...e};return t.keyCaseInsensitive&&"string"==typeof t.key&&(t.key=t.key.toLowerCase()),t}(o);Object.values({key:r(h?e.key.toLowerCase():e.key,y),code:r(e.code,p),noModifiers:!x||!1===n&&!1===i&&!1===c&&!1===f,modifiers:function(e,t){let{ctrlKey:n,altKey:r,shiftKey:i,metaKey:s}=e;if("function"==typeof t)return t({ctrl:n,alt:r,shift:i,meta:s});let{ctrl:o=!1,alt:l=!1,shift:u=!1,meta:a=!1}=Object.fromEntries(t.split("-").map(e=>[e,!0]));return o===n&&l===r&&u===i&&a===s}(e,m)}).every(Boolean)&&(a&&e.preventDefault(),l(d))}};return o.addEventListener("keydown",c,{passive:!1}),{destroy:()=>{o.removeEventListener("keydown",c)}}}},30636:function(e,t,n){"use strict";n.d(t,{K:function(){return o}});var r=n(88780),i=n(32219);let s={color:"white",opacity:.5,size:[8,8],step:1,frame:!0};class o extends r.LineSegments{set(e){let{color:t,opacity:n,size:o,step:l,frame:u}={...s,...e},a=(0,i.iK)(o),c=(0,i.iK)(null!=l?l:a),f=[],d=(e,t)=>f.push(new r.Vector3(e,t,0));u&&(d(-a.x/2,+a.y/2),d(+a.x/2,+a.y/2),d(+a.x/2,+a.y/2),d(+a.x/2,-a.y/2),d(+a.x/2,-a.y/2),d(-a.x/2,-a.y/2),d(-a.x/2,-a.y/2),d(-a.x/2,+a.y/2));let y=Math.ceil(-a.x/2/c.x)*c.x;y===-a.x/2&&(y+=c.x);do d(y,-a.y/2),d(y,+a.y/2),y+=c.x;while(y<a.x/2);let h=Math.ceil(-a.y/2/c.y)*c.y;h===-a.y/2&&(h+=c.y);do d(-a.x/2,h),d(+a.x/2,h),h+=c.y;while(h<a.y/2);return this.geometry.setFromPoints(f),this.material.color.set(t),this.material.opacity=n,this.material.transparent=n<1,this}constructor(e){super(),this.set(null!=e?e:s)}}},96915:function(e){e.exports={Markdown:"md_Markdown__RP0EZ"}}},function(e){e.O(0,[9918,7512,1561,7834,6158,3956,1067,3310,5229,7619,812,2038,3420,1540,9258,4157,3977,2835,5694,2840,1744],function(){return e(e.s=87518)}),_N_E=e.O()}]);