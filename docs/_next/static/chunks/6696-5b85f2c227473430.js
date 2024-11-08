"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6696],{76696:function(e,t,n){n.d(t,{Main:function(){return R}});var r=n(78485),i=n(52471),o=n(86818),a=n(494);n(63549);var s=n(28142),l=n(9710),c=n(37457),h=n(74831);function u(){return(0,o.Ky)(function*(e){Object.assign(window,{three:e,Ticker:l.vB})},[]),null}var d=n(25628),p=n(31454),x=n(47174),f=n(87858);n(55244);var m=n(98828),v=n(88156),y=n(1060),w=n(77405),g=JSON.parse('[{"phi":1.7045171372513754,"theta":0.9426432714835036},{"phi":1.2138204764190186,"theta":0.5877279735536564},{"phi":2.018280663352346,"theta":0.4225774045053551},{"phi":1.58623960126316,"theta":0.11530620356664824},{"phi":1.4858931296682674,"theta":0.09988610745985425},{"phi":1.370250993061531,"theta":-0.6152078487213142},{"phi":0.9459811008591165,"theta":-0.4116473816238604},{"phi":1.06660504904375,"theta":-0.22199053344895067},{"phi":2.675243191552906,"theta":-0.6045343364962831},{"phi":2.5901332086293296,"theta":-0.45113353839646375},{"phi":3.0820510158643644,"theta":-0.20059237206688585},{"phi":2.920796326794876,"theta":-0.3506750512589778},{"phi":2.707382312980871,"theta":0.025009035614594027},{"phi":-2.771515207166003,"theta":0.43045560632597474},{"phi":-3.068326429226437,"theta":0.6129817652939101},{"phi":3.1105233820660763,"theta":0.7241618779795415},{"phi":-2.5251632895865317,"theta":0.6535499652931851},{"phi":-3.015091410598426,"theta":0.8642317265005449},{"phi":3.0788690924417255,"theta":0.8159956971859744},{"phi":-2.370767607902747,"theta":0.787316008336757},{"phi":-2.5030942996270586,"theta":0.7163689975296974},{"phi":-0.28189011450089596,"theta":0.6816391217572154},{"phi":-0.2988148637926313,"theta":0.5717768908896973},{"phi":-0.1772652581758269,"theta":0.4716751222011235},{"phi":-0.05544012907477782,"theta":-0.028486000516249495},{"phi":-0.06314162733968252,"theta":0.061655565733329316},{"phi":-0.8760666510861576,"theta":-0.6838346154783156},{"phi":-0.7161612255722236,"theta":-0.11386479380967202},{"phi":-0.5032773150049611,"theta":-0.5860256589964206},{"phi":1.7599491315598337,"theta":1.0140201131361222},{"phi":1.555598726738203,"theta":1.0275620052067571},{"phi":1.5867188262212921,"theta":1.091601234052012},{"phi":1.5622775626534053,"theta":1.1451634884556725},{"phi":1.8064000451323763,"theta":0.8291516658764525},{"phi":1.7711742769485577,"theta":0.8002332318072503},{"phi":1.5274585527636149,"theta":0.838434437058171},{"phi":1.3559514207428152,"theta":0.7754675571543634},{"phi":1.1792807716216012,"theta":0.7682476175679409},{"phi":1.3076110196152615,"theta":0.9387650274681301},{"phi":1.4565810952604292,"theta":1.0264229286514035}]');function M(){let{theta:e=0,phi:t=0,radius:n=1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments.length>1?arguments[1]:void 0;return null!=r||(r=new i.Vector3),r.x=n*Math.cos(e)*Math.cos(t),r.y=n*Math.sin(e),r.z=n*Math.cos(e)*Math.sin(t),r}class z extends i.Line{constructor(e,{color:t="white"}={}){let n=new i.BufferGeometry().setFromPoints(e),r=new i.LineDashedMaterial({color:t}),o=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:512,t=new Uint8Array(4*e),n=0;for(;n<e;){let r=s.T.int(10,20);n+r>e&&(r=e-n);for(let e=0;e<r;e++)t[4*(n+e)]=255;n+=r+s.T.int(1,80)}for(let n=0;n<e;n+=2)t[4*n+1]=255;let r=new i.DataTexture(t,e,1,i.RGBAFormat);return r.minFilter=r.magFilter=i.NearestFilter,r.wrapS=r.wrapT=i.RepeatWrapping,r.needsUpdate=!0,r}(),a={uTime:l.vB.get("three").uTime,uTextureLengthRatio:{value:40},uScale:{value:1},uTexture:{value:o},uLineLength:{value:-1}};r.onBeforeCompile=e=>x.b.with(e).uniforms(a).varying({vWorldPosition2:"vec3"}).vertex.mainAfterAll("\n        vWorldPosition2 = (modelMatrix * vec4(position, 1.0)).xyz;\n      ").fragment.top("\n        float hash(vec3 p) {\n          // Combine the components of the vec3 using dot products\n          vec3 k = vec3(127.1, 311.7, 74.7); // Large primes to create randomness\n          return fract(sin(dot(p, k)) * 43758.5453123); // Sine and fract create pseudo-randomness\n        }\n      ").fragment.replace(/if .* {\s*discard;\s*}/,"\n        float alpha = vLineDistance / uLineLength;\n        alpha = pow(alpha, 1.0 / 2.0);\n        float x = mod(uLineLength * alpha / uTextureLengthRatio + uTime * -0.05, 1.0);\n        vec4 texel = texture2D(uTexture, vec2(x, 0.5));\n        float outHash = fract(hash(vWorldPosition2) + uTime * 10.0) + mix(5.0, -1.0, alpha);\n        if (texel.r * outHash < 0.5) {\n          discard;\n        }\n      "),super(n,r),this.computeLineDistances(),a.uLineLength.value=this.geometry.attributes.lineDistance.array.at(-1)}}let b=new i.TextureLoader;class C extends i.Group{constructor(e,{pointsPerCurve:t=80,curveSubdivisions:n=256}={}){super();let r=e.length*t,o=new i.BufferGeometry,a=new Float32Array(3*r);o.setAttribute("position",new i.BufferAttribute(a,3));let c=new Float32Array(4*r);s.T.seed(987632);for(let e=0;e<c.length;e++)c[e]=s.T.random();o.setAttribute("random",new i.BufferAttribute(c,4));let h=new Float32Array(e.length*n*4),u=new Float32Array(e.length*n*4);for(let r=0;r<e.length;r++){for(let e=0;e<t;e++){let n=r*t+e;a[3*n]=e,a[3*n+1]=r,a[3*n+2]=0}let i=e[r].nurbsCurve;if(!i)throw Error("NURBS curve not set.");for(let e=0;e<n;e++){let t=e/n,o=i.getPoint(t),a=i.getTangent(t),s=r*n+e;h[4*s]=o.x,h[4*s+1]=o.y,h[4*s+2]=o.z,u[4*s]=a.x,u[4*s+1]=a.y,u[4*s+2]=a.z}}let d=t=>{let r=new i.DataTexture(t,n,e.length,i.RGBAFormat,i.FloatType,i.UVMapping,i.ClampToEdgeWrapping,i.ClampToEdgeWrapping,i.NearestFilter,i.NearestFilter);return r.generateMipmaps=!1,r.needsUpdate=!0,r},p=d(h),f=d(u);s.T.seed(5678492);let m={uTime:l.vB.get("three").uTime,uPointsPerCurve:{value:t},uCurvesMapSize:{value:new i.Vector2(n,e.length)},uCurvesPositionMap:{value:p},uCurvesTangentMap:{value:f},uColors:{value:e.map(e=>e.color)},uCurveRandom:{value:e.map(()=>s.T.random())},uMaskMaps:{value:[b.load("/assets/textures/rounded-square.png"),b.load("/assets/textures/rounded-plus.png"),b.load("/assets/textures/rounded-rhomb.png")]}},v=new i.PointsMaterial({vertexColors:!0,size:.5});v.onBeforeCompile=e=>x.b.with(e).uniforms(m).varying({vRandom:"vec4"}).vertex.top(y.i).vertex.top("\n        attribute vec4 random;\n      ").vertex.replace("begin_vertex","\n        int j = gl_VertexID / int(uPointsPerCurve);\n        int i = gl_VertexID - j * int(uPointsPerCurve);\n        float r = uCurveRandom[j]; // Curve random value\n\n        vColor = uColors[j] * mix(0.8, 1.2, random.x);\n\n        float curveFraction = 0.2;\n        float curveSpeed = 0.0125;\n        float curveInnerSpeed = 0.05;\n\n        float t3 = fract(position.x / uPointsPerCurve + uTime * curveInnerSpeed);\n        float t0 = fract(curveFraction * t3 + r + uTime * curveSpeed);\n        t0 = easeIn2(t0);\n\n        float x = t0;\n        float y = position.y / uCurvesMapSize.y;\n        float xMax = uCurvesMapSize.x - 1.0; // one less because of linear interpolation (x0 -> x1)\n        float xT = fract(x * xMax);\n        float x0 = floor(x * xMax) / xMax;\n        float x1 = floor(x * xMax + 1.0) / xMax;\n        \n        vec3 p0 = texture(uCurvesPositionMap, vec2(x0, y)).xyz;\n        vec3 p1 = texture(uCurvesPositionMap, vec2(x1, y)).xyz;\n        vec3 p = mix(p0, p1, xT);\n\n        vec3 tangent0 = texture(uCurvesTangentMap, vec2(x0, y)).xyz;\n        vec3 tangent1 = texture(uCurvesTangentMap, vec2(x1, y)).xyz;\n        vec3 tangent = mix(tangent0, tangent1, xT);\n\n        vec3 normal = normalize(cross(tangent, vec3(0.0, 1.0, 0.0)));\n        vec3 binormal = normalize(cross(normal, tangent));\n\n        float t1 = sin(random.x * PI2 + uTime * mix(0.5, 1.0, random.z));\n        float t2 = sin(random.y * PI2 + uTime * mix(0.5, 1.0, random.w));\n        float dispersion = mix(0.005, 0.2, easeOut8(t0));\n        vec3 transformed = p \n          + normal * (random.z - 0.5) * dispersion * t1 \n          + binormal * (random.w - 0.5) * dispersion * t2;\n      ").vertex.mainAfterAll("\n        gl_PointSize *= mix(0.2, 1.0, easeInThenOut(t0, 16.0))\n          * mix(0.25, 1.0, easeInThenOut(t3, 6.0))\n          * mix(0.25, 1.0, random.z);\n\n        vRandom = random;\n      ").fragment.mainAfterAll("\n        if (vRandom.x < 0.5) {\n          if (texture2D(uMaskMaps[0], gl_PointCoord).r < 0.5) discard;\n        } else if (vRandom.y < 0.2) {\n          if (texture2D(uMaskMaps[1], gl_PointCoord).r < 0.5) discard;\n        } else {\n          if (texture2D(uMaskMaps[2], gl_PointCoord).r < 0.5) discard;\n        }\n      ");let w=new i.Points(o,v);this.add(w)}}var S=n(81796);class P extends i.Group{setControlPoints(e){let{curveSubdivisions:t=512}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{degree:n,color:r}=this,o=e.map(e=>e instanceof i.Vector3?new i.Vector4(e.x,e.y,e.z,1):e),a=[],s=o.length;for(let e=0;e<=n;e++)a.push(0);for(let e=1;e<=s-n;e++)a.push(e);for(let e=0;e<n;e++)a.push(s-n);let l=new d.e(n,a,o),c=l.getSpacedPoints(t),h=new i.BufferGeometry().setFromPoints(c),u=new i.Line(h,new i.LineBasicMaterial({color:r}));this.add(u);let p=new i.InstancedMesh(P.instancedGeometry,new i.MeshBasicMaterial({color:r}),o.length);this.add(p);let x=new i.Matrix4;for(let[e,t]of o.entries()){let{x:n,y:r,z:i,w:o}=t;p.setMatrixAt(e,(0,S.Xe)({x:n,y:r,z:i,scaleScalar:o},x))}this.controlPoints=o,this.nurbsCurve=l,this.points=c}constructor(...e){super(...e),this.degree=8,this.color=new i.Color(16711680),this.nurbsCurve=null,this.controlPoints=[],this.points=[]}}P.instancedGeometry=new i.IcosahedronGeometry(.005,12);let A=["#3366ff","#009a27","#00943b","#2512cf","#bb1d81","#67cd6c","#fed801","#ff1f02"];class T extends i.Group{addSpot(e,t){let{x:n,y:r,z:i}=e,{matrix:o,color:a}=T.shared;this.instancedMesh.setMatrixAt(this.index,o.makeTranslation(n,r,i)),this.instancedMesh.setColorAt(this.index,a.set(t)),this.index++}constructor({sizeBase:e=400}={}){super(),this.index=0;let{geometry:t,material:n,matrix:r,color:o}=T.shared;this.instancedMesh=new i.InstancedMesh(t,n,e),this.add(this.instancedMesh),r.makeScale(0,0,0),o.set("white");for(let t=0;t<e;t++)this.instancedMesh.setMatrixAt(t,r),this.instancedMesh.setColorAt(t,o)}}T.shared={geometry:new i.IcosahedronGeometry(.005,12),material:new i.MeshBasicMaterial,matrix:new i.Matrix4().makeScale(0,0,0),color:new i.Color("white")};class V extends i.Group{onTick(e){}earthRaycast(e){var t;let n=e.clone().applyMatrix4(this.matrixWorld.clone().invert()).intersectSphere(new i.Sphere(new i.Vector3,1),new i.Vector3);return null!==(t=null==n?void 0:n.applyMatrix4(this.matrixWorld))&&void 0!==t?t:null}addSphericalSpot(e){let{phi:t,theta:n,color:r="white"}=e;this.parts.miniSpots.addSpot(M({phi:t,theta:n,radius:1}),r);let i=new P;i.degree=8,i.color.set(r);let o=[M({phi:t,theta:n,radius:1})],a=n,s=t;for(let e=0;e<12;e++){let t=(0,w.t7)(2,5,e/12);o.push(M({theta:a,phi:s,radius:t})),a=(0,w.t7)(a,0,.5),s+=-.65}return i.setControlPoints(o),i}constructor(){super(),this.uniforms={uTime:l.vB.get("three").uTime,uSpherize:{value:1},uSunPosition:{value:new i.Vector3(.5,.7,.3)},uSide:{value:0}},this.userData=function(e,t){for(let[n,r]of Object.entries(t)){let[t,i="value"]=r.bind;Object.defineProperty(e,n,{enumerable:!0,get:()=>t[i],set:e=>t[i]=e}),r.meta&&Object.defineProperty(e,"".concat(n,"_meta"),{enumerable:!0,get:()=>r.meta})}return e}({},{spherize:{bind:[this.uniforms.uSpherize,"value"],meta:"Slider(0, 1)"}}),this.parts={miniSpots:new T,back:null,front:null},this.sphericalSpots=[];let e=L.load("/assets/images/blank-world-map-alt.png"),{uniforms:t}=this,n=new i.MeshBasicMaterial({map:e,transparent:!0,side:i.DoubleSide,depthWrite:!1});n.onBeforeCompile=e=>x.b.with(e).uniforms(t).varying({vWorldNormal:"vec3",vWorldPosition2:"vec3"}).vertex.replace("begin_vertex","\n        float tx = position.x;\n        float ty = position.y;\n\n        vec3 transformed;\n        vec3 normal;\n        if (uSpherize < 0.001) {\n          transformed = vec3(tx * 2.0, ty, 0.0) * PI;\n          normal = vec3(0.0, 0.0, 1.0);\n        } else {\n          float r = 1.0 / uSpherize;\n          float phi = tx * PI * 2.0 * uSpherize - PI * 0.5;\n          float theta = ty * PI * uSpherize;\n          float x = cos(theta) * cos(phi);\n          float z = cos(theta) * -sin(phi);\n          float y = sin(theta);\n          transformed = vec3(x, y, z - 1.0) * r + vec3(0.0, 0.0, uSpherize);\n          normal = vec3(x, y, z);\n        }\n        vWorldNormal = normalize(mat3(modelMatrix) * normal);\n        vWorldPosition2 = (modelMatrix * vec4(transformed, 1.0)).xyz;\n      ").vertex.mainAfterAll("\n      ").fragment.top(m.U,y.i).fragment.mainBeforeAll("\n        vec3 lightDirection = normalize(uSunPosition);\n        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n        light = pow(light, 2.0);\n\n        vec3 viewDir = normalize(cameraPosition - vWorldPosition2);\n        float cosTheta = dot(normalize(vWorldNormal * uSide), viewDir);\n        float fresnelBias = 0.1;\n        float fresnelPower = 3.0;\n        float fresnel = fresnelBias + (1.0 - fresnelBias) * pow(1.0 - cosTheta, fresnelPower);\n      ").fragment.replace("map_fragment","\n        #ifdef USE_MAP\n          vec2 uv = vMapUv;\n          float r = uv.y * 2.0;\n          if (r > 1.0) r = 2.0 - r;\n          r = 1.0 - r;          \n\n          float a = 0.0;\n          a += pow(r, 2.4) * 0.205;\n          a += pow(r, 10.0) * 0.03;\n          float x = uv.x;\n          \n          float padding = 0.005;\n          uv.x = mix(padding + a, 1.0 - padding - a, x);\n          // uv.x = 1.0 - uv.x;\n          vec4 sampledDiffuseColor = texture2D(map, uv);\n\n          diffuseColor.rgb *= vec3(mix(0.75, 1.0, light));\n          float alpha = (sampledDiffuseColor.r + sampledDiffuseColor.g + sampledDiffuseColor.b) > 0.1 ? 1.0 : 0.0;\n          diffuseColor.a *= alpha + fresnel * 1.2;\n          // diffuseColor.rgb = vec3(fresnel);\n          // diffuseColor.rgb = vWorldNormal;\n          // diffuseColor.a = 1.0;\n        #endif\n      ");let r=new i.PlaneGeometry(1,1,256,128);(0,f.cY)(this,{name:"earth"});let o=(0,f.cY)(new i.Mesh(r,n),{parent:this,name:"back"});o.onBeforeRender=()=>{t.uSide.value=-1,n.color.set("#cdcdcd"),n.side=i.BackSide,n.needsUpdate=!0},this.parts.back=o;let a=(0,f.cY)(new i.Mesh(r,n),{parent:this,name:"front"});a.onBeforeRender=()=>{t.uSide.value=1,n.color.set("#ffffff"),n.side=i.FrontSide,n.needsUpdate=!0},this.parts.front=a,(0,f.cY)(new i.Mesh(new i.PlaneGeometry,n),{parent:this,y:-1.5,scaleX:3,visible:!1}),(0,f.cY)(new v.O,{parent:this}).circle({radius:1.04}).draw(),s.T.seed(123);let c=[...g.map(e=>this.addSphericalSpot({...e,color:s.T.pick(A)})),...g.filter(()=>s.T.chance(.8)).map(e=>{let{phi:t,theta:n}=e;return t+=.04*s.T.around(),n+=.04*s.T.around(),this.addSphericalSpot({phi:t,theta:n,color:s.T.pick(A)})})];this.add(...c.map(e=>new z(e.points,{color:e.color})));let h=new C(c);this.add(h),this.add(this.parts.miniSpots)}}V.sphericalCoordinates={paris:{theta:.9426432714835036,phi:1.7045171372513754}};class D extends i.Mesh{constructor(){let e=new i.MeshBasicMaterial({color:"#cccccc",side:i.BackSide}),t={uResolution:{value:new i.Vector2}};e.onBeforeCompile=e=>x.b.with(e).uniforms(t).fragment.replace("map_fragment","\n        vec2 p = gl_FragCoord.xy / uResolution * 2.0 - 1.0;\n        float aspect = uResolution.x / uResolution.y;\n        p *= aspect > 1.0 ? vec2(1.0, 1.0 / aspect) : vec2(aspect, 1.0);\n        float alpha = 1.0 - length(p);\n        diffuseColor.rgb *= mix(0.8, 1.4, alpha);\n      "),super(new i.IcosahedronGeometry(40,12),e),this.onBeforeRender=e=>{e.getSize(t.uResolution.value).multiplyScalar(e.getPixelRatio())}}}class B extends i.Points{constructor(e=5e3){let t=new i.BufferGeometry,n=new Float32Array(3*e),r=new Float32Array(e),o=new i.Vector3;for(let t=0;t<e;t++)(function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new i.Vector3,t=2*Math.random()*Math.PI,n=Math.acos(2*Math.random()-1);return e.x=Math.sin(n)*Math.cos(t),e.y=Math.sin(n)*Math.sin(t),e.z=Math.cos(n),e})(o).multiplyScalar(36).toArray(n,3*t),r[t]=s.T.between(.2,.5);t.setAttribute("position",new i.Float32BufferAttribute(n,3)),t.setAttribute("instanceSize",new i.Float32BufferAttribute(r,1));let a=new i.PointsMaterial({color:"#ffffff"});a.onBeforeCompile=e=>x.b.with(e).vertex.top("\n        attribute float instanceSize;\n      ").vertex.mainAfterAll("\n        gl_PointSize *= instanceSize;\n      ").fragment.mainBeforeAll("\n        float dist = length(gl_PointCoord - 0.5);\n        if (dist > 0.5) discard;\n      "),super(t,a)}}class F extends i.Group{constructor(...e){super(...e),this.parts={sphere:(0,f.cY)(new D,this),stars:(0,f.cY)(new B,this)}}}let L=new i.TextureLoader;class _ extends i.Group{constructor(...e){super(...e),this.parts={ambient:(0,f.cY)(new i.AmbientLight(16777215,1.5),this),directional:(0,f.cY)(new i.DirectionalLight(16777215,1.5),this)}}}class j extends i.Group{constructor(){super(),this.parts={sky:(0,f.cY)(new F,this),earth:(0,f.cY)(new V,this),lights:(0,f.cY)(new _,this),grid:(0,f.cY)(new p.K({size:[20,20]}),{parent:this,visible:!1})},console.log("Poc1Scene!")}}class k{initialize(e,t){return this.initialized?console.warn("Pointer already initialized."):(this.initialized=!0,this.destroyables.push(...this.doInitialize(e,t))),this}*doInitialize(e,t){yield(0,h.w)(e,{onChange:n=>{this.screen.position.copy(n.position);let r=e.getBoundingClientRect(),{x:i,y:o}=n.position;i-=r.left,o-=r.top,i/=r.width,o/=r.height,i=2*i-1,o=-(2*o-1),this.ndc.position.set(i,o),this.raycaster.setFromCamera(this.ndc.position,t)},onDown:()=>{this.screen.positionDown.copy(this.screen.position),this.ndc.positionDown.copy(this.ndc.position)}})}constructor(){this.screen={position:new i.Vector2,positionDown:new i.Vector2},this.ndc={position:new i.Vector2,positionDown:new i.Vector2},this.raycaster=new i.Raycaster,this.destroyables=[],this.initialized=!1}}function I(){return(0,o.Ky)(function*(e){let t=new j;e.scene.add(t),yield()=>{t.clear().removeFromParent()},e.ticker.set({minActiveDuration:100});let n=new k;n.initialize(e.renderer.domElement,e.camera);let r=new a.F({perspective:.25,size:4});r.initialize(e.renderer.domElement),yield(0,l.RC)("three",()=>{r.update(e.camera,e.aspect)}),yield(0,h.w)(e.renderer.domElement,{onTap:()=>{let e=t.parts.earth.earthRaycast(n.raycaster.ray);if(e){let{x:n,y:r,z:i}=e,o=Math.atan2(r,Math.sqrt(n**2+i**2)),a=Math.atan2(i,n);t.parts.earth.addSphericalSpot({theta:o,phi:a})}}}),yield(0,c.p)([[{code:"Space",modifiers:"shift"},()=>{document.body.requestFullscreen()}]]),Object.assign(window,{poc1:t,three:e,controls:r})},"always"),null}function R(){return(0,r.jsxs)("div",{className:"layer thru",children:[(0,r.jsxs)(o.H7,{children:[(0,r.jsx)(u,{}),(0,r.jsx)(I,{})]}),(0,r.jsx)("header",{className:"absolute thru w-full top-0 p-8",children:(0,r.jsx)("img",{width:100,src:"/assets/images/acme-logo.png",alt:""})}),(0,r.jsx)("footer",{className:"absolute thru w-full bottom-0 p-12 flex flex-row justify-center"}),(0,r.jsx)("div",{className:"layer thru",children:(0,r.jsx)("div",{className:"absolute left-0 top-0 w-[300px] h-full"})})]})}},31454:function(e,t,n){n.d(t,{K:function(){return a}});var r=n(52471),i=n(81796);let o={color:"white",opacity:.5,size:[8,8],step:1,frame:!0};class a extends r.LineSegments{set(e){let{color:t,opacity:n,size:a,step:s,frame:l}={...o,...e},c=(0,i.iK)(a),h=(0,i.iK)(null!=s?s:c),u=[],d=(e,t)=>u.push(new r.Vector3(e,t,0));l&&(d(-c.x/2,+c.y/2),d(+c.x/2,+c.y/2),d(+c.x/2,+c.y/2),d(+c.x/2,-c.y/2),d(+c.x/2,-c.y/2),d(-c.x/2,-c.y/2),d(-c.x/2,-c.y/2),d(-c.x/2,+c.y/2));let p=Math.ceil(-c.x/2/h.x)*h.x;p===-c.x/2&&(p+=h.x);do d(p,-c.y/2),d(p,+c.y/2),p+=h.x;while(p<c.x/2);let x=Math.ceil(-c.y/2/h.y)*h.y;x===-c.y/2&&(x+=h.y);do d(-c.x/2,x),d(+c.x/2,x),x+=h.y;while(x<c.y/2);return this.geometry.setFromPoints(u),this.material.color.set(t),this.material.opacity=n,this.material.transparent=n<1,this}constructor(e){super(),this.set(null!=e?e:o)}}},88156:function(e,t,n){n.d(t,{O:function(){return c}});var r=n(52471),i=n(58648),o=n(81796);let a=new r.Vector2,s=new r.Vector3,l=new r.Matrix4;class c extends r.LineSegments{showOccludedLines(){let{opacity:e=.2}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=new r.LineBasicMaterial({color:this.material.color,transparent:!0,depthFunc:r.GreaterDepth,opacity:e}),n=new r.LineSegments(this.geometry,t);return this.add(n),this}clear(){return this.points.length=0,this.geometry.setFromPoints(this.points),this}draw(){return this.geometry.setFromPoints(this.points),this}circle(e){let{radius:t,segments:n,...i}={...c.circleDefaultOptions,...e};(0,o.Xe)(i,l);let a=new r.Vector3(1,0,0),s=new r.Vector3(0,1,0);for(let e=0;e<n;e++){let i=e/n*Math.PI*2,o=(e+1)/n*Math.PI*2,c=Math.cos(i)*t,h=Math.sin(i)*t,u=Math.cos(o)*t,d=Math.sin(o)*t,p=new r.Vector3().addScaledVector(a,c).addScaledVector(s,h).applyMatrix4(l),x=new r.Vector3().addScaledVector(a,u).addScaledVector(s,d).applyMatrix4(l);this.points.push(p,x)}return this}rectangle(e){let{centerX:t,centerY:n,width:o,height:a}=i.Ae.from(e),s=o/2,l=a/2,c=new r.Vector3(t-s,n-l,0),h=new r.Vector3(t+s,n-l,0),u=new r.Vector3(t+s,n+l,0),d=new r.Vector3(t-s,n+l,0);return this.points.push(c,h,h,u,u,d,d,c),this}box(){let{center:e=[0,0,0],size:t=1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{x:n,y:i,z:a}=(0,o.Q7)(e,s),{x:l,y:c,z:h}=(0,o.Q7)(t,s),u=l/2,d=c/2,p=h/2,x=new r.Vector3(n-u,i-d,a-p),f=new r.Vector3(n+u,i-d,a-p),m=new r.Vector3(n+u,i+d,a-p),v=new r.Vector3(n-u,i+d,a-p),y=new r.Vector3(n-u,i-d,a+p),w=new r.Vector3(n+u,i-d,a+p),g=new r.Vector3(n+u,i+d,a+p),M=new r.Vector3(n-u,i+d,a+p);return this.points.push(x,f,f,m,m,v,v,x),this.points.push(y,w,w,g,g,M,M,y),this.points.push(x,y,f,w,m,g,v,M),this}plus(e,t){let n=t/2,{x:i,y:s}=(0,o.iK)(e,a),l=new r.Vector3(i-n,s,0),c=new r.Vector3(i+n,s,0),h=new r.Vector3(i,s-n,0),u=new r.Vector3(i,s+n,0);return this.points.push(l,c,h,u),this}cross(e,t){let n=t/2,{x:i,y:s}=(0,o.iK)(e,a),l=new r.Vector3(i-n,s-n,0),c=new r.Vector3(i+n,s+n,0),h=new r.Vector3(i-n,s+n,0),u=new r.Vector3(i+n,s-n,0);return this.points.push(l,c,h,u),this}constructor(...e){super(...e),this.points=[]}}c.circleDefaultOptions={radius:.5,segments:96}},55244:function(e,t,n){n.d(t,{v:function(){return r}});let r="\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex \n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20201014 (stegu)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n// \n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+10.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r) {\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\n\n\n\n\n// 2D:\n\nvec3 mod289_2d(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289_2d(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute_2d(vec3 x) {\n  return mod289(((x*34.0)+10.0)*x);\n}\n\n\nfloat snoise(vec2 v) {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289_2d(i); // Avoid truncation effects in permutation\n  vec3 p = permute_2d( permute_2d( i.y + vec3(0.0, i1.y, 1.0 ))\n		+ i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n// 3D: \n\nfloat snoise(vec3 v)\n{ \n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n  // First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n  // Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n  // Permutations\n  i = mod289(i); \n  vec4 p = permute( permute( permute( \n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n  // Gradients: 7x7 points over a square, mapped onto an octahedron.\n  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n  //Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n  // Mix final noise value\n  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \n                                dot(p2,x2), dot(p3,x3) ) );\n}\n"},28142:function(e,t,n){n.d(t,{T:function(){return c}});let r=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(e=(e=(7*e+Math.sqrt(e)+16087*Math.sin(e))%2147483647)<0?e+2147483647:e)>1?2147483647&e:0===e?345678:123456},i=e=>e=2147483647&Math.imul(e,48271),o=e=>(e-1)/2147483646,a=e=>e,s={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function l(){let e=i(i(r(123456)));function t(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof t&&(t=t.split("").reduce((e,t)=>7*e+t.charCodeAt(0),0)),e=i(i(r(t))),u}function n(){return o(e=i(e))}function l(e){switch(e.length){default:return[0,1,a];case 1:return[0,e[0],a];case 2:return[e[0],e[1],a];case 3:return[e[0],e[1],e[2]]}}function c(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i,o,a]=l(t);return i+(o-i)*a(n())}function h(){for(var e,t=arguments.length,r=Array(t),i=0;i<t;i++)r[i]=arguments[i];let[o,a,{weightsAreNormalized:l,indexOffset:c,forbiddenItems:h}]=function(e){let[t,n=null,r]=e,i={...s,...r};if(Array.isArray(t))return[t,n,i];if("object"==typeof t)return[Object.values(t),n?Object.values(n):null,i];throw Error("pick: unsupported options type")}(r);if(h.length>0){let t=new Set;for(let e of h){let n=o.indexOf(e);n>=0&&t.add(n)}if(o=o.filter((e,n)=>!t.has(n)),a=null!==(e=null==a?void 0:a.filter((e,n)=>!t.has(n)))&&void 0!==e?e:null,0===o.length)throw Error("pick: all items are forbidden")}if(null===a){let e=Math.floor(n()*o.length);return c&&(e+=c,(e%=o.length)<0&&(e+=o.length)),o[e]}if(!l){let e=a.reduce((e,t)=>e+t,0);a=a.map(t=>t/e)}let u=n(),d=0;for(let e=0;e<o.length;e++)if(u<(d+=a[e]))return o[e];throw Error("among: unreachable")}let u={seed:t,seedMax:function(){return 2147483647},reset:function(){return t(123456),u},next:function(){return e=i(e),u},random:n,between:c,around:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i=1,o=a]=t,s=2*n();return(s>1?1:-1)*o(s>1?s-1:s)*i},int:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i,o,a]=l(t);return i+Math.floor(a(n())*(o-i))},chance:function(e){return n()<e},shuffle:function(e){let{mutate:t=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t&&Array.isArray(e)?e:[...e],i=r.length;for(let e=0;e<i;e++){let t=Math.floor(i*n()),o=r[e];r[e]=r[t],r[t]=o}return r},pick:h,createPicker:function(e){let t=e.map(e=>{let[t]=e;return t}),n=e.map(e=>{let[t,n]=e;return n}),r=n.reduce((e,t)=>e+t,0);for(let[e,t]of n.entries())n[e]=t/r;return()=>h(t,n,{weightsAreNormalized:!0})},vector:function(e,t){let[n=0,r=1]=Array.isArray(t)?t:[null==t?void 0:t.min,null==t?void 0:t.max];for(let t of Object.keys(e))e[t]=c(n,r);return e},unitVector:function(e,t){let[n=-1,r=1]=Array.isArray(t)?t:[null==t?void 0:t.min,null==t?void 0:t.max],i=Object.keys(e),o=i.map(()=>c(n,r)),a=Math.sqrt(o.reduce((e,t)=>e+t*t,0));for(let[t,n]of i.entries())e[n]=o[t]/a;return e},boxMuller:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=n(),i=n(),o=Math.sqrt(-2*Math.log(r)),a=2*Math.PI*i;return[e+t*o*Math.cos(a),e+t*o*Math.sin(a)]}};return u}let c=class{constructor(e){Object.assign(this,l().seed(e))}};Object.assign(c,l())}}]);