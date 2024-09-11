"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[595],{9595:function(e,t,n){n.d(t,{Main:function(){return q}});var r=n(7504),o=n(257),a=n(6935),i=n(2983);let l=["common","uv_pars_vertex","displacementmap_pars_vertex","color_pars_vertex","fog_pars_vertex","normal_pars_vertex","morphtarget_pars_vertex","skinning_pars_vertex","shadowmap_pars_vertex","logdepthbuf_pars_vertex","clipping_planes_pars_vertex","uv_vertex","color_vertex","morphcolor_vertex","beginnormal_vertex","morphnormal_vertex","skinbase_vertex","skinnormal_vertex","defaultnormal_vertex","normal_vertex","begin_vertex","morphtarget_vertex","skinning_vertex","displacementmap_vertex","project_vertex","logdepthbuf_vertex","clipping_planes_vertex","worldpos_vertex","shadowmap_vertex","fog_vertex","common","packing","dithering_pars_fragment","color_pars_fragment","uv_pars_fragment","map_pars_fragment","alphamap_pars_fragment","alphatest_pars_fragment","alphahash_pars_fragment","aomap_pars_fragment","lightmap_pars_fragment","emissivemap_pars_fragment","iridescence_fragment","cube_uv_reflection_fragment","envmap_common_pars_fragment","envmap_physical_pars_fragment","fog_pars_fragment","lights_pars_begin","normal_pars_fragment","lights_physical_pars_fragment","transmission_pars_fragment","shadowmap_pars_fragment","bumpmap_pars_fragment","normalmap_pars_fragment","clearcoat_pars_fragment","iridescence_pars_fragment","roughnessmap_pars_fragment","metalnessmap_pars_fragment","logdepthbuf_pars_fragment","clipping_planes_pars_fragment","clipping_planes_fragment","logdepthbuf_fragment","map_fragment","color_fragment","alphamap_fragment","alphatest_fragment","alphahash_fragment","roughnessmap_fragment","metalnessmap_fragment","normal_fragment_begin","normal_fragment_maps","clearcoat_normal_fragment_begin","clearcoat_normal_fragment_maps","emissivemap_fragment","lights_physical_fragment","lights_fragment_begin","lights_fragment_maps","lights_fragment_end","aomap_fragment","transmission_fragment","opaque_fragment","tonemapping_fragment","colorspace_fragment","fog_fragment","premultiplied_alpha_fragment","dithering_fragment"];var s=n(2773);class c{static from(e,t){if(t instanceof s.Observable){if("number"==typeof t.value)return new c(e,t);throw Error("Observable value must be a number")}let n=typeof t;return"object"===n&&t.constructor===Object&&"value"in t?new c(e,t):"string"===n?new c(e,{value:new i.Ilk(t)}):new c(e,{value:t})}get value(){return this.target.value}computeDeclaration(){let e=this.name,t=this.target.value;if("number"==typeof t)return"uniform float ".concat(e,";");if(t.isVector2)return"uniform vec2 ".concat(e,";");if(t.isVector3||t.isColor)return"uniform vec3 ".concat(e,";");if(t.isVector4||t.isQuaternion)return"uniform vec4 ".concat(e,";");if(t.isMatrix3)return"uniform mat3 ".concat(e,";");if(t.isMatrix4)return"uniform mat4 ".concat(e,";");if(t.isTexture)return t.isCubeTexture?"uniform samplerCube ".concat(e,";"):"uniform sampler2D ".concat(e,";");if(t instanceof Float32Array)return"uniform float ".concat(e,"[").concat(t.length,"];");throw console.log("unhandled value:",t),Error('unhandled value: "'.concat(null==t?void 0:t.constructor.name,'"'))}constructor(e,t){this.name=e,this.target=t}}function p(){let e=Object.freeze(Object.defineProperties(["","s*",""],{raw:{value:Object.freeze(["","\\s*",""])}}));return p=function(){return e},e}let m=null,d=e=>(m=e,b),f="// ShaderForge (injected code) ->",h="// <- ShaderForge",u=e=>"".concat(f,"\n").concat(e.trim(),"\n").concat(h),g=e=>{let t=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),n=RegExp(String.raw(p(),t(h),t(f)),"g");return e.replaceAll(n,"")};class v{getPattern(e){let{throwError:t=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n="#include <".concat(e,">"),r=this.type;if(t&&!1===m[r].includes(n))throw Error('"'.concat(n,'" is not present in the shader template program.'));return{pattern:n,type:r}}replace(e,t){let{type:n,pattern:r}=this.getPattern(e),o=u(t);return m[n]=m[n].replace(r,o),b}inject(e,t,n){let{type:r,pattern:o}=this.getPattern(t),a="after"===e?"".concat(o,"\n").concat(u(n)):"".concat(u(n),"\n").concat(o);return m[r]=m[r].replace(o,a),b}injectTokenComments(){for(let e of l){let{type:t,pattern:n}=this.getPattern(e,{throwError:!1});m[t]=m[t].replace(n,"\n        ".concat(n,"\n        // ShaderForge TOKEN: ").concat(e,"\n      "))}return b}header(e){let t=this.type;return m[t]="".concat(e,"\n").concat(m[t]),b}before(e,t){return this.inject("before",e,t)}after(e,t){return this.inject("after",e,t)}top(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return m[this.type]=m[this.type].replace("void main() {","\n      ".concat(u(t.join("\n\n")),"\n      void main() {\n    ")),b}mainBeforeAll(e){return m[this.type]=m[this.type].replace("void main() {","void main() {\n        ".concat(u(e))),b}mainAfterAll(e){return m[this.type]=m[this.type].replace(/}\s*$/,"\n      ".concat(u(e),"\n    }")),b}uniforms(e){if("string"==typeof e)this.top(e);else{let t=[];for(let[n,r]of Object.entries(e)){let e=c.from(n,r);t.push(e.computeDeclaration())}this.top(t.join("\n")),_(e)}return b}clean(){return m[this.type]=g(m[this.type]),b}printFinalCode(){return console.log(m[this.type].replace(/#include <(.*)>/g,(e,t)=>{let n=i.WdD[t];if(!n)throw Error('Shader chunk "'.concat(t,'" not found'));return n})),b}constructor(e){this.type=e}}let _=e=>{for(let[t,n]of Object.entries(e)){let e=c.from(t,n);if(t in m.uniforms){if(e.value!==m.uniforms[t].value)throw Error("Shader redefinition! (Uniform values are not equal)")}else m.uniforms[t]=e}return b},x=new v("fragmentShader"),w=new v("vertexShader"),b=Object.assign(function(e){return e&&d(e),b},{defines:e=>(m.defines?Object.assign(m.defines,e):m.defines=e,b),uniforms:e=>(w.uniforms(e),x.uniforms(e),b),varying:function(e){let t="";if("string"==typeof e)t=e;else{let n=[];for(let[t,r]of Object.entries(e))n.push("varying ".concat(r," ").concat(t,";"));t=n.join("\n")}return w.top(t),x.top(t),b},vertex:w,fragment:x,header:e=>(x.header(e),w.header(e),b),clean:()=>(x.clean(),w.clean(),b),with:d,wrap:(e,t)=>(e.onBeforeCompile=e=>{m=e},e)}),y=new i.Ilk;function P(e){let{r:t,g:n,b:r}=y.set(e);return"vec3(".concat(t.toFixed(3),", ").concat(n.toFixed(3),", ").concat(r.toFixed(3),")")}function k(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new i.Pa4;if("number"==typeof e)return t.set(e,e,e);if(Array.isArray(e)){let[n,r,o=0]=e;return t.set(n,r,o)}if("width"in e){let{width:n,height:r,depth:o}=e;return t.set(n,r,o)}let{x:n,y:r,z:o=0}=e;return t.set(n,r,o)}new i.Pa4,new i.USm,new i.Pa4,new i._fP,new i.Pa4(0,0,0),new i.USm(0,0,0,"XYZ"),new i.Pa4(1,1,1);let T={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,rotationOrder:"XYZ",scaleX:1,scaleY:1,scaleZ:1,scaleScalar:1,visible:!0};function S(e,t){let{x:n,y:r,z:o,position:a=new i.Pa4(n,r,o),rotationX:l,rotationY:s,rotationZ:c,rotationOrder:p,rotation:m=new i.USm(l,s,c,p),scaleX:d,scaleY:f,scaleZ:h,scaleScalar:u,scale:g=new i.Pa4(d,f,h).multiplyScalar(u),visible:v}={...T,...t};return k(a,e.position),function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new i.USm;if(Array.isArray(e)){let[n,r,o,a="XYZ"]=e;return t.set(n,r,o,a)}let{x:n,y:r,z:o,order:a="XYZ",useDegree:l=!1}=e,s=l?Math.PI/180:1;t.set(n*s,r*s,o*s,a)}(m,e.rotation),k(g,e.scale),e.visible=v,e}var C=n(3424),W=n(8470),j=n(519);let V={vecX:["float","vec2","vec3","vec4"]},A=(e,t)=>{let n=[],r=Array.isArray(e)?e:[e].map(e=>e in V?V[e]:e).flat();if("function"==typeof t)for(let e of r)n.push(t(e).replaceAll(/\bT\b/g,e));else for(let e of r)n.push(t.replaceAll(/\bT\b/g,e));return n.join("\n")},z="\n\nstruct FloatRamp {\n  float a;\n  float b;\n  float t;\n};\n\nstruct Vec2Ramp {\n  vec2 a;\n  vec2 b;\n  float t;\n};\n\nstruct Vec3Ramp {\n  vec3 a;\n  vec3 b;\n  float t;\n};\n\nstruct Vec4Ramp {\n  vec4 a;\n  vec4 b;\n  float t;\n};\n\n".concat(A("vecX",e=>{let t=e[0].toUpperCase()+e.slice(1)+"Ramp";return"\n\n".concat(t," ramp(float t, T a, T b) {\n  return ").concat(t,"(a, b, t);\n}\n\n").concat(t," ramp(float t, T a, T b, T c) {\n  if (t < .5) {\n    return ").concat(t,"(a, b, t * 2.0);\n  } else {\n    return ").concat(t,"(b, c, (t - 0.5) * 2.0);\n  }\n}\n\n").concat(t," ramp(float t, T a, T b, T c, T d) {\n  if (t < .33) {\n    return ").concat(t,"(a, b, t * 3.0);\n  } else if (t < .66) {\n    return ").concat(t,"(b, c, (t - 0.33) * 3.0);\n  } else {\n    return ").concat(t,"(c, d, (t - 0.66) * 3.0);\n  }\n}\n\n").slice(1,-1)})),I="\n#ifndef GLSL_RAMP\n#define GLSL_RAMP\n".concat(C.i,"\n").concat(z,"\n#endif\n"),M={white:"#ffffff",notSoWhite:"#f1f3e2",yellow:"#ffff00",black:"#200320",red:"#c00b0b"};class O extends i.Kj0{constructor(e){let{radius:t,thickness:n,align:r,innerRadiusRatio:o,color:a,shaded:l,...s}={...O.defaultProps,...e},c=t-n*r,p=t+n*(1-r);o&&(c=t*o,p=t),super(new i.o8S(c,p,128),l?new i.EJi({color:a,side:i.ehD}):new i.vBJ({color:a,side:i.ehD})),S(this,s)}}O.defaultProps={color:M.black,radius:1.3,align:.5,thickness:.3,innerRadiusRatio:null,shaded:!0};class E extends i.Kj0{constructor(e){let{radius:t,thickness:n,align:r,innerRadiusRatio:o,color:a,shaded:l,...s}={...O.defaultProps,...e},c=t-n*r,p=t+n*(1-r);o&&(c=t*o,p=t),super(new i.XvJ((c+p)/2,(p-c)/2,128,512),l?new i.EJi({color:a,side:i.ehD}):new i.vBJ({color:a,side:i.ehD})),S(this,s)}}class F extends O{constructor(e){super(e),this.material.onBeforeCompile=e=>b.with(e).defines({USE_UV:""}).fragment.top(I).fragment.after("map_fragment","\n      vec2 p = vUv - 0.5;\n      float alpha = atan(p.y, p.x) / 6.2831853;\n      alpha = 1.0 - mod(alpha + 0.0, 1.0);\n      Vec3Ramp r = ramp(alpha,\n        ".concat(P(M.black),",\n        ").concat(P(M.white),",\n        ").concat(P(M.yellow),");\n      diffuseColor.rgb = mix(r.a, r.b, easeInOut4(r.t));\n    "))}}class B extends i.x12{constructor(e,t){let n=new i.u9r;n.setAttribute("position",new i.a$l([1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],3)),n.computeBoundingSphere(),super(n,new i.nls({fog:!1})),this.light=e,this.color=t,this.type="RectAreaLightHelper";let r=new i.u9r;r.setAttribute("position",new i.a$l([1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],3)),r.computeBoundingSphere(),this.add(new i.Kj0(r,new i.vBJ({side:i._Li,fog:!1})))}updateMatrixWorld(){if(this.scale.set(.5*this.light.width,.5*this.light.height,1),void 0!==this.color)this.material.color.set(this.color),this.children[0].material.color.set(this.color);else{this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);let e=this.material.color,t=Math.max(e.r,e.g,e.b);t>1&&e.multiplyScalar(1/t),this.children[0].material.color.copy(this.material.color)}this.matrixWorld.extractRotation(this.light.matrixWorld).scale(this.scale).copyPosition(this.light.matrixWorld),this.children[0].matrixWorld.copy(this.matrixWorld)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}class R extends i.ZAu{constructor({debug:e=!1}={}){super(),this.name="lights";let t=new i.vmT("#dbebf0","#645d61",1);this.add(t);let n=new i.T_f("#e8e6d3",1.1);n.position.set(3,3,3),n.width=16,n.height=16,n.lookAt(0,0,0),this.add(n),e&&this.add(new B(n));let r=new i.Mig("#f2f0dd",.8);this.add(r)}}function U(e){let{precision:t=3}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=0,r=0,o=0;function a(){return"vec3(".concat(n.toFixed(t),", ").concat(r.toFixed(t),", ").concat(o.toFixed(t),")")}switch(typeof e){case"number":return n=(e>>16&255)/255,r=(e>>8&255)/255,o=(255&e)/255,a();case"string":if(e.startsWith("#")){if(4===e.length)return n=parseInt(e[1]+e[1],16)/255,r=parseInt(e[2]+e[2],16)/255,o=parseInt(e[3]+e[3],16)/255,a();return U(parseInt(e.slice(1),16),{precision:t})}throw Error("Invalid string: ".concat(e));case"object":if(Array.isArray(e))return[n,r,o]=e,a();if("r"in e)return n=e.r,r=e.g,o=e.b,a();if("x"in e)return n=e.x,r=e.y,o=e.z,a();throw Error("Invalid object: ".concat(e))}return"vec3(1.0, 0.0, 1.0)"}W.UM;let D="\n  ".concat(i.WdD.cube_uv_reflection_fragment,"\n\n  varying vec3 vPosition;\n  varying vec3 vWorldNormal;\n\n  struct Plane {\n    vec3 origin;\n    vec3 normal;\n  };\n\n  const Plane p1 = Plane(\n    vec3(0.19, 0.0, 0.0),            // origin\n    normalize(vec3(-1.0, 1.0, 0.0))   // normal\n  );\n  \n  const Plane p2 = Plane(\n    vec3(0.6, 0.0, 0.0),            // origin\n    normalize(vec3(1.0, -1.0, 0.0))   // normal\n  );\n  \n  float signedDistanceToPlane(vec3 p, vec3 origin, vec3 normal) {\n    return dot(normalize(normal), p - origin);\n  }\n\n  vec3 checker3(vec3 position, float scale, float edgeWidth, vec3 color1, vec3 color2) {\n    // Scale the position to control the size of the checker cubes\n    vec3 scaledPos = position / scale;\n\n    // Get the integer part (checker grid location)\n    vec3 checkerPos = floor(scaledPos);\n\n    // Get the fractional part (inside each cube)\n    vec3 fractPos = fract(scaledPos);\n\n    // Calculate the checkerboard pattern (even/odd cubes)\n    float checkerSum = mod(checkerPos.x + checkerPos.y + checkerPos.z, 2.0);\n\n    // Smooth transition using smoothstep on the fractional position\n    float edgeX = smoothstep(0.0, edgeWidth, fractPos.x);\n    float edgeY = smoothstep(0.0, edgeWidth, fractPos.y);\n    float edgeZ = smoothstep(0.0, edgeWidth, fractPos.z);\n\n    // Combine the edges to create a smooth transition\n    float blend = edgeX * edgeY * edgeZ;\n    blend = smoothstep(0.0, edgeWidth, min(min(fractPos.x, fractPos.y), fractPos.z));\n    \n    // Interpolate between black and white with the smoothstep value\n    vec3 baseColor = checkerSum == 0.0 ? color1 : color2;\n    vec3 oppositeColor = checkerSum == 0.0 ? color2 : color1;\n\n    // Use the smooth transition to blend between colors\n    return mix(baseColor, oppositeColor, blend);\n  }\n\n  float sphereGrid(vec3 position, float scale, float edgeWidth) {\n    // Scale the position to control the size of the checker cubes\n    vec3 scaledPos = position / scale;\n\n    // Get the integer part (checker grid location)\n    vec3 checkerPos = floor(scaledPos);\n\n    // Get the fractional part (inside each cube)\n    vec3 fractPos = fract(scaledPos);\n\n    vec3 p = fractPos - 0.5;\n    float alpha = 1.0 - length(p) * 2.0;\n\n    return smoothstep(0.0, edgeWidth, alpha - 0.1);    \n  }\n\n  void main() {\n    float d1 = signedDistanceToPlane(vWorldNormal, p1.origin, p1.normal);\n    float d2 = signedDistanceToPlane(vWorldNormal, p2.origin, p2.normal);\n    float d3 = signedDistanceToPlane(vWorldNormal, -p1.origin, -p1.normal);\n    float alpha = smoothstep(0.0, 0.001, d1) * smoothstep(0.0, 0.001, d3) + smoothstep(0.0, 0.001, d2);\n    gl_FragColor.rgb = mix(").concat(U(M.black),", ").concat(U(M.red),", alpha);\n    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.33));\n    gl_FragColor.a = 1.0;\n\n    // float x = sphereGrid(vPosition, 1.0, 0.01);\n    // gl_FragColor.rgb = mix(").concat(U(M.black),", ").concat(U(M.red),", x);\n    // gl_FragColor.rgb = checker3(vPosition, 1.0, 0.1, ").concat(U(M.black),", ").concat(U(M.red),");\n  }\n");class L extends i.Kj0{constructor(){super(new i.DvJ(11,11,11),new i.jyz({depthWrite:!1,side:i._Li,vertexShader:"\n  varying vec3 vWorldNormal;\n  varying vec3 vPosition;\n\n  vec3 rotate(mat4 m, vec3 v) {\n    return vec3(\n      dot(v, vec3(m[0][0], m[1][0], m[2][0])),  // X component\n      dot(v, vec3(m[0][1], m[1][1], m[2][1])),  // Y component\n      dot(v, vec3(m[0][2], m[1][2], m[2][2]))   // Z component\n    );\n  }\n\n  void main() {\n    vPosition = position;\n    vWorldNormal = normalize(rotate(modelMatrix, position));\n\n    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    // Ignore the position, we only need the normal:\n    gl_Position = projectionMatrix * vec4(rotate(modelViewMatrix, position), 1.0);\n  }\n",fragmentShader:D,uniforms:{}})),this.renderOrder=-1,this.name="sky"}}var J=n(558);let X="\n  ".concat(J.l,"\n\n  float sin01(float x) {\n    return 0.5 + 0.5 * sin(x * 6.283185307179586);\n  }\n\n  vec2 scaleAround(vec2 p, vec2 c, float s) {\n    return c + (p - c) / s;\n  }\n\n  // Same as mix, but clamped.\n  ").concat(A("vecX","\n    T lerp(in T a, in T b, in float x) {\n      return mix(a, b, clamp01(x));\n    }\n  "),"\n\n  float inverseLerpUnclamped(in float a, in float b, float x) {\n    return (x - a) / (b - a);\n  }\n\n  float inverseLerp(in float a, in float b, float x) {\n    return clamp01((x - a) / (b - a));\n  }\n\n  float threshold(in float x, in float thresholdValue) {\n    return x < thresholdValue ? 0. : 1.;\n  }\n\n  float threshold(in float x, in float thresholdValue, in float width) {\n    return width < 1e-9 \n      ? (x < thresholdValue ? 0. : 1.)\n      : clamp01((x - thresholdValue + width * .5) / width);\n  }\n\n  mat3 extractRotation(mat4 matrix) {\n    return mat3(matrix[0].xyz, matrix[1].xyz, matrix[2].xyz);\n  }\n\n  vec2 rotate(vec2 p, float a) {\n    float c = cos(a);\n    float s = sin(a);\n    float x = c * p.x + s * p.y;\n    float y = -s * p.x + c * p.y;\n    return vec2(x, y);\n  }\n\n  vec2 rotateAround(vec2 p, float a, vec2 c) {\n    return c + rotate(p - c, a);\n  }\n\n  vec2 rotateScaleAround(vec2 p, float a, float s, vec2 c) {\n    return c + rotate((p - c) / s, a);\n  }\n  \n  float positiveModulo(float x) {\n    x = mod(x, 1.0);\n    return x < 0.0 ? x + 1.0 : x;\n  }\n\n  float positiveModulo(float x, float modulo) {\n    x = mod(x, modulo);\n    return x < 0.0 ? x + modulo : x;\n  }\n\n  // Limit a value to a maximum that the function tends to reach when x -> ∞\n  // https://www.desmos.com/calculator/0vewkbnscu\n  float limited(float x, float maxValue) {\n    return x <= 0.0 ? x : maxValue * x / (maxValue + x);\n  }\n\n  // https://www.desmos.com/calculator/0vewkbnscu\n  float limited(float x, float minValue, float maxValue) {\n    float d = maxValue - minValue;\n    float xd = x - minValue;\n    return x <= minValue ? x : minValue + d * xd / (d + xd);\n  }\n\n  float sqLength(in vec2 p) {\n    return p.x * p.x + p.y * p.y;\n  }\n\n  float sqLength(in vec3 p) {\n    return p.x * p.x + p.y * p.y + p.z * p.z;\n  }\n\n  ").concat(A("vecX","\n    T min3(in T a, in T b, in T c) {\n      return min(min(a, b), c);\n    }\n  "),"\n\n  ").concat(A("vecX","\n    T min4(in T a, in T b, in T c, in T d) {\n      return min(min(a, b), min(c, d));\n    }\n  "),"\n");console.log("glsl_ramp",I.slice(0,10));class Z extends i.Kj0{constructor(e){let{radius:t,...n}={...Z.defaultProps,...e},r=new i.cJO(t,18),o=new i.EJi;o.onBeforeCompile=e=>b.with(e).defines({USE_UV:""}).fragment.top(I).fragment.after("map_fragment","\n        vec2 p = vUv - 0.5;\n        float alpha = vUv.y;\n        Vec3Ramp r = ramp(alpha, ".concat(P(M.black),", ").concat(P(M.white),", ").concat(P(M.yellow),");\n        diffuseColor.rgb = mix(r.a, r.b, easeInOut4(r.t));\n      ")),super(r,o),S(this,n)}}Z.defaultProps={radius:1};class N{set(e){this.props={...this.props,...e},this.props.center=this.props.center.clone(),this.props.normal=this.props.normal.clone().normalize(),this.props.binormal=this.props.binormal.clone().normalize()}update(e){let{radius:t,turnVelocity:n,turn:r,center:o,normal:a,binormal:i}=this.props,l=r+n*e;this.props.turn=l,this.target.position.copy(o).addScaledVector(a,t*Math.cos(l*Math.PI*2)).addScaledVector(i,t*Math.sin(l*Math.PI*2))}constructor(e,t){this.target=e,this.set({...N.defaultProps,...t})}}N.defaultProps={center:new i.Pa4,normal:new i.Pa4(1,0,0),binormal:new i.Pa4(0,1,0),radius:1,turnVelocity:1,turn:0};class K extends i.Kj0{get satellite(){var e;return null!==(e=this._satellite)&&void 0!==e?e:this._satellite=new N(this)}constructor(e){let{radius:t,singleColor:n,emmissiveIntensity:r,lerpIn:o,lerpOut:a,...l}={...K.defaultProps,...e},{colorTop:s=null!=n?n:K.defaultProps.colorTop,colorBottom:c=null!=n?n:K.defaultProps.colorBottom}={...e},p=new i.cJO(t,12),m=new i.EJi({color:s,emissive:c});m.onBeforeCompile=e=>{b.with(e).defines({USE_UV:""}).uniforms({uLerpIn:{value:o},uLerpOut:{value:a},uColorTop:{value:new i.Ilk(s)},uColorBottom:{value:new i.Ilk(c)}}).fragment.top(C.i,X).fragment.mainBeforeAll("\n          float alpha = inverseLerp(uLerpIn, uLerpOut, vUv.y);\n          vec3 sphereColor = mix(uColorBottom, uColorTop, easeInOut10(alpha));\n        ").fragment.after("map_fragment","\n          diffuseColor.rgb = sphereColor;\n        ").fragment.after("emissivemap_fragment","\n          totalEmissiveRadiance.rgb = sphereColor * ".concat(r.toFixed(2),";\n        "))},super(p,m),this._satellite=null,S(this,l)}}K.defaultProps={radius:.225,singleColor:null,colorTop:M.white,colorBottom:M.yellow,emmissiveIntensity:.25,lerpIn:.4,lerpOut:.6};class Y extends i.Kj0{constructor(e){let t=new i.cJO(.4,12),n=new i.EJi({});n.onBeforeCompile=e=>b.with(e).varying({vWorldPosition:"vec3",vNormalWorld:"vec3",vViewDir:"vec3"}).vertex.mainAfterAll("\n      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;\n      vNormalWorld = normalize(mat3(modelMatrix) * normal);\n      vViewDir = normalize(cameraPosition - vWorldPosition);\n    ").fragment.top(C.i).fragment.after("map_fragment","\n      float fresnel = dot(vNormalWorld, vViewDir);\n      vec3 inner = ".concat(P(M.white),";\n      vec3 outer = ").concat(P(M.black),";\n      diffuseColor.rgb = mix(inner, outer, easeInOut(1.0 - fresnel * fresnel, 2.0, 0.0));\n    ")),super(t,n),S(this,e)}}class G extends i.Kj0{constructor(e){let{color:t,thickness:n,length:r,shaded:o,...a}={...G.defaultProps,...e};super(new i.fHI(n/2,n/2,r,12,1).rotateZ(.5*Math.PI),o?new i.EJi({color:t}):new i.vBJ({color:t})),S(this,a)}}function*$(e){var t,n;let r=yield*function*(e){let{camera:t,ticker:n,scene:r}=e;t.fov=25,t.updateProjectionMatrix(),t.position.set(0,0,10),n.set({activeDuration:180});let o=new i.ZAu;return r.add(o),yield()=>{console.log("remove"),o.removeFromParent()},o}(e);for(let{i:t}of(r.add(new L),r.add(new R),r.add(new Z),r.add(new F({z:-1,radius:1.4,innerRadiusRatio:.805})),r.add(new E({z:-1,radius:1.05,thickness:.01,color:M.notSoWhite})),r.add(new E({z:-1,radius:.7,thickness:.01,color:M.notSoWhite})),j.T.seed(6789402),function*(e){let t=0,n={get i(){return t},get t(){return t/8},get count(){return 8}};for(;t<8;t++)yield n}(8))){let n=new K({z:-1,radius:.1,colorTop:j.T.pick(M),colorBottom:j.T.pick(M)});n.rotation.set(j.T.between(2*Math.PI),j.T.between(2*Math.PI),j.T.between(2*Math.PI)),r.add(n),n.satellite.set({radius:0===t?.875:j.T.between(.25,.75)*(0,W.t7)(1,1.5,t),center:new i.Pa4(0,0,-1-.4*t),turnVelocity:j.T.between(.05,.25)}),yield e.ticker.onTick(e=>{n.satellite.update(e.deltaTime)})}let o=new i.ZAu;o.rotation.z=-.25*Math.PI,r.add(o),o.add(new K({x:-1.5,z:.5,singleColor:M.yellow})),o.add(new E({x:-1.81,radius:.1,thickness:.01,color:M.notSoWhite}));let a=(t=new E({x:-2.315,radius:.2,thickness:.01,color:M.notSoWhite}),o.add(t),t);n=new G({x:-.2,thickness:.01,length:.4,shaded:!0,color:M.notSoWhite}),a.add(n),o.add(new K({x:1.7,z:.5,lerpIn:.3,lerpOut:.7})),o.add(new K({x:1.4,radius:.1,singleColor:M.black})),o.add(new Y({x:2.3})),o.add(new G({x:1.5}));let l=new i.ZAu;l.rotation.z=.25*Math.PI,r.add(l),l.add(new G({x:-1.6,thickness:.01,length:.35,shaded:!0,color:M.notSoWhite})),l.add(new G({x:1.6,thickness:.01,length:.35,shaded:!0,color:M.notSoWhite}));let s=new i.ZAu;s.rotation.y=.5*Math.PI,r.add(s),s.add(new G({x:-1.2,thickness:.01,length:.35,shaded:!0,color:M.notSoWhite})),s.add(new G({x:1.2,thickness:.01,length:.35,shaded:!0,color:M.notSoWhite}))}function q(){return(0,r.jsx)("div",{className:"wraps",children:(0,r.jsx)(o.V,{children:(0,r.jsx)(a.hR,{children:(0,r.jsx)(a.kB,{fn:$})})})})}G.defaultProps={color:M.black,thickness:.018,shaded:!1,length:1}}}]);