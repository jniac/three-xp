(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6532],{29351:function(e,t,n){Promise.resolve().then(n.bind(n,96633))},96633:function(e,t,n){"use strict";n.d(t,{Client:function(){return u}});var r=n(32617),a=n(88780),o=n(33966),i=n(12042),l=n(78780),s=n(49959);function c(){return(0,o.Ky)(function*(e){(0,l.cY)(new a.Mesh(new a.IcosahedronGeometry(1,0),new i.P),{parent:e.scene,x:-4}),(0,l.cY)(new s.lx,{parent:e.scene})},[]),null}function u(){return(0,r.jsx)(o.H7,{children:(0,r.jsxs)(o.KU,{children:[(0,r.jsx)("div",{className:"layer thru p-4",children:(0,r.jsx)("h1",{children:"Vertigo Widget"})}),(0,r.jsx)(c,{})]})})}},49959:function(e,t,n){"use strict";n.d(t,{AB:function(){return f},X5:function(){return a},lx:function(){return g}});var r,a,o=n(2132),i=n(88780),l=n(38794),s=n(27834);function c(e,t){let n=new i.BufferAttribute(new Int8Array(e.attributes.position.count).fill(t),1);e.setAttribute("aPartId",n)}function u(e,t,n){let r=new i.ConeGeometry(.2,.6000000000000001,e,n,!0).rotateZ(Math.PI).translate(0,.53,0),a=Array.from({length:t},(e,n)=>{let r=n/(t-1);return new i.Vector2(.2*r,-.05*(1-r**2))}),o=new i.LatheGeometry(a,e).rotateZ(Math.PI).translate(0,.2*3/2+.53,0);return(0,s.n4)([r,o],!1)}function m(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"low",t="high"===e?(0,s.$1)(new l.k(.3,.3,.3,4,.05)):new i.BoxGeometry(.3,.3,.3);c(t,0);let n="high"===e?u(32,8,5):u(6,2,1);c(n,3);let r=n.clone().rotateX(Math.PI);c(r,4);let a=n.clone().rotateZ(-Math.PI/2);c(a,1);let o=n.clone().rotateZ(Math.PI/2);c(o,2);let m=n.clone().rotateX(Math.PI/2);c(m,5);let f=n.clone().rotateX(-Math.PI/2);return c(f,6),[t,a,o,n,r,m,f]}(r=a||(a={}))[r.BOX=0]="BOX",r[r.POSITIVE_X=1]="POSITIVE_X",r[r.NEGATIVE_X=2]="NEGATIVE_X",r[r.POSITIVE_Y=3]="POSITIVE_Y",r[r.NEGATIVE_Y=4]="NEGATIVE_Y",r[r.POSITIVE_Z=5]="POSITIVE_Z",r[r.NEGATIVE_Z=6]="NEGATIVE_Z";let f={defaultColor:"white",xColor:"#eb1640",yColor:"#00ffb7",zColor:"#3b80e7",hoverColor:"#fffc47"};function p(e){let{defaultColor:t,xColor:n,yColor:r,zColor:a,hoverColor:o}={...f,...e},l=new i.Color(t),s=new i.Color(n),c=new i.Color(r),u=new i.Color(a),m=new i.Color(o),p={uSunPosition:{value:new i.Vector3(.5,.7,.3)},uLuminosity:{value:.66},uColors:{value:[l,s,l,c,l,u,l]},uHoverColor:{value:m},uOpacity:{value:[1,1,1,1,1,1,1]},uHoverOpacity:{value:[0,0,0,0,0,0,0]}};return new i.ShaderMaterial({uniforms:p,vertexShader:"\nuniform vec3 uColors[7];\nuniform float uOpacity[7];\nuniform vec3 uHoverColor;\nuniform float uHoverOpacity[7];\n\nattribute float aPartId;\n\nvarying vec3 vWorldNormal;\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying float vOpacity;\nvarying float vHoverOpacity;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vPosition = position;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  vColor = uColors[int(aPartId)];\n  vOpacity = uOpacity[int(aPartId)];\n  vHoverOpacity = uHoverOpacity[int(aPartId)];\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vPosition;\nvarying vec3 vColor;\nvarying float vOpacity;\nvarying float vHoverOpacity;\n\nuniform vec3 uSunPosition;\nuniform float uLuminosity;\nuniform vec3 uHoverColor;\n\nfloat clamp01(float x) {\n  return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;\n}\n\nfloat inverseLerp(float a, float b, float x) {\n  return clamp01((x - a) / (b - a));\n}\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  \n  float minLuminosity = max(pow(vHoverOpacity, 1.0 / 3.0) * 0.85, uLuminosity);\n  light = mix(minLuminosity, 1.0, light);\n\n  vec3 color = vColor;\n  color = mix(color, uHoverColor, vHoverOpacity);\n  gl_FragColor = vec4(color * light, vOpacity);\n}\n",transparent:!0})}let h=new i.Raycaster;class g extends i.Group{getHovered(){return this.internal.hovered}getPressed(){return this.internal.pressed}widgetUpdate(e,t,n){let r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1/60,{lowMesh:a,material:l}=this.parts,s=new i.Vector3;n.getWorldDirection(s);let c=this.matrixWorld.elements,u=new i.Vector3(c[0],c[1],c[2]),m=new i.Vector3(c[4],c[5],c[6]),f=new i.Vector3(c[8],c[9],c[10]);{let e=l.uniforms.uOpacity.value,t=Math.abs(s.dot(u)),n=Math.abs(s.dot(m)),a=Math.abs(s.dot(f));e[1]=e[2]=(0,o.Lj)(e[1],t<.98?1.05:-.05,1e-4,r),e[3]=e[4]=(0,o.Lj)(e[3],n<.98?1.05:-.05,1e-4,r),e[5]=e[6]=(0,o.Lj)(e[5],a<.98?1.05:-.05,1e-4,r)}{let e=l.uniforms.uHoverOpacity.value,t=0===this.internal.hovered?1:0,n=1===this.internal.hovered?1:0,a=2===this.internal.hovered?1:0,i=3===this.internal.hovered?1:0,s=4===this.internal.hovered?1:0,c=5===this.internal.hovered?1:0,u=6===this.internal.hovered?1:0;e[0]=(0,o.Lj)(e[0],t,1e-4,r),e[1]=(0,o.Lj)(e[1],n,1e-4,r),e[2]=(0,o.Lj)(e[2],a,1e-4,r),e[3]=(0,o.Lj)(e[3],i,1e-4,r),e[4]=(0,o.Lj)(e[4],s,1e-4,r),e[5]=(0,o.Lj)(e[5],c,1e-4,r),e[6]=(0,o.Lj)(e[6],u,1e-4,r)}h.setFromCamera(e,n);let[p]=h.intersectObject(a,!0).map(e=>{let t=3*e.faceIndex;return a.geometry.groups.findIndex(e=>e.start<=t&&t<e.start+e.count)}).filter(e=>l.uniforms.uOpacity.value[e]>.5);t&&!1===this.internal.pointerDown&&(this.internal.pointerDown=!0,this.internal.pointerDownPosition.copy(e),this.internal.pressed=null!=p?p:null),t&&!1===this.internal.dragging&&this.internal.pointerDownPosition.distanceTo(e)>.01&&(this.internal.dragging=!0),!1===t&&this.internal.pointerDown&&(this.internal.pointerDown=!1,this.internal.dragging=!1,this.internal.pressed=null);let g=this.internal.dragging?null:null!=p?p:null;this.internal.hovered,this.internal.hovered=g}constructor(e){super(),this.internal={pointerPosition:new i.Vector2,pointerDownPosition:new i.Vector2,pointerDown:!1,dragging:!1,hovered:null,pressed:null};let t=p(null==e?void 0:e.material),n=m("high").map((e,n)=>{let r=new i.Mesh(e,t);return r.name="vertigo-widget-mesh-".concat(n),this.add(r),r}),r=new i.Mesh(function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let r=m(...t);return(0,s.n4)(r,!0)}("low"),p(null==e?void 0:e.material));r.material.transparent=!1,r.name="vertigo-widget-low-mesh",r.visible=!1,this.add(r),this.parts={material:t,meshes:n,lowMesh:r}}}},12042:function(e,t,n){"use strict";n.d(t,{P:function(){return i}});var r=n(88780),a=n(23247);let o={luminosity:.5};class i extends r.MeshBasicMaterial{constructor(e){let{luminosity:t,...n}={...o,...e},i={uSunPosition:{value:new r.Vector3(.5,.7,.3)},uLuminosity:{value:t}};super(n),this.onBeforeCompile=e=>a.b.with(e).uniforms(i).varying({vWorldNormal:"vec3"}).vertex.mainAfterAll("\n          vWorldNormal = mat3(modelMatrix) * normal;\n      ").fragment.after("map_fragment","\n        vec3 lightDirection = normalize(uSunPosition);\n        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n        light = pow(light, 2.0);\n        light = mix(uLuminosity, 1.0, light);\n        diffuseColor *= light;\n      "),this.sunPosition=i.uSunPosition.value}}},23247:function(e,t,n){"use strict";n.d(t,{b:function(){return d},R:function(){return x}});var r=n(77478),a=n(88780);let o=["common","uv_pars_vertex","displacementmap_pars_vertex","color_pars_vertex","fog_pars_vertex","normal_pars_vertex","morphtarget_pars_vertex","skinning_pars_vertex","shadowmap_pars_vertex","logdepthbuf_pars_vertex","clipping_planes_pars_vertex","uv_vertex","color_vertex","morphcolor_vertex","beginnormal_vertex","morphnormal_vertex","skinbase_vertex","skinnormal_vertex","defaultnormal_vertex","normal_vertex","begin_vertex","morphtarget_vertex","skinning_vertex","displacementmap_vertex","project_vertex","logdepthbuf_vertex","clipping_planes_vertex","worldpos_vertex","shadowmap_vertex","fog_vertex","common","packing","dithering_pars_fragment","color_pars_fragment","uv_pars_fragment","map_pars_fragment","alphamap_pars_fragment","alphatest_pars_fragment","alphahash_pars_fragment","aomap_pars_fragment","lightmap_pars_fragment","emissivemap_pars_fragment","iridescence_fragment","cube_uv_reflection_fragment","envmap_common_pars_fragment","envmap_physical_pars_fragment","fog_pars_fragment","lights_pars_begin","normal_pars_fragment","lights_physical_pars_fragment","transmission_pars_fragment","shadowmap_pars_fragment","bumpmap_pars_fragment","normalmap_pars_fragment","clearcoat_pars_fragment","iridescence_pars_fragment","roughnessmap_pars_fragment","metalnessmap_pars_fragment","logdepthbuf_pars_fragment","clipping_planes_pars_fragment","clipping_planes_fragment","logdepthbuf_fragment","map_fragment","color_fragment","alphamap_fragment","alphatest_fragment","alphahash_fragment","roughnessmap_fragment","metalnessmap_fragment","normal_fragment_begin","normal_fragment_maps","clearcoat_normal_fragment_begin","clearcoat_normal_fragment_maps","emissivemap_fragment","lights_physical_fragment","lights_fragment_begin","lights_fragment_maps","lights_fragment_end","aomap_fragment","transmission_fragment","opaque_fragment","tonemapping_fragment","colorspace_fragment","fog_fragment","premultiplied_alpha_fragment","dithering_fragment"];var i=n(58100);class l{static from(e,t){if(t instanceof i.Observable){if("number"==typeof t.value)return new l(e,t);throw Error("Observable value must be a number")}let n=typeof t;return"object"===n&&(t.constructor===Object||t instanceof a.Uniform)&&"value"in t?new l(e,t):"string"===n?new l(e,{value:new a.Color(t)}):new l(e,{value:t})}get value(){return this.target.value}computeDeclaration(){let e=this.name,t=this.target.value,n="";if(t instanceof Float32Array)return"uniform float ".concat(e,"[").concat(t.length,"];");if(Array.isArray(t)&&(n="[".concat(t.length,"]"),t=t[0]),"number"==typeof t)return"uniform float ".concat(e).concat(n,";");if(t.isVector2)return"uniform vec2 ".concat(e).concat(n,";");if(t.isVector3||t.isColor)return"uniform vec3 ".concat(e).concat(n,";");if(t.isVector4||t.isQuaternion)return"uniform vec4 ".concat(e).concat(n,";");if(t.isMatrix3)return"uniform mat3 ".concat(e).concat(n,";");if(t.isMatrix4)return"uniform mat4 ".concat(e).concat(n,";");if(t.isTexture)return t.isCubeTexture?"uniform samplerCube ".concat(e).concat(n,";"):"uniform sampler2D ".concat(e).concat(n,";");throw console.log("unhandled value:",t),Error('unhandled value: "'.concat(null==t?void 0:t.constructor.name,'"'))}constructor(e,t){this.name=e,this.target=t}}function s(){let e=(0,r._)(["","s*",""],["","\\s*",""]);return s=function(){return e},e}let c=null,u=e=>(c=e,d),m="// ShaderForge (injected code) ->",f="// <- ShaderForge",p=e=>"".concat(m,"\n").concat(e.trim(),"\n").concat(f),h=e=>{let t=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),n=RegExp(String.raw(s(),t(f),t(m)),"g");return e.replaceAll(n,"")};class g{getPattern(e){let{throwError:t=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n="#include <".concat(e,">"),r=this.type;if(t&&!1===c[r].includes(n))throw Error('"'.concat(n,'" is not present in the shader template program.'));return{pattern:n,type:r}}replace(e,t){if(e instanceof RegExp){let{type:n}=this;c[n].match(e),c[n]=c[n].replace(e,p(t))}else{let{type:n,pattern:r}=this.getPattern(e),a=p(t);c[n]=c[n].replace(r,a)}return d}inject(e,t,n){let{type:r,pattern:a}=this.getPattern(t),o="after"===e?"".concat(a,"\n").concat(p(n)):"".concat(p(n),"\n").concat(a);return c[r]=c[r].replace(a,o),d}injectTokenComments(){for(let e of o){let{type:t,pattern:n}=this.getPattern(e,{throwError:!1});c[t]=c[t].replace(n,"\n        ".concat(n,"\n        // ShaderForge TOKEN: ").concat(e,"\n      "))}return d}header(e){let t=this.type;return c[t]="".concat(e,"\n").concat(c[t]),d}before(e,t){return this.inject("before",e,t)}after(e,t){return this.inject("after",e,t)}top(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return c[this.type]=c[this.type].replace("void main() {","\n      ".concat(p(t.join("\n\n")),"\n      void main() {\n    ")),d}mainBeforeAll(e){return c[this.type]=c[this.type].replace("void main() {","void main() {\n        ".concat(p(e))),d}mainAfterAll(e){return c[this.type]=c[this.type].replace(/}\s*$/,"\n      ".concat(p(e),"\n    }")),d}uniforms(e){if("string"==typeof e)this.top(e);else{let t=[];for(let[n,r]of Object.entries(e)){let e=l.from(n,r);t.push(e.computeDeclaration())}this.top(t.join("\n")),function(e){for(let[t,n]of Object.entries(e)){let e=l.from(t,n);if(t in c.uniforms){if(e.value!==c.uniforms[t].value)throw Error("Shader redefinition! (Uniform values are not equal)")}else c.uniforms[t]=e}}(e)}return d}clean(){return c[this.type]=h(c[this.type]),d}printFinalCode(){return console.log(c[this.type].replace(/#include <(.*)>/g,(e,t)=>{let n=a.ShaderChunk[t];if(!n)throw Error('Shader chunk "'.concat(t,'" not found'));return n})),d}constructor(e){this.type=e}}let v=new g("fragmentShader"),_=new g("vertexShader"),d=Object.assign(function(e){return e&&u(e),d},{shaderName:function(e){return c.shaderName="".concat(e," (ShaderForge)"),d},defines:function(e){return c.defines?Object.assign(c.defines,e):c.defines=e,d},uniforms:function(e){return _.uniforms(e),v.uniforms(e),d},varying:function(e){let t="";if("string"==typeof e)t=e;else{let n=[];for(let[t,r]of Object.entries(e))n.push("varying ".concat(r," ").concat(t,";"));t=n.join("\n")}return _.top(t),v.top(t),d},top:function(e){return _.top(e),v.top(e),d},vertex:_,fragment:v,header:function(e){return v.header(e),_.header(e),d},clean:function(){return v.clean(),_.clean(),d},with:u,wrap:(e,t)=>(e.onBeforeCompile=e=>{c=e},e)}),y=new a.Color;function x(e){let{r:t,g:n,b:r}=y.set(e);return"vec3(".concat(t.toFixed(3),", ").concat(n.toFixed(3),", ").concat(r.toFixed(3),")")}},41737:function(e,t,n){"use strict";n.d(t,{N:function(){return i}});var r=n(88780),a=n(32219);new r.Vector3(0,0,0),new r.Euler(0,0,0,"XYZ"),new r.Vector3(1,1,1);let o={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,rotationOrder:"XYZ",rotationUnit:"rad",scaleX:1,scaleY:1,scaleZ:1,scaleScalar:1,visible:void 0,name:void 0,parent:void 0};function i(e,t){let{x:n,y:i,z:l,position:s=new r.Vector3(n,i,l),rotationX:c,rotationY:u,rotationZ:m,rotationOrder:f,rotationUnit:p,rotation:h,scaleX:g,scaleY:v,scaleZ:_,scaleScalar:d,scale:y=new r.Vector3(g,v,_).multiplyScalar(d),visible:x,name:w,parent:b}={...o,...t};return(0,a.Q7)(s,e.position),(0,a.Gg)(null!=h?h:[c,u,m,f,p],e.rotation),(0,a.Q7)(y,e.scale),void 0!==x&&(e.visible=x),void 0!==w&&(e.name=w),void 0!==b&&b!==e.parent&&(null===b?e.removeFromParent():b.add(e)),e}},78780:function(e,t,n){"use strict";n.d(t,{H$:function(){return l},bB:function(){return i},cY:function(){return o}});var r=n(26211),a=n(41737);function o(e,t,n){return t&&((0,r.nK)(t)?t.add(e):(0,a.N)(e,t)),null==n||n(e),e}let i=o;function l(e,t){return function(e,t){let n=e;for(;n.parent;){if(n.parent===t)return!0;n=n.parent}return!1}(t,e)}},38794:function(e,t,n){"use strict";n.d(t,{k:function(){return i}});var r=n(88780);let a=new r.Vector3;function o(e,t,n,r,o,i){let l=2*Math.PI*o/4,s=Math.max(i-2*o,0);a.copy(t),a[r]=0,a.normalize();let c=.5*l/(l+s),u=1-a.angleTo(e)/(Math.PI/4);return 1===Math.sign(a[n])?u*c:s/(l+s)+c+c*(1-u)}class i extends r.BoxGeometry{constructor(e=1,t=1,n=1,a=2,i=.1){if(a=2*a+1,i=Math.min(e/2,t/2,n/2,i),super(1,1,1,a,a,a),1===a)return;let l=this.toNonIndexed();this.index=null,this.attributes.position=l.attributes.position,this.attributes.normal=l.attributes.normal,this.attributes.uv=l.attributes.uv;let s=new r.Vector3,c=new r.Vector3,u=new r.Vector3(e,t,n).divideScalar(2).subScalar(i),m=this.attributes.position.array,f=this.attributes.normal.array,p=this.attributes.uv.array,h=m.length/6,g=new r.Vector3,v=.5/a;for(let r=0,a=0;r<m.length;r+=3,a+=2)switch(s.fromArray(m,r),c.copy(s),c.x-=Math.sign(c.x)*v,c.y-=Math.sign(c.y)*v,c.z-=Math.sign(c.z)*v,c.normalize(),m[r+0]=u.x*Math.sign(s.x)+c.x*i,m[r+1]=u.y*Math.sign(s.y)+c.y*i,m[r+2]=u.z*Math.sign(s.z)+c.z*i,f[r+0]=c.x,f[r+1]=c.y,f[r+2]=c.z,Math.floor(r/h)){case 0:g.set(1,0,0),p[a+0]=o(g,c,"z","y",i,n),p[a+1]=1-o(g,c,"y","z",i,t);break;case 1:g.set(-1,0,0),p[a+0]=1-o(g,c,"z","y",i,n),p[a+1]=1-o(g,c,"y","z",i,t);break;case 2:g.set(0,1,0),p[a+0]=1-o(g,c,"x","z",i,e),p[a+1]=o(g,c,"z","x",i,n);break;case 3:g.set(0,-1,0),p[a+0]=1-o(g,c,"x","z",i,e),p[a+1]=1-o(g,c,"z","x",i,n);break;case 4:g.set(0,0,1),p[a+0]=1-o(g,c,"x","y",i,e),p[a+1]=1-o(g,c,"y","x",i,t);break;case 5:g.set(0,0,-1),p[a+0]=o(g,c,"x","y",i,e),p[a+1]=1-o(g,c,"y","x",i,t)}}}}},function(e){e.O(0,[7987,7512,1561,7834,6158,3956,1067,3310,749,812,3420,1540,167,9258,5284,1618,5694,2840,1744],function(){return e(e.s=29351)}),_N_E=e.O()}]);