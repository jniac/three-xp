(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8041],{4499:function(e,t,n){"use strict";n.d(t,{X:function(){return i},l:function(){return p}});var r,i,o=n(77552),s=n(52471),a=n(30035),l=n(66666);function u(e,t){let n=new s.BufferAttribute(new Int8Array(e.attributes.position.count).fill(t),1);e.setAttribute("aPartId",n)}function c(e,t){let n=new s.ConeGeometry(.2,.6000000000000001,e,1,!0).rotateZ(Math.PI).translate(0,.53,0),r=Array.from({length:t},(e,n)=>{let r=n/(t-1);return new s.Vector2(.2*r,-.05*(1-r**2))}),i=new s.LatheGeometry(r,e).rotateZ(Math.PI).translate(0,.2*3/2+.53,0);return(0,l.n4)([n,i],!1)}function h(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"low",t="high"===e?(0,l.$1)(new a.k(.3,.3,.3,4,.05)):new s.BoxGeometry(.3,.3,.3);u(t,0);let n="high"===e?c(32,8):c(6,2);u(n,3);let r=n.clone().rotateX(Math.PI);u(r,4);let i=n.clone().rotateZ(-Math.PI/2);u(i,1);let o=n.clone().rotateZ(Math.PI/2);u(o,2);let h=n.clone().rotateX(Math.PI/2);u(h,5);let d=n.clone().rotateX(-Math.PI/2);return u(d,6),[t,i,o,n,r,h,d]}(r=i||(i={}))[r.BOX=0]="BOX",r[r.POSITIVE_X=1]="POSITIVE_X",r[r.NEGATIVE_X=2]="NEGATIVE_X",r[r.POSITIVE_Y=3]="POSITIVE_Y",r[r.NEGATIVE_Y=4]="NEGATIVE_Y",r[r.POSITIVE_Z=5]="POSITIVE_Z",r[r.NEGATIVE_Z=6]="NEGATIVE_Z";let d={defaultColor:"white",xColor:"#eb1640",yColor:"#00ffb7",zColor:"#3b80e7",hoverColor:"#fffc47"},v=new s.Raycaster;class p extends s.Group{getHovered(){return this.internal.hovered}getPressed(){return this.internal.pressed}widgetUpdate(e,t,n){let r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1/60,{lowMesh:i,material:a}=this.parts,l=new s.Vector3;n.getWorldDirection(l);let u=this.matrixWorld.elements,c=new s.Vector3(u[0],u[1],u[2]),h=new s.Vector3(u[4],u[5],u[6]),d=new s.Vector3(u[8],u[9],u[10]);{let e=a.uniforms.uOpacity.value,t=Math.abs(l.dot(c)),n=Math.abs(l.dot(h)),i=Math.abs(l.dot(d));e[1]=e[2]=(0,o.L)(e[1],t<.98?1.05:-.05,1e-4,r),e[3]=e[4]=(0,o.L)(e[3],n<.98?1.05:-.05,1e-4,r),e[5]=e[6]=(0,o.L)(e[5],i<.98?1.05:-.05,1e-4,r)}{let e=a.uniforms.uHoverOpacity.value,t=0===this.internal.hovered?1:0,n=1===this.internal.hovered?1:0,i=2===this.internal.hovered?1:0,s=3===this.internal.hovered?1:0,l=4===this.internal.hovered?1:0,u=5===this.internal.hovered?1:0,c=6===this.internal.hovered?1:0;e[0]=(0,o.L)(e[0],t,1e-4,r),e[1]=(0,o.L)(e[1],n,1e-4,r),e[2]=(0,o.L)(e[2],i,1e-4,r),e[3]=(0,o.L)(e[3],s,1e-4,r),e[4]=(0,o.L)(e[4],l,1e-4,r),e[5]=(0,o.L)(e[5],u,1e-4,r),e[6]=(0,o.L)(e[6],c,1e-4,r)}v.setFromCamera(e,n);let[p]=v.intersectObject(i,!0).map(e=>{let t=3*e.faceIndex;return i.geometry.groups.findIndex(e=>e.start<=t&&t<e.start+e.count)}).filter(e=>a.uniforms.uOpacity.value[e]>.5);t&&!1===this.internal.pointerDown&&(this.internal.pointerDown=!0,this.internal.pointerDownPosition.copy(e),this.internal.pressed=null!=p?p:null),t&&!1===this.internal.dragging&&this.internal.pointerDownPosition.distanceTo(e)>.01&&(this.internal.dragging=!0),!1===t&&this.internal.pointerDown&&(this.internal.pointerDown=!1,this.internal.dragging=!1,this.internal.pressed=null);let f=this.internal.dragging?null:null!=p?p:null;this.internal.hovered,this.internal.hovered=f}constructor(e){super(),this.internal={pointerPosition:new s.Vector2,pointerDownPosition:new s.Vector2,pointerDown:!1,dragging:!1,hovered:null,pressed:null};let t=function(e){let{defaultColor:t,xColor:n,yColor:r,zColor:i,hoverColor:o}={...d,...e},a=new s.Color(t),l=new s.Color(n),u=new s.Color(r),c=new s.Color(i),h=new s.Color(o),v={uSunPosition:{value:new s.Vector3(.5,.7,.3)},uLuminosity:{value:.66},uColors:{value:[a,l,a,u,a,c,a]},uHoverColor:{value:h},uOpacity:{value:[1,1,1,1,1,1,1]},uHoverOpacity:{value:[0,0,0,0,0,0,0]}};return new s.ShaderMaterial({uniforms:v,vertexShader:"\nuniform vec3 uColors[7];\nuniform float uOpacity[7];\nuniform vec3 uHoverColor;\nuniform float uHoverOpacity[7];\n\nattribute float aPartId;\n\nvarying vec3 vWorldNormal;\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying float vOpacity;\nvarying float vHoverOpacity;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vPosition = position;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  vColor = uColors[int(aPartId)];\n  vOpacity = uOpacity[int(aPartId)];\n  vHoverOpacity = uHoverOpacity[int(aPartId)];\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying float vOpacity;\nvarying float vHoverOpacity;\n\nuniform vec3 uSunPosition;\nuniform float uLuminosity;\nuniform vec3 uHoverColor;\n\nfloat clamp01(float x) {\n  return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;\n}\n\nfloat inverseLerp(float a, float b, float x) {\n  return clamp01((x - a) / (b - a));\n}\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  \n  float minLuminosity = max(pow(vHoverOpacity, 1.0 / 3.0) * 0.85, uLuminosity);\n  light = mix(minLuminosity, 1.0, light);\n\n  vec3 color = vColor;\n  color = mix(color, uHoverColor, vHoverOpacity);\n  gl_FragColor = vec4(color * light, vOpacity);\n}\n",transparent:!0,depthWrite:!1})}(null==e?void 0:e.material),n=h("high").map((e,n)=>{let r=new s.Mesh(e,t);return r.name="vertigo-widget-mesh-".concat(n),this.add(r),r}),r=new s.Mesh(function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let r=h(...t);return(0,l.n4)(r,!0)}("low"),t);r.name="vertigo-widget-low-mesh",r.visible=!1,this.add(r),this.parts={material:t,meshes:n,lowMesh:r}}}},88041:function(e,t,n){"use strict";n.d(t,{Client:function(){return A}});var r=n(78485),i=n(27275),o=n(52471),s=n(32423),a=n(74831),l=n(12144),u=n(48583),c=n(63425),h=n(1296),d=n(81796);let v=new o.Matrix4,p=new o.Vector3,f={perspective:1,perspectiveBase:"45deg",zoom:1,focus:[0,0,0],size:[4,4],before:100,after:1e3,rotation:[0,0,0,"YXZ"],frame:"contain",allowOrthographic:!0,fovEpsilon:"1.5deg",nearMin:.1};class g{set(e){let{perspective:t,perspectiveBase:n,zoom:r,focus:i,size:o,before:s,after:a,rotation:l,frame:u,allowOrthographic:c,fovEpsilon:h,nearMin:v}=e;return void 0!==t&&(this.perspective=t),void 0!==n&&(this.perspectiveBase=(0,d.FE)(n)),void 0!==r&&(this.zoom=r),void 0!==i&&(0,d.Q7)(i,this.focus),void 0!==o&&(0,d.iK)(o,this.size),void 0!==s&&(this.before=s),void 0!==a&&(this.after=a),void 0!==l&&(0,d.Gg)(l,this.rotation),void 0!==u&&(this.frame="string"==typeof u?"cover"===u?0:1:u),void 0!==c&&(this.allowOrthographic=c),void 0!==h&&(this.fovEpsilon=(0,d.FE)(h)),void 0!==v&&(this.nearMin=v),this}apply(e,t){let n=this.size.x/this.size.y/t,r=n>1?this.frame:1-this.frame,i=this.size.y*(1+r*(n-1))/this.zoom,o=this.fovEpsilon,s=this.perspective*this.perspectiveBase;!this.allowOrthographic&&s<o&&(s=o);let a=i/2/Math.tan(s/2),l=s>=o,u=l?a:this.before+this.nearMin;if(v.makeRotationFromEuler(this.rotation),p.set(v.elements[8],v.elements[9],v.elements[10]).multiplyScalar(u).add(this.focus),e.position.copy(p),e.rotation.copy(this.rotation),e.updateMatrix(),e.updateMatrixWorld(!0),e.isPerspectiveCamera=l,e.isOrthographicCamera=!l,l){let n=Math.max(this.nearMin,a-this.before),r=a+this.after,o=i*n/a/2,l=o*t;e.fov=180*s/Math.PI,e.projectionMatrix.makePerspective(-l,l,o,-o,n,r)}else{let n=this.nearMin,r=this.nearMin+this.before+this.after,o=i/2,s=o*t;e.fov=0,e.projectionMatrix.makeOrthographic(-s,s,o,-o,n,r)}return e.projectionMatrixInverse.copy(e.projectionMatrix).invert(),this}constructor(e){this.focus=new o.Vector3,this.size=new o.Vector2,this.rotation=new o.Euler,this.set({...f,...e})}}let m=new o.Quaternion,y=new o.Vector3,w=new o.Vector3;class x extends h.N{pan(e,t){let n=1/this.vertigo.zoom;m.setFromEuler(this.vertigo.rotation),y.set(n,0,0).applyQuaternion(m),w.set(0,n,0).applyQuaternion(m),this.vertigo.focus.addScaledVector(y,e).addScaledVector(w,t)}rotate(e,t){this.vertigo.rotation.x+=e,this.vertigo.rotation.y+=t}*doInitialize(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document.body;yield function(e,t){for(let[n,r]of Object.entries(t))e.addEventListener(n,r);return{destroy(){for(let[n,r]of Object.entries(t))e.removeEventListener(n,r)}}}(e,{contextmenu:e=>{e.preventDefault()}}),yield(0,a.w)(e,{dragButton:-1,onDrag:e=>{switch(e.button){case a.M.Left:this.rotate(-.01*e.delta.y,-.01*e.delta.x);break;case a.M.Right:this.pan(-.005*e.delta.x,.005*e.delta.y)}},onWheel:e=>{this.vertigo.zoom*=1-.001*e.delta.y}})}initialize(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return this.collect(this.doInitialize(...t)),this}update(e,t){this.vertigo.apply(e,t)}constructor(e={}){super(),this.vertigo=new g,this.actions={togglePerspective:()=>{let e=this.vertigo.perspective>.5?0:1;c.fw.tween({target:[this.vertigo,"perspective"],to:{perspective:e},duration:1,ease:"inOut3"})},rotate:(e,t,n)=>{let r=new o.Quaternion().setFromEuler(this.vertigo.rotation),i=new o.Quaternion().setFromEuler(new o.Euler(e,t,n,"YXZ")),s=new o.Quaternion;c.fw.during({target:[this.vertigo,"rotation"],duration:1}).onUpdate(e=>{let{progress:t}=e;s.slerpQuaternions(r,i,c.fw.ease("inOut3")(t)),this.vertigo.rotation.setFromQuaternion(s)})},positiveXAlign:()=>{this.actions.rotate(0,Math.PI/2,0)},negativeXAlign:()=>{this.actions.rotate(0,-Math.PI/2,0)},positiveYAlign:()=>{this.actions.rotate(-Math.PI/2,0,0)},negativeYAlign:()=>{this.actions.rotate(Math.PI/2,0,0)},positiveZAlign:()=>{this.actions.rotate(0,0,0)},negativeZAlign:()=>{this.actions.rotate(0,Math.PI,0)}},this.vertigo.set(e)}}var b=n(9710);let M={color:"white",opacity:.5,size:[8,8],step:1,frame:!0};class E extends o.LineSegments{set(e){let{color:t,opacity:n,size:r,step:i,frame:s}={...M,...e},a=(0,d.iK)(r),l=(0,d.iK)(null!=i?i:a),u=[],c=(e,t)=>u.push(new o.Vector3(e,t,0));s&&(c(-a.x/2,+a.y/2),c(+a.x/2,+a.y/2),c(+a.x/2,+a.y/2),c(+a.x/2,-a.y/2),c(+a.x/2,-a.y/2),c(-a.x/2,-a.y/2),c(-a.x/2,-a.y/2),c(-a.x/2,+a.y/2));let h=Math.ceil(-a.x/2/l.x)*l.x;h===-a.x/2&&(h+=l.x);do c(h,-a.y/2),c(h,+a.y/2),h+=l.x;while(h<a.x/2);let v=Math.ceil(-a.y/2/l.y)*l.y;v===-a.y/2&&(v+=l.y);do c(-a.x/2,v),c(+a.x/2,v),v+=l.y;while(v<a.y/2);return this.geometry.setFromPoints(u),this.material.color.set(t),this.material.opacity=n,this.material.transparent=n<1,this}constructor(e){super(),this.set(null!=e?e:M)}}var P=n(63549);let I=new o.IcosahedronGeometry(1,4);class V extends o.Mesh{constructor(e){super(I,new o.MeshBasicMaterial({color:"#0c529d",...e,side:o.BackSide,depthWrite:!1,depthTest:!1})),this.renderOrder=-1,this.frustumCulled=!1,this.matrixAutoUpdate=!1,this.onBeforeRender=(e,t,n)=>{let r=(n.near+n.far)/2;this.position.copy(n.position),this.scale.setScalar(r),this.updateMatrix(),this.updateMatrixWorld()}}}var z=n(87858),O=n(4499);class C extends o.Group{onTick(e){this.parts.rings.rotation.y+=.123*e.deltaTime,this.parts.rings.rotation.x+=.435*e.deltaTime}constructor(...e){super(...e),this.internal={ringGeometry:new o.TorusGeometry(3,.01,16,128)},this.parts=(()=>{let e=(0,z.cY)(new o.Group,{parent:this});return(0,z.cY)(new o.Mesh(this.internal.ringGeometry,new P.P({color:"#eb1640",luminosity:.8})),{parent:e,name:"ring-x",rotationY:"90deg"}),(0,z.cY)(new o.Mesh(this.internal.ringGeometry,new P.P({color:"#00ff9d",luminosity:.8})),{parent:e,name:"ring-y",rotationX:"90deg"}),(0,z.cY)(new o.Mesh(this.internal.ringGeometry,new P.P({color:"#3b80e7",luminosity:.8})),{parent:e,name:"ring-z"}),{rings:e,torusKnot:(0,z.cY)(new o.Mesh(new o.TorusKnotGeometry(3,.1,512,64),new P.P({luminosity:.8})),{parent:this,name:"torus-knot"})}})()}}class L extends o.Scene{constructor(...e){super(...e),this.parts={sky:(0,z.cY)(new V({color:"#027bff"}),{parent:this}),thing:(0,z.cY)(new C,{parent:this}),gridZ:(0,z.cY)(new E,{parent:this}),widget:(0,z.cY)(new O.l,{parent:this})}}}var X=n(63922),S=n.n(X);function A(){let e=(0,i.useMemo)(()=>({toOrthographic:()=>{},toPerspective:()=>{}}),[]),{ref:t}=(0,u.sv)(function*(t){let n=new o.WebGLRenderer({antialias:!0});n.outputColorSpace="srgb",t.prepend(n.domElement);let r=1;yield(0,l.f)(t,{onSize:()=>{n.setPixelRatio(window.devicePixelRatio),n.setSize(t.clientWidth,t.clientHeight),r=t.clientWidth/t.clientHeight}});let i=new o.PerspectiveCamera(75,1,.1,1e3);i.position.z=5;let u=new x({perspective:1});yield u.initialize(n.domElement);let h=new L,d=b.vB.get("three");(0,s.s)(d.requestActivation);let v=new o.Vector2,p=!1;yield d.onTick(e=>{e.propagate(h),h.parts.widget.widgetUpdate(v,p,i),null!==h.parts.widget.getHovered()?document.body.style.cursor="pointer":document.body.style.removeProperty("cursor"),u.update(i,r),n.render(h,i)}),e.toOrthographic=()=>{c.fw.tween({target:u.vertigo,duration:1,ease:"inOut2",to:{perspective:0}})},e.toPerspective=()=>{c.fw.tween({target:u.vertigo,duration:1,ease:"inOut2",to:{perspective:1}})},yield(0,a.w)(n.domElement,{onChange:e=>{let{x:t,y:n}=e.relativeLocalPosition;v.set(2*t-1,1-2*n)},onDown:()=>{p=!0},onUp:()=>{p=!1},onTap:()=>{switch(h.parts.widget.getPressed()){case O.X.BOX:u.actions.togglePerspective();break;case O.X.POSITIVE_X:u.actions.positiveXAlign();break;case O.X.NEGATIVE_X:u.actions.negativeXAlign();break;case O.X.POSITIVE_Y:u.actions.positiveYAlign();break;case O.X.NEGATIVE_Y:u.actions.negativeYAlign();break;case O.X.POSITIVE_Z:u.actions.positiveZAlign();break;case O.X.NEGATIVE_Z:u.actions.negativeZAlign()}}}),yield()=>{n.dispose(),t.removeChild(n.domElement)}},[]);return(0,r.jsx)("div",{ref:t,className:"".concat(S().VertigoWidgetClient," layer thru p-4"),children:(0,r.jsxs)("div",{className:"layer thru p-4",children:[(0,r.jsx)("h1",{children:"Vertigo-widget"}),(0,r.jsxs)("div",{className:"flex flex-row gap-1",children:[(0,r.jsx)("button",{className:"px-2 py-1 border border-white rounded",onClick:()=>e.toOrthographic(),children:"ortho"}),(0,r.jsx)("button",{className:"px-2 py-1 border border-white rounded",onClick:()=>e.toPerspective(),children:"pers"})]})]})})}},32423:function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[r,i]=1===t.length?[window,t[0]]:t,o=()=>{i()};return r.addEventListener("mousemove",o,{passive:!0}),r.addEventListener("mousedown",o,{passive:!0}),r.addEventListener("mouseup",o,{passive:!0}),r.addEventListener("touchstart",o,{passive:!0}),r.addEventListener("touchmove",o,{passive:!0}),r.addEventListener("wheel",o,{passive:!0}),r.addEventListener("keydown",o,{passive:!0}),r.addEventListener("keyup",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),{destroy:()=>{r.removeEventListener("mousemove",o),r.removeEventListener("mousedown",o),r.removeEventListener("mouseup",o),r.removeEventListener("touchstart",o),r.removeEventListener("touchmove",o),r.removeEventListener("wheel",o),r.removeEventListener("keydown",o),r.removeEventListener("keyup",o),window.removeEventListener("resize",o)}}}n.d(t,{s:function(){return r}})},12144:function(e,t,n){"use strict";let r;n.d(t,{f:function(){return a}});let i=new WeakMap,o=(r=()=>{let e=new WeakMap;return{resizeObserver:new ResizeObserver(t=>{for(let r of t){var n;null===(n=e.get(r.target))||void 0===n||n(r)}}),resizeObserverMap:e}},()=>{let e=i.get(r);if(void 0===e){let e=r();return i.set(r,e),e}return e});class s{get aspect(){return this.size.x/this.size.y}constructor(e,t){this.element=e,this.size=t}}function a(e,t){let{onSize:n}=function(e){if("function"==typeof e)return{onSize:e};let{onSize:t=()=>{}}=null!=e?e:{};return{onSize:t}}(t),r=new DOMPoint(0,0);if(e instanceof Window){let t=()=>{r.x=window.innerWidth,r.y=window.innerHeight,n(new s(e,r))};return e.addEventListener("resize",t),t(),{destroy:()=>{e.removeEventListener("resize",t)}}}{let{resizeObserver:t,resizeObserverMap:i}=o();return t.observe(e),i.set(e,t=>{r.x=t.contentRect.width,r.y=t.contentRect.height,n(new s(e,r))}),{destroy:()=>t.unobserve(e)}}}},81796:function(e,t,n){"use strict";n.d(t,{FE:function(){return o},Gg:function(){return u},Q7:function(){return l},Xe:function(){return c},iK:function(){return a}});var r=n(52471);let i={rad:1,deg:Math.PI/180,turn:2*Math.PI};function o(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"rad",n=t,r=0;if("number"==typeof e)r=e;else{let t=e.match(/^\s*(-?[0-9.]+)\s*(\/\s*-?[0-9.]+)?\s*(rad|deg|turn)\s*$/);if(t){let[e,i,o,s]=t;r=Number.parseFloat(i),o&&(r/=Number.parseFloat(o.slice(1))),n=s}else r=Number.parseFloat(e)}return r*i[n]}function s(e){return"string"==typeof e&&/^(XYZ|XZY|YXZ|YZX|ZXY|ZYX)$/.test(e)}function a(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new r.Vector2;if(null==e)return t.set(0,0);if("number"==typeof e)return t.set(e,e);if(Array.isArray(e)){let[n,r]=e;return t.set(n,r)}if("width"in e){let{width:n,height:r}=e;return t.set(n,r)}let{x:n,y:i}=e;return t.set(n,i)}function l(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new r.Vector3;if(null==e)return t.set(0,0,0);if("number"==typeof e)return t.set(e,e,e);if(Array.isArray(e)){let[n,r,i=0]=e;return t.set(n,r,i)}if("width"in e){let{width:n,height:r,depth:i}=e;return t.set(n,r,i)}let{x:n,y:i,z:o=0}=e;return t.set(n,i,o)}function u(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new r.Euler;if(e instanceof r.Euler)return t.copy(e);if(Array.isArray(e)){let[n,r,i,a,l]=e,u="string"==typeof a&&/^(rad|deg|turn)$/.test(a)?a:"rad",c=s(a)?a:s(l)?l:"XYZ";return t.set(o(n,u),o(r,u),o(i,u),c)}let{x:n,y:i,z:a,order:l="XYZ",unit:u="rad"}=e;return t.set(o(n,u),o(i,u),o(a,u),l)}let c=(()=>{let e=new r.Vector3,t=new r.Euler,n=new r.Vector3,i=new r.Quaternion;return function(o,s){let{x:a=0,y:c=0,z:h=0,position:d={x:a,y:c,z:h},rotationX:v=0,rotationY:p=0,rotationZ:f=0,rotationOrder:g="XYZ",rotation:m={x:v,y:p,z:f,order:g},useDegree:y=!1,scaleX:w=1,scaleY:x=1,scaleZ:b=1,scaleScalar:M=1,scale:E={x:w,y:x,z:b}}=o;if(y){let e=Math.PI/180;m.x*=e,m.y*=e,m.z*=e}if(s instanceof r.Matrix4)return l(d,e),u(m,t),l(E,n).multiplyScalar(M),i.setFromEuler(t),s.compose(e,i,n);if(s instanceof r.Object3D)return l(d,s.position),u(m,s.rotation),l(E,s.scale).multiplyScalar(M),s;throw Error("Invalid out argument")}})()},63549:function(e,t,n){"use strict";n.d(t,{P:function(){return o}});var r=n(52471);let i={vertexColors:!0,color:"white",luminosity:.5};class o extends r.ShaderMaterial{constructor(e){let{color:t,luminosity:n,vertexColors:o,...s}={...i,...e};super({...s,uniforms:{uColor:{value:new r.Color(t)},uSunPosition:{value:new r.Vector3(.5,.7,.3)},uLuminosity:{value:n}},vertexColors:o,vertexShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vColor = color;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nuniform vec3 uSunPosition;\nuniform vec3 uColor;\nuniform float uLuminosity;\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  light = mix(uLuminosity, 1.0, light);\n  gl_FragColor = vec4(vColor * uColor * light, 1.0);\n}\n"}),this.sunPosition=this.uniforms.uSunPosition.value}}},15979:function(e,t,n){"use strict";n.d(t,{N:function(){return s}});var r=n(52471),i=n(81796);new r.Vector3(0,0,0),new r.Euler(0,0,0,"XYZ"),new r.Vector3(1,1,1);let o={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,rotationOrder:"XYZ",rotationUnit:"rad",scaleX:1,scaleY:1,scaleZ:1,scaleScalar:1,visible:void 0,name:void 0,parent:void 0};function s(e,t){let{x:n,y:s,z:a,position:l=new r.Vector3(n,s,a),rotationX:u,rotationY:c,rotationZ:h,rotationOrder:d,rotationUnit:v,rotation:p,scaleX:f,scaleY:g,scaleZ:m,scaleScalar:y,scale:w=new r.Vector3(f,g,m).multiplyScalar(y),visible:x,name:b,parent:M}={...o,...t};return(0,i.Q7)(l,e.position),(0,i.Gg)(null!=p?p:[u,c,h,v,d],e.rotation),(0,i.Q7)(w,e.scale),void 0!==x&&(e.visible=x),void 0!==b&&(e.name=b),void 0!==M&&M.add(e),e}},87858:function(e,t,n){"use strict";n.d(t,{H$:function(){return a},bB:function(){return s},cY:function(){return o}});var r=n(52471),i=n(15979);function o(e,t,n){return t&&(t instanceof r.Object3D?t.add(e):(0,i.N)(e,t)),null==n||n(e),e}let s=o;function a(e,t){return function(e,t){let n=e;for(;n.parent;){if(n.parent===t)return!0;n=n.parent}return!1}(t,e)}},77552:function(e,t,n){"use strict";function r(e,t,n,r){return t-(t-e)*Math.exp(- -Math.log(n)*r)}n.d(t,{L:function(){return r}})},1296:function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];for(let e of t.flat(2))"destroy"in e?e.destroy():e()}n.d(t,{N:function(){return i},o:function(){return r}});class i{collect(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];for(let e of t)if(e){if(Symbol.iterator in e)for(let t of e)t&&this.destroyables.push(t);else this.destroyables.push(e)}}constructor(){this.destroyables=[],this.destroy=()=>{r(this.destroyables),this.destroyables=[]}}}},63922:function(e){e.exports={VertigoWidgetClient:"vertigo_VertigoWidgetClient__tDfOf"}},30035:function(e,t,n){"use strict";n.d(t,{k:function(){return s}});var r=n(52471);let i=new r.Vector3;function o(e,t,n,r,o,s){let a=2*Math.PI*o/4,l=Math.max(s-2*o,0);i.copy(t),i[r]=0,i.normalize();let u=.5*a/(a+l),c=1-i.angleTo(e)/(Math.PI/4);return 1===Math.sign(i[n])?c*u:l/(a+l)+u+u*(1-c)}class s extends r.BoxGeometry{constructor(e=1,t=1,n=1,i=2,s=.1){if(i=2*i+1,s=Math.min(e/2,t/2,n/2,s),super(1,1,1,i,i,i),1===i)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new r.Vector3,u=new r.Vector3,c=new r.Vector3(e,t,n).divideScalar(2).subScalar(s),h=this.attributes.position.array,d=this.attributes.normal.array,v=this.attributes.uv.array,p=h.length/6,f=new r.Vector3,g=.5/i;for(let r=0,i=0;r<h.length;r+=3,i+=2)switch(l.fromArray(h,r),u.copy(l),u.x-=Math.sign(u.x)*g,u.y-=Math.sign(u.y)*g,u.z-=Math.sign(u.z)*g,u.normalize(),h[r+0]=c.x*Math.sign(l.x)+u.x*s,h[r+1]=c.y*Math.sign(l.y)+u.y*s,h[r+2]=c.z*Math.sign(l.z)+u.z*s,d[r+0]=u.x,d[r+1]=u.y,d[r+2]=u.z,Math.floor(r/p)){case 0:f.set(1,0,0),v[i+0]=o(f,u,"z","y",s,n),v[i+1]=1-o(f,u,"y","z",s,t);break;case 1:f.set(-1,0,0),v[i+0]=1-o(f,u,"z","y",s,n),v[i+1]=1-o(f,u,"y","z",s,t);break;case 2:f.set(0,1,0),v[i+0]=1-o(f,u,"x","z",s,e),v[i+1]=o(f,u,"z","x",s,n);break;case 3:f.set(0,-1,0),v[i+0]=1-o(f,u,"x","z",s,e),v[i+1]=1-o(f,u,"z","x",s,n);break;case 4:f.set(0,0,1),v[i+0]=1-o(f,u,"x","y",s,e),v[i+1]=1-o(f,u,"y","x",s,t);break;case 5:f.set(0,0,-1),v[i+0]=o(f,u,"x","y",s,e),v[i+1]=1-o(f,u,"y","x",s,t)}}}}}]);