(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[686],{25453:function(e,t,n){"use strict";var r=n(87932);function a(){}function o(){}o.resetWarningCache=a,e.exports=function(){function e(e,t,n,a,o,i){if(i!==r){var c=Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw c.name="Invariant Violation",c}}function t(){return e}e.isRequired=e;var n={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:o,resetWarningCache:a};return n.PropTypes=n,n}},20873:function(e,t,n){e.exports=n(25453)()},87932:function(e){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},14122:function(e,t,n){var r,a,o;o=function(e,t,n,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function o(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(o=function(e){return e?n:t})(e)}Object.defineProperty(e,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(e,{BlockMath:()=>u,InlineMath:()=>f}),t=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var n=o(void 0);if(n&&n.has(e))return n.get(e);var r={},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&Object.prototype.hasOwnProperty.call(e,i)){var c=a?Object.getOwnPropertyDescriptor(e,i):null;c&&(c.get||c.set)?Object.defineProperty(r,i,c):r[i]=e[i]}return r.default=e,n&&n.set(e,r),r}(t),n=a(n),r=a(r);let i=(e,{displayMode:a})=>{let o=({children:n,errorColor:o,math:i,renderError:c})=>{let l=null!=i?i:n,{html:s,error:u}=(0,t.useMemo)(()=>{try{return{html:r.default.renderToString(l,{displayMode:a,errorColor:o,throwOnError:!!c}),error:void 0}}catch(e){if(e instanceof r.default.ParseError||e instanceof TypeError)return{error:e};throw e}},[l,o,c]);return u?c?c(u):t.default.createElement(e,{html:`${u.message}`}):t.default.createElement(e,{html:s})};return o.propTypes={children:n.default.string,errorColor:n.default.string,math:n.default.string,renderError:n.default.func},o},c={html:n.default.string.isRequired},l=({html:e})=>t.default.createElement("div",{"data-testid":"react-katex",dangerouslySetInnerHTML:{__html:e}});l.propTypes=c;let s=({html:e})=>t.default.createElement("span",{"data-testid":"react-katex",dangerouslySetInnerHTML:{__html:e}});s.propTypes=c;let u=i(l,{displayMode:!0}),f=i(s,{displayMode:!1})},"object"==typeof e.exports?o(t,n(81406),n(20873),n(76784)):(r=[t,n(81406),n(20873),n(76784)],void 0===(a=o.apply(t,r))||(e.exports=a))},25686:function(e,t,n){"use strict";n.d(t,{Client:function(){return F}});var r=n(41291),a=n(63293),o=n(12030);n(16837);var i=n(14122),c=n(64740),l=n(51845),s=n(13841),u=n(27636),f=n(11315);let p=function(e,t){let{h:n=.3,w:r=1,p:a=3,q:o=1,a:i=.3}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},c=t**o;e.x=(t+i*Math.sin(c*Math.PI*2))*r,e.y=n*Math.pow(Math.sin(c*Math.PI),a)},m="\nvec2 looping(float t, float h, float w, float p, float q, float a) {\n  float t2 = pow(t, q);\n  return vec2(\n    (t + a * sin(t2 * PI * 2.0)) * w,\n    h * pow(sin(t2 * PI), p)\n  );\n}\n\nvec2 looping(float t) {\n  return looping(t, 0.3, 1.0, 3.0, 1.0, 0.3);\n}\n";function d(){let e=(0,o._)(["x(t) = w cdot left( t + a cdot sin(2 pi cdot t^q) \right)"],["x(t) = w \\cdot \\left( t + a \\cdot \\sin(2 \\pi \\cdot t^q) \\right)"]);return d=function(){return e},e}function h(){let e=(0,o._)(["y(t) = h cdot left( sin(pi cdot t^q) \right)^p"],["y(t) = h \\cdot \\left( \\sin(\\pi \\cdot t^q) \\right)^p"]);return h=function(){return e},e}let x=(()=>{let e=new c.Vector2;return function(t){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:300;return Array.from({length:n+1},(r,a)=>(t(e,a/n),"".concat(e.x.toFixed(5),",").concat(e.y.toFixed(5)))).join(" ")}})();function v(){let{samples:e=300,curve:t=(e,t)=>{e.x=t,e.y=t},color:n="#fff"}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=x(t,e),{ref:o}=(0,s.sv)(function*(e){let n=new c.Vector2;yield f.v.current().onTick(r=>{t(n,.5*r.time%1),e.setAttribute("cx",n.x.toFixed(5)),e.setAttribute("cy",n.y.toFixed(5))})},[]);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("polyline",{stroke:n,points:a,opacity:.25}),(0,r.jsx)("circle",{ref:o,cx:0,cy:0,r:.005,fill:n,stroke:"none"})]})}function g(){return(0,r.jsxs)("div",{className:"absolute inset-0 text-sm p-4 pt-12",children:[(0,r.jsx)(i.BlockMath,{math:String.raw(d())}),(0,r.jsx)(i.BlockMath,{math:String.raw(h())})]})}function _(){(0,s.sv)(function*(){yield(0,l.s)(f.v.current().requestActivation)},[]);let e=new c.Vector2(.5,.5),t=new c.Vector2(1,1),n="".concat(e.x-t.x/2-.05," ").concat(e.y-t.y/2-.05," ").concat(t.x+.1," ").concat(t.y+.1);return u.T.reset(),(0,r.jsxs)("div",{className:"relative self-start",children:[(0,r.jsx)(g,{}),(0,r.jsx)("svg",{viewBox:n,width:400,style:{border:"1px solid #fff3",borderRadius:".25em"},children:(0,r.jsxs)("g",{transform:"scale(1, -1) translate(0, -1)",children:[(0,r.jsxs)("g",{stroke:"#fff2",strokeWidth:.002,children:[(0,r.jsx)("line",{x1:-10,x2:10}),(0,r.jsx)("line",{y1:-10,y2:10}),(0,r.jsx)("line",{x1:1,x2:1,y1:-10,y2:10}),(0,r.jsx)("line",{x1:-10,x2:10,y1:1,y2:1})]}),(0,r.jsxs)("g",{id:"curves",stroke:"#fff",fill:"none",strokeWidth:.002,children:[Array.from({length:10},(e,t)=>{let n=u.T.between(3,5),a=u.T.between(1/3,1.5),o=u.T.between(.1,.5),i=u.T.between(.2,.3),c="hsl(".concat(u.T.between(180,360),", 100%, 70%)");return(0,r.jsx)(v,{curve:(e,t)=>p(e,t,{a:i,p:n,h:o,q:a}),color:c},t)}),(0,r.jsx)(v,{curve:p})]})]})})]})}var y=n(783);let b={axis:"x",length:1,radialSegments:6,radius:.01,coneRatio:.1,radiusScale:1,vertexColor:!0,baseCap:"flat",color:"white"},w=new c.Color;function M(e){let{axis:t,length:n,radius:r,radialSegments:a,coneRatio:o,radiusScale:i,vertexColor:l,baseCap:s,color:u}={...b,...e},f=r*i,p=n*o,m=new c.ConeGeometry(3*f,p,a),d=new c.CylinderGeometry(f,f,1,a,1,!0),h=n-p,x=n-.5*p;m.rotateZ(-Math.PI/2).translate(x,0,0),d.scale(1,h,1).rotateZ(-Math.PI/2).translate(.5*h,0,0),console.log({baseCap:s});let v="none"===s?new c.BufferGeometry:"flat"===s?new c.CircleGeometry(f,a).rotateY(-Math.PI/2):new c.SphereGeometry(f,a,3,0,2*Math.PI,0,.5*Math.PI).rotateZ(Math.PI/2).rotateX(Math.PI/2),g=(0,y.n4)([m,d,v]);switch(t){case"y":g.rotateZ(Math.PI/2);break;case"z":g.rotateY(-Math.PI/2)}if(l){let e=g.attributes.position.count,t=new c.BufferAttribute(new Float32Array(3*e),3);g.setAttribute("color",t),w.set(u);for(let n=0;n<e;n++)t.setXYZ(n,w.r,w.g,w.b)}return g}let P={xColor:"#ff3333",yColor:"#33cc66",zColor:"#3366ff"};class S extends c.BufferGeometry{constructor(e){super();let{xColor:t,yColor:n,zColor:r,...a}={...P,...e},o=M({...a,axis:"x",color:t}),i=M({...a,axis:"y",color:n}),c=M({...a,axis:"z",color:r}),l=(0,y.n4)([o,i,c]);this.copy(l),l.dispose()}}class T extends c.ShaderMaterial{constructor(e){let{vertexColors:t=!0,...n}=null!=e?e:{};super({...n,uniforms:{uSunPosition:{value:new c.Vector3(.5,.7,.3)}},vertexColors:t,vertexShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vColor = color;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nuniform vec3 uSunPosition;\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  light = mix(0.1, 1.0, light);\n  gl_FragColor = vec4(vColor * light, 1.0);\n}\n"}),this.sunPosition=this.uniforms.uSunPosition.value}}var j=n(42685),z=n(2164),C=n(74985);function A(e,t,n){return t.add(e),(0,C.N)(e,n),e}function V(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:-1,a=Array.isArray(t)?t.map(e=>new c.Color(e)):[new c.Color(t)],o=e.attributes.position.count,i=new c.BufferAttribute(new Float32Array(3*o),3);e.setAttribute("color",i);let l=r<0?o:r;for(let e=n;e<l;e++){let t=a[e%a.length];i.setXYZ(e,t.r,t.g,t.b)}}class k extends c.Mesh{constructor(){super(new S({xColor:"#ff338b",yColor:"#33cc9c",zColor:"#4e33ff"}),new T)}}class E extends c.Object3D{constructor(){super(),this.axes1=A(new k,this),this.axes2=A(new k,this),this.onTick=e=>{let{deltaTime:t}=e,{axes1:n,axes2:r}=this;n.rotation.y+=.5*t,r.rotation.x+=.5*t};let{axes1:e,axes2:t}=this;e.position.set(-1,0,0),e.rotation.x=-Math.PI/2,t.position.set(1,0,0),t.rotation.x=-Math.PI/2;let n=new c.PlaneGeometry(1,1,1e3,1).translate(.5,.5,0),r=new c.MeshPhysicalMaterial({side:c.DoubleSide,flatShading:!0,emissiveIntensity:.25,emissive:"#ffffff"});A(new c.Mesh(n,r),this);let a={uTime:{get value(){return f.v.current().time}},uWidth:{value:.6},uStartMatrix:{value:e.matrix},uEndMatrix:{value:t.matrix}};r.onBeforeCompile=e=>j.b.with(e).uniforms(a).vertex.top(z.i,m).vertex.top("\n        vec3 bezier3(vec3 a, vec3 b, vec3 c, vec3 d, float t) {\n          vec3 ab = mix(a, b, t);\n          vec3 bc = mix(b, c, t);\n          vec3 cd = mix(c, d, t);  \n          vec3 ab_bc = mix(ab, bc, t);\n          vec3 bc_cd = mix(bc, cd, t);\n          return mix(ab_bc, bc_cd, t);\n        }\n\n        vec3 bezier3_tangent(vec3 a, vec3 b, vec3 c, vec3 d, float t) {\n          return 3.0 * ( \n            (1.0 - t) * (1.0 - t) * (b - a) + \n            2.0 * (1.0 - t) * t * (c - b) + \n            t * t * (d - c));\n        }\n      ").vertex.replace("begin_vertex","\n        vec3 start = uStartMatrix[3].xyz;\n        vec3 end = uEndMatrix[3].xyz;\n\n        vec3 p0 = start;\n        vec3 p1 = mix(start, end, 0.0) + uStartMatrix[2].xyz;\n        vec3 p2 = mix(start, end, 1.0) + uEndMatrix[2].xyz;\n        vec3 p3 = end;\n\n        vec3 up = mix(uStartMatrix[1].xyz, uEndMatrix[1].xyz, position.x);\n        vec3 tangent = bezier3_tangent(p0, p1, p2, p3, position.x);\n        vec3 normal = cross(tangent, up);\n\n        float width = (position.y - 0.5)\n          // * easeInThenOut(position.x, 3.0)\n          * uWidth;\n\n        vec2 loop = looping(position.x);\n\n        vec3 transformed = \n          bezier3(p0, p1, p2, p3, position.x)\n          + tangent * (loop.x - position.x) * 2.0 + normal * loop.y * 2.0\n          + up * width;\n      ").vertex.replace("project_vertex","\n        vec4 mvPosition = vec4( transformed, 1.0 );\n        #ifdef USE_BATCHING\n          mvPosition = batchingMatrix * mvPosition;\n        #endif\n        #ifdef USE_INSTANCING\n          mvPosition = instanceMatrix * mvPosition;\n        #endif\n        mvPosition = modelViewMatrix * mvPosition;\n        gl_Position = projectionMatrix * mvPosition;\n      ")}}let B=(()=>{let e=new c.Vector3(0,1,0),t=new c.Vector3(0,0,-1),n=new c.Vector3,r=new c.Vector3,a=new c.Vector3;return function(o,i){let c=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e,l=arguments.length>3&&void 0!==arguments[3]?arguments[3]:n;r.crossVectors(c,i),1e-6>r.lengthSq()&&r.crossVectors(t,i),r.normalize(),a.crossVectors(i,r).normalize(),o.set(r.x,a.x,i.x,l.x,r.y,a.y,i.y,l.y,r.z,a.z,i.z,l.z,0,0,0,1)}})();var I=n(68392);class O extends c.InstancedMesh{static getGeometry(){if(O._geometry)return O._geometry;let e=new c.CapsuleGeometry(.05,1,1,6).rotateZ(Math.PI/2).translate(.5,0,0);V(e,"#c60613");let t=e.clone().rotateZ(Math.PI/2);V(t,"#01b35a");let n=e.clone().rotateY(-Math.PI/2);return V(n,"#321bc7"),O._geometry=(0,y.n4)([e,t,n]),O._geometry}static getMaterial(){return O._material||(O._material=new c.MeshBasicMaterial({vertexColors:!0}),O._material.onBeforeCompile=e=>j.b.with(e).uniforms(O.uniforms).vertex.replace("begin_vertex","\n        vec3 transformed = vec3(position);\n        transformed *= uSize;\n        #ifdef USE_ALPHAHASH\n          vPosition = vec3(position);\n        #endif\n      ")),O._material}addTo(e){return e.add(this),this}constructor(e,t=.1){super(O.getGeometry(),O.getMaterial(),e.count),this.instanceMatrix=e,this.size=t,this.onBeforeRender=()=>{O.uniforms.uSize.value=this.size}}}O.uniforms={uSize:{value:.1}};class N extends c.Group{constructor(){var e,t;super(),u.T.reset();let n=new c.HemisphereLight("#ffffff","#926969",1);this.add(n);let r=new c.DirectionalLight("#ffffff",2);this.add(r),r.position.set(2,4,1);let a=new c.IcosahedronGeometry(1,1),o=a.clone(),i=new c.Points(a,new c.PointsMaterial({size:.05}));this.add(i);let l=new c.Points(o,new c.PointsMaterial({size:.05}));this.add(l),l.position.set(0,0,-8),l.rotation.set(0,0,.66*Math.PI),this.onTick=e=>{let{deltaTime:t,time:n}=e;l.position.y=.5*Math.sin(.33*n),l.rotation.x+=.1*t,l.rotation.y+=.1*t,l.rotation.z+=.1*t};let s=a.attributes.position.count,p=new c.InstancedMesh(new c.PlaneGeometry(1,1,1e3,1).translate(.5,.5,0),new c.MeshPhysicalMaterial({side:c.DoubleSide,flatShading:!0}),s);this.add(p);let d=new c.InstancedBufferAttribute(new Float32Array(16*s),16),h=new c.InstancedBufferAttribute(new Float32Array(16*s),16);p.geometry.setAttribute("aStartMat",d),p.geometry.setAttribute("aEndMat",h),p.frustumCulled=!1;let x=new c.Matrix4,v=new c.Vector3(0,1,0),g=new c.Vector3,_=new c.Vector3,y=new c.Color;for(let e=0;e<s;e++)g.fromBufferAttribute(a.attributes.position,e),_.copy(g),B(x,_,v,g),x.toArray(d.array,16*e),g.fromBufferAttribute(o.attributes.position,e),B(x,_,v,g),x.toArray(h.array,16*e),y.set("hsl(".concat(u.T.between(180,360),", 100%, 70%)")),p.setColorAt(e,y);let b={uTime:{get value(){return f.v.current().time}},uWorldStartMatrix:{value:i.matrix},uWorldEndMatrix:{value:l.matrix},uWidth:{value:.2}};p.material.onBeforeCompile=e=>j.b.with(e).uniforms(b).vertex.top(I.U,z.i,m).vertex.top("\n      attribute mat4 aStartMat;\n      attribute mat4 aEndMat;\n\n      float rand(vec3 p) {\n        p = fract(p * vec3(443.8975, 441.4236, 437.1954));  // Scale and modulate each component\n        p += dot(p, p.yzx + 19.19);  // Dot product with a shifted version of itself\n        return fract((p.x + p.y) * p.z);  // Compute a pseudo-random float\n      }\n\n      float rand(vec3 p, float rangeMin, float rangeMax) {\n        return mix(rangeMin, rangeMax, rand(p));\n      }\n\n      vec3 bezier3(vec3 a, vec3 b, vec3 c, vec3 d, float t) {\n        t = clamp(t, 0.0, 1.0);\n        vec3 ab = mix(a, b, t);\n        vec3 bc = mix(b, c, t);\n        vec3 cd = mix(c, d, t);  \n        vec3 ab_bc = mix(ab, bc, t);\n        vec3 bc_cd = mix(bc, cd, t);\n        return mix(ab_bc, bc_cd, t);\n      }\n\n      vec3 bezier3_tangent(vec3 a, vec3 b, vec3 c, vec3 d, float t) {\n        t = clamp(t, 0.0, 1.0);\n        return 3.0 * ( \n          (1.0 - t) * (1.0 - t) * (b - a) + \n          2.0 * (1.0 - t) * t * (c - b) + \n          t * t * (d - c));\n      }\n    ").vertex.replace("begin_vertex","\n      mat4 startMat = uWorldStartMatrix * aStartMat;\n      mat4 endMat = uWorldEndMatrix * aEndMat;\n\n      vec3 start = startMat[3].xyz;\n      vec3 end = endMat[3].xyz;\n      \n      float dt = mix(-.33, 1.0, fract(uTime * .33 + rand(start) * 0.4));\n      float t = position.x * .33 + dt;\n      t = clamp(t, 0.0, 1.0);\n      float d = distance(start, end);\n\n      vec3 p0 = start;\n      vec3 p1 = mix(start, end, 0.2) + d * 0.1 * startMat[2].xyz;\n      vec3 p2 = mix(start, end, 0.8) + d * 0.1 * endMat[2].xyz;\n      vec3 p3 = end;\n      \n      // p1 = mix(start, end, 0.33);\n      // p2 = mix(start, end, 0.66);\n\n      vec3 normal = mix(startMat[2].xyz, endMat[2].xyz, t);\n      vec3 up = mix(startMat[1].xyz, endMat[1].xyz, t);\n      vec3 tangent = bezier3_tangent(p0, p1, p2, p3, t);\n\n      float width = (position.y - 0.5)\n        * easeInThenOut(t, 6.0)\n        * easeInThenOut((t - dt) / .33, 3.0)\n        * uWidth;\n      \n      float loopT = inverseLerp(0.0, 0.66, t);\n\n      vec2 loop = looping(loopT, 0.3, 1.0, 3.0, rand(start, 0.6, 1.6), 0.3);\n      // loop = vec2(t, 0.0);\n\n      vec3 transformed = \n        bezier3(p0, p1, p2, p3, t)\n        + tangent * (loop.x - loopT) * d * 0.066 + normal * loop.y * d * 1.0\n        + up * width;\n      \n      #ifdef USE_ALPHAHASH\n        vPosition = transformed;\n      #endif\n    ").vertex.replace("beginnormal_vertex","\n      vec3 objectNormal = vec3(normal);\n\n      #ifdef USE_TANGENT\n        vec3 objectTangent = vec3(tangent.xyz);\n      #endif\n    "),a.computeBoundingBox(),a.computeBoundingSphere(),o.computeBoundingBox(),o.computeBoundingSphere(),p.computeBoundingBox(),null===(e=p.boundingBox)||void 0===e||e.copy(a.boundingBox.clone()).union(o.boundingBox).expandByScalar(1),p.computeBoundingSphere(),null===(t=p.boundingSphere)||void 0===t||t.copy(a.boundingSphere.clone()).union(o.boundingSphere).expandByPoint(new c.Vector3().setScalar(1)),p.geometry.computeBoundingBox=()=>{},p.geometry.computeBoundingSphere=()=>{},i.visible=!1,l.visible=!1}}function W(){return(0,a._v)("ThreeDemo",async function*(e,t){t.useOrbitControls({position:[6,4,7],target:[.4,1.6,-.8]}),e.add(new c.GridHelper(10,10,"#5c4f7d","#352945"));let n=new E;n.position.set(-5,0,0),yield t.onTick(n.onTick),e.add(n);let r=new N;r.position.set(0,0,0),yield t.onTick(r.onTick),e.add(r)},[]),null}function F(){return(0,r.jsxs)("div",{className:"absolute-through p-4 flex flex-col gap-4",children:[(0,r.jsx)("div",{className:"absolute-through",children:(0,r.jsx)(a.H7,{children:(0,r.jsx)(W,{})})}),(0,r.jsx)("h1",{className:"text-4xl",children:"Path with loop"}),(0,r.jsx)(_,{})]})}},42685:function(e,t,n){"use strict";n.d(t,{b:function(){return _},R:function(){return b}});var r=n(12030),a=n(64740);let o=["common","uv_pars_vertex","displacementmap_pars_vertex","color_pars_vertex","fog_pars_vertex","normal_pars_vertex","morphtarget_pars_vertex","skinning_pars_vertex","shadowmap_pars_vertex","logdepthbuf_pars_vertex","clipping_planes_pars_vertex","uv_vertex","color_vertex","morphcolor_vertex","beginnormal_vertex","morphnormal_vertex","skinbase_vertex","skinnormal_vertex","defaultnormal_vertex","normal_vertex","begin_vertex","morphtarget_vertex","skinning_vertex","displacementmap_vertex","project_vertex","logdepthbuf_vertex","clipping_planes_vertex","worldpos_vertex","shadowmap_vertex","fog_vertex","common","packing","dithering_pars_fragment","color_pars_fragment","uv_pars_fragment","map_pars_fragment","alphamap_pars_fragment","alphatest_pars_fragment","alphahash_pars_fragment","aomap_pars_fragment","lightmap_pars_fragment","emissivemap_pars_fragment","iridescence_fragment","cube_uv_reflection_fragment","envmap_common_pars_fragment","envmap_physical_pars_fragment","fog_pars_fragment","lights_pars_begin","normal_pars_fragment","lights_physical_pars_fragment","transmission_pars_fragment","shadowmap_pars_fragment","bumpmap_pars_fragment","normalmap_pars_fragment","clearcoat_pars_fragment","iridescence_pars_fragment","roughnessmap_pars_fragment","metalnessmap_pars_fragment","logdepthbuf_pars_fragment","clipping_planes_pars_fragment","clipping_planes_fragment","logdepthbuf_fragment","map_fragment","color_fragment","alphamap_fragment","alphatest_fragment","alphahash_fragment","roughnessmap_fragment","metalnessmap_fragment","normal_fragment_begin","normal_fragment_maps","clearcoat_normal_fragment_begin","clearcoat_normal_fragment_maps","emissivemap_fragment","lights_physical_fragment","lights_fragment_begin","lights_fragment_maps","lights_fragment_end","aomap_fragment","transmission_fragment","opaque_fragment","tonemapping_fragment","colorspace_fragment","fog_fragment","premultiplied_alpha_fragment","dithering_fragment"];var i=n(99316);class c{static from(e,t){if(t instanceof i.Observable){if("number"==typeof t.value)return new c(e,t);throw Error("Observable value must be a number")}let n=typeof t;return"object"===n&&t.constructor===Object&&"value"in t?new c(e,t):"string"===n?new c(e,{value:new a.Color(t)}):new c(e,{value:t})}get value(){return this.target.value}computeDeclaration(){let e=this.name,t=this.target.value;if("number"==typeof t)return"uniform float ".concat(e,";");if(t.isVector2)return"uniform vec2 ".concat(e,";");if(t.isVector3||t.isColor)return"uniform vec3 ".concat(e,";");if(t.isVector4||t.isQuaternion)return"uniform vec4 ".concat(e,";");if(t.isMatrix3)return"uniform mat3 ".concat(e,";");if(t.isMatrix4)return"uniform mat4 ".concat(e,";");if(t.isTexture)return t.isCubeTexture?"uniform samplerCube ".concat(e,";"):"uniform sampler2D ".concat(e,";");if(t instanceof Float32Array)return"uniform float ".concat(e,"[").concat(t.length,"];");throw console.log("unhandled value:",t),Error('unhandled value: "'.concat(null==t?void 0:t.constructor.name,'"'))}constructor(e,t){this.name=e,this.target=t}}function l(){let e=(0,r._)(["","s*",""],["","\\s*",""]);return l=function(){return e},e}let s=null,u=e=>(s=e,_),f="// ShaderForge (injected code) ->",p="// <- ShaderForge",m=e=>"".concat(f,"\n").concat(e.trim(),"\n").concat(p),d=e=>{let t=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),n=RegExp(String.raw(l(),t(p),t(f)),"g");return e.replaceAll(n,"")};class h{getPattern(e){let{throwError:t=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n="#include <".concat(e,">"),r=this.type;if(t&&!1===s[r].includes(n))throw Error('"'.concat(n,'" is not present in the shader template program.'));return{pattern:n,type:r}}replace(e,t){let{type:n,pattern:r}=this.getPattern(e),a=m(t);return s[n]=s[n].replace(r,a),_}inject(e,t,n){let{type:r,pattern:a}=this.getPattern(t),o="after"===e?"".concat(a,"\n").concat(m(n)):"".concat(m(n),"\n").concat(a);return s[r]=s[r].replace(a,o),_}injectTokenComments(){for(let e of o){let{type:t,pattern:n}=this.getPattern(e,{throwError:!1});s[t]=s[t].replace(n,"\n        ".concat(n,"\n        // ShaderForge TOKEN: ").concat(e,"\n      "))}return _}header(e){let t=this.type;return s[t]="".concat(e,"\n").concat(s[t]),_}before(e,t){return this.inject("before",e,t)}after(e,t){return this.inject("after",e,t)}top(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return s[this.type]=s[this.type].replace("void main() {","\n      ".concat(m(t.join("\n\n")),"\n      void main() {\n    ")),_}mainBeforeAll(e){return s[this.type]=s[this.type].replace("void main() {","void main() {\n        ".concat(m(e))),_}mainAfterAll(e){return s[this.type]=s[this.type].replace(/}\s*$/,"\n      ".concat(m(e),"\n    }")),_}uniforms(e){if("string"==typeof e)this.top(e);else{let t=[];for(let[n,r]of Object.entries(e)){let e=c.from(n,r);t.push(e.computeDeclaration())}this.top(t.join("\n")),x(e)}return _}clean(){return s[this.type]=d(s[this.type]),_}printFinalCode(){return console.log(s[this.type].replace(/#include <(.*)>/g,(e,t)=>{let n=a.ShaderChunk[t];if(!n)throw Error('Shader chunk "'.concat(t,'" not found'));return n})),_}constructor(e){this.type=e}}let x=e=>{for(let[t,n]of Object.entries(e)){let e=c.from(t,n);if(t in s.uniforms){if(e.value!==s.uniforms[t].value)throw Error("Shader redefinition! (Uniform values are not equal)")}else s.uniforms[t]=e}return _},v=new h("fragmentShader"),g=new h("vertexShader"),_=Object.assign(function(e){return e&&u(e),_},{defines:e=>(s.defines?Object.assign(s.defines,e):s.defines=e,_),uniforms:e=>(g.uniforms(e),v.uniforms(e),_),varying:function(e){let t="";if("string"==typeof e)t=e;else{let n=[];for(let[t,r]of Object.entries(e))n.push("varying ".concat(r," ").concat(t,";"));t=n.join("\n")}return g.top(t),v.top(t),_},vertex:g,fragment:v,header:e=>(v.header(e),g.header(e),_),clean:()=>(v.clean(),g.clean(),_),with:u,wrap:(e,t)=>(e.onBeforeCompile=e=>{s=e},e)}),y=new a.Color;function b(e){let{r:t,g:n,b:r}=y.set(e);return"vec3(".concat(t.toFixed(3),", ").concat(n.toFixed(3),", ").concat(r.toFixed(3),")")}},74985:function(e,t,n){"use strict";n.d(t,{N:function(){return i}});var r=n(64740),a=n(73437);new r.Vector3(0,0,0),new r.Euler(0,0,0,"XYZ"),new r.Vector3(1,1,1);let o={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,rotationOrder:"XYZ",rotationUnit:"rad",scaleX:1,scaleY:1,scaleZ:1,scaleScalar:1,visible:!0};function i(e,t){let{x:n,y:i,z:c,position:l=new r.Vector3(n,i,c),rotationX:s,rotationY:u,rotationZ:f,rotationOrder:p,rotationUnit:m,rotation:d,scaleX:h,scaleY:x,scaleZ:v,scaleScalar:g,scale:_=new r.Vector3(h,x,v).multiplyScalar(g),visible:y}={...o,...t};return(0,a.hA)(l,e.position),(0,a.Xx)(null!=d?d:[s,u,f,m,p],e.rotation),(0,a.hA)(_,e.scale),e.visible=y,e}},18647:function(e,t,n){"use strict";n.d(t,{C:function(){return a}});let r={vecX:["float","vec2","vec3","vec4"]},a=(e,t)=>{let n=[],a=Array.isArray(e)?e:[e].map(e=>e in r?r[e]:e).flat();if("function"==typeof t)for(let e of a)n.push(t(e).replaceAll(/\bT\b/g,e));else for(let e of a)n.push(t.replaceAll(/\bT\b/g,e));return n.join("\n")}},68392:function(e,t,n){"use strict";n.d(t,{U:function(){return o}});var r=n(85692),a=n(18647);let o="\n  ".concat(r.l,"\n\n  float sin01(float x) {\n    return 0.5 + 0.5 * sin(x * 6.283185307179586);\n  }\n\n  vec2 scaleAround(vec2 p, vec2 c, float s) {\n    return c + (p - c) / s;\n  }\n\n  // Same as mix, but clamped.\n  ").concat((0,a.C)("vecX","\n    T lerp(in T a, in T b, in float x) {\n      return mix(a, b, clamp01(x));\n    }\n  "),"\n\n  float inverseLerpUnclamped(in float a, in float b, float x) {\n    return (x - a) / (b - a);\n  }\n\n  float inverseLerp(in float a, in float b, float x) {\n    return clamp01((x - a) / (b - a));\n  }\n\n  float threshold(in float x, in float thresholdValue) {\n    return x < thresholdValue ? 0. : 1.;\n  }\n\n  float threshold(in float x, in float thresholdValue, in float width) {\n    return width < 1e-9 \n      ? (x < thresholdValue ? 0. : 1.)\n      : clamp01((x - thresholdValue + width * .5) / width);\n  }\n\n  mat3 extractRotation(mat4 matrix) {\n    return mat3(matrix[0].xyz, matrix[1].xyz, matrix[2].xyz);\n  }\n\n  vec2 rotate(vec2 p, float a) {\n    float c = cos(a);\n    float s = sin(a);\n    float x = c * p.x + s * p.y;\n    float y = -s * p.x + c * p.y;\n    return vec2(x, y);\n  }\n\n  vec2 rotateAround(vec2 p, float a, vec2 c) {\n    return c + rotate(p - c, a);\n  }\n\n  vec2 rotateScaleAround(vec2 p, float a, float s, vec2 c) {\n    return c + rotate((p - c) / s, a);\n  }\n  \n  float positiveModulo(float x) {\n    x = mod(x, 1.0);\n    return x < 0.0 ? x + 1.0 : x;\n  }\n\n  float positiveModulo(float x, float modulo) {\n    x = mod(x, modulo);\n    return x < 0.0 ? x + modulo : x;\n  }\n\n  // Limit a value to a maximum that the function tends to reach when x -> ∞\n  // https://www.desmos.com/calculator/0vewkbnscu\n  float limited(float x, float maxValue) {\n    return x <= 0.0 ? x : maxValue * x / (maxValue + x);\n  }\n\n  // https://www.desmos.com/calculator/0vewkbnscu\n  float limited(float x, float minValue, float maxValue) {\n    float d = maxValue - minValue;\n    float xd = x - minValue;\n    return x <= minValue ? x : minValue + d * xd / (d + xd);\n  }\n\n  float sqLength(in vec2 p) {\n    return p.x * p.x + p.y * p.y;\n  }\n\n  float sqLength(in vec3 p) {\n    return p.x * p.x + p.y * p.y + p.z * p.z;\n  }\n\n  ").concat((0,a.C)("vecX","\n    T min3(in T a, in T b, in T c) {\n      return min(min(a, b), c);\n    }\n  "),"\n\n  ").concat((0,a.C)("vecX","\n    T min4(in T a, in T b, in T c, in T d) {\n      return min(min(a, b), min(c, d));\n    }\n  "),"\n")},16837:function(){},12030:function(e,t,n){"use strict";function r(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}n.d(t,{_:function(){return r}})}}]);