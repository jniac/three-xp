"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8181],{48181:function(e,t,r){r.d(t,{GR:function(){return s},Vu:function(){return P}});var i,n,s,o,a=r(52471),l=r(55445),h=r(82722),c=r(55440),u=r(82048),d=r(19687),f=r(28954);(i=s||(s={}))[i.Render=0]="Render",i[i.PostProcessing=1e3]="PostProcessing",i[i.GizmoRender=2e3]="GizmoRender",i[i.Outline=3e3]="Outline",i[i.Output=4e3]="Output",i[i.Antialiasing=5e3]="Antialiasing";class p{get passes(){return this.composer.passes}sortPasses(){let e=[...this.passMap];for(let[t]of e)this.composer.removePass(t);for(let[t]of(e.sort((e,t)=>{let r=e[1],i=t[1];return r.type!==i.type?r.type-i.type:r.insertOrder-i.insertOrder}),e))this.composer.addPass(t);return this}*getPassesByType(e){for(let[t,r]of this.passMap)r.type===e&&(yield[t,r])}addPass(e){let{type:t=s.Render,insertOrder:r}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(void 0===r){var i,n,o;r=(null!==(o=null===(n=[...this.getPassesByType(t)].at(-1))||void 0===n?void 0:null===(i=n[1])||void 0===i?void 0:i.insertOrder)&&void 0!==o?o:-1)+1}return this.passMap.set(e,{type:t,insertOrder:r}),this.sortPasses(),{destroy:()=>this.removePass(e)}}removePass(e){return this.passMap.has(e)?(this.passMap.delete(e),this.composer.removePass(e),!0):(console.warn("The pass is not in the pipeline."),!1)}setSize(e,t,r){this.composer.setSize(e,t),this.composer.setPixelRatio(r),this.basicPasses.fxaa.uniforms.resolution.value.set(1/r/e,1/r/t)}setScene(e){let t=this.basicPasses.mainRender.scene;for(let r of this.composer.passes)r instanceof u.C&&r.scene===t&&(r.scene=e)}render(e){for(let t of this.composer.passes)t instanceof u.C&&t.scene.traverseVisible(t=>{"onTick"in t&&t.onTick(e)});this.composer.render(e.deltaTime)}getPassesInfo(){let e=["".concat(this.constructor.name," passes info:")],{composer:t,passMap:r}=this;for(let[i,n]of t.passes.entries()){let t=r.get(n);t?e.push("- ".concat(i,": ").concat(s[t.type]," (insertOrder: ").concat(t.insertOrder,") ").concat(n.constructor.name)):e.push("- ".concat(i,": NO METADATA for ").concat(n.constructor.name))}return e.join("\n")}constructor(e,t,r,i){let n=new l.x(e),o=new Map,p=new u.C(t,i);p.clearAlpha=0,o.set(p,{type:s.Render,insertOrder:0}),n.addPass(p);let y=new u.C(r,i);o.set(y,{type:s.GizmoRender,insertOrder:0}),y.clear=!1,y.clearDepth=!1,n.addPass(y);let m=new h.f(new a.Vector2,t,i);o.set(m,{type:s.GizmoRender,insertOrder:0}),n.addPass(m);let g=new c.v;o.set(g,{type:s.Output,insertOrder:0}),n.addPass(g);let v=new d.T(f.C);o.set(v,{type:s.Antialiasing,insertOrder:0}),n.addPass(v),this.composer=n,this.basicPasses={mainRender:p,gizmoRender:y,outline:m,output:g,fxaa:v},this.passMap=o}}var y=r(86712),m=r(32423),g=r(1296),v=r(9710),w=r(81796),b=r(44645);(n=o||(o={}))[n.None=0]="None",n[n.LeftDown=1]="LeftDown",n[n.LeftDrag=2]="LeftDrag";class x{get ray(){return this.raycaster.ray}update(e,t,r){let{x:i,y:n}=t,s=(i-r.x)/r.width*2-1,o=-((n-r.y)/r.height*2)+1;this.camera=e,this.clientPosition.set(i,n),this.screenPosition.set(s,o),this.raycaster.setFromCamera(this.screenPosition,e)}constructor(){this.status={button:0},this.event=new class{consume(){this.consumed=!0}reset(){this.consumed=!1}constructor(){this.consumed=!1}},this.camera=null,this.clientPosition=new a.Vector2,this.screenPosition=new a.Vector2,this.raycaster=new a.Raycaster}}class P{static current(){return this.instances[this.instances.length-1]}get aspect(){return this.width/this.height}get size(){return this.internal.size.set(this.width,this.height)}get fullSize(){return this.internal.fullSize.set(this.width*this.pixelRatio,this.height*this.pixelRatio)}setScene(e){this.scene=e}useOrbitControls(){var e,t;let{position:r=null,target:i=null,element:n=null}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return null!==(t=(e=this.internal).orbitControls)&&void 0!==t||(e.orbitControls=new y.z(this.camera,this.renderer.domElement)),"string"==typeof n&&(n=document.querySelector(n)),n&&n!==this.internal.orbitControls.domElement&&(this.internal.orbitControls.dispose(),this.internal.orbitControls=new y.z(this.camera,n)),r&&(0,w.Q7)(r,this.internal.orbitControls.object.position),i&&(0,w.Q7)(i,this.internal.orbitControls.target),this.internal.orbitControls.update(),this.internal.orbitControls}initialize(e){if(this.initialized)return console.warn("ThreeWebglContext is already initialized."),this;Object.defineProperty(this,"initialized",{value:!0,writable:!1,configurable:!1,enumerable:!1});let{onDestroy:t}=this;e.appendChild(this.renderer.domElement);let r=()=>{this.setSize({width:e.clientWidth,height:e.clientHeight,pixelRatio:window.devicePixelRatio})},i=new ResizeObserver(r);i.observe(e),t(()=>{i.disconnect()}),r();let n=e=>{let t=this.renderer.domElement.getBoundingClientRect();this.pointer.update(this.camera,{x:e.clientX,y:e.clientY},t)},s=e=>{this.pointer.status.button|=o.LeftDown},a=e=>{this.pointer.status.button&=~o.LeftDown};return e.addEventListener("pointermove",n),e.addEventListener("pointerdown",s),e.addEventListener("pointerup",a),t(()=>{e.removeEventListener("pointermove",n),e.removeEventListener("pointerdown",s),e.removeEventListener("pointerup",a)}),t((0,m.s)(this.ticker.requestActivation),this.ticker.onTick(this.update)),t(()=>{var e;null===(e=this.internal.orbitControls)||void 0===e||e.dispose()}),this}setSize(e){let{width:t,height:r,pixelRatio:i}={...this,...e};if(t===this.width&&r===this.height&&i===this.pixelRatio)return this;this.width=t,this.height=r,this.pixelRatio=i;let{renderer:n,perspectiveCamera:s,pipeline:o}=this;n.setSize(t,r),n.setPixelRatio(i),o.setSize(t,r,i);let a=t/r;return s.aspect=a,s.updateProjectionMatrix(),this}*findAll(e){let t="string"==typeof e?t=>t.name===e:e instanceof RegExp?t=>e.test(t.name):e,r=[this.scene];for(;r.length>0;){let e=r.shift();t(e)&&(yield e),r.push(...e.children)}}find(e){for(let t of this.findAll(e))return t;return null}isPartOfScene(e){let t=e;for(;t;){if(t===this.scene)return!0;t=t.parent}return!1}constructor(){this.width=300,this.height=150,this.pixelRatio=1,this.renderer=new a.WebGLRenderer,this.perspectiveCamera=new a.PerspectiveCamera,this.orhtographicCamera=new a.PerspectiveCamera,this.scene=new a.Scene,this.gizmoScene=new a.Scene,this.pointer=new x,this.ticker=v.vB.get("three").set({minActiveDuration:8}),this.pipeline=new p(this.renderer,this.scene,this.gizmoScene,this.perspectiveCamera),this.camera=this.perspectiveCamera,this.internal={size:new a.Vector2,fullSize:new a.Vector2,destroyables:[],orbitControls:null},this.onTick=this.ticker.onTick.bind(this.ticker),this.onDestroy=this.internal.destroyables.push.bind(this.internal.destroyables),this.loader=b.R.get("three"),this.initialized=!1,this.destroyed=!1,this.destroy=()=>{if(this.destroyed){console.warn("ThreeWebglContext is already destroyed.");return}Object.defineProperty(this,"destroyed",{value:!0,writable:!1,configurable:!1,enumerable:!1}),(0,g.o)(this.internal.destroyables),this.internal.destroyables=[],this.renderer.dispose()},this.update=e=>{var t;null===(t=this.internal.orbitControls)||void 0===t||t.update(e.deltaTime),this.pipeline.render(e)},this.camera.position.set(0,1,10),this.camera.lookAt(0,0,0),P.instances.push(this)}}P.instances=[]},81796:function(e,t,r){r.d(t,{FE:function(){return n.FE},Gg:function(){return h},Q7:function(){return l},Xe:function(){return c},iK:function(){return a},ux:function(){return n.ux}});var i=r(52471),n=r(74175);function s(e){return"string"==typeof e&&/^(rad|deg|turn)$/.test(e)}function o(e){return"string"==typeof e&&/^(XYZ|XZY|YXZ|YZX|ZXY|ZYX)$/.test(e)}function a(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new i.Vector2;return n.iK(e,t)}function l(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new i.Vector3;return n.Q7(e,t)}function h(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new i.Euler;if(e instanceof i.Euler)return t.copy(e);if(Array.isArray(e)){let[r,i,a,l,h]=e,c=s(l)?l:s(h)?h:"rad",u=o(l)?l:o(h)?h:"XYZ";return t.set((0,n.FE)(r,c),(0,n.FE)(i,c),(0,n.FE)(a,c),u)}let{x:r,y:a,z:l,order:h="XYZ",unit:c="rad"}=e;return t.set((0,n.FE)(r,c),(0,n.FE)(a,c),(0,n.FE)(l,c),h)}let c=(()=>{let e=new i.Vector3,t=new i.Euler,r=new i.Vector3,n=new i.Quaternion;return function(s,o){let{x:a=0,y:c=0,z:u=0,position:d={x:a,y:c,z:u},rotationX:f=0,rotationY:p=0,rotationZ:y=0,rotationOrder:m="XYZ",rotation:g={x:f,y:p,z:y,order:m},scaleX:v=1,scaleY:w=1,scaleZ:b=1,scaleScalar:x=1,scale:P={x:v,y:w,z:b}}=s;if(o instanceof i.Matrix4)return l(d,e),h(g,t),l(P,r).multiplyScalar(x),n.setFromEuler(t),o.compose(e,n,r);if(o instanceof i.Object3D)return l(d,o.position),h(g,o.rotation),l(P,o.scale).multiplyScalar(x),o;throw Error("Invalid out argument")}})()},44645:function(e,t,r){r.d(t,{R:function(){return u}});var i=r(52471),n=r(73899),s=r(27741),o=r(40069);function a(e){let t,r;let i=new Promise((i,n)=>{t=()=>{i(e)},r=e=>{n(e)}});return Object.assign(e,{then:i.then.bind(i),catch:i.catch.bind(i),finally:i.finally.bind(i),resolve:t,reject:r}),e}let l=["gltf","glb"],h=["png","jpg","jpeg","hdr","exr"];class c{add(e){return this.listeners.add(e),{destroy:()=>this.listeners.delete(e)}}call(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];for(let e of this.listeners)e.apply(null,t)}constructor(){this.listeners=new Set}}class u{static current(){var e;return null!==(e=this.instances[this.instances.length-1])&&void 0!==e?e:new u}static get(e){var t;return null!==(t=this.instances.find(t=>t.name===e))&&void 0!==t?t:new u({name:e})}setPath(e){this.path=e}onAfterLoad(e){return this._onAfterLoad.add(e)}async loadGltf(e){return new Promise((t,r)=>{this.loaders.gltf.load(e,e=>{t(e),this._onAfterLoad.call()},void 0,r)})}async loadRgbe(e){let t=a(this.loaders.rgbeLoader.load(e,e=>{t.resolve(),this._onAfterLoad.call()},void 0,()=>{console.log("Failed to load RGBE: ".concat(e))}));return t}async loadExr(e){let t=a(this.loaders.exrLoader.load(e,e=>{t.resolve(),this._onAfterLoad.call()},void 0,()=>{console.log("Failed to load EXR: ".concat(e))}));return t}loadTexture(e,t){let r=new URL(this.path+e,window.location.href).href;if(this.textureCache.has(r)){let e=this.textureCache.get(r);return null==t||t(e),e}let i=a(this.loaders.texture.load(r,e=>{this.textureCache.set(r,i),null==t||t(e),i.resolve(),this._onAfterLoad.call()},void 0,()=>{console.log("Failed to load texture: ".concat(r))}));return i}async load(e){let t=e.split(".").pop();if(l.includes(t))return this.loadGltf(e);if(h.includes(t))return new Promise((t,r)=>{this.loaders.texture.load(e,e=>{t(e),this._onAfterLoad.call()},void 0,r)});throw Error("Unsupported extension: ".concat(t))}constructor({name:e}={}){this.id=u.nextId++,this.loaders={gltf:new s.E,texture:new i.TextureLoader,rgbeLoader:new o.x,exrLoader:new n.I},this.path="",this._onAfterLoad=new c,this.textureCache=new Map,this.name=null!=e?e:"UnifiedLoader-".concat(this.id),u.instances.push(this)}}u.nextId=0,u.instances=[]},74175:function(e,t,r){r.d(t,{FE:function(){return s},Q7:function(){return h},iK:function(){return l},ux:function(){return o}});var i=r(39805);let n={rad:1,deg:Math.PI/180,turn:2*Math.PI};function s(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"rad",r=t,i=0;if("number"==typeof e)i=e;else{let t=e.match(/^\s*(-?[0-9.]+)\s*(\/\s*-?[0-9.]+)?\s*(rad|deg|turn)\s*$/);if(t){let[e,n,s,o]=t;i=Number.parseFloat(n),s&&(i/=Number.parseFloat(s.slice(1))),r=o}else i=Number.parseFloat(e)}return i*n[r]}function o(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"rad";return"".concat((0,i.uf)(e/n[t])).concat(t)}function a(e){return"number"==typeof e}function l(e,t,r,i){if(null!=r||(r=0),null!=i||(i=a),null!=t||(t={x:r,y:r}),null==e)return t;if(i(e))return t.x=e,t.y=e,t;if(Array.isArray(e)){let[r,i]=e;return t.x=r,t.y=i,t}if("width"in e){let{width:r,height:i}=e;return t.x=r,t.y=i,t}let{x:n,y:s}=e;return t.x=n,t.y=s,t}function h(e,t,r,i){if(null!=i||(i=a),null!=r||(r=0),null!=t||(t={x:r,y:r,z:r}),null==e)return t;if(i(e))return t.x=e,t.y=e,t.z=e,t;if(Array.isArray(e)){let[i,n,s=r]=e;return t.x=i,t.y=n,t.z=s,t}if("width"in e){let{width:i,height:n=r,depth:s=r}=e;return t.x=i,t.y=n,t.z=s,t}let{x:n=r,y:s=r,z:o=r}=e;return t.x=n,t.y=s,t.z=o,t}},1296:function(e,t,r){function i(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];for(let e of t.flat(2))"destroy"in e?e.destroy():e()}r.d(t,{N:function(){return n},o:function(){return i}});class n{collect(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];for(let e of t)if(e){if(Symbol.iterator in e)for(let t of e)t&&this.destroyables.push(t);else this.destroyables.push(e)}}constructor(){this.destroyables=[],this.destroy=()=>{i(this.destroyables),this.destroyables=[]}}}}}]);