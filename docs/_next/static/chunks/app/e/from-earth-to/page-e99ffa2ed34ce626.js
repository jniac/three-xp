(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[844],{45350:function(e,t,n){Promise.resolve().then(n.bind(n,11737))},11737:function(e,t,n){"use strict";n.d(t,{Main:function(){return N}});var r=n(32617),o=n(88780),a=n(33966),i=n(47365),l=n(81540),s=n(15721),c=n(29368),u=n(62411),h=n(92948);function f(){return(0,a.Ky)(function*(e){Object.assign(window,{three:e,Ticker:c.vB})},[]),null}var p=n(30636),d=n(78780),x=n(97219),m=n(23247),v=n(99963),w=n(1976),g=n(47090),y=n(6246),M=JSON.parse('[{"phi":1.7045171372513754,"theta":0.9426432714835036},{"phi":1.2138204764190186,"theta":0.5877279735536564},{"phi":2.018280663352346,"theta":0.4225774045053551},{"phi":1.58623960126316,"theta":0.11530620356664824},{"phi":1.4858931296682674,"theta":0.09988610745985425},{"phi":1.370250993061531,"theta":-0.6152078487213142},{"phi":0.9459811008591165,"theta":-0.4116473816238604},{"phi":1.06660504904375,"theta":-0.22199053344895067},{"phi":2.675243191552906,"theta":-0.6045343364962831},{"phi":2.5901332086293296,"theta":-0.45113353839646375},{"phi":3.0820510158643644,"theta":-0.20059237206688585},{"phi":2.920796326794876,"theta":-0.3506750512589778},{"phi":2.707382312980871,"theta":0.025009035614594027},{"phi":-2.771515207166003,"theta":0.43045560632597474},{"phi":-3.068326429226437,"theta":0.6129817652939101},{"phi":3.1105233820660763,"theta":0.7241618779795415},{"phi":-2.5251632895865317,"theta":0.6535499652931851},{"phi":-3.015091410598426,"theta":0.8642317265005449},{"phi":3.0788690924417255,"theta":0.8159956971859744},{"phi":-2.370767607902747,"theta":0.787316008336757},{"phi":-2.5030942996270586,"theta":0.7163689975296974},{"phi":-0.28189011450089596,"theta":0.6816391217572154},{"phi":-0.2988148637926313,"theta":0.5717768908896973},{"phi":-0.1772652581758269,"theta":0.4716751222011235},{"phi":-0.05544012907477782,"theta":-0.028486000516249495},{"phi":-0.06314162733968252,"theta":0.061655565733329316},{"phi":-0.8760666510861576,"theta":-0.6838346154783156},{"phi":-0.7161612255722236,"theta":-0.11386479380967202},{"phi":-0.5032773150049611,"theta":-0.5860256589964206},{"phi":1.7599491315598337,"theta":1.0140201131361222},{"phi":1.555598726738203,"theta":1.0275620052067571},{"phi":1.5867188262212921,"theta":1.091601234052012},{"phi":1.5622775626534053,"theta":1.1451634884556725},{"phi":1.8064000451323763,"theta":0.8291516658764525},{"phi":1.7711742769485577,"theta":0.8002332318072503},{"phi":1.5274585527636149,"theta":0.838434437058171},{"phi":1.3559514207428152,"theta":0.7754675571543634},{"phi":1.1792807716216012,"theta":0.7682476175679409},{"phi":1.3076110196152615,"theta":0.9387650274681301},{"phi":1.4565810952604292,"theta":1.0264229286514035}]');let b=new o.TextureLoader;function P(){let{theta:e=0,phi:t=0,radius:n=1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments.length>1?arguments[1]:void 0;return null!=r||(r=new o.Vector3),r.x=n*Math.cos(e)*Math.cos(t),r.y=n*Math.sin(e),r.z=n*Math.cos(e)*Math.sin(t),r}class S extends o.Line{constructor(e,{color:t="white"}={}){let n=new o.BufferGeometry().setFromPoints(e),r=new o.LineDashedMaterial({color:t}),a=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:512,t=new Uint8Array(4*e),n=0;for(;n<e;){let r=y.T.int(10,20);n+r>e&&(r=e-n);for(let e=0;e<r;e++)t[4*(n+e)]=255;n+=r+y.T.int(1,80)}for(let n=0;n<e;n+=2)t[4*n+1]=255;let r=new o.DataTexture(t,e,1,o.RGBAFormat);return r.minFilter=r.magFilter=o.NearestFilter,r.wrapS=r.wrapT=o.RepeatWrapping,r.needsUpdate=!0,r}(),i={uTime:c.vB.get("three").uTime,uTextureLengthRatio:{value:40},uScale:{value:1},uTexture:{value:a},uLineLength:{value:-1}};r.onBeforeCompile=e=>m.b.with(e).uniforms(i).varying({vWorldPosition2:"vec3"}).vertex.mainAfterAll("\n        vWorldPosition2 = (modelMatrix * vec4(position, 1.0)).xyz;\n      ").fragment.top("\n        float hash(vec3 p) {\n          // Combine the components of the vec3 using dot products\n          vec3 k = vec3(127.1, 311.7, 74.7); // Large primes to create randomness\n          return fract(sin(dot(p, k)) * 43758.5453123); // Sine and fract create pseudo-randomness\n        }\n      ").fragment.replace(/if .* {\s*discard;\s*}/,"\n        float alpha = vLineDistance / uLineLength;\n        alpha = pow(alpha, 1.0 / 2.0);\n        float x = mod(uLineLength * alpha / uTextureLengthRatio + uTime * -0.05, 1.0);\n        vec4 texel = texture2D(uTexture, vec2(x, 0.5));\n        float outHash = fract(hash(vWorldPosition2) + uTime * 10.0) + mix(5.0, -1.0, alpha);\n        if (texel.r * outHash < 0.5) {\n          discard;\n        }\n      "),super(n,r),this.computeLineDistances(),i.uLineLength.value=this.geometry.attributes.lineDistance.array.at(-1)}}class z extends o.Group{constructor(e,{pointsPerCurve:t=80,curveSubdivisions:n=256}={}){super();let r=e.length*t,a=new o.BufferGeometry,i=new Float32Array(3*r);a.setAttribute("position",new o.BufferAttribute(i,3));let l=new Float32Array(4*r);y.T.seed(987632);for(let e=0;e<l.length;e++)l[e]=y.T.random();a.setAttribute("random",new o.BufferAttribute(l,4));let s=new Float32Array(e.length*n*4),u=new Float32Array(e.length*n*4);for(let r=0;r<e.length;r++){for(let e=0;e<t;e++){let n=r*t+e;i[3*n]=e,i[3*n+1]=r,i[3*n+2]=0}let o=e[r].nurbsCurve;if(!o)throw Error("NURBS curve not set.");for(let e=0;e<n;e++){let t=e/n,a=o.getPoint(t),i=o.getTangent(t),l=r*n+e;s[4*l]=a.x,s[4*l+1]=a.y,s[4*l+2]=a.z,u[4*l]=i.x,u[4*l+1]=i.y,u[4*l+2]=i.z}}let h=t=>{let r=new o.DataTexture(t,n,e.length,o.RGBAFormat,o.FloatType,o.UVMapping,o.ClampToEdgeWrapping,o.ClampToEdgeWrapping,o.NearestFilter,o.NearestFilter);return r.generateMipmaps=!1,r.needsUpdate=!0,r},f=h(s),p=h(u);y.T.seed(5678492);let d={uTime:c.vB.get("three").uTime,uPointsPerCurve:{value:t},uCurvesMapSize:{value:new o.Vector2(n,e.length)},uCurvesPositionMap:{value:f},uCurvesTangentMap:{value:p},uColors:{value:e.map(e=>e.color)},uCurveRandom:{value:e.map(()=>y.T.random())},uMaskMaps:{value:[b.load("textures/rounded-square.png"),b.load("textures/rounded-plus.png"),b.load("textures/rounded-rhomb.png")]}},x=new o.PointsMaterial({vertexColors:!0,size:.5});x.onBeforeCompile=e=>m.b.with(e).uniforms(d).varying({vRandom:"vec4"}).vertex.top(v.i).vertex.top("\n        attribute vec4 random;\n      ").vertex.replace("begin_vertex","\n        int j = gl_VertexID / int(uPointsPerCurve);\n        int i = gl_VertexID - j * int(uPointsPerCurve);\n        float r = uCurveRandom[j]; // Curve random value\n\n        vColor = uColors[j] * mix(0.8, 1.2, random.x);\n\n        float curveFraction = 0.2;\n        float curveSpeed = 0.0125;\n        float curveInnerSpeed = 0.05;\n\n        float t3 = fract(position.x / uPointsPerCurve + uTime * curveInnerSpeed);\n        float t0 = fract(curveFraction * t3 + r + uTime * curveSpeed);\n        t0 = easeIn2(t0);\n\n        float x = t0;\n        float y = position.y / uCurvesMapSize.y;\n        float xMax = uCurvesMapSize.x - 1.0; // one less because of linear interpolation (x0 -> x1)\n        float xT = fract(x * xMax);\n        float x0 = floor(x * xMax) / xMax;\n        float x1 = floor(x * xMax + 1.0) / xMax;\n        \n        vec3 p0 = texture(uCurvesPositionMap, vec2(x0, y)).xyz;\n        vec3 p1 = texture(uCurvesPositionMap, vec2(x1, y)).xyz;\n        vec3 p = mix(p0, p1, xT);\n\n        vec3 tangent0 = texture(uCurvesTangentMap, vec2(x0, y)).xyz;\n        vec3 tangent1 = texture(uCurvesTangentMap, vec2(x1, y)).xyz;\n        vec3 tangent = mix(tangent0, tangent1, xT);\n\n        vec3 normal = normalize(cross(tangent, vec3(0.0, 1.0, 0.0)));\n        vec3 binormal = normalize(cross(normal, tangent));\n\n        float t1 = sin(random.x * PI2 + uTime * mix(0.5, 1.0, random.z));\n        float t2 = sin(random.y * PI2 + uTime * mix(0.5, 1.0, random.w));\n        float dispersion = mix(0.005, 0.2, easeOut8(t0));\n        vec3 transformed = p \n          + normal * (random.z - 0.5) * dispersion * t1 \n          + binormal * (random.w - 0.5) * dispersion * t2;\n      ").vertex.mainAfterAll("\n        gl_PointSize *= mix(0.2, 1.0, easeInThenOut(t0, 16.0))\n          * mix(0.25, 1.0, easeInThenOut(t3, 6.0))\n          * mix(0.25, 1.0, random.z);\n\n        vRandom = random;\n      ").fragment.mainAfterAll("\n        if (vRandom.x < 0.5) {\n          if (texture2D(uMaskMaps[0], gl_PointCoord).r < 0.5) discard;\n        } else if (vRandom.y < 0.2) {\n          if (texture2D(uMaskMaps[1], gl_PointCoord).r < 0.5) discard;\n        } else {\n          if (texture2D(uMaskMaps[2], gl_PointCoord).r < 0.5) discard;\n        }\n      ");let w=new o.Points(a,x);this.add(w)}}var T=n(92941),C=n(32219);class A extends o.Group{setControlPoints(e){let{curveSubdivisions:t=512}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{degree:n,color:r}=this,a=e.map(e=>e instanceof o.Vector3?new o.Vector4(e.x,e.y,e.z,1):e),i=[],l=a.length;for(let e=0;e<=n;e++)i.push(0);for(let e=1;e<=l-n;e++)i.push(e);for(let e=0;e<n;e++)i.push(l-n);let s=new T.e(n,i,a),c=s.getSpacedPoints(t),u=new o.BufferGeometry().setFromPoints(c),h=new o.Line(u,new o.LineBasicMaterial({color:r}));this.add(h);let f=new o.InstancedMesh(A.instancedGeometry,new o.MeshBasicMaterial({color:r}),a.length);this.add(f);let p=new o.Matrix4;for(let[e,t]of a.entries()){let{x:n,y:r,z:o,w:a}=t;f.setMatrixAt(e,(0,C.Xe)({x:n,y:r,z:o,scaleScalar:a},p))}this.controlPoints=a,this.nurbsCurve=s,this.points=c}constructor(...e){super(...e),this.degree=8,this.color=new o.Color(16711680),this.nurbsCurve=null,this.controlPoints=[],this.points=[]}}A.instancedGeometry=new o.IcosahedronGeometry(.005,12);let k=["#3366ff","#009a27","#00943b","#2512cf","#bb1d81","#67cd6c","#fed801","#ff1f02"];class V extends o.Group{addSpot(e,t){let{x:n,y:r,z:o}=e,{matrix:a,color:i}=V.shared;this.instancedMesh.setMatrixAt(this.index,a.makeTranslation(n,r,o)),this.instancedMesh.setColorAt(this.index,i.set(t)),this.index++}constructor({sizeBase:e=400}={}){super(),this.index=0;let{geometry:t,material:n,matrix:r,color:a}=V.shared;this.instancedMesh=new o.InstancedMesh(t,n,e),this.add(this.instancedMesh),r.makeScale(0,0,0),a.set("white");for(let t=0;t<e;t++)this.instancedMesh.setMatrixAt(t,r),this.instancedMesh.setColorAt(t,a)}}V.shared={geometry:new o.IcosahedronGeometry(.005,12),material:new o.MeshBasicMaterial,matrix:new o.Matrix4().makeScale(0,0,0),color:new o.Color("white")};class B extends o.Group{onTick(e){}earthRaycast(e){var t;let n=e.clone().applyMatrix4(this.matrixWorld.clone().invert()).intersectSphere(new o.Sphere(new o.Vector3,1),new o.Vector3);return null!==(t=null==n?void 0:n.applyMatrix4(this.matrixWorld))&&void 0!==t?t:null}addSphericalSpot(e){let{phi:t,theta:n,color:r="white"}=e;this.parts.miniSpots.addSpot(P({phi:t,theta:n,radius:1}),r);let o=new A;o.degree=8,o.color.set(r);let a=[P({phi:t,theta:n,radius:1})],i=n,l=t;for(let e=0;e<12;e++){let t=(0,g.t7)(2,5,e/12);a.push(P({theta:i,phi:l,radius:t})),i=(0,g.t7)(i,0,.5),l+=-.65}return o.setControlPoints(a),o}constructor(){super(),this.uniforms={uTime:c.vB.get("three").uTime,uSpherize:{value:1},uSunPosition:{value:new o.Vector3(.5,.7,.3)},uSide:{value:0}},this.userData=function(e,t){for(let[n,r]of Object.entries(t)){let[t,o="value"]=r.bind;Object.defineProperty(e,n,{enumerable:!0,get:()=>t[o],set:e=>t[o]=e}),r.meta&&Object.defineProperty(e,"".concat(n,"_meta"),{enumerable:!0,get:()=>r.meta})}return e}({},{spherize:{bind:[this.uniforms.uSpherize,"value"],meta:"Slider(0, 1)"}}),this.parts={miniSpots:new V,back:null,front:null},this.sphericalSpots=[];let e=b.load("images/blank-world-map-alt.png"),{uniforms:t}=this,n=new o.MeshBasicMaterial({map:e,transparent:!0,side:o.DoubleSide,depthWrite:!1});n.onBeforeCompile=e=>m.b.with(e).uniforms(t).varying({vWorldNormal:"vec3",vWorldPosition2:"vec3"}).vertex.replace("begin_vertex","\n        float tx = position.x;\n        float ty = position.y;\n\n        vec3 transformed;\n        vec3 normal;\n        if (uSpherize < 0.001) {\n          transformed = vec3(tx * 2.0, ty, 0.0) * PI;\n          normal = vec3(0.0, 0.0, 1.0);\n        } else {\n          float r = 1.0 / uSpherize;\n          float phi = tx * PI * 2.0 * uSpherize - PI * 0.5;\n          float theta = ty * PI * uSpherize;\n          float x = cos(theta) * cos(phi);\n          float z = cos(theta) * -sin(phi);\n          float y = sin(theta);\n          transformed = vec3(x, y, z - 1.0) * r + vec3(0.0, 0.0, uSpherize);\n          normal = vec3(x, y, z);\n        }\n        vWorldNormal = normalize(mat3(modelMatrix) * normal);\n        vWorldPosition2 = (modelMatrix * vec4(transformed, 1.0)).xyz;\n      ").vertex.mainAfterAll("\n      ").fragment.top(w.U,v.i).fragment.mainBeforeAll("\n        vec3 lightDirection = normalize(uSunPosition);\n        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n        light = pow(light, 2.0);\n\n        vec3 viewDir = normalize(cameraPosition - vWorldPosition2);\n        float cosTheta = dot(normalize(vWorldNormal * uSide), viewDir);\n        float fresnelBias = 0.1;\n        float fresnelPower = 3.0;\n        float fresnel = fresnelBias + (1.0 - fresnelBias) * pow(1.0 - cosTheta, fresnelPower);\n      ").fragment.replace("map_fragment","\n        #ifdef USE_MAP\n          vec2 uv = vMapUv;\n          float r = uv.y * 2.0;\n          if (r > 1.0) r = 2.0 - r;\n          r = 1.0 - r;          \n\n          float a = 0.0;\n          a += pow(r, 2.4) * 0.205;\n          a += pow(r, 10.0) * 0.03;\n          float x = uv.x;\n          \n          float padding = 0.005;\n          uv.x = mix(padding + a, 1.0 - padding - a, x);\n          // uv.x = 1.0 - uv.x;\n          vec4 sampledDiffuseColor = texture2D(map, uv);\n\n          diffuseColor.rgb *= vec3(mix(0.75, 1.0, light));\n          float alpha = (sampledDiffuseColor.r + sampledDiffuseColor.g + sampledDiffuseColor.b) > 0.1 ? 1.0 : 0.0;\n          diffuseColor.a *= alpha + fresnel * 1.2;\n          // diffuseColor.rgb = vec3(fresnel);\n          // diffuseColor.rgb = vWorldNormal;\n          // diffuseColor.a = 1.0;\n        #endif\n      ");let r=new o.PlaneGeometry(1,1,256,128);(0,d.cY)(this,{name:"earth"});let a=(0,d.cY)(new o.Mesh(r,n),{parent:this,name:"back"});a.onBeforeRender=()=>{t.uSide.value=-1,n.color.set("#cdcdcd"),n.side=o.BackSide,n.needsUpdate=!0},this.parts.back=a;let i=(0,d.cY)(new o.Mesh(r,n),{parent:this,name:"front"});i.onBeforeRender=()=>{t.uSide.value=1,n.color.set("#ffffff"),n.side=o.FrontSide,n.needsUpdate=!0},this.parts.front=i,(0,d.cY)(new o.Mesh(new o.PlaneGeometry,n),{parent:this,y:-1.5,scaleX:3,visible:!1}),(0,d.cY)(new x.O,{parent:this}).circle({radius:1.04}).draw(),y.T.seed(123);let l=[...M.map(e=>this.addSphericalSpot({...e,color:y.T.pick(k)})),...M.filter(()=>y.T.chance(.8)).map(e=>{let{phi:t,theta:n}=e;return t+=.04*y.T.around(),n+=.04*y.T.around(),this.addSphericalSpot({phi:t,theta:n,color:y.T.pick(k)})})];this.add(...l.map(e=>new S(e.points,{color:e.color})));let s=new z(l);this.add(s),this.add(this.parts.miniSpots)}}B.sphericalCoordinates={paris:{theta:.9426432714835036,phi:1.7045171372513754}};class I extends o.Mesh{constructor(){let e=new o.MeshBasicMaterial({color:"#cccccc",side:o.BackSide}),t={uResolution:{value:new o.Vector2}};e.onBeforeCompile=e=>m.b.with(e).uniforms(t).fragment.replace("map_fragment","\n        vec2 p = gl_FragCoord.xy / uResolution * 2.0 - 1.0;\n        float aspect = uResolution.x / uResolution.y;\n        p *= aspect > 1.0 ? vec2(1.0, 1.0 / aspect) : vec2(aspect, 1.0);\n        float alpha = 1.0 - length(p);\n        diffuseColor.rgb *= mix(0.8, 1.4, alpha);\n      "),super(new o.IcosahedronGeometry(40,12),e),this.onBeforeRender=e=>{e.getSize(t.uResolution.value).multiplyScalar(e.getPixelRatio())}}}class L extends o.Points{constructor(e=5e3){let t=new o.BufferGeometry,n=new Float32Array(3*e),r=new Float32Array(e),a=new o.Vector3;for(let t=0;t<e;t++)(function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o.Vector3,t=2*Math.random()*Math.PI,n=Math.acos(2*Math.random()-1);return e.x=Math.sin(n)*Math.cos(t),e.y=Math.sin(n)*Math.sin(t),e.z=Math.cos(n),e})(a).multiplyScalar(36).toArray(n,3*t),r[t]=y.T.between(.2,.5);t.setAttribute("position",new o.Float32BufferAttribute(n,3)),t.setAttribute("instanceSize",new o.Float32BufferAttribute(r,1));let i=new o.PointsMaterial({color:"#ffffff"});i.onBeforeCompile=e=>m.b.with(e).vertex.top("\n        attribute float instanceSize;\n      ").vertex.mainAfterAll("\n        gl_PointSize *= instanceSize;\n      ").fragment.mainBeforeAll("\n        float dist = length(gl_PointCoord - 0.5);\n        if (dist > 0.5) discard;\n      "),super(t,i)}}class O extends o.Group{constructor(...e){super(...e),this.parts={sphere:(0,d.cY)(new I,this),stars:(0,d.cY)(new L,this)}}}class j extends o.Group{constructor(...e){super(...e),this.parts={ambient:(0,d.cY)(new o.AmbientLight(16777215,1.5),this),directional:(0,d.cY)(new o.DirectionalLight(16777215,1.5),this)}}}class D extends o.Group{constructor(...e){super(...e),this.parts={sky:(0,d.cY)(new O,this),earth:(0,d.cY)(new B,this),lights:(0,d.cY)(new j,this),grid:(0,d.cY)(new p.K({size:[20,20]}),{parent:this,visible:!1})}}}class R{initialize(e,t){return this.initialized?console.warn("Pointer already initialized."):(this.initialized=!0,this.destroyables.push(...this.doInitialize(e,t))),this}*doInitialize(e,t){yield(0,l.w)(e,{onChange:n=>{this.screen.position.copy(n.position);let r=e.getBoundingClientRect(),{x:o,y:a}=n.position;o-=r.left,a-=r.top,o/=r.width,a/=r.height,o=2*o-1,a=-(2*a-1),this.ndc.position.set(o,a),this.raycaster.setFromCamera(this.ndc.position,t)},onDown:()=>{this.screen.positionDown.copy(this.screen.position),this.ndc.positionDown.copy(this.ndc.position)}})}constructor(){this.screen={position:new o.Vector2,positionDown:new o.Vector2},this.ndc={position:new o.Vector2,positionDown:new o.Vector2},this.raycaster=new o.Raycaster,this.destroyables=[],this.initialized=!1}}function F(){return(0,a.Ky)(function*(e){let t=new D;e.scene.add(t),yield()=>{t.clear().removeFromParent()},e.ticker.set({minActiveDuration:100});let n=new R;n.initialize(e.renderer.domElement,e.camera);let r=new s.F({perspective:.25,size:4});r.start(e.renderer.domElement),yield(0,c.RC)("three",()=>{r.update(e.camera,e.aspect)}),yield(0,l.w)(e.renderer.domElement,{onTap:()=>{let e=t.parts.earth.earthRaycast(n.raycaster.ray);if(e){let{x:n,y:r,z:o}=e,a=Math.atan2(r,Math.sqrt(n**2+o**2)),i=Math.atan2(o,n);t.parts.earth.addSphericalSpot({theta:a,phi:i})}}}),yield(0,i.p)([[{code:"Space",modifiers:"shift"},()=>{document.body.requestFullscreen()}]]),Object.assign(window,{poc1:t,three:e,controls:r})},"always"),null}function G(){return(0,a.Ky)(function*(e){(0,h.a)(e),b.setPath(u.v.assets()),console.log("Assets config.assetsPath: ".concat(u.v.assets()))},[]),null}function N(){return(0,r.jsxs)("div",{className:"layer thru",children:[(0,r.jsxs)(a.H7,{children:[(0,r.jsx)(G,{}),(0,r.jsx)(f,{}),(0,r.jsx)(F,{})]}),(0,r.jsx)("header",{className:"absolute thru w-full top-0 p-8",children:(0,r.jsx)("img",{width:100,src:u.v.assets("images/acme-logo.png"),alt:""})}),(0,r.jsx)("footer",{className:"absolute thru w-full bottom-0 p-12 flex flex-row justify-center"}),(0,r.jsx)("div",{className:"layer thru",children:(0,r.jsx)("div",{className:"absolute left-0 top-0 w-[300px] h-full"})})]})}},62411:function(e,t,n){"use strict";n.d(t,{v:function(){return o}});let r="/three-xp/assets/",o={development:!1,assetsPath:r,assets:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return"".concat(r).concat(e)}}},92948:function(e,t,n){"use strict";n.d(t,{Leak:function(){return s},a:function(){return l}});var r=n(88780),o=n(90118),a=n(58100),i=n(6246);function l(e){Object.assign(window,{...r,...a,...o,...e,PRNG:i.T})}function s(e){return l(e),null}},30636:function(e,t,n){"use strict";n.d(t,{K:function(){return i}});var r=n(88780),o=n(32219);let a={color:"white",opacity:.5,size:[8,8],step:1,frame:!0};class i extends r.LineSegments{set(e){let{color:t,opacity:n,size:i,step:l,frame:s}={...a,...e},c=(0,o.iK)(i),u=(0,o.iK)(null!=l?l:c),h=[],f=(e,t)=>h.push(new r.Vector3(e,t,0));s&&(f(-c.x/2,+c.y/2),f(+c.x/2,+c.y/2),f(+c.x/2,+c.y/2),f(+c.x/2,-c.y/2),f(+c.x/2,-c.y/2),f(-c.x/2,-c.y/2),f(-c.x/2,-c.y/2),f(-c.x/2,+c.y/2));let p=Math.ceil(-c.x/2/u.x)*u.x;p===-c.x/2&&(p+=u.x);do f(p,-c.y/2),f(p,+c.y/2),p+=u.x;while(p<c.x/2);let d=Math.ceil(-c.y/2/u.y)*u.y;d===-c.y/2&&(d+=u.y);do f(-c.x/2,d),f(+c.x/2,d),d+=u.y;while(d<c.y/2);return this.geometry.setFromPoints(h),this.material.color.set(t),this.material.opacity=n,this.material.transparent=n<1,this}constructor(e){super(),this.set(null!=e?e:a)}}},7876:function(e,t,n){"use strict";n.d(t,{l:function(){return r}});let r="\n#ifndef GLSL_BASIC\n#define GLSL_BASIC\n\nfloat clamp01(float x) {\n  return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;\n}\n\n#endif\n"},99963:function(e,t,n){"use strict";n.d(t,{i:function(){return a}});var r=n(7876);let o=["linear"];for(let e=1;e<=10;e++)o.push("easeIn".concat(e)),o.push("easeOut".concat(e)),o.push("easeInOut".concat(e)),o.push("easeOutIn".concat(e));let a="\n#ifndef GLSL_EASING\n#define GLSL_EASING\n\n".concat(r.l,"\n\nfloat easePow1(float x) {\n  return x;\n}\n\nfloat easePow2(float x) {\n  return x * x;\n}\n\nfloat easePow3(float x) {\n  return x * x * x;\n}\n\nfloat easePow4(float x) {\n  x *= x;\n  return x *= x;\n}\n\nfloat easePow5(float x) {\n  float x0 = x;\n  x *= x;\n  x *= x;\n  return x0 * x;\n}\n\nfloat easePow6(float x) {\n  x *= x * x;\n  return x *= x;\n}\n\nfloat easePow7(float x) {\n  float x0 = x;\n  x *= x * x;\n  x *= x;\n  return x0 * x;\n}\n\nfloat easePow8(float x) {\n  x *= x;\n  x *= x;\n  return x *= x;\n}\n\nfloat easePow9(float x) {\n  x *= x * x;\n  return x *= x * x;\n}\n\nfloat easePow10(float x) {\n  float x0 = x;\n  x *= x * x;\n  x *= x * x;\n  return x0 * x;\n}\n\nfloat linear(float x) {\n  return clamp01(x);\n}\n\n").concat(Array.from({length:10},(e,t)=>{let n=t+1;return"\n\nfloat easeIn".concat(n," (float x) {\n  return easePow").concat(n,"(clamp01(x));\n}\nfloat easeOut").concat(n," (float x) {\n  return 1.0 - easePow").concat(n,"(clamp01(1.0 - x));\n}\nfloat easeInOut").concat(n," (float x) {\n  return x < 0.5 \n    ? 0.5 * easePow").concat(n,"(2.0 * x) \n    : 1.0 - 0.5 * easePow").concat(n,"(2.0 * (1.0 - x));\n}\nfloat easeOutIn").concat(n," (float x) {\n  return x < 0.5\n    ? 0.5 * (1.0 - easePow").concat(n,"(1.0 - x * 2.0))\n    : 1.0 - 0.5 * (1.0 - easePow").concat(n,"(2.0 * x - 1.0));\n}\n\n").trim()}).join("\n\n"),"\n\n\n// https://www.desmos.com/calculator/mqou4lf9zc?lang=fr\nfloat easeInOut(float x, float p, float i) {\n  return  x <= 0.0 ? 0.0 :\n          x >= 1.0 ? 1.0 :\n          x <= i ? 1.0 / pow(i, p - 1.0) * pow(x, p) :\n          1.0 - 1.0 / pow(1.0 - i, p - 1.0) * pow(1.0 - x, p);\n}\n\n// https://www.desmos.com/calculator/nrjlezusdv\nfloat easeInThenOut(float x, float p) {\n  return 1.0 - pow(abs(2.0 * x - 1.0), p);\n}\n\n#endif\n")},18075:function(e,t,n){"use strict";n.d(t,{C:function(){return o}});let r={vecX:["float","vec2","vec3","vec4"]},o=(e,t)=>{let n=[],o=Array.isArray(e)?e:[e].map(e=>e in r?r[e]:e).flat();if("function"==typeof t)for(let e of o)n.push(t(e).replaceAll(/\bT\b/g,e));else for(let e of o)n.push(t.replaceAll(/\bT\b/g,e));return n.join("\n")}},1976:function(e,t,n){"use strict";n.d(t,{U:function(){return a}});var r=n(7876),o=n(18075);let a="\n  ".concat(r.l,"\n\n  float sin01(float x) {\n    return 0.5 + 0.5 * sin(x * 6.283185307179586);\n  }\n\n  vec2 scaleAround(vec2 p, vec2 c, float s) {\n    return c + (p - c) / s;\n  }\n\n  // Same as mix, but clamped.\n  ").concat((0,o.C)("vecX","\n    T lerp(in T a, in T b, in float x) {\n      return mix(a, b, clamp01(x));\n    }\n  "),"\n\n  float inverseLerpUnclamped(in float a, in float b, float x) {\n    return (x - a) / (b - a);\n  }\n\n  float inverseLerp(in float a, in float b, float x) {\n    return clamp01((x - a) / (b - a));\n  }\n\n  float threshold(in float x, in float thresholdValue) {\n    return x < thresholdValue ? 0. : 1.;\n  }\n\n  float threshold(in float x, in float thresholdValue, in float width) {\n    return width < 1e-9 \n      ? (x < thresholdValue ? 0. : 1.)\n      : clamp01((x - thresholdValue + width * .5) / width);\n  }\n\n  mat3 extractRotation(mat4 matrix) {\n    return mat3(matrix[0].xyz, matrix[1].xyz, matrix[2].xyz);\n  }\n\n  vec2 rotate(vec2 p, float a) {\n    float c = cos(a);\n    float s = sin(a);\n    float x = c * p.x + s * p.y;\n    float y = -s * p.x + c * p.y;\n    return vec2(x, y);\n  }\n\n  vec2 rotateAround(vec2 p, float a, vec2 c) {\n    return c + rotate(p - c, a);\n  }\n\n  vec2 rotateScaleAround(vec2 p, float a, float s, vec2 c) {\n    return c + rotate((p - c) / s, a);\n  }\n  \n  float positiveModulo(float x) {\n    x = mod(x, 1.0);\n    return x < 0.0 ? x + 1.0 : x;\n  }\n\n  float positiveModulo(float x, float modulo) {\n    x = mod(x, modulo);\n    return x < 0.0 ? x + modulo : x;\n  }\n\n  // Limit a value to a maximum that the function tends to reach when x -> ∞\n  // https://www.desmos.com/calculator/0vewkbnscu\n  float limited(float x, float maxValue) {\n    return x <= 0.0 ? x : maxValue * x / (maxValue + x);\n  }\n\n  // https://www.desmos.com/calculator/0vewkbnscu\n  float limited(float x, float minValue, float maxValue) {\n    float d = maxValue - minValue;\n    float xd = x - minValue;\n    return x <= minValue ? x : minValue + d * xd / (d + xd);\n  }\n\n  float sqLength(in vec2 p) {\n    return p.x * p.x + p.y * p.y;\n  }\n\n  float sqLength(in vec3 p) {\n    return p.x * p.x + p.y * p.y + p.z * p.z;\n  }\n\n  float pcurve(float x, float a, float b) {\n    float k = pow(a + b, a + b) / (pow(a, a) * pow(b, b));\n    return k * pow(x, a) * pow(1.0 - x, b);\n  }\n\n  float hash(vec3 p) {\n    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);\n  }\n\n  ").concat((0,o.C)("vecX","\n    T min3(in T a, in T b, in T c) {\n      return min(min(a, b), c);\n    }\n  "),"\n\n  ").concat((0,o.C)("vecX","\n    T min4(in T a, in T b, in T c, in T d) {\n      return min(min(a, b), min(c, d));\n    }\n  "),"\n")},6246:function(e,t,n){"use strict";n.d(t,{T:function(){return c}});let r=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(e=(e=(7*e+Math.sqrt(e)+16087*Math.sin(e))%2147483647)<0?e+2147483647:e)>1?2147483647&e:0===e?345678:123456},o=e=>e=2147483647&Math.imul(e,48271),a=e=>(e-1)/2147483646,i=e=>e,l={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function s(){let e=o(o(r(123456)));function t(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof t&&(t=t.split("").reduce((e,t)=>7*e+t.charCodeAt(0),0)),e=o(o(r(t))),f}function n(){return a(e=o(e))}function s(e){switch(e.length){default:return[0,1,i];case 1:return[0,e[0],i];case 2:return[e[0],e[1],i];case 3:return[e[0],e[1],e[2]]}}function c(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[o,a,i]=s(t);return o+(a-o)*i(n())}function u(){for(var e,t=arguments.length,r=Array(t),o=0;o<t;o++)r[o]=arguments[o];let[a,i,{weightsAreNormalized:s,indexOffset:c,forbiddenItems:u}]=function(e){let[t,n=null,r]=e,o={...l,...r};if(Array.isArray(t))return[t,n,o];if("object"==typeof t)return[Object.values(t),n?Object.values(n):null,o];throw Error("pick: unsupported options type")}(r);if(u.length>0){let t=new Set;for(let e of u){let n=a.indexOf(e);n>=0&&t.add(n)}if(a=a.filter((e,n)=>!t.has(n)),i=null!==(e=null==i?void 0:i.filter((e,n)=>!t.has(n)))&&void 0!==e?e:null,0===a.length)throw Error("pick: all items are forbidden")}if(null===i){let e=Math.floor(n()*a.length);return c&&(e+=c,(e%=a.length)<0&&(e+=a.length)),a[e]}if(!s){let e=i.reduce((e,t)=>e+t,0);i=i.map(t=>t/e)}let h=n(),f=0;for(let e=0;e<a.length;e++)if(h<(f+=i[e]))return a[e];throw Error("among: unreachable")}function h(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=n(),o=n(),a=Math.sqrt(-2*Math.log(r)),i=2*Math.PI*o;return[e+t*a*Math.cos(i),e+t*a*Math.sin(i)]}let f={seed:t,seedMax:function(){return 2147483647},reset:function(){return t(123456),f},next:function(){return e=o(e),f},random:n,between:c,around:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[o=1,a=i]=t,l=2*n();return(l>1?1:-1)*a(l>1?l-1:l)*o},int:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[o,a,i]=s(t);return o+Math.floor(i(n())*(a-o))},chance:function(e){return n()<e},shuffle:function(e){let{mutate:t=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t&&Array.isArray(e)?e:[...e],o=r.length;for(let e=0;e<o;e++){let t=Math.floor(o*n()),a=r[e];r[e]=r[t],r[t]=a}return r},pick:u,createPicker:function(e){let t=e.map(e=>{let[t]=e;return t}),n=e.map(e=>{let[t,n]=e;return n}),r=n.reduce((e,t)=>e+t,0);for(let[e,t]of n.entries())n[e]=t/r;return()=>u(t,n,{weightsAreNormalized:!0})},vector:function(e,t){let[n=0,r=1]=Array.isArray(t)?t:[null==t?void 0:t.min,null==t?void 0:t.max];for(let t of Object.keys(e))e[t]=c(n,r);return e},unitVector2:function(e){let t=2*Math.PI*n();return e.x=Math.cos(t),e.y=Math.sin(t),e},unitVector3:function(e){let t=n(),r=n(),o=2*Math.PI*t,a=Math.acos(1-2*r);return e.x=Math.sin(a)*Math.cos(o),e.y=Math.sin(a)*Math.sin(o),e.z=Math.cos(a),e},normalVector:function(e){let t=Object.keys(e),n=t.length,r=Math.sqrt(n);for(let o=0;o<n;o+=2){let[a,i]=h();e[t[o]]=a/r,o+1<n&&(e[t[o+1]]=i/r)}return e},unitVector:function(e){let t=Object.keys(e),n=t.length,r=0;for(let o=0;o<n;o+=2){let[a,i]=h();e[t[o]]=a,r+=a*a,o+1<n&&(e[t[o+1]]=i,r+=i*i)}r=Math.sqrt(r);for(let o=0;o<n;o++)e[t[o]]/=r;return e},boxMuller:h};return f}let c=class{constructor(e){Object.assign(this,s().seed(e))}};Object.assign(c,s())},92941:function(e,t,n){"use strict";n.d(t,{e:function(){return a}});var r=n(88780);function o(e,t,n){let r=n.length-e-1;if(t>=n[r])return r-1;if(t<=n[e])return e;let o=e,a=r,i=Math.floor((o+a)/2);for(;t<n[i]||t>=n[i+1];)t<n[i]?a=i:o=i,i=Math.floor((o+a)/2);return i}class a extends r.Curve{constructor(e,t,n,o,a){super();let i=t?t.length-1:0,l=n?n.length:0;this.degree=e,this.knots=t,this.controlPoints=[],this.startKnot=o||0,this.endKnot=a||i;for(let e=0;e<l;++e){let t=n[e];this.controlPoints[e]=new r.Vector4(t.x,t.y,t.z,t.w)}}getPoint(e,t=new r.Vector3){let n=this.knots[this.startKnot]+e*(this.knots[this.endKnot]-this.knots[this.startKnot]),a=function(e,t,n,a){let i=o(e,a,t),l=function(e,t,n,r){let o=[],a=[],i=[];o[0]=1;for(let l=1;l<=n;++l){a[l]=t-r[e+1-l],i[l]=r[e+l]-t;let n=0;for(let e=0;e<l;++e){let t=i[e+1],r=a[l-e],s=o[e]/(t+r);o[e]=n+t*s,n=r*s}o[l]=n}return o}(i,a,e,t),s=new r.Vector4(0,0,0,0);for(let t=0;t<=e;++t){let r=n[i-e+t],o=l[t],a=r.w*o;s.x+=r.x*a,s.y+=r.y*a,s.z+=r.z*a,s.w+=r.w*o}return s}(this.degree,this.knots,this.controlPoints,n);return 1!==a.w&&a.divideScalar(a.w),t.set(a.x,a.y,a.z)}getTangent(e,t=new r.Vector3){var n;let a=this.knots[0]+e*(this.knots[this.knots.length-1]-this.knots[0]),i=(n=this.degree,function(e){let t=e.length,n=[],o=[];for(let a=0;a<t;++a){let t=e[a];n[a]=new r.Vector3(t.x,t.y,t.z),o[a]=t.w}let a=[];for(let e=0;e<t;++e){let t=n[e].clone();for(let n=1;n<=e;++n)t.sub(a[e-n].clone().multiplyScalar(function(e,t){let n=1;for(let t=2;t<=e;++t)n*=t;let r=1;for(let e=2;e<=t;++e)r*=e;for(let n=2;n<=e-t;++n)r*=n;return n/r}(e,n)*o[n]));a[e]=t.divideScalar(o[0])}return a}(function(e,t,n,a,i){let l=1<e?1:e,s=[],c=o(e,a,t),u=function(e,t,n,r,o){let a=[];for(let e=0;e<=n;++e)a[e]=0;let i=[];for(let e=0;e<=r;++e)i[e]=a.slice(0);let l=[];for(let e=0;e<=n;++e)l[e]=a.slice(0);l[0][0]=1;let s=a.slice(0),c=a.slice(0);for(let r=1;r<=n;++r){s[r]=t-o[e+1-r],c[r]=o[e+r]-t;let n=0;for(let e=0;e<r;++e){let t=c[e+1],o=s[r-e];l[r][e]=t+o;let a=l[e][r-1]/l[r][e];l[e][r]=n+t*a,n=o*a}l[r][r]=n}for(let e=0;e<=n;++e)i[0][e]=l[e][n];for(let e=0;e<=n;++e){let t=0,o=1,s=[];for(let e=0;e<=n;++e)s[e]=a.slice(0);s[0][0]=1;for(let a=1;a<=r;++a){let r=0,c=e-a,u=n-a;e>=a&&(s[o][0]=s[t][0]/l[u+1][c],r=s[o][0]*l[c][u]);let h=c>=-1?1:-c,f=e-1<=u?a-1:n-e;for(let e=h;e<=f;++e)s[o][e]=(s[t][e]-s[t][e-1])/l[u+1][c+e],r+=s[o][e]*l[c+e][u];e<=u&&(s[o][a]=-s[t][a-1]/l[u+1][e],r+=s[o][a]*l[e][u]),i[a][e]=r;let p=t;t=o,o=p}}let u=n;for(let e=1;e<=r;++e){for(let t=0;t<=n;++t)i[e][t]*=u;u*=n-e}return i}(c,a,e,l,t),h=[];for(let e=0;e<n.length;++e){let t=n[e].clone(),r=t.w;t.x*=r,t.y*=r,t.z*=r,h[e]=t}for(let t=0;t<=l;++t){let n=h[c-e].clone().multiplyScalar(u[t][0]);for(let r=1;r<=e;++r)n.add(h[c-e+r].clone().multiplyScalar(u[t][r]));s[t]=n}for(let e=l+1;e<=i+1;++e)s[e]=new r.Vector4(0,0,0);return s}(n,this.knots,this.controlPoints,a,1)));return t.copy(i[1]).normalize(),t}toJSON(){let e=super.toJSON();return e.degree=this.degree,e.knots=[...this.knots],e.controlPoints=this.controlPoints.map(e=>e.toArray()),e.startKnot=this.startKnot,e.endKnot=this.endKnot,e}fromJSON(e){return super.fromJSON(e),this.degree=e.degree,this.knots=[...e.knots],this.controlPoints=e.controlPoints.map(e=>new r.Vector4(e[0],e[1],e[2],e[3])),this.startKnot=e.startKnot,this.endKnot=e.endKnot,this}}}},function(e){e.O(0,[7987,7512,1561,7834,6158,3956,1067,3310,749,812,3420,1540,6567,8100,9258,5721,1174,5284,1618,5694,2840,1744],function(){return e(e.s=45350)}),_N_E=e.O()}]);