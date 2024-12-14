(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6028],{87518:function(e,t,n){Promise.resolve().then(n.bind(n,73549))},73549:function(e,t,n){"use strict";n.d(t,{Client:function(){return E}});var i=n(32617),r=n(83119),o=n(87062),s=n(47365),l=n(15721),a=n(9258),u=n(78780),c=n(29368),f=n(5693),d=n(92948),y=n(88780),h=n(80536),p=n(30636),m=n(12042),x=n(67896),w=n(28104),v=n(6246),k=n(97219);let g=new y.Raycaster;class b extends y.Group{createAllChunkMeshes(e){for(let{superChunkIndex:t,chunkIndex:n,chunk:i}of e.enumerateChunks()){let r=v.T.pick(["#ffdd55","#55ddff","#dd55ff","#55ffdd","#ff55dd","#ddff55","#ff5555"]),o=(0,h.eO)(i.voxelFaces()),s=new m.P({color:r}),{x:l,y:a,z:c}=e.metrics.fromIndexes(t,n,0);(0,u.cY)(new y.Mesh(o,s),{parent:this,x:l,y:a,z:c})}let t=e.computeVoxelBounds();(0,u.cY)(new k.O,this).box({box3:t,asIntBox3:!0}).box({box3:e.computeChunkBounds(),asIntBox3:!0,color:"#ff0000"}).draw();{let t=e.computeVoxelBounds(),n=(0,h.eO)(e.chunkVoxelFaces(t)),i=new m.P({color:"#ffffff"});(0,u.cY)(new y.Mesh(n,i),{parent:this,x:0,y:0,z:-32})}}createOneUniqueMesh(e){}constructor(...e){super(...e),this.parts=(()=>{v.T.reset();let e=(0,u.cY)(new y.Mesh(new y.TorusKnotGeometry(10,3,32,6),new m.P({wireframe:!0,side:y.DoubleSide})),this);e.visible=!1,(0,u.cY)(new p.K({size:24}),{parent:this,rotationX:"90deg"});let t=(0,u.cY)(new x.w,this),n=new h.q3;(0,d.a)({world:n});let i=new DataView(new ArrayBuffer(n.voxelStateByteSize));i.setUint8(0,1);let r=new y.Vector3;for(let{x:t,y:o,z:s}of(0,w.loop3)(24,24,24))t-=12,o-=12,s-=12,r.set(t+.5,o+.5,s+.5),g.set(r,new y.Vector3(1,0,0)),g.intersectObject(e,!0).length%2==1&&n.setVoxelState(t,o,s,i);return this.createAllChunkMeshes(n),{sky:t}})()}}var C=n(96915),P=n.n(C);function M(){return(0,f.Ky)(function*(e){(0,d.a)({three:e});let t=new l.F({size:50,perspective:1,rotation:["-20deg","-45deg",0]});yield t.start(e.renderer.domElement),c.vB.get("three").set({minActiveDuration:60}),yield(0,c.RC)("three",n=>{let{aspect:i,camera:r}=e;t.update(r,i,n.deltaTime)}),yield(0,s.p)([[{code:"Space",modifiers:"shift"},()=>{document.body.requestFullscreen()}]]);let n=new o.n(e.scene,e.camera);n.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:100,radiusExponent:2,rings:2,samples:16}),e.pipeline.addPass(n,{type:a.GR.PostProcessing})},[]),null}function j(){return(0,f._v)("main",function*(e){(0,u.cY)(new b,e)},[]),null}function E(){return(0,i.jsx)("div",{children:(0,i.jsxs)(f.H7,{children:[(0,i.jsx)(M,{}),(0,i.jsx)(j,{}),(0,i.jsx)("div",{className:"layer thru flex flex-col p-4 gap-2",children:(0,i.jsx)(r.U,{className:P().Markdown,children:"# World\n\nWorld handles chunks under the hood.\n"})})]})})}},5693:function(e,t,n){"use strict";n.d(t,{H7:function(){return x},Ky:function(){return d},_v:function(){return y},ur:function(){return h}});var i=n(32617),r=n(87200),o=n(88780),s=n(23657),l=n(15721),a=n(9258),u=n(29368),c=n(74707);let f=(0,r.createContext)(null);function d(e,t){let n=(0,r.useContext)(f);return(0,s.sv)(async function*(t,i){if(e){let t=e(n,i);if(t&&"function"==typeof t.next)do{let{value:e,done:n}=await t.next();if(n)break;yield e}while(i.mounted)}},null!=t?t:"always"),n}function y(e,t,n){let i=(0,r.useMemo)(()=>new o.Group,[]);return i.name=e,d(async function*(e,n){if(e.scene.add(i),yield()=>{i.clear(),i.removeFromParent()},t){let r=t(i,e,n);if(r&&"function"==typeof r.next)do{let{value:e,done:t}=await r.next();if(t)break;yield e}while(n.mounted)}},n),i}function h(e){let{value:t}=e,n=(0,r.useMemo)(()=>"function"==typeof t?new t:t,[t]);return d(async function*(e){if(e.scene.add(n),"initialize"in n){let t=n.initialize(e);if(t&&"function"==typeof t.next)for(;;){let{value:e,done:n}=await t.next();if(n)break;yield e}}yield()=>{if(n.removeFromParent(),"destroy"in n){var e;null===(e=n.destroy)||void 0===e||e.call(n)}}},[n]),null}let p={className:"",assetsPath:"/",vertigoControls:!1};function m(e){let{children:t,className:n,assetsPath:o,vertigoControls:c}={...p,...e},d=(0,r.useMemo)(()=>new a.Vu,[]);d.loader.setPath(o);let{ref:y}=(0,s.Nv)({debounce:!0},function*(e,t){yield d.initialize(e.firstElementChild),t.triggerRender(),Object.assign(window,{three:d})},[]);(0,s.sv)(function*(){if(c){let e=new l.F("object"==typeof c?c:{}).initialize(y.current).start();yield e.destroy,yield(0,u.RC)("three",t=>{e.update(d.camera,d.aspect,t.deltaTime)})}},[c]);let h={position:"absolute",inset:0};return(0,i.jsx)("div",{ref:y,className:n,style:h,children:(0,i.jsxs)(f.Provider,{value:d,children:[(0,i.jsx)("div",{style:h}),(0,i.jsx)("div",{style:h,className:"thru",children:d.initialized&&t})]})})}function x(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,c.O)()&&(0,i.jsx)(m,{...t[0]})}},74707:function(e,t,n){"use strict";n.d(t,{O:function(){return r}});var i=n(87200);function r(){let[e,t]=(0,i.useState)(!1);return(0,i.useLayoutEffect)(()=>{t(!0)},[]),e}},47365:function(e,t,n){"use strict";function i(e,t){return"*"===t||("string"==typeof t?t===e:t instanceof RegExp?t.test(e):"function"==typeof t&&t(e))}n.d(t,{p:function(){return s}});let r={preventDefault:!1,strictTarget:void 0},o={key:"*",keyCaseInsensitive:!0,code:"*",noModifiers:!1,modifiers:""};function s(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[s,l,a]=1===t.length?[document.body,{},t[0]]:2===t.length?[t[0],{},t[1]]:t,{preventDefault:u}={...r,...l},c=e=>{var t;if((null!==(t=l.strictTarget)&&void 0!==t?!!t:s===document.body)&&e.target!==s)return;let{ctrlKey:n,altKey:r,shiftKey:c,metaKey:f}=e,d={event:e,modifiers:{ctrl:n,alt:r,shift:c,meta:f}};for(let t=0,s=a.length;t<s;t++){let[s,l]=a[t],{key:y,keyCaseInsensitive:h,code:p,noModifiers:m,modifiers:x}=function(e){let t="string"==typeof e?{...o,key:e}:{...o,...e};return t.keyCaseInsensitive&&"string"==typeof t.key&&(t.key=t.key.toLowerCase()),t}(s);Object.values({key:i(h?e.key.toLowerCase():e.key,y),code:i(e.code,p),noModifiers:!m||!1===n&&!1===r&&!1===c&&!1===f,modifiers:function(e,t){let{ctrlKey:n,altKey:i,shiftKey:r,metaKey:o}=e;if("function"==typeof t)return t({ctrl:n,alt:i,shift:r,meta:o});let{ctrl:s=!1,alt:l=!1,shift:a=!1,meta:u=!1}=Object.fromEntries(t.split("-").map(e=>[e,!0]));return s===n&&l===i&&a===r&&u===o}(e,x)}).every(Boolean)&&(u&&e.preventDefault(),l(d))}};return s.addEventListener("keydown",c,{passive:!1}),{destroy:()=>{s.removeEventListener("keydown",c)}}}},30636:function(e,t,n){"use strict";n.d(t,{K:function(){return s}});var i=n(88780),r=n(32219);let o={color:"white",opacity:.5,size:[8,8],step:1,frame:!0};class s extends i.LineSegments{set(e){let{color:t,opacity:n,size:s,step:l,frame:a}={...o,...e},u=(0,r.iK)(s),c=(0,r.iK)(null!=l?l:u),f=[],d=(e,t)=>f.push(new i.Vector3(e,t,0));a&&(d(-u.x/2,+u.y/2),d(+u.x/2,+u.y/2),d(+u.x/2,+u.y/2),d(+u.x/2,-u.y/2),d(+u.x/2,-u.y/2),d(-u.x/2,-u.y/2),d(-u.x/2,-u.y/2),d(-u.x/2,+u.y/2));let y=Math.ceil(-u.x/2/c.x)*c.x;y===-u.x/2&&(y+=c.x);do d(y,-u.y/2),d(y,+u.y/2),y+=c.x;while(y<u.x/2);let h=Math.ceil(-u.y/2/c.y)*c.y;h===-u.y/2&&(h+=c.y);do d(-u.x/2,h),d(+u.x/2,h),h+=c.y;while(h<u.y/2);return this.geometry.setFromPoints(f),this.material.color.set(t),this.material.opacity=n,this.material.transparent=n<1,this}constructor(e){super(),this.set(null!=e?e:o)}}},96915:function(e){e.exports={Markdown:"md_Markdown__RP0EZ"}}},function(e){e.O(0,[6321,7512,1561,7834,6158,3956,1067,3310,5229,7619,812,3420,1540,6567,8100,9258,5721,1174,2835,5694,2840,1744],function(){return e(e.s=87518)}),_N_E=e.O()}]);