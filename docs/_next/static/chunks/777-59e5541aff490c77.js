"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[777],{2974:function(t,e,r){r.d(e,{s:function(){return i}});function i(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[i,n]=1===e.length?[window,e[0]]:e,s=()=>{n()};return i.addEventListener("mousemove",s),i.addEventListener("mousedown",s),i.addEventListener("mouseup",s),i.addEventListener("touchstart",s),i.addEventListener("touchmove",s),i.addEventListener("wheel",s),i.addEventListener("keydown",s),i.addEventListener("keyup",s),window.addEventListener("resize",s),{destroy:()=>{i.removeEventListener("mousemove",s),i.removeEventListener("mousedown",s),i.removeEventListener("mouseup",s),i.removeEventListener("touchstart",s),i.removeEventListener("touchmove",s),i.removeEventListener("wheel",s),i.removeEventListener("keydown",s),i.removeEventListener("keyup",s),window.removeEventListener("resize",s)}}}},9914:function(t,e,r){r.d(e,{sv:function(){return u},Nv:function(){return o}});var i=r(151),n=r(4552);let s={moment:"effect",useDigestProps:!0},a=0;function u(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[u,o,l]=function(t){let[e,r,i]=t;return"object"==typeof e?[r,i,e]:[e,null!=r?r:"always",null!=i?i:{}]}(e),{moment:c,useDigestProps:h}={...s,...l},d=h&&Array.isArray(o)&&o.length>0?[function(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];n.k.init();let i=[...e];for(;i.length>0;){let t=i.shift();if(null==t){n.k.update(123456);continue}switch(typeof t){case"boolean":n.k.update(37842398+(t?0:1));break;case"function":n.k.updateString(t.name),n.k.update(t.length);break;case"string":n.k.updateString(t);break;case"number":n.k.update(t);break;case"object":if("value"in t){i.push(t.value);break}if("uuid"in t){n.k.updateString(t.uuid);break}if("id"in t){n.k.updateString(String(t.id));break}if(Array.isArray(t))i.push(...t);else for(let[e,r]of Object.entries(t))n.k.updateString(e),i.push(r)}}return n.k.getValue()}(o)]:"always"===o?[Math.random()]:o,f=(0,i.useRef)(null),{state:p,destroyables:v}=(0,i.useMemo)(()=>({state:{id:a++,mounted:!0},destroyables:[]}),[]);return(0,({effect:i.useEffect,layoutEffect:i.useLayoutEffect,memo:i.useMemo})[c])(()=>{p.mounted=!0;let t=u(f.current);if(t){let e;let r=t=>"object"==typeof t?t.value:void 0,i=()=>{if(e)return Array.isArray(e)?e.map(r):r(e)},n=t=>{let{value:r,done:i}=t;e=r,p.mounted&&!1===i&&(r&&(Array.isArray(r)?v.push(...r):v.push(r)),s())},s=()=>{let e=t.next(i());e instanceof Promise?e.then(t=>{n(t)}):n(e)};s()}},d),(0,i.useEffect)(()=>()=>{for(let t of(p.mounted=!1,v))t&&("object"==typeof t?t.destroy():t())},d),{ref:f}}function o(t,e,r){return u({...r,moment:"layoutEffect"},t,e)}},4552:function(t,e,r){r.d(e,{k:function(){return n}});let i=t=>(0|t)<0?(2147483647&t)<<1|1:t<<1;class n{static init(){return n._instance.init(),n}static update(t){return n._instance.update(t),n}static updateNumbers(t){return n._instance.updateNumbers(t),n}static updateString(t){return n._instance.updateString(t),n}static getValue(){return n._instance.getValue()}static getValueAsInt32(){return n._instance.getValueAsInt32()}static getDebugString(){return n._instance.getDebugString()}static get value(){return n._instance.value}init(){return this._i32[0]=3735069023,this._i32[1]=770694696,this}getValue(){return this._f64[0]}getValueAsInt32(){return this._i32[0]^this._i32[1]}getValueAsBigUint64(){return new BigUint64Array(this._buffer)[0]}get value(){return this.getValue()}getDebugString(){let[t,e,r,i]=[...this._i32].map(t=>{let e=(t|=0)<0;return t&=2147483647,"".concat(e?"1":"0").concat(t.toString(2).padStart(31,"0"))});return["value:",this.getValue(),"state:",t,e,'last "next" value:',r,i].join("\n")}constructor(){this._buffer=new ArrayBuffer(16),this._f64=new Float64Array(this._buffer),this._i32=new Int32Array(this._buffer),this.update=(()=>{let{_i32:t,_f64:e}=this;return r=>(e[1]=r,t[0]=i(t[0])^t[2],t[1]=i(t[1])^t[3],this)})(),this.updateNumbers=(()=>{let{_i32:t,_f64:e}=this;return r=>{let n=r.length;for(let s=0;s<n;s++)e[1]=r[s],t[0]=i(t[0])^t[2],t[1]=i(t[1])^t[3];return this}})(),this.updateString=(()=>{let{_i32:t,_f64:e}=this;return r=>{let n=(r=String(r)).length;for(let s=0;s<n;s++)e[1]=r.charCodeAt(s),t[0]=i(t[0])^t[2],t[1]=i(t[1])^t[3];return this}})(),this.init()}}n._instance=new n},8225:function(t,e,r){function i(t,e,r){return t<e?e:t>r?r:t}function n(t){return t<0?0:t>1?1:t}function s(t,e,r){return t+(e-t)*n(r)}function a(t,e,r,i,s){return i+(s-i)*n((t-e)/(r-e))}function u(t){return .5+.5*Math.sin(t*Math.PI)}r.d(e,{V2:function(){return n},a2:function(){return a},lw:function(){return u},t7:function(){return s},uZ:function(){return i}})},3044:function(t,e,r){r.d(e,{v:function(){return o}});var i=r(4552);class n{_getId(){return n._idHash.init().update(++this._count).getValue()}_registerObject(t){let e=this._getId();return this._weakMap.set(t,e),e}_registerPrimitive(t){let e=this._getId();return this._map.set(t,e),e}_requirePrimitiveId(t){var e;return null!==(e=this._map.get(t))&&void 0!==e?e:this._registerPrimitive(t)}_requireObjectId(t){var e;return null!==(e=this._weakMap.get(t))&&void 0!==e?e:this._registerObject(t)}_requireArrayId(t){let{_arrayHash:e}=n;for(let r of(e.init(),t.flat(16)))e.update(this.requireId(r));return e.getValue()}requireId(t){return!function(t){if(null==t)return!0;switch(typeof t){case"function":case"object":return!1;default:return!0}}(t)?Array.isArray(t)?this._requireArrayId(t):this._requireObjectId(t):this._requirePrimitiveId(t)}constructor(){this._count=1,this._map=new Map,this._weakMap=new WeakMap}}n._idHash=new i.k,n._arrayHash=new i.k;class s{constructor(t,e){this.filter=t,this.callback=e,this.match="*"===t?()=>!0:"string"==typeof t?e=>e===t:t instanceof RegExp?e=>t.test(e):()=>!1}}let a=new n,u=new Map;class o{payloadAssign(t){let{overwrite:e=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.payload=e?{...this.payload,...t}:{...t,...this.payload},this}constructor(t,e,r){var i;this.id=o.nextId++,this.debug={currentListenerIndex:-1,listenerCount:0},this.targetId=a.requireId(t),this.target=t,this.type=null!=e?e:"message",this.payload=r;let n=(null!==(i=u.get(this.targetId))&&void 0!==i?i:[]).filter(t=>t.match(this.type));for(let t of(this.debug.listenerCount=n.length,n))this.debug.currentListenerIndex++,t.callback(this)}}o.send=function(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[i,n,s]=function(t){let[e,...r]=t;if(2===r.length){let[t,{payload:i}]=r;return[e,t,i]}if(1===r.length){let[t]=r;return"string"==typeof t?[e,t]:[e,void 0,t.payload]}return[e]}(e);return new o(i,n,s)},o.on=function(){for(var t,e=arguments.length,r=Array(e),i=0;i<e;i++)r[i]=arguments[i];let[n,o,l]=function(t){if(2===t.length){let[e,r]=t;return[e,"*",r]}return t}(r),c=a.requireId(n),h=new s(o,l);return(null!==(t=u.get(c))&&void 0!==t?t:(()=>{let t=[];return u.set(c,t),t})()).push(h),{destroy:()=>{!function(t,e){let r=u.get(t);if(r){let i=r.indexOf(e);-1!==i&&(r.splice(i,1),0===r.length&&u.delete(t))}}(c,h)}}},o.debug={listenerMap:u,idRegister:a},o.nextId=0},9117:function(t,e,r){r.d(e,{v:function(){return c}});var i=r(8225);let n=0,s=0,a=0;class u{get previousTime(){return this.time-this.deltaTime}toString(){return"frame: ".concat(this.frame,", time: ").concat(this.time.toFixed(2),", deltaTime: ").concat(this.deltaTime.toFixed(4))}constructor(t=null,e=0,r=0,i=0,n=1,s=1,a=0,u=c.defaultProps.activeDuration){this.previousTick=t,this.frame=e,this.time=r,this.deltaTime=i,this.timeScale=n,this.activeTimeScale=s,this.activeTime=a,this.activeDuration=u}}class o{add(t,e){this._sortDirty||(this._sortDirty=this._listeners.length>0&&t<this._listeners[this._listeners.length-1].order),this._countDirty=!0;let r={id:o.listenerNextId++,order:t,callback:e};return this._listeners.push(r),r}remove(t){let e=this._listeners.findIndex(e=>e.callback===t);return -1!==e&&(this._listeners.splice(e,1),this._countDirty=!0,!0)}removeById(t){let e=this._listeners.findIndex(e=>e.id===t);return -1!==e&&(this._listeners.splice(e,1),this._countDirty=!0,!0)}call(t){for(let{callback:e}of(this._sortDirty&&(this._listeners.sort((t,e)=>t.order-e.order),this._sortDirty=!1),this._countDirty&&(this._loopListeners=[...this._listeners],this._countDirty=!1),this._loopListeners))"stop"===e(t)&&this.remove(e)}clear(){this._listeners.length=0,this._countDirty=!0}constructor(){this._sortDirty=!0,this._countDirty=!0,this._listeners=[],this._loopListeners=[]}}o.listenerNextId=0;let l=0;class c{static current(){let t=0===h.length?new c({name:"CurrentTicker"}):h[h.length-1];return t.requestActivation(),t}get time(){return this.tick.time}get deltaTime(){return this.tick.deltaTime}get timeScale(){return this.internal.timeScale}set timeScale(t){this.internal.timeScale=t}start(){return this.internal.stopped=!1,this.requestActivation(),this}stop(){return this.internal.stopped=!0,this}set(t){let{order:e,...r}=t;return void 0!==e&&(this.props.order=e,d.orderChanged=!0),Object.assign(this.props,r),this}onTick(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[i,n]=1===e.length?[{},e[0]]:"number"==typeof e[0]?[{order:e[0]},e[1]]:e,{order:s=0,frameInterval:a=0,timeInterval:u=0,once:o=!1}=i;if(o){let t=this.onTick({...i,once:!1},e=>{t.destroy(),n(e)});return t}if(a>0)return this.onTick({order:s},t=>{if(t.frame%a==0)return n(t)});if(u>0){let t=u;return this.onTick({order:s},e=>{if((t+=e.deltaTime)>=u)return t+=-u,n(e)})}return this.internal.updateListeners.add(s,n),{destroy:()=>{this.internal.updateListeners.remove(n)},value:this}}offTick(t){return this.internal.updateListeners.remove(t)}onActivate(t){return this.requestActivation(),this.internal.activationListeners.add(0,t),{destroy:()=>{this.internal.activationListeners.remove(t)},value:this}}onDeactivate(t){return this.internal.deactivationListeners.add(0,t),{destroy:()=>{this.internal.deactivationListeners.remove(t)},value:this}}cancelAnimationFrame(t){let{updateListeners:e}=this.internal;return e.removeById(t)}constructor(t={}){var e,r=this;for(let[e,i]of(this.id=l++,this.internal={active:!0,stopped:!1,caughtErrors:!1,timeScale:1,activeLastRequest:0,updateListeners:new o,deactivationListeners:new o,activationListeners:new o},this.tick=new u,this.destroyed=!1,this.destroy=()=>{if(!1===this.destroyed){this.destroyed=!0;let t=h.indexOf(this);if(-1===t)throw Error("Ticker is already destroyed");h.splice(t,1)}},this.requestActivation=()=>(this.internal.activeLastRequest=n,!1===this.internal.active&&(this.internal.active=!0,this.internal.activationListeners.call(this.tick)),this),this.requestAnimationFrame=function(t){let{order:e=0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};r.requestActivation();let{updateListeners:i}=r.internal,n=i.add(e,e=>{i.removeById(n.id),t(1e3*e.time)});return n.id},this.staticProps={...c.defaultStaticProps},this.props={...c.defaultProps},Object.entries(t)))e in this.staticProps?this.staticProps[e]=i:this.props[e]=i;this.name=null!==(e=this.staticProps.name)&&void 0!==e?e:"Ticker#".concat(this.id),h.push(this)}}c.defaultStaticProps={name:null,tickMaxCount:60,maxDeltaTime:.1},c.defaultProps={order:0,activeDuration:10,activeFadeDuration:1};let h=[],d={orderChanged:!1};!function t(){window.requestAnimationFrame(t),function(t){for(let e of(s=t/1e3-n,n+=s,a++,d.orderChanged&&(h.sort((t,e)=>t.props.order-e.props.order),d.orderChanged=!1),h))!function(t){let{active:e,activeLastRequest:r,stopped:a,timeScale:o,caughtErrors:l}=t.internal;if(l||!1===e||a)return;let{tickMaxCount:c,maxDeltaTime:h}=t.staticProps,{activeDuration:d,activeFadeDuration:f}=t.props,{tick:p}=t,v=n-r,m=(0,i.V2)((v-d)/f),g=1-m*m,y=p.frame+1,_=Math.min(s,h)*o*g,k=p.time+_;t.tick=new u(p,y,k,_,o,g,v,d);let w=p,b=0;for(;w&&++b<c;)w=w.previousTick;w&&(w.previousTick=null);try{t.internal.updateListeners.call(t.tick)}catch(e){console.error('Error in Ticker "'.concat(t.name,'"')),console.error(t.tick.toString()),console.error(e),t.internal.caughtErrors=!0}0===g&&(t.internal.active=!1,t.internal.deactivationListeners.call(t.tick))}(e)}(performance.now())}()}}]);