(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3181],{8166:()=>{},19293:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,8166,23)),Promise.resolve().then(r.t.bind(r,20571,23)),Promise.resolve().then(r.bind(r,21264)),Promise.resolve().then(r.t.bind(r,38911,23)),Promise.resolve().then(r.bind(r,6431)),Promise.resolve().then(r.bind(r,4909)),Promise.resolve().then(r.bind(r,6006)),Promise.resolve().then(r.bind(r,19264)),Promise.resolve().then(r.bind(r,98114)),Promise.resolve().then(r.bind(r,87548)),Promise.resolve().then(r.bind(r,42436)),Promise.resolve().then(r.bind(r,18479))},20571:()=>{},34369:(e,t,r)=>{"use strict";r.d(t,{G:()=>s});let i=(0,r(80032).R)(()=>{let e=new WeakMap;return{resizeObserver:new ResizeObserver(t=>{for(let r of t){let t=e.get(r.target);if(t)for(let e of t)e(r)}}),resizeObserverMap:e}});class n{get width(){return this.size.x}get height(){return this.size.y}get aspect(){return this.size.x/this.size.y}constructor(e,t){this.element=e,this.size=t}}function s(e,t){let{onSize:r}=function(e){if("function"==typeof e)return{onSize:e};let{onSize:t=()=>{}}=null!=e?e:{};return{onSize:t}}(t),s=new DOMPoint(0,0);if(e instanceof Window){let t=()=>{s.x=window.innerWidth,s.y=window.innerHeight,r(new n(e,s))};return e.addEventListener("resize",t),t(),{destroy:()=>{e.removeEventListener("resize",t)}}}{var o;let{resizeObserver:t,resizeObserverMap:l}=i();t.observe(e);let a=null!=(o=l.get(e))?o:new Set,u=t=>{s.x=t.contentRect.width,s.y=t.contentRect.height,r(new n(e,s))};return l.set(e,a),a.add(u),{destroy:()=>{let r=l.get(e);if(!r)throw Error("Wtf??? No callbacks found for element");r.delete(u),0===r.size&&(l.delete(e),t.unobserve(e))}}}}},36575:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});var i=r(67203);let n=0;function s(e){let[,t]=(0,i.useState)(n);return(0,i.useEffect)(()=>{let{destroy:r}=e.onChange(()=>t(++n));return r},[e.observableId]),e.value}},46281:(e,t,r)=>{"use strict";r.d(t,{A:()=>d});var i=r(67203);let n=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),s=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase()),o=e=>{let t=s(e);return t.charAt(0).toUpperCase()+t.slice(1)},l=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim()},a=e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0};var u={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let c=(0,i.forwardRef)((e,t)=>{let{color:r="currentColor",size:n=24,strokeWidth:s=2,absoluteStrokeWidth:o,className:c="",children:d,iconNode:h,...f}=e;return(0,i.createElement)("svg",{ref:t,...u,width:n,height:n,stroke:r,strokeWidth:o?24*Number(s)/Number(n):s,className:l("lucide",c),...!d&&!a(f)&&{"aria-hidden":"true"},...f},[...h.map(e=>{let[t,r]=e;return(0,i.createElement)(t,r)}),...Array.isArray(d)?d:[d]])}),d=(e,t)=>{let r=(0,i.forwardRef)((r,s)=>{let{className:a,...u}=r;return(0,i.createElement)(c,{ref:s,iconNode:t,className:l("lucide-".concat(n(o(e))),"lucide-".concat(e),a),...u})});return r.displayName=o(e),r}},56983:(e,t,r)=>{"use strict";r.d(t,{A:()=>i});let i=(0,r(46281).A)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]])},77845:(e,t,r)=>{"use strict";r.d(t,{S:()=>o});var i=r(34608),n=r(406);let s={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		uniform float intensity;
		uniform bool grayscale;
		uniform float time;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 base = texture2D( tDiffuse, vUv );

			float noise = rand( fract( vUv + time ) );

			vec3 color = base.rgb + base.rgb * clamp( 0.1 + noise, 0.0, 1.0 );

			color = mix( base.rgb, color, intensity );

			if ( grayscale ) {

				color = vec3( luminance( color ) ); // assuming linear-srgb

			}

			gl_FragColor = vec4( color, base.a );

		}`};class o extends n.o{constructor(e=.5,t=!1){super(),this.uniforms=i.LlO.clone(s.uniforms),this.material=new i.BKk({name:s.name,uniforms:this.uniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader}),this.uniforms.intensity.value=e,this.uniforms.grayscale.value=t,this._fsQuad=new n.F(this.material)}render(e,t,r,i){this.uniforms.tDiffuse.value=r.texture,this.uniforms.time.value+=i,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(t),this.clear&&e.clear()),this._fsQuad.render(e)}dispose(){this.material.dispose(),this._fsQuad.dispose()}}},80032:(e,t,r)=>{"use strict";r.d(t,{R:()=>n});let i=new WeakMap,n=e=>()=>{let t=i.get(e);if(void 0===t){let t=e();return i.set(e,t),t}return t}},96122:(e,t,r)=>{"use strict";function i(e){let{removePaddingEmptyLines:t=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=e.split("\n"),i=0;for(;t&&r.length>0&&""===r[0].trim();)r.shift();for(;t&&r.length>0&&""===r[r.length-1].trim();)r.pop();for(let e of r){let t=e.match(/^(\s*)\S/);if(t){i=t[1].length;break}}return r.map(e=>e.slice(Math.min(e.length,i))).join("\n")}r.d(t,{T:()=>i})}},e=>{var t=t=>e(e.s=t);e.O(0,[769,5662,2604,941,1248,8967,40,4133,6100,9851,1809,4729,9003,7795,146,6492,8042,6509,5071,4786,6373,8466,5466,3540,4847,6356,9898,1319,6852,7358],()=>t(19293)),_N_E=e.O()}]);