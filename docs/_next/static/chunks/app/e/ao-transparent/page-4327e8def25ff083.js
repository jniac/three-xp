(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3815],{25449:function(e,t,a){Promise.resolve().then(a.bind(a,40034))},40034:function(e,t,a){"use strict";a.d(t,{Main:function(){return S}});var r=a(78485),i=a(27275),s=a(48583),n=a(51886),l=a(52471),o=a(86712),d=a(55445),h=a(55440),u=a(82048),p=a(19687),c=a(28954),m=a(54422),f=a(9710),g=a(32423),v=a(39900),M=a(62604),y=a(38885),x=a(15529),T=a(31229);class w extends M.w{dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this.fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){void 0!==e?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new l.DepthTexture,this.depthTexture.format=l.DepthStencilFormat,this.depthTexture.type=l.UnsignedInt248Type,this.normalRenderTarget=new l.WebGLRenderTarget(this.width,this.height,{minFilter:l.NearestFilter,magFilter:l.NearestFilter,type:l.HalfFloatType,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let a=this.normalTexture?1:0,r=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=a,this.gtaoMaterial.defines.DEPTH_SWIZZLING=r,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=a,this.pdMaterial.defines.DEPTH_SWIZZLING=r,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=1!==this.gtaoMaterial.defines.SCENE_CLIP_BOX,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=0===this.gtaoMaterial.defines.SCENE_CLIP_BOX,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){void 0!==e.radius&&(this.gtaoMaterial.uniforms.radius.value=e.radius),void 0!==e.distanceExponent&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),void 0!==e.thickness&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),void 0!==e.distanceFallOff&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),void 0!==e.scale&&(this.gtaoMaterial.uniforms.scale.value=e.scale),void 0!==e.samples&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),void 0!==e.screenSpaceRadius&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;void 0!==e.lumaPhi&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),void 0!==e.depthPhi&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),void 0!==e.normalPhi&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),void 0!==e.radius&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),void 0!==e.radiusExponent&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),void 0!==e.rings&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),void 0!==e.samples&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=(0,T.a)(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,a){switch(this._renderGBuffer&&(this.overrideVisibility(),this.renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this.restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this.renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case w.OUTPUT.Off:break;case w.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=a.texture,this.copyMaterial.blending=l.NoBlending,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case w.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=l.NoBlending,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case w.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=l.NoBlending,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case w.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case w.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=l.NoBlending,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case w.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=a.texture,this.copyMaterial.blending=l.NoBlending,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}renderPass(e,t,a,r,i){e.getClearColor(this.originalClearColor);let s=e.getClearAlpha(),n=e.autoClear;e.setRenderTarget(a),e.autoClear=!1,null!=r&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.fsQuad.material=t,this.fsQuad.render(e),e.autoClear=n,e.setClearColor(this.originalClearColor),e.setClearAlpha(s)}renderOverride(e,t,a,r,i){e.getClearColor(this.originalClearColor);let s=e.getClearAlpha(),n=e.autoClear;e.setRenderTarget(a),e.autoClear=!1,r=t.clearColor||r,i=t.clearAlpha||i,null!=r&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t;let l=this.camera.layers.mask;this.camera.layers.set(0),e.render(this.scene,this.camera),this.camera.layers.mask=l,this.scene.overrideMaterial=null,e.autoClear=n,e.setClearColor(this.originalClearColor),e.setClearAlpha(s)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){t.set(e,e.visible),(e.isPoints||e.isLine)&&(e.visible=!1)})}restoreVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){let a=t.get(e);e.visible=a}),t.clear()}generateNoise(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:64,t=new v.L,a=new Uint8Array(e*e*4);for(let r=0;r<e;r++)for(let i=0;i<e;i++){let s=r,n=i;a[(r*e+i)*4]=(.5*t.noise(s,n)+.5)*255,a[(r*e+i)*4+1]=(.5*t.noise(s+e,n)+.5)*255,a[(r*e+i)*4+2]=(.5*t.noise(s,n+e)+.5)*255,a[(r*e+i)*4+3]=(.5*t.noise(s+e,n+e)+.5)*255}let r=new l.DataTexture(a,e,e,l.RGBAFormat,l.UnsignedByteType);return r.wrapS=l.RepeatWrapping,r.wrapT=l.RepeatWrapping,r.needsUpdate=!0,r}constructor(e,t,a,r,i,s,n){super(),this.width=void 0!==a?a:512,this.height=void 0!==r?r:512,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=new Map,this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=(0,x.mK)(),this.pdNoiseTexture=this.generateNoise(),this.gtaoRenderTarget=new l.WebGLRenderTarget(this.width,this.height,{type:l.HalfFloatType}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new l.ShaderMaterial({defines:Object.assign({},x.Sp.defines),uniforms:l.UniformsUtils.clone(x.Sp.uniforms),vertexShader:x.Sp.vertexShader,fragmentShader:x.Sp.fragmentShader,blending:l.NoBlending,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new l.MeshNormalMaterial,this.normalMaterial.blending=l.NoBlending,this.pdMaterial=new l.ShaderMaterial({defines:Object.assign({},T.m.defines),uniforms:l.UniformsUtils.clone(T.m.uniforms),vertexShader:T.m.vertexShader,fragmentShader:T.m.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new l.ShaderMaterial({defines:Object.assign({},x.gs.defines),uniforms:l.UniformsUtils.clone(x.gs.uniforms),vertexShader:x.gs.vertexShader,fragmentShader:x.gs.fragmentShader,blending:l.NoBlending}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new l.ShaderMaterial({uniforms:l.UniformsUtils.clone(y.C.uniforms),vertexShader:y.C.vertexShader,fragmentShader:y.C.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:l.DstColorFactor,blendDst:l.ZeroFactor,blendEquation:l.AddEquation,blendSrcAlpha:l.DstAlphaFactor,blendDstAlpha:l.ZeroFactor,blendEquationAlpha:l.AddEquation}),this.blendMaterial=new l.ShaderMaterial({uniforms:l.UniformsUtils.clone(x.mF.uniforms),vertexShader:x.mF.vertexShader,fragmentShader:x.mF.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:l.CustomBlending,blendSrc:l.DstColorFactor,blendDst:l.ZeroFactor,blendEquation:l.AddEquation,blendSrcAlpha:l.DstAlphaFactor,blendDstAlpha:l.ZeroFactor,blendEquationAlpha:l.AddEquation}),this.fsQuad=new M.T(null),this.originalClearColor=new l.Color,this.setGBuffer(i?i.depthTexture:void 0,i?i.normalTexture:void 0),void 0!==s&&this.updateGtaoMaterial(s),void 0!==n&&this.updatePdMaterial(n)}}w.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var b=a(40069);class E extends u.C{render(e,t,a,r,i){var s;if(null===(s=this.onBeforeRender)||void 0===s||s.call(this),this.disableBackground){let s=this.scene.background;this.scene.background=null,super.render(e,t,a,r,i),this.scene.background=s}else super.render(e,t,a,r,i)}constructor(...e){super(...e),this.onBeforeRender=null,this.disableBackground=!1}}function R(){let{ref:e}=(0,s.sv)(function*(e){let t=function(e){let{width:t=window.innerWidth,height:a=window.innerHeight}=e,r=new l.WebGLRenderer({});r.setSize(t,a),r.setPixelRatio(window.devicePixelRatio);let i=new l.PerspectiveCamera(75,t/a,.1,1e3);i.position.z=8,new o.z(i,r.domElement);let s=new f.vB().set({activeDuration:30}),n=(0,g.s)(()=>s.requestActivation()),u=function(e){let t=new l.Scene;{let e=new l.DirectionalLight(16777215,1);e.position.set(0,3,1),t.add(e);let a=new l.HemisphereLight("#afdbf5","#845244",1);t.add(a)}new b.x().setPath("https://threejs.org/examples/textures/equirectangular/").loadAsync("pedestrian_overpass_1k.hdr").then(e=>{e.mapping=l.EquirectangularReflectionMapping,t.environmentIntensity=.1,t.environment=e,t.backgroundBlurriness=.5,t.background=e});let a=new l.Mesh(new l.TorusKnotGeometry(2,1,512,64),new l.MeshPhysicalMaterial);t.add(a);let r=new l.Mesh(new l.BoxGeometry(10,1,3),new l.MeshPhysicalMaterial);t.add(r);let i=new l.Mesh(new l.BoxGeometry(1,10,3),new l.MeshPhysicalMaterial);i.position.set(5,0,0),t.add(i);let s=new l.Mesh(new l.PlaneGeometry(10,10),new l.MeshPhysicalMaterial({color:"#d1ddff",transmission:1,roughness:0,dispersion:.1,ior:2.5,opacity:1}));return s.layers.set(1),t.add(s),e.onTick(e=>{a.rotation.x+=.5*e.deltaTime,a.rotation.y+=.5*e.deltaTime}),t}(s),v=new d.x(r),M=new E(u,i);M.onBeforeRender=()=>{i.layers.enableAll()},v.addPass(M);let y=new w(u,i,t,a);v.addPass(y);let x=new h.v;v.addPass(x);let T=new p.T(c.C);T.material.uniforms.resolution.value.set(1/t,1/a),v.addPass(T),s.onTick(()=>{v.render()}),m.v.on("REQUIRE:THREE",e=>{e.payload={three:R}});let R={renderer:r,camera:i,scene:u,ticker:s,passes:{render:M,ao:y,output:x},destroy:()=>{r.domElement.remove(),s.destroy(),n.destroy()}};return R}({width:e.clientWidth,height:e.clientHeight});yield t,Object.assign(window,{three:t}),e.appendChild(t.renderer.domElement)},[]);return(0,r.jsx)("div",{ref:e,className:"absolute inset-0"})}function S(){let[e,t]=(0,i.useState)(!0);return(0,r.jsxs)("div",{className:"page",children:[(0,r.jsx)(R,{}),(0,r.jsxs)("div",{className:"absolute inset-0 p-8 flex flex-col items-start justify-start pointer-through",children:[(0,r.jsxs)("div",{className:"flex flex-col items-start justify-start pointer-through max-w-[480px]",children:[(0,r.jsx)("h1",{className:"text-4xl uppercase",children:"ao-transparent"}),(0,r.jsx)("div",{className:"mt-4"}),(0,r.jsx)("p",{children:"Handling Ambient Occlusion and transparent objects"}),(0,r.jsx)("p",{children:"The glass does not generate AO"}),(0,r.jsx)("div",{className:"mt-4"}),(0,r.jsxs)("p",{children:["This is achieved by using a fork of the ",(0,r.jsx)("a",{href:"https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/GTAOPass.js",children:"GTAOPass"}),"\xa0where the camera layer mask is set to 0 (default layer) and the glass object is set to layer 1 (transparent objects)."]}),(0,r.jsx)("div",{className:"mt-4"}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h2",{className:"text-xl",children:"Pros:"}),(0,r.jsx)("ul",{children:(0,r.jsx)("li",{children:"Simple (layer based)"})})]}),(0,r.jsx)("div",{className:"mt-4"}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h2",{className:"text-xl",children:"Cons:"}),(0,r.jsx)("ul",{children:(0,r.jsx)("li",{children:"AO is still rendered on top of transparent objects. For semi-opaque objects, this is could be a problem."})})]})]}),(0,r.jsx)("div",{className:"mt-4"}),(0,r.jsxs)("div",{className:"flex flex-row gap-2",children:[(0,r.jsx)("label",{htmlFor:"ao-enabled",className:"select-none",children:"Enable AO"}),(0,r.jsx)("input",{type:"checkbox",name:"ao-enabled",id:"ao-enabled",checked:e,onChange:()=>{let{payload:e}=n.v.send("REQUIRE:THREE");if(e){let{three:a}=e,{passes:r}=a,{ao:i}=r;i.enabled=!i.enabled,t(i.enabled)}}})]})]})]})}},32423:function(e,t,a){"use strict";function r(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];let[r,i]=1===t.length?[window,t[0]]:t,s=()=>{i()};return r.addEventListener("mousemove",s,{passive:!0}),r.addEventListener("mousedown",s,{passive:!0}),r.addEventListener("mouseup",s,{passive:!0}),r.addEventListener("touchstart",s,{passive:!0}),r.addEventListener("touchmove",s,{passive:!0}),r.addEventListener("wheel",s,{passive:!0}),r.addEventListener("keydown",s,{passive:!0}),r.addEventListener("keyup",s,{passive:!0}),window.addEventListener("resize",s,{passive:!0}),{destroy:()=>{r.removeEventListener("mousemove",s),r.removeEventListener("mousedown",s),r.removeEventListener("mouseup",s),r.removeEventListener("touchstart",s),r.removeEventListener("touchmove",s),r.removeEventListener("wheel",s),r.removeEventListener("keydown",s),r.removeEventListener("keyup",s),window.removeEventListener("resize",s)}}}a.d(t,{s:function(){return r}})},54422:function(e,t,a){"use strict";a.d(t,{v:function(){return r.v}});var r=a(51886)},51886:function(e,t,a){"use strict";a.d(t,{v:function(){return o}});var r=a(80248);class i{_getId(){return i._idHash.init().update(++this._count).getValue()}_registerObject(e){let t=this._getId();return this._weakMap.set(e,t),t}_registerPrimitive(e){let t=this._getId();return this._map.set(e,t),t}_requirePrimitiveId(e){var t;return null!==(t=this._map.get(e))&&void 0!==t?t:this._registerPrimitive(e)}_requireObjectId(e){var t;return null!==(t=this._weakMap.get(e))&&void 0!==t?t:this._registerObject(e)}_requireArrayId(e){let{_arrayHash:t}=i;for(let a of(t.init(),e.flat(16)))t.update(this.requireId(a));return t.getValue()}requireId(e){return!function(e){if(null==e)return!0;switch(typeof e){case"function":case"object":return!1;default:return!0}}(e)?Array.isArray(e)?this._requireArrayId(e):this._requireObjectId(e):this._requirePrimitiveId(e)}constructor(){this._count=1,this._map=new Map,this._weakMap=new WeakMap}}i._idHash=new r.k,i._arrayHash=new r.k;class s{constructor(e,t){this.filter=e,this.callback=t,this.match="*"===e?()=>!0:"string"==typeof e?t=>t===e:e instanceof RegExp?t=>e.test(t):()=>!1}}let n=new i,l=new Map;class o{setPayload(e){return this.payload=e,this}assignPayload(e){let{overwrite:t=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.payload=t?{...this.payload,...e}:{...e,...this.payload},this}payloadAssign(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];return this.assignPayload(...t)}assertPayload(){if(this.payload)return this.payload;throw Error('Message.payloadAssert: assertion failed for message with target "'.concat(this.target,'"'))}constructor(e,t,a){var r;this.id=o.nextId++,this.debug={currentListenerIndex:-1,listenerCount:0},this.targetId=n.requireId(e),this.target=e,this.type=null!=t?t:"message",this.payload=a;let i=(null!==(r=l.get(this.targetId))&&void 0!==r?r:[]).filter(e=>e.match(this.type));for(let e of(this.debug.listenerCount=i.length,i))this.debug.currentListenerIndex++,e.callback(this)}}o.send=function(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];let[r,i,s]=function(e){let[t,...a]=e;if(2===a.length){let[e,{payload:r}]=a;return[t,e,r]}if(1===a.length){let[e]=a;return"string"==typeof e?[t,e]:[t,void 0,e.payload]}return[t]}(t);return new o(r,i,s)},o.on=function(){for(var e,t=arguments.length,a=Array(t),r=0;r<t;r++)a[r]=arguments[r];let[i,o,d]=function(e){if(2===e.length){let[t,a]=e;return[t,"*",a]}return e}(a),h=n.requireId(i),u=new s(o,d);return(null!==(e=l.get(h))&&void 0!==e?e:(()=>{let e=[];return l.set(h,e),e})()).push(u),{destroy:()=>{!function(e,t){let a=l.get(e);if(a){let r=a.indexOf(t);-1!==r&&(a.splice(r,1),0===a.length&&l.delete(e))}}(h,u)}}},o.debug={listenerMap:l,idRegister:n},o.nextId=0},40069:function(e,t,a){"use strict";a.d(t,{x:function(){return i}});var r=a(52471);class i extends r.DataTextureLoader{constructor(e){super(e),this.type=r.HalfFloatType}parse(e){let t,a,i;let s=function(e,t){switch(e){case 1:throw Error("THREE.RGBELoader: Read Error: "+(t||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(t||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(t||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(t||""))}},n=function(e,t,a){t=t||1024;let r=e.pos,i=-1,s=0,n="",l=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));for(;0>(i=l.indexOf("\n"))&&s<t&&r<e.byteLength;)n+=l,s+=l.length,r+=128,l+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));return -1<i&&(!1!==a&&(e.pos+=s+i+1),n+l.slice(0,i))},l=new Uint8Array(e);l.pos=0;let o=function(e){let t,a;let r=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,i=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,l=/^\s*FORMAT=(\S+)\s*$/,o=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,d={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};for(!(e.pos>=e.byteLength)&&(t=n(e))||s(1,"no header found"),(a=t.match(/^#\?(\S+)/))||s(3,"bad initial token"),d.valid|=1,d.programtype=a[1],d.string+=t+"\n";!1!==(t=n(e));){if(d.string+=t+"\n","#"===t.charAt(0)){d.comments+=t+"\n";continue}if((a=t.match(r))&&(d.gamma=parseFloat(a[1])),(a=t.match(i))&&(d.exposure=parseFloat(a[1])),(a=t.match(l))&&(d.valid|=2,d.format=a[1]),(a=t.match(o))&&(d.valid|=4,d.height=parseInt(a[1],10),d.width=parseInt(a[2],10)),2&d.valid&&4&d.valid)break}return 2&d.valid||s(3,"missing format specifier"),4&d.valid||s(3,"missing image size specifier"),d}(l),d=o.width,h=o.height,u=function(e,t,a){if(t<8||t>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);t!==(e[2]<<8|e[3])&&s(3,"wrong scanline width");let r=new Uint8Array(4*t*a);r.length||s(4,"unable to allocate buffer space");let i=0,n=0,l=4*t,o=new Uint8Array(4),d=new Uint8Array(l),h=a;for(;h>0&&n<e.byteLength;){n+4>e.byteLength&&s(1),o[0]=e[n++],o[1]=e[n++],o[2]=e[n++],o[3]=e[n++],(2!=o[0]||2!=o[1]||(o[2]<<8|o[3])!=t)&&s(3,"bad rgbe scanline format");let a=0,u;for(;a<l&&n<e.byteLength;){let t=(u=e[n++])>128;if(t&&(u-=128),(0===u||a+u>l)&&s(3,"bad scanline data"),t){let t=e[n++];for(let e=0;e<u;e++)d[a++]=t}else d.set(e.subarray(n,n+u),a),a+=u,n+=u}for(let e=0;e<t;e++){let a=0;r[i]=d[e+a],a+=t,r[i+1]=d[e+a],a+=t,r[i+2]=d[e+a],a+=t,r[i+3]=d[e+a],i+=4}h--}return r}(l.subarray(l.pos),d,h);switch(this.type){case r.FloatType:let p=new Float32Array(4*(i=u.length/4));for(let e=0;e<i;e++)!function(e,t,a,r){let i=Math.pow(2,e[t+3]-128)/255;a[r+0]=e[t+0]*i,a[r+1]=e[t+1]*i,a[r+2]=e[t+2]*i,a[r+3]=1}(u,4*e,p,4*e);t=p,a=r.FloatType;break;case r.HalfFloatType:let c=new Uint16Array(4*(i=u.length/4));for(let e=0;e<i;e++)!function(e,t,a,i){let s=Math.pow(2,e[t+3]-128)/255;a[i+0]=r.DataUtils.toHalfFloat(Math.min(e[t+0]*s,65504)),a[i+1]=r.DataUtils.toHalfFloat(Math.min(e[t+1]*s,65504)),a[i+2]=r.DataUtils.toHalfFloat(Math.min(e[t+2]*s,65504)),a[i+3]=r.DataUtils.toHalfFloat(1)}(u,4*e,c,4*e);t=c,a=r.HalfFloatType;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:d,height:h,data:t,header:o.string,gamma:o.gamma,exposure:o.exposure,type:a}}setDataType(e){return this.type=e,this}load(e,t,a,i){return super.load(e,function(e,a){switch(e.type){case r.FloatType:case r.HalfFloatType:e.colorSpace=r.LinearSRGBColorSpace,e.minFilter=r.LinearFilter,e.magFilter=r.LinearFilter,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,a)},a,i)}}}},function(e){e.O(0,[5244,6712,5792,3831,4940,2920,7936,1744],function(){return e(e.s=25449)}),_N_E=e.O()}]);