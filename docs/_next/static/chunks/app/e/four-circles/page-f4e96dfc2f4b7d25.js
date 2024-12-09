(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8099],{83711:function(n,e,t){Promise.resolve().then(t.bind(t,71034))},71034:function(n,e,t){"use strict";t.d(e,{Main:function(){return P}});var r,o,a=t(32617),i=t(62274),l=t(29368),c=t(5693),s=t(92948),u=t(47365),f=t(88780),x=t(67896),p=t(78780),d=t(28104),v=t(23420),m=t(85705);(r=o||(o={})).MoveTo="moveTo",r.LineTo="lineTo";class h extends f.Group{clear(){let{lines:n}=this.parts;return n.count=0,n.instanceMatrix.array=new Float32Array(0),n.instanceMatrix.needsUpdate=!0,this}moveTo(){for(var n=arguments.length,e=Array(n),t=0;t<n;t++)e[t]=arguments[t];let[r,o]=1===e.length?[e[0].x,e[0].y]:e;return this.commands.push({type:"moveTo",x:r,y:o,z:0,w:1}),this}lineTo(){for(var n=arguments.length,e=Array(n),t=0;t<n;t++)e[t]=arguments[t];let[r,o]=1===e.length?[e[0].x,e[0].y]:e;return this.commands.push({type:"lineTo",x:r,y:o,z:0,w:1}),this}draw(){let{lines:n}=this.parts,{thickness:e,commands:t}=this,r=new Float32Array(16*t.length),o=0;for(let[n,{type:a,x:i,y:l}]of t.entries())if("lineTo"===a){let a=t[n-1],c=i-a.x,s=l-a.y,u=a.x+c/2,f=a.y+s/2,x=Math.sqrt(c*c+s*s),p=Math.atan2(s,c);(0,m.$)({x:u,y:f,rotationZ:p,scaleX:x,scaleY:e}).toArray(r,16*o),o++}return n.count=o,n.instanceMatrix.array=r.slice(0,16*o),n.instanceMatrix.needsUpdate=!0,this}constructor(...n){super(...n),this.thickness=.01,this.parts=(()=>{let n=new f.PlaneGeometry(1,1),e=new f.MeshBasicMaterial;return{lines:(0,p.cY)(new f.InstancedMesh(n,e,0),this)}})(),this.commands=[]}}var y=t(23247),w=t(99963),g=t(30686),b=t(1976);let C=new f.PlaneGeometry(4,4);new f.IcosahedronGeometry(1,12);class z extends f.Group{constructor(...n){super(...n),this.parts=(()=>{let n=["#95c3fb","#fcff99","#0a1521"].map(n=>new f.Color(n)),e=new f.MeshBasicMaterial,t={uTime:l.vB.get("three").uTime,uTimeCycleOffset:{value:0},uColors:{value:n}};e.onBeforeCompile=n=>y.b.with(n).uniforms(t).defines({USE_UV:""}).varying({vWorldPosition2:"vec3"}).vertex.mainAfterAll("\n        vWorldPosition2 = (modelMatrix * vec4(position, 1.0)).xyz;\n      ").fragment.top("\n\n  // Inigo Quilez\n  // https://iquilezles.org/articles/distfunctions2d/\n\n  // Circle - exact   (https://www.shadertoy.com/view/3ltSW2)\n  float sdCircle( vec2 p, float r )\n  {\n    return length(p) - r;\n  }\n\n  // Rounded Box - exact   (https://www.shadertoy.com/view/4llXD7 and https://www.youtube.com/watch?v=s5NGeUV2EyU)\n  float sdRoundedBox( in vec2 p, in vec2 b, in vec4 r )\n  {\n    r.xy = (p.x>0.0)?r.xy : r.zw;\n    r.x  = (p.y>0.0)?r.x  : r.y;\n    vec2 q = abs(p)-b+r.x;\n    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;\n  }\n\n  // Box - exact   (https://www.youtube.com/watch?v=62-pRVZuS5c)\n  float sdBox( in vec2 p, in vec2 b )\n  {\n    vec2 d = abs(p)-b;\n    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);\n  }\n\n  // Segment - exact   (https://www.shadertoy.com/view/3tdSDj and https://www.youtube.com/watch?v=PMltMdi1Wzg)\n  float sdSegment( in vec2 p, in vec2 a, in vec2 b )\n  {\n    vec2 pa = p-a, ba = b-a;\n    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );\n    return length( pa - ba*h );\n  }\n\n  // Arc - exact   (https://www.shadertoy.com/view/wl23RK)\n  float sdArc( in vec2 p, in vec2 sc, in float ra, float rb )\n  {\n    // sc is the sin/cos of the arc's aperture\n    p.x = abs(p.x);\n    return ((sc.y*p.x>sc.x*p.y) ? length(p-sc*ra) : \n                                  abs(length(p)-ra)) - rb;\n  }\n\n  float opRound( in float d, in float r )\n  {\n    return d - r;\n  }\n\n  float opOnion( in float d, in float r )\n  {\n    return abs(d) - r;\n  }\n",g.v,b.U,w.i).fragment.top("\n        float globalNoise;\n        void computeGlobalNoise() {\n          globalNoise = fnoise(vec3(vWorldPosition2.xy * 0.5, uTime * 0.01), 8, 0.8);\n        }\n        float radius() {\n          return 0.75;\n        }\n        vec2 point() {\n          return (vUv - 0.5) * 2.0;\n        }\n        float time() {\n          return uTime * 0.05 + uTimeCycleOffset * 1.0;\n        }\n        float noisyBox() {\n          return sdBox(point(), vec2(radius())) + globalNoise * 0.1 * sin01(time());\n        }\n        float noisyCircle() {\n          return length(point()) - radius() + globalNoise * 0.3 * sin01(time());\n        }\n      ").fragment.mainBeforeAll("\n        computeGlobalNoise();\n      ").fragment.after("color_fragment","\n        float d = sdBox(point(), vec2(radius()));\n        float d2 = sin01(time());\n        d2 *= 0.1;\n        vec3 color = mix(uColors[0], uColors[1], smoothstep(0.001, 0.0, noisyBox()));\n\n        float nc = noisyCircle();\n        vec3 circleColor = mix(uColors[1], uColors[2], mix(0.25, 1.0, easeInOut2(inverseLerpUnclamped(-radius(), 0.0, nc))));\n        color = mix(color, circleColor, smoothstep(0.001, 0.0, nc));\n        diffuseColor.rgb = color;\n      ");let r=new f.Mesh(C,e);return this.add(r),{plane:r,planeUniforms:t,colors:n}})()}}class M extends f.Group{constructor(...n){super(...n),this.parts=(()=>{let n=(0,p.cY)(new h,this);n.position.z=1,n.thickness=.0125,n.parts.lines.material.color.set("#15093e"),n.parts.lines.material.color.set("#95c3fb");let e=new v.Ae(0,0).applyPadding(4.1+.05,"grow"),t=new v.Ae(0,0).applyPadding(6.25,"grow");for(let{t:r}of(0,d.loop)(60)){let o=(r+.5/60)*Math.PI*2,a=Math.cos(o),i=Math.sin(o),l=e.raycast(0,0,a,i).getPointMin(),c=t.raycast(0,0,a,i).getPointMin();n.moveTo(l).lineTo(c)}return n.draw(),{lines:n}})()}}function A(){return(0,c._v)("four-circles",function*(n){(0,p.cY)(new x.w({color:"#e1dff1"}),n),(0,p.cY)(n,{rotationZ:"45deg"}),(0,p.cY)(new M,{parent:n}),(0,p.cY)(new z,{parent:n,position:[2.0175,2.0175,0]},n=>{n.parts.planeUniforms.uTimeCycleOffset.value=0,n.parts.colors[1].set("#fcff99"),n.parts.colors[2].set("#170551")}),(0,p.cY)(new z,{parent:n,position:[2.0175,-2.0175,0]},n=>{n.parts.planeUniforms.uTimeCycleOffset.value=.25,n.parts.colors[1].set("#18188c"),n.parts.colors[2].set("#72d9ab")}),(0,p.cY)(new z,{parent:n,position:[-2.0175,-2.0175,0]},n=>{n.parts.planeUniforms.uTimeCycleOffset.value=.5,n.parts.colors[1].set("#f3a3b3"),n.parts.colors[2].set("#15093e")}),(0,p.cY)(new z,{parent:n,position:[-2.0175,2.0175,0]},n=>{n.parts.planeUniforms.uTimeCycleOffset.value=.75,n.parts.colors[1].set("#3b3426"),n.parts.colors[2].set("#de2566")}),(0,p.cY)(new z,{parent:n,scaleScalar:4,position:[0,0,-1]},n=>{n.parts.planeUniforms.uTimeCycleOffset.value=.75,n.parts.colors[0].set("#e1dff1"),n.parts.colors[1].set("#95c3fb"),n.parts.colors[2].set("#170551")})},[]),null}function T(){return(0,c.Ky)(function*(n){(0,s.a)({three:n});let e=new i.F({size:12.2,perspective:0});yield e.start(n.renderer.domElement),l.vB.get("three").set({minActiveDuration:60}),yield(0,l.RC)("three",t=>{let{aspect:r,camera:o}=n;e.update(o,r,t.deltaTime)}),yield(0,u.p)([[{code:"Space",modifiers:"shift"},()=>{document.body.requestFullscreen()}]])},[]),null}function P(){return(0,a.jsx)("div",{children:(0,a.jsxs)(c.H7,{children:[(0,a.jsx)(T,{}),(0,a.jsx)(A,{})]})})}},62411:function(n,e,t){"use strict";t.d(e,{v:function(){return o}});let r="/three-xp/assets/",o={development:!1,assetsPath:r,assets:function(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return"".concat(r).concat(n)}}},5693:function(n,e,t){"use strict";t.d(e,{H7:function(){return d},Ky:function(){return f},_v:function(){return x}});var r=t(32617),o=t(87200),a=t(88780),i=t(23657),l=t(9258),c=t(62411),s=t(74707);let u=(0,o.createContext)(null);function f(n,e){let t=(0,o.useContext)(u);return(0,i.sv)(async function*(e,r){if(n){let e=n(t,r);if(e&&"function"==typeof e.next)do{let{value:n,done:t}=await e.next();if(t)break;yield n}while(r.mounted)}},null!=e?e:"always"),t}function x(n,e,t){let r=(0,o.useMemo)(()=>new a.Group,[]);return r.name=n,f(async function*(n,t){if(n.scene.add(r),yield()=>{r.clear(),r.removeFromParent()},e){let o=e(r,n,t);if(o&&"function"==typeof o.next)do{let{value:n,done:e}=await o.next();if(e)break;yield n}while(t.mounted)}},t),r}function p(n){let{children:e,className:t}=n,s=(0,o.useMemo)(()=>new l.Vu,[]),{ref:f}=(0,i.sv)(function*(n){s.loader.setPath(c.v.assetsPath),yield s.initialize(n),Object.assign(window,{three:s,THREE:a})},[]);return(0,r.jsx)("div",{ref:f,className:"ThreeProvider absolute-through ".concat(null!=t?t:""),children:(0,r.jsx)(u.Provider,{value:s,children:e})})}function d(n){return(0,s.O)()&&(0,r.jsx)(p,{...n})}},74707:function(n,e,t){"use strict";t.d(e,{O:function(){return o}});var r=t(87200);function o(){let[n,e]=(0,r.useState)(!1);return(0,r.useLayoutEffect)(()=>{e(!0)},[]),n}},92948:function(n,e,t){"use strict";t.d(e,{Leak:function(){return c},a:function(){return l}});var r=t(88780),o=t(90118),a=t(58100),i=t(6246);function l(n){Object.assign(window,{...r,...a,...o,...n,PRNG:i.T})}function c(n){return l(n),null}},47365:function(n,e,t){"use strict";function r(n,e){return"*"===e||("string"==typeof e?e===n:e instanceof RegExp?e.test(n):"function"==typeof e&&e(n))}t.d(e,{p:function(){return i}});let o={preventDefault:!1,strictTarget:void 0},a={key:"*",keyCaseInsensitive:!0,code:"*",noModifiers:!1,modifiers:""};function i(){for(var n=arguments.length,e=Array(n),t=0;t<n;t++)e[t]=arguments[t];let[i,l,c]=1===e.length?[document.body,{},e[0]]:2===e.length?[e[0],{},e[1]]:e,{preventDefault:s}={...o,...l},u=n=>{var e;if((null!==(e=l.strictTarget)&&void 0!==e?!!e:i===document.body)&&n.target!==i)return;let{ctrlKey:t,altKey:o,shiftKey:u,metaKey:f}=n,x={event:n,modifiers:{ctrl:t,alt:o,shift:u,meta:f}};for(let e=0,i=c.length;e<i;e++){let[i,l]=c[e],{key:p,keyCaseInsensitive:d,code:v,noModifiers:m,modifiers:h}=function(n){let e="string"==typeof n?{...a,key:n}:{...a,...n};return e.keyCaseInsensitive&&"string"==typeof e.key&&(e.key=e.key.toLowerCase()),e}(i);Object.values({key:r(d?n.key.toLowerCase():n.key,p),code:r(n.code,v),noModifiers:!m||!1===t&&!1===o&&!1===u&&!1===f,modifiers:function(n,e){let{ctrlKey:t,altKey:r,shiftKey:o,metaKey:a}=n;if("function"==typeof e)return e({ctrl:t,alt:r,shift:o,meta:a});let{ctrl:i=!1,alt:l=!1,shift:c=!1,meta:s=!1}=Object.fromEntries(e.split("-").map(n=>[n,!0]));return i===t&&l===r&&c===o&&s===a}(n,h)}).every(Boolean)&&(s&&n.preventDefault(),l(x))}};return i.addEventListener("keydown",u,{passive:!1}),{destroy:()=>{i.removeEventListener("keydown",u)}}}},67896:function(n,e,t){"use strict";t.d(e,{w:function(){return a}});var r=t(88780);let o=new r.IcosahedronGeometry(1,4);class a extends r.Mesh{constructor(n){super(o,new r.MeshBasicMaterial({color:"#0c529d",...n,side:r.BackSide,depthWrite:!1,depthTest:!1})),this.renderOrder=-1,this.frustumCulled=!1,this.matrixAutoUpdate=!1,this.onBeforeRender=(n,e,t)=>{let r=(t.near+t.far)/2;this.position.copy(t.position),this.scale.setScalar(r),this.updateMatrix(),this.updateMatrixWorld()}}}},85705:function(n,e,t){"use strict";t.d(e,{$:function(){return i},E:function(){return c}});var r=t(88780),o=t(32219);let a=new r.Matrix4;function i(n){return(0,o.Xe)(n,a)}let l=new r.Color;function c(n){return l.set(n)}},7876:function(n,e,t){"use strict";t.d(e,{l:function(){return r}});let r="\n#ifndef GLSL_BASIC\n#define GLSL_BASIC\n\nfloat clamp01(float x) {\n  return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;\n}\n\n#endif\n"},99963:function(n,e,t){"use strict";t.d(e,{i:function(){return a}});var r=t(7876);let o=["linear"];for(let n=1;n<=10;n++)o.push("easeIn".concat(n)),o.push("easeOut".concat(n)),o.push("easeInOut".concat(n)),o.push("easeOutIn".concat(n));let a="\n#ifndef GLSL_EASING\n#define GLSL_EASING\n\n".concat(r.l,"\n\nfloat easePow1(float x) {\n  return x;\n}\n\nfloat easePow2(float x) {\n  return x * x;\n}\n\nfloat easePow3(float x) {\n  return x * x * x;\n}\n\nfloat easePow4(float x) {\n  x *= x;\n  return x *= x;\n}\n\nfloat easePow5(float x) {\n  float x0 = x;\n  x *= x;\n  x *= x;\n  return x0 * x;\n}\n\nfloat easePow6(float x) {\n  x *= x * x;\n  return x *= x;\n}\n\nfloat easePow7(float x) {\n  float x0 = x;\n  x *= x * x;\n  x *= x;\n  return x0 * x;\n}\n\nfloat easePow8(float x) {\n  x *= x;\n  x *= x;\n  return x *= x;\n}\n\nfloat easePow9(float x) {\n  x *= x * x;\n  return x *= x * x;\n}\n\nfloat easePow10(float x) {\n  float x0 = x;\n  x *= x * x;\n  x *= x * x;\n  return x0 * x;\n}\n\nfloat linear(float x) {\n  return clamp01(x);\n}\n\n").concat(Array.from({length:10},(n,e)=>{let t=e+1;return"\n\nfloat easeIn".concat(t," (float x) {\n  return easePow").concat(t,"(clamp01(x));\n}\nfloat easeOut").concat(t," (float x) {\n  return 1.0 - easePow").concat(t,"(clamp01(1.0 - x));\n}\nfloat easeInOut").concat(t," (float x) {\n  return x < 0.5 \n    ? 0.5 * easePow").concat(t,"(2.0 * x) \n    : 1.0 - 0.5 * easePow").concat(t,"(2.0 * (1.0 - x));\n}\nfloat easeOutIn").concat(t," (float x) {\n  return x < 0.5\n    ? 0.5 * (1.0 - easePow").concat(t,"(1.0 - x * 2.0))\n    : 1.0 - 0.5 * (1.0 - easePow").concat(t,"(2.0 * x - 1.0));\n}\n\n").trim()}).join("\n\n"),"\n\n\n// https://www.desmos.com/calculator/mqou4lf9zc?lang=fr\nfloat easeInOut(float x, float p, float i) {\n  return  x <= 0.0 ? 0.0 :\n          x >= 1.0 ? 1.0 :\n          x <= i ? 1.0 / pow(i, p - 1.0) * pow(x, p) :\n          1.0 - 1.0 / pow(1.0 - i, p - 1.0) * pow(1.0 - x, p);\n}\n\n// https://www.desmos.com/calculator/nrjlezusdv\nfloat easeInThenOut(float x, float p) {\n  return 1.0 - pow(abs(2.0 * x - 1.0), p);\n}\n\n#endif\n")},30686:function(n,e,t){"use strict";t.d(e,{v:function(){return o}});var r=t(18075);let o="\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex \n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20201014 (stegu)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n// \n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+10.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r) {\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\n\n\n\n\n// 2D:\n\nvec3 mod289_2d(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289_2d(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute_2d(vec3 x) {\n  return mod289(((x*34.0)+10.0)*x);\n}\n\n\nfloat snoise(vec2 v) {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289_2d(i); // Avoid truncation effects in permutation\n  vec3 p = permute_2d( permute_2d( i.y + vec3(0.0, i1.y, 1.0 ))\n		+ i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n// 3D: \n\nfloat snoise(vec3 v)\n{ \n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n  // First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n  // Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n  // Permutations\n  i = mod289(i); \n  vec4 p = permute( permute( permute( \n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n  // Gradients: 7x7 points over a square, mapped onto an octahedron.\n  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n  //Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n  // Mix final noise value\n  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \n                                dot(p2,x2), dot(p3,x3) ) );\n}\n\n\n\n\n// addons:\n// Fractal noise, based on Stefan Gustavson's Simplex noise\n".concat((0,r.C)(["vec2","vec3"],"\n  float fnoise(T p, int octaves, float persistence) {\n    float total = 0.0;           // Final noise value\n    float amplitude = 1.0;       // Initial amplitude\n    float frequency = 1.0;       // Initial frequency\n    float maxValue = 0.0;        // Used for normalization\n\n    for (int i = 0; i < octaves; i++) {\n      total += snoise(p * frequency) * amplitude;\n\n      maxValue += amplitude;   // Keep track of max amplitude\n      amplitude *= persistence; // Reduce amplitude for next octave\n      frequency *= 2.0;        // Increase frequency for next octave\n    }\n\n    // Normalize the result to stay within the range [0, 1]\n    return total / maxValue;\n  }\n"),"\n")},18075:function(n,e,t){"use strict";t.d(e,{C:function(){return o}});let r={vecX:["float","vec2","vec3","vec4"]},o=(n,e)=>{let t=[],o=Array.isArray(n)?n:[n].map(n=>n in r?r[n]:n).flat();if("function"==typeof e)for(let n of o)t.push(e(n).replaceAll(/\bT\b/g,n));else for(let n of o)t.push(e.replaceAll(/\bT\b/g,n));return t.join("\n")}},1976:function(n,e,t){"use strict";t.d(e,{U:function(){return a}});var r=t(7876),o=t(18075);let a="\n  ".concat(r.l,"\n\n  float sin01(float x) {\n    return 0.5 + 0.5 * sin(x * 6.283185307179586);\n  }\n\n  vec2 scaleAround(vec2 p, vec2 c, float s) {\n    return c + (p - c) / s;\n  }\n\n  // Same as mix, but clamped.\n  ").concat((0,o.C)("vecX","\n    T lerp(in T a, in T b, in float x) {\n      return mix(a, b, clamp01(x));\n    }\n  "),"\n\n  float inverseLerpUnclamped(in float a, in float b, float x) {\n    return (x - a) / (b - a);\n  }\n\n  float inverseLerp(in float a, in float b, float x) {\n    return clamp01((x - a) / (b - a));\n  }\n\n  float threshold(in float x, in float thresholdValue) {\n    return x < thresholdValue ? 0. : 1.;\n  }\n\n  float threshold(in float x, in float thresholdValue, in float width) {\n    return width < 1e-9 \n      ? (x < thresholdValue ? 0. : 1.)\n      : clamp01((x - thresholdValue + width * .5) / width);\n  }\n\n  mat3 extractRotation(mat4 matrix) {\n    return mat3(matrix[0].xyz, matrix[1].xyz, matrix[2].xyz);\n  }\n\n  vec2 rotate(vec2 p, float a) {\n    float c = cos(a);\n    float s = sin(a);\n    float x = c * p.x + s * p.y;\n    float y = -s * p.x + c * p.y;\n    return vec2(x, y);\n  }\n\n  vec2 rotateAround(vec2 p, float a, vec2 c) {\n    return c + rotate(p - c, a);\n  }\n\n  vec2 rotateScaleAround(vec2 p, float a, float s, vec2 c) {\n    return c + rotate((p - c) / s, a);\n  }\n  \n  float positiveModulo(float x) {\n    x = mod(x, 1.0);\n    return x < 0.0 ? x + 1.0 : x;\n  }\n\n  float positiveModulo(float x, float modulo) {\n    x = mod(x, modulo);\n    return x < 0.0 ? x + modulo : x;\n  }\n\n  // Limit a value to a maximum that the function tends to reach when x -> ∞\n  // https://www.desmos.com/calculator/0vewkbnscu\n  float limited(float x, float maxValue) {\n    return x <= 0.0 ? x : maxValue * x / (maxValue + x);\n  }\n\n  // https://www.desmos.com/calculator/0vewkbnscu\n  float limited(float x, float minValue, float maxValue) {\n    float d = maxValue - minValue;\n    float xd = x - minValue;\n    return x <= minValue ? x : minValue + d * xd / (d + xd);\n  }\n\n  float sqLength(in vec2 p) {\n    return p.x * p.x + p.y * p.y;\n  }\n\n  float sqLength(in vec3 p) {\n    return p.x * p.x + p.y * p.y + p.z * p.z;\n  }\n\n  float pcurve(float x, float a, float b) {\n    float k = pow(a + b, a + b) / (pow(a, a) * pow(b, b));\n    return k * pow(x, a) * pow(1.0 - x, b);\n  }\n\n  float hash(vec3 p) {\n    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);\n  }\n\n  ").concat((0,o.C)("vecX","\n    T min3(in T a, in T b, in T c) {\n      return min(min(a, b), c);\n    }\n  "),"\n\n  ").concat((0,o.C)("vecX","\n    T min4(in T a, in T b, in T c, in T d) {\n      return min(min(a, b), min(c, d));\n    }\n  "),"\n")},90118:function(n,e,t){"use strict";function r(n,e){for(let t of n)if(e(t))return!0;return!1}function o(n,e){for(let t of n)if(!e(t))return!1;return!0}function a(n,e,t){let r=[];function o(n){let e=[];return r[n]=e,e}if(void 0!==t)for(let n=0;n<t;n++)o(n);for(let t of n){var a;let n=e(t);(null!==(a=r[n])&&void 0!==a?a:o(n)).push(t)}return r}t.r(e),t.d(e,{every:function(){return o},some:function(){return r},split:function(){return a}})},28104:function(n,e,t){"use strict";function*r(n){let e=0,t={get i(){return e},get t(){return e/n},get p(){return e/(n-1)},clone(){return{...this}}};for(e=0;e<n;e++)yield t}function o(){for(var n=arguments.length,e=Array(n),t=0;t<n;t++)e[t]=arguments[t];let o=[];for(let n of r(...e))o.push(n.clone());return o}function*a(){for(var n=arguments.length,e=Array(n),t=0;t<n;t++)e[t]=arguments[t];let r=0,o=0;2===e.length?(r=e[0],o=e[1]):Array.isArray(e[0])?(r=e[0][0],o=e[0][1]):(r=e[0].x,o=e[0].y);let a=0,i=0,l=0,c={get i(){return a},get x(){return i},get y(){return l},get tx(){return i/r},get ty(){return l/o},get px(){return i/(r-1)},get py(){return l/(o-1)},clone(){return{...this}}};for(l=0;l<o;l++)for(i=0;i<r;i++)yield c,a++}function i(){for(var n=arguments.length,e=Array(n),t=0;t<n;t++)e[t]=arguments[t];let r=[];for(let n of a(...e))r.push(n.clone());return r}function*l(){for(var n=arguments.length,e=Array(n),t=0;t<n;t++)e[t]=arguments[t];let r=0,o=0,a=0;3===e.length?(r=e[0],o=e[1],a=e[2]):Array.isArray(e[0])?(r=e[0][0],o=e[0][1],a=e[0][2]):(r=e[0].x,o=e[0].y,a=e[0].z);let i=0,l=0,c=0,s=0,u={get i(){return i},get x(){return l},get y(){return c},get z(){return s},get tx(){return l/r},get ty(){return c/o},get tz(){return s/a},get px(){return l/(r-1)},get py(){return c/(o-1)},get pz(){return s/(a-1)},clone(){return{...this}}};for(s=0;s<a;s++)for(c=0;c<o;c++)for(l=0;l<r;l++)yield u,i++}function c(){for(var n=arguments.length,e=Array(n),t=0;t<n;t++)e[t]=arguments[t];let r=[];for(let n of l(...e))r.push(n.clone());return r}t.r(e),t.d(e,{loop:function(){return r},loop2:function(){return a},loop2Array:function(){return i},loop3:function(){return l},loop3Array:function(){return c},loopArray:function(){return o}})},6246:function(n,e,t){"use strict";t.d(e,{T:function(){return s}});let r=function(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(n=(n=(7*n+Math.sqrt(n)+16087*Math.sin(n))%2147483647)<0?n+2147483647:n)>1?2147483647&n:0===n?345678:123456},o=n=>n=2147483647&Math.imul(n,48271),a=n=>(n-1)/2147483646,i=n=>n,l={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function c(){let n=o(o(r(123456)));function e(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof e&&(e=e.split("").reduce((n,e)=>7*n+e.charCodeAt(0),0)),n=o(o(r(e))),x}function t(){return a(n=o(n))}function c(n){switch(n.length){default:return[0,1,i];case 1:return[0,n[0],i];case 2:return[n[0],n[1],i];case 3:return[n[0],n[1],n[2]]}}function s(){for(var n=arguments.length,e=Array(n),r=0;r<n;r++)e[r]=arguments[r];let[o,a,i]=c(e);return o+(a-o)*i(t())}function u(){for(var n,e=arguments.length,r=Array(e),o=0;o<e;o++)r[o]=arguments[o];let[a,i,{weightsAreNormalized:c,indexOffset:s,forbiddenItems:u}]=function(n){let[e,t=null,r]=n,o={...l,...r};if(Array.isArray(e))return[e,t,o];if("object"==typeof e)return[Object.values(e),t?Object.values(t):null,o];throw Error("pick: unsupported options type")}(r);if(u.length>0){let e=new Set;for(let n of u){let t=a.indexOf(n);t>=0&&e.add(t)}if(a=a.filter((n,t)=>!e.has(t)),i=null!==(n=null==i?void 0:i.filter((n,t)=>!e.has(t)))&&void 0!==n?n:null,0===a.length)throw Error("pick: all items are forbidden")}if(null===i){let n=Math.floor(t()*a.length);return s&&(n+=s,(n%=a.length)<0&&(n+=a.length)),a[n]}if(!c){let n=i.reduce((n,e)=>n+e,0);i=i.map(e=>e/n)}let f=t(),x=0;for(let n=0;n<a.length;n++)if(f<(x+=i[n]))return a[n];throw Error("among: unreachable")}function f(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=t(),o=t(),a=Math.sqrt(-2*Math.log(r)),i=2*Math.PI*o;return[n+e*a*Math.cos(i),n+e*a*Math.sin(i)]}let x={seed:e,seedMax:function(){return 2147483647},reset:function(){return e(123456),x},next:function(){return n=o(n),x},random:t,between:s,around:function(){for(var n=arguments.length,e=Array(n),r=0;r<n;r++)e[r]=arguments[r];let[o=1,a=i]=e,l=2*t();return(l>1?1:-1)*a(l>1?l-1:l)*o},int:function(){for(var n=arguments.length,e=Array(n),r=0;r<n;r++)e[r]=arguments[r];let[o,a,i]=c(e);return o+Math.floor(i(t())*(a-o))},chance:function(n){return t()<n},shuffle:function(n){let{mutate:e=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=e&&Array.isArray(n)?n:[...n],o=r.length;for(let n=0;n<o;n++){let e=Math.floor(o*t()),a=r[n];r[n]=r[e],r[e]=a}return r},pick:u,createPicker:function(n){let e=n.map(n=>{let[e]=n;return e}),t=n.map(n=>{let[e,t]=n;return t}),r=t.reduce((n,e)=>n+e,0);for(let[n,e]of t.entries())t[n]=e/r;return()=>u(e,t,{weightsAreNormalized:!0})},vector:function(n,e){let[t=0,r=1]=Array.isArray(e)?e:[null==e?void 0:e.min,null==e?void 0:e.max];for(let e of Object.keys(n))n[e]=s(t,r);return n},unitVector2:function(n){let e=2*Math.PI*t();return n.x=Math.cos(e),n.y=Math.sin(e),n},unitVector3:function(n){let e=t(),r=t(),o=2*Math.PI*e,a=Math.acos(1-2*r);return n.x=Math.sin(a)*Math.cos(o),n.y=Math.sin(a)*Math.sin(o),n.z=Math.cos(a),n},normalVector:function(n){let e=Object.keys(n),t=e.length,r=Math.sqrt(t);for(let o=0;o<t;o+=2){let[a,i]=f();n[e[o]]=a/r,o+1<t&&(n[e[o+1]]=i/r)}return n},unitVector:function(n){let e=Object.keys(n),t=e.length,r=0;for(let o=0;o<t;o+=2){let[a,i]=f();n[e[o]]=a,r+=a*a,o+1<t&&(n[e[o+1]]=i,r+=i*i)}r=Math.sqrt(r);for(let o=0;o<t;o++)n[e[o]]/=r;return n},boxMuller:f};return x}let s=class{constructor(n){Object.assign(this,c().seed(n))}};Object.assign(s,c())},77478:function(n,e,t){"use strict";function r(n,e){return e||(e=n.slice(0)),Object.freeze(Object.defineProperties(n,{raw:{value:Object.freeze(e)}}))}t.d(e,{_:function(){return r}})}},function(n){n.O(0,[7512,1561,7834,6158,3956,1067,3310,812,2038,3420,1540,9258,4157,3977,5694,2840,1744],function(){return n(n.s=83711)}),_N_E=n.O()}]);