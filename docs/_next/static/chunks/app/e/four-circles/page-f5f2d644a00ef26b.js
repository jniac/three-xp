(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8099],{38909:function(e,n,t){Promise.resolve().then(t.bind(t,23567))},23567:function(e,n,t){"use strict";t.d(n,{Main:function(){return _}});var r,o,i=t(78485),s=t(494),a=t(9710),c=t(4917),l=t(8834),u=t(37457),f=t(52471),x=t(38137),v=t(87858),d=t(16573),p=t(58648),y=t(49635);(r=o||(o={})).MoveTo="moveTo",r.LineTo="lineTo";class m extends f.Group{clear(){let{lines:e}=this.parts;return e.count=0,e.instanceMatrix.array=new Float32Array(0),e.instanceMatrix.needsUpdate=!0,this}moveTo(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];let[r,o]=1===n.length?[n[0].x,n[0].y]:n;return this.commands.push({type:"moveTo",x:r,y:o,z:0,w:1}),this}lineTo(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];let[r,o]=1===n.length?[n[0].x,n[0].y]:n;return this.commands.push({type:"lineTo",x:r,y:o,z:0,w:1}),this}draw(){let{lines:e}=this.parts,{thickness:n,commands:t}=this,r=new Float32Array(16*t.length),o=0;for(let[e,{type:i,x:s,y:a}]of t.entries())if("lineTo"===i){let i=t[e-1],c=s-i.x,l=a-i.y,u=i.x+c/2,f=i.y+l/2,x=Math.sqrt(c*c+l*l),v=Math.atan2(l,c);(0,y.$)({x:u,y:f,rotationZ:v,scaleX:x,scaleY:n}).toArray(r,16*o),o++}return e.count=o,e.instanceMatrix.array=r.slice(0,16*o),e.instanceMatrix.needsUpdate=!0,this}constructor(...e){super(...e),this.thickness=.01,this.parts=(()=>{let e=new f.PlaneGeometry(1,1),n=new f.MeshBasicMaterial;return{lines:(0,v.cY)(new f.InstancedMesh(e,n,0),this)}})(),this.commands=[]}}var h=t(47174),w=t(1060),g=t(55244),b=t(98828);let C=new f.PlaneGeometry(4,4);new f.IcosahedronGeometry(1,12);class z extends f.Group{constructor(...e){super(...e),this.parts=(()=>{let e=["#95c3fb","#fcff99","#0a1521"].map(e=>new f.Color(e)),n=new f.MeshBasicMaterial,t={uTime:a.vB.get("three").uTime,uTimeCycleOffset:{value:0},uColors:{value:e}};n.onBeforeCompile=e=>h.b.with(e).uniforms(t).defines({USE_UV:""}).varying({vWorldPosition2:"vec3"}).vertex.mainAfterAll("\n        vWorldPosition2 = (modelMatrix * vec4(position, 1.0)).xyz;\n      ").fragment.top("\n\n  // Inigo Quilez\n  // https://iquilezles.org/articles/distfunctions2d/\n\n  // Circle - exact   (https://www.shadertoy.com/view/3ltSW2)\n  float sdCircle( vec2 p, float r )\n  {\n    return length(p) - r;\n  }\n\n  // Rounded Box - exact   (https://www.shadertoy.com/view/4llXD7 and https://www.youtube.com/watch?v=s5NGeUV2EyU)\n  float sdRoundedBox( in vec2 p, in vec2 b, in vec4 r )\n  {\n    r.xy = (p.x>0.0)?r.xy : r.zw;\n    r.x  = (p.y>0.0)?r.x  : r.y;\n    vec2 q = abs(p)-b+r.x;\n    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;\n  }\n\n  // Box - exact   (https://www.youtube.com/watch?v=62-pRVZuS5c)\n  float sdBox( in vec2 p, in vec2 b )\n  {\n    vec2 d = abs(p)-b;\n    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);\n  }\n\n  // Segment - exact   (https://www.shadertoy.com/view/3tdSDj and https://www.youtube.com/watch?v=PMltMdi1Wzg)\n  float sdSegment( in vec2 p, in vec2 a, in vec2 b )\n  {\n    vec2 pa = p-a, ba = b-a;\n    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );\n    return length( pa - ba*h );\n  }\n\n  // Arc - exact   (https://www.shadertoy.com/view/wl23RK)\n  float sdArc( in vec2 p, in vec2 sc, in float ra, float rb )\n  {\n    // sc is the sin/cos of the arc's aperture\n    p.x = abs(p.x);\n    return ((sc.y*p.x>sc.x*p.y) ? length(p-sc*ra) : \n                                  abs(length(p)-ra)) - rb;\n  }\n\n  float opRound( in float d, in float r )\n  {\n    return d - r;\n  }\n\n  float opOnion( in float d, in float r )\n  {\n    return abs(d) - r;\n  }\n",g.v,b.U,w.i).fragment.top("\n        float globalNoise;\n        void computeGlobalNoise() {\n          globalNoise = fnoise(vec3(vWorldPosition2.xy * 0.5, uTime * 0.01), 8, 0.8);\n        }\n        float radius() {\n          return 0.75;\n        }\n        vec2 point() {\n          return (vUv - 0.5) * 2.0;\n        }\n        float time() {\n          return uTime * 0.05 + uTimeCycleOffset * 1.0;\n        }\n        float noisyBox() {\n          return sdBox(point(), vec2(radius())) + globalNoise * 0.1 * sin01(time());\n        }\n        float noisyCircle() {\n          return length(point()) - radius() + globalNoise * 0.3 * sin01(time());\n        }\n      ").fragment.mainBeforeAll("\n        computeGlobalNoise();\n      ").fragment.after("color_fragment","\n        float d = sdBox(point(), vec2(radius()));\n        float d2 = sin01(time());\n        d2 *= 0.1;\n        vec3 color = mix(uColors[0], uColors[1], smoothstep(0.001, 0.0, noisyBox()));\n\n        float nc = noisyCircle();\n        vec3 circleColor = mix(uColors[1], uColors[2], mix(0.25, 1.0, easeInOut2(inverseLerpUnclamped(-radius(), 0.0, nc))));\n        color = mix(color, circleColor, smoothstep(0.001, 0.0, nc));\n        diffuseColor.rgb = color;\n      ");let r=new f.Mesh(C,n);return this.add(r),{plane:r,planeUniforms:t,colors:e}})()}}class T extends f.Group{constructor(...e){super(...e),this.parts=(()=>{let e=(0,v.cY)(new m,this);e.position.z=1,e.thickness=.0125,e.parts.lines.material.color.set("#fcff99");let n=new p.Ae(0,0).applyPadding(4.2,"grow"),t=new p.Ae(0,0).applyPadding(4.4,"grow");for(let{t:r}of(0,d.VX)(60)){let o=(r+0)*Math.PI*2,i=Math.cos(o),s=Math.sin(o),a=n.raycast(0,0,i,s).getPointMin(),c=t.raycast(0,0,i,s).getPointMin();e.moveTo(a).lineTo(c)}return e.draw(),{lines:e}})()}}function M(){return(0,c._v)("four-circles",function*(e){(0,v.cY)(new x.w({color:"#e1dff1"}),e),(0,v.cY)(new T,{parent:e}),(0,v.cY)(new z,{parent:e,position:[2.0175,2.0175,0]},e=>{e.parts.planeUniforms.uTimeCycleOffset.value=0,e.parts.colors[1].set("#fcff99"),e.parts.colors[2].set("#170551")}),(0,v.cY)(new z,{parent:e,position:[2.0175,-2.0175,0]},e=>{e.parts.planeUniforms.uTimeCycleOffset.value=.25,e.parts.colors[1].set("#18188c"),e.parts.colors[2].set("#72d9ab")}),(0,v.cY)(new z,{parent:e,position:[-2.0175,-2.0175,0]},e=>{e.parts.planeUniforms.uTimeCycleOffset.value=.5,e.parts.colors[1].set("#f3a3b3"),e.parts.colors[2].set("#15093e")}),(0,v.cY)(new z,{parent:e,position:[-2.0175,2.0175,0]},e=>{e.parts.planeUniforms.uTimeCycleOffset.value=.75,e.parts.colors[1].set("#3b3426"),e.parts.colors[2].set("#de2566")}),(0,v.cY)(new z,{parent:e,scaleScalar:4,position:[0,0,-1]},e=>{e.parts.planeUniforms.uTimeCycleOffset.value=.75,e.parts.colors[1].set("#fcff99"),e.parts.colors[2].set("#170551")})},[]),null}function A(){return(0,c.Ky)(function*(e){(0,l.a)({three:e});let n=new s.F({size:10,perspective:0});yield n.initialize(e.renderer.domElement),a.vB.get("three").set({minActiveDuration:60}),yield(0,a.RC)("three",t=>{let{aspect:r,camera:o}=e;n.update(o,r,t.deltaTime)}),yield(0,u.p)([[{code:"Space",modifiers:"shift"},()=>{document.body.requestFullscreen()}]])},[]),null}function _(){return(0,i.jsx)("div",{children:(0,i.jsxs)(c.H7,{children:[(0,i.jsx)(A,{}),(0,i.jsx)(M,{})]})})}},96966:function(e,n,t){"use strict";t.d(n,{v:function(){return o}});let r="/three-xp/assets/",o={development:!1,assetsPath:r,assets:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return"".concat(r).concat(e)}}},4917:function(e,n,t){"use strict";t.d(n,{H7:function(){return d},Ky:function(){return f},_v:function(){return x}});var r=t(78485),o=t(27275),i=t(52471),s=t(48583),a=t(48181),c=t(96966),l=t(11030);let u=(0,o.createContext)(null);function f(e,n){let t=(0,o.useContext)(u);return(0,s.sv)(async function*(n,r){if(e){let n=e(t,r);if(n&&"function"==typeof n.next)do{let{value:e,done:t}=await n.next();if(t)break;yield e}while(r.mounted)}},null!=n?n:"always"),t}function x(e,n,t){let r=(0,o.useMemo)(()=>new i.Group,[]);return r.name=e,f(async function*(e,t){if(e.scene.add(r),yield()=>{r.clear(),r.removeFromParent()},n){let o=n(r,e,t);if(o&&"function"==typeof o.next)do{let{value:e,done:n}=await o.next();if(n)break;yield e}while(t.mounted)}},t),r}function v(e){let{children:n,className:t}=e,l=(0,o.useMemo)(()=>new a.Vu,[]),{ref:f}=(0,s.sv)(function*(e){l.loader.setPath(c.v.assetsPath),yield l.initialize(e),Object.assign(window,{three:l,THREE:i})},[]);return(0,r.jsx)("div",{ref:f,className:"ThreeProvider absolute-through ".concat(null!=t?t:""),children:(0,r.jsx)(u.Provider,{value:l,children:n})})}function d(e){return(0,l.O)()&&(0,r.jsx)(v,{...e})}},11030:function(e,n,t){"use strict";t.d(n,{O:function(){return o}});var r=t(27275);function o(){let[e,n]=(0,r.useState)(!1);return(0,r.useLayoutEffect)(()=>{n(!0)},[]),e}},8834:function(e,n,t){"use strict";t.d(n,{Leak:function(){return a},a:function(){return s}});var r=t(40855),o=t(79509),i=t(28142);function s(e){Object.assign(window,{...o,...r,...e,PRNG:i.T})}function a(e){return s(e),null}},37457:function(e,n,t){"use strict";function r(e,n){return"*"===n||("string"==typeof n?n===e:n instanceof RegExp?n.test(e):"function"==typeof n&&n(e))}t.d(n,{p:function(){return s}});let o={preventDefault:!1,strictTarget:void 0},i={key:"*",keyCaseInsensitive:!0,code:"*",noModifiers:!1,modifiers:""};function s(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];let[s,a,c]=1===n.length?[document.body,{},n[0]]:2===n.length?[n[0],{},n[1]]:n,{preventDefault:l}={...o,...a},u=e=>{var n;if((null!==(n=a.strictTarget)&&void 0!==n?!!n:s===document.body)&&e.target!==s)return;let{ctrlKey:t,altKey:o,shiftKey:u,metaKey:f}=e,x={event:e,modifiers:{ctrl:t,alt:o,shift:u,meta:f}};for(let n=0,s=c.length;n<s;n++){let[s,a]=c[n],{key:v,keyCaseInsensitive:d,code:p,noModifiers:y,modifiers:m}=function(e){let n="string"==typeof e?{...i,key:e}:{...i,...e};return n.keyCaseInsensitive&&"string"==typeof n.key&&(n.key=n.key.toLowerCase()),n}(s);Object.values({key:r(d?e.key.toLowerCase():e.key,v),code:r(e.code,p),noModifiers:!y||!1===t&&!1===o&&!1===u&&!1===f,modifiers:function(e,n){let{ctrlKey:t,altKey:r,shiftKey:o,metaKey:i}=e;if("function"==typeof n)return n({ctrl:t,alt:r,shift:o,meta:i});let{ctrl:s=!1,alt:a=!1,shift:c=!1,meta:l=!1}=Object.fromEntries(n.split("-").map(e=>[e,!0]));return s===t&&a===r&&c===o&&l===i}(e,m)}).every(Boolean)&&(l&&e.preventDefault(),a(x))}};return s.addEventListener("keydown",u,{passive:!1}),{destroy:()=>{s.removeEventListener("keydown",u)}}}},49635:function(e,n,t){"use strict";t.d(n,{$:function(){return s},E:function(){return c}});var r=t(52471),o=t(81796);let i=new r.Matrix4;function s(e){return(0,o.Xe)(e,i)}let a=new r.Color;function c(e){return a.set(e)}},55244:function(e,n,t){"use strict";t.d(n,{v:function(){return o}});var r=t(70155);let o="\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex \n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20201014 (stegu)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n// \n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+10.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r) {\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\n\n\n\n\n// 2D:\n\nvec3 mod289_2d(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289_2d(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute_2d(vec3 x) {\n  return mod289(((x*34.0)+10.0)*x);\n}\n\n\nfloat snoise(vec2 v) {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289_2d(i); // Avoid truncation effects in permutation\n  vec3 p = permute_2d( permute_2d( i.y + vec3(0.0, i1.y, 1.0 ))\n		+ i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n// 3D: \n\nfloat snoise(vec3 v)\n{ \n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n  // First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n  // Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n  // Permutations\n  i = mod289(i); \n  vec4 p = permute( permute( permute( \n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n  // Gradients: 7x7 points over a square, mapped onto an octahedron.\n  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n  //Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n  // Mix final noise value\n  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \n                                dot(p2,x2), dot(p3,x3) ) );\n}\n\n\n\n\n// addons:\n// Fractal noise, based on Stefan Gustavson's Simplex noise\n".concat((0,r.C)(["vec2","vec3"],"\n  float fnoise(T p, int octaves, float persistence) {\n    float total = 0.0;           // Final noise value\n    float amplitude = 1.0;       // Initial amplitude\n    float frequency = 1.0;       // Initial frequency\n    float maxValue = 0.0;        // Used for normalization\n\n    for (int i = 0; i < octaves; i++) {\n      total += snoise(p * frequency) * amplitude;\n\n      maxValue += amplitude;   // Keep track of max amplitude\n      amplitude *= persistence; // Reduce amplitude for next octave\n      frequency *= 2.0;        // Increase frequency for next octave\n    }\n\n    // Normalize the result to stay within the range [0, 1]\n    return total / maxValue;\n  }\n"),"\n")},40855:function(e,n,t){"use strict";function r(e,n){for(let t of e)if(n(t))return!0;return!1}function o(e,n){for(let t of e)if(!n(t))return!1;return!0}function i(e,n,t){let r=[];function o(e){let n=[];return r[e]=n,n}if(void 0!==t)for(let e=0;e<t;e++)o(e);for(let t of e){var i;let e=n(t);(null!==(i=r[e])&&void 0!==i?i:o(e)).push(t)}return r}t.r(n),t.d(n,{every:function(){return o},some:function(){return r},split:function(){return i}})},16573:function(e,n,t){"use strict";function*r(e){let n=0,t={get i(){return n},get t(){return n/e},get p(){return n/(e-1)}};for(n=0;n<e;n++)yield t}function*o(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];let r=0,o=0;2===n.length?(r=n[0],o=n[1]):Array.isArray(n[0])?(r=n[0][0],o=n[0][1]):(r=n[0].x,o=n[0].y);let i=0,s=0,a=0,c={get i(){return i},get x(){return s},get y(){return a},get tx(){return s/r},get ty(){return a/o},get px(){return s/(r-1)},get py(){return a/(o-1)}};for(a=0;a<o;a++)for(s=0;s<r;s++)yield c,i++}function*i(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];let r=0,o=0,i=0;3===n.length?(r=n[0],o=n[1],i=n[2]):Array.isArray(n[0])?(r=n[0][0],o=n[0][1],i=n[0][2]):(r=n[0].x,o=n[0].y,i=n[0].z);let s=0,a=0,c=0,l=0,u={get i(){return s},get x(){return a},get y(){return c},get z(){return l},get tx(){return a/r},get ty(){return c/o},get tz(){return l/i},get px(){return a/(r-1)},get py(){return c/(o-1)},get pz(){return l/(i-1)}};for(l=0;l<i;l++)for(c=0;c<o;c++)for(a=0;a<r;a++)yield u,s++}t.d(n,{B0:function(){return o},KA:function(){return i},VX:function(){return r}})},32717:function(e,n,t){"use strict";function r(e,n){return n||(n=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}t.d(n,{_:function(){return r}})}},function(e){e.O(0,[5244,6712,6666,5792,2452,7741,2722,4940,8648,4831,9918,8181,3425,6257,1904,2920,7936,1744],function(){return e(e.s=38909)}),_N_E=e.O()}]);