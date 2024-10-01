"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9111],{5714:function(t,e,n){n.d(e,{v:function(){return r}});let r={development:!1}},47804:function(t,e,n){n.d(e,{H7:function(){return v},Ky:function(){return f},_v:function(){return h}});var r=n(41291),o=n(81406),i=n(64740),l=n(13841),a=n(53679),u=n(5714),c=n(92605);let s=(0,o.createContext)(null);function f(t,e){let n=(0,o.useContext)(s);return(0,l.sv)(async function*(e,r){if(t){let e=t(n,r);if(e&&"function"==typeof e.next)do{let{value:t,done:n}=await e.next();if(n)break;yield t}while(r.mounted)}},null!=e?e:"always"),n}function h(t,e,n){let r=(0,o.useMemo)(()=>new i.Group,[]);return r.name=t,f(async function*(t,n){if(t.scene.add(r),yield()=>{r.clear(),r.removeFromParent()},e){let o=e(r,t,n);if(o&&"function"==typeof o.next)do{let{value:t,done:e}=await o.next();if(e)break;yield t}while(n.mounted)}},n),r}function d(t){let{children:e,className:n}=t,c=(0,o.useMemo)(()=>new a.Vu,[]),{ref:f}=(0,l.sv)(function*(t){let e=u.v.development?"/assets/":"/three-xp/assets/";c.loader.setPath(e),yield c.init(t),Object.assign(window,{three:c,THREE:i})},[]);return(0,r.jsx)("div",{ref:f,className:"ThreeProvider absolute-through ".concat(null!=n?n:""),children:(0,r.jsx)(s.Provider,{value:c,children:e})})}function v(t){return(0,c.O)()&&(0,r.jsx)(d,{...t})}},92605:function(t,e,n){n.d(e,{O:function(){return o}});var r=n(81406);function o(){let[t,e]=(0,r.useState)(!1);return(0,r.useLayoutEffect)(()=>{e(!0)},[]),t}},32678:function(t,e,n){n.d(e,{w:function(){return c}});var r=n(64740),o=n(783);let i={axis:"x",length:1,radialSegments:12,radius:.01,coneRatio:.1,radiusScale:1,vertexColor:!0,baseCap:"flat",color:"white"},l=new r.Color;function a(t){let{axis:e,length:n,radius:a,radialSegments:u,coneRatio:c,radiusScale:s,vertexColor:f,baseCap:h,color:d}={...i,...t},v=a*s,m=n*c,g=new r.ConeGeometry(3*v,m,u),y=new r.CylinderGeometry(v,v,1,u,1,!0),p=n-m,w=n-.5*m;g.rotateZ(-Math.PI/2).translate(w,0,0),y.scale(1,p,1).rotateZ(-Math.PI/2).translate(.5*p,0,0);let x="none"===h?new r.BufferGeometry:"flat"===h?new r.CircleGeometry(v,u).rotateY(-Math.PI/2):new r.SphereGeometry(v,u,3,0,2*Math.PI,0,.5*Math.PI).rotateZ(Math.PI/2).rotateX(Math.PI/2),M=(0,o.n4)([g,y,x]);switch(e){case"y":M.rotateZ(Math.PI/2);break;case"z":M.rotateY(-Math.PI/2)}if(f){let t=M.attributes.position.count,e=new r.BufferAttribute(new Float32Array(3*t),3);M.setAttribute("color",e),l.set(d);for(let n=0;n<t;n++)e.setXYZ(n,l.r,l.g,l.b)}return M}let u={xColor:"#ff3333",yColor:"#33cc66",zColor:"#3366ff"};class c extends r.BufferGeometry{constructor(t){super();let{xColor:e,yColor:n,zColor:r,...i}={...u,...t},l=a({...i,axis:"x",color:e}),c=a({...i,axis:"y",color:n}),s=a({...i,axis:"z",color:r}),f=(0,o.n4)([l,c,s]);this.copy(f),f.dispose()}}},75952:function(t,e,n){n.d(e,{P:function(){return o}});var r=n(64740);class o extends r.ShaderMaterial{constructor(t){let{vertexColors:e=!0,...n}=null!=t?t:{};super({...n,uniforms:{uSunPosition:{value:new r.Vector3(.5,.7,.3)}},vertexColors:e,vertexShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vColor = color;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nuniform vec3 uSunPosition;\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  light = mix(0.1, 1.0, light);\n  gl_FragColor = vec4(vColor * light, 1.0);\n}\n"}),this.sunPosition=this.uniforms.uSunPosition.value}}},27636:function(t,e,n){n.d(e,{T:function(){return c}});let r=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(t=(t=(7*t+Math.sqrt(t)+16087*Math.sin(t))%2147483647)<0?t+2147483647:t)>1?2147483647&t:0===t?345678:123456},o=t=>t=2147483647&Math.imul(t,48271),i=t=>(t-1)/2147483646,l=t=>t,a={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function u(){let t=o(o(r(123456)));function e(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof e&&(e=e.split("").reduce((t,e)=>7*t+e.charCodeAt(0),0)),t=o(o(r(e))),f}function n(){return i(t=o(t))}function u(t){switch(t.length){default:return[0,1,l];case 1:return[0,t[0],l];case 2:return[t[0],t[1],l];case 3:return[t[0],t[1],t[2]]}}function c(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[o,i,l]=u(e);return o+(i-o)*l(n())}function s(){for(var t,e=arguments.length,r=Array(e),o=0;o<e;o++)r[o]=arguments[o];let[i,l,{weightsAreNormalized:u,indexOffset:c,forbiddenItems:s}]=function(t){let[e,n=null,r]=t,o={...a,...r};if(Array.isArray(e))return[e,n,o];if("object"==typeof e)return[Object.values(e),n?Object.values(n):null,o];throw Error("pick: unsupported options type")}(r);if(s.length>0){let e=new Set;for(let t of s){let n=i.indexOf(t);n>=0&&e.add(n)}if(i=i.filter((t,n)=>!e.has(n)),l=null!==(t=null==l?void 0:l.filter((t,n)=>!e.has(n)))&&void 0!==t?t:null,0===i.length)throw Error("pick: all items are forbidden")}if(null===l){let t=Math.floor(n()*i.length);return c&&(t+=c,(t%=i.length)<0&&(t+=i.length)),i[t]}if(!u){let t=l.reduce((t,e)=>t+e,0);l=l.map(e=>e/t)}let f=n(),h=0;for(let t=0;t<i.length;t++)if(f<(h+=l[t]))return i[t];throw Error("among: unreachable")}let f={seed:e,seedMax:function(){return 2147483647},reset:function(){return e(123456),f},next:function(){return t=o(t),f},random:n,between:c,int:function(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[o,i,l]=u(e);return o+Math.floor(l(n())*(i-o))},chance:function(t){return n()<t},shuffle:function(t){let{mutate:e=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=e&&Array.isArray(t)?t:[...t],o=r.length;for(let t=0;t<o;t++){let e=Math.floor(o*n()),i=r[t];r[t]=r[e],r[e]=i}return r},pick:s,createPicker:function(t){let e=t.map(t=>{let[e]=t;return e}),n=t.map(t=>{let[e,n]=t;return n}),r=n.reduce((t,e)=>t+e,0);for(let[t,e]of n.entries())n[t]=e/r;return()=>s(e,n,{weightsAreNormalized:!0})},vector:function(t,e){let[n=0,r=1]=Array.isArray(e)?e:[null==e?void 0:e.min,null==e?void 0:e.max];for(let e of Object.keys(t))t[e]=c(n,r);return t},unitVector:function(t,e){let[n=-1,r=1]=Array.isArray(e)?e:[null==e?void 0:e.min,null==e?void 0:e.max],o=Object.keys(t),i=o.map(()=>c(n,r)),l=Math.sqrt(i.reduce((t,e)=>t+e*e,0));for(let[e,n]of o.entries())t[n]=i[e]/l;return t},boxMuller:function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=n(),o=n(),i=Math.sqrt(-2*Math.log(r)),l=2*Math.PI*o;return[t+e*i*Math.cos(l),t+e*i*Math.sin(l)]}};return f}let c=class{constructor(t){Object.assign(this,u().seed(t))}};Object.assign(c,u())}}]);