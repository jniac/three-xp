"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8181],{32423:function(e,t,s){s.d(t,{s:function(){return r}});function r(){for(var e=arguments.length,t=Array(e),s=0;s<e;s++)t[s]=arguments[s];let[r,i]=1===t.length?[window,t[0]]:t,n=()=>{i()};return r.addEventListener("mousemove",n,{passive:!0}),r.addEventListener("mousedown",n,{passive:!0}),r.addEventListener("mouseup",n,{passive:!0}),r.addEventListener("touchstart",n,{passive:!0}),r.addEventListener("touchmove",n,{passive:!0}),r.addEventListener("wheel",n,{passive:!0}),r.addEventListener("keydown",n,{passive:!0}),r.addEventListener("keyup",n,{passive:!0}),window.addEventListener("resize",n,{passive:!0}),{destroy:()=>{r.removeEventListener("mousemove",n),r.removeEventListener("mousedown",n),r.removeEventListener("mouseup",n),r.removeEventListener("touchstart",n),r.removeEventListener("touchmove",n),r.removeEventListener("wheel",n),r.removeEventListener("keydown",n),r.removeEventListener("keyup",n),window.removeEventListener("resize",n)}}}},48181:function(e,t,s){s.d(t,{Vu:function(){return P}});var r,i,n,o,a=s(52471),l=s(55445),h=s(82722),d=s(55440),c=s(82048),u=s(19687),p=s(28954);(r=n||(n={}))[r.Render=0]="Render",r[r.PostProcessing=1e3]="PostProcessing",r[r.GizmoRender=2e3]="GizmoRender",r[r.Outline=3e3]="Outline",r[r.Output=4e3]="Output",r[r.Antialiasing=5e3]="Antialiasing";class f{get passes(){return this.composer.passes}sortPasses(){let e=[...this.passMap];for(let[t]of e)this.composer.removePass(t);for(let[t]of(e.sort((e,t)=>{let s=e[1],r=t[1];return s.type!==r.type?s.type-r.type:s.insertOrder-r.insertOrder}),e))this.composer.addPass(t);return this}*getPassesByType(e){for(let[t,s]of this.passMap)s.type===e&&(yield[t,s])}addPass(e){let{type:t=n.Render,insertOrder:s}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(void 0===s){var r,i,o;s=(null!==(o=null===(i=[...this.getPassesByType(t)].at(-1))||void 0===i?void 0:null===(r=i[1])||void 0===r?void 0:r.insertOrder)&&void 0!==o?o:-1)+1}return this.passMap.set(e,{type:t,insertOrder:s}),this.sortPasses(),{destroy:()=>this.removePass(e)}}removePass(e){return this.passMap.has(e)?(this.passMap.delete(e),this.composer.removePass(e),!0):(console.warn("The pass is not in the pipeline."),!1)}setSize(e,t,s){this.composer.setSize(e,t),this.composer.setPixelRatio(s),this.basicPasses.fxaa.uniforms.resolution.value.set(1/s/e,1/s/t)}setScene(e){let t=this.basicPasses.mainRender.scene;for(let s of this.composer.passes)s instanceof c.C&&s.scene===t&&(s.scene=e)}render(e){for(let t of this.composer.passes)t instanceof c.C&&t.scene.traverseVisible(t=>{"onTick"in t&&t.onTick(e)});this.composer.render(e.deltaTime)}getPassesInfo(){let e=["".concat(this.constructor.name," passes info:")],{composer:t,passMap:s}=this;for(let[r,i]of t.passes.entries()){let t=s.get(i);t?e.push("- ".concat(r,": ").concat(n[t.type]," (insertOrder: ").concat(t.insertOrder,") ").concat(i.constructor.name)):e.push("- ".concat(r,": NO METADATA for ").concat(i.constructor.name))}return e.join("\n")}constructor(e,t,s,r){let i=new l.x(e),o=new Map,f=new c.C(t,r);f.clearAlpha=0,o.set(f,{type:n.Render,insertOrder:0}),i.addPass(f);let v=new c.C(s,r);o.set(v,{type:n.GizmoRender,insertOrder:0}),v.clear=!1,v.clearDepth=!1,i.addPass(v);let m=new h.f(new a.Vector2,t,r);o.set(m,{type:n.GizmoRender,insertOrder:0}),i.addPass(m);let y=new d.v;o.set(y,{type:n.Output,insertOrder:0}),i.addPass(y);let w=new u.T(p.C);o.set(w,{type:n.Antialiasing,insertOrder:0}),i.addPass(w),this.composer=i,this.basicPasses={mainRender:f,gizmoRender:v,outline:m,output:y,fxaa:w},this.passMap=o}}var v=s(86712),m=s(32423),y=s(1296),w=s(9710),g=s(81796),b=s(44645);(i=o||(o={}))[i.None=0]="None",i[i.LeftDown=1]="LeftDown",i[i.LeftDrag=2]="LeftDrag";class L{get ray(){return this.raycaster.ray}update(e,t,s){let{x:r,y:i}=t,n=(r-s.x)/s.width*2-1,o=-((i-s.y)/s.height*2)+1;this.camera=e,this.clientPosition.set(r,i),this.screenPosition.set(n,o),this.raycaster.setFromCamera(this.screenPosition,e)}constructor(){this.status={button:0},this.event=new class{consume(){this.consumed=!0}reset(){this.consumed=!1}constructor(){this.consumed=!1}},this.camera=null,this.clientPosition=new a.Vector2,this.screenPosition=new a.Vector2,this.raycaster=new a.Raycaster}}class P{static current(){return this.instances[this.instances.length-1]}get aspect(){return this.width/this.height}get size(){return this.internal.size.set(this.width,this.height)}get fullSize(){return this.internal.fullSize.set(this.width*this.pixelRatio,this.height*this.pixelRatio)}setScene(e){this.scene=e}useOrbitControls(){var e,t;let{position:s=null,target:r=null,element:i=null}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return null!==(t=(e=this.internal).orbitControls)&&void 0!==t||(e.orbitControls=new v.z(this.camera,this.renderer.domElement)),"string"==typeof i&&(i=document.querySelector(i)),i&&i!==this.internal.orbitControls.domElement&&(this.internal.orbitControls.dispose(),this.internal.orbitControls=new v.z(this.camera,i)),s&&(0,g.Q7)(s,this.internal.orbitControls.object.position),r&&(0,g.Q7)(r,this.internal.orbitControls.target),this.internal.orbitControls.update(),this.internal.orbitControls}initialize(e){if(this.initialized)return console.warn("ThreeWebglContext is already initialized."),this;Object.defineProperty(this,"initialized",{value:!0,writable:!1,configurable:!1,enumerable:!1});let{onDestroy:t}=this;e.appendChild(this.renderer.domElement);let s=()=>{this.setSize({width:e.clientWidth,height:e.clientHeight,pixelRatio:window.devicePixelRatio})},r=new ResizeObserver(s);r.observe(e),t(()=>{r.disconnect()}),s();let i=e=>{let t=this.renderer.domElement.getBoundingClientRect();this.pointer.update(this.camera,{x:e.clientX,y:e.clientY},t)},n=e=>{this.pointer.status.button|=o.LeftDown},a=e=>{this.pointer.status.button&=~o.LeftDown};return e.addEventListener("pointermove",i),e.addEventListener("pointerdown",n),e.addEventListener("pointerup",a),t(()=>{e.removeEventListener("pointermove",i),e.removeEventListener("pointerdown",n),e.removeEventListener("pointerup",a)}),t((0,m.s)(this.ticker.requestActivation),this.ticker.onTick(this.update)),t(()=>{var e;null===(e=this.internal.orbitControls)||void 0===e||e.dispose()}),this}setSize(e){let{width:t,height:s,pixelRatio:r}={...this,...e};if(t===this.width&&s===this.height&&r===this.pixelRatio)return this;this.width=t,this.height=s,this.pixelRatio=r;let{renderer:i,perspectiveCamera:n,pipeline:o}=this;i.setSize(t,s),i.setPixelRatio(r),o.setSize(t,s,r);let a=t/s;return n.aspect=a,n.updateProjectionMatrix(),this}*findAll(e){let t="string"==typeof e?t=>t.name===e:e instanceof RegExp?t=>e.test(t.name):e,s=[this.scene];for(;s.length>0;){let e=s.shift();t(e)&&(yield e),s.push(...e.children)}}find(e){for(let t of this.findAll(e))return t;return null}isPartOfScene(e){let t=e;for(;t;){if(t===this.scene)return!0;t=t.parent}return!1}constructor(){this.width=300,this.height=150,this.pixelRatio=1,this.renderer=new a.WebGLRenderer,this.perspectiveCamera=new a.PerspectiveCamera,this.orhtographicCamera=new a.PerspectiveCamera,this.scene=new a.Scene,this.gizmoScene=new a.Scene,this.pointer=new L,this.ticker=w.vB.get("three").set({minActiveDuration:8}),this.pipeline=new f(this.renderer,this.scene,this.gizmoScene,this.perspectiveCamera),this.camera=this.perspectiveCamera,this.internal={size:new a.Vector2,fullSize:new a.Vector2,destroyables:[],orbitControls:null},this.onTick=this.ticker.onTick.bind(this.ticker),this.onDestroy=this.internal.destroyables.push.bind(this.internal.destroyables),this.loader=b.R.get("three"),this.initialized=!1,this.destroyed=!1,this.destroy=()=>{if(this.destroyed){console.warn("ThreeWebglContext is already destroyed.");return}Object.defineProperty(this,"destroyed",{value:!0,writable:!1,configurable:!1,enumerable:!1}),(0,y.o)(this.internal.destroyables),this.internal.destroyables=[],this.renderer.dispose()},this.update=e=>{var t;null===(t=this.internal.orbitControls)||void 0===t||t.update(e.deltaTime),this.pipeline.render(e)},this.camera.position.set(0,1,10),this.camera.lookAt(0,0,0),P.instances.push(this)}}P.instances=[]},81796:function(e,t,s){s.d(t,{FE:function(){return n},Gg:function(){return h},Q7:function(){return l},Xe:function(){return d},iK:function(){return a}});var r=s(52471);let i={rad:1,deg:Math.PI/180,turn:2*Math.PI};function n(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"rad",s=t,r=0;if("number"==typeof e)r=e;else{let t=e.match(/^\s*(-?[0-9.]+)\s*(\/\s*-?[0-9.]+)?\s*(rad|deg|turn)\s*$/);if(t){let[e,i,n,o]=t;r=Number.parseFloat(i),n&&(r/=Number.parseFloat(n.slice(1))),s=o}else r=Number.parseFloat(e)}return r*i[s]}function o(e){return"string"==typeof e&&/^(XYZ|XZY|YXZ|YZX|ZXY|ZYX)$/.test(e)}function a(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new r.Vector2;if(null==e)return t.set(0,0);if("number"==typeof e)return t.set(e,e);if(Array.isArray(e)){let[s,r]=e;return t.set(s,r)}if("width"in e){let{width:s,height:r}=e;return t.set(s,r)}let{x:s,y:i}=e;return t.set(s,i)}function l(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new r.Vector3;if(null==e)return t.set(0,0,0);if("number"==typeof e)return t.set(e,e,e);if(Array.isArray(e)){let[s,r,i=0]=e;return t.set(s,r,i)}if("width"in e){let{width:s,height:r,depth:i}=e;return t.set(s,r,i)}let{x:s,y:i,z:n=0}=e;return t.set(s,i,n)}function h(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new r.Euler;if(e instanceof r.Euler)return t.copy(e);if(Array.isArray(e)){let[s,r,i,a,l]=e,h="string"==typeof a&&/^(rad|deg|turn)$/.test(a)?a:"rad",d=o(a)?a:o(l)?l:"XYZ";return t.set(n(s,h),n(r,h),n(i,h),d)}let{x:s,y:i,z:a,order:l="XYZ",unit:h="rad"}=e;return t.set(n(s,h),n(i,h),n(a,h),l)}let d=(()=>{let e=new r.Vector3,t=new r.Euler,s=new r.Vector3,i=new r.Quaternion;return function(n,o){let{x:a=0,y:d=0,z:c=0,position:u={x:a,y:d,z:c},rotationX:p=0,rotationY:f=0,rotationZ:v=0,rotationOrder:m="XYZ",rotation:y={x:p,y:f,z:v,order:m},useDegree:w=!1,scaleX:g=1,scaleY:b=1,scaleZ:L=1,scaleScalar:P=1,scale:E={x:g,y:b,z:L}}=n;if(w){let e=Math.PI/180;y.x*=e,y.y*=e,y.z*=e}if(o instanceof r.Matrix4)return l(u,e),h(y,t),l(E,s).multiplyScalar(P),i.setFromEuler(t),o.compose(e,i,s);if(o instanceof r.Object3D)return l(u,o.position),h(y,o.rotation),l(E,o.scale).multiplyScalar(P),o;throw Error("Invalid out argument")}})()},44645:function(e,t,s){s.d(t,{R:function(){return c}});var r=s(52471),i=s(73899),n=s(27741),o=s(40069);function a(e){let t,s;let r=new Promise((r,i)=>{t=()=>{r(e)},s=e=>{i(e)}});return Object.assign(e,{then:r.then.bind(r),catch:r.catch.bind(r),finally:r.finally.bind(r),resolve:t,reject:s}),e}let l=["gltf","glb"],h=["png","jpg","jpeg","hdr","exr"];class d{add(e){return this.listeners.add(e),{destroy:()=>this.listeners.delete(e)}}call(){for(var e=arguments.length,t=Array(e),s=0;s<e;s++)t[s]=arguments[s];for(let e of this.listeners)e.apply(null,t)}constructor(){this.listeners=new Set}}class c{static current(){var e;return null!==(e=this.instances[this.instances.length-1])&&void 0!==e?e:new c}static get(e){var t;return null!==(t=this.instances.find(t=>t.name===e))&&void 0!==t?t:new c({name:e})}setPath(e){this.path=e}onAfterLoad(e){return this._onAfterLoad.add(e)}async loadGltf(e){return new Promise((t,s)=>{this.loaders.gltf.load(e,e=>{t(e),this._onAfterLoad.call()},void 0,s)})}async loadRgbe(e){let t=a(this.loaders.rgbeLoader.load(e,e=>{t.resolve(),this._onAfterLoad.call()},void 0,()=>{console.log("Failed to load RGBE: ".concat(e))}));return t}async loadExr(e){let t=a(this.loaders.exrLoader.load(e,e=>{t.resolve(),this._onAfterLoad.call()},void 0,()=>{console.log("Failed to load EXR: ".concat(e))}));return t}loadTexture(e,t){let s=new URL(this.path+e,window.location.href).href;if(this.textureCache.has(s)){let e=this.textureCache.get(s);return null==t||t(e),e}let r=a(this.loaders.texture.load(s,e=>{this.textureCache.set(s,r),null==t||t(e),r.resolve(),this._onAfterLoad.call()},void 0,()=>{console.log("Failed to load texture: ".concat(s))}));return r}async load(e){let t=e.split(".").pop();if(l.includes(t))return this.loadGltf(e);if(h.includes(t))return new Promise((t,s)=>{this.loaders.texture.load(e,e=>{t(e),this._onAfterLoad.call()},void 0,s)});throw Error("Unsupported extension: ".concat(t))}constructor({name:e}={}){this.id=c.nextId++,this.loaders={gltf:new n.E,texture:new r.TextureLoader,rgbeLoader:new o.x,exrLoader:new i.I},this.path="",this._onAfterLoad=new d,this.textureCache=new Map,this.name=null!=e?e:"UnifiedLoader-".concat(this.id),c.instances.push(this)}}c.nextId=0,c.instances=[]},1296:function(e,t,s){function r(){for(var e=arguments.length,t=Array(e),s=0;s<e;s++)t[s]=arguments[s];for(let e of t.flat(2))"destroy"in e?e.destroy():e()}s.d(t,{N:function(){return i},o:function(){return r}});class i{collect(){for(var e=arguments.length,t=Array(e),s=0;s<e;s++)t[s]=arguments[s];for(let e of t)if(e){if(Symbol.iterator in e)for(let t of e)t&&this.destroyables.push(t);else this.destroyables.push(e)}}constructor(){this.destroyables=[],this.destroy=()=>{r(this.destroyables),this.destroyables=[]}}}}}]);