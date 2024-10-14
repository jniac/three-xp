(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9697],{40864:function(e,t,n){Promise.resolve().then(n.t.bind(n,62670,23)),Promise.resolve().then(n.bind(n,93342))},93342:function(e,t,n){"use strict";n.d(t,{Client:function(){return I}});var r=n(78485),i=n(52471),o=n(63221),s=n(63549),a=n(87858),l=n(13025),c=n(95598),u=n(74722),f=n(4917),p=n(49635),d=n(28142),v=n(81796),h=n(25293),m=n(77405);class g{constructor(e,t,n,r){this.space=e,this.rect=t,this.uvRect=n,this.scatterCoeff=r,this.r0=d.T.random(),this.r1=d.T.random()}}class w{constructor(e,t){this.props={...w.defaultProps,...t};let{position:n,size:r,scatterPadding:i,sizeOptions:o,seed:s}=this.props,{col:a,row:l}=e.props;d.T.seed(s);let c=d.T.createPicker(o),u=Array.from({length:a}).map(c),f=Array.from({length:l}).map(c),{x:p,y:y}=(0,v.iK)(n),{x:x,y:S}=(0,v.iK)(r),z=new h.T(h.Nm.Horizontal).setSize(x,S).setOffset(p-x/2,y-S/2);for(let e of u){let t=new h.T(h.Nm.Vertical).setSize("".concat(e,"fr")).addTo(z);for(let e of f)new h.T(h.Nm.Horizontal).setSize("".concat(e,"fr")).addTo(t)}z.computeLayout();let A=z.rect,M=[...z.allLeaves({includeSelf:!1})],b=(x+S)/2,D=M.map(e=>{let t=e.rect.clone(),n=t.clone().relativeTo(A),{x:r,y:o}=t.getCenter(),s=(0,m.ii)(.5,1,(Math.abs(r-p)+Math.abs(o-y))/b);return t.centerX+=d.T.between(-i,i)*s,t.centerY+=d.T.between(-i,i)*s,new g(e,t,n,s)});this.root=z,this.nodes=D}}w.defaultProps={seed:87654,position:new i.Vector2(0,0),size:new i.Vector2(3,2),scatterPadding:.1,sizeOptions:[[.5,1],[1,10],[2,2],[3,1]]};var y=n(88156),x=n(44645),S=n(47174),z=n(1060),A=n(98828),M=n(83018),b=n(1237);class D extends i.Object3D{constructor(){super();let e=new i.HemisphereLight("#ffffff","#926969",1);this.add(e);let t=new i.DirectionalLight("#ffffff",2);this.add(t),t.position.set(2,4,1)}}class P extends i.MeshBasicMaterial{get mapAspect(){return this.uniforms.uMapInfo.value.x}set mapAspect(e){this.uniforms.uMapInfo.value.x=e}getScatteredSize(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new i.Vector2;return e.x=this.uniforms.uScatteredInfo.value.x,e.y=this.uniforms.uScatteredInfo.value.y,e}setScatteredSize(e){this.uniforms.uScatteredInfo.value.x=e.x,this.uniforms.uScatteredInfo.value.y=e.y}get scatteredSize(){return this.getScatteredSize()}set scatteredSize(e){this.setScatteredSize(e)}update(e){e*=.33,this.uniforms.uDispersionTime.value+=e*this.uniforms.uDispersion.value.x,this.uniforms.uLowDispersionTime.value+=e*this.uniforms.uLowDispersion.value.x}constructor(){super({side:i.DoubleSide}),this.uniforms={uDispersionTime:{value:0},uLowDispersionTime:{value:0},uDispersion:{value:new i.Vector4(1,-.6,.4,2)},uLowDispersion:{value:new i.Vector4(0,-.6,.4,0)},uMainParams:{value:new i.Vector4(1,0)},uCenter:{value:new i.Vector3},uMapInfo:{value:new i.Vector4(1,1,.5,.5)},uScatteredInfo:{value:new i.Vector4(1,1,0,0)},uNormalMap:{value:x.R.get("three").loadTexture("textures/rough_concrete_nor_gl_1k.jpg",e=>{e.wrapS=e.wrapT=i.RepeatWrapping})}},this.userData=function(e,t){for(let[n,r,i,o]of t)Object.defineProperty(e,"".concat(n,"_meta"),{enumerable:!0,value:o}),Object.defineProperty(e,n,{enumerable:!0,get:()=>r[i],set(e){r[i]=e}});return e}({},[["chunkScale",this.uniforms.uMainParams.value,"x","\n        Name(chunk.scale)\n        Slider(0, 1, step: any)\n      "],["imageVisibility",this.uniforms.uMainParams.value,"y","\n        Name(image.visibility)\n        Slider(0, 1, step: any)\n      "],["dispX",this.uniforms.uDispersion.value,"x","\n        Name(disp.x)\n        Slider(0, 1, step: any)\n      "],["dispY",this.uniforms.uDispersion.value,"y","\n        Name(disp.y)\n        Slider(-1, 1, step: any)\n      "],["dispZ",this.uniforms.uDispersion.value,"z","\n        Name(disp.z)\n        Slider(-1, 1, step: any)\n      "],["dispW",this.uniforms.uDispersion.value,"w","\n        Name(disp.cycle)\n        Slider(1, 20, step: 1)\n      "],["lowDispX",this.uniforms.uLowDispersion.value,"x","\n        Name(lowDisp.x)\n        Slider(0, 1, step: any)\n      "]]),this.onBeforeCompile=e=>S.b.with(e).defines({USE_UV:""}).uniforms(this.uniforms).varying({vRand:"vec4"}).vertex.top(A.U,z.i,'\n  // sizeMode: 0 for "contain", 1 for "cover"\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, vec2 scale) {\n    align.y = 1.0 - align.y; // Flip y-coordinate\n    if ((outerAspect > innerAspect) != (sizeMode == 1.0)) { // XOR condition for mode\n      float scaleFactor = outerAspect / innerAspect;\n      uv.x = (uv.x - align.x) * scaleFactor + align.x; // Adjust x-coordinate\n    } else {\n      float scaleFactor = innerAspect / outerAspect;\n      uv.y = (uv.y - align.y) * scaleFactor + align.y; // Adjust y-coordinate\n    }\n    uv = (uv - align) / scale + align;\n    return uv;\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, float scale) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, align, vec2(scale));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, align, vec2(1.0));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, vec2(0.5));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect) {\n    return applyUvSize(uv, outerAspect, innerAspect, 1.0);\n  }\n').vertex.top("\n        attribute vec4 aRectUv;\n        attribute vec4 aRand;\n      ").vertex.top("\n        vec2 delta;\n        float scatterRatio;\n\n        vec4 computeDispersion() {\n          if (uDispersion.x == 0.0) {\n            return vec4(0.0, 0.0, 0.0, 1.0);\n          }\n\n          float duration = lerp(8.0, 1.0, aRand.x * aRand.y * aRand.z);\n          float cycleCount = max(floor(uDispersion.w), 1.0);\n          float time = mod(uDispersionTime + duration * cycleCount * aRand.x, duration * cycleCount) / duration;\n          float cycleVisibility = time <= 1.0 ? 1.0 : easeInOut3(1.0 - inverseLerp(.8 * aRand.w + .1, .8 * aRand.w + .2, uDispersion.x));\n          time = mod(time, 1.0);\n          float size = easeInThenOut(time, 8.0) * lerp(2.0, 1.0, time * time) * cycleVisibility;\n          size = mix(1.0, size, pow(uDispersion.x, 1.0 / 2.0));\n\n          // Apply scale before instanceMatrix (shrinking).\n          vec3 dispersed;\n          dispersed.xy = -delta * lerp(uDispersion.y, uDispersion.z, time);\n          dispersed.z = lerp(1.0, 0.0, time);\n          dispersed *= uDispersion.x;\n\n          return vec4(dispersed, size);\n        }\n\n        float getStartEffect(float time, float duration) {\n          return min(1.0, time / duration);\n        }\n\n        float getEndEffect(float time, float timeMax, float duration) {\n          return max(0.0, time - (timeMax - duration)) / duration;\n        }\n\n        vec4 computeLowDispersion() {\n          if (uLowDispersion.x == 0.0) {\n            return vec4(0.0, 0.0, 0.0, 1.0);\n          }\n\n          float periodScalarT = inverseLerp(0.1, 0.9, scatterRatio);\n          float period = lerp(2.0, 8.0, aRand.x) * lerp(60.0, 1.0, periodScalarT);\n          float time = mod(uLowDispersionTime + period * aRand.z, period);\n\n          float duration = 1.0;\n          float effectStart = min(1.0, time);\n          float effectEnd = getEndEffect(time, period, duration);\n\n          float size = getStartEffect(time, 0.3) * (1.0 - getEndEffect(time, period, 0.3));\n          size = pow(size, 1.0 / 4.0);\n          size = mix(1.0, size, pow(uLowDispersion.x, 1.0 / 4.0));\n\n          vec3 dispersed;\n\n          dispersed.xy = delta * 0.1;\n          dispersed.z = 0.2;\n          dispersed.xyz *= getEndEffect(time, period, 1.0);\n          dispersed *= uLowDispersion.x;\n\n          return vec4(dispersed, size);\n        }\n      ").vertex.replace("project_vertex","\n        vec4 mvPosition = vec4(position, 1.0);\n        delta = instanceMatrix[3].xy - uCenter.xy;\n        scatterRatio = clamp(1.1 * length(delta) / (length(uScatteredInfo.xy) / 2.0), 0.0, 1.0);\n\n        vec4 dispersion = computeDispersion();\n        vec4 lowDispersion = computeLowDispersion();\n\n        float scale = clamp01(uMainParams.x * 3.0 - 2.0 * aRand.w);\n        mvPosition.xyz *= dispersion.w * lowDispersion.w * easeInOut3(scale);\n\n        mvPosition = instanceMatrix * mvPosition;\n        mvPosition.xyz += dispersion.xyz + lowDispersion.xyz;\n\n        mvPosition = modelViewMatrix * mvPosition;\n        gl_Position = projectionMatrix * mvPosition;      \n      ").vertex.replace("uv_vertex","\n        #if defined( USE_UV ) || defined( USE_ANISOTROPY )\n          vUv = vec3( uv, 1 ).xy;\n          vUv = aRectUv.xy + aRectUv.zw * vUv;\n        #endif\n        #ifdef USE_MAP\n          vec2 instanceUv = aRectUv.xy + aRectUv.zw * MAP_UV;\n\n          // vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, vec2 scale\n          float outerAspect = uScatteredInfo.x / uScatteredInfo.y;\n          float innerAspect = uMapInfo.x;\n          float sizeMode = uMapInfo.y;\n          vec2 align = uMapInfo.zw;\n          instanceUv = applyUvSize(instanceUv, outerAspect, innerAspect, sizeMode, align, vec2(1.0));\n          \n          vMapUv = ( mapTransform * vec3( instanceUv, 1 ) ).xy;\n        #endif\n      ").vertex.mainAfterAll("\n        vRand = aRand;\n      ").fragment.top(A.U,z.i).fragment.replace("color_fragment","\n        vec3 normal = texture2D(uNormalMap, vUv * 4.0).rgb;\n        vec3 light = normalize(vec3(0.5, 2.5, 1.0));\n        float colorAlteration = mix(0.333, 1.0, dot(normal, light));\n        float transition = inverseLerp(0.0, 0.2, uMainParams.y - 0.8 * vRand.w);\n        diffuseColor.rgb = mix(vColor * colorAlteration, diffuseColor.rgb, transition);\n      ")}}class R extends i.Object3D{static createPlane(e){let{row:t,col:n}=e,r=t*n,o=new i.PlaneGeometry,s=new i.InstancedBufferAttribute(new Float32Array(4*r),4);o.setAttribute("aRectUv",s);let a=new i.InstancedBufferAttribute(new Float32Array(4*r),4);o.setAttribute("aRand",a);for(let e=0;e<r;e++)a.setXYZW(e,d.T.random(),d.T.random(),d.T.random(),d.T.random());let l=new P,c=new i.InstancedMesh(o,l,r);return c.name="plane",c}get count(){return this.internal.count}onTick(e){this.internal.plane.material.update(e.deltaTime)}getDistribution(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new w(this,e)}drawDistribution(e){let{position:t,size:n,scatterPadding:r}=e.props,{x:i,y:o}=(0,v.iK)(t),{x:s,y:a}=(0,v.iK)(n);this.internal.lineHelper.rectangle([i,o,s,a]).rectangle([i,o,s+2*r,a+2*r])}distribute(e){let{count:t,plane:n}=this.internal,{aRectUv:r}=n.geometry.attributes;for(let i=0;i<t;i++){let{rect:t,uvRect:o}=e.nodes[i];n.setMatrixAt(i,(0,p.$)({position:t.getCenter(),scale:t.getSize()})),r.setXYZW(i,o.x,o.y,o.width,o.height)}n.material.setScatteredSize(e.root.rect.getSize());let i=e.root.rect;n.material.setScatteredSize(i.getSize()),n.material.uniforms.uCenter.value.copy(i.getCenter())}lerpDistribute(e,t,n){let{count:r,plane:o}=this.internal,{aRectUv:s}=o.geometry.attributes,a=new b.Ae,l=new b.Ae,c=new b.Ae,u=new i.Vector3,f=new i.Vector3;for(let i=0;i<r;i++){let r=e.nodes[i],c=t.nodes[i],d=.3*(1-r.r0*(r.scatterCoeff+.2*c.r0)),v=(0,m.ii)(d,.7+d,n),h=(0,M.xD)(v);a.lerpRectangles(r.rect,c.rect,h),l.lerpRectangles(r.uvRect,c.uvRect,h),o.setMatrixAt(i,(0,p.$)({position:a.getCenter(u),scale:a.getSize(f),rotationY:(c.r0<.5?0:1)*h*Math.PI*2,rotationZ:.3*Math.sin(v*Math.PI)*(-1+2*r.r0)})),s.setXYZW(i,l.x,l.y,l.width,l.height)}let d=(0,M.uN)((0,m.ii)(.3,.7,n));c.lerpRectangles(e.root.rect,t.root.rect,d),o.material.setScatteredSize(c.getSize()),o.material.uniforms.uCenter.value.copy(c.getCenter()),o.instanceMatrix.needsUpdate=!0,s.needsUpdate=!0}constructor(e={}){super(),this.transition=0;let t={...R.defaultProps,...e},{col:n,row:r}=t,i=R.createPlane(t);(0,a.bB)(i,this);let o=new y.O;(0,a.bB)(o,this);let s=new D;(0,a.bB)(s,this),this.internal={count:r*n,plane:i,lineHelper:o,lightSetup:s},this.props=t,this.distribute(this.getDistribution())}}R.displayName="ScatteredPlane",R.defaultProps={row:20,col:30,imageAspect:1,imageResizeMode:"cover"},R.transition_meta="Range(0, 1)";class T extends i.Mesh{constructor(){super(new i.IcosahedronGeometry(40,1),new i.MeshBasicMaterial({color:"#aeb4e9",side:i.BackSide})),this.onBeforeRender=(e,t,n)=>{this.position.copy(n.position)}}}let U={darkBlue:"#002c52",orange:"#ff5c35",white:"#ffffff",lightGrey:"#c9cfd3"};function V(){let e=(0,c.jE)();return e.three.pipeline.basicPasses.outline.enabled=!1,(0,f._v)("ScatteredDemo",async function*(t,n){(0,a.bB)(new T,t),(0,a.bB)(new i.Mesh(new o.w,new s.P),t);let r=await n.loader.load("/images/DebugTexture.png");r.colorSpace=i.SRGBColorSpace;let c=(0,a.bB)(new R,t);c.internal.plane.material.map=r,c.internal.plane.material.mapAspect=r.image.width/r.image.height;let u=c.getDistribution({seed:4789,position:[-2,0],size:[2,3]}),f=c.getDistribution({seed:3249,position:[2,0],size:[2,4]});c.drawDistribution(u),c.drawDistribution(f),t.userData.transition=0,t.userData.transition_meta="Slider(0, 1, step: 0.01)",t.userData.scale=1,t.userData.scale_meta="Slider(-1, 1, pow: 10, step: .1)",t.userData.links=[c.internal.plane.material.userData];let v=Object.values(U);for(let e=0,t=c.count;e<t;e++)c.internal.plane.setColorAt(e,(0,p.E)(d.T.pick(v)));yield n.onTick(()=>{c.lerpDistribute(u,f,t.userData.transition),c.scale.setScalar(t.userData.scale)}),(0,l.v)(e,t),e.sceneSelection.add("Select ScatteredDemo",t)},[]),null}function j(){return(0,f.Ky)(function*(e){e.useOrbitControls({position:[-2,0,8],target:[-2,0,0]})},[]),null}function C(e){let{children:t}=e,n=(0,f.Ky)();return(0,r.jsx)(c.KU,{three:n,backgroundColor:"#26163c4f",children:t})}function I(){return(0,r.jsxs)("div",{className:"layer thru",children:[(0,r.jsx)(u.Leak,{}),(0,r.jsx)(f.H7,{children:(0,r.jsxs)(C,{children:[(0,r.jsx)("div",{className:"layer thru px-3 py-2 flex flex-col gap-4",children:(0,r.jsx)("h1",{className:"text-4xl",children:"ScatteredPlane"})}),(0,r.jsx)(j,{}),(0,r.jsx)(V,{})]})})]})}},74722:function(e,t,n){"use strict";n.d(t,{Leak:function(){return s}});var r=n(40855),i=n(79509),o=n(28142);function s(){return Object.assign(window,{...i,...r,PRNG:o.T}),null}},88156:function(e,t,n){"use strict";n.d(t,{O:function(){return a}});var r=n(52471),i=n(1237),o=n(81796);let s=new r.Vector2;class a extends r.LineSegments{clear(){return this.points.length=0,this.geometry.setFromPoints(this.points),this}draw(){return this.geometry.setFromPoints(this.points),this}rectangle(e){let{centerX:t,centerY:n,width:o,height:s}=i.Ae.from(e),a=o/2,l=s/2,c=new r.Vector3(t-a,n-l,0),u=new r.Vector3(t+a,n-l,0),f=new r.Vector3(t+a,n+l,0),p=new r.Vector3(t-a,n+l,0);return this.points.push(c,u,u,f,f,p,p,c),this}plus(e,t){let n=t/2,{x:i,y:a}=(0,o.iK)(e,s),l=new r.Vector3(i-n,a,0),c=new r.Vector3(i+n,a,0),u=new r.Vector3(i,a-n,0),f=new r.Vector3(i,a+n,0);return this.points.push(l,c,u,f),this}cross(e,t){let n=t/2,{x:i,y:a}=(0,o.iK)(e,s),l=new r.Vector3(i-n,a-n,0),c=new r.Vector3(i+n,a+n,0),u=new r.Vector3(i-n,a+n,0),f=new r.Vector3(i+n,a-n,0);return this.points.push(l,c,u,f),this}constructor(...e){super(...e),this.points=[]}}},49635:function(e,t,n){"use strict";n.d(t,{$:function(){return s},E:function(){return l}});var r=n(52471),i=n(81796);let o=new r.Matrix4;function s(e){return(0,i.Xe)(e,o)}let a=new r.Color;function l(e){return a.set(e)}},83018:function(e,t,n){"use strict";n.d(t,{C:function(){return m},EJ:function(){return o},JT:function(){return x},JZ:function(){return p},Ki:function(){return S},Kt:function(){return u},SU:function(){return l},TY:function(){return w},Vq:function(){return f},b6:function(){return a},kg:function(){return s},m3:function(){return c},mZ:function(){return h},ry:function(){return v},uN:function(){return g},uw:function(){return d},xD:function(){return y}});let r=e=>e<0?0:e>1?1:e,i=e=>r(e),o=i,s=e=>(e=r(e))*e,a=e=>(e=r(e))*e*e,l=e=>(e=r(e))*e*e*e,c=e=>(e=r(e))*e*e*e*e,u=i,f=e=>1-(e=r(1-e))*e,p=e=>1-(e=r(1-e))*e*e,d=e=>1-(e=r(1-e))*e*e*e,v=e=>1-(e=r(1-e))*e*e*e*e,h=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.5;return e<0?0:e>1?1:e<n?1/Math.pow(n,t-1)*Math.pow(e,t):1-1/Math.pow(1-n,t-1)*Math.pow(1-e,t)},m=i,g=e=>e<0?0:e>1?1:e<.5?2*e*e:1-2*(e=1-e)*e,w=e=>e<0?0:e>1?1:e<.5?4*e*e*e:1-4*(e=1-e)*e*e,y=e=>e<0?0:e>1?1:e<.5?8*e*e*e*e:1-8*(e=1-e)*e*e*e,x=e=>e<0?0:e>1?1:e<.5?16*e*e*e*e*e:1-16*(e=1-e)*e*e*e*e,S=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;return Math.sin(2*t*Math.PI*e)*Math.pow(1-e,n)}},28142:function(e,t,n){"use strict";n.d(t,{T:function(){return c}});let r=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(e=(e=(7*e+Math.sqrt(e)+16087*Math.sin(e))%2147483647)<0?e+2147483647:e)>1?2147483647&e:0===e?345678:123456},i=e=>e=2147483647&Math.imul(e,48271),o=e=>(e-1)/2147483646,s=e=>e,a={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function l(){let e=i(i(r(123456)));function t(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof t&&(t=t.split("").reduce((e,t)=>7*e+t.charCodeAt(0),0)),e=i(i(r(t))),f}function n(){return o(e=i(e))}function l(e){switch(e.length){default:return[0,1,s];case 1:return[0,e[0],s];case 2:return[e[0],e[1],s];case 3:return[e[0],e[1],e[2]]}}function c(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i,o,s]=l(t);return i+(o-i)*s(n())}function u(){for(var e,t=arguments.length,r=Array(t),i=0;i<t;i++)r[i]=arguments[i];let[o,s,{weightsAreNormalized:l,indexOffset:c,forbiddenItems:u}]=function(e){let[t,n=null,r]=e,i={...a,...r};if(Array.isArray(t))return[t,n,i];if("object"==typeof t)return[Object.values(t),n?Object.values(n):null,i];throw Error("pick: unsupported options type")}(r);if(u.length>0){let t=new Set;for(let e of u){let n=o.indexOf(e);n>=0&&t.add(n)}if(o=o.filter((e,n)=>!t.has(n)),s=null!==(e=null==s?void 0:s.filter((e,n)=>!t.has(n)))&&void 0!==e?e:null,0===o.length)throw Error("pick: all items are forbidden")}if(null===s){let e=Math.floor(n()*o.length);return c&&(e+=c,(e%=o.length)<0&&(e+=o.length)),o[e]}if(!l){let e=s.reduce((e,t)=>e+t,0);s=s.map(t=>t/e)}let f=n(),p=0;for(let e=0;e<o.length;e++)if(f<(p+=s[e]))return o[e];throw Error("among: unreachable")}let f={seed:t,seedMax:function(){return 2147483647},reset:function(){return t(123456),f},next:function(){return e=i(e),f},random:n,between:c,around:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i=1,o=s]=t,a=2*n();return(a>1?1:-1)*o(a>1?a-1:a)*i},int:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i,o,s]=l(t);return i+Math.floor(s(n())*(o-i))},chance:function(e){return n()<e},shuffle:function(e){let{mutate:t=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t&&Array.isArray(e)?e:[...e],i=r.length;for(let e=0;e<i;e++){let t=Math.floor(i*n()),o=r[e];r[e]=r[t],r[t]=o}return r},pick:u,createPicker:function(e){let t=e.map(e=>{let[t]=e;return t}),n=e.map(e=>{let[t,n]=e;return n}),r=n.reduce((e,t)=>e+t,0);for(let[e,t]of n.entries())n[e]=t/r;return()=>u(t,n,{weightsAreNormalized:!0})},vector:function(e,t){let[n=0,r=1]=Array.isArray(t)?t:[null==t?void 0:t.min,null==t?void 0:t.max];for(let t of Object.keys(e))e[t]=c(n,r);return e},unitVector:function(e,t){let[n=-1,r=1]=Array.isArray(t)?t:[null==t?void 0:t.min,null==t?void 0:t.max],i=Object.keys(e),o=i.map(()=>c(n,r)),s=Math.sqrt(o.reduce((e,t)=>e+t*t,0));for(let[t,n]of i.entries())e[n]=o[t]/s;return e},boxMuller:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=n(),i=n(),o=Math.sqrt(-2*Math.log(r)),s=2*Math.PI*i;return[e+t*o*Math.cos(s),e+t*o*Math.sin(s)]}};return f}let c=class{constructor(e){Object.assign(this,l().seed(e))}};Object.assign(c,l())}},function(e){e.O(0,[5692,5244,6712,6666,5792,2452,7741,2722,9205,2670,4940,4831,8181,9509,8335,2913,2920,7936,1744],function(){return e(e.s=40864)}),_N_E=e.O()}]);