(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9697],{40864:function(e,t,n){Promise.resolve().then(n.t.bind(n,62670,23)),Promise.resolve().then(n.bind(n,93342))},93342:function(e,t,n){"use strict";n.d(t,{Client:function(){return L}});var i=n(78485),r=n(52471),s=n(63221),o=n(63549),a=n(87858),c=n(13025),l=n(95598),u=n(74722),p=n(4917),d=n(49635),f=n(28142),v=n(81796),m=n(25293),h=n(77405);class w{constructor(e,t,n,i){this.space=e,this.rect=t,this.uvRect=n,this.scatterCoeff=i,this.r0=f.T.random(),this.r1=f.T.random()}}class g{constructor(e,t){this.props={...g.defaultProps,...t};let{position:n,size:i,scatterPadding:r,sizeOptions:s,seed:o}=this.props,{col:a,row:c}=e.props;f.T.seed(o);let l=f.T.createPicker(s),u=Array.from({length:a}).map(l),p=Array.from({length:c}).map(l),{x:d,y:x}=(0,v.iK)(n),{x:y,y:S}=(0,v.iK)(i),z=new m.T(m.Nm.Horizontal).setSize(y,S).setOffset(d-y/2,x-S/2);for(let e of u){let t=new m.T(m.Nm.Vertical).setSize("".concat(e,"fr")).addTo(z);for(let e of p)new m.T(m.Nm.Horizontal).setSize("".concat(e,"fr")).addTo(t)}z.computeLayout();let M=z.rect,D=[...z.allLeaves({includeSelf:!1})],b=(y+S)/2,A=D.map(e=>{let t=e.rect.clone(),n=t.clone().relativeTo(M),{x:i,y:s}=t.getCenter(),o=(0,h.ii)(.5,1,(Math.abs(i-d)+Math.abs(s-x))/b);return t.centerX+=f.T.between(-r,r)*o,t.centerY+=f.T.between(-r,r)*o,new w(e,t,n,o)});this.root=z,this.nodes=A}}g.defaultProps={seed:87654,position:new r.Vector2(0,0),size:new r.Vector2(3,2),scatterPadding:.1,sizeOptions:[[.5,1],[1,10],[2,2],[3,1]]};var x=n(88156),y=n(44645),S=n(47174),z=n(1060),M=n(98828),D=n(83018),b=n(1237);class A extends r.Object3D{constructor(){super();let e=new r.HemisphereLight("#ffffff","#926969",1);this.add(e);let t=new r.DirectionalLight("#ffffff",2);this.add(t),t.position.set(2,4,1)}}class V extends r.MeshBasicMaterial{get mapAspect(){return this.uniforms.uMapInfo.value.x}set mapAspect(e){this.uniforms.uMapInfo.value.x=e}getScatteredSize(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new r.Vector2;return e.x=this.uniforms.uScatteredInfo.value.x,e.y=this.uniforms.uScatteredInfo.value.y,e}setScatteredSize(e){this.uniforms.uScatteredInfo.value.x=e.x,this.uniforms.uScatteredInfo.value.y=e.y}get scatteredSize(){return this.getScatteredSize()}set scatteredSize(e){this.setScatteredSize(e)}update(e){e*=.33,this.uniforms.uDispersionTime.value+=e*this.uniforms.uDispersion.value.x,this.uniforms.uLowDispersionTime.value+=e*this.uniforms.uLowDispersion.value.x}constructor(){super({side:r.DoubleSide}),this.uniforms={uDispersionTime:{value:0},uLowDispersionTime:{value:0},uDispersion:{value:new r.Vector4(1,-.6,.4,2)},uLowDispersion:{value:new r.Vector4(0,-.6,.4,0)},uMainParams:{value:new r.Vector4(1,0)},uCenter:{value:new r.Vector3},uMapInfo:{value:new r.Vector4(1,1,.5,.5)},uScatteredInfo:{value:new r.Vector4(1,1,0,0)},uNormalMap:{value:y.R.get("three").loadTexture("textures/rough_concrete_nor_gl_1k.jpg",e=>{e.wrapS=e.wrapT=r.RepeatWrapping})}},this.userData=function(e,t){for(let[n,i,r,s]of t)Object.defineProperty(e,"".concat(n,"_meta"),{enumerable:!0,value:s}),Object.defineProperty(e,n,{enumerable:!0,get:()=>i[r],set(e){i[r]=e}});return e}({},[["chunkScale",this.uniforms.uMainParams.value,"x","\n        Name(chunk.scale)\n        Slider(0, 1, step: any)\n      "],["imageVisibility",this.uniforms.uMainParams.value,"y","\n        Name(image.visibility)\n        Slider(0, 1, step: any)\n      "],["dispX",this.uniforms.uDispersion.value,"x","\n        Name(disp.x)\n        Slider(0, 1, step: any)\n      "],["dispY",this.uniforms.uDispersion.value,"y","\n        Name(disp.y)\n        Slider(-1, 1, step: any)\n      "],["dispZ",this.uniforms.uDispersion.value,"z","\n        Name(disp.z)\n        Slider(-1, 1, step: any)\n      "],["dispW",this.uniforms.uDispersion.value,"w","\n        Name(disp.cycle)\n        Slider(1, 20, step: 1)\n      "],["lowDispX",this.uniforms.uLowDispersion.value,"x","\n        Name(lowDisp.x)\n        Slider(0, 1, step: any)\n      "]]),this.onBeforeCompile=e=>S.b.with(e).defines({USE_UV:""}).uniforms(this.uniforms).varying({vRand:"vec4"}).vertex.top(M.U,z.i,'\n  // sizeMode: 0 for "contain", 1 for "cover"\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, vec2 scale) {\n    align.y = 1.0 - align.y; // Flip y-coordinate\n    if ((outerAspect > innerAspect) != (sizeMode == 1.0)) { // XOR condition for mode\n      float scaleFactor = outerAspect / innerAspect;\n      uv.x = (uv.x - align.x) * scaleFactor + align.x; // Adjust x-coordinate\n    } else {\n      float scaleFactor = innerAspect / outerAspect;\n      uv.y = (uv.y - align.y) * scaleFactor + align.y; // Adjust y-coordinate\n    }\n    uv = (uv - align) / scale + align;\n    return uv;\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, float scale) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, align, vec2(scale));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, align, vec2(1.0));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, vec2(0.5));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect) {\n    return applyUvSize(uv, outerAspect, innerAspect, 1.0);\n  }\n').vertex.top("\n        attribute vec4 aRectUv;\n        attribute vec4 aRand;\n      ").vertex.top("\n        vec2 delta;\n        float scatterRatio;\n\n        vec4 computeDispersion() {\n          if (uDispersion.x == 0.0) {\n            return vec4(0.0, 0.0, 0.0, 1.0);\n          }\n\n          float duration = lerp(8.0, 1.0, aRand.x * aRand.y * aRand.z);\n          float cycleCount = max(floor(uDispersion.w), 1.0);\n          float time = mod(uDispersionTime + duration * cycleCount * aRand.x, duration * cycleCount) / duration;\n          float cycleVisibility = time <= 1.0 ? 1.0 : easeInOut3(1.0 - inverseLerp(.8 * aRand.w + .1, .8 * aRand.w + .2, uDispersion.x));\n          time = mod(time, 1.0);\n          float size = easeInThenOut(time, 8.0) * lerp(2.0, 1.0, time * time) * cycleVisibility;\n          size = mix(1.0, size, pow(uDispersion.x, 1.0 / 2.0));\n\n          // Apply scale before instanceMatrix (shrinking).\n          vec3 dispersed;\n          dispersed.xy = -delta * lerp(uDispersion.y, uDispersion.z, time);\n          dispersed.z = lerp(1.0, 0.0, time);\n          dispersed *= uDispersion.x;\n\n          return vec4(dispersed, size);\n        }\n\n        float getStartEffect(float time, float duration) {\n          return min(1.0, time / duration);\n        }\n\n        float getEndEffect(float time, float timeMax, float duration) {\n          return max(0.0, time - (timeMax - duration)) / duration;\n        }\n\n        vec4 computeLowDispersion() {\n          if (uLowDispersion.x == 0.0) {\n            return vec4(0.0, 0.0, 0.0, 1.0);\n          }\n\n          float periodScalarT = inverseLerp(0.1, 0.9, scatterRatio);\n          float period = lerp(2.0, 8.0, aRand.x) * lerp(60.0, 1.0, periodScalarT);\n          float time = mod(uLowDispersionTime + period * aRand.z, period);\n\n          float duration = 1.0;\n          float effectStart = min(1.0, time);\n          float effectEnd = getEndEffect(time, period, duration);\n\n          float size = getStartEffect(time, 0.3) * (1.0 - getEndEffect(time, period, 0.3));\n          size = pow(size, 1.0 / 4.0);\n          size = mix(1.0, size, pow(uLowDispersion.x, 1.0 / 4.0));\n\n          vec3 dispersed;\n\n          dispersed.xy = delta * 0.1;\n          dispersed.z = 0.2;\n          dispersed.xyz *= getEndEffect(time, period, 1.0);\n          dispersed *= uLowDispersion.x;\n\n          return vec4(dispersed, size);\n        }\n      ").vertex.replace("project_vertex","\n        vec4 mvPosition = vec4(position, 1.0);\n        delta = instanceMatrix[3].xy - uCenter.xy;\n        scatterRatio = clamp(1.1 * length(delta) / (length(uScatteredInfo.xy) / 2.0), 0.0, 1.0);\n\n        vec4 dispersion = computeDispersion();\n        vec4 lowDispersion = computeLowDispersion();\n\n        float scale = clamp01(uMainParams.x * 3.0 - 2.0 * aRand.w);\n        mvPosition.xyz *= dispersion.w * lowDispersion.w * easeInOut3(scale);\n\n        mvPosition = instanceMatrix * mvPosition;\n        mvPosition.xyz += dispersion.xyz + lowDispersion.xyz;\n\n        mvPosition = modelViewMatrix * mvPosition;\n        gl_Position = projectionMatrix * mvPosition;      \n      ").vertex.replace("uv_vertex","\n        #if defined( USE_UV ) || defined( USE_ANISOTROPY )\n          vUv = vec3( uv, 1 ).xy;\n          vUv = aRectUv.xy + aRectUv.zw * vUv;\n        #endif\n        #ifdef USE_MAP\n          vec2 instanceUv = aRectUv.xy + aRectUv.zw * MAP_UV;\n\n          // vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, vec2 scale\n          float outerAspect = uScatteredInfo.x / uScatteredInfo.y;\n          float innerAspect = uMapInfo.x;\n          float sizeMode = uMapInfo.y;\n          vec2 align = uMapInfo.zw;\n          instanceUv = applyUvSize(instanceUv, outerAspect, innerAspect, sizeMode, align, vec2(1.0));\n          \n          vMapUv = ( mapTransform * vec3( instanceUv, 1 ) ).xy;\n        #endif\n      ").vertex.mainAfterAll("\n        vRand = aRand;\n      ").fragment.top(M.U,z.i).fragment.replace("color_fragment","\n        vec3 normal = texture2D(uNormalMap, vUv * 4.0).rgb;\n        vec3 light = normalize(vec3(0.5, 2.5, 1.0));\n        float colorAlteration = mix(0.333, 1.0, dot(normal, light));\n        float transition = inverseLerp(0.0, 0.2, uMainParams.y - 0.8 * vRand.w);\n        diffuseColor.rgb = mix(vColor * colorAlteration, diffuseColor.rgb, transition);\n      ")}}class P extends r.Object3D{static createPlane(e){let{row:t,col:n}=e,i=t*n,s=new r.PlaneGeometry,o=new r.InstancedBufferAttribute(new Float32Array(4*i),4);s.setAttribute("aRectUv",o);let a=new r.InstancedBufferAttribute(new Float32Array(4*i),4);s.setAttribute("aRand",a);for(let e=0;e<i;e++)a.setXYZW(e,f.T.random(),f.T.random(),f.T.random(),f.T.random());let c=new V,l=new r.InstancedMesh(s,c,i);return l.name="plane",l}get count(){return this.internal.count}onTick(e){this.internal.plane.material.update(e.deltaTime)}getDistribution(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new g(this,e)}drawDistribution(e){let{position:t,size:n,scatterPadding:i}=e.props,{x:r,y:s}=(0,v.iK)(t),{x:o,y:a}=(0,v.iK)(n);this.internal.lineHelper.rectangle([r,s,o,a]).rectangle([r,s,o+2*i,a+2*i])}distribute(e){let{count:t,plane:n}=this.internal,{aRectUv:i}=n.geometry.attributes;for(let r=0;r<t;r++){let{rect:t,uvRect:s}=e.nodes[r];n.setMatrixAt(r,(0,d.$)({position:t.getCenter(),scale:t.getSize()})),i.setXYZW(r,s.x,s.y,s.width,s.height)}n.material.setScatteredSize(e.root.rect.getSize());let r=e.root.rect;n.material.setScatteredSize(r.getSize()),n.material.uniforms.uCenter.value.copy(r.getCenter())}lerpDistribute(e,t,n){let{count:i,plane:s}=this.internal,{aRectUv:o}=s.geometry.attributes,a=new b.Ae,c=new b.Ae,l=new b.Ae,u=new r.Vector3,p=new r.Vector3;for(let r=0;r<i;r++){let i=e.nodes[r],l=t.nodes[r],f=.3*(1-i.r0*(i.scatterCoeff+.2*l.r0)),v=(0,h.ii)(f,.7+f,n),m=(0,D.xD)(v);a.lerpRectangles(i.rect,l.rect,m),c.lerpRectangles(i.uvRect,l.uvRect,m),s.setMatrixAt(r,(0,d.$)({position:a.getCenter(u),scale:a.getSize(p),rotationY:(l.r0<.5?0:1)*m*Math.PI*2,rotationZ:.3*Math.sin(v*Math.PI)*(-1+2*i.r0)})),o.setXYZW(r,c.x,c.y,c.width,c.height)}let f=(0,D.uN)((0,h.ii)(.3,.7,n));l.lerpRectangles(e.root.rect,t.root.rect,f),s.material.setScatteredSize(l.getSize()),s.material.uniforms.uCenter.value.copy(l.getCenter()),s.instanceMatrix.needsUpdate=!0,o.needsUpdate=!0}constructor(e={}){super(),this.transition=0;let t={...P.defaultProps,...e},{col:n,row:i}=t,r=P.createPlane(t);(0,a.bB)(r,this);let s=new x.O;(0,a.bB)(s,this);let o=new A;(0,a.bB)(o,this),this.internal={count:i*n,plane:r,lineHelper:s,lightSetup:o},this.props=t,this.distribute(this.getDistribution())}}P.displayName="ScatteredPlane",P.defaultProps={row:20,col:30,imageAspect:1,imageResizeMode:"cover"},P.transition_meta="Range(0, 1)";class R extends r.Mesh{constructor(){super(new r.IcosahedronGeometry(40,1),new r.MeshBasicMaterial({color:"#aeb4e9",side:r.BackSide})),this.onBeforeRender=(e,t,n)=>{this.position.copy(n.position)}}}let U={darkBlue:"#002c52",orange:"#ff5c35",white:"#ffffff",lightGrey:"#c9cfd3"};function T(){let e=(0,l.jE)();return e.three.pipeline.basicPasses.outline.enabled=!1,(0,p._v)("ScatteredDemo",async function*(t,n){(0,a.bB)(new R,t),(0,a.bB)(new r.Mesh(new s.w,new o.P),t);let i=await n.loader.load("/assets/textures/DebugTexture.png");i.colorSpace=r.SRGBColorSpace;let l=(0,a.bB)(new P,t);l.internal.plane.material.map=i,l.internal.plane.material.mapAspect=i.image.width/i.image.height;let u=l.getDistribution({seed:4789,position:[-2,0],size:[2,3]}),p=l.getDistribution({seed:3249,position:[2,0],size:[2,4]});l.drawDistribution(u),l.drawDistribution(p),t.userData.transition=0,t.userData.transition_meta="Slider(0, 1, step: 0.01)",t.userData.scale=1,t.userData.scale_meta="Slider(-1, 1, pow: 10, step: .1)",t.userData.links=[l.internal.plane.material.userData];let v=Object.values(U);for(let e=0,t=l.count;e<t;e++)l.internal.plane.setColorAt(e,(0,d.E)(f.T.pick(v)));yield n.onTick(()=>{l.lerpDistribute(u,p,t.userData.transition),l.scale.setScalar(t.userData.scale)}),(0,c.v)(e,t),e.sceneSelection.add("Select ScatteredDemo",t)},[]),null}function C(){return(0,p.Ky)(function*(e){e.useOrbitControls({position:[-2,0,8],target:[-2,0,0]})},[]),null}function I(e){let{children:t}=e,n=(0,p.Ky)();return(0,i.jsx)(l.KU,{three:n,backgroundColor:"#26163c4f",children:t})}function L(){return(0,i.jsxs)("div",{className:"layer thru",children:[(0,i.jsx)(u.Leak,{}),(0,i.jsx)(p.H7,{children:(0,i.jsxs)(I,{children:[(0,i.jsx)("div",{className:"layer thru px-3 py-2 flex flex-col gap-4",children:(0,i.jsx)("h1",{className:"text-4xl",children:"ScatteredPlane"})}),(0,i.jsx)(C,{}),(0,i.jsx)(T,{})]})})]})}},74722:function(e,t,n){"use strict";n.d(t,{Leak:function(){return o}});var i=n(40855),r=n(79509),s=n(28142);function o(){return Object.assign(window,{...r,...i,PRNG:s.T}),null}},88156:function(e,t,n){"use strict";n.d(t,{O:function(){return l}});var i=n(52471),r=n(1237),s=n(81796);let o=new i.Vector2,a=new i.Vector3,c=new i.Matrix4;class l extends i.LineSegments{showOccludedLines(){let{opacity:e=.2}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=new i.LineBasicMaterial({color:this.material.color,transparent:!0,depthFunc:i.GreaterDepth,opacity:e}),n=new i.LineSegments(this.geometry,t);return this.add(n),this}clear(){return this.points.length=0,this.geometry.setFromPoints(this.points),this}draw(){return this.geometry.setFromPoints(this.points),this}circle(e){let{radius:t,segments:n,...r}={...l.circleDefaultOptions,...e};(0,s.Xe)(r,c);let o=new i.Vector3(1,0,0),a=new i.Vector3(0,1,0);for(let e=0;e<n;e++){let r=e/n*Math.PI*2,s=(e+1)/n*Math.PI*2,l=Math.cos(r)*t,u=Math.sin(r)*t,p=Math.cos(s)*t,d=Math.sin(s)*t,f=new i.Vector3().addScaledVector(o,l).addScaledVector(a,u).applyMatrix4(c),v=new i.Vector3().addScaledVector(o,p).addScaledVector(a,d).applyMatrix4(c);this.points.push(f,v)}return this}rectangle(e){let{centerX:t,centerY:n,width:s,height:o}=r.Ae.from(e),a=s/2,c=o/2,l=new i.Vector3(t-a,n-c,0),u=new i.Vector3(t+a,n-c,0),p=new i.Vector3(t+a,n+c,0),d=new i.Vector3(t-a,n+c,0);return this.points.push(l,u,u,p,p,d,d,l),this}box(){let{center:e=[0,0,0],size:t=1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{x:n,y:r,z:o}=(0,s.Q7)(e,a),{x:c,y:l,z:u}=(0,s.Q7)(t,a),p=c/2,d=l/2,f=u/2,v=new i.Vector3(n-p,r-d,o-f),m=new i.Vector3(n+p,r-d,o-f),h=new i.Vector3(n+p,r+d,o-f),w=new i.Vector3(n-p,r+d,o-f),g=new i.Vector3(n-p,r-d,o+f),x=new i.Vector3(n+p,r-d,o+f),y=new i.Vector3(n+p,r+d,o+f),S=new i.Vector3(n-p,r+d,o+f);return this.points.push(v,m,m,h,h,w,w,v),this.points.push(g,x,x,y,y,S,S,g),this.points.push(v,g,m,x,h,y,w,S),this}plus(e,t){let n=t/2,{x:r,y:a}=(0,s.iK)(e,o),c=new i.Vector3(r-n,a,0),l=new i.Vector3(r+n,a,0),u=new i.Vector3(r,a-n,0),p=new i.Vector3(r,a+n,0);return this.points.push(c,l,u,p),this}cross(e,t){let n=t/2,{x:r,y:a}=(0,s.iK)(e,o),c=new i.Vector3(r-n,a-n,0),l=new i.Vector3(r+n,a+n,0),u=new i.Vector3(r-n,a+n,0),p=new i.Vector3(r+n,a-n,0);return this.points.push(c,l,u,p),this}constructor(...e){super(...e),this.points=[]}}l.circleDefaultOptions={radius:.5,segments:96}},49635:function(e,t,n){"use strict";n.d(t,{$:function(){return o},E:function(){return c}});var i=n(52471),r=n(81796);let s=new i.Matrix4;function o(e){return(0,r.Xe)(e,s)}let a=new i.Color;function c(e){return a.set(e)}},83018:function(e,t,n){"use strict";n.d(t,{C:function(){return h},EJ:function(){return s},JT:function(){return y},JZ:function(){return d},Ki:function(){return S},Kt:function(){return u},SU:function(){return c},TY:function(){return g},Vq:function(){return p},b6:function(){return a},kg:function(){return o},m3:function(){return l},mZ:function(){return m},ry:function(){return v},uN:function(){return w},uw:function(){return f},xD:function(){return x}});let i=e=>e<0?0:e>1?1:e,r=e=>i(e),s=r,o=e=>(e=i(e))*e,a=e=>(e=i(e))*e*e,c=e=>(e=i(e))*e*e*e,l=e=>(e=i(e))*e*e*e*e,u=r,p=e=>1-(e=i(1-e))*e,d=e=>1-(e=i(1-e))*e*e,f=e=>1-(e=i(1-e))*e*e*e,v=e=>1-(e=i(1-e))*e*e*e*e,m=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.5;return e<0?0:e>1?1:e<n?1/Math.pow(n,t-1)*Math.pow(e,t):1-1/Math.pow(1-n,t-1)*Math.pow(1-e,t)},h=r,w=e=>e<0?0:e>1?1:e<.5?2*e*e:1-2*(e=1-e)*e,g=e=>e<0?0:e>1?1:e<.5?4*e*e*e:1-4*(e=1-e)*e*e,x=e=>e<0?0:e>1?1:e<.5?8*e*e*e*e:1-8*(e=1-e)*e*e*e,y=e=>e<0?0:e>1?1:e<.5?16*e*e*e*e*e:1-16*(e=1-e)*e*e*e*e,S=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2;return Math.sin(2*t*Math.PI*e)*Math.pow(1-e,n)}}},function(e){e.O(0,[5692,5244,6712,6666,5792,2452,7741,2722,9205,2670,4940,4831,9918,8181,8335,6257,3668,2920,7936,1744],function(){return e(e.s=40864)}),_N_E=e.O()}]);