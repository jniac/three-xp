(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6249],{37255:function(e,t,n){Promise.resolve().then(n.bind(n,10358))},64830:function(e,t,n){"use strict";n.d(t,{hR:function(){return y},kB:function(){return h}});var r=n(32617),i=n(87200),o=n(23657),u=n(74707),l=n(88780),s=n(11561),a=n(30699),c=n(97809),f=n(29368);let d=(0,i.createContext)(null);function h(e){let{fn:t}=e;return!function(e,t){let n=(0,i.useContext)(d);(0,o.sv)(async function*(t,r){if(e){let t=e(n,r);if(t&&"function"==typeof t.next)do{let{value:e,done:n}=await t.next();if(n)break;yield e}while(r.mounted)}},null!=t?t:"always")}(t,"always"),null}function v(e){let{children:t}=e,n=(0,i.useMemo)(()=>(function(e){let{width:t=window.innerWidth,height:n=window.innerHeight,pixelRatio:r=window.devicePixelRatio}=e,i=f.vB.get("ThreeTicker"),o=new l.Vector2(t,n),u=new l.Vector2(t,n).multiplyScalar(r),d=new l.WebGLRenderer({antialias:!0,alpha:!0});d.setPixelRatio(r),d.setSize(t,n);let h=new l.PerspectiveCamera(50,t/n,.1,100);h.position.z=5;let v=new s.z(h,d.domElement);v.enableDamping=!0;let y=new l.Scene;async function p(){d.render(y,h)}return{renderer:d,size:o,fullSize:u,get pixelRatio(){return r},get aspect(){return t/n},camera:h,orbitControls:v,scene:y,ticker:i,init:function*(e){yield i.onTick(e=>{v.update(),p()}),yield(0,c.f)(e,{onSize:e=>{let{size:{x:i,y:l}}=e;!function(e,i){let l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:devicePixelRatio;t=e,n=i,r=l,o.set(t,n),u.set(t,n).multiplyScalar(r),d.setSize(t,n),d.setPixelRatio(r),h.aspect=t/n,h.updateProjectionMatrix()}(i,l)}}),yield(0,a.s)(i.requestActivation),e.appendChild(d.domElement),yield()=>{v.dispose(),d.dispose(),d.domElement.remove()}}}})({width:window.innerWidth,height:window.innerHeight}),[]),{ref:u}=(0,o.sv)(function*(e){yield*n.init(e),Object.assign(window,{three:n})},[]);return(0,r.jsx)(d.Provider,{value:n,children:(0,r.jsxs)("div",{className:"absolute-through",children:[(0,r.jsx)("div",{ref:u,className:"absolute-through"}),(0,r.jsx)("div",{className:"absolute-through",children:t})]})})}function y(e){let{children:t}=e;return(0,u.O)()&&(0,r.jsx)(v,{children:t})}},74707:function(e,t,n){"use strict";n.d(t,{O:function(){return i}});var r=n(87200);function i(){let[e,t]=(0,r.useState)(!1);return(0,r.useLayoutEffect)(()=>{t(!0)},[]),e}},30699:function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[r,i]=1===t.length?[window,t[0]]:t,o=()=>{i()};return r.addEventListener("mousemove",o,{passive:!0}),r.addEventListener("mousedown",o,{passive:!0}),r.addEventListener("mouseup",o,{passive:!0}),r.addEventListener("touchstart",o,{passive:!0}),r.addEventListener("touchmove",o,{passive:!0}),r.addEventListener("wheel",o,{passive:!0}),r.addEventListener("keydown",o,{passive:!0}),r.addEventListener("keyup",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),{destroy:()=>{r.removeEventListener("mousemove",o),r.removeEventListener("mousedown",o),r.removeEventListener("mouseup",o),r.removeEventListener("touchstart",o),r.removeEventListener("touchmove",o),r.removeEventListener("wheel",o),r.removeEventListener("keydown",o),r.removeEventListener("keyup",o),window.removeEventListener("resize",o)}}}n.d(t,{s:function(){return r}})},47365:function(e,t,n){"use strict";function r(e,t){return"*"===t||("string"==typeof t?t===e:t instanceof RegExp?t.test(e):"function"==typeof t&&t(e))}n.d(t,{p:function(){return u}});let i={preventDefault:!1,strictTarget:void 0},o={key:"*",keyCaseInsensitive:!0,code:"*",noModifiers:!1,modifiers:""};function u(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[u,l,s]=1===t.length?[document.body,{},t[0]]:2===t.length?[t[0],{},t[1]]:t,{preventDefault:a}={...i,...l},c=e=>{var t;if((null!==(t=l.strictTarget)&&void 0!==t?!!t:u===document.body)&&e.target!==u)return;let{ctrlKey:n,altKey:i,shiftKey:c,metaKey:f}=e,d={event:e,modifiers:{ctrl:n,alt:i,shift:c,meta:f}};for(let t=0,u=s.length;t<u;t++){let[u,l]=s[t],{key:h,keyCaseInsensitive:v,code:y,noModifiers:p,modifiers:g}=function(e){let t="string"==typeof e?{...o,key:e}:{...o,...e};return t.keyCaseInsensitive&&"string"==typeof t.key&&(t.key=t.key.toLowerCase()),t}(u);Object.values({key:r(v?e.key.toLowerCase():e.key,h),code:r(e.code,y),noModifiers:!p||!1===n&&!1===i&&!1===c&&!1===f,modifiers:function(e,t){let{ctrlKey:n,altKey:r,shiftKey:i,metaKey:o}=e;if("function"==typeof t)return t({ctrl:n,alt:r,shift:i,meta:o});let{ctrl:u=!1,alt:l=!1,shift:s=!1,meta:a=!1}=Object.fromEntries(t.split("-").map(e=>[e,!0]));return u===n&&l===r&&s===i&&a===o}(e,g)}).every(Boolean)&&(a&&e.preventDefault(),l(d))}};return u.addEventListener("keydown",c,{passive:!1}),{destroy:()=>{u.removeEventListener("keydown",c)}}}},97809:function(e,t,n){"use strict";let r;n.d(t,{f:function(){return l}});let i=new WeakMap,o=(r=()=>{let e=new WeakMap;return{resizeObserver:new ResizeObserver(t=>{for(let r of t){var n;null===(n=e.get(r.target))||void 0===n||n(r)}}),resizeObserverMap:e}},()=>{let e=i.get(r);if(void 0===e){let e=r();return i.set(r,e),e}return e});class u{get aspect(){return this.size.x/this.size.y}constructor(e,t){this.element=e,this.size=t}}function l(e,t){let{onSize:n}=function(e){if("function"==typeof e)return{onSize:e};let{onSize:t=()=>{}}=null!=e?e:{};return{onSize:t}}(t),r=new DOMPoint(0,0);if(e instanceof Window){let t=()=>{r.x=window.innerWidth,r.y=window.innerHeight,n(new u(e,r))};return e.addEventListener("resize",t),t(),{destroy:()=>{e.removeEventListener("resize",t)}}}{let{resizeObserver:t,resizeObserverMap:i}=o();return t.observe(e),i.set(e,t=>{r.x=t.contentRect.width,r.y=t.contentRect.height,n(new u(e,r))}),{destroy:()=>t.unobserve(e)}}}},32219:function(e,t,n){"use strict";n.d(t,{FE:function(){return i.FE},Gg:function(){return f},Q7:function(){return a},Xe:function(){return d},iK:function(){return s},ux:function(){return i.ux}});var r=n(88780),i=n(20821),o=n(26211);function u(e){return"string"==typeof e&&/^(rad|deg|turn)$/.test(e)}function l(e){return"string"==typeof e&&/^(XYZ|XZY|YXZ|YZX|ZXY|ZYX)$/.test(e)}function s(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new r.Vector2;return i.iK(e,t)}function a(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new r.Vector3;return i.Q7(e,t)}let c={defaultOrder:"XYZ"};function f(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[s,{defaultOrder:a},f]=(()=>{if(1===t.length)return[t[0],c,new r.Euler];if(2===t.length)return(0,o.Dr)(t[1])?[t[0],c,t[1]]:[t[0],t[1],new r.Euler];if(3===t.length)return t;throw Error("Invalid number of arguments")})();if((0,o.Dr)(s))return f.copy(s);if(Array.isArray(s)){let[e,t,n,r,o]=s,c=u(r)?r:u(o)?o:"rad",d=l(r)?r:l(o)?o:a;return f.set((0,i.FE)(e,c),(0,i.FE)(t,c),(0,i.FE)(n,c),d)}let{x:d,y:h,z:v,order:y=a,unit:p="rad"}=s;return f.set((0,i.FE)(d,p),(0,i.FE)(h,p),(0,i.FE)(v,p),y)}let d=(()=>{let e=new r.Vector3,t=new r.Euler,n=new r.Vector3,i=new r.Quaternion;return function(r,u){let{x:l=0,y:s=0,z:c=0,position:d={x:l,y:s,z:c},rotationX:h=0,rotationY:v=0,rotationZ:y=0,rotationOrder:p="XYZ",rotation:g={x:h,y:v,z:y,order:p},scaleX:m=1,scaleY:w=1,scaleZ:x=1,scaleScalar:E=1,scale:M={x:m,y:w,z:x}}=r;if((0,o.Eq)(u))return a(d,e),f(g,t),a(M,n).multiplyScalar(E),i.setFromEuler(t),u.compose(e,i,n);if((0,o.nK)(u))return a(d,u.position),f(g,u.rotation),a(M,u.scale).multiplyScalar(E),u;throw Error("Invalid out argument")}})()},26211:function(e,t,n){"use strict";function r(e){return!!e.isVector3}function i(e){return!!e.isEuler}function o(e){return!!e.isMatrix4}function u(e){return!!e.isObject3D}n.d(t,{Dr:function(){return i},Eq:function(){return o},nK:function(){return u},uU:function(){return r}})},20821:function(e,t,n){"use strict";n.d(t,{FE:function(){return o},Q7:function(){return a},iK:function(){return s},ux:function(){return u}});var r=n(96672);let i={rad:1,deg:Math.PI/180,turn:2*Math.PI};function o(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"rad",n=t,r=0;if("number"==typeof e)r=e;else{let t=e.match(/^\s*(-?[0-9.]+)\s*(\/\s*-?[0-9.]+)?\s*(rad|deg|turn)\s*$/);if(t){let[e,i,o,u]=t;r=Number.parseFloat(i),o&&(r/=Number.parseFloat(o.slice(1))),n=u}else r=Number.parseFloat(e)}return r*i[n]}function u(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"rad";return"".concat((0,r.uf)(e/i[t])).concat(t)}function l(e){return"number"==typeof e}function s(e,t,n,r){if(null!=n||(n=0),null!=r||(r=l),null!=t||(t={x:n,y:n}),null==e)return t;if(r(e))return t.x=e,t.y=e,t;if(Array.isArray(e)){let[n,r]=e;return t.x=n,t.y=r,t}if("width"in e){let{width:n,height:r}=e;return t.x=n,t.y=r,t}let{x:i,y:o}=e;return t.x=i,t.y=o,t}function a(e,t,n,r){if(null!=r||(r=l),null!=n||(n=0),null!=t||(t={x:n,y:n,z:n}),null==e)return t;if(r(e))return t.x=e,t.y=e,t.z=e,t;if(Array.isArray(e)){let[r,i,o=n]=e;return t.x=r,t.y=i,t.z=o,t}if("width"in e){let{width:r,height:i=n,depth:o=n}=e;return t.x=r,t.y=i,t.z=o,t}let{x:i=n,y:o=n,z:u=n}=e;return t.x=i,t.y=o,t.z=u,t}},2132:function(e,t,n){"use strict";function r(e,t,n,r){return t-(t-e)*Math.exp(- -Math.log(n)*r)}function i(e,t){return 1-Math.exp(- -Math.log(e)*t)}function o(e,t,n){return i(e**(1/t),n)}n.d(t,{Lj:function(){return r},M3:function(){return i},zl:function(){return o}})},6246:function(e,t,n){"use strict";n.d(t,{T:function(){return a}});let r=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(e=(e=(7*e+Math.sqrt(e)+16087*Math.sin(e))%2147483647)<0?e+2147483647:e)>1?2147483647&e:0===e?345678:123456},i=e=>e=2147483647&Math.imul(e,48271),o=e=>(e-1)/2147483646,u=e=>e,l={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function s(){let e=i(i(r(123456)));function t(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof t&&(t=t.split("").reduce((e,t)=>7*e+t.charCodeAt(0),0)),e=i(i(r(t))),d}function n(){return o(e=i(e))}function s(e){switch(e.length){default:return[0,1,u];case 1:return[0,e[0],u];case 2:return[e[0],e[1],u];case 3:return[e[0],e[1],e[2]]}}function a(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i,o,u]=s(t);return i+(o-i)*u(n())}function c(){for(var e,t=arguments.length,r=Array(t),i=0;i<t;i++)r[i]=arguments[i];let[o,u,{weightsAreNormalized:s,indexOffset:a,forbiddenItems:c}]=function(e){let[t,n=null,r]=e,i={...l,...r};if(Array.isArray(t))return[t,n,i];if("object"==typeof t)return[Object.values(t),n?Object.values(n):null,i];throw Error("pick: unsupported options type")}(r);if(c.length>0){let t=new Set;for(let e of c){let n=o.indexOf(e);n>=0&&t.add(n)}if(o=o.filter((e,n)=>!t.has(n)),u=null!==(e=null==u?void 0:u.filter((e,n)=>!t.has(n)))&&void 0!==e?e:null,0===o.length)throw Error("pick: all items are forbidden")}if(null===u){let e=Math.floor(n()*o.length);return a&&(e+=a,(e%=o.length)<0&&(e+=o.length)),o[e]}if(!s){let e=u.reduce((e,t)=>e+t,0);u=u.map(t=>t/e)}let f=n(),d=0;for(let e=0;e<o.length;e++)if(f<(d+=u[e]))return o[e];throw Error("among: unreachable")}function f(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=n(),i=n(),o=Math.sqrt(-2*Math.log(r)),u=2*Math.PI*i;return[e+t*o*Math.cos(u),e+t*o*Math.sin(u)]}let d={seed:t,seedMax:function(){return 2147483647},reset:function(){return t(123456),d},next:function(){return e=i(e),d},random:n,between:a,around:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i=1,o=u]=t,l=2*n();return(l>1?1:-1)*o(l>1?l-1:l)*i},int:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let[i,o,u]=s(t);return i+Math.floor(u(n())*(o-i))},chance:function(e){return n()<e},shuffle:function(e){let{mutate:t=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t&&Array.isArray(e)?e:[...e],i=r.length;for(let e=0;e<i;e++){let t=Math.floor(i*n()),o=r[e];r[e]=r[t],r[t]=o}return r},pick:c,createPicker:function(e){let t=e.map(e=>{let[t]=e;return t}),n=e.map(e=>{let[t,n]=e;return n}),r=n.reduce((e,t)=>e+t,0);for(let[e,t]of n.entries())n[e]=t/r;return()=>c(t,n,{weightsAreNormalized:!0})},vector:function(e,t){let[n=0,r=1]=Array.isArray(t)?t:[null==t?void 0:t.min,null==t?void 0:t.max];for(let t of Object.keys(e))e[t]=a(n,r);return e},unitVector2:function(e){let t=2*Math.PI*n();return e.x=Math.cos(t),e.y=Math.sin(t),e},unitVector3:function(e){let t=n(),r=n(),i=2*Math.PI*t,o=Math.acos(1-2*r);return e.x=Math.sin(o)*Math.cos(i),e.y=Math.sin(o)*Math.sin(i),e.z=Math.cos(o),e},normalVector:function(e){let t=Object.keys(e),n=t.length,r=Math.sqrt(n);for(let i=0;i<n;i+=2){let[o,u]=f();e[t[i]]=o/r,i+1<n&&(e[t[i+1]]=u/r)}return e},unitVector:function(e){let t=Object.keys(e),n=t.length,r=0;for(let i=0;i<n;i+=2){let[o,u]=f();e[t[i]]=o,r+=o*o,i+1<n&&(e[t[i+1]]=u,r+=u*u)}r=Math.sqrt(r);for(let i=0;i<n;i++)e[t[i]]/=r;return e},boxMuller:f};return d}let a=class{constructor(e){Object.assign(this,s().seed(e))}};Object.assign(a,s())},96672:function(e,t,n){"use strict";function r(e){let[t,n]=e.split(".");if(void 0===n)return t;let r=n.length-1;for(;"0"===n[r];)r--;return"."===n[r]&&r--,-1===r?t:t+"."+n.slice(0,r+1)}function i(e){let{maxDigits:t=8}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(t<6)throw Error("maxDigits must be at least 6");if(0===e)return"0";let[n,i]=e.toString().split("."),o=n.length,u=t-o-1;if(o>t||u<0){let[n,i]=e.toPrecision(t).split("e");return n=n.slice(0,t-i.length-1),"".concat(r(n),"e").concat(i)}return Math.abs(e)<1/Math.pow(10,t-2)?r(e.toExponential(t-5)):void 0===i?n:r(e.toFixed(u))}n.d(t,{uf:function(){return i}})},77478:function(e,t,n){"use strict";function r(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}n.d(t,{_:function(){return r}})},72360:function(e,t,n){"use strict";n.d(t,{Z:function(){return i}});var r=n(88780);class i extends r.Line{constructor(e,t){let n=new r.BufferGeometry;n.setAttribute("position",new r.Float32BufferAttribute([1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],3)),n.computeBoundingSphere(),super(n,new r.LineBasicMaterial({fog:!1})),this.light=e,this.color=t,this.type="RectAreaLightHelper";let i=new r.BufferGeometry;i.setAttribute("position",new r.Float32BufferAttribute([1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],3)),i.computeBoundingSphere(),this.add(new r.Mesh(i,new r.MeshBasicMaterial({side:r.BackSide,fog:!1})))}updateMatrixWorld(){if(this.scale.set(.5*this.light.width,.5*this.light.height,1),void 0!==this.color)this.material.color.set(this.color),this.children[0].material.color.set(this.color);else{this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);let e=this.material.color,t=Math.max(e.r,e.g,e.b);t>1&&e.multiplyScalar(1/t),this.children[0].material.color.copy(this.material.color)}this.matrixWorld.extractRotation(this.light.matrixWorld).scale(this.scale).copyPosition(this.light.matrixWorld),this.children[0].matrixWorld.copy(this.matrixWorld)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}}},function(e){e.O(0,[6068,7512,1561,3956,812,8100,358,5694,2840,1744],function(){return e(e.s=37255)}),_N_E=e.O()}]);