(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3271],{4499:function(e,t,r){"use strict";r.d(t,{AB:function(){return d},X5:function(){return n},lx:function(){return f}});var i,n,o=r(77552),s=r(52471),a=r(30035),l=r(66666);function c(e,t){let r=new s.BufferAttribute(new Int8Array(e.attributes.position.count).fill(t),1);e.setAttribute("aPartId",r)}function u(e,t,r){let i=new s.ConeGeometry(.2,.6000000000000001,e,r,!0).rotateZ(Math.PI).translate(0,.53,0),n=Array.from({length:t},(e,r)=>{let i=r/(t-1);return new s.Vector2(.2*i,-.05*(1-i**2))}),o=new s.LatheGeometry(n,e).rotateZ(Math.PI).translate(0,.2*3/2+.53,0);return(0,l.n4)([i,o],!1)}function h(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"low",t="high"===e?(0,l.$1)(new a.k(.3,.3,.3,4,.05)):new s.BoxGeometry(.3,.3,.3);c(t,0);let r="high"===e?u(32,8,5):u(6,2,1);c(r,3);let i=r.clone().rotateX(Math.PI);c(i,4);let n=r.clone().rotateZ(-Math.PI/2);c(n,1);let o=r.clone().rotateZ(Math.PI/2);c(o,2);let h=r.clone().rotateX(Math.PI/2);c(h,5);let d=r.clone().rotateX(-Math.PI/2);return c(d,6),[t,n,o,r,i,h,d]}(i=n||(n={}))[i.BOX=0]="BOX",i[i.POSITIVE_X=1]="POSITIVE_X",i[i.NEGATIVE_X=2]="NEGATIVE_X",i[i.POSITIVE_Y=3]="POSITIVE_Y",i[i.NEGATIVE_Y=4]="NEGATIVE_Y",i[i.POSITIVE_Z=5]="POSITIVE_Z",i[i.NEGATIVE_Z=6]="NEGATIVE_Z";let d={defaultColor:"white",xColor:"#eb1640",yColor:"#00ffb7",zColor:"#3b80e7",hoverColor:"#fffc47"};function v(e){let{defaultColor:t,xColor:r,yColor:i,zColor:n,hoverColor:o}={...d,...e},a=new s.Color(t),l=new s.Color(r),c=new s.Color(i),u=new s.Color(n),h=new s.Color(o),v={uSunPosition:{value:new s.Vector3(.5,.7,.3)},uLuminosity:{value:.66},uColors:{value:[a,l,a,c,a,u,a]},uHoverColor:{value:h},uOpacity:{value:[1,1,1,1,1,1,1]},uHoverOpacity:{value:[0,0,0,0,0,0,0]}};return new s.ShaderMaterial({uniforms:v,vertexShader:"\nuniform vec3 uColors[7];\nuniform float uOpacity[7];\nuniform vec3 uHoverColor;\nuniform float uHoverOpacity[7];\n\nattribute float aPartId;\n\nvarying vec3 vWorldNormal;\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying float vOpacity;\nvarying float vHoverOpacity;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vPosition = position;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  vColor = uColors[int(aPartId)];\n  vOpacity = uOpacity[int(aPartId)];\n  vHoverOpacity = uHoverOpacity[int(aPartId)];\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying float vOpacity;\nvarying float vHoverOpacity;\n\nuniform vec3 uSunPosition;\nuniform float uLuminosity;\nuniform vec3 uHoverColor;\n\nfloat clamp01(float x) {\n  return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;\n}\n\nfloat inverseLerp(float a, float b, float x) {\n  return clamp01((x - a) / (b - a));\n}\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  \n  float minLuminosity = max(pow(vHoverOpacity, 1.0 / 3.0) * 0.85, uLuminosity);\n  light = mix(minLuminosity, 1.0, light);\n\n  vec3 color = vColor;\n  color = mix(color, uHoverColor, vHoverOpacity);\n  gl_FragColor = vec4(color * light, vOpacity);\n}\n",transparent:!0})}let p=new s.Raycaster;class f extends s.Group{getHovered(){return this.internal.hovered}getPressed(){return this.internal.pressed}widgetUpdate(e,t,r){let i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1/60,{lowMesh:n,material:a}=this.parts,l=new s.Vector3;r.getWorldDirection(l);let c=this.matrixWorld.elements,u=new s.Vector3(c[0],c[1],c[2]),h=new s.Vector3(c[4],c[5],c[6]),d=new s.Vector3(c[8],c[9],c[10]);{let e=a.uniforms.uOpacity.value,t=Math.abs(l.dot(u)),r=Math.abs(l.dot(h)),n=Math.abs(l.dot(d));e[1]=e[2]=(0,o.L)(e[1],t<.98?1.05:-.05,1e-4,i),e[3]=e[4]=(0,o.L)(e[3],r<.98?1.05:-.05,1e-4,i),e[5]=e[6]=(0,o.L)(e[5],n<.98?1.05:-.05,1e-4,i)}{let e=a.uniforms.uHoverOpacity.value,t=0===this.internal.hovered?1:0,r=1===this.internal.hovered?1:0,n=2===this.internal.hovered?1:0,s=3===this.internal.hovered?1:0,l=4===this.internal.hovered?1:0,c=5===this.internal.hovered?1:0,u=6===this.internal.hovered?1:0;e[0]=(0,o.L)(e[0],t,1e-4,i),e[1]=(0,o.L)(e[1],r,1e-4,i),e[2]=(0,o.L)(e[2],n,1e-4,i),e[3]=(0,o.L)(e[3],s,1e-4,i),e[4]=(0,o.L)(e[4],l,1e-4,i),e[5]=(0,o.L)(e[5],c,1e-4,i),e[6]=(0,o.L)(e[6],u,1e-4,i)}p.setFromCamera(e,r);let[v]=p.intersectObject(n,!0).map(e=>{let t=3*e.faceIndex;return n.geometry.groups.findIndex(e=>e.start<=t&&t<e.start+e.count)}).filter(e=>a.uniforms.uOpacity.value[e]>.5);t&&!1===this.internal.pointerDown&&(this.internal.pointerDown=!0,this.internal.pointerDownPosition.copy(e),this.internal.pressed=null!=v?v:null),t&&!1===this.internal.dragging&&this.internal.pointerDownPosition.distanceTo(e)>.01&&(this.internal.dragging=!0),!1===t&&this.internal.pointerDown&&(this.internal.pointerDown=!1,this.internal.dragging=!1,this.internal.pressed=null);let f=this.internal.dragging?null:null!=v?v:null;this.internal.hovered,this.internal.hovered=f}constructor(e){super(),this.internal={pointerPosition:new s.Vector2,pointerDownPosition:new s.Vector2,pointerDown:!1,dragging:!1,hovered:null,pressed:null};let t=v(null==e?void 0:e.material),r=h("high").map((e,r)=>{let i=new s.Mesh(e,t);return i.name="vertigo-widget-mesh-".concat(r),this.add(i),i}),i=new s.Mesh(function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let i=h(...t);return(0,l.n4)(i,!0)}("low"),v(null==e?void 0:e.material));i.material.transparent=!1,i.name="vertigo-widget-low-mesh",i.visible=!1,this.add(i),this.parts={material:t,meshes:r,lowMesh:i}}}},13271:function(e,t,r){"use strict";r.d(t,{Client:function(){return F}});var i=r(78485),n=r(46019),o=r(27275),s=r(52471),a=r(30035),l=r(32423),c=r(74831),u=r(12144),h=r(48583),d=r(81796);let v=new s.Matrix4,p=new s.Vector3,f=new s.Quaternion,g=new s.Quaternion,m={perspective:1,zoom:1,focus:[0,0,0],size:[4,4],before:100,after:1e3,rotation:[0,0,0,"YXZ"],frame:"contain",allowOrthographic:!0,fovBase:"45deg",fovEpsilon:"1.5deg",nearMin:.1};class w{set(e){let{perspective:t,fovBase:r,zoom:i,focus:n,size:o,before:s,after:a,rotation:l,frame:c,allowOrthographic:u,fovEpsilon:h,nearMin:v}=e;return void 0!==t&&(this.perspective=t),void 0!==r&&(this.perspectiveBase=(0,d.FE)(r)),void 0!==i&&(this.zoom=i),void 0!==n&&(0,d.Q7)(n,this.focus),void 0!==o&&(0,d.iK)(o,this.size),void 0!==s&&(this.before=s),void 0!==a&&(this.after=a),void 0!==l&&(0,d.Gg)(l,this.rotation),void 0!==c&&(this.frame="string"==typeof c?"cover"===c?0:1:c),void 0!==u&&(this.allowOrthographic=u),void 0!==h&&(this.fovEpsilon=(0,d.FE)(h)),void 0!==v&&(this.nearMin=v),this}copy(e){return this.perspective=e.perspective,this.perspectiveBase=e.perspectiveBase,this.zoom=e.zoom,this.focus.copy(e.focus),this.size.copy(e.size),this.before=e.before,this.after=e.after,this.rotation.copy(e.rotation),this.frame=e.frame,this.allowOrthographic=e.allowOrthographic,this.fovEpsilon=e.fovEpsilon,this.nearMin=e.nearMin,this}clone(){return new w().copy(this)}lerpVertigos(e,t,r){return this.perspective=e.perspective+(t.perspective-e.perspective)*r,this.perspectiveBase=e.perspectiveBase+(t.perspectiveBase-e.perspectiveBase)*r,this.zoom=e.zoom+(t.zoom-e.zoom)*r,this.focus.lerpVectors(e.focus,t.focus,r),this.size.lerpVectors(e.size,t.size,r),this.before=e.before+(t.before-e.before)*r,this.after=e.after+(t.after-e.after)*r,f.setFromEuler(e.rotation),g.setFromEuler(t.rotation),this.rotation.setFromQuaternion(f.slerp(g,r)),this.frame=e.frame+(t.frame-e.frame)*r,this.allowOrthographic=r<.5?e.allowOrthographic:t.allowOrthographic,this.fovEpsilon=e.fovEpsilon+(t.fovEpsilon-e.fovEpsilon)*r,this.nearMin=e.nearMin+(t.nearMin-e.nearMin)*r,this}lerp(e,t){return this.lerpVertigos(this,e,t)}apply(e,t){let r=this.size.x/this.size.y/t,i=1+(r>1?this.frame:1-this.frame)*(r-1),n=this.size.y*i/this.zoom,o=this.fovEpsilon,s=this.perspective*this.perspectiveBase;!this.allowOrthographic&&s<o&&(s=o);let a=n/2/Math.tan(s/2),l=s>=o,c=l?a:this.before+this.nearMin;if(v.makeRotationFromEuler(this.rotation),p.set(v.elements[8],v.elements[9],v.elements[10]).multiplyScalar(c).add(this.focus),e.position.copy(p),e.rotation.copy(this.rotation),e.updateMatrix(),e.updateMatrixWorld(!0),e.isPerspectiveCamera=l,e.isOrthographicCamera=!l,l){let r=Math.max(this.nearMin/this.zoom,a-this.before),i=a+this.after,o=n*r/a/2,l=o*t;e.fov=180*s/Math.PI,e.projectionMatrix.makePerspective(-l,l,o,-o,r,i)}else{let r=this.nearMin/this.zoom,i=r+this.before+this.after,o=n/2,s=o*t;e.fov=0,e.projectionMatrix.makeOrthographic(-s,s,o,-o,r,i)}return e.projectionMatrixInverse.copy(e.projectionMatrix).invert(),this.computedNdcScalar.set(i*t,i),this.computedSize.set(n*t,n),this}toDeclaration(){let e=[(0,d.ux)(this.rotation.x,"deg"),(0,d.ux)(this.rotation.y,"deg"),(0,d.ux)(this.rotation.z,"deg"),this.rotation.order];return{perspective:this.perspective,fovBase:(0,d.ux)(this.perspectiveBase,"deg"),zoom:this.zoom,focus:this.focus.toArray(),size:this.size.toArray(),before:this.before,after:this.after,rotation:e,frame:this.frame,allowOrthographic:this.allowOrthographic,fovEpsilon:(0,d.ux)(this.fovEpsilon,"deg"),nearMin:this.nearMin}}constructor(e){this.focus=new s.Vector3,this.size=new s.Vector2,this.rotation=new s.Euler,this.computedNdcScalar=new s.Vector2,this.computedSize=new s.Vector2,this.set({...m,...e})}}var y=r(63425),x=r(1296);let b=new s.Quaternion,E=new s.Vector3,z=new s.Vector3;function P(e){b.setFromEuler(e),E.set(1,0,0).applyQuaternion(b),z.set(0,1,0).applyQuaternion(b)}class V extends x.N{pan(e,t){P(this.vertigo.rotation);let r=1/this.vertigo.zoom;this.vertigo.focus.addScaledVector(E,e*r).addScaledVector(z,t*r)}rotate(e,t){this.vertigo.rotation.x+=e,this.vertigo.rotation.y+=t}zoomAt(e,t){let r=this.vertigo.size.x/this.vertigo.zoom,i=this.vertigo.size.y/this.vertigo.zoom,n=this.vertigo.size.x/e,o=this.vertigo.size.y/e;P(this.vertigo.rotation);let{x:s,y:a}=t;this.vertigo.focus.addScaledVector(E,-((n-r)*s)).addScaledVector(z,-((o-i)*a)),this.vertigo.zoom=e}*doInitialize(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document.body;yield function(e,t){for(let[r,i]of Object.entries(t))e.addEventListener(r,i);return{destroy(){for(let[r,i]of Object.entries(t))e.removeEventListener(r,i)}}}(e,{contextmenu:e=>{e.preventDefault()}});let t=new s.Vector2;yield(0,c.w)(e,{onChange:r=>{let i=e.getBoundingClientRect(),n=(r.localPosition.x-i.x)/i.width*2-1,o=-((r.localPosition.y-i.y)/i.height*2-1);t.set(n/2,o/2).multiply(this.vertigo.computedNdcScalar)},dragButton:-1,onDrag:e=>{switch(e.button){case c.M.Left:this.rotate(-.01*e.delta.y,-.01*e.delta.x);break;case c.M.Right:this.pan(-.005*e.delta.x,.005*e.delta.y)}},onWheel:e=>{let r=this.vertigo.zoom*(1-.001*e.delta.y);e.event.altKey?this.zoomAt(r,t):this.zoomAt(r,{x:0,y:0})}})}initialize(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return this.collect(this.doInitialize(...t)),this}update(e,t){this.vertigo.apply(e,t)}constructor(e={}){super(),this.vertigo=new w,this.actions={togglePerspective:()=>{let e=this.vertigo.perspective>.5?0:1;y.fw.tween({target:[this.vertigo,"perspective"],to:{perspective:e},duration:1,ease:"inOut3"})},rotate:(e,t,r)=>{let i=new s.Quaternion().setFromEuler(this.vertigo.rotation),n=new s.Quaternion().setFromEuler(new s.Euler(e,t,r,"YXZ")),o=new s.Quaternion;y.fw.during({target:[this.vertigo,"rotation"],duration:1}).onUpdate(e=>{let{progress:t}=e;o.slerpQuaternions(i,n,y.fw.ease("inOut3")(t)),this.vertigo.rotation.setFromQuaternion(o)})},positiveXAlign:()=>{this.actions.rotate(0,Math.PI/2,0)},negativeXAlign:()=>{this.actions.rotate(0,-Math.PI/2,0)},positiveYAlign:()=>{this.actions.rotate(-Math.PI/2,0,0)},negativeYAlign:()=>{this.actions.rotate(Math.PI/2,0,0)},positiveZAlign:()=>{this.actions.rotate(0,0,0)},negativeZAlign:()=>{this.actions.rotate(0,Math.PI,0)}},this.vertigo.set(e)}}var M=r(88156);class C extends M.O{constructor(e,{color:t="red"}={}){let r;super(void 0,new s.LineBasicMaterial({color:t})),this.position.copy(e.focus),this.rotation.copy(e.rotation);let{x:i,y:n}=e.size;this.rectangle([-i/2,-n/2,i,n]).plus([0,0],.5).draw();let o=new s.Mesh(new s.PlaneGeometry(1,.25),new s.MeshBasicMaterial({color:t,alphaMap:null!=r?r:r=(()=>{let e=document.createElement("canvas"),t=e.getContext("2d");e.width=1024,e.height=256,t.fillStyle="white",t.font="200px Fira Code",t.textBaseline="top",t.fillText("Vertigo",20,20);let r=new s.Texture(e);return r.needsUpdate=!0,r})(),transparent:!0,side:s.DoubleSide}));o.position.set(-i/2+.5+.1,n/2-.125-.1,0),this.add(o)}}var O=r(63549),I=r(87858),S=r(28142),A=r(39805),T=r(9710);let X={color:"white",opacity:.5,size:[8,8],step:1,frame:!0};class L extends s.LineSegments{set(e){let{color:t,opacity:r,size:i,step:n,frame:o}={...X,...e},a=(0,d.iK)(i),l=(0,d.iK)(null!=n?n:a),c=[],u=(e,t)=>c.push(new s.Vector3(e,t,0));o&&(u(-a.x/2,+a.y/2),u(+a.x/2,+a.y/2),u(+a.x/2,+a.y/2),u(+a.x/2,-a.y/2),u(+a.x/2,-a.y/2),u(-a.x/2,-a.y/2),u(-a.x/2,-a.y/2),u(-a.x/2,+a.y/2));let h=Math.ceil(-a.x/2/l.x)*l.x;h===-a.x/2&&(h+=l.x);do u(h,-a.y/2),u(h,+a.y/2),h+=l.x;while(h<a.x/2);let v=Math.ceil(-a.y/2/l.y)*l.y;v===-a.y/2&&(v+=l.y);do u(-a.x/2,v),u(+a.x/2,v),v+=l.y;while(v<a.y/2);return this.geometry.setFromPoints(c),this.material.color.set(t),this.material.opacity=r,this.material.transparent=r<1,this}constructor(e){super(),this.set(null!=e?e:X)}}let B=new s.IcosahedronGeometry(1,4);class N extends s.Mesh{constructor(e){super(B,new s.MeshBasicMaterial({color:"#0c529d",...e,side:s.BackSide,depthWrite:!1,depthTest:!1})),this.renderOrder=-1,this.frustumCulled=!1,this.matrixAutoUpdate=!1,this.onBeforeRender=(e,t,r)=>{let i=(r.near+r.far)/2;this.position.copy(r.position),this.scale.setScalar(i),this.updateMatrix(),this.updateMatrixWorld()}}}var Y=r(4499);class k extends s.Group{onTick(e){this.parts.rings.rotation.y+=.123*e.deltaTime,this.parts.rings.rotation.x+=.435*e.deltaTime}constructor(...e){super(...e),this.internal={ringGeometry:new s.TorusGeometry(3,.01,16,128)},this.parts=(()=>{let e=(0,I.cY)(new s.Group,{parent:this}),t=(0,I.cY)(new s.Mesh(this.internal.ringGeometry,new O.P({color:"#eb1640",luminosity:.8})),{parent:e,name:"ring-x",rotationY:"90deg"}),r=(0,I.cY)(new s.Mesh(this.internal.ringGeometry,new O.P({color:"#00ff9d",luminosity:.8})),{parent:e,name:"ring-y",rotationX:"90deg"}),i=(0,I.cY)(new s.Mesh(this.internal.ringGeometry,new O.P({color:"#3b80e7",luminosity:.8})),{parent:e,name:"ring-z"});return{rings:e,ringX:t,ringY:r,ringZ:i,torusKnot:(0,I.cY)(new s.Mesh(new s.TorusKnotGeometry(3,.1,512,64),new O.P({luminosity:.8})),{parent:this,name:"torus-knot"})}})()}}class _ extends s.Scene{constructor(...e){super(...e),this.parts={sky:(0,I.cY)(new N({color:"#027bff"}),{parent:this}),thing:(0,I.cY)(new k,{parent:this}),gridZ:(0,I.cY)(new L,{parent:this}),widget:(0,I.cY)(new Y.lx,{parent:this})}}}class G extends s.ShaderMaterial{constructor(){super({uniforms:{uResolution:{value:new s.Vector4},uRect:{value:new s.Vector4},map:{value:null}},vertexShader:"\n        uniform vec4 uResolution;\n        uniform vec4 uRect;\n        varying vec2 vUv;\n        void main() {\n          vUv = uv;\n          gl_Position.xy = ((position.xy * 2.0 + 1.0) * uRect.zw + uRect.xy * 2.0) / uResolution.xy - 1.0; \n          gl_Position.z = 0.0;\n          gl_Position.w = 1.0;\n          // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n        }\n      ",fragmentShader:"\n        uniform sampler2D map;\n        varying vec2 vUv;\n        void main() {\n          gl_FragColor = texture2D(map, vUv);\n        }\n      ",transparent:!0,depthWrite:!1,depthTest:!1})}}class Z extends s.Mesh{*initialize(e,t){let{rt:r,scene:i,camera:n,vertigo:o,widget:a}=this.internal,l=this.material.uniforms.uResolution.value,u=this.material.uniforms.uRect.value,h=new s.Vector2,d=new s.Vector2(-1,-1),v=!1;yield(0,c.w)(e.domElement,{onDown:()=>{v=!0},onUp:()=>{v=!1},onChange:e=>{d.x=(e.localPosition.x-u.x)/u.z*2-1,d.y=-(e.localPosition.y/u.w*2-1)},onTap:()=>{switch(a.getPressed()){case Y.X5.BOX:t.actions.togglePerspective();break;case Y.X5.POSITIVE_X:t.actions.positiveXAlign();break;case Y.X5.NEGATIVE_X:t.actions.negativeXAlign();break;case Y.X5.POSITIVE_Y:t.actions.positiveYAlign();break;case Y.X5.NEGATIVE_Y:t.actions.negativeYAlign();break;case Y.X5.POSITIVE_Z:t.actions.positiveZAlign();break;case Y.X5.NEGATIVE_Z:t.actions.negativeZAlign()}}}),yield(0,T.RC)("three",{order:1},()=>{e.getSize(h),l.set(h.x,h.y,e.getPixelRatio(),0),u.x=h.x-u.z,u.y=h.y-u.w,o.rotation.copy(t.vertigo.rotation),o.perspective=t.vertigo.perspective,o.apply(n,1),a.widgetUpdate(d,v,n),d.x>=-1&&d.x<=1&&d.y>=-1&&d.y<=1&&(null!==a.getHovered()?document.body.style.cursor="pointer":document.body.style.removeProperty("cursor")),e.setRenderTarget(r),e.setClearColor("white",0),e.render(i,n),e.setRenderTarget(null)})}constructor({planeSize:e=120}={}){let t=new G;super(new s.PlaneGeometry(1,1),t),this.vertigoControls=null;let r=2*e,i=new s.WebGLRenderTarget(r,r,{format:s.RGBAFormat,colorSpace:"srgb"}),n=new s.Scene,o=new s.PerspectiveCamera,a=new w({perspective:1,size:[2.8,2.8]}),l=new Y.lx;n.add(l),this.internal={rt:i,scene:n,camera:o,vertigo:a,widget:l},this.renderOrder=1,this.frustumCulled=!1,t.uniforms.map.value=this.internal.rt.texture,t.uniforms.uRect.value.set(10,10,e,e),this.position.x=2}}var j=r(63922),D=r.n(j);function R(e){let{vertigo:t}=e,{ref:r}=(0,h.sv)(function*(e){yield(0,T.RC)("three",{timeInterval:1/6},()=>{e.querySelector("pre").textContent=n.ZP.dump(t.toDeclaration(),{flowLevel:1}).replace(/-?\d+\.\d+/g,e=>(0,A.uf)(Number.parseFloat(e),{maxDigits:6}))})},[]);return(0,i.jsx)("div",{ref:r,className:"self-start p-4 border border-white rounded text-xs ".concat(D().BgBlur),style:{minWidth:"24rem"},children:(0,i.jsx)("pre",{})})}class W extends s.Group{onTick(e){for(let t of this.parts.cubes){let{angularVelocity:r}=t.userData;t.rotation.x+=r.x*e.deltaTime,t.rotation.y+=r.y*e.deltaTime,t.rotation.z+=r.z*e.deltaTime}}constructor(...e){super(...e),this.parts={knot:(0,I.cY)(new s.Mesh(new s.TorusKnotGeometry(1,.5,256,32),new O.P),{parent:this}),knot2:(0,I.cY)(new s.Mesh(new s.TorusKnotGeometry(1.37,.05,256,32),new O.P({color:Y.AB.xColor})),{parent:this}),cubes:Array.from({length:20},(e,t)=>{let r=S.T.between(-3,3),i=S.T.between(-1.5,1.5),n=S.T.between(-3,3),o=["".concat(S.T.between(0,360),"deg"),"".concat(S.T.between(0,360),"deg"),"".concat(S.T.between(0,360),"deg")],l=S.T.between(.5,1),c=(0,I.cY)(new s.Mesh(new a.k(1),new O.P({color:S.T.pick(Object.values(Y.AB))})),{parent:this,x:r,y:i,z:n,rotation:o,scaleScalar:l}),u=new s.Euler(S.T.between(-1,1),S.T.between(-1,1),S.T.between(-1,1));return c.userData={angularVelocity:u},c})}}}function F(){let e=(0,o.useMemo)(()=>{let e=new w({size:[4.2,4.2]}),t=new w({perspective:0,focus:[-10,3,0],size:[6,3],rotation:[0,"45deg",0]}),r=t.clone().set({perspective:1,size:t.size.clone().multiplyScalar(1.2)}),i=t.clone().set({perspective:1,size:t.size.clone().multiplyScalar(1.5),rotation:[0,"-15deg","-25deg"]}),n=new w({perspective:1,focus:[-4.5,1.8,10],size:[12,9],rotation:["-3deg","1deg","12deg"]}),o=new w({perspective:1,focus:[-4.5,1.8,14],size:n.size.clone().multiplyScalar(1.5),rotation:["-3deg","1deg","0deg"]}),s={main:e,a0:t,a1:r,a2:i,back:n,back2:o},a=new V(s.main);return{vertigos:s,vertigoControls:a}},[]),{ref:t}=(0,h.sv)(function*(t){let{vertigoControls:r}=e,i=new s.WebGLRenderer({antialias:!0});i.outputColorSpace="srgb",t.prepend(i.domElement);let n=1;yield(0,u.f)(t,{onSize:()=>{i.setPixelRatio(window.devicePixelRatio),i.setSize(t.clientWidth,t.clientHeight),n=t.clientWidth/t.clientHeight}});let o=new s.PerspectiveCamera(75,1,.1,1e3);o.position.z=5,yield r.initialize(i.domElement);let a=new _,h=T.vB.get("three");(0,l.s)(h.requestActivation);let d=new Z;a.add(d),yield*d.initialize(i,r);let v=new s.Vector2,p=!1;for(let t of(yield h.onTick(e=>{e.propagate(a),a.parts.widget.widgetUpdate(v,p,o),null!==a.parts.widget.getHovered()?document.body.style.cursor="pointer":document.body.style.removeProperty("cursor"),r.update(o,n),i.render(a,o)}),yield(0,c.w)(i.domElement,{onChange:e=>{let{x:t,y:r}=e.relativeLocalPosition;v.set(2*t-1,1-2*r)},onDown:()=>{p=!0},onUp:()=>{p=!1},onTap:()=>{switch(a.parts.widget.getPressed()){case Y.X5.BOX:r.actions.togglePerspective();break;case Y.X5.POSITIVE_X:r.actions.positiveXAlign();break;case Y.X5.NEGATIVE_X:r.actions.negativeXAlign();break;case Y.X5.POSITIVE_Y:r.actions.positiveYAlign();break;case Y.X5.NEGATIVE_Y:r.actions.negativeYAlign();break;case Y.X5.POSITIVE_Z:r.actions.positiveZAlign();break;case Y.X5.NEGATIVE_Z:r.actions.negativeZAlign()}}}),Object.values(e.vertigos)))(0,I.cY)(new C(t),a);let f=new W;a.add(f),f.position.copy(e.vertigos.a0.focus),f.rotation.copy(e.vertigos.a0.rotation),yield()=>{i.dispose(),t.removeChild(i.domElement)}},[]),{vertigoControls:r}=e;return(0,i.jsx)("div",{ref:t,className:"".concat(D().VertigoWidgetClient," layer thru"),children:(0,i.jsxs)("div",{className:"layer thru p-4 flex flex-col gap-4",children:[(0,i.jsx)("h1",{className:"self-start",children:"Vertigo-widget"}),(0,i.jsxs)("div",{className:"thru flex flex-col items-start gap-1",children:[(0,i.jsx)("button",{className:"".concat(D().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{y.fw.tween({target:r.vertigo,duration:1,ease:"inOut2",to:{perspective:0}})},children:"ortho"}),(0,i.jsx)("button",{className:"".concat(D().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{y.fw.tween({target:r.vertigo,duration:1,ease:"inOut2",to:{perspective:1}})},children:"pers:1"}),(0,i.jsx)("button",{className:"".concat(D().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{y.fw.tween({target:r.vertigo,duration:1,ease:"inOut2",to:{perspective:1.5}})},children:"pers:1.5"}),(0,i.jsx)("button",{className:"".concat(D().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{y.fw.tween({target:r.vertigo,duration:1,ease:"inOut2",to:{zoom:1}})},children:"zoom:1"}),(0,i.jsx)("button",{className:"".concat(D().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{y.fw.tween({target:r.vertigo,duration:.75,ease:"inOut2",to:{focus:new s.Vector3}})},children:"focus:(0,0,0)"})]}),(0,i.jsx)("div",{className:"thru flex flex-col gap-1 items-start",children:Object.entries(e.vertigos).map(t=>{let[r,n]=t;return(0,i.jsx)("button",{className:"".concat(D().BgBlur," px-2 py-1 border border-white rounded hover:bg-[#fff2]"),onClick:()=>{let t=e.vertigoControls.vertigo.clone();y.fw.during(1).onUpdate(r=>{let{progress:i}=r,o=y.fw.ease("inOut3")(i);e.vertigoControls.vertigo.lerpVertigos(t,n,o)})},children:r},r)})}),(0,i.jsx)("div",{className:"Space flex-1 pointer-events-none"}),(0,i.jsx)(R,{vertigo:r.vertigo})]})})}},32423:function(e,t,r){"use strict";function i(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i,n]=1===t.length?[window,t[0]]:t,o=()=>{n()};return i.addEventListener("mousemove",o,{passive:!0}),i.addEventListener("mousedown",o,{passive:!0}),i.addEventListener("mouseup",o,{passive:!0}),i.addEventListener("touchstart",o,{passive:!0}),i.addEventListener("touchmove",o,{passive:!0}),i.addEventListener("wheel",o,{passive:!0}),i.addEventListener("keydown",o,{passive:!0}),i.addEventListener("keyup",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),{destroy:()=>{i.removeEventListener("mousemove",o),i.removeEventListener("mousedown",o),i.removeEventListener("mouseup",o),i.removeEventListener("touchstart",o),i.removeEventListener("touchmove",o),i.removeEventListener("wheel",o),i.removeEventListener("keydown",o),i.removeEventListener("keyup",o),window.removeEventListener("resize",o)}}}r.d(t,{s:function(){return i}})},12144:function(e,t,r){"use strict";let i;r.d(t,{f:function(){return a}});let n=new WeakMap,o=(i=()=>{let e=new WeakMap;return{resizeObserver:new ResizeObserver(t=>{for(let i of t){var r;null===(r=e.get(i.target))||void 0===r||r(i)}}),resizeObserverMap:e}},()=>{let e=n.get(i);if(void 0===e){let e=i();return n.set(i,e),e}return e});class s{get aspect(){return this.size.x/this.size.y}constructor(e,t){this.element=e,this.size=t}}function a(e,t){let{onSize:r}=function(e){if("function"==typeof e)return{onSize:e};let{onSize:t=()=>{}}=null!=e?e:{};return{onSize:t}}(t),i=new DOMPoint(0,0);if(e instanceof Window){let t=()=>{i.x=window.innerWidth,i.y=window.innerHeight,r(new s(e,i))};return e.addEventListener("resize",t),t(),{destroy:()=>{e.removeEventListener("resize",t)}}}{let{resizeObserver:t,resizeObserverMap:n}=o();return t.observe(e),n.set(e,t=>{i.x=t.contentRect.width,i.y=t.contentRect.height,r(new s(e,i))}),{destroy:()=>t.unobserve(e)}}}},81796:function(e,t,r){"use strict";r.d(t,{FE:function(){return o},Gg:function(){return h},Q7:function(){return u},Xe:function(){return d},iK:function(){return c},ux:function(){return s}});var i=r(52471);let n={rad:1,deg:Math.PI/180,turn:2*Math.PI};function o(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"rad",r=t,i=0;if("number"==typeof e)i=e;else{let t=e.match(/^\s*(-?[0-9.]+)\s*(\/\s*-?[0-9.]+)?\s*(rad|deg|turn)\s*$/);if(t){let[e,n,o,s]=t;i=Number.parseFloat(n),o&&(i/=Number.parseFloat(o.slice(1))),r=s}else i=Number.parseFloat(e)}return i*n[r]}function s(e){var t,r;let i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"rad";return"".concat((t=e/n[i],r=({rad:3,deg:1,turn:4})[i],t.toFixed(r).replace(/\.([0-9]+[1-9])?0+$/,(e,t)=>(null==t?void 0:t.length)>0?".".concat(t):""))).concat(i)}function a(e){return"string"==typeof e&&/^(rad|deg|turn)$/.test(e)}function l(e){return"string"==typeof e&&/^(XYZ|XZY|YXZ|YZX|ZXY|ZYX)$/.test(e)}function c(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new i.Vector2;if(null==e)return t.set(0,0);if("number"==typeof e)return t.set(e,e);if(Array.isArray(e)){let[r,i]=e;return t.set(r,i)}if("width"in e){let{width:r,height:i}=e;return t.set(r,i)}let{x:r,y:n}=e;return t.set(r,n)}function u(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new i.Vector3;if(null==e)return t.set(0,0,0);if("number"==typeof e)return t.set(e,e,e);if(Array.isArray(e)){let[r,i,n=0]=e;return t.set(r,i,n)}if("width"in e){let{width:r,height:i,depth:n}=e;return t.set(r,i,n)}let{x:r,y:n,z:o=0}=e;return t.set(r,n,o)}function h(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new i.Euler;if(e instanceof i.Euler)return t.copy(e);if(Array.isArray(e)){let[r,i,n,s,c]=e,u=a(s)?s:a(c)?c:"rad",h=l(s)?s:l(c)?c:"XYZ";return t.set(o(r,u),o(i,u),o(n,u),h)}let{x:r,y:n,z:s,order:c="XYZ",unit:u="rad"}=e;return t.set(o(r,u),o(n,u),o(s,u),c)}let d=(()=>{let e=new i.Vector3,t=new i.Euler,r=new i.Vector3,n=new i.Quaternion;return function(o,s){let{x:a=0,y:l=0,z:c=0,position:d={x:a,y:l,z:c},rotationX:v=0,rotationY:p=0,rotationZ:f=0,rotationOrder:g="XYZ",rotation:m={x:v,y:p,z:f,order:g},useDegree:w=!1,scaleX:y=1,scaleY:x=1,scaleZ:b=1,scaleScalar:E=1,scale:z={x:y,y:x,z:b}}=o;if(w){let e=Math.PI/180;m.x*=e,m.y*=e,m.z*=e}if(s instanceof i.Matrix4)return u(d,e),h(m,t),u(z,r).multiplyScalar(E),n.setFromEuler(t),s.compose(e,n,r);if(s instanceof i.Object3D)return u(d,s.position),h(m,s.rotation),u(z,s.scale).multiplyScalar(E),s;throw Error("Invalid out argument")}})()},88156:function(e,t,r){"use strict";r.d(t,{O:function(){return a}});var i=r(52471),n=r(1237),o=r(81796);let s=new i.Vector2;class a extends i.LineSegments{clear(){return this.points.length=0,this.geometry.setFromPoints(this.points),this}draw(){return this.geometry.setFromPoints(this.points),this}rectangle(e){let{centerX:t,centerY:r,width:o,height:s}=n.Ae.from(e),a=o/2,l=s/2,c=new i.Vector3(t-a,r-l,0),u=new i.Vector3(t+a,r-l,0),h=new i.Vector3(t+a,r+l,0),d=new i.Vector3(t-a,r+l,0);return this.points.push(c,u,u,h,h,d,d,c),this}plus(e,t){let r=t/2,{x:n,y:a}=(0,o.iK)(e,s),l=new i.Vector3(n-r,a,0),c=new i.Vector3(n+r,a,0),u=new i.Vector3(n,a-r,0),h=new i.Vector3(n,a+r,0);return this.points.push(l,c,u,h),this}cross(e,t){let r=t/2,{x:n,y:a}=(0,o.iK)(e,s),l=new i.Vector3(n-r,a-r,0),c=new i.Vector3(n+r,a+r,0),u=new i.Vector3(n-r,a+r,0),h=new i.Vector3(n+r,a-r,0);return this.points.push(l,c,u,h),this}constructor(...e){super(...e),this.points=[]}}},63549:function(e,t,r){"use strict";r.d(t,{P:function(){return o}});var i=r(52471);let n={vertexColors:!0,color:"white",luminosity:.5};class o extends i.ShaderMaterial{constructor(e){let{color:t,luminosity:r,vertexColors:o,...s}={...n,...e};super({...s,uniforms:{uColor:{value:new i.Color(t)},uSunPosition:{value:new i.Vector3(.5,.7,.3)},uLuminosity:{value:r}},vertexColors:o,vertexShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vColor = color;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nuniform vec3 uSunPosition;\nuniform vec3 uColor;\nuniform float uLuminosity;\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  light = mix(uLuminosity, 1.0, light);\n  gl_FragColor = vec4(vColor * uColor * light, 1.0);\n}\n"}),this.sunPosition=this.uniforms.uSunPosition.value}}},15979:function(e,t,r){"use strict";r.d(t,{N:function(){return s}});var i=r(52471),n=r(81796);new i.Vector3(0,0,0),new i.Euler(0,0,0,"XYZ"),new i.Vector3(1,1,1);let o={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,rotationOrder:"XYZ",rotationUnit:"rad",scaleX:1,scaleY:1,scaleZ:1,scaleScalar:1,visible:void 0,name:void 0,parent:void 0};function s(e,t){let{x:r,y:s,z:a,position:l=new i.Vector3(r,s,a),rotationX:c,rotationY:u,rotationZ:h,rotationOrder:d,rotationUnit:v,rotation:p,scaleX:f,scaleY:g,scaleZ:m,scaleScalar:w,scale:y=new i.Vector3(f,g,m).multiplyScalar(w),visible:x,name:b,parent:E}={...o,...t};return(0,n.Q7)(l,e.position),(0,n.Gg)(null!=p?p:[c,u,h,d,v],e.rotation),(0,n.Q7)(y,e.scale),void 0!==x&&(e.visible=x),void 0!==b&&(e.name=b),void 0!==E&&E.add(e),e}},87858:function(e,t,r){"use strict";r.d(t,{H$:function(){return a},bB:function(){return s},cY:function(){return o}});var i=r(52471),n=r(15979);function o(e,t,r){return t&&(t instanceof i.Object3D?t.add(e):(0,n.N)(e,t)),null==r||r(e),e}let s=o;function a(e,t){return function(e,t){let r=e;for(;r.parent;){if(r.parent===t)return!0;r=r.parent}return!1}(t,e)}},77552:function(e,t,r){"use strict";function i(e,t,r,i){return t-(t-e)*Math.exp(- -Math.log(r)*i)}r.d(t,{L:function(){return i}})},1296:function(e,t,r){"use strict";function i(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];for(let e of t.flat(2))"destroy"in e?e.destroy():e()}r.d(t,{N:function(){return n},o:function(){return i}});class n{collect(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];for(let e of t)if(e){if(Symbol.iterator in e)for(let t of e)t&&this.destroyables.push(t);else this.destroyables.push(e)}}constructor(){this.destroyables=[],this.destroy=()=>{i(this.destroyables),this.destroyables=[]}}}},39805:function(e,t,r){"use strict";function i(e){let[t,r]=e.split(".");if(void 0===r)return t;let i=r.length-1;for(;"0"===r[i];)i--;return"."===r[i]&&i--,-1===i?t:t+"."+r.slice(0,i+1)}function n(e){let{maxDigits:t=8}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(t<6)throw Error("maxDigits must be at least 6");if(0===e)return"0";let[r,n]=e.toString().split("."),o=r.length,s=t-o-1;if(o>t||s<0){let[r,n]=e.toPrecision(t).split("e");return r=r.slice(0,t-n.length-1),"".concat(i(r),"e").concat(n)}return Math.abs(e)<1/Math.pow(10,t-2)?i(e.toExponential(t-5)):void 0===n?r:i(e.toFixed(s))}r.d(t,{uf:function(){return n}})},63922:function(e){e.exports={VertigoWidgetClient:"vertigo_VertigoWidgetClient__tDfOf",BgBlur:"vertigo_BgBlur__WC2S2"}}}]);