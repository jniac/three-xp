(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9697],{40864:function(e,t,n){Promise.resolve().then(n.t.bind(n,62670,23)),Promise.resolve().then(n.bind(n,93342))},93342:function(e,t,n){"use strict";n.d(t,{Client:function(){return O}});var r=n(78485),i=n(52471),o=n(13025),a=n(86818),s=n(63221),l=n(63549),c=n(49635),u=n(87858),f=n(28142),d=n(96966),p=n(4917),h=n(8834),v=n(81796),m=n(73583),w=n(77405);class g{constructor(e,t,n,r){this.space=e,this.rect=t,this.uvRect=n,this.scatterCoeff=r,this.r0=f.T.random(),this.r1=f.T.random()}}class y{constructor(e,t){this.props={...y.defaultProps,...t};let{position:n,size:r,scatterPadding:i,sizeOptions:o,seed:a}=this.props,{col:s,row:l}=e.props;f.T.seed(a);let c=f.T.createPicker(o),u=Array.from({length:s}).map(c),d=Array.from({length:l}).map(c),{x:p,y:h}=(0,v.iK)(n),{x:x,y:M}=(0,v.iK)(r),S=new m.T(m.Nm.Horizontal).setSize(x,M).setOffset(p-x/2,h-M/2);for(let e of u){let t=new m.T(m.Nm.Vertical).setSize("".concat(e,"fr")).addTo(S);for(let e of d)new m.T(m.Nm.Horizontal).setSize("".concat(e,"fr")).addTo(t)}S.computeLayout();let b=S.rect,z=[...S.allLeaves({includeSelf:!1})],A=(x+M)/2,P=z.map(e=>{let t=e.rect.clone(),n=t.clone().relativeTo(b),{x:r,y:o}=t.getCenter(),a=(0,w.ii)(.5,1,(Math.abs(r-p)+Math.abs(o-h))/A);return t.centerX+=f.T.between(-i,i)*a,t.centerY+=f.T.between(-i,i)*a,new g(e,t,n,a)});this.root=S,this.nodes=P}}y.defaultProps={seed:87654,position:new i.Vector2(0,0),size:new i.Vector2(3,2),scatterPadding:.1,sizeOptions:[[.5,1],[1,10],[2,2],[3,1]]};var x=n(88156),M=n(44645),S=n(47174),b=n(1060),z=n(98828),A=n(83018),P=n(58648);class D extends i.Object3D{constructor(){super();let e=new i.HemisphereLight("#ffffff","#926969",1);this.add(e);let t=new i.DirectionalLight("#ffffff",2);this.add(t),t.position.set(2,4,1)}}class V extends i.MeshBasicMaterial{get mapAspect(){return this.uniforms.uMapInfo.value.x}set mapAspect(e){this.uniforms.uMapInfo.value.x=e}getScatteredSize(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new i.Vector2;return e.x=this.uniforms.uScatteredInfo.value.x,e.y=this.uniforms.uScatteredInfo.value.y,e}setScatteredSize(e){this.uniforms.uScatteredInfo.value.x=e.x,this.uniforms.uScatteredInfo.value.y=e.y}get scatteredSize(){return this.getScatteredSize()}set scatteredSize(e){this.setScatteredSize(e)}update(e){e*=.33,this.uniforms.uDispersionTime.value+=e*this.uniforms.uDispersion.value.x,this.uniforms.uLowDispersionTime.value+=e*this.uniforms.uLowDispersion.value.x}constructor(){super({side:i.DoubleSide}),this.uniforms={uDispersionTime:{value:0},uLowDispersionTime:{value:0},uDispersion:{value:new i.Vector4(1,-.6,.4,2)},uLowDispersion:{value:new i.Vector4(0,-.6,.4,0)},uMainParams:{value:new i.Vector4(1,0)},uCenter:{value:new i.Vector3},uMapInfo:{value:new i.Vector4(1,1,.5,.5)},uScatteredInfo:{value:new i.Vector4(1,1,0,0)},uNormalMap:{value:M.R.get("three").loadTexture("textures/rough_concrete_nor_gl_1k.jpg",e=>{e.wrapS=e.wrapT=i.RepeatWrapping})}},this.userData=function(e,t){for(let[n,r,i,o]of t)Object.defineProperty(e,"".concat(n,"_meta"),{enumerable:!0,value:o}),Object.defineProperty(e,n,{enumerable:!0,get:()=>r[i],set(e){r[i]=e}});return e}({},[["chunkScale",this.uniforms.uMainParams.value,"x","\n        Name(chunk.scale)\n        Slider(0, 1, step: any)\n      "],["imageVisibility",this.uniforms.uMainParams.value,"y","\n        Name(image.visibility)\n        Slider(0, 1, step: any)\n      "],["dispX",this.uniforms.uDispersion.value,"x","\n        Name(disp.x)\n        Slider(0, 1, step: any)\n      "],["dispY",this.uniforms.uDispersion.value,"y","\n        Name(disp.y)\n        Slider(-1, 1, step: any)\n      "],["dispZ",this.uniforms.uDispersion.value,"z","\n        Name(disp.z)\n        Slider(-1, 1, step: any)\n      "],["dispW",this.uniforms.uDispersion.value,"w","\n        Name(disp.cycle)\n        Slider(1, 20, step: 1)\n      "],["lowDispX",this.uniforms.uLowDispersion.value,"x","\n        Name(lowDisp.x)\n        Slider(0, 1, step: any)\n      "]]),this.onBeforeCompile=e=>S.b.with(e).defines({USE_UV:""}).uniforms(this.uniforms).varying({vRand:"vec4"}).vertex.top(z.U,b.i,'\n  // sizeMode: 0 for "contain", 1 for "cover"\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, vec2 scale) {\n    align.y = 1.0 - align.y; // Flip y-coordinate\n    if ((outerAspect > innerAspect) != (sizeMode == 1.0)) { // XOR condition for mode\n      float scaleFactor = outerAspect / innerAspect;\n      uv.x = (uv.x - align.x) * scaleFactor + align.x; // Adjust x-coordinate\n    } else {\n      float scaleFactor = innerAspect / outerAspect;\n      uv.y = (uv.y - align.y) * scaleFactor + align.y; // Adjust y-coordinate\n    }\n    uv = (uv - align) / scale + align;\n    return uv;\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, float scale) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, align, vec2(scale));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, align, vec2(1.0));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, vec2(0.5));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect) {\n    return applyUvSize(uv, outerAspect, innerAspect, 1.0);\n  }\n').vertex.top("\n        attribute vec4 aRectUv;\n        attribute vec4 aRand;\n      ").vertex.top("\n        vec2 delta;\n        float scatterRatio;\n\n        vec4 computeDispersion() {\n          if (uDispersion.x == 0.0) {\n            return vec4(0.0, 0.0, 0.0, 1.0);\n          }\n\n          float duration = lerp(8.0, 1.0, aRand.x * aRand.y * aRand.z);\n          float cycleCount = max(floor(uDispersion.w), 1.0);\n          float time = mod(uDispersionTime + duration * cycleCount * aRand.x, duration * cycleCount) / duration;\n          float cycleVisibility = time <= 1.0 ? 1.0 : easeInOut3(1.0 - inverseLerp(.8 * aRand.w + .1, .8 * aRand.w + .2, uDispersion.x));\n          time = mod(time, 1.0);\n          float size = easeInThenOut(time, 8.0) * lerp(2.0, 1.0, time * time) * cycleVisibility;\n          size = mix(1.0, size, pow(uDispersion.x, 1.0 / 2.0));\n\n          // Apply scale before instanceMatrix (shrinking).\n          vec3 dispersed;\n          dispersed.xy = -delta * lerp(uDispersion.y, uDispersion.z, time);\n          dispersed.z = lerp(1.0, 0.0, time);\n          dispersed *= uDispersion.x;\n\n          return vec4(dispersed, size);\n        }\n\n        float getStartEffect(float time, float duration) {\n          return min(1.0, time / duration);\n        }\n\n        float getEndEffect(float time, float timeMax, float duration) {\n          return max(0.0, time - (timeMax - duration)) / duration;\n        }\n\n        vec4 computeLowDispersion() {\n          if (uLowDispersion.x == 0.0) {\n            return vec4(0.0, 0.0, 0.0, 1.0);\n          }\n\n          float periodScalarT = inverseLerp(0.1, 0.9, scatterRatio);\n          float period = lerp(2.0, 8.0, aRand.x) * lerp(60.0, 1.0, periodScalarT);\n          float time = mod(uLowDispersionTime + period * aRand.z, period);\n\n          float duration = 1.0;\n          float effectStart = min(1.0, time);\n          float effectEnd = getEndEffect(time, period, duration);\n\n          float size = getStartEffect(time, 0.3) * (1.0 - getEndEffect(time, period, 0.3));\n          size = pow(size, 1.0 / 4.0);\n          size = mix(1.0, size, pow(uLowDispersion.x, 1.0 / 4.0));\n\n          vec3 dispersed;\n\n          dispersed.xy = delta * 0.1;\n          dispersed.z = 0.2;\n          dispersed.xyz *= getEndEffect(time, period, 1.0);\n          dispersed *= uLowDispersion.x;\n\n          return vec4(dispersed, size);\n        }\n      ").vertex.replace("project_vertex","\n        vec4 mvPosition = vec4(position, 1.0);\n        delta = instanceMatrix[3].xy - uCenter.xy;\n        scatterRatio = clamp(1.1 * length(delta) / (length(uScatteredInfo.xy) / 2.0), 0.0, 1.0);\n\n        vec4 dispersion = computeDispersion();\n        vec4 lowDispersion = computeLowDispersion();\n\n        float scale = clamp01(uMainParams.x * 3.0 - 2.0 * aRand.w);\n        mvPosition.xyz *= dispersion.w * lowDispersion.w * easeInOut3(scale);\n\n        mvPosition = instanceMatrix * mvPosition;\n        mvPosition.xyz += dispersion.xyz + lowDispersion.xyz;\n\n        mvPosition = modelViewMatrix * mvPosition;\n        gl_Position = projectionMatrix * mvPosition;      \n      ").vertex.replace("uv_vertex","\n        #if defined( USE_UV ) || defined( USE_ANISOTROPY )\n          vUv = vec3( uv, 1 ).xy;\n          vUv = aRectUv.xy + aRectUv.zw * vUv;\n        #endif\n        #ifdef USE_MAP\n          vec2 instanceUv = aRectUv.xy + aRectUv.zw * MAP_UV;\n\n          // vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, vec2 scale\n          float outerAspect = uScatteredInfo.x / uScatteredInfo.y;\n          float innerAspect = uMapInfo.x;\n          float sizeMode = uMapInfo.y;\n          vec2 align = uMapInfo.zw;\n          instanceUv = applyUvSize(instanceUv, outerAspect, innerAspect, sizeMode, align, vec2(1.0));\n          \n          vMapUv = ( mapTransform * vec3( instanceUv, 1 ) ).xy;\n        #endif\n      ").vertex.mainAfterAll("\n        vRand = aRand;\n      ").fragment.top(z.U,b.i).fragment.replace("color_fragment","\n        vec3 normal = texture2D(uNormalMap, vUv * 4.0).rgb;\n        vec3 light = normalize(vec3(0.5, 2.5, 1.0));\n        float colorAlteration = mix(0.333, 1.0, dot(normal, light));\n        float transition = inverseLerp(0.0, 0.2, uMainParams.y - 0.8 * vRand.w);\n        diffuseColor.rgb = mix(vColor * colorAlteration, diffuseColor.rgb, transition);\n      ")}}class C extends i.Object3D{static createPlane(e){let{row:t,col:n}=e,r=t*n,o=new i.PlaneGeometry,a=new i.InstancedBufferAttribute(new Float32Array(4*r),4);o.setAttribute("aRectUv",a);let s=new i.InstancedBufferAttribute(new Float32Array(4*r),4);o.setAttribute("aRand",s);for(let e=0;e<r;e++)s.setXYZW(e,f.T.random(),f.T.random(),f.T.random(),f.T.random());let l=new V,c=new i.InstancedMesh(o,l,r);return c.name="plane",c}get count(){return this.internal.count}onTick(e){this.internal.plane.material.update(e.deltaTime)}getDistribution(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new y(this,e)}drawDistribution(e){let{position:t,size:n,scatterPadding:r}=e.props,{x:i,y:o}=(0,v.iK)(t),{x:a,y:s}=(0,v.iK)(n);this.internal.lineHelper.rectangle([i,o,a,s]).rectangle([i,o,a+2*r,s+2*r])}distribute(e){let{count:t,plane:n}=this.internal,{aRectUv:r}=n.geometry.attributes;for(let i=0;i<t;i++){let{rect:t,uvRect:o}=e.nodes[i];n.setMatrixAt(i,(0,c.$)({position:t.getCenter(),scale:t.getSize()})),r.setXYZW(i,o.x,o.y,o.width,o.height)}n.material.setScatteredSize(e.root.rect.getSize());let i=e.root.rect;n.material.setScatteredSize(i.getSize()),n.material.uniforms.uCenter.value.copy(i.getCenter())}lerpDistribute(e,t,n){let{count:r,plane:o}=this.internal,{aRectUv:a}=o.geometry.attributes,s=new P.Ae,l=new P.Ae,u=new P.Ae,f=new i.Vector3,d=new i.Vector3;for(let i=0;i<r;i++){let r=e.nodes[i],u=t.nodes[i],p=.3*(1-r.r0*(r.scatterCoeff+.2*u.r0)),h=(0,w.ii)(p,.7+p,n),v=(0,A.xD)(h);s.lerpRectangles(r.rect,u.rect,v),l.lerpRectangles(r.uvRect,u.uvRect,v),o.setMatrixAt(i,(0,c.$)({position:s.getCenter(f),scale:s.getSize(d),rotationY:(u.r0<.5?0:1)*v*Math.PI*2,rotationZ:.3*Math.sin(h*Math.PI)*(-1+2*r.r0)})),a.setXYZW(i,l.x,l.y,l.width,l.height)}let p=(0,A.uN)((0,w.ii)(.3,.7,n));u.lerpRectangles(e.root.rect,t.root.rect,p),o.material.setScatteredSize(u.getSize()),o.material.uniforms.uCenter.value.copy(u.getCenter()),o.instanceMatrix.needsUpdate=!0,a.needsUpdate=!0}constructor(e={}){super(),this.transition=0;let t={...C.defaultProps,...e},{col:n,row:r}=t,i=C.createPlane(t);(0,u.bB)(i,this);let o=new x.O;(0,u.bB)(o,this);let a=new D;(0,u.bB)(a,this),this.internal={count:r*n,plane:i,lineHelper:o,lightSetup:a},this.props=t,this.distribute(this.getDistribution())}}C.displayName="ScatteredPlane",C.defaultProps={row:20,col:30,imageAspect:1,imageResizeMode:"cover"},C.transition_meta="Range(0, 1)";class R extends i.Mesh{constructor(){super(new i.IcosahedronGeometry(40,1),new i.MeshBasicMaterial({color:"#aeb4e9",side:i.BackSide})),this.onBeforeRender=(e,t,n)=>{this.position.copy(n.position)}}}let T={darkBlue:"#002c52",orange:"#ff5c35",white:"#ffffff",lightGrey:"#c9cfd3"};function I(){let e=(0,a.jE)();return e.three.pipeline.basicPasses.outline.enabled=!1,(0,p._v)("ScatteredDemo",async function*(t,n){(0,u.bB)(new R,t),(0,u.bB)(new i.Mesh(new s.w,new l.P),t);let r=await n.loader.load("/assets/textures/DebugTexture.png");r.colorSpace=i.SRGBColorSpace;let a=(0,u.bB)(new C,t);a.internal.plane.material.map=r,a.internal.plane.material.mapAspect=r.image.width/r.image.height;let d=a.getDistribution({seed:4789,position:[-2,0],size:[2,3]}),p=a.getDistribution({seed:3249,position:[2,0],size:[2,4]});a.drawDistribution(d),a.drawDistribution(p),t.userData.transition=0,t.userData.transition_meta="Slider(0, 1, step: 0.01)",t.userData.scale=1,t.userData.scale_meta="Slider(-1, 1, pow: 10, step: .1)",t.userData.links=[a.internal.plane.material.userData];let h=Object.values(T);for(let e=0,t=a.count;e<t;e++)a.internal.plane.setColorAt(e,(0,c.E)(f.T.pick(h)));yield n.onTick(()=>{a.lerpDistribute(d,p,t.userData.transition),a.scale.setScalar(t.userData.scale)}),(0,o.v)(e,t),e.sceneSelection.add("Select ScatteredDemo",t)},[]),null}function U(){return(0,p.Ky)(function*(e){e.useOrbitControls({position:[-2,0,8],target:[-2,0,0]})},[]),null}function j(e){let{children:t}=e,n=(0,p.Ky)();return n.loader.setPath(d.v.assetsPath),(0,r.jsx)(a.KU,{three:n,backgroundColor:"#26163c4f",children:t})}function O(){return(0,r.jsxs)("div",{className:"layer thru",children:[(0,r.jsx)(h.Leak,{}),(0,r.jsx)(p.H7,{children:(0,r.jsxs)(j,{children:[(0,r.jsx)("div",{className:"layer thru px-3 py-2 flex flex-col gap-4",children:(0,r.jsx)("h1",{className:"text-4xl",children:"ScatteredPlane"})}),(0,r.jsx)(U,{}),(0,r.jsx)(I,{})]})})]})}},96966:function(e,t,n){"use strict";n.d(t,{v:function(){return r}});let r={development:!1,assetsPath:"/three-xp/assets/"}},4917:function(e,t,n){"use strict";n.d(t,{H7:function(){return h},Ky:function(){return f},_v:function(){return d}});var r=n(78485),i=n(27275),o=n(52471),a=n(48583),s=n(48181),l=n(96966),c=n(11030);let u=(0,i.createContext)(null);function f(e,t){let n=(0,i.useContext)(u);return(0,a.sv)(async function*(t,r){if(e){let t=e(n,r);if(t&&"function"==typeof t.next)do{let{value:e,done:n}=await t.next();if(n)break;yield e}while(r.mounted)}},null!=t?t:"always"),n}function d(e,t,n){let r=(0,i.useMemo)(()=>new o.Group,[]);return r.name=e,f(async function*(e,n){if(e.scene.add(r),yield()=>{r.clear(),r.removeFromParent()},t){let i=t(r,e,n);if(i&&"function"==typeof i.next)do{let{value:e,done:t}=await i.next();if(t)break;yield e}while(n.mounted)}},n),r}function p(e){let{children:t,className:n}=e,c=(0,i.useMemo)(()=>new s.Vu,[]),{ref:f}=(0,a.sv)(function*(e){c.loader.setPath(l.v.assetsPath),yield c.initialize(e),Object.assign(window,{three:c,THREE:o})},[]);return(0,r.jsx)("div",{ref:f,className:"ThreeProvider absolute-through ".concat(null!=n?n:""),children:(0,r.jsx)(u.Provider,{value:c,children:t})})}function h(e){return(0,c.O)()&&(0,r.jsx)(p,{...e})}},11030:function(e,t,n){"use strict";n.d(t,{O:function(){return i}});var r=n(27275);function i(){let[e,t]=(0,r.useState)(!1);return(0,r.useLayoutEffect)(()=>{t(!0)},[]),e}},8834:function(e,t,n){"use strict";n.d(t,{Leak:function(){return s},a:function(){return a}});var r=n(40855),i=n(79509),o=n(28142);function a(e){Object.assign(window,{...i,...r,...e,PRNG:o.T})}function s(e){return a(e),null}},63221:function(e,t,n){"use strict";n.d(t,{w:function(){return c}});var r=n(52471),i=n(66666);let o={axis:"x",length:1,radialSegments:12,radius:.01,coneRatio:.1,radiusScale:1,vertexColor:!0,baseCap:"flat",color:"white"},a=new r.Color;function s(e){let{axis:t,length:n,radius:s,radialSegments:l,coneRatio:c,radiusScale:u,vertexColor:f,baseCap:d,color:p}={...o,...e},h=s*u,v=n*c,m=new r.ConeGeometry(3*h,v,l),w=new r.CylinderGeometry(h,h,1,l,1,!0),g=n-v,y=n-.5*v;m.rotateZ(-Math.PI/2).translate(y,0,0),w.scale(1,g,1).rotateZ(-Math.PI/2).translate(.5*g,0,0);let x="none"===d?new r.BufferGeometry:"flat"===d?new r.CircleGeometry(h,l).rotateY(-Math.PI/2):new r.SphereGeometry(h,l,3,0,2*Math.PI,0,.5*Math.PI).rotateZ(Math.PI/2).rotateX(Math.PI/2),M=(0,i.n4)([m,w,x]);switch(t){case"y":M.rotateZ(Math.PI/2);break;case"z":M.rotateY(-Math.PI/2)}if(f){let e=M.attributes.position.count,t=new r.BufferAttribute(new Float32Array(3*e),3);M.setAttribute("color",t),a.set(p);for(let n=0;n<e;n++)t.setXYZ(n,a.r,a.g,a.b)}return M}let l={xColor:"#ff3333",yColor:"#33cc66",zColor:"#3366ff"};class c extends r.BufferGeometry{constructor(e){super();let{xColor:t,yColor:n,zColor:r,...o}={...l,...e},a=s({...o,axis:"x",color:t}),c=s({...o,axis:"y",color:n}),u=s({...o,axis:"z",color:r}),f=(0,i.n4)([a,c,u]);this.copy(f),f.dispose()}}},88156:function(e,t,n){"use strict";n.d(t,{O:function(){return c}});var r=n(52471),i=n(58648),o=n(81796);let a=new r.Vector2,s=new r.Vector3,l=new r.Matrix4;class c extends r.LineSegments{showOccludedLines(){let{opacity:e=.2}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=new r.LineBasicMaterial({color:this.material.color,transparent:!0,depthFunc:r.GreaterDepth,opacity:e}),n=new r.LineSegments(this.geometry,t);return this.add(n),this}clear(){return this.points.length=0,this.geometry.setFromPoints(this.points),this}draw(){return this.geometry.setFromPoints(this.points),this}circle(e){let{radius:t,segments:n,...i}={...c.circleDefaultOptions,...e};(0,o.Xe)(i,l);let a=new r.Vector3(1,0,0),s=new r.Vector3(0,1,0);for(let e=0;e<n;e++){let i=e/n*Math.PI*2,o=(e+1)/n*Math.PI*2,c=Math.cos(i)*t,u=Math.sin(i)*t,f=Math.cos(o)*t,d=Math.sin(o)*t,p=new r.Vector3().addScaledVector(a,c).addScaledVector(s,u).applyMatrix4(l),h=new r.Vector3().addScaledVector(a,f).addScaledVector(s,d).applyMatrix4(l);this.points.push(p,h)}return this}rectangle(e){let{centerX:t,centerY:n,width:o,height:a}=i.Ae.from(e),s=o/2,l=a/2,c=new r.Vector3(t-s,n-l,0),u=new r.Vector3(t+s,n-l,0),f=new r.Vector3(t+s,n+l,0),d=new r.Vector3(t-s,n+l,0);return this.points.push(c,u,u,f,f,d,d,c),this}box(){let{center:e=[0,0,0],size:t=1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{x:n,y:i,z:a}=(0,o.Q7)(e,s),{x:l,y:c,z:u}=(0,o.Q7)(t,s),f=l/2,d=c/2,p=u/2,h=new r.Vector3(n-f,i-d,a-p),v=new r.Vector3(n+f,i-d,a-p),m=new r.Vector3(n+f,i+d,a-p),w=new r.Vector3(n-f,i+d,a-p),g=new r.Vector3(n-f,i-d,a+p),y=new r.Vector3(n+f,i-d,a+p),x=new r.Vector3(n+f,i+d,a+p),M=new r.Vector3(n-f,i+d,a+p);return this.points.push(h,v,v,m,m,w,w,h),this.points.push(g,y,y,x,x,M,M,g),this.points.push(h,g,v,y,m,x,w,M),this}plus(e,t){let n=t/2,{x:i,y:s}=(0,o.iK)(e,a),l=new r.Vector3(i-n,s,0),c=new r.Vector3(i+n,s,0),u=new r.Vector3(i,s-n,0),f=new r.Vector3(i,s+n,0);return this.points.push(l,c,u,f),this}cross(e,t){let n=t/2,{x:i,y:s}=(0,o.iK)(e,a),l=new r.Vector3(i-n,s-n,0),c=new r.Vector3(i+n,s+n,0),u=new r.Vector3(i-n,s+n,0),f=new r.Vector3(i+n,s-n,0);return this.points.push(l,c,u,f),this}constructor(...e){super(...e),this.points=[]}}c.circleDefaultOptions={radius:.5,segments:96}},63549:function(e,t,n){"use strict";n.d(t,{P:function(){return o}});var r=n(52471);let i={vertexColors:!0,color:"white",luminosity:.5};class o extends r.ShaderMaterial{constructor(e){let{color:t,luminosity:n,vertexColors:o,...a}={...i,...e};super({...a,uniforms:{uColor:{value:new r.Color(t)},uSunPosition:{value:new r.Vector3(.5,.7,.3)},uLuminosity:{value:n}},vertexColors:o,vertexShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vColor = color;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nuniform vec3 uSunPosition;\nuniform vec3 uColor;\nuniform float uLuminosity;\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  light = mix(uLuminosity, 1.0, light);\n  gl_FragColor = vec4(vColor * uColor * light, 1.0);\n}\n"}),this.sunPosition=this.uniforms.uSunPosition.value}}},49635:function(e,t,n){"use strict";n.d(t,{$:function(){return a},E:function(){return l}});var r=n(52471),i=n(81796);let o=new r.Matrix4;function a(e){return(0,i.Xe)(e,o)}let s=new r.Color;function l(e){return s.set(e)}},83018:function(e,t,n){"use strict";n.d(t,{C:function(){return m},EJ:function(){return o},JT:function(){return x},JZ:function(){return d},Ki:function(){return M},Kt:function(){return u},SU:function(){return l},TY:function(){return g},Vq:function(){return f},b6:function(){return s},kg:function(){return a},m3:function(){return c},mZ:function(){return v},ry:function(){return h},uN:function(){return w},uw:function(){return p},xD:function(){return y}});let r=e=>e<0?0:e>1?1:e,i=e=>r(e),o=i,a=e=>(e=r(e))*e,s=e=>(e=r(e))*e*e,l=e=>(e=r(e))*e*e*e,c=e=>(e=r(e))*e*e*e*e,u=i,f=e=>1-(e=r(1-e))*e,d=e=>1-(e=r(1-e))*e*e,p=e=>1-(e=r(1-e))*e*e*e,h=e=>1-(e=r(1-e))*e*e*e*e,v=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.5;return e<0?0:e>1?1:e<n?1/Math.pow(n,t-1)*Math.pow(e,t):1-1/Math.pow(1-n,t-1)*Math.pow(1-e,t)},m=i,w=e=>e<0?0:e>1?1:e<.5?2*e*e:1-2*(e=1-e)*e,g=e=>e<0?0:e>1?1:e<.5?4*e*e*e:1-4*(e=1-e)*e*e,y=e=>e<0?0:e>1?1:e<.5?8*e*e*e*e:1-8*(e=1-e)*e*e*e,x=e=>e<0?0:e>1?1:e<.5?16*e*e*e*e*e:1-16*(e=1-e)*e*e*e*e,M=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;return Math.sin(2*t*Math.PI*e)*Math.pow(1-e,n)}},28142:function(e,t,n){"use strict";n.d(t,{T:function(){return c}});let r=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(e=(e=(7*e+Math.sqrt(e)+16087*Math.sin(e))%2147483647)<0?e+2147483647:e)>1?2147483647&e:0===e?345678:123456},i=e=>e=2147483647&Math.imul(e,48271),o=e=>(e-1)/2147483646,a=e=>e,s={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function l(){let e=i(i(r(123456)));function t(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof t&&(t=t.split("").reduce((e,t)=>7*e+t.charCodeAt(0),0)),e=i(i(r(t))),f}function n(){return o(e=i(e))}function l(e){switch(e.length){default:return[0,1,a];case 1:return[0,e[0],a];case 2:return[e[0],e[1],a];case 3:return[e[0],e[1],e[2]]}}function c(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i,o,a]=l(t);return i+(o-i)*a(n())}function u(){for(var e,t=arguments.length,r=Array(t),i=0;i<t;i++)r[i]=arguments[i];let[o,a,{weightsAreNormalized:l,indexOffset:c,forbiddenItems:u}]=function(e){let[t,n=null,r]=e,i={...s,...r};if(Array.isArray(t))return[t,n,i];if("object"==typeof t)return[Object.values(t),n?Object.values(n):null,i];throw Error("pick: unsupported options type")}(r);if(u.length>0){let t=new Set;for(let e of u){let n=o.indexOf(e);n>=0&&t.add(n)}if(o=o.filter((e,n)=>!t.has(n)),a=null!==(e=null==a?void 0:a.filter((e,n)=>!t.has(n)))&&void 0!==e?e:null,0===o.length)throw Error("pick: all items are forbidden")}if(null===a){let e=Math.floor(n()*o.length);return c&&(e+=c,(e%=o.length)<0&&(e+=o.length)),o[e]}if(!l){let e=a.reduce((e,t)=>e+t,0);a=a.map(t=>t/e)}let f=n(),d=0;for(let e=0;e<o.length;e++)if(f<(d+=a[e]))return o[e];throw Error("among: unreachable")}let f={seed:t,seedMax:function(){return 2147483647},reset:function(){return t(123456),f},next:function(){return e=i(e),f},random:n,between:c,around:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i=1,o=a]=t,s=2*n();return(s>1?1:-1)*o(s>1?s-1:s)*i},int:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i,o,a]=l(t);return i+Math.floor(a(n())*(o-i))},chance:function(e){return n()<e},shuffle:function(e){let{mutate:t=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t&&Array.isArray(e)?e:[...e],i=r.length;for(let e=0;e<i;e++){let t=Math.floor(i*n()),o=r[e];r[e]=r[t],r[t]=o}return r},pick:u,createPicker:function(e){let t=e.map(e=>{let[t]=e;return t}),n=e.map(e=>{let[t,n]=e;return n}),r=n.reduce((e,t)=>e+t,0);for(let[e,t]of n.entries())n[e]=t/r;return()=>u(t,n,{weightsAreNormalized:!0})},vector:function(e,t){let[n=0,r=1]=Array.isArray(t)?t:[null==t?void 0:t.min,null==t?void 0:t.max];for(let t of Object.keys(e))e[t]=c(n,r);return e},unitVector:function(e,t){let[n=-1,r=1]=Array.isArray(t)?t:[null==t?void 0:t.min,null==t?void 0:t.max],i=Object.keys(e),o=i.map(()=>c(n,r)),a=Math.sqrt(o.reduce((e,t)=>e+t*t,0));for(let[t,n]of i.entries())e[n]=o[t]/a;return e},boxMuller:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=n(),i=n(),o=Math.sqrt(-2*Math.log(r)),a=2*Math.PI*i;return[e+t*o*Math.cos(a),e+t*o*Math.sin(a)]}};return f}let c=class{constructor(e){Object.assign(this,l().seed(e))}};Object.assign(c,l())},32717:function(e,t,n){"use strict";function r(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}n.d(t,{_:function(){return r}})}},function(e){e.O(0,[2520,5244,6712,6666,5792,2452,7741,2722,9205,2670,4940,8648,4831,9918,8181,3583,324,6257,2920,7936,1744],function(){return e(e.s=40864)}),_N_E=e.O()}]);