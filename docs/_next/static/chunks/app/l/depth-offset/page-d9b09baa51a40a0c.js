(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9577],{70941:function(e,t,r){Promise.resolve().then(r.bind(r,58904))},23247:function(e,t,r){"use strict";r.d(t,{b:function(){return d},R:function(){return b}});var n=r(77478),a=r(88780);let o=["common","uv_pars_vertex","displacementmap_pars_vertex","color_pars_vertex","fog_pars_vertex","normal_pars_vertex","morphtarget_pars_vertex","skinning_pars_vertex","shadowmap_pars_vertex","logdepthbuf_pars_vertex","clipping_planes_pars_vertex","uv_vertex","color_vertex","morphcolor_vertex","beginnormal_vertex","morphnormal_vertex","skinbase_vertex","skinnormal_vertex","defaultnormal_vertex","normal_vertex","begin_vertex","morphtarget_vertex","skinning_vertex","displacementmap_vertex","project_vertex","logdepthbuf_vertex","clipping_planes_vertex","worldpos_vertex","shadowmap_vertex","fog_vertex","common","packing","dithering_pars_fragment","color_pars_fragment","uv_pars_fragment","map_pars_fragment","alphamap_pars_fragment","alphatest_pars_fragment","alphahash_pars_fragment","aomap_pars_fragment","lightmap_pars_fragment","emissivemap_pars_fragment","iridescence_fragment","cube_uv_reflection_fragment","envmap_common_pars_fragment","envmap_physical_pars_fragment","fog_pars_fragment","lights_pars_begin","normal_pars_fragment","lights_physical_pars_fragment","transmission_pars_fragment","shadowmap_pars_fragment","bumpmap_pars_fragment","normalmap_pars_fragment","clearcoat_pars_fragment","iridescence_pars_fragment","roughnessmap_pars_fragment","metalnessmap_pars_fragment","logdepthbuf_pars_fragment","clipping_planes_pars_fragment","clipping_planes_fragment","logdepthbuf_fragment","map_fragment","color_fragment","alphamap_fragment","alphatest_fragment","alphahash_fragment","roughnessmap_fragment","metalnessmap_fragment","normal_fragment_begin","normal_fragment_maps","clearcoat_normal_fragment_begin","clearcoat_normal_fragment_maps","emissivemap_fragment","lights_physical_fragment","lights_fragment_begin","lights_fragment_maps","lights_fragment_end","aomap_fragment","transmission_fragment","opaque_fragment","tonemapping_fragment","colorspace_fragment","fog_fragment","premultiplied_alpha_fragment","dithering_fragment"];var i=r(58100);class c{static from(e,t){if(t instanceof i.Observable){if("number"==typeof t.value)return new c(e,t);throw Error("Observable value must be a number")}let r=typeof t;return"object"===r&&(t.constructor===Object||t instanceof a.Uniform)&&"value"in t?new c(e,t):"string"===r?new c(e,{value:new a.Color(t)}):new c(e,{value:t})}get value(){return this.target.value}computeDeclaration(){let e=this.name,t=this.target.value,r="";if(t instanceof Float32Array)return"uniform float ".concat(e,"[").concat(t.length,"];");if(Array.isArray(t)&&(r="[".concat(t.length,"]"),t=t[0]),"number"==typeof t)return"uniform float ".concat(e).concat(r,";");if(t.isVector2)return"uniform vec2 ".concat(e).concat(r,";");if(t.isVector3||t.isColor)return"uniform vec3 ".concat(e).concat(r,";");if(t.isVector4||t.isQuaternion)return"uniform vec4 ".concat(e).concat(r,";");if(t.isMatrix3)return"uniform mat3 ".concat(e).concat(r,";");if(t.isMatrix4)return"uniform mat4 ".concat(e).concat(r,";");if(t.isTexture)return t.isCubeTexture?"uniform samplerCube ".concat(e).concat(r,";"):"uniform sampler2D ".concat(e).concat(r,";");throw console.log("unhandled value:",t),Error('unhandled value: "'.concat(null==t?void 0:t.constructor.name,'"'))}constructor(e,t){this.name=e,this.target=t}}function s(){let e=(0,n._)(["","s*",""],["","\\s*",""]);return s=function(){return e},e}let l=null,f=e=>(l=e,d),m="// ShaderForge (injected code) ->",p="// <- ShaderForge",u=e=>"".concat(m,"\n").concat(e.trim(),"\n").concat(p),_=e=>{let t=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),r=RegExp(String.raw(s(),t(p),t(m)),"g");return e.replaceAll(r,"")};class g{getPattern(e){let{throwError:t=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r="#include <".concat(e,">"),n=this.type;if(t&&!1===l[n].includes(r))throw Error('"'.concat(r,'" is not present in the shader template program.'));return{pattern:r,type:n}}replace(e,t){if(e instanceof RegExp){let{type:r}=this;l[r].match(e),l[r]=l[r].replace(e,u(t))}else{let{type:r,pattern:n}=this.getPattern(e),a=u(t);l[r]=l[r].replace(n,a)}return d}inject(e,t,r){let{type:n,pattern:a}=this.getPattern(t),o="after"===e?"".concat(a,"\n").concat(u(r)):"".concat(u(r),"\n").concat(a);return l[n]=l[n].replace(a,o),d}injectTokenComments(){for(let e of o){let{type:t,pattern:r}=this.getPattern(e,{throwError:!1});l[t]=l[t].replace(r,"\n        ".concat(r,"\n        // ShaderForge TOKEN: ").concat(e,"\n      "))}return d}header(e){let t=this.type;return l[t]="".concat(e,"\n").concat(l[t]),d}before(e,t){return this.inject("before",e,t)}after(e,t){return this.inject("after",e,t)}top(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return l[this.type]=l[this.type].replace("void main() {","\n      ".concat(u(t.join("\n\n")),"\n      void main() {\n    ")),d}mainBeforeAll(e){return l[this.type]=l[this.type].replace("void main() {","void main() {\n        ".concat(u(e))),d}mainAfterAll(e){return l[this.type]=l[this.type].replace(/}\s*$/,"\n      ".concat(u(e),"\n    }")),d}uniforms(e){if("string"==typeof e)this.top(e);else{let t=[];for(let[r,n]of Object.entries(e)){let e=c.from(r,n);t.push(e.computeDeclaration())}this.top(t.join("\n")),function(e){for(let[t,r]of Object.entries(e)){let e=c.from(t,r);if(t in l.uniforms){if(e.value!==l.uniforms[t].value)throw Error("Shader redefinition! (Uniform values are not equal)")}else l.uniforms[t]=e}}(e)}return d}clean(){return l[this.type]=_(l[this.type]),d}printFinalCode(){return console.log(l[this.type].replace(/#include <(.*)>/g,(e,t)=>{let r=a.ShaderChunk[t];if(!r)throw Error('Shader chunk "'.concat(t,'" not found'));return r})),d}constructor(e){this.type=e}}let h=new g("fragmentShader"),v=new g("vertexShader"),d=Object.assign(function(e){return e&&f(e),d},{shaderName:function(e){return l.shaderName="".concat(e," (ShaderForge)"),d},defines:function(e){return l.defines?Object.assign(l.defines,e):l.defines=e,d},uniforms:function(e){return v.uniforms(e),h.uniforms(e),d},varying:function(e){let t="";if("string"==typeof e)t=e;else{let r=[];for(let[t,n]of Object.entries(e))r.push("varying ".concat(n," ").concat(t,";"));t=r.join("\n")}return v.top(t),h.top(t),d},top:function(e){return v.top(e),h.top(e),d},vertex:v,fragment:h,header:function(e){return h.header(e),v.header(e),d},clean:function(){return h.clean(),v.clean(),d},with:f,wrap:(e,t)=>(e.onBeforeCompile=e=>{l=e},e)}),x=new a.Color;function b(e){let{r:t,g:r,b:n}=x.set(e);return"vec3(".concat(t.toFixed(3),", ").concat(r.toFixed(3),", ").concat(n.toFixed(3),")")}},41737:function(e,t,r){"use strict";r.d(t,{N:function(){return i}});var n=r(88780),a=r(32219);new n.Vector3(0,0,0),new n.Euler(0,0,0,"XYZ"),new n.Vector3(1,1,1);let o={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,rotationOrder:"XYZ",rotationUnit:"rad",scaleX:1,scaleY:1,scaleZ:1,scaleScalar:1,visible:void 0,name:void 0,parent:void 0};function i(e,t){let{x:r,y:i,z:c,position:s=new n.Vector3(r,i,c),rotationX:l,rotationY:f,rotationZ:m,rotationOrder:p,rotationUnit:u,rotation:_,scaleX:g,scaleY:h,scaleZ:v,scaleScalar:d,scale:x=new n.Vector3(g,h,v).multiplyScalar(d),visible:b,name:w,parent:y}={...o,...t};return(0,a.Q7)(s,e.position),(0,a.Gg)(null!=_?_:[l,f,m,p,u],e.rotation),(0,a.Q7)(x,e.scale),void 0!==b&&(e.visible=b),void 0!==w&&(e.name=w),void 0!==y&&y!==e.parent&&(null===y?e.removeFromParent():y.add(e)),e}},78780:function(e,t,r){"use strict";r.d(t,{H$:function(){return c},bB:function(){return i},cY:function(){return o}});var n=r(26211),a=r(41737);function o(e,t,r){return t&&((0,n.nK)(t)?t.add(e):(0,a.N)(e,t)),null==r||r(e),e}let i=o;function c(e,t){return function(e,t){let r=e;for(;r.parent;){if(r.parent===t)return!0;r=r.parent}return!1}(t,e)}}},function(e){e.O(0,[7987,7512,1561,7834,6158,3956,1067,3310,749,812,3420,1540,167,9258,5284,1618,8904,5694,2840,1744],function(){return e(e.s=70941)}),_N_E=e.O()}]);