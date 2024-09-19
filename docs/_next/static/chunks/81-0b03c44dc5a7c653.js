"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[81],{27081:function(e,n,t){t.d(n,{Main:function(){return N}});var o=t(41291),r=t(22076),a=t(22380),i=t(64740),s=t(42685),c=t(74985),l=t(2164),d=t(71441),h=t(27636),p=t(48178);let m=new(t(91310)).x;function u(e){return new Promise(n=>{m.load(e,e=>{n(e)})})}let x=new p.I;var v=t(18647);let f="\n\nstruct FloatRamp {\n  float a;\n  float b;\n  float t;\n};\n\nstruct Vec2Ramp {\n  vec2 a;\n  vec2 b;\n  float t;\n};\n\nstruct Vec3Ramp {\n  vec3 a;\n  vec3 b;\n  float t;\n};\n\nstruct Vec4Ramp {\n  vec4 a;\n  vec4 b;\n  float t;\n};\n\n".concat((0,v.C)("vecX",e=>{let n=e[0].toUpperCase()+e.slice(1)+"Ramp";return"\n\n".concat(n," ramp(float t, T a, T b) {\n  return ").concat(n,"(a, b, t);\n}\n\n").concat(n," ramp(float t, T a, T b, T c) {\n  if (t < .5) {\n    return ").concat(n,"(a, b, t * 2.0);\n  } else {\n    return ").concat(n,"(b, c, (t - 0.5) * 2.0);\n  }\n}\n\n").concat(n," ramp(float t, T a, T b, T c, T d) {\n  if (t < .33) {\n    return ").concat(n,"(a, b, t * 3.0);\n  } else if (t < .66) {\n    return ").concat(n,"(b, c, (t - 0.33) * 3.0);\n  } else {\n    return ").concat(n,"(c, d, (t - 0.66) * 3.0);\n  }\n}\n\n").slice(1,-1)})),g="\n#ifndef GLSL_RAMP\n#define GLSL_RAMP\n".concat(l.i,"\n").concat(f,"\n#endif\n"),w={white:new i.Color("#ffffff"),grey10:new i.Color("#f0f0f0"),grey20:new i.Color("#e0e0e0"),notSoWhite:new i.Color("#f8f8e8"),yellow:new i.Color("#fff700"),black:new i.Color("#110111"),red:new i.Color("#dd1a41"),brightSkin:new i.Color("#ebd8c6"),petrol:new i.Color("#005e6b"),brightGreen:new i.Color("#22c891"),darkGreen:new i.Color("#002f1c"),sand:new i.Color("#e6db9f")};class y extends i.Mesh{static createMaterial(e){let{color:n,shaded:t,emissiveIntensity:o,side:r}={...y.defaultProps,...e};return t?new i.MeshPhysicalMaterial({color:n,emissiveIntensity:o,emissive:o>0?n:void 0,side:r}):new i.MeshBasicMaterial({color:n})}}y.defaultProps={color:w.black,radius:1.3,align:.5,thickness:.3,innerRadiusRatio:null,shaded:!0,emissiveIntensity:.333};class b extends y{constructor(e){let{radius:n,thickness:t,align:o,innerRadiusRatio:r,color:a,shaded:s,...l}={...y.defaultProps,...e},d=n-t*o,h=n+t*(1-o);r&&(d=n*r,h=n),super(new i.RingGeometry(d,h,128),y.createMaterial({...e,side:i.DoubleSide})),(0,c.N)(this,l)}}class M extends i.Mesh{constructor(e){let{radius:n,thickness:t,align:o,innerRadiusRatio:r,color:a,shaded:s,emissiveIntensity:l,...d}={...y.defaultProps,...e},h=n-t*o,p=n+t*(1-o);r&&(h=n*r,p=n),super(new i.TorusGeometry((h+p)/2,(p-h)/2,128,512),y.createMaterial({...e,side:i.FrontSide})),(0,c.N)(this,d)}}class P extends b{constructor(e){super(e),this.material.onBeforeCompile=e=>s.b.with(e).defines({USE_UV:""}).fragment.top(g).fragment.after("map_fragment","\n      vec2 p = vUv - 0.5;\n      float alpha = atan(p.y, p.x) / 6.2831853;\n      alpha = 1.0 - mod(alpha + 0.0, 1.0);\n      Vec3Ramp r = ramp(alpha,\n        ".concat((0,s.R)(w.black),",\n        ").concat((0,s.R)(w.white),",\n        ").concat((0,s.R)(w.yellow),");\n      diffuseColor.rgb = mix(r.a, r.b, easeInOut4(r.t));\n    "))}}class C extends i.Line{constructor(e,n){let t=new i.BufferGeometry;t.setAttribute("position",new i.Float32BufferAttribute([1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],3)),t.computeBoundingSphere(),super(t,new i.LineBasicMaterial({fog:!1})),this.light=e,this.color=n,this.type="RectAreaLightHelper";let o=new i.BufferGeometry;o.setAttribute("position",new i.Float32BufferAttribute([1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],3)),o.computeBoundingSphere(),this.add(new i.Mesh(o,new i.MeshBasicMaterial({side:i.BackSide,fog:!1})))}updateMatrixWorld(){if(this.scale.set(.5*this.light.width,.5*this.light.height,1),void 0!==this.color)this.material.color.set(this.color),this.children[0].material.color.set(this.color);else{this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);let e=this.material.color,n=Math.max(e.r,e.g,e.b);n>1&&e.multiplyScalar(1/n),this.children[0].material.color.copy(this.material.color)}this.matrixWorld.extractRotation(this.light.matrixWorld).scale(this.scale).copyPosition(this.light.matrixWorld),this.children[0].matrixWorld.copy(this.matrixWorld)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}class k extends i.Group{constructor({globalIntensity:e=1,debug:n=!1}={}){super(),this.name="lights";let t=new i.HemisphereLight("#dbebf0","#645d61",e);this.add(t);let o=new i.RectAreaLight("#e8e6d3",1.3*e);o.position.set(10,10,10),o.width=40,o.height=40,o.lookAt(0,0,0),this.add(o),n&&this.add(new C(o));let r=new i.AmbientLight("#f2f0dd",.8*e);this.add(r)}}function z(e){let{precision:n=3}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=0,o=0,r=0;function a(){return"vec3(".concat(t.toFixed(n),", ").concat(o.toFixed(n),", ").concat(r.toFixed(n),")")}switch(typeof e){case"number":return t=(e>>16&255)/255,o=(e>>8&255)/255,r=(255&e)/255,a();case"string":if(e.startsWith("#")){if(4===e.length)return t=parseInt(e[1]+e[1],16)/255,o=parseInt(e[2]+e[2],16)/255,r=parseInt(e[3]+e[3],16)/255,a();return z(parseInt(e.slice(1),16),{precision:n})}throw Error("Invalid string: ".concat(e));case"object":if(Array.isArray(e))return[t,o,r]=e,a();if("r"in e)return t=e.r,o=e.g,r=e.b,a();if("x"in e)return t=e.x,o=e.y,r=e.z,a();throw Error("Invalid object: ".concat(e))}return"vec3(1.0, 0.0, 1.0)"}d.UM;let S="\n  ".concat(i.ShaderChunk.cube_uv_reflection_fragment,"\n  ").concat("\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex \n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20201014 (stegu)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n// \n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+10.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r) {\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\n\n\n\n\n// 2D:\n\nvec3 mod289_2d(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289_2d(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute_2d(vec3 x) {\n  return mod289(((x*34.0)+10.0)*x);\n}\n\n\nfloat snoise(vec2 v) {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289_2d(i); // Avoid truncation effects in permutation\n  vec3 p = permute_2d( permute_2d( i.y + vec3(0.0, i1.y, 1.0 ))\n		+ i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n// 3D: \n\nfloat snoise(vec3 v)\n{ \n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n  // First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n  // Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n  // Permutations\n  i = mod289(i); \n  vec4 p = permute( permute( permute( \n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n  // Gradients: 7x7 points over a square, mapped onto an octahedron.\n  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n  //Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n  // Mix final noise value\n  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \n                                dot(p2,x2), dot(p3,x3) ) );\n}\n","\n\n  varying vec3 vPosition;\n  varying vec3 vWorldNormal;\n\n  struct Plane {\n    vec3 origin;\n    vec3 normal;\n  };\n\n  float signedDistanceToPlane(Plane plane, vec3 p) {\n    return dot(plane.normal, p - plane.origin);\n  }\n\n  vec3 checker3(vec3 position, float scale, float edgeWidth, vec3 color1, vec3 color2) {\n    // Scale the position to control the size of the checker cubes\n    vec3 scaledPos = position / scale;\n\n    // Get the integer part (checker grid location)\n    vec3 checkerPos = floor(scaledPos);\n\n    // Get the fractional part (inside each cube)\n    vec3 fractPos = fract(scaledPos);\n\n    // Calculate the checkerboard pattern (even/odd cubes)\n    float checkerSum = mod(checkerPos.x + checkerPos.y + checkerPos.z, 2.0);\n\n    // Smooth transition using smoothstep on the fractional position\n    float edgeX = smoothstep(0.0, edgeWidth, fractPos.x);\n    float edgeY = smoothstep(0.0, edgeWidth, fractPos.y);\n    float edgeZ = smoothstep(0.0, edgeWidth, fractPos.z);\n\n    // Combine the edges to create a smooth transition\n    float blend = edgeX * edgeY * edgeZ;\n    blend = smoothstep(0.0, edgeWidth, min(min(fractPos.x, fractPos.y), fractPos.z));\n    \n    // Interpolate between black and white with the smoothstep value\n    vec3 baseColor = checkerSum == 0.0 ? color1 : color2;\n    vec3 oppositeColor = checkerSum == 0.0 ? color2 : color1;\n\n    // Use the smooth transition to blend between colors\n    return mix(baseColor, oppositeColor, blend);\n  }\n\n  float sphereGrid(vec3 position, float scale, float edgeWidth) {\n    // Scale the position to control the size of the checker cubes\n    vec3 scaledPos = position / scale;\n\n    // Get the integer part (checker grid location)\n    vec3 checkerPos = floor(scaledPos);\n\n    // Get the fractional part (inside each cube)\n    vec3 fractPos = fract(scaledPos);\n\n    vec3 p = fractPos - 0.5;\n    float alpha = 1.0 - length(p) * 2.0;\n\n    return smoothstep(0.0, edgeWidth, alpha - 0.1);    \n  }\n\n  void main() {\n    vec3 p = vWorldNormal * 0.33;\n    float n1 = snoise(p * 6.0 * 0.2 + 0.2);\n    float n2 = snoise(p * 20.0 + 10.1);\n    float n3 = snoise(p * 40.0 + 10.1);\n    float n4 = snoise(p * 1400.0 + 13.1);\n    float n = n1 * 0.5;\n    n += pow(fract((n1 + n2 * 0.015 + n3 * 0.01 + n4 * 0.005) * 85.0), 4.0) * 0.5;\n    n += pow(fract((n1 + n2 * 0.015) * 85.0), 4.0) * 0.25;\n    n += n4 * 0.2;\n    n += 0.8;\n    n = pow(n, 0.3);\n    float alpha = n;\n\n    gl_FragColor.rgb = mix(").concat(z(w.white),", ").concat(z(w.brightSkin),", alpha);\n    gl_FragColor.a = 1.0;\n\n    // float x = sphereGrid(vPosition, 1.0, 0.01);\n    // gl_FragColor.rgb = mix(").concat(z(w.black),", ").concat(z(w.brightSkin),", x);\n    // gl_FragColor.rgb = checker3(vPosition, 1.0, 0.1, ").concat(z(w.black),", ").concat(z(w.brightSkin),");\n  }\n");class I extends i.Mesh{constructor({debug:e=!1}={}){super(new i.IcosahedronGeometry(5.5,12),new i.ShaderMaterial({depthWrite:!1,side:i.BackSide,vertexShader:"\n  varying vec3 vWorldNormal;\n  varying vec3 vPosition;\n\n  vec3 rotate(mat4 m, vec3 v) {\n    return vec3(\n      dot(v, vec3(m[0][0], m[1][0], m[2][0])),  // X component\n      dot(v, vec3(m[0][1], m[1][1], m[2][1])),  // Y component\n      dot(v, vec3(m[0][2], m[1][2], m[2][2]))   // Z component\n    );\n  }\n\n  void main() {\n    vPosition = position;\n    vWorldNormal = normalize(rotate(modelMatrix, position));\n\n    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    // Ignore the position, we only need the normal:\n    gl_Position = projectionMatrix * vec4(rotate(modelViewMatrix, position), 1.0);\n  }\n",fragmentShader:S,uniforms:{}})),e&&(this.material=new i.MeshBasicMaterial({depthWrite:!1,color:"white",wireframe:!0})),this.onBeforeRender=(e,n,t,o,r,a)=>{this.position.copy(t.position)},this.renderOrder=-1,this.frustumCulled=!1,this.name="a-sky"}}var _=t(68392);class W extends i.Mesh{constructor(e){let{radius:n,...t}={...W.defaultProps,...e},o=new i.IcosahedronGeometry(n,18),r=new i.MeshPhysicalMaterial({});r.onBeforeCompile=e=>s.b.with(e).defines({USE_UV:""}).fragment.top(g).fragment.after("map_fragment","\n        vec2 p = vUv - 0.5;\n        float alpha = easeInOut(vUv.y, 1.6, 0.5);\n        Vec3Ramp r = ramp(alpha, ".concat((0,s.R)(w.black),", ").concat((0,s.R)(w.white),", ").concat((0,s.R)(w.yellow),");\n        diffuseColor.rgb = mix(r.a, r.b, easeInOut3(r.t));\n      ")),super(o,r),(0,c.N)(this,t)}}W.defaultProps={radius:1};class V{set(e){this.props={...this.props,...e},this.props.center=this.props.center.clone(),this.props.normal=this.props.normal.clone().normalize(),this.props.binormal=this.props.binormal.clone().normalize()}update(e){let{radius:n,turnVelocity:t,turn:o,center:r,normal:a,binormal:i}=this.props,s=o+t*e;this.props.turn=s,this.target.position.copy(r).addScaledVector(a,n*Math.cos(s*Math.PI*2)).addScaledVector(i,n*Math.sin(s*Math.PI*2))}constructor(e,n){this.target=e,this.set({...V.defaultProps,...n})}}V.defaultProps={center:new i.Vector3,normal:new i.Vector3(1,0,0),binormal:new i.Vector3(0,1,0),radius:1,turnVelocity:1,turn:0};class G extends i.Mesh{get satellite(){var e;return null!==(e=this._satellite)&&void 0!==e?e:this._satellite=new V(this)}constructor(e){let{radius:n,singleColor:t,emmissiveIntensity:o,lerpIn:r,lerpOut:a,...d}={...G.defaultProps,...e},{colorTop:h=null!=t?t:G.defaultProps.colorTop,colorBottom:p=null!=t?t:G.defaultProps.colorBottom}={...e},m=new i.IcosahedronGeometry(n,12),u=new i.MeshPhysicalMaterial({color:h,emissive:p});u.onBeforeCompile=e=>{s.b.with(e).defines({USE_UV:""}).uniforms({uLerpIn:{value:r},uLerpOut:{value:a},uColorTop:{value:new i.Color(h)},uColorBottom:{value:new i.Color(p)}}).fragment.top(l.i,_.U).fragment.mainBeforeAll("\n          float alpha = inverseLerp(uLerpIn, uLerpOut, vUv.y);\n          vec3 sphereColor = mix(uColorBottom, uColorTop, easeInOut3(alpha));\n        ").fragment.after("map_fragment","\n          diffuseColor.rgb = sphereColor;\n        ").fragment.after("emissivemap_fragment","\n          totalEmissiveRadiance.rgb = sphereColor * ".concat(o.toFixed(2),";\n        "))},super(m,u),this._satellite=null,(0,c.N)(this,d)}}G.defaultProps={radius:.225,singleColor:null,colorTop:w.white,colorBottom:w.yellow,emmissiveIntensity:.25,lerpIn:-.2,lerpOut:1.2};class R extends i.Mesh{constructor(e){let n=new i.IcosahedronGeometry(.4,12),t=new i.MeshPhysicalMaterial({});t.onBeforeCompile=e=>s.b.with(e).varying({vWorldPosition:"vec3",vNormalWorld:"vec3",vViewDir:"vec3"}).vertex.mainAfterAll("\n        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;\n        vNormalWorld = normalize(mat3(modelMatrix) * normal);\n        vViewDir = normalize(cameraPosition - vWorldPosition);\n      ").fragment.top(l.i,"\n\nfloat contrast(float mValue, float mScale, float mMidPoint) {\n	// Why clamp? If necessary, it has to be done outside of this function.\n	// return clamp((mValue - mMidPoint) * mScale + mMidPoint, 0.0, 1.0);\n	return (mValue - mMidPoint) * mScale + mMidPoint;\n}\n\nfloat contrast(float mValue, float mScale) {\n	return contrast(mValue, mScale, 0.5);\n}\n\nvec3 contrast(vec3 mValue, float mScale, float mMidPoint) {\n	return vec3(contrast(mValue.r, mScale, mMidPoint), contrast(mValue.g, mScale, mMidPoint), contrast(mValue.b, mScale, mMidPoint));\n}\n\nvec3 contrast(vec3 mValue, float mScale) {\n	return contrast(mValue, mScale, 0.5);\n}\n\nfloat greyscaleFloat(vec3 color) {\n	return dot(color, vec3(0.299, 0.587, 0.114));\n}\n\nvec3 greyscale(vec3 color) {\n    return vec3(greyscaleFloat(color));\n}\n\nvec3 greyscale(vec3 color, float alpha) {\n    return mix(color, greyscale(color), alpha);\n}\n\n").fragment.after("map_fragment","\n        float fresnel = dot(vNormalWorld, vViewDir);\n        vec3 inner = ".concat((0,s.R)(w.white),";\n        vec3 outer = ").concat((0,s.R)(w.black),";\n        float alpha = easeInOut(1.0 - pow(fresnel, 1.5), 2.0, 0.0);\n        diffuseColor.rgb = mix(inner, outer, alpha);\n      ")).fragment.mainAfterAll("\n        // Final tuning\n        gl_FragColor.rgb = mix(contrast(greyscale(gl_FragColor.rgb), 1.5), diffuseColor.rgb, alpha);\n      "),super(n,t),(0,c.N)(this,e)}}class T extends i.Mesh{constructor(e){let{color:n,thickness:t,length:o,shaded:r,...a}={...T.defaultProps,...e};super(new i.CylinderGeometry(t/2,t/2,o,12,1).rotateZ(.5*Math.PI),r?new i.MeshPhysicalMaterial({color:n}):new i.MeshBasicMaterial({color:n})),(0,c.N)(this,a)}}function A(e,n){return n.add(e),e}function*B(e,n){let t=yield*function*(e){let{ticker:n,scene:t}=e;n.set({activeDuration:180}),u("https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr").then(n=>{new i.PMREMGenerator(e.renderer).fromEquirectangular(n).texture});let o=new i.Group;return t.add(o),yield()=>{o.removeFromParent()},o}(e);if(1===n.renderCount){let{camera:n}=e;n.fov=e.aspect>1?25:2*Math.atan(Math.tan(25*Math.PI/180/2)/e.aspect)*180/Math.PI,n.far=1e3,n.updateProjectionMatrix(),n.position.set(0,0,10)}t.add(new I),t.add(new k);let o=A(new W,t);t.add(new P({z:-1,radius:1.4,innerRadiusRatio:.805})),t.add(new M({z:-1,radius:.75,thickness:.01,color:w.yellow,emissiveIntensity:1})),t.add(new M({z:-1,radius:.8,thickness:.01,color:w.notSoWhite})),h.T.seed(6789402);let r=h.T.createPicker([[1,4],[2,2],[4,1]]);for(let{i:n}of function*(e){let n=0,t={get i(){return n},get t(){return n/8},get count(){return 8}};for(;n<8;n++)yield t}(8)){let o=h.T.pick(w),a=h.T.pick(w),s=new G({z:-1,radius:.1*r(),colorTop:o,colorBottom:a});s.rotation.set(h.T.between(2*Math.PI),h.T.between(2*Math.PI),h.T.between(2*Math.PI)),t.add(s),s.satellite.set({radius:0===n?.875:h.T.between(.25,.75)*(0,d.t7)(1,1.5,n),center:new i.Vector3(0,0,-1-.4*n),turnVelocity:h.T.between(.05,.25)}),yield e.ticker.onTick(e=>{s.satellite.update(e.deltaTime)})}let a=new i.Group;a.rotation.z=-.25*Math.PI,t.add(a),a.add(new G({x:-1.5,z:.5,singleColor:w.yellow})),a.add(new M({x:-1.81,radius:.1,thickness:.01,color:w.notSoWhite}));let s=A(new M({x:-2.315,radius:.2,thickness:.01,color:w.notSoWhite}),a);A(new T({x:-.2,thickness:.01,length:.4,shaded:!0,color:w.notSoWhite}),s),a.add(new G({x:1.7,z:.5,lerpIn:0,lerpOut:1})),a.add(new G({x:1.4,radius:.1,singleColor:w.black}));let l=A(new R({x:2.3}),a);A(new M({radius:.43,thickness:.015,color:w.black}),l),a.add(new T({x:1.5,thickness:.015,color:w.black}));let p=new i.Group;p.rotation.z=.25*Math.PI,t.add(p),p.add(new T({x:-1.6,thickness:.01,length:.35,shaded:!0,color:w.notSoWhite})),p.add(new T({x:1.6,thickness:.01,length:.35,shaded:!0,color:w.notSoWhite}));let m=new i.Group;m.rotation.y=.5*Math.PI,t.add(m),m.add(new T({x:-1.2,thickness:.01,length:.35,shaded:!0,color:w.notSoWhite})),m.add(new T({x:1.2,thickness:.01,length:.35,shaded:!0,color:w.notSoWhite})),(function(e){let n=e.split(".").pop();switch(n){case"hdr":return u(e);case"exr":return new Promise(n=>{x.load(e,e=>{n(e)})});default:return Promise.reject("Unsupported texture format: ".concat(n))}})("https://threejs.org/examples/textures/piz_compressed.exr").then(e=>{e.mapping=i.EquirectangularReflectionMapping,l.material.envMap=e,l.material.envMapIntensity=.25,l.material.envMapRotation.set(-.1*Math.PI,Math.PI,0),l.material.roughness=.3,l.material.metalness=.5,l.material.needsUpdate=!0,o.material.envMap=e,o.material.roughness=.2,o.material.envMapIntensity=.5,o.material.envMapRotation.set(-.1*Math.PI,Math.PI,0),o.material.needsUpdate=!0});let v=A(new i.Group,t);v.rotation.z=.25*Math.PI;class f extends i.Group{constructor(e){super();{let e=new i.CylinderGeometry(15,15,5,6,1,!0).rotateY(Math.PI/6),n=new i.MeshPhysicalMaterial({color:new i.Color("white").lerp(w.black,.995),side:i.BackSide,flatShading:!0});A(new i.Mesh(e,n),this)}{let e=new i.CylinderGeometry(15,15,5,6,60,!0).rotateY(Math.PI/6),n=new i.MeshPhysicalMaterial({color:w.black,wireframe:!0,flatShading:!0,side:i.BackSide});A(new i.Mesh(e,n),this)}(0,c.N)(this,e)}}A(new f({y:7.8}),v),A(new f({y:-7.8}),v)}function N(){return(0,o.jsx)("div",{className:"absolute-through",children:(0,o.jsx)(r.V,{className:"bg-[#ddd]",children:(0,o.jsx)(a.hR,{children:(0,o.jsx)(a.kB,{fn:B})})})})}T.defaultProps={color:w.black,thickness:.01,shaded:!1,length:1}}}]);