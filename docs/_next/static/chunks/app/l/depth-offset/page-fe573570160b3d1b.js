(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9577],{66382:function(t,e,r){Promise.resolve().then(r.bind(r,93757))},93757:function(t,e,r){"use strict";r.d(e,{Main:function(){return g}});var n=r(41291),o=r(64740),i=r(62362),l=r(75952),u=r(42685),a=r(64556),c=r(56246),s=r(25463),f=r(27636);class h extends o.Group{constructor(){super(),(0,c.cY)(new o.Mesh(new o.IcosahedronGeometry(1,12),new l.P),this),(0,c.cY)(new o.Mesh(new o.TorusKnotGeometry(2,.1,256,16),new l.P({color:"red"})),this);let t=new o.InstancedBufferAttribute(new Float32Array(100),4),e=new o.PlaneGeometry;e.setAttribute("aRand",t);let r=new o.MeshBasicMaterial({side:o.DoubleSide});r.onBeforeCompile=t=>u.b.with(t).vertex.top("\n        attribute vec4 aRand;\n      ").vertex.after("project_vertex","\n        gl_Position.z += aRand.x * .1;\n      ");let n=(0,c.cY)(new o.InstancedMesh(e,r,25),this);f.T.reset();let i=Array.from({length:25},()=>16777215*f.T.random());for(let e of(0,s.B)(5,5)){let r=(e.tx-.5)*4,o=(e.ty-.5)*4,l=(e.tx+e.ty)*.4;n.setMatrixAt(e.i,(0,a.$)({x:r,y:o,z:l,scaleScalar:1.25})),n.setColorAt(e.i,(0,a.E)(f.T.pick(i))),t.setXYZW(e.i,f.T.random(),f.T.random(),f.T.random(),f.T.random())}}}function d(){return(0,i.Ky)(function*(t){t.useOrbitControls(),t.scene.background=new o.Color("#345");let e=new h;t.scene.add(e),yield()=>e.removeFromParent()},[]),null}function g(){return(0,n.jsx)(i.c,{children:(0,n.jsx)(d,{})})}},75952:function(t,e,r){"use strict";r.d(e,{P:function(){return i}});var n=r(64740);let o={vertexColors:!0,color:"white"};class i extends n.ShaderMaterial{constructor(t){let{color:e,vertexColors:r,...i}={...o,...t};super({...i,uniforms:{uColor:{value:new n.Color(e)},uSunPosition:{value:new n.Vector3(.5,.7,.3)}},vertexColors:r,vertexShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vColor = color;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nuniform vec3 uSunPosition;\nuniform vec3 uColor;\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  light = mix(0.1, 1.0, light);\n  gl_FragColor = vec4(vColor * uColor * light, 1.0);\n}\n"}),this.sunPosition=this.uniforms.uSunPosition.value}}},25463:function(t,e,r){"use strict";function*n(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let n=0,o=0;2===e.length?(n=e[0],o=e[1]):Array.isArray(e[0])?(n=e[0][0],o=e[0][1]):(n=e[0].x,o=e[0].y);let i=0,l=0,u=0,a={get i(){return i},get x(){return l},get y(){return u},get tx(){return l/(n-1)},get ty(){return u/(o-1)}};for(u=0;u<o;u++)for(l=0;l<n;l++)yield a,i++}function*o(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let n=0,o=0,i=0;3===e.length?(n=e[0],o=e[1],i=e[2]):Array.isArray(e[0])?(n=e[0][0],o=e[0][1],i=e[0][2]):(n=e[0].x,o=e[0].y,i=e[0].z);let l=0,u=0,a=0,c=0,s={get i(){return l},get x(){return u},get y(){return a},get z(){return c},get tx(){return u/(n-1)},get ty(){return a/(o-1)},get tz(){return c/(i-1)}};for(c=0;c<i;c++)for(a=0;a<o;a++)for(u=0;u<n;u++)yield s,l++}r.d(e,{B:function(){return n},K:function(){return o}})},27636:function(t,e,r){"use strict";r.d(e,{T:function(){return c}});let n=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(t=(t=(7*t+Math.sqrt(t)+16087*Math.sin(t))%2147483647)<0?t+2147483647:t)>1?2147483647&t:0===t?345678:123456},o=t=>t=2147483647&Math.imul(t,48271),i=t=>(t-1)/2147483646,l=t=>t,u={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function a(){let t=o(o(n(123456)));function e(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof e&&(e=e.split("").reduce((t,e)=>7*t+e.charCodeAt(0),0)),t=o(o(n(e))),f}function r(){return i(t=o(t))}function a(t){switch(t.length){default:return[0,1,l];case 1:return[0,t[0],l];case 2:return[t[0],t[1],l];case 3:return[t[0],t[1],t[2]]}}function c(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];let[o,i,l]=a(e);return o+(i-o)*l(r())}function s(){for(var t,e=arguments.length,n=Array(e),o=0;o<e;o++)n[o]=arguments[o];let[i,l,{weightsAreNormalized:a,indexOffset:c,forbiddenItems:s}]=function(t){let[e,r=null,n]=t,o={...u,...n};if(Array.isArray(e))return[e,r,o];if("object"==typeof e)return[Object.values(e),r?Object.values(r):null,o];throw Error("pick: unsupported options type")}(n);if(s.length>0){let e=new Set;for(let t of s){let r=i.indexOf(t);r>=0&&e.add(r)}if(i=i.filter((t,r)=>!e.has(r)),l=null!==(t=null==l?void 0:l.filter((t,r)=>!e.has(r)))&&void 0!==t?t:null,0===i.length)throw Error("pick: all items are forbidden")}if(null===l){let t=Math.floor(r()*i.length);return c&&(t+=c,(t%=i.length)<0&&(t+=i.length)),i[t]}if(!a){let t=l.reduce((t,e)=>t+e,0);l=l.map(e=>e/t)}let f=r(),h=0;for(let t=0;t<i.length;t++)if(f<(h+=l[t]))return i[t];throw Error("among: unreachable")}let f={seed:e,seedMax:function(){return 2147483647},reset:function(){return e(123456),f},next:function(){return t=o(t),f},random:r,between:c,int:function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];let[o,i,l]=a(e);return o+Math.floor(l(r())*(i-o))},chance:function(t){return r()<t},shuffle:function(t){let{mutate:e=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e&&Array.isArray(t)?t:[...t],o=n.length;for(let t=0;t<o;t++){let e=Math.floor(o*r()),i=n[t];n[t]=n[e],n[e]=i}return n},pick:s,createPicker:function(t){let e=t.map(t=>{let[e]=t;return e}),r=t.map(t=>{let[e,r]=t;return r}),n=r.reduce((t,e)=>t+e,0);for(let[t,e]of r.entries())r[t]=e/n;return()=>s(e,r,{weightsAreNormalized:!0})},vector:function(t,e){let[r=0,n=1]=Array.isArray(e)?e:[null==e?void 0:e.min,null==e?void 0:e.max];for(let e of Object.keys(t))t[e]=c(r,n);return t},unitVector:function(t,e){let[r=-1,n=1]=Array.isArray(e)?e:[null==e?void 0:e.min,null==e?void 0:e.max],o=Object.keys(t),i=o.map(()=>c(r,n)),l=Math.sqrt(i.reduce((t,e)=>t+e*e,0));for(let[e,r]of o.entries())t[r]=i[e]/l;return t},boxMuller:function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=r(),o=r(),i=Math.sqrt(-2*Math.log(n)),l=2*Math.PI*o;return[t+e*i*Math.cos(l),t+e*i*Math.sin(l)]}};return f}let c=class{constructor(t){Object.assign(this,a().seed(t))}};Object.assign(c,a())}},function(t){t.O(0,[8960,5244,8423,3662,7579,893,2290,1943,6626,6028,550,5003,8558,1658,3510,1744],function(){return t(t.s=66382)}),_N_E=t.O()}]);