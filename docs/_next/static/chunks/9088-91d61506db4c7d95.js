(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9088],{4499:function(e,t,n){"use strict";n.d(t,{AB:function(){return h},X5:function(){return o},lx:function(){return v}});var r,o,i=n(77552),s=n(52471),a=n(30035),l=n(66666);function c(e,t){let n=new s.BufferAttribute(new Int8Array(e.attributes.position.count).fill(t),1);e.setAttribute("aPartId",n)}function u(e,t,n){let r=new s.ConeGeometry(.2,.6000000000000001,e,n,!0).rotateZ(Math.PI).translate(0,.53,0),o=Array.from({length:t},(e,n)=>{let r=n/(t-1);return new s.Vector2(.2*r,-.05*(1-r**2))}),i=new s.LatheGeometry(o,e).rotateZ(Math.PI).translate(0,.2*3/2+.53,0);return(0,l.n4)([r,i],!1)}function d(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"low",t="high"===e?(0,l.$1)(new a.k(.3,.3,.3,4,.05)):new s.BoxGeometry(.3,.3,.3);c(t,0);let n="high"===e?u(32,8,5):u(6,2,1);c(n,3);let r=n.clone().rotateX(Math.PI);c(r,4);let o=n.clone().rotateZ(-Math.PI/2);c(o,1);let i=n.clone().rotateZ(Math.PI/2);c(i,2);let d=n.clone().rotateX(Math.PI/2);c(d,5);let h=n.clone().rotateX(-Math.PI/2);return c(h,6),[t,o,i,n,r,d,h]}(r=o||(o={}))[r.BOX=0]="BOX",r[r.POSITIVE_X=1]="POSITIVE_X",r[r.NEGATIVE_X=2]="NEGATIVE_X",r[r.POSITIVE_Y=3]="POSITIVE_Y",r[r.NEGATIVE_Y=4]="NEGATIVE_Y",r[r.POSITIVE_Z=5]="POSITIVE_Z",r[r.NEGATIVE_Z=6]="NEGATIVE_Z";let h={defaultColor:"white",xColor:"#eb1640",yColor:"#00ffb7",zColor:"#3b80e7",hoverColor:"#fffc47"};function f(e){let{defaultColor:t,xColor:n,yColor:r,zColor:o,hoverColor:i}={...h,...e},a=new s.Color(t),l=new s.Color(n),c=new s.Color(r),u=new s.Color(o),d=new s.Color(i),f={uSunPosition:{value:new s.Vector3(.5,.7,.3)},uLuminosity:{value:.66},uColors:{value:[a,l,a,c,a,u,a]},uHoverColor:{value:d},uOpacity:{value:[1,1,1,1,1,1,1]},uHoverOpacity:{value:[0,0,0,0,0,0,0]}};return new s.ShaderMaterial({uniforms:f,vertexShader:"\nuniform vec3 uColors[7];\nuniform float uOpacity[7];\nuniform vec3 uHoverColor;\nuniform float uHoverOpacity[7];\n\nattribute float aPartId;\n\nvarying vec3 vWorldNormal;\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying float vOpacity;\nvarying float vHoverOpacity;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vPosition = position;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  vColor = uColors[int(aPartId)];\n  vOpacity = uOpacity[int(aPartId)];\n  vHoverOpacity = uHoverOpacity[int(aPartId)];\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying float vOpacity;\nvarying float vHoverOpacity;\n\nuniform vec3 uSunPosition;\nuniform float uLuminosity;\nuniform vec3 uHoverColor;\n\nfloat clamp01(float x) {\n  return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;\n}\n\nfloat inverseLerp(float a, float b, float x) {\n  return clamp01((x - a) / (b - a));\n}\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  \n  float minLuminosity = max(pow(vHoverOpacity, 1.0 / 3.0) * 0.85, uLuminosity);\n  light = mix(minLuminosity, 1.0, light);\n\n  vec3 color = vColor;\n  color = mix(color, uHoverColor, vHoverOpacity);\n  gl_FragColor = vec4(color * light, vOpacity);\n}\n",transparent:!0})}let p=new s.Raycaster;class v extends s.Group{getHovered(){return this.internal.hovered}getPressed(){return this.internal.pressed}widgetUpdate(e,t,n){let r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1/60,{lowMesh:o,material:a}=this.parts,l=new s.Vector3;n.getWorldDirection(l);let c=this.matrixWorld.elements,u=new s.Vector3(c[0],c[1],c[2]),d=new s.Vector3(c[4],c[5],c[6]),h=new s.Vector3(c[8],c[9],c[10]);{let e=a.uniforms.uOpacity.value,t=Math.abs(l.dot(u)),n=Math.abs(l.dot(d)),o=Math.abs(l.dot(h));e[1]=e[2]=(0,i.Lj)(e[1],t<.98?1.05:-.05,1e-4,r),e[3]=e[4]=(0,i.Lj)(e[3],n<.98?1.05:-.05,1e-4,r),e[5]=e[6]=(0,i.Lj)(e[5],o<.98?1.05:-.05,1e-4,r)}{let e=a.uniforms.uHoverOpacity.value,t=0===this.internal.hovered?1:0,n=1===this.internal.hovered?1:0,o=2===this.internal.hovered?1:0,s=3===this.internal.hovered?1:0,l=4===this.internal.hovered?1:0,c=5===this.internal.hovered?1:0,u=6===this.internal.hovered?1:0;e[0]=(0,i.Lj)(e[0],t,1e-4,r),e[1]=(0,i.Lj)(e[1],n,1e-4,r),e[2]=(0,i.Lj)(e[2],o,1e-4,r),e[3]=(0,i.Lj)(e[3],s,1e-4,r),e[4]=(0,i.Lj)(e[4],l,1e-4,r),e[5]=(0,i.Lj)(e[5],c,1e-4,r),e[6]=(0,i.Lj)(e[6],u,1e-4,r)}p.setFromCamera(e,n);let[f]=p.intersectObject(o,!0).map(e=>{let t=3*e.faceIndex;return o.geometry.groups.findIndex(e=>e.start<=t&&t<e.start+e.count)}).filter(e=>a.uniforms.uOpacity.value[e]>.5);t&&!1===this.internal.pointerDown&&(this.internal.pointerDown=!0,this.internal.pointerDownPosition.copy(e),this.internal.pressed=null!=f?f:null),t&&!1===this.internal.dragging&&this.internal.pointerDownPosition.distanceTo(e)>.01&&(this.internal.dragging=!0),!1===t&&this.internal.pointerDown&&(this.internal.pointerDown=!1,this.internal.dragging=!1,this.internal.pressed=null);let v=this.internal.dragging?null:null!=f?f:null;this.internal.hovered,this.internal.hovered=v}constructor(e){super(),this.internal={pointerPosition:new s.Vector2,pointerDownPosition:new s.Vector2,pointerDown:!1,dragging:!1,hovered:null,pressed:null};let t=f(null==e?void 0:e.material),n=d("high").map((e,n)=>{let r=new s.Mesh(e,t);return r.name="vertigo-widget-mesh-".concat(n),this.add(r),r}),r=new s.Mesh(function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let r=d(...t);return(0,l.n4)(r,!0)}("low"),f(null==e?void 0:e.material));r.material.transparent=!1,r.name="vertigo-widget-low-mesh",r.visible=!1,this.add(r),this.parts={material:t,meshes:n,lowMesh:r}}}},84268:function(e,t,n){"use strict";n.d(t,{Client:function(){return L}});var r=n(78485),o=n(46019),i=n(27275),s=n(52471),a=n(30035),l=n(32423),c=n(74831),u=n(12144),d=n(48583),h=n(39680),f=n(494),p=n(88156);class v extends p.O{constructor(e,{color:t="#ffff00"}={}){let n;super(void 0,new s.LineBasicMaterial({color:t})),this.position.copy(e.focus),this.rotation.copy(e.rotation);let{x:r,y:o}=e.size;1!==e.zoom&&this.rectangle([-r/2,-o/2,r,o]),r/=e.zoom,o/=e.zoom,this.rectangle([-r/2,-o/2,r,o]).plus([0,0],.5).draw();let i=new s.Mesh(new s.PlaneGeometry(1,.25),new s.MeshBasicMaterial({color:t,alphaMap:null!=n?n:n=(()=>{let e=document.createElement("canvas"),t=e.getContext("2d");e.width=1024,e.height=256,t.fillStyle="white",t.font="200px Fira Code",t.textBaseline="top",t.fillText("Vertigo",20,20);let n=new s.Texture(e);return n.needsUpdate=!0,n})(),transparent:!0,side:s.DoubleSide}));i.position.set(-r/2+.5+.1,o/2-.125-.1,0),this.add(i)}}var g=n(63549),w=n(87858),m=n(63425),y=n(28142),x=n(39805),b=n(9710),V=n(31454);let E=new s.IcosahedronGeometry(1,4);class M extends s.Mesh{constructor(e){super(E,new s.MeshBasicMaterial({color:"#0c529d",...e,side:s.BackSide,depthWrite:!1,depthTest:!1})),this.renderOrder=-1,this.frustumCulled=!1,this.matrixAutoUpdate=!1,this.onBeforeRender=(e,t,n)=>{let r=(n.near+n.far)/2;this.position.copy(n.position),this.scale.setScalar(r),this.updateMatrix(),this.updateMatrixWorld()}}}var P=n(4499);class O extends s.Group{onTick(e){this.parts.rings.rotation.y+=.123*e.deltaTime,this.parts.rings.rotation.x+=.435*e.deltaTime}constructor(...e){super(...e),this.internal={ringGeometry:new s.TorusGeometry(3,.01,16,128)},this.parts=(()=>{let e=(0,w.cY)(new s.Group,{parent:this}),t=(0,w.cY)(new s.Mesh(this.internal.ringGeometry,new g.P({color:"#eb1640",luminosity:.8})),{parent:e,name:"ring-x",rotationY:"90deg"}),n=(0,w.cY)(new s.Mesh(this.internal.ringGeometry,new g.P({color:"#00ff9d",luminosity:.8})),{parent:e,name:"ring-y",rotationX:"90deg"}),r=(0,w.cY)(new s.Mesh(this.internal.ringGeometry,new g.P({color:"#3b80e7",luminosity:.8})),{parent:e,name:"ring-z"});return{rings:e,ringX:t,ringY:n,ringZ:r,torusKnot:(0,w.cY)(new s.Mesh(new s.TorusKnotGeometry(3,.1,512,64),new g.P({luminosity:.8})),{parent:this,name:"torus-knot"})}})()}}class A extends s.Scene{constructor(...e){super(...e),this.parts={sky:(0,w.cY)(new M({color:"#027bff"}),{parent:this}),thing:(0,w.cY)(new O,{parent:this}),gridZ:(0,w.cY)(new V.K({step:.5}),{parent:this}),widget:(0,w.cY)(new P.lx,{parent:this})}}}class I extends s.ShaderMaterial{constructor(){super({uniforms:{uResolution:{value:new s.Vector4},uRect:{value:new s.Vector4},map:{value:null}},vertexShader:"\n        uniform vec4 uResolution;\n        uniform vec4 uRect;\n        varying vec2 vUv;\n        void main() {\n          vUv = uv;\n          gl_Position.xy = ((position.xy * 2.0 + 1.0) * uRect.zw + uRect.xy * 2.0) / uResolution.xy - 1.0; \n          gl_Position.z = 0.0;\n          gl_Position.w = 1.0;\n          // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n        }\n      ",fragmentShader:"\n        uniform sampler2D map;\n        varying vec2 vUv;\n        void main() {\n          gl_FragColor = texture2D(map, vUv);\n        }\n      ",transparent:!0,depthWrite:!1,depthTest:!1})}}class z extends s.Mesh{*initialize(e,t){let{rt:n,scene:r,camera:o,vertigo:i,widget:a}=this.internal,l=this.material.uniforms.uResolution.value,u=this.material.uniforms.uRect.value,d=new s.Vector2,h=new s.Vector2(-1,-1),f=!1;yield(0,c.w)(e.domElement,{onDown:()=>{f=!0},onUp:()=>{f=!1},onChange:e=>{h.x=(e.localPosition.x-u.x)/u.z*2-1,h.y=-(e.localPosition.y/u.w*2-1)},onTap:()=>{switch(a.getPressed()){case P.X5.BOX:t.actions.togglePerspective();break;case P.X5.POSITIVE_X:t.actions.positiveXAlign();break;case P.X5.NEGATIVE_X:t.actions.negativeXAlign();break;case P.X5.POSITIVE_Y:t.actions.positiveYAlign();break;case P.X5.NEGATIVE_Y:t.actions.negativeYAlign();break;case P.X5.POSITIVE_Z:t.actions.positiveZAlign();break;case P.X5.NEGATIVE_Z:t.actions.negativeZAlign()}}}),yield(0,b.RC)("three",{order:1},()=>{e.getSize(d),l.set(d.x,d.y,e.getPixelRatio(),0),u.x=d.x-u.z,u.y=d.y-u.w,i.rotation.copy(t.vertigo.rotation),i.perspective=t.vertigo.perspective,i.apply(o,1),a.widgetUpdate(h,f,o),h.x>=-1&&h.x<=1&&h.y>=-1&&h.y<=1&&(null!==a.getHovered()?document.body.style.cursor="pointer":document.body.style.removeProperty("cursor")),e.setRenderTarget(n),e.setClearColor("white",0),e.render(r,o),e.setRenderTarget(null)})}constructor({planeSize:e=120}={}){let t=new I;super(new s.PlaneGeometry(1,1),t),this.vertigoControls=null;let n=2*e,r=new s.WebGLRenderTarget(n,n,{format:s.RGBAFormat,colorSpace:"srgb"}),o=new s.Scene,i=new s.PerspectiveCamera,a=new h.a({perspective:1,size:[2.8,2.8]}),l=new P.lx;o.add(l),this.internal={rt:r,scene:o,camera:i,vertigo:a,widget:l},this.renderOrder=1,this.frustumCulled=!1,t.uniforms.map.value=this.internal.rt.texture,t.uniforms.uRect.value.set(10,10,e,e),this.position.x=2}}var C=n(63922),T=n.n(C);function S(e){let{vertigo:t}=e,{ref:n}=(0,d.sv)(function*(e){yield(0,b.RC)("three",{timeInterval:1/6},()=>{e.querySelector("pre").textContent=o.ZP.dump(t.toDeclaration(),{flowLevel:1}).replace(/-?\d+\.\d+/g,e=>(0,x.uf)(Number.parseFloat(e),{maxDigits:6}))})},[]);return(0,r.jsx)("div",{ref:n,className:"self-start p-4 border border-white rounded text-xs ".concat(T().BgBlur),style:{minWidth:"24rem"},children:(0,r.jsx)("pre",{})})}class X extends s.Group{onTick(e){for(let t of this.parts.cubes){let{angularVelocity:n}=t.userData;t.rotation.x+=n.x*e.deltaTime,t.rotation.y+=n.y*e.deltaTime,t.rotation.z+=n.z*e.deltaTime}}constructor(...e){super(...e),this.parts={knot:(0,w.cY)(new s.Mesh(new s.TorusKnotGeometry(1,.5,256,32),new g.P),{parent:this}),knot2:(0,w.cY)(new s.Mesh(new s.TorusKnotGeometry(1.37,.05,256,32),new g.P({color:P.AB.xColor})),{parent:this}),cubes:Array.from({length:20},(e,t)=>{let n=y.T.between(-3,3),r=y.T.between(-1.5,1.5),o=y.T.between(-3,3),i=["".concat(y.T.between(0,360),"deg"),"".concat(y.T.between(0,360),"deg"),"".concat(y.T.between(0,360),"deg")],l=y.T.between(.5,1),c=(0,w.cY)(new s.Mesh(new a.k(1),new g.P({color:y.T.pick(Object.values(P.AB))})),{parent:this,x:n,y:r,z:o,rotation:i,scaleScalar:l}),u=new s.Euler(y.T.between(-1,1),y.T.between(-1,1),y.T.between(-1,1));return c.userData={angularVelocity:u},c})}}}function L(){let e=(0,i.useMemo)(()=>{let e=new h.a({size:[4.2,4.2]}),t=new h.a({perspective:0,focus:[-10,3,0],size:[8,4],rotation:[0,"45deg",0]}),n=t.clone().set({perspective:1,size:t.size.clone().multiplyScalar(1.2)}),r=t.clone().set({perspective:1,size:t.size.clone().multiplyScalar(1.5),rotation:[0,"-15deg","-25deg"]}),o=new h.a({perspective:1,focus:[-4.5,1.8,10],size:[12,9],rotation:["-3deg","1deg","12deg"]}),i=new h.a({perspective:1,focus:[-4.5,1.8,14],size:o.size.clone().multiplyScalar(1.5),rotation:["-3deg","1deg","0deg"]}),s={main:e,a0:t,a1:n,a2:r,back:o,back2:i,zoom:new h.a({focus:[6,-4,0],size:[4,4],zoom:.25}),revert:new h.a({rotation:["12.6deg","145.3deg","0deg"],focus:[-5,-.5,3.6],size:[12,12],fov:"60deg"})},a=new f.F(s.main);return{vertigos:s,vertigoControls:a}},[]),{ref:t}=(0,d.sv)(function*(t){let{vertigoControls:n}=e,r=new s.WebGLRenderer({antialias:!0});r.outputColorSpace="srgb",t.prepend(r.domElement);let o=1;yield(0,u.f)(t,{onSize:()=>{r.setPixelRatio(window.devicePixelRatio),r.setSize(t.clientWidth,t.clientHeight),o=t.clientWidth/t.clientHeight}});let i=new s.PerspectiveCamera(75,1,.1,1e3);i.position.z=5,yield n.initialize(r.domElement);let a=new A,d=b.vB.get("three");(0,l.s)(d.requestActivation);let h=new z;a.add(h),yield*h.initialize(r,n);let f=new s.Vector2,p=!1;for(let t of(yield d.onTick(e=>{e.propagate(a),a.parts.widget.widgetUpdate(f,p,i),null!==a.parts.widget.getHovered()?document.body.style.cursor="pointer":document.body.style.removeProperty("cursor"),n.update(i,o),r.render(a,i)}),yield(0,c.w)(r.domElement,{onChange:e=>{let{x:t,y:n}=e.relativeLocalPosition;f.set(2*t-1,-((2*n-1)*1))},onDown:()=>{p=!0},onUp:()=>{p=!1},onTap:()=>{let e=a.parts.widget.getPressed();switch(null!==e&&n.actions.focus([0,0,0]),e){case P.X5.BOX:n.actions.togglePerspective();break;case P.X5.POSITIVE_X:n.actions.positiveXAlign();break;case P.X5.NEGATIVE_X:n.actions.negativeXAlign();break;case P.X5.POSITIVE_Y:n.actions.positiveYAlign();break;case P.X5.NEGATIVE_Y:n.actions.negativeYAlign();break;case P.X5.POSITIVE_Z:n.actions.positiveZAlign();break;case P.X5.NEGATIVE_Z:n.actions.negativeZAlign()}}}),Object.values(e.vertigos)))(0,w.cY)(new v(t),a);let g=new X;a.add(g),g.position.copy(e.vertigos.a0.focus),g.rotation.copy(e.vertigos.a0.rotation),yield()=>{r.dispose(),t.removeChild(r.domElement)}},[]),{vertigoControls:n}=e;return(0,r.jsx)("div",{ref:t,className:"".concat(T().VertigoWidgetClient," layer thru"),children:(0,r.jsxs)("div",{className:"layer thru p-4 flex flex-col gap-4 items-start",children:[(0,r.jsx)("h1",{className:"text-2xl self-start",children:"Vertigo-widget"}),(0,r.jsxs)("div",{className:"".concat(T().BgBlur," thru flex flex-col gap-1 items-start p-1 border border-white rounded"),style:{width:"min(200px, 30%)"},children:[(0,r.jsx)("h2",{children:"Actions:"}),(0,r.jsxs)("div",{className:"thru flex flex-row flex-wrap items-start gap-1",children:[(0,r.jsx)("button",{className:"".concat(T().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{m.fw.tween({target:n.vertigo,duration:1,ease:"inOut2",to:{perspective:0}})},children:"ortho"}),(0,r.jsx)("button",{className:"".concat(T().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{m.fw.tween({target:n.vertigo,duration:1,ease:"inOut2",to:{perspective:1}})},children:"pers:1"}),(0,r.jsx)("button",{className:"".concat(T().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{m.fw.tween({target:n.vertigo,duration:1,ease:"inOut2",to:{perspective:1.5}})},children:"pers:1.5"}),(0,r.jsx)("button",{className:"".concat(T().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{m.fw.tween({target:n.vertigo,duration:1,ease:"inOut2",to:{zoom:1}})},children:"zoom:1"}),(0,r.jsx)("button",{className:"".concat(T().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{m.fw.tween({target:n.vertigo,duration:.75,ease:"inOut2",to:{focus:new s.Vector3}})},children:"focus:(0,0,0)"})]})]}),(0,r.jsxs)("div",{className:"".concat(T().BgBlur," thru flex flex-col gap-1 items-start p-1 border border-white rounded"),style:{width:"min(200px, 30%)"},children:[(0,r.jsx)("h2",{children:"Presets:"}),(0,r.jsx)("div",{className:"flex flex-row gap-1 flex-wrap",children:Object.entries(e.vertigos).map(t=>{let[n,o]=t;return(0,r.jsx)("button",{className:"".concat(T().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{let t=e.vertigoControls.vertigo.clone();m.fw.during(1).onUpdate(n=>{let{progress:r}=n,i=m.fw.ease("inOut3")(r);e.vertigoControls.vertigo.lerpVertigos(t,o,i)})},children:n},n)})})]}),(0,r.jsx)("div",{className:"Space flex-1 pointer-events-none"}),(0,r.jsx)(S,{vertigo:n.vertigo})]})})}},32423:function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[r,o]=1===t.length?[window,t[0]]:t,i=()=>{o()};return r.addEventListener("mousemove",i,{passive:!0}),r.addEventListener("mousedown",i,{passive:!0}),r.addEventListener("mouseup",i,{passive:!0}),r.addEventListener("touchstart",i,{passive:!0}),r.addEventListener("touchmove",i,{passive:!0}),r.addEventListener("wheel",i,{passive:!0}),r.addEventListener("keydown",i,{passive:!0}),r.addEventListener("keyup",i,{passive:!0}),window.addEventListener("resize",i,{passive:!0}),{destroy:()=>{r.removeEventListener("mousemove",i),r.removeEventListener("mousedown",i),r.removeEventListener("mouseup",i),r.removeEventListener("touchstart",i),r.removeEventListener("touchmove",i),r.removeEventListener("wheel",i),r.removeEventListener("keydown",i),r.removeEventListener("keyup",i),window.removeEventListener("resize",i)}}}n.d(t,{s:function(){return r}})},12144:function(e,t,n){"use strict";let r;n.d(t,{f:function(){return a}});let o=new WeakMap,i=(r=()=>{let e=new WeakMap;return{resizeObserver:new ResizeObserver(t=>{for(let r of t){var n;null===(n=e.get(r.target))||void 0===n||n(r)}}),resizeObserverMap:e}},()=>{let e=o.get(r);if(void 0===e){let e=r();return o.set(r,e),e}return e});class s{get aspect(){return this.size.x/this.size.y}constructor(e,t){this.element=e,this.size=t}}function a(e,t){let{onSize:n}=function(e){if("function"==typeof e)return{onSize:e};let{onSize:t=()=>{}}=null!=e?e:{};return{onSize:t}}(t),r=new DOMPoint(0,0);if(e instanceof Window){let t=()=>{r.x=window.innerWidth,r.y=window.innerHeight,n(new s(e,r))};return e.addEventListener("resize",t),t(),{destroy:()=>{e.removeEventListener("resize",t)}}}{let{resizeObserver:t,resizeObserverMap:o}=i();return t.observe(e),o.set(e,t=>{r.x=t.contentRect.width,r.y=t.contentRect.height,n(new s(e,r))}),{destroy:()=>t.unobserve(e)}}}},81796:function(e,t,n){"use strict";n.d(t,{FE:function(){return o.FE},Gg:function(){return c},Q7:function(){return l},Xe:function(){return u},iK:function(){return a},ux:function(){return o.ux}});var r=n(52471),o=n(74175);function i(e){return"string"==typeof e&&/^(rad|deg|turn)$/.test(e)}function s(e){return"string"==typeof e&&/^(XYZ|XZY|YXZ|YZX|ZXY|ZYX)$/.test(e)}function a(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new r.Vector2;return o.iK(e,t)}function l(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new r.Vector3;return o.Q7(e,t)}function c(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new r.Euler;if(e instanceof r.Euler)return t.copy(e);if(Array.isArray(e)){let[n,r,a,l,c]=e,u=i(l)?l:i(c)?c:"rad",d=s(l)?l:s(c)?c:"XYZ";return t.set((0,o.FE)(n,u),(0,o.FE)(r,u),(0,o.FE)(a,u),d)}let{x:n,y:a,z:l,order:c="XYZ",unit:u="rad"}=e;return t.set((0,o.FE)(n,u),(0,o.FE)(a,u),(0,o.FE)(l,u),c)}let u=(()=>{let e=new r.Vector3,t=new r.Euler,n=new r.Vector3,o=new r.Quaternion;return function(i,s){let{x:a=0,y:u=0,z:d=0,position:h={x:a,y:u,z:d},rotationX:f=0,rotationY:p=0,rotationZ:v=0,rotationOrder:g="XYZ",rotation:w={x:f,y:p,z:v,order:g},scaleX:m=1,scaleY:y=1,scaleZ:x=1,scaleScalar:b=1,scale:V={x:m,y:y,z:x}}=i;if(s instanceof r.Matrix4)return l(h,e),c(w,t),l(V,n).multiplyScalar(b),o.setFromEuler(t),s.compose(e,o,n);if(s instanceof r.Object3D)return l(h,s.position),c(w,s.rotation),l(V,s.scale).multiplyScalar(b),s;throw Error("Invalid out argument")}})()},31454:function(e,t,n){"use strict";n.d(t,{K:function(){return s}});var r=n(52471),o=n(81796);let i={color:"white",opacity:.5,size:[8,8],step:1,frame:!0};class s extends r.LineSegments{set(e){let{color:t,opacity:n,size:s,step:a,frame:l}={...i,...e},c=(0,o.iK)(s),u=(0,o.iK)(null!=a?a:c),d=[],h=(e,t)=>d.push(new r.Vector3(e,t,0));l&&(h(-c.x/2,+c.y/2),h(+c.x/2,+c.y/2),h(+c.x/2,+c.y/2),h(+c.x/2,-c.y/2),h(+c.x/2,-c.y/2),h(-c.x/2,-c.y/2),h(-c.x/2,-c.y/2),h(-c.x/2,+c.y/2));let f=Math.ceil(-c.x/2/u.x)*u.x;f===-c.x/2&&(f+=u.x);do h(f,-c.y/2),h(f,+c.y/2),f+=u.x;while(f<c.x/2);let p=Math.ceil(-c.y/2/u.y)*u.y;p===-c.y/2&&(p+=u.y);do h(-c.x/2,p),h(+c.x/2,p),p+=u.y;while(p<c.y/2);return this.geometry.setFromPoints(d),this.material.color.set(t),this.material.opacity=n,this.material.transparent=n<1,this}constructor(e){super(),this.set(null!=e?e:i)}}},88156:function(e,t,n){"use strict";n.d(t,{O:function(){return c}});var r=n(52471),o=n(58648),i=n(81796);let s=new r.Vector2,a=new r.Vector3,l=new r.Matrix4;class c extends r.LineSegments{showOccludedLines(){let{opacity:e=.2}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=new r.LineBasicMaterial({color:this.material.color,transparent:!0,depthFunc:r.GreaterDepth,opacity:e}),n=new r.LineSegments(this.geometry,t);return this.add(n),this}clear(){return this.points.length=0,this.geometry.setFromPoints(this.points),this}draw(){return this.geometry.setFromPoints(this.points),this}circle(e){let{radius:t,segments:n,...o}={...c.circleDefaultOptions,...e};(0,i.Xe)(o,l);let s=new r.Vector3(1,0,0),a=new r.Vector3(0,1,0);for(let e=0;e<n;e++){let o=e/n*Math.PI*2,i=(e+1)/n*Math.PI*2,c=Math.cos(o)*t,u=Math.sin(o)*t,d=Math.cos(i)*t,h=Math.sin(i)*t,f=new r.Vector3().addScaledVector(s,c).addScaledVector(a,u).applyMatrix4(l),p=new r.Vector3().addScaledVector(s,d).addScaledVector(a,h).applyMatrix4(l);this.points.push(f,p)}return this}rectangle(e){let{centerX:t,centerY:n,width:i,height:s}=o.Ae.from(e),a=i/2,l=s/2,c=new r.Vector3(t-a,n-l,0),u=new r.Vector3(t+a,n-l,0),d=new r.Vector3(t+a,n+l,0),h=new r.Vector3(t-a,n+l,0);return this.points.push(c,u,u,d,d,h,h,c),this}box(){let{center:e=[0,0,0],size:t=1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{x:n,y:o,z:s}=(0,i.Q7)(e,a),{x:l,y:c,z:u}=(0,i.Q7)(t,a),d=l/2,h=c/2,f=u/2,p=new r.Vector3(n-d,o-h,s-f),v=new r.Vector3(n+d,o-h,s-f),g=new r.Vector3(n+d,o+h,s-f),w=new r.Vector3(n-d,o+h,s-f),m=new r.Vector3(n-d,o-h,s+f),y=new r.Vector3(n+d,o-h,s+f),x=new r.Vector3(n+d,o+h,s+f),b=new r.Vector3(n-d,o+h,s+f);return this.points.push(p,v,v,g,g,w,w,p),this.points.push(m,y,y,x,x,b,b,m),this.points.push(p,m,v,y,g,x,w,b),this}plus(e,t){let n=t/2,{x:o,y:a}=(0,i.iK)(e,s),l=new r.Vector3(o-n,a,0),c=new r.Vector3(o+n,a,0),u=new r.Vector3(o,a-n,0),d=new r.Vector3(o,a+n,0);return this.points.push(l,c,u,d),this}cross(e,t){let n=t/2,{x:o,y:a}=(0,i.iK)(e,s),l=new r.Vector3(o-n,a-n,0),c=new r.Vector3(o+n,a+n,0),u=new r.Vector3(o-n,a+n,0),d=new r.Vector3(o+n,a-n,0);return this.points.push(l,c,u,d),this}constructor(...e){super(...e),this.points=[]}}c.circleDefaultOptions={radius:.5,segments:96}},94588:function(e,t,n){"use strict";n.d(t,{N:function(){return s}});var r=n(52471),o=n(81796);new r.Vector3(0,0,0),new r.Euler(0,0,0,"XYZ"),new r.Vector3(1,1,1);let i={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,rotationOrder:"XYZ",rotationUnit:"rad",scaleX:1,scaleY:1,scaleZ:1,scaleScalar:1,visible:void 0,name:void 0,parent:void 0};function s(e,t){let{x:n,y:s,z:a,position:l=new r.Vector3(n,s,a),rotationX:c,rotationY:u,rotationZ:d,rotationOrder:h,rotationUnit:f,rotation:p,scaleX:v,scaleY:g,scaleZ:w,scaleScalar:m,scale:y=new r.Vector3(v,g,w).multiplyScalar(m),visible:x,name:b,parent:V}={...i,...t};return(0,o.Q7)(l,e.position),(0,o.Gg)(null!=p?p:[c,u,d,h,f],e.rotation),(0,o.Q7)(y,e.scale),void 0!==x&&(e.visible=x),void 0!==b&&(e.name=b),void 0!==V&&V.add(e),e}},87858:function(e,t,n){"use strict";n.d(t,{H$:function(){return a},bB:function(){return s},cY:function(){return i}});var r=n(52471),o=n(94588);function i(e,t,n){return t&&(t instanceof r.Object3D?t.add(e):(0,o.N)(e,t)),null==n||n(e),e}let s=i;function a(e,t){return function(e,t){let n=e;for(;n.parent;){if(n.parent===t)return!0;n=n.parent}return!1}(t,e)}},74175:function(e,t,n){"use strict";n.d(t,{FE:function(){return i},Q7:function(){return c},iK:function(){return l},ux:function(){return s}});var r=n(39805);let o={rad:1,deg:Math.PI/180,turn:2*Math.PI};function i(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"rad",n=t,r=0;if("number"==typeof e)r=e;else{let t=e.match(/^\s*(-?[0-9.]+)\s*(\/\s*-?[0-9.]+)?\s*(rad|deg|turn)\s*$/);if(t){let[e,o,i,s]=t;r=Number.parseFloat(o),i&&(r/=Number.parseFloat(i.slice(1))),n=s}else r=Number.parseFloat(e)}return r*o[n]}function s(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"rad";return"".concat((0,r.uf)(e/o[t])).concat(t)}function a(e){return"number"==typeof e}function l(e,t,n,r){if(null!=n||(n=0),null!=r||(r=a),null!=t||(t={x:n,y:n}),null==e)return t;if(r(e))return t.x=e,t.y=e,t;if(Array.isArray(e)){let[n,r]=e;return t.x=n,t.y=r,t}if("width"in e){let{width:n,height:r}=e;return t.x=n,t.y=r,t}let{x:o,y:i}=e;return t.x=o,t.y=i,t}function c(e,t,n,r){if(null!=r||(r=a),null!=n||(n=0),null!=t||(t={x:n,y:n,z:n}),null==e)return t;if(r(e))return t.x=e,t.y=e,t.z=e,t;if(Array.isArray(e)){let[r,o,i=n]=e;return t.x=r,t.y=o,t.z=i,t}if("width"in e){let{width:r,height:o=n,depth:i=n}=e;return t.x=r,t.y=o,t.z=i,t}let{x:o=n,y:i=n,z:s=n}=e;return t.x=o,t.y=i,t.z=s,t}},77552:function(e,t,n){"use strict";function r(e,t,n,r){return t-(t-e)*Math.exp(- -Math.log(n)*r)}function o(e,t){return 1-Math.exp(- -Math.log(e)*t)}n.d(t,{Lj:function(){return r},M3:function(){return o}})},1296:function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];for(let e of t.flat(2))"destroy"in e?e.destroy():e()}n.d(t,{N:function(){return o},o:function(){return r}});class o{collect(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];for(let e of t)if(e){if(Symbol.iterator in e)for(let t of e)t&&this.destroyables.push(t);else this.destroyables.push(e)}}constructor(){this.destroyables=[],this.destroy=()=>{r(this.destroyables),this.destroyables=[]}}}},28142:function(e,t,n){"use strict";n.d(t,{T:function(){return c}});let r=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(e=(e=(7*e+Math.sqrt(e)+16087*Math.sin(e))%2147483647)<0?e+2147483647:e)>1?2147483647&e:0===e?345678:123456},o=e=>e=2147483647&Math.imul(e,48271),i=e=>(e-1)/2147483646,s=e=>e,a={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function l(){let e=o(o(r(123456)));function t(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof t&&(t=t.split("").reduce((e,t)=>7*e+t.charCodeAt(0),0)),e=o(o(r(t))),d}function n(){return i(e=o(e))}function l(e){switch(e.length){default:return[0,1,s];case 1:return[0,e[0],s];case 2:return[e[0],e[1],s];case 3:return[e[0],e[1],e[2]]}}function c(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[o,i,s]=l(t);return o+(i-o)*s(n())}function u(){for(var e,t=arguments.length,r=Array(t),o=0;o<t;o++)r[o]=arguments[o];let[i,s,{weightsAreNormalized:l,indexOffset:c,forbiddenItems:u}]=function(e){let[t,n=null,r]=e,o={...a,...r};if(Array.isArray(t))return[t,n,o];if("object"==typeof t)return[Object.values(t),n?Object.values(n):null,o];throw Error("pick: unsupported options type")}(r);if(u.length>0){let t=new Set;for(let e of u){let n=i.indexOf(e);n>=0&&t.add(n)}if(i=i.filter((e,n)=>!t.has(n)),s=null!==(e=null==s?void 0:s.filter((e,n)=>!t.has(n)))&&void 0!==e?e:null,0===i.length)throw Error("pick: all items are forbidden")}if(null===s){let e=Math.floor(n()*i.length);return c&&(e+=c,(e%=i.length)<0&&(e+=i.length)),i[e]}if(!l){let e=s.reduce((e,t)=>e+t,0);s=s.map(t=>t/e)}let d=n(),h=0;for(let e=0;e<i.length;e++)if(d<(h+=s[e]))return i[e];throw Error("among: unreachable")}let d={seed:t,seedMax:function(){return 2147483647},reset:function(){return t(123456),d},next:function(){return e=o(e),d},random:n,between:c,around:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[o=1,i=s]=t,a=2*n();return(a>1?1:-1)*i(a>1?a-1:a)*o},int:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[o,i,s]=l(t);return o+Math.floor(s(n())*(i-o))},chance:function(e){return n()<e},shuffle:function(e){let{mutate:t=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t&&Array.isArray(e)?e:[...e],o=r.length;for(let e=0;e<o;e++){let t=Math.floor(o*n()),i=r[e];r[e]=r[t],r[t]=i}return r},pick:u,createPicker:function(e){let t=e.map(e=>{let[t]=e;return t}),n=e.map(e=>{let[t,n]=e;return n}),r=n.reduce((e,t)=>e+t,0);for(let[e,t]of n.entries())n[e]=t/r;return()=>u(t,n,{weightsAreNormalized:!0})},vector:function(e,t){let[n=0,r=1]=Array.isArray(t)?t:[null==t?void 0:t.min,null==t?void 0:t.max];for(let t of Object.keys(e))e[t]=c(n,r);return e},unitVector:function(e,t){let[n=-1,r=1]=Array.isArray(t)?t:[null==t?void 0:t.min,null==t?void 0:t.max],o=Object.keys(e),i=o.map(()=>c(n,r)),s=Math.sqrt(i.reduce((e,t)=>e+t*t,0));for(let[t,n]of o.entries())e[n]=i[t]/s;return e},boxMuller:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=n(),o=n(),i=Math.sqrt(-2*Math.log(r)),s=2*Math.PI*o;return[e+t*i*Math.cos(s),e+t*i*Math.sin(s)]}};return d}let c=class{constructor(e){Object.assign(this,l().seed(e))}};Object.assign(c,l())},63922:function(e){e.exports={VertigoWidgetClient:"vertigo_VertigoWidgetClient__tDfOf",BgBlur:"vertigo_BgBlur__WC2S2"}}}]);