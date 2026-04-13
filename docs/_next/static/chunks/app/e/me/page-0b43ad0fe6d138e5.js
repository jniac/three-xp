(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3181],{8166:()=>{},13231:(e,t,r)=>{"use strict";r.d(t,{S:()=>o});var i=r(56126),n=r(42772);let s={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

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

		}`};class o extends n.o{constructor(e=.5,t=!1){super(),this.uniforms=i.LlO.clone(s.uniforms),this.material=new i.BKk({name:s.name,uniforms:this.uniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader}),this.uniforms.intensity.value=e,this.uniforms.grayscale.value=t,this._fsQuad=new n.F(this.material)}render(e,t,r,i){this.uniforms.tDiffuse.value=r.texture,this.uniforms.time.value+=i,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(t),this.clear&&e.clear()),this._fsQuad.render(e)}dispose(){this.material.dispose(),this._fsQuad.dispose()}}},19293:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,8166,23)),Promise.resolve().then(r.t.bind(r,20571,23)),Promise.resolve().then(r.bind(r,21264)),Promise.resolve().then(r.t.bind(r,38911,23)),Promise.resolve().then(r.bind(r,24057)),Promise.resolve().then(r.bind(r,4909)),Promise.resolve().then(r.bind(r,6006)),Promise.resolve().then(r.bind(r,19264)),Promise.resolve().then(r.bind(r,98114)),Promise.resolve().then(r.bind(r,87548)),Promise.resolve().then(r.bind(r,42436)),Promise.resolve().then(r.bind(r,18479))},20571:()=>{},21667:(e,t,r)=>{"use strict";r.d(t,{G:()=>o});let i=new WeakMap,n=(e=>()=>{let t=i.get(e);if(void 0===t){let t=e();return i.set(e,t),t}return t})(()=>{let e=new WeakMap;return{resizeObserver:new ResizeObserver(t=>{for(let r of t){let t=e.get(r.target);if(t)for(let e of t)e(r)}}),resizeObserverMap:e}});class s{get width(){return this.size.x}get height(){return this.size.y}get aspect(){return this.size.x/this.size.y}constructor(e,t){this.element=e,this.size=t}}function o(e,t){let{onSize:r}=function(e){if("function"==typeof e)return{onSize:e};let{onSize:t=()=>{}}=null!=e?e:{};return{onSize:t}}(t),i=new DOMPoint(0,0);if(e instanceof Window){let t=()=>{i.x=window.innerWidth,i.y=window.innerHeight,r(new s(e,i))};return e.addEventListener("resize",t),t(),{destroy:()=>{e.removeEventListener("resize",t)}}}{var o;let{resizeObserver:t,resizeObserverMap:a}=n();t.observe(e);let l=null!=(o=a.get(e))?o:new Set,u=t=>{i.x=t.contentRect.width,i.y=t.contentRect.height,r(new s(e,i))};return a.set(e,l),l.add(u),{destroy:()=>{let r=a.get(e);if(!r)throw Error("Wtf??? No callbacks found for element");r.delete(u),0===r.size&&(a.delete(e),t.unobserve(e))}}}}},36575:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});var i=r(67203);let n=0;function s(e){let[,t]=(0,i.useState)(n);return(0,i.useEffect)(()=>{let{destroy:r}=e.onChange(()=>t(++n));return r},[e.observableId]),e.value}},46281:(e,t,r)=>{"use strict";r.d(t,{A:()=>d});var i=r(67203);let n=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),s=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase()),o=e=>{let t=s(e);return t.charAt(0).toUpperCase()+t.slice(1)},a=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim()},l=e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0};var u={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let c=(0,i.forwardRef)((e,t)=>{let{color:r="currentColor",size:n=24,strokeWidth:s=2,absoluteStrokeWidth:o,className:c="",children:d,iconNode:h,...f}=e;return(0,i.createElement)("svg",{ref:t,...u,width:n,height:n,stroke:r,strokeWidth:o?24*Number(s)/Number(n):s,className:a("lucide",c),...!d&&!l(f)&&{"aria-hidden":"true"},...f},[...h.map(e=>{let[t,r]=e;return(0,i.createElement)(t,r)}),...Array.isArray(d)?d:[d]])}),d=(e,t)=>{let r=(0,i.forwardRef)((r,s)=>{let{className:l,...u}=r;return(0,i.createElement)(c,{ref:s,iconNode:t,className:a("lucide-".concat(n(o(e))),"lucide-".concat(e),l),...u})});return r.displayName=o(e),r}},56983:(e,t,r)=>{"use strict";r.d(t,{A:()=>i});let i=(0,r(46281).A)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]])}},e=>{var t=t=>e(e.s=t);e.O(0,[769,5662,4946,2379,2919,5889,2194,1133,4922,4335,1794,7385,7237,8181,146,487,8042,890,5071,4786,7392,8466,2143,3540,1450,6356,3884,1319,6852,7358],()=>t(19293)),_N_E=e.O()}]);