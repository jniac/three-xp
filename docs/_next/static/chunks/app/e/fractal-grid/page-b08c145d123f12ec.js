(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4978],{17746:function(t,e,n){Promise.resolve().then(n.bind(n,79841))},79841:function(t,e,n){"use strict";n.d(e,{Main:function(){return b}});var r=n(78485),i=n(494),o=n(9710),u=n(8834),l=n(52471),c=n(63549),a=n(87858),f=n(27275),s=n(48583),d=n(48181);n(94588);let h=(0,f.createContext)(null);function v(t,e){let n=(0,f.useContext)(h);return(0,s.sv)(async function*(e,r){if(t){let e=t(n,r);if(e&&"function"==typeof e.next)do{let{value:t,done:n}=await e.next();if(n)break;yield t}while(r.mounted)}},null!=e?e:"always"),n}let y={className:"",assetsPath:"/"};function m(t){let{children:e,className:n,assetsPath:i}={...y,...t},o=(0,f.useMemo)(()=>new d.Vu,[]);o.loader.setPath(i);let{ref:u}=(0,s.Nv)({debounce:!0},function*(t,e){yield o.initialize(t),e.triggerRender(),Object.assign(window,{three:o})},[]);return(0,r.jsx)("div",{ref:u,className:n,style:{position:"absolute",inset:0},children:(0,r.jsx)(h.Provider,{value:o,children:o.initialized&&e})})}function g(t){return function(){let[t,e]=(0,f.useState)(!1);return(0,f.useLayoutEffect)(()=>{e(!0)},[]),t}()&&(0,r.jsx)(m,{...t})}function p(){return!function(t,e,n){let r=(0,f.useMemo)(()=>new l.Group,[]);r.name=t,v(async function*(t,n){if(t.scene.add(r),yield()=>{r.clear(),r.removeFromParent()},e){let i=e(r,t,n);if(i&&"function"==typeof i.next)do{let{value:t,done:e}=await i.next();if(e)break;yield t}while(n.mounted)}},n)}("fractal-grid",function*(t){(0,a.cY)(new l.Mesh(new l.TorusKnotGeometry(1,.333,512,32),new c.P({color:"#0cf"})),t)},[]),null}function w(){return v(function*(t){(0,u.a)({three:t});let e=new i.F({size:6});yield e.initialize(t.renderer.domElement),yield(0,o.RC)("three",n=>{let{aspect:r,camera:i}=t;e.update(i,r,n.deltaTime)})},[]),null}function b(){return(0,r.jsx)("div",{className:"FractalGrid",children:(0,r.jsxs)(g,{children:[(0,r.jsx)("h1",{children:"FractalGrid"}),(0,r.jsx)(w,{}),(0,r.jsx)(p,{})]})})}},8834:function(t,e,n){"use strict";n.d(e,{Leak:function(){return l},a:function(){return u}});var r=n(40855),i=n(79509),o=n(28142);function u(t){Object.assign(window,{...i,...r,...t,PRNG:o.T})}function l(t){return u(t),null}},94588:function(t,e,n){"use strict";n.d(e,{N:function(){return u}});var r=n(52471),i=n(81796);new r.Vector3(0,0,0),new r.Euler(0,0,0,"XYZ"),new r.Vector3(1,1,1);let o={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,rotationOrder:"XYZ",rotationUnit:"rad",scaleX:1,scaleY:1,scaleZ:1,scaleScalar:1,visible:void 0,name:void 0,parent:void 0};function u(t,e){let{x:n,y:u,z:l,position:c=new r.Vector3(n,u,l),rotationX:a,rotationY:f,rotationZ:s,rotationOrder:d,rotationUnit:h,rotation:v,scaleX:y,scaleY:m,scaleZ:g,scaleScalar:p,scale:w=new r.Vector3(y,m,g).multiplyScalar(p),visible:b,name:x,parent:j}={...o,...e};return(0,i.Q7)(c,t.position),(0,i.Gg)(null!=v?v:[a,f,s,d,h],t.rotation),(0,i.Q7)(w,t.scale),void 0!==b&&(t.visible=b),void 0!==x&&(t.name=x),void 0!==j&&j.add(t),t}},87858:function(t,e,n){"use strict";n.d(e,{H$:function(){return l},bB:function(){return u},cY:function(){return o}});var r=n(52471),i=n(94588);function o(t,e,n){return e&&(e instanceof r.Object3D?e.add(t):(0,i.N)(t,e)),null==n||n(t),t}let u=o;function l(t,e){return function(t,e){let n=t;for(;n.parent;){if(n.parent===e)return!0;n=n.parent}return!1}(e,t)}},40855:function(t,e,n){"use strict";function r(t,e){for(let n of t)if(e(n))return!0;return!1}function i(t,e){for(let n of t)if(!e(n))return!1;return!0}function o(t,e,n){let r=[];function i(t){let e=[];return r[t]=e,e}if(void 0!==n)for(let t=0;t<n;t++)i(t);for(let n of t){var o;let t=e(n);(null!==(o=r[t])&&void 0!==o?o:i(t)).push(n)}return r}n.r(e),n.d(e,{every:function(){return i},some:function(){return r},split:function(){return o}})},28142:function(t,e,n){"use strict";n.d(e,{T:function(){return a}});let r=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(t=(t=(7*t+Math.sqrt(t)+16087*Math.sin(t))%2147483647)<0?t+2147483647:t)>1?2147483647&t:0===t?345678:123456},i=t=>t=2147483647&Math.imul(t,48271),o=t=>(t-1)/2147483646,u=t=>t,l={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function c(){let t=i(i(r(123456)));function e(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof e&&(e=e.split("").reduce((t,e)=>7*t+e.charCodeAt(0),0)),t=i(i(r(e))),s}function n(){return o(t=i(t))}function c(t){switch(t.length){default:return[0,1,u];case 1:return[0,t[0],u];case 2:return[t[0],t[1],u];case 3:return[t[0],t[1],t[2]]}}function a(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[i,o,u]=c(e);return i+(o-i)*u(n())}function f(){for(var t,e=arguments.length,r=Array(e),i=0;i<e;i++)r[i]=arguments[i];let[o,u,{weightsAreNormalized:c,indexOffset:a,forbiddenItems:f}]=function(t){let[e,n=null,r]=t,i={...l,...r};if(Array.isArray(e))return[e,n,i];if("object"==typeof e)return[Object.values(e),n?Object.values(n):null,i];throw Error("pick: unsupported options type")}(r);if(f.length>0){let e=new Set;for(let t of f){let n=o.indexOf(t);n>=0&&e.add(n)}if(o=o.filter((t,n)=>!e.has(n)),u=null!==(t=null==u?void 0:u.filter((t,n)=>!e.has(n)))&&void 0!==t?t:null,0===o.length)throw Error("pick: all items are forbidden")}if(null===u){let t=Math.floor(n()*o.length);return a&&(t+=a,(t%=o.length)<0&&(t+=o.length)),o[t]}if(!c){let t=u.reduce((t,e)=>t+e,0);u=u.map(e=>e/t)}let s=n(),d=0;for(let t=0;t<o.length;t++)if(s<(d+=u[t]))return o[t];throw Error("among: unreachable")}let s={seed:e,seedMax:function(){return 2147483647},reset:function(){return e(123456),s},next:function(){return t=i(t),s},random:n,between:a,around:function(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[i=1,o=u]=e,l=2*n();return(l>1?1:-1)*o(l>1?l-1:l)*i},int:function(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[i,o,u]=c(e);return i+Math.floor(u(n())*(o-i))},chance:function(t){return n()<t},shuffle:function(t){let{mutate:e=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=e&&Array.isArray(t)?t:[...t],i=r.length;for(let t=0;t<i;t++){let e=Math.floor(i*n()),o=r[t];r[t]=r[e],r[e]=o}return r},pick:f,createPicker:function(t){let e=t.map(t=>{let[e]=t;return e}),n=t.map(t=>{let[e,n]=t;return n}),r=n.reduce((t,e)=>t+e,0);for(let[t,e]of n.entries())n[t]=e/r;return()=>f(e,n,{weightsAreNormalized:!0})},vector:function(t,e){let[n=0,r=1]=Array.isArray(e)?e:[null==e?void 0:e.min,null==e?void 0:e.max];for(let e of Object.keys(t))t[e]=a(n,r);return t},unitVector:function(t,e){let[n=-1,r=1]=Array.isArray(e)?e:[null==e?void 0:e.min,null==e?void 0:e.max],i=Object.keys(t),o=i.map(()=>a(n,r)),u=Math.sqrt(o.reduce((t,e)=>t+e*e,0));for(let[e,n]of i.entries())t[n]=o[e]/u;return t},boxMuller:function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=n(),i=n(),o=Math.sqrt(-2*Math.log(r)),u=2*Math.PI*i;return[t+e*o*Math.cos(u),t+e*o*Math.sin(u)]}};return s}let a=class{constructor(t){Object.assign(this,c().seed(t))}};Object.assign(a,c())}},function(t){t.O(0,[5244,6712,6666,5792,2452,7741,2722,4940,8648,4831,9918,8181,1535,2920,7936,1744],function(){return t(t.s=17746)}),_N_E=t.O()}]);