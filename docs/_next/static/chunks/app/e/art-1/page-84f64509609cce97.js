(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5629],{82577:function(e,t,n){Promise.resolve().then(n.bind(n,11809)),Promise.resolve().then(n.bind(n,1050))},1050:function(e,t,n){"use strict";n.d(t,{Leak:function(){return a}});var r=n(80590),o=n(45003),i=n(27636);function a(){return Object.assign(window,{...o,...r,PRNG:i.T}),null}},93293:function(e,t,n){"use strict";function r(e,t){return"*"===t||("string"==typeof t?t===e:t instanceof RegExp?t.test(e):"function"==typeof t&&t(e))}n.d(t,{p:function(){return a}});let o={preventDefault:!1,strictTarget:!1},i={key:"*",keyCaseInsensitive:!0,code:"*",noModifiers:!1,modifiers:""};function a(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[a,s,u]=1===t.length?[document.body,{},t[0]]:2===t.length?[t[0],{},t[1]]:t,{preventDefault:l}={...o,...s},f=e=>{if(s.strictTarget&&e.target!==a)return;let{ctrlKey:t,altKey:n,shiftKey:o,metaKey:f}=e,c={event:e,modifiers:{ctrl:t,alt:n,shift:o,meta:f}};for(let a=0,s=u.length;a<s;a++){let[s,x]=u[a],{key:d,keyCaseInsensitive:h,code:p,noModifiers:w,modifiers:g}=function(e){let t="string"==typeof e?{...i,key:e}:{...i,...e};return t.keyCaseInsensitive&&"string"==typeof t.key&&(t.key=t.key.toLowerCase()),t}(s);Object.values({key:r(h?e.key.toLowerCase():e.key,d),code:r(e.code,p),noModifiers:!w||!1===t&&!1===n&&!1===o&&!1===f,modifiers:!g||function(e,t){let{ctrlKey:n,altKey:r,shiftKey:o,metaKey:i}=e;if("function"==typeof t)return t({ctrl:n,alt:r,shift:o,meta:i});let{ctrl:a=!1,alt:s=!1,shift:u=!1,meta:l=!1}=Object.fromEntries(t.split("-").map(e=>[e,!0]));return a===n&&s===r&&u===o&&l===i}(e,g)}).every(Boolean)&&(l&&e.preventDefault(),x(c))}};return a.addEventListener("keydown",f,{passive:!1}),{destroy:()=>{a.removeEventListener("keydown",f)}}}},35351:function(e,t,n){"use strict";let r;n.d(t,{f:function(){return s}});let o=new WeakMap,i=(r=()=>{let e=new WeakMap;return{resizeObserver:new ResizeObserver(t=>{for(let r of t){var n;null===(n=e.get(r.target))||void 0===n||n(r)}}),resizeObserverMap:e}},()=>{let e=o.get(r);if(void 0===e){let e=r();return o.set(r,e),e}return e});class a{get aspect(){return this.size.x/this.size.y}constructor(e,t){this.element=e,this.size=t}}function s(e,t){let{onSize:n}=function(e){if("function"==typeof e)return{onSize:e};let{onSize:t=()=>{}}=null!=e?e:{};return{onSize:t}}(t),r=new DOMPoint(0,0);if(e instanceof Window){let t=()=>{r.x=window.innerWidth,r.y=window.innerHeight,n(new a(e,r))};return e.addEventListener("resize",t),t(),{destroy:()=>{e.removeEventListener("resize",t)}}}{let{resizeObserver:t,resizeObserverMap:o}=i();return t.observe(e),o.set(e,t=>{r.x=t.contentRect.width,r.y=t.contentRect.height,n(new a(e,r))}),{destroy:()=>t.unobserve(e)}}}},85692:function(e,t,n){"use strict";n.d(t,{l:function(){return r}});let r="\n#ifndef GLSL_BASIC\n#define GLSL_BASIC\n\nfloat clamp01(float x) {\n  return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;\n}\n\n#endif\n"},2164:function(e,t,n){"use strict";n.d(t,{i:function(){return i}});var r=n(85692);let o=["linear"];for(let e=1;e<=10;e++)o.push("easeIn".concat(e)),o.push("easeOut".concat(e)),o.push("easeInOut".concat(e)),o.push("easeOutIn".concat(e));let i="\n#ifndef GLSL_EASING\n#define GLSL_EASING\n\n".concat(r.l,"\n\nfloat easePow1(float x) {\n  return x;\n}\n\nfloat easePow2(float x) {\n  return x * x;\n}\n\nfloat easePow3(float x) {\n  return x * x * x;\n}\n\nfloat easePow4(float x) {\n  x *= x;\n  return x *= x;\n}\n\nfloat easePow5(float x) {\n  float x0 = x;\n  x *= x;\n  x *= x;\n  return x0 * x;\n}\n\nfloat easePow6(float x) {\n  x *= x * x;\n  return x *= x;\n}\n\nfloat easePow7(float x) {\n  float x0 = x;\n  x *= x * x;\n  x *= x;\n  return x0 * x;\n}\n\nfloat easePow8(float x) {\n  x *= x;\n  x *= x;\n  return x *= x;\n}\n\nfloat easePow9(float x) {\n  x *= x * x;\n  return x *= x * x;\n}\n\nfloat easePow10(float x) {\n  float x0 = x;\n  x *= x * x;\n  x *= x * x;\n  return x0 * x;\n}\n\nfloat linear(float x) {\n  return clamp01(x);\n}\n\n").concat(Array.from({length:10},(e,t)=>{let n=t+1;return"\n\nfloat easeIn".concat(n," (float x) {\n  return easePow").concat(n,"(clamp01(x));\n}\nfloat easeOut").concat(n," (float x) {\n  return 1.0 - easePow").concat(n,"(clamp01(1.0 - x));\n}\nfloat easeInOut").concat(n," (float x) {\n  return x < 0.5 \n    ? 0.5 * easePow").concat(n,"(2.0 * x) \n    : 1.0 - 0.5 * easePow").concat(n,"(2.0 * (1.0 - x));\n}\nfloat easeOutIn").concat(n," (float x) {\n  return x < 0.5\n    ? 0.5 * (1.0 - easePow").concat(n,"(1.0 - x * 2.0))\n    : 1.0 - 0.5 * (1.0 - easePow").concat(n,"(2.0 * x - 1.0));\n}\n\n").trim()}).join("\n\n"),"\n\n\n// https://www.desmos.com/calculator/mqou4lf9zc?lang=fr\nfloat easeInOut(float x, float p, float i) {\n  return  x <= 0.0 ? 0.0 :\n          x >= 1.0 ? 1.0 :\n          x <= i ? 1.0 / pow(i, p - 1.0) * pow(x, p) :\n          1.0 - 1.0 / pow(1.0 - i, p - 1.0) * pow(1.0 - x, p);\n}\n\n// https://www.desmos.com/calculator/nrjlezusdv\nfloat easeInThenOut(float x, float p) {\n  return 1.0 - pow(abs(2.0 * x - 1.0), p);\n}\n\n#endif\n")},80590:function(e,t,n){"use strict";function r(e,t){for(let n of e)if(t(n))return!0;return!1}function o(e,t){for(let n of e)if(!t(n))return!1;return!0}function i(e,t,n){let r=[];function o(e){let t=[];return r[e]=t,t}if(void 0!==n)for(let e=0;e<n;e++)o(e);for(let n of e){var i;let e=t(n);(null!==(i=r[e])&&void 0!==i?i:o(e)).push(n)}return r}n.r(t),n.d(t,{every:function(){return o},some:function(){return r},split:function(){return i}})},90642:function(e,t,n){"use strict";n.d(t,{v:function(){return r.v}});var r=n(57872)},57872:function(e,t,n){"use strict";n.d(t,{v:function(){return u}});var r=n(37076);class o{_getId(){return o._idHash.init().update(++this._count).getValue()}_registerObject(e){let t=this._getId();return this._weakMap.set(e,t),t}_registerPrimitive(e){let t=this._getId();return this._map.set(e,t),t}_requirePrimitiveId(e){var t;return null!==(t=this._map.get(e))&&void 0!==t?t:this._registerPrimitive(e)}_requireObjectId(e){var t;return null!==(t=this._weakMap.get(e))&&void 0!==t?t:this._registerObject(e)}_requireArrayId(e){let{_arrayHash:t}=o;for(let n of(t.init(),e.flat(16)))t.update(this.requireId(n));return t.getValue()}requireId(e){return!function(e){if(null==e)return!0;switch(typeof e){case"function":case"object":return!1;default:return!0}}(e)?Array.isArray(e)?this._requireArrayId(e):this._requireObjectId(e):this._requirePrimitiveId(e)}constructor(){this._count=1,this._map=new Map,this._weakMap=new WeakMap}}o._idHash=new r.k,o._arrayHash=new r.k;class i{constructor(e,t){this.filter=e,this.callback=t,this.match="*"===e?()=>!0:"string"==typeof e?t=>t===e:e instanceof RegExp?t=>e.test(t):()=>!1}}let a=new o,s=new Map;class u{payloadAssign(e){let{overwrite:t=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.payload=t?{...this.payload,...e}:{...e,...this.payload},this}constructor(e,t,n){var r;this.id=u.nextId++,this.debug={currentListenerIndex:-1,listenerCount:0},this.targetId=a.requireId(e),this.target=e,this.type=null!=t?t:"message",this.payload=n;let o=(null!==(r=s.get(this.targetId))&&void 0!==r?r:[]).filter(e=>e.match(this.type));for(let e of(this.debug.listenerCount=o.length,o))this.debug.currentListenerIndex++,e.callback(this)}}u.send=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[r,o,i]=function(e){let[t,...n]=e;if(2===n.length){let[e,{payload:r}]=n;return[t,e,r]}if(1===n.length){let[e]=n;return"string"==typeof e?[t,e]:[t,void 0,e.payload]}return[t]}(t);return new u(r,o,i)},u.on=function(){for(var e,t=arguments.length,n=Array(t),r=0;r<t;r++)n[r]=arguments[r];let[o,u,l]=function(e){if(2===e.length){let[t,n]=e;return[t,"*",n]}return e}(n),f=a.requireId(o),c=new i(u,l);return(null!==(e=s.get(f))&&void 0!==e?e:(()=>{let e=[];return s.set(f,e),e})()).push(c),{destroy:()=>{!function(e,t){let n=s.get(e);if(n){let r=n.indexOf(t);-1!==r&&(n.splice(r,1),0===n.length&&s.delete(e))}}(f,c)}}},u.debug={listenerMap:s,idRegister:a},u.nextId=0}},function(e){e.O(0,[4330,5244,3662,6626,6028,3706,1809,1658,3510,1744],function(){return e(e.s=82577)}),_N_E=e.O()}]);