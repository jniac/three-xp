(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9697],{59856:function(e,t,n){Promise.resolve().then(n.t.bind(n,77601,23)),Promise.resolve().then(n.bind(n,86471))},86471:function(e,t,n){"use strict";n.d(t,{Client:function(){return B}});var a=n(41291),r=n(64740),i=n(32678),s=n(75952),o=n(56246),c=n(70928),l=n(62362),u=n(1050),d=n(47804),p=n(73437),f=n(7556),v=n(71441),h=n(27636);class m{constructor(e,t){this.props={...m.defaultProps,...t};let{position:n,size:a,scatterPadding:r,sizeOptions:i,seed:s}=this.props,{col:o,row:c}=e.props;h.T.seed(s);let l=h.T.createPicker(i),u=Array.from({length:o}).map(l),d=Array.from({length:c}).map(l),{x:x,y:g}=(0,p.iK)(n),{x:y,y:M}=(0,p.iK)(a),b=new f.T(f.Nm.Horizontal).setSize(y,M).setOffset(x-y/2,g-M/2);for(let e of u){let t=new f.T(f.Nm.Vertical).setSize("".concat(e,"fr")).addTo(b);for(let e of d)new f.T(f.Nm.Horizontal).setSize("".concat(e,"fr")).addTo(t)}b.computeLayout();let w=b.rect,z=[...b.allLeaves({includeSelf:!1})],S=(y+M)/2,A=z.map(e=>{let t=e.rect.clone(),n=t.clone().relativeTo(w),{x:a,y:i}=t.getCenter(),s=(0,v.ii)(.5,1,(Math.abs(a-x)+Math.abs(i-g))/S);return t.centerX+=h.T.between(-r,r)*s,t.centerY+=h.T.between(-r,r)*s,{space:e,rect:t,uvRect:n,scatterCoeff:s}});this.root=b,this.nodes=A}}m.defaultProps={seed:87654,position:new r.Vector2(0,0),size:new r.Vector2(3,2),scatterPadding:.1,sizeOptions:[[.5,1],[1,10],[2,2],[3,1]]};var x=n(42685),g=n(64556),y=n(6332),M=n(11315);class b extends r.LineSegments{clear(){return this.points.length=0,this.geometry.setFromPoints(this.points),this}drawRect(e){let{x:t,y:n,width:a,height:i}=y.Ae.from(e),s=a/2,o=i/2,c=new r.Vector2(t-s,n-o),l=new r.Vector2(t+s,n-o),u=new r.Vector2(t+s,n+o),d=new r.Vector2(t-s,n+o);return this.points.push(c,l,l,u,u,d,d,c),this.geometry.setFromPoints(this.points),this}constructor(...e){super(...e),this.points=[]}}var w=n(2164),z=n(68392),S=n(77535);class A extends r.InstancedMesh{constructor(e){let{row:t,col:n}=e,a=t*n,i=new r.PlaneGeometry(1,1,100,1),s=new r.MeshPhysicalMaterial({side:r.DoubleSide,flatShading:!0}),o=new r.InstancedBufferAttribute(new Float32Array(16*a),16),c=new r.InstancedBufferAttribute(new Float32Array(16*a),16);i.setAttribute("aStartMat",o),i.setAttribute("aEndMat",c);let l={uTime:M.vB.get("three").uTime,uLength:{value:1},uWidth:{value:.01},uRand:{value:h.T.vector(new r.Vector4,{min:0,max:1})},uWorldStartMatrix:{value:new r.Matrix4().identity()},uWorldEndMatrix:{value:new r.Matrix4().identity()}};s.onBeforeCompile=e=>x.b.with(e).shaderName("with-loop").uniforms(l).vertex.top(z.U,w.i,S.T).vertex.top("\n        attribute mat4 aStartMat;\n        attribute mat4 aEndMat;\n\n        float rand(vec3 p) {\n          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);\n        }\n\n        // float rand(vec3 p) {\n        //   p = fract(p * vec3(443.8975, 441.4236, 437.1954));\n        //   p += dot(p, p.yzx + 19.19);\n        //   return fract((p.x + p.y) * p.z);\n        // }\n\n        float rand(vec3 p, float rangeMin, float rangeMax) {\n          return mix(rangeMin, rangeMax, rand(p));\n        }\n\n        float rand11(vec3 p) {\n          float r = rand(p) * 2.0 - 1.0;\n          float s = sign(r);\n          r = fract(r);\n          r *= r * r * r;\n          return r * s;\n        }\n\n        float rand11(vec3 p, float rangeMin, float rangeMax) {\n          return (rand11(p) * 0.5 + 0.5) * (rangeMax - rangeMin) + rangeMin;\n        }\n\n        vec3 bezier3(vec3 a, vec3 b, vec3 c, vec3 d, float t) {\n          t = clamp(t, 0.0, 1.0);\n          vec3 ab = mix(a, b, t);\n          vec3 bc = mix(b, c, t);\n          vec3 cd = mix(c, d, t);  \n          vec3 ab_bc = mix(ab, bc, t);\n          vec3 bc_cd = mix(bc, cd, t);\n          return mix(ab_bc, bc_cd, t);\n        }\n\n        vec3 bezier3_tangent(vec3 a, vec3 b, vec3 c, vec3 d, float t) {\n          t = clamp(t, 0.0, 1.0);\n          return 3.0 * ( \n            (1.0 - t) * (1.0 - t) * (b - a) + \n            2.0 * (1.0 - t) * t * (c - b) + \n            t * t * (d - c));\n        }\n      ").vertex.replace("begin_vertex","\n        mat4 startMat = uWorldStartMatrix * aStartMat;\n        mat4 endMat = uWorldEndMatrix * aEndMat;\n\n        vec3 start = startMat[3].xyz;\n        vec3 end = endMat[3].xyz;\n\n        start += vec3(rand11(start.xyz), rand11(start.yzx), rand11(start.zxy)) * 0.66;\n        end += vec3(rand11(start.zyx), rand11(start.xzy), rand11(start.yxz)) * 0.33;\n        \n        float dt = mix(-uLength, 1.0, fract(uTime * 0.33 + rand11(start) * 0.4));\n        float t = position.x * uLength + dt;\n        t = clamp(t, 0.0, 1.0);\n        float d = distance(start, end);\n\n        vec3 p0 = start;\n        vec3 p1 = mix(start, end, 0.2) + d * 0.2 * startMat[2].xyz;\n        vec3 p2 = mix(start, end, 0.8) + d * 0.2 * endMat[2].xyz;\n        vec3 p3 = end;\n        \n        // p1 = mix(start, end, 0.33);\n        // p2 = mix(start, end, 0.66);\n\n        vec3 normal = normalize(mix(startMat[2].xyz, endMat[2].xyz, t));\n        vec3 up = normalize(mix(startMat[1].xyz, endMat[1].xyz, t));\n        vec3 tangent = normalize(bezier3_tangent(p0, p1, p2, p3, t));\n        \n        float shortT = (t - dt) / uLength;\n        float width = (position.y - 0.5)\n          * easeInThenOut(t, 6.0)\n          * easeInThenOut(shortT, 3.0)\n          * mix(0.33, 1.0, pcurve(t, 1.0, 2.0)) // Narrower at the end.\n          * uWidth;\n        \n        float randomness = 0.2;\n        float startLoopT = rand(start) * randomness;\n        float loopT = startLoopT + inverseLerp(0.0, 1.0 - randomness, t);\n\n        vec2 loop = looping(loopT, 0.3, 1.0, 3.0, rand11(start, 0.6, 1.2), 0.3);\n        // loop = vec2(t, 0.0);\n        \n        // Loop Random Scalar:\n        vec2 lrs = vec2(\n          rand11(start, 0.4, 1.0),\n          rand11(start.zyx, 0.9, 1.1));\n        vec3 transformed = \n          bezier3(p0, p1, p2, p3, t)\n          + tangent * (loop.x - loopT) * d * lrs.x + normal * loop.y * d * lrs.y\n          + up * width;\n        \n        #ifdef USE_ALPHAHASH\n          vPosition = transformed;\n        #endif\n      "),super(i,s,a),this.name="lines",this.parts={aStartMat:o,aEndMat:c}}}class U extends r.Object3D{constructor(){super();let e=new r.HemisphereLight("#ffffff","#926969",1);this.add(e);let t=new r.DirectionalLight("#ffffff",2);this.add(t),t.position.set(2,4,1)}}class T extends r.MeshBasicMaterial{get mapAspect(){return this.internal.uniforms.uMapInfo.value.x}set mapAspect(e){this.internal.uniforms.uMapInfo.value.x=e}getScatteredSize(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new r.Vector2;return e.x=this.internal.uniforms.uScatteredInfo.value.x,e.y=this.internal.uniforms.uScatteredInfo.value.y,e}setScatteredSize(e){this.internal.uniforms.uScatteredInfo.value.x=e.x,this.internal.uniforms.uScatteredInfo.value.y=e.y}get scatteredSize(){return this.getScatteredSize()}set scatteredSize(e){this.setScatteredSize(e)}constructor(){super({side:r.DoubleSide}),this.internal={uniforms:{uMapInfo:{value:new r.Vector4(1,1,.5,.5)},uScatteredInfo:{value:new r.Vector4(1,1,0,0)},uTime:M.vB.get("three").uTime}},this.onBeforeCompile=e=>x.b.with(e).uniforms(this.internal.uniforms).vertex.top('\n  // sizeMode: 0 for "contain", 1 for "cover"\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, vec2 scale) {\n    align.y = 1.0 - align.y; // Flip y-coordinate\n    if ((outerAspect > innerAspect) != (sizeMode == 1.0)) { // XOR condition for mode\n      float scaleFactor = outerAspect / innerAspect;\n      uv.x = (uv.x - align.x) * scaleFactor + align.x; // Adjust x-coordinate\n    } else {\n      float scaleFactor = innerAspect / outerAspect;\n      uv.y = (uv.y - align.y) * scaleFactor + align.y; // Adjust y-coordinate\n    }\n    uv = (uv - align) / scale + align;\n    return uv;\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, float scale) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, align, vec2(scale));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, align, vec2(1.0));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect, float sizeMode) {\n    return applyUvSize(uv, outerAspect, innerAspect, sizeMode, vec2(0.5));\n  }\n\n  vec2 applyUvSize(vec2 uv, float outerAspect, float innerAspect) {\n    return applyUvSize(uv, outerAspect, innerAspect, 1.0);\n  }\n').vertex.top("\n        attribute vec4 aRectUv;\n      ").vertex.replace("uv_vertex","\n        #if defined( USE_UV ) || defined( USE_ANISOTROPY )\n          vUv = vec3( uv, 1 ).xy;\n        #endif\n        #ifdef USE_MAP\n          vec2 instanceUv = aRectUv.xy + aRectUv.zw * MAP_UV;\n\n          // vec2 uv, float outerAspect, float innerAspect, float sizeMode, vec2 align, vec2 scale\n          float outerAspect = uScatteredInfo.x / uScatteredInfo.y;\n          float innerAspect = uMapInfo.x;\n          float sizeMode = uMapInfo.y;\n          vec2 align = uMapInfo.zw;\n          instanceUv = applyUvSize(instanceUv, outerAspect, innerAspect, sizeMode, align, vec2(1.0));\n          \n          vMapUv = ( mapTransform * vec3( instanceUv, 1 ) ).xy;\n        #endif\n      ")}}class D extends r.Object3D{static createPlane(e){let{row:t,col:n}=e,a=t*n,i=new r.PlaneGeometry,s=new r.InstancedBufferAttribute(new Float32Array(4*a),4);i.setAttribute("aRectUv",s);let o=new T,c=new r.InstancedMesh(i,o,a);return c.name="plane",c}get count(){return this.internal.count}getDistribution(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new m(this,e)}drawDistribution(e){let{position:t,size:n,scatterPadding:a}=e.props,{x:r,y:i}=(0,p.iK)(t),{x:s,y:o}=(0,p.iK)(n);this.internal.lineHelper.drawRect([r,i,s,o]).drawRect([r,i,s+2*a,o+2*a])}distribute(e){let{count:t,plane:n}=this.internal,{aRectUv:a}=n.geometry.attributes;for(let r=0;r<t;r++){let{rect:t,uvRect:i}=e.nodes[r];n.setMatrixAt(r,(0,g.$)({position:t.getCenter(),scale:t.getSize()})),a.setXYZW(r,i.x,i.y,i.width,i.height)}n.material.setScatteredSize(e.root.rect.getSize())}lerpDistribute(e,t,n){let{count:a,plane:i,lines:s}=this.internal,{aRectUv:o}=i.geometry.attributes,c=new y.Ae,l=new y.Ae,u=new r.Vector3,d=new r.Vector3;for(let r=0;r<a;r++){let a=e.nodes[r],p=t.nodes[r];c.lerpRectangles(a.rect,p.rect,n),l.lerpRectangles(a.uvRect,p.uvRect,n),i.setMatrixAt(r,(0,g.$)({position:c.getCenter(u),scale:c.getSize(d)})),o.setXYZW(r,l.x,l.y,l.width,l.height),(0,g.$)({position:a.rect.getCenter(u)}).toArray(s.parts.aStartMat.array,16*r),(0,g.$)({position:p.rect.getCenter(u)}).toArray(s.parts.aEndMat.array,16*r)}let p=new y.Ae().lerpRectangles(e.root.rect,t.root.rect,n);i.material.setScatteredSize(p.getSize()),i.instanceMatrix.needsUpdate=!0,o.needsUpdate=!0,s.parts.aStartMat.needsUpdate=!0,s.parts.aEndMat.needsUpdate=!0}constructor(e={}){super(),this.transition=0;let t={...D.defaultProps,...e},{col:n,row:a}=t,r=D.createPlane(t);(0,o.bB)(r,this);let i=new A(t);(0,o.bB)(i,this);let s=new b;(0,o.bB)(s,this);let c=new U;(0,o.bB)(c,this),this.internal={count:a*n,plane:r,lineHelper:s,lines:i,lightSetup:c},this.props=t,this.distribute(this.getDistribution())}}D.displayName="ScatteredPlane",D.defaultProps={row:20,col:30,imageAspect:1,imageResizeMode:"cover"},D.transition_meta="Range(0, 1)";class P extends r.Mesh{constructor(){super(new r.IcosahedronGeometry(40,1),new r.MeshBasicMaterial({color:"#aeb4e9",side:r.BackSide})),this.onBeforeRender=(e,t,n)=>{this.position.copy(n.position)}}}function _(){let e=(0,l.jE)();return(0,d._v)("ScatteredDemo",async function*(t,n){(0,o.bB)(new P,t),(0,o.bB)(new r.Mesh(new i.w,new s.P),t);let a=await n.loader.load("/images/DebugTexture.png");a.colorSpace=r.SRGBColorSpace;let l=(0,o.bB)(new D,t);l.internal.plane.material.map=a,l.internal.plane.material.mapAspect=a.image.width/a.image.height;let u=l.getDistribution({position:[-2,0],size:[3,2]}),d=l.getDistribution({position:[2,0],size:[2,3]});l.drawDistribution(u),l.drawDistribution(d),t.userData.transition=0,t.userData.transition_meta="Slider(0, 1, step: 0.01)",t.userData.foo=0,t.userData.foo_meta="Slider(-2, 2, step: 0.25)",t.userData.scale=1,t.userData.scale_meta="Slider(-1, 1, pow: 10, step: .1)",yield n.onTick(()=>{l.lerpDistribute(u,d,t.userData.transition),l.rotation.z=t.userData.foo*Math.PI,l.scale.setScalar(t.userData.scale)}),(0,c.v)(e,t),e.sceneSelection.add("Select ScatteredDemo",t)},[]),null}function I(){return(0,d.Ky)(function*(e){e.useOrbitControls({position:[0,0,8],target:0})},[]),null}function R(e){let{children:t}=e,n=(0,d.Ky)();return(0,a.jsx)(l.KU,{three:n,backgroundColor:"#26163c4f",children:t})}function B(){return(0,a.jsxs)("div",{className:"absolute-through",children:[(0,a.jsx)(u.Leak,{}),(0,a.jsx)(d.H7,{children:(0,a.jsxs)(R,{children:[(0,a.jsx)("div",{className:"absolute-through px-3 py-2 flex flex-col gap-4",children:(0,a.jsx)("h1",{className:"text-4xl",children:"ScatteredPlane"})}),(0,a.jsx)(I,{}),(0,a.jsx)(_,{})]})})]})}},1050:function(e,t,n){"use strict";n.d(t,{Leak:function(){return s}});var a=n(80590),r=n(45003),i=n(27636);function s(){return Object.assign(window,{...r,...a,PRNG:i.T}),null}}},function(e){e.O(0,[5890,5244,8423,3662,7579,893,7601,2290,1943,6626,6028,7112,3679,900,9427,1658,3510,1744],function(){return e(e.s=59856)}),_N_E=e.O()}]);