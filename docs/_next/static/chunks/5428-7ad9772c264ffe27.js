(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5428],{49959:function(e,t,n){"use strict";n.d(t,{AB:function(){return h},X5:function(){return o},lx:function(){return v}});var r,o,i=n(2132),s=n(88780),a=n(38794),l=n(27834);function c(e,t){let n=new s.BufferAttribute(new Int8Array(e.attributes.position.count).fill(t),1);e.setAttribute("aPartId",n)}function u(e,t,n){let r=new s.ConeGeometry(.2,.6000000000000001,e,n,!0).rotateZ(Math.PI).translate(0,.53,0),o=Array.from({length:t},(e,n)=>{let r=n/(t-1);return new s.Vector2(.2*r,-.05*(1-r**2))}),i=new s.LatheGeometry(o,e).rotateZ(Math.PI).translate(0,.2*3/2+.53,0);return(0,l.n4)([r,i],!1)}function d(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"low",t="high"===e?(0,l.$1)(new a.k(.3,.3,.3,4,.05)):new s.BoxGeometry(.3,.3,.3);c(t,0);let n="high"===e?u(32,8,5):u(6,2,1);c(n,3);let r=n.clone().rotateX(Math.PI);c(r,4);let o=n.clone().rotateZ(-Math.PI/2);c(o,1);let i=n.clone().rotateZ(Math.PI/2);c(i,2);let d=n.clone().rotateX(Math.PI/2);c(d,5);let h=n.clone().rotateX(-Math.PI/2);return c(h,6),[t,o,i,n,r,d,h]}(r=o||(o={}))[r.BOX=0]="BOX",r[r.POSITIVE_X=1]="POSITIVE_X",r[r.NEGATIVE_X=2]="NEGATIVE_X",r[r.POSITIVE_Y=3]="POSITIVE_Y",r[r.NEGATIVE_Y=4]="NEGATIVE_Y",r[r.POSITIVE_Z=5]="POSITIVE_Z",r[r.NEGATIVE_Z=6]="NEGATIVE_Z";let h={defaultColor:"white",xColor:"#eb1640",yColor:"#00ffb7",zColor:"#3b80e7",hoverColor:"#fffc47"};function p(e){let{defaultColor:t,xColor:n,yColor:r,zColor:o,hoverColor:i}={...h,...e},a=new s.Color(t),l=new s.Color(n),c=new s.Color(r),u=new s.Color(o),d=new s.Color(i),p={uSunPosition:{value:new s.Vector3(.5,.7,.3)},uLuminosity:{value:.66},uColors:{value:[a,l,a,c,a,u,a]},uHoverColor:{value:d},uOpacity:{value:[1,1,1,1,1,1,1]},uHoverOpacity:{value:[0,0,0,0,0,0,0]}};return new s.ShaderMaterial({uniforms:p,vertexShader:"\nuniform vec3 uColors[7];\nuniform float uOpacity[7];\nuniform vec3 uHoverColor;\nuniform float uHoverOpacity[7];\n\nattribute float aPartId;\n\nvarying vec3 vWorldNormal;\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying float vOpacity;\nvarying float vHoverOpacity;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vPosition = position;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  vColor = uColors[int(aPartId)];\n  vOpacity = uOpacity[int(aPartId)];\n  vHoverOpacity = uHoverOpacity[int(aPartId)];\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying float vOpacity;\nvarying float vHoverOpacity;\n\nuniform vec3 uSunPosition;\nuniform float uLuminosity;\nuniform vec3 uHoverColor;\n\nfloat clamp01(float x) {\n  return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;\n}\n\nfloat inverseLerp(float a, float b, float x) {\n  return clamp01((x - a) / (b - a));\n}\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  \n  float minLuminosity = max(pow(vHoverOpacity, 1.0 / 3.0) * 0.85, uLuminosity);\n  light = mix(minLuminosity, 1.0, light);\n\n  vec3 color = vColor;\n  color = mix(color, uHoverColor, vHoverOpacity);\n  gl_FragColor = vec4(color * light, vOpacity);\n}\n",transparent:!0})}let g=new s.Raycaster;class v extends s.Group{getHovered(){return this.internal.hovered}getPressed(){return this.internal.pressed}widgetUpdate(e,t,n){let r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1/60,{lowMesh:o,material:a}=this.parts,l=new s.Vector3;n.getWorldDirection(l);let c=this.matrixWorld.elements,u=new s.Vector3(c[0],c[1],c[2]),d=new s.Vector3(c[4],c[5],c[6]),h=new s.Vector3(c[8],c[9],c[10]);{let e=a.uniforms.uOpacity.value,t=Math.abs(l.dot(u)),n=Math.abs(l.dot(d)),o=Math.abs(l.dot(h));e[1]=e[2]=(0,i.Lj)(e[1],t<.98?1.05:-.05,1e-4,r),e[3]=e[4]=(0,i.Lj)(e[3],n<.98?1.05:-.05,1e-4,r),e[5]=e[6]=(0,i.Lj)(e[5],o<.98?1.05:-.05,1e-4,r)}{let e=a.uniforms.uHoverOpacity.value,t=0===this.internal.hovered?1:0,n=1===this.internal.hovered?1:0,o=2===this.internal.hovered?1:0,s=3===this.internal.hovered?1:0,l=4===this.internal.hovered?1:0,c=5===this.internal.hovered?1:0,u=6===this.internal.hovered?1:0;e[0]=(0,i.Lj)(e[0],t,1e-4,r),e[1]=(0,i.Lj)(e[1],n,1e-4,r),e[2]=(0,i.Lj)(e[2],o,1e-4,r),e[3]=(0,i.Lj)(e[3],s,1e-4,r),e[4]=(0,i.Lj)(e[4],l,1e-4,r),e[5]=(0,i.Lj)(e[5],c,1e-4,r),e[6]=(0,i.Lj)(e[6],u,1e-4,r)}g.setFromCamera(e,n);let[p]=g.intersectObject(o,!0).map(e=>{let t=3*e.faceIndex;return o.geometry.groups.findIndex(e=>e.start<=t&&t<e.start+e.count)}).filter(e=>a.uniforms.uOpacity.value[e]>.5);t&&!1===this.internal.pointerDown&&(this.internal.pointerDown=!0,this.internal.pointerDownPosition.copy(e),this.internal.pressed=null!=p?p:null),t&&!1===this.internal.dragging&&this.internal.pointerDownPosition.distanceTo(e)>.01&&(this.internal.dragging=!0),!1===t&&this.internal.pointerDown&&(this.internal.pointerDown=!1,this.internal.dragging=!1,this.internal.pressed=null);let v=this.internal.dragging?null:null!=p?p:null;this.internal.hovered,this.internal.hovered=v}constructor(e){super(),this.internal={pointerPosition:new s.Vector2,pointerDownPosition:new s.Vector2,pointerDown:!1,dragging:!1,hovered:null,pressed:null};let t=p(null==e?void 0:e.material),n=d("high").map((e,n)=>{let r=new s.Mesh(e,t);return r.name="vertigo-widget-mesh-".concat(n),this.add(r),r}),r=new s.Mesh(function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let r=d(...t);return(0,l.n4)(r,!0)}("low"),p(null==e?void 0:e.material));r.material.transparent=!1,r.name="vertigo-widget-low-mesh",r.visible=!1,this.add(r),this.parts={material:t,meshes:n,lowMesh:r}}}},15428:function(e,t,n){"use strict";n.d(t,{Client:function(){return _}});var r=n(32617),o=n(63690),i=n(87200),s=n(88780),a=n(38794),l=n(51600),c=n(81540),u=n(97809),d=n(23657),h=n(81219),p=n(62274),g=n(97219);class v extends g.O{constructor(e,{color:t="#ffff00"}={}){let n;super(void 0,new s.LineBasicMaterial({color:t})),this.position.copy(e.focus),this.rotation.copy(e.rotation);let{x:r,y:o}=e.size;1!==e.zoom&&this.rectangle([-r/2,-o/2,r,o]),r/=e.zoom,o/=e.zoom,this.rectangle([-r/2,-o/2,r,o]).plus([0,0],.5).draw();let i=new s.Mesh(new s.PlaneGeometry(1,.25),new s.MeshBasicMaterial({color:t,alphaMap:null!=n?n:n=(()=>{let e=document.createElement("canvas"),t=e.getContext("2d");e.width=1024,e.height=256,t.fillStyle="white",t.font="200px Fira Code",t.textBaseline="top",t.fillText("Vertigo",20,20);let n=new s.Texture(e);return n.needsUpdate=!0,n})(),transparent:!0,side:s.DoubleSide}));i.position.set(-r/2+.5+.1,o/2-.125-.1,0),this.add(i)}}var w=n(12042),m=n(78780),f=n(54157),y=n(6246),x=n(96672),b=n(29368),V=n(30636),P=n(67896),C=n(49959);class T extends s.Group{onTick(e){this.parts.rings.rotation.y+=.123*e.deltaTime,this.parts.rings.rotation.x+=.435*e.deltaTime}constructor(...e){super(...e),this.internal={ringGeometry:new s.TorusGeometry(3,.01,16,128)},this.parts=(()=>{let e=(0,m.cY)(new s.Group,{parent:this}),t=(0,m.cY)(new s.Mesh(this.internal.ringGeometry,new w.P({color:"#eb1640",luminosity:.8})),{parent:e,name:"ring-x",rotationY:"90deg"}),n=(0,m.cY)(new s.Mesh(this.internal.ringGeometry,new w.P({color:"#00ff9d",luminosity:.8})),{parent:e,name:"ring-y",rotationX:"90deg"}),r=(0,m.cY)(new s.Mesh(this.internal.ringGeometry,new w.P({color:"#3b80e7",luminosity:.8})),{parent:e,name:"ring-z"});return{rings:e,ringX:t,ringY:n,ringZ:r,torusKnot:(0,m.cY)(new s.Mesh(new s.TorusKnotGeometry(3,.1,512,64),new w.P({luminosity:.8})),{parent:this,name:"torus-knot"})}})()}}class I extends s.Scene{constructor(...e){super(...e),this.parts={sky:(0,m.cY)(new P.w({color:"#027bff"}),{parent:this}),thing:(0,m.cY)(new T,{parent:this}),gridZ:(0,m.cY)(new V.K({step:.5}),{parent:this}),widget:(0,m.cY)(new C.lx,{parent:this})}}}class O extends s.ShaderMaterial{constructor(){super({uniforms:{uResolution:{value:new s.Vector4},uRect:{value:new s.Vector4},map:{value:null}},vertexShader:"\n        uniform vec4 uResolution;\n        uniform vec4 uRect;\n        varying vec2 vUv;\n        void main() {\n          vUv = uv;\n          gl_Position.xy = ((position.xy * 2.0 + 1.0) * uRect.zw + uRect.xy * 2.0) / uResolution.xy - 1.0; \n          gl_Position.z = 0.0;\n          gl_Position.w = 1.0;\n          // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n        }\n      ",fragmentShader:"\n        uniform sampler2D map;\n        varying vec2 vUv;\n        void main() {\n          gl_FragColor = texture2D(map, vUv);\n        }\n      ",transparent:!0,depthWrite:!1,depthTest:!1})}}class z extends s.Mesh{*initialize(e,t){let{rt:n,scene:r,camera:o,vertigo:i,widget:a}=this.internal,l=this.material.uniforms.uResolution.value,u=this.material.uniforms.uRect.value,d=new s.Vector2,h=new s.Vector2(-1,-1),p=!1;yield(0,c.w)(e.domElement,{onDown:()=>{p=!0},onUp:()=>{p=!1},onChange:e=>{h.x=(e.localPosition.x-u.x)/u.z*2-1,h.y=-(e.localPosition.y/u.w*2-1)},onTap:()=>{switch(a.getPressed()){case C.X5.BOX:t.actions.togglePerspective();break;case C.X5.POSITIVE_X:t.actions.positiveXAlign();break;case C.X5.NEGATIVE_X:t.actions.negativeXAlign();break;case C.X5.POSITIVE_Y:t.actions.positiveYAlign();break;case C.X5.NEGATIVE_Y:t.actions.negativeYAlign();break;case C.X5.POSITIVE_Z:t.actions.positiveZAlign();break;case C.X5.NEGATIVE_Z:t.actions.negativeZAlign()}}}),yield(0,b.RC)("three",{order:1},()=>{e.getSize(d),l.set(d.x,d.y,e.getPixelRatio(),0),u.x=d.x-u.z,u.y=d.y-u.w,i.rotation.copy(t.vertigo.rotation),i.perspective=t.vertigo.perspective,i.apply(o,1),a.widgetUpdate(h,p,o),h.x>=-1&&h.x<=1&&h.y>=-1&&h.y<=1&&(null!==a.getHovered()?document.body.style.cursor="pointer":document.body.style.removeProperty("cursor")),e.setRenderTarget(n),e.setClearColor("white",0),e.render(r,o),e.setRenderTarget(null)})}constructor({planeSize:e=120}={}){let t=new O;super(new s.PlaneGeometry(1,1),t),this.vertigoControls=null;let n=2*e,r=new s.WebGLRenderTarget(n,n,{format:s.RGBAFormat,colorSpace:"srgb"}),o=new s.Scene,i=new s.PerspectiveCamera,a=new h.a({perspective:1,size:[2.8,2.8]}),l=new C.lx;o.add(l),this.internal={rt:r,scene:o,camera:i,vertigo:a,widget:l},this.renderOrder=1,this.frustumCulled=!1,t.uniforms.map.value=this.internal.rt.texture,t.uniforms.uRect.value.set(10,10,e,e),this.position.x=2}}var M=n(80591),E=n.n(M);function S(e){let{vertigo:t}=e,{ref:n}=(0,d.sv)(function*(e){yield(0,b.RC)("three",{timeInterval:1/6},()=>{e.querySelector("pre").textContent=o.ZP.dump(t.toDeclaration(),{flowLevel:1}).replace(/-?\d+\.\d+/g,e=>(0,x.uf)(Number.parseFloat(e),{maxDigits:6}))})},[]);return(0,r.jsx)("div",{ref:n,className:"self-start p-4 border border-white rounded text-xs ".concat(E().BgBlur),style:{minWidth:"24rem"},children:(0,r.jsx)("pre",{})})}class A extends s.Group{onTick(e){for(let t of this.parts.cubes){let{angularVelocity:n}=t.userData;t.rotation.x+=n.x*e.deltaTime,t.rotation.y+=n.y*e.deltaTime,t.rotation.z+=n.z*e.deltaTime}}constructor(...e){super(...e),this.parts={knot:(0,m.cY)(new s.Mesh(new s.TorusKnotGeometry(1,.5,256,32),new w.P),{parent:this}),knot2:(0,m.cY)(new s.Mesh(new s.TorusKnotGeometry(1.37,.05,256,32),new w.P({color:C.AB.xColor})),{parent:this}),cubes:Array.from({length:20},(e,t)=>{let n=y.T.between(-3,3),r=y.T.between(-1.5,1.5),o=y.T.between(-3,3),i=["".concat(y.T.between(0,360),"deg"),"".concat(y.T.between(0,360),"deg"),"".concat(y.T.between(0,360),"deg")],l=y.T.between(.5,1),c=(0,m.cY)(new s.Mesh(new a.k(1),new w.P({color:y.T.pick(Object.values(C.AB))})),{parent:this,x:n,y:r,z:o,rotation:i,scaleScalar:l}),u=new s.Euler(y.T.between(-1,1),y.T.between(-1,1),y.T.between(-1,1));return c.userData={angularVelocity:u},c})}}}function _(){let e=(0,i.useMemo)(()=>{let e=new h.a({size:[4.2,4.2]}),t=new h.a({perspective:0,focus:[-10,3,0],size:[8,4],rotation:[0,"45deg",0]}),n=t.clone().set({perspective:1,size:t.size.clone().multiplyScalar(1.2)}),r=t.clone().set({perspective:1,size:t.size.clone().multiplyScalar(1.5),rotation:[0,"-15deg","-25deg"]}),o=new h.a({perspective:1,focus:[-4.5,1.8,10],size:[12,9],rotation:["-3deg","1deg","12deg"]}),i=new h.a({perspective:1,focus:[-4.5,1.8,14],size:o.size.clone().multiplyScalar(1.5),rotation:["-3deg","1deg","0deg"]}),s={main:e,a0:t,a1:n,a2:r,back:o,back2:i,zoom:new h.a({focus:[6,-4,0],size:[4,4],zoom:.25}),revert:new h.a({rotation:["12.6deg","145.3deg","0deg"],focus:[-5,-.5,3.6],size:[12,12],fov:"60deg"})},a=new p.F(s.main);return{vertigos:s,vertigoControls:a}},[]),{ref:t}=(0,d.sv)(function*(t){let{vertigoControls:n}=e,r=new s.WebGLRenderer({antialias:!0});r.outputColorSpace="srgb",t.prepend(r.domElement);let o=1;yield(0,u.f)(t,{onSize:()=>{r.setPixelRatio(window.devicePixelRatio),r.setSize(t.clientWidth,t.clientHeight),o=t.clientWidth/t.clientHeight}});let i=new s.PerspectiveCamera(75,1,.1,1e3);i.position.z=5,yield n.start(r.domElement);let a=new I,d=b.vB.get("three");(0,l.s)(d.requestActivation);let h=new z;a.add(h),yield*h.initialize(r,n);let p=new s.Vector2,g=!1;for(let t of(yield d.onTick(e=>{e.propagate(a),a.parts.widget.widgetUpdate(p,g,i),null!==a.parts.widget.getHovered()?document.body.style.cursor="pointer":document.body.style.removeProperty("cursor"),n.update(i,o),r.render(a,i)}),yield(0,c.w)(r.domElement,{onChange:e=>{let{x:t,y:n}=e.relativeLocalPosition;p.set(2*t-1,-((2*n-1)*1))},onDown:()=>{g=!0},onUp:()=>{g=!1},onTap:()=>{let e=a.parts.widget.getPressed();switch(null!==e&&n.actions.focus([0,0,0]),e){case C.X5.BOX:n.actions.togglePerspective();break;case C.X5.POSITIVE_X:n.actions.positiveXAlign();break;case C.X5.NEGATIVE_X:n.actions.negativeXAlign();break;case C.X5.POSITIVE_Y:n.actions.positiveYAlign();break;case C.X5.NEGATIVE_Y:n.actions.negativeYAlign();break;case C.X5.POSITIVE_Z:n.actions.positiveZAlign();break;case C.X5.NEGATIVE_Z:n.actions.negativeZAlign()}}}),Object.values(e.vertigos)))(0,m.cY)(new v(t),a);let w=new A;a.add(w),w.position.copy(e.vertigos.a0.focus),w.rotation.copy(e.vertigos.a0.rotation),yield()=>{r.dispose(),t.removeChild(r.domElement)}},[]),{vertigoControls:n}=e;return(0,r.jsx)("div",{ref:t,className:"".concat(E().VertigoWidgetClient," layer thru"),children:(0,r.jsxs)("div",{className:"layer thru p-4 flex flex-col gap-4 items-start",children:[(0,r.jsx)("h1",{className:"text-2xl self-start",children:"Vertigo-widget"}),(0,r.jsxs)("div",{className:"".concat(E().BgBlur," thru flex flex-col gap-1 items-start p-1 border border-white rounded"),style:{width:"min(200px, 30%)"},children:[(0,r.jsx)("h2",{children:"Actions:"}),(0,r.jsxs)("div",{className:"thru flex flex-row flex-wrap items-start gap-1",children:[(0,r.jsx)("button",{className:"".concat(E().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{f.fw.tween({target:n.vertigo,duration:1,ease:"inOut2",to:{perspective:0}})},children:"ortho"}),(0,r.jsx)("button",{className:"".concat(E().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{f.fw.tween({target:n.vertigo,duration:1,ease:"inOut2",to:{perspective:1}})},children:"pers:1"}),(0,r.jsx)("button",{className:"".concat(E().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{f.fw.tween({target:n.vertigo,duration:1,ease:"inOut2",to:{perspective:1.5}})},children:"pers:1.5"}),(0,r.jsx)("button",{className:"".concat(E().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{f.fw.tween({target:n.vertigo,duration:1,ease:"inOut2",to:{zoom:1}})},children:"zoom:1"}),(0,r.jsx)("button",{className:"".concat(E().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{f.fw.tween({target:n.vertigo,duration:.75,ease:"inOut2",to:{focus:new s.Vector3}})},children:"focus:(0,0,0)"})]})]}),(0,r.jsxs)("div",{className:"".concat(E().BgBlur," thru flex flex-col gap-1 items-start p-1 border border-white rounded"),style:{width:"min(200px, 30%)"},children:[(0,r.jsx)("h2",{children:"Presets:"}),(0,r.jsx)("div",{className:"flex flex-row gap-1 flex-wrap",children:Object.entries(e.vertigos).map(t=>{let[n,o]=t;return(0,r.jsx)("button",{className:"".concat(E().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{let t=e.vertigoControls.vertigo.clone();f.fw.during(1).onUpdate(n=>{let{progress:r}=n,i=f.fw.ease("inOut3")(r);e.vertigoControls.vertigo.lerpVertigos(t,o,i)})},children:n},n)})})]}),(0,r.jsx)("div",{className:"Space flex-1 pointer-events-none"}),(0,r.jsx)(S,{vertigo:n.vertigo})]})})}},97809:function(e,t,n){"use strict";let r;n.d(t,{f:function(){return a}});let o=new WeakMap,i=(r=()=>{let e=new WeakMap;return{resizeObserver:new ResizeObserver(t=>{for(let r of t){var n;null===(n=e.get(r.target))||void 0===n||n(r)}}),resizeObserverMap:e}},()=>{let e=o.get(r);if(void 0===e){let e=r();return o.set(r,e),e}return e});class s{get aspect(){return this.size.x/this.size.y}constructor(e,t){this.element=e,this.size=t}}function a(e,t){let{onSize:n}=function(e){if("function"==typeof e)return{onSize:e};let{onSize:t=()=>{}}=null!=e?e:{};return{onSize:t}}(t),r=new DOMPoint(0,0);if(e instanceof Window){let t=()=>{r.x=window.innerWidth,r.y=window.innerHeight,n(new s(e,r))};return e.addEventListener("resize",t),t(),{destroy:()=>{e.removeEventListener("resize",t)}}}{let{resizeObserver:t,resizeObserverMap:o}=i();return t.observe(e),o.set(e,t=>{r.x=t.contentRect.width,r.y=t.contentRect.height,n(new s(e,r))}),{destroy:()=>t.unobserve(e)}}}},30636:function(e,t,n){"use strict";n.d(t,{K:function(){return s}});var r=n(88780),o=n(32219);let i={color:"white",opacity:.5,size:[8,8],step:1,frame:!0};class s extends r.LineSegments{set(e){let{color:t,opacity:n,size:s,step:a,frame:l}={...i,...e},c=(0,o.iK)(s),u=(0,o.iK)(null!=a?a:c),d=[],h=(e,t)=>d.push(new r.Vector3(e,t,0));l&&(h(-c.x/2,+c.y/2),h(+c.x/2,+c.y/2),h(+c.x/2,+c.y/2),h(+c.x/2,-c.y/2),h(+c.x/2,-c.y/2),h(-c.x/2,-c.y/2),h(-c.x/2,-c.y/2),h(-c.x/2,+c.y/2));let p=Math.ceil(-c.x/2/u.x)*u.x;p===-c.x/2&&(p+=u.x);do h(p,-c.y/2),h(p,+c.y/2),p+=u.x;while(p<c.x/2);let g=Math.ceil(-c.y/2/u.y)*u.y;g===-c.y/2&&(g+=u.y);do h(-c.x/2,g),h(+c.x/2,g),g+=u.y;while(g<c.y/2);return this.geometry.setFromPoints(d),this.material.color.set(t),this.material.opacity=n,this.material.transparent=n<1,this}constructor(e){super(),this.set(null!=e?e:i)}}},97219:function(e,t,n){"use strict";n.d(t,{O:function(){return u}});var r=n(88780),o=n(23420),i=n(32219);let s=new r.Vector2,a=new r.Vector3,l=new r.Matrix4;function c(e,t,n){if(null==n?void 0:n.transform)for(let e of((0,i.Xe)(n.transform,l),t))e.applyMatrix4(l);(null==n?void 0:n.color)&&e.colors.set(e.points.length,new r.Color(n.color)),e.points.push(...t)}class u extends r.LineSegments{showOccludedLines(){let{opacity:e=.2}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=new r.LineBasicMaterial({color:this.material.color,transparent:!0,depthFunc:r.GreaterDepth,opacity:e}),n=new r.LineSegments(this.geometry,t);return this.add(n),this}clear(){return this.points.length=0,this.colors.clear(),this.geometry.setFromPoints([new r.Vector3,new r.Vector3]),this}draw(){if(this.geometry.setFromPoints(this.points),this.geometry.computeBoundingSphere(),this.material.vertexColors=this.colors.size>0,this.material.needsUpdate=!0,this.colors.size>0){var e;let t=new r.Color(null!==(e=this.colors.get(0))&&void 0!==e?e:"white"),n=this.points.length,o=function(e){let t=e.attributes.color;if(t)return t;{let t=new r.BufferAttribute(new Float32Array(3*e.attributes.position.count),3);return e.setAttribute("color",t),t}}(this.geometry);for(let e=0;e<n;e++){let n=this.colors.get(e);n&&t.copy(n),o.setXYZ(e,t.r,t.g,t.b)}}return this}line(e,t,n){return c(this,[(0,i.Q7)(e),(0,i.Q7)(t)],n),this}polygon(e,t){let n=e.map(e=>(0,i.Q7)(e)),r=[];for(let e=0;e<n.length;e++)r.push(n[e],n[(e+1)%n.length]);return c(this,r,t),this}polyline(e,t){let n=e.map(e=>(0,i.Q7)(e)),r=[];for(let e=0;e<n.length-1;e++)r.push(n[e],n[e+1]);return c(this,r,t),this}circle(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let{x:o,y:a,radius:l,segments:d,...h}={...u.circleDefaultOptions,...(()=>{if(t.length>1){let[e,n,r]=t,{x:o,y:a}=(0,i.iK)(e,s);return{x:o,y:a,radius:n,...r}}return t[0]})()},p=new r.Vector3(1,0,0),g=new r.Vector3(0,1,0),v=[];for(let e=0;e<d;e++){let t=e/d*Math.PI*2,n=(e+1)/d*Math.PI*2,i=Math.cos(t)*l,s=Math.sin(t)*l,c=Math.cos(n)*l,u=Math.sin(n)*l,h=new r.Vector3(o,a,0).addScaledVector(p,i).addScaledVector(g,s),w=new r.Vector3(o,a,0).addScaledVector(p,c).addScaledVector(g,u);v.push(h,w)}return c(this,v,h),this}rectangle(e,t){let{centerX:n,centerY:i,width:s,height:a}=o.Ae.from(e),l=s/2,u=a/2,d=new r.Vector3(n-l,i-u,0),h=new r.Vector3(n+l,i-u,0),p=new r.Vector3(n+l,i+u,0),g=new r.Vector3(n-l,i+u,0);return c(this,[d,h,h,p,p,g,g,d],t),this}box(){let{center:e=[0,0,0],size:t=1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{x:n,y:o,z:s}=(0,i.Q7)(e,a),{x:l,y:c,z:u}=(0,i.Q7)(t,a),d=l/2,h=c/2,p=u/2,g=new r.Vector3(n-d,o-h,s-p),v=new r.Vector3(n+d,o-h,s-p),w=new r.Vector3(n+d,o+h,s-p),m=new r.Vector3(n-d,o+h,s-p),f=new r.Vector3(n-d,o-h,s+p),y=new r.Vector3(n+d,o-h,s+p),x=new r.Vector3(n+d,o+h,s+p),b=new r.Vector3(n-d,o+h,s+p);return this.points.push(g,v,v,w,w,m,m,g),this.points.push(f,y,y,x,x,b,b,f),this.points.push(g,f,v,y,w,x,m,b),this}plus(e,t,n){let o=t/2,{x:a,y:l}=(0,i.iK)(e,s),u=new r.Vector3(a-o,l,0);return c(this,[u,new r.Vector3(a+o,l,0),new r.Vector3(a,l-o,0),new r.Vector3(a,l+o,0)],n),this}cross(e,t,n){let o=t/2,{x:a,y:l}=(0,i.iK)(e,s),u=new r.Vector3(a-o,l-o,0);return c(this,[u,new r.Vector3(a+o,l+o,0),new r.Vector3(a-o,l+o,0),new r.Vector3(a+o,l-o,0)],n),this}constructor(...e){super(...e),this.points=[],this.colors=new Map}}u.circleDefaultOptions={x:0,y:0,radius:.5,segments:96}},80591:function(e){e.exports={VertigoWidgetClient:"vertigo_VertigoWidgetClient__tDfOf",BgBlur:"vertigo_BgBlur__WC2S2"}}}]);