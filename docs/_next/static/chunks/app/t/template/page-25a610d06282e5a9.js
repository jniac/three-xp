(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1682],{55892:function(e,t,n){Promise.resolve().then(n.bind(n,45742))},45742:function(e,t,n){"use strict";n.d(t,{Client:function(){return x}});var r=n(32617),a=n(37186),o=n(15721),i=n(12042),c=n(78780),s=n(29368),l=n(87200),u=n(23657),f=n(9258);n(41737);let m=(0,l.createContext)(null),p={className:"",assetsPath:"/"};function _(e){let{children:t,className:n,assetsPath:a}={...p,...e},o=(0,l.useMemo)(()=>new f.Vu,[]);o.loader.setPath(a);let{ref:i}=(0,u.Nv)({debounce:!0},function*(e,t){yield o.initialize(e),t.triggerRender(),Object.assign(window,{three:o})},[]);return(0,r.jsx)("div",{ref:i,className:n,style:{position:"absolute",inset:0},children:(0,r.jsx)(m.Provider,{value:o,children:o.initialized&&t})})}function g(e){return function(){let[e,t]=(0,l.useState)(!1);return(0,l.useLayoutEffect)(()=>{t(!0)},[]),e}()&&(0,r.jsx)(_,{...e})}var h=n(57143),d=n.n(h);function v(){return!function(e,t){let n=(0,l.useContext)(m);(0,u.sv)(async function*(t,r){if(e){let t=e(n,r);if(t&&"function"==typeof t.next)do{let{value:e,done:n}=await t.next();if(n)break;yield e}while(r.mounted)}},null!=t?t:"always")}(function*(e){let t=(0,c.cY)(new a.Kj0(new a.cJO,new i.P),e.scene);yield()=>t.removeFromParent();let n=new o.F;n.initialize(e.renderer.domElement).start(),yield(0,s.RC)("three",t=>{n.update(e.camera,e.aspect,t.deltaTime)})},[]),null}function x(){return(0,r.jsx)("div",{className:"layer thru ".concat(d().Client),children:(0,r.jsx)(g,{children:(0,r.jsx)(v,{})})})}},12042:function(e,t,n){"use strict";n.d(t,{P:function(){return i}});var r=n(88780),a=n(23247);let o={luminosity:.5};class i extends r.vBJ{constructor(e){let{luminosity:t,...n}={...o,...e},i={uSunPosition:{value:new r.Pa4(.5,.7,.3)},uLuminosity:{value:t}};super(n),this.onBeforeCompile=e=>a.b.with(e).uniforms(i).varying({vWorldNormal:"vec3"}).vertex.mainAfterAll("\n          vWorldNormal = mat3(modelMatrix) * normal;\n      ").fragment.after("map_fragment","\n        vec3 lightDirection = normalize(uSunPosition);\n        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n        light = pow(light, 2.0);\n        light = mix(uLuminosity, 1.0, light);\n        diffuseColor *= light;\n      "),this.sunPosition=i.uSunPosition.value}}},23247:function(e,t,n){"use strict";n.d(t,{b:function(){return v},R:function(){return b}});var r=n(77478),a=n(88780);let o=["common","uv_pars_vertex","displacementmap_pars_vertex","color_pars_vertex","fog_pars_vertex","normal_pars_vertex","morphtarget_pars_vertex","skinning_pars_vertex","shadowmap_pars_vertex","logdepthbuf_pars_vertex","clipping_planes_pars_vertex","uv_vertex","color_vertex","morphcolor_vertex","beginnormal_vertex","morphnormal_vertex","skinbase_vertex","skinnormal_vertex","defaultnormal_vertex","normal_vertex","begin_vertex","morphtarget_vertex","skinning_vertex","displacementmap_vertex","project_vertex","logdepthbuf_vertex","clipping_planes_vertex","worldpos_vertex","shadowmap_vertex","fog_vertex","common","packing","dithering_pars_fragment","color_pars_fragment","uv_pars_fragment","map_pars_fragment","alphamap_pars_fragment","alphatest_pars_fragment","alphahash_pars_fragment","aomap_pars_fragment","lightmap_pars_fragment","emissivemap_pars_fragment","iridescence_fragment","cube_uv_reflection_fragment","envmap_common_pars_fragment","envmap_physical_pars_fragment","fog_pars_fragment","lights_pars_begin","normal_pars_fragment","lights_physical_pars_fragment","transmission_pars_fragment","shadowmap_pars_fragment","bumpmap_pars_fragment","normalmap_pars_fragment","clearcoat_pars_fragment","iridescence_pars_fragment","roughnessmap_pars_fragment","metalnessmap_pars_fragment","logdepthbuf_pars_fragment","clipping_planes_pars_fragment","clipping_planes_fragment","logdepthbuf_fragment","map_fragment","color_fragment","alphamap_fragment","alphatest_fragment","alphahash_fragment","roughnessmap_fragment","metalnessmap_fragment","normal_fragment_begin","normal_fragment_maps","clearcoat_normal_fragment_begin","clearcoat_normal_fragment_maps","emissivemap_fragment","lights_physical_fragment","lights_fragment_begin","lights_fragment_maps","lights_fragment_end","aomap_fragment","transmission_fragment","opaque_fragment","tonemapping_fragment","colorspace_fragment","fog_fragment","premultiplied_alpha_fragment","dithering_fragment"];var i=n(58100);class c{static from(e,t){if(t instanceof i.Observable){if("number"==typeof t.value)return new c(e,t);throw Error("Observable value must be a number")}let n=typeof t;return"object"===n&&(t.constructor===Object||t instanceof a.xWb)&&"value"in t?new c(e,t):"string"===n?new c(e,{value:new a.Ilk(t)}):new c(e,{value:t})}get value(){return this.target.value}computeDeclaration(){let e=this.name,t=this.target.value,n="";if(t instanceof Float32Array)return"uniform float ".concat(e,"[").concat(t.length,"];");if(Array.isArray(t)&&(n="[".concat(t.length,"]"),t=t[0]),"number"==typeof t)return"uniform float ".concat(e).concat(n,";");if(t.isVector2)return"uniform vec2 ".concat(e).concat(n,";");if(t.isVector3||t.isColor)return"uniform vec3 ".concat(e).concat(n,";");if(t.isVector4||t.isQuaternion)return"uniform vec4 ".concat(e).concat(n,";");if(t.isMatrix3)return"uniform mat3 ".concat(e).concat(n,";");if(t.isMatrix4)return"uniform mat4 ".concat(e).concat(n,";");if(t.isTexture)return t.isCubeTexture?"uniform samplerCube ".concat(e).concat(n,";"):"uniform sampler2D ".concat(e).concat(n,";");throw console.log("unhandled value:",t),Error('unhandled value: "'.concat(null==t?void 0:t.constructor.name,'"'))}constructor(e,t){this.name=e,this.target=t}}function s(){let e=(0,r._)(["","s*",""],["","\\s*",""]);return s=function(){return e},e}let l=null,u=e=>(l=e,v),f="// ShaderForge (injected code) ->",m="// <- ShaderForge",p=e=>"".concat(f,"\n").concat(e.trim(),"\n").concat(m),_=e=>{let t=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),n=RegExp(String.raw(s(),t(m),t(f)),"g");return e.replaceAll(n,"")};class g{getPattern(e){let{throwError:t=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n="#include <".concat(e,">"),r=this.type;if(t&&!1===l[r].includes(n))throw Error('"'.concat(n,'" is not present in the shader template program.'));return{pattern:n,type:r}}replace(e,t){if(e instanceof RegExp){let{type:n}=this;l[n].match(e),l[n]=l[n].replace(e,p(t))}else{let{type:n,pattern:r}=this.getPattern(e),a=p(t);l[n]=l[n].replace(r,a)}return v}inject(e,t,n){let{type:r,pattern:a}=this.getPattern(t),o="after"===e?"".concat(a,"\n").concat(p(n)):"".concat(p(n),"\n").concat(a);return l[r]=l[r].replace(a,o),v}injectTokenComments(){for(let e of o){let{type:t,pattern:n}=this.getPattern(e,{throwError:!1});l[t]=l[t].replace(n,"\n        ".concat(n,"\n        // ShaderForge TOKEN: ").concat(e,"\n      "))}return v}header(e){let t=this.type;return l[t]="".concat(e,"\n").concat(l[t]),v}before(e,t){return this.inject("before",e,t)}after(e,t){return this.inject("after",e,t)}top(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return l[this.type]=l[this.type].replace("void main() {","\n      ".concat(p(t.join("\n\n")),"\n      void main() {\n    ")),v}mainBeforeAll(e){return l[this.type]=l[this.type].replace("void main() {","void main() {\n        ".concat(p(e))),v}mainAfterAll(e){return l[this.type]=l[this.type].replace(/}\s*$/,"\n      ".concat(p(e),"\n    }")),v}uniforms(e){if("string"==typeof e)this.top(e);else{let t=[];for(let[n,r]of Object.entries(e)){let e=c.from(n,r);t.push(e.computeDeclaration())}this.top(t.join("\n")),function(e){for(let[t,n]of Object.entries(e)){let e=c.from(t,n);if(t in l.uniforms){if(e.value!==l.uniforms[t].value)throw Error("Shader redefinition! (Uniform values are not equal)")}else l.uniforms[t]=e}}(e)}return v}clean(){return l[this.type]=_(l[this.type]),v}printFinalCode(){return console.log(l[this.type].replace(/#include <(.*)>/g,(e,t)=>{let n=a.WdD[t];if(!n)throw Error('Shader chunk "'.concat(t,'" not found'));return n})),v}constructor(e){this.type=e}}let h=new g("fragmentShader"),d=new g("vertexShader"),v=Object.assign(function(e){return e&&u(e),v},{shaderName:function(e){return l.shaderName="".concat(e," (ShaderForge)"),v},defines:function(e){return l.defines?Object.assign(l.defines,e):l.defines=e,v},uniforms:function(e){return d.uniforms(e),h.uniforms(e),v},varying:function(e){let t="";if("string"==typeof e)t=e;else{let n=[];for(let[t,r]of Object.entries(e))n.push("varying ".concat(r," ").concat(t,";"));t=n.join("\n")}return d.top(t),h.top(t),v},top:function(e){return d.top(e),h.top(e),v},vertex:d,fragment:h,header:function(e){return h.header(e),d.header(e),v},clean:function(){return h.clean(),d.clean(),v},with:u,wrap:(e,t)=>(e.onBeforeCompile=e=>{l=e},e)}),x=new a.Ilk;function b(e){let{r:t,g:n,b:r}=x.set(e);return"vec3(".concat(t.toFixed(3),", ").concat(n.toFixed(3),", ").concat(r.toFixed(3),")")}},41737:function(e,t,n){"use strict";n.d(t,{N:function(){return i}});var r=n(88780),a=n(32219);new r.Pa4(0,0,0),new r.USm(0,0,0,"XYZ"),new r.Pa4(1,1,1);let o={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,rotationOrder:"XYZ",rotationUnit:"rad",scaleX:1,scaleY:1,scaleZ:1,scaleScalar:1,visible:void 0,name:void 0,parent:void 0};function i(e,t){let{x:n,y:i,z:c,position:s=new r.Pa4(n,i,c),rotationX:l,rotationY:u,rotationZ:f,rotationOrder:m,rotationUnit:p,rotation:_,scaleX:g,scaleY:h,scaleZ:d,scaleScalar:v,scale:x=new r.Pa4(g,h,d).multiplyScalar(v),visible:b,name:w,parent:y}={...o,...t};return(0,a.Q7)(s,e.position),(0,a.Gg)(null!=_?_:[l,u,f,m,p],e.rotation),(0,a.Q7)(x,e.scale),void 0!==b&&(e.visible=b),void 0!==w&&(e.name=w),void 0!==y&&y!==e.parent&&(null===y?e.removeFromParent():y.add(e)),e}},78780:function(e,t,n){"use strict";n.d(t,{H$:function(){return c},bB:function(){return i},cY:function(){return o}});var r=n(26211),a=n(41737);function o(e,t,n){return t&&((0,r.nK)(t)?t.add(e):(0,a.N)(e,t)),null==n||n(e),e}let i=o;function c(e,t){return function(e,t){let n=e;for(;n.parent;){if(n.parent===t)return!0;n=n.parent}return!1}(t,e)}},57143:function(e){e.exports={Client:"client_Client__eDdMm"}},77478:function(e,t,n){"use strict";function r(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}n.d(t,{_:function(){return r}})}},function(e){e.O(0,[7176,411,7512,5406,812,3420,1540,167,4157,9258,5721,5694,2840,1744],function(){return e(e.s=55892)}),_N_E=e.O()}]);