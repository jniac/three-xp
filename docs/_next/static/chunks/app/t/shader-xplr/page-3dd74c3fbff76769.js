(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8256],{82584:function(e,t,n){Promise.resolve().then(n.bind(n,48833))},48833:function(e,t,n){"use strict";n.d(t,{Client:function(){return N}});var r,l=n(78485),i=n(27275),a=n(59926),o=n(59942),s=n(85679),c=n(74831),u=n(48583),d=n(26630),h=n(58648),p=n(11030),f=n(49837),g=["title","titleId"];function v(){return(v=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(null,arguments)}var x=function(e){var t=e.title,n=e.titleId,l=function(e,t){if(null==e)return{};var n,r,l=function(e,t){if(null==e)return{};var n={};for(var r in e)if(({}).hasOwnProperty.call(e,r)){if(t.includes(r))continue;n[r]=e[r]}return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.includes(n)||({}).propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}(e,g);return f.createElement("svg",v({xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",viewBox:"0 0 16 16","aria-labelledby":n},l),t?f.createElement("title",{id:n},t):null,r||(r=f.createElement("path",{fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M11.25 4.25v-2.5h-9.5v9.5h2.5m.5-6.5v9.5h9.5v-9.5z"})))},m=n(81143),y=n.n(m);function _(e){let{className:t,children:n=(0,l.jsx)(x,{})}=e;return(0,l.jsx)("button",{className:"".concat(y().IconButton," ").concat(t),...e,children:n})}var b=n(27044),j=n.n(b);function w(e){let t=(0,i.useRef)(null);return(0,l.jsxs)("div",{ref:t,className:j().Copyable,children:[(0,l.jsx)("div",{children:e.children}),(0,l.jsx)("div",{className:"".concat(j().Overlay," layer thru p-2"),children:(0,l.jsx)(_,{onClick:()=>{let e=t.current.firstChild.textContent;navigator.clipboard.writeText(e)},children:(0,l.jsx)(x,{})})})]})}var C=n(17950),S=n.n(C);let k=["vertexShader","fragmentShader"];function O(){let e=function(){let[e,t,n]=window.location.hash.slice(1).split(",");return void 0!==e&&e in s.ShaderLib||(e="basic"),void 0!==t&&k.includes(t)||(t=k[0]),void 0!==n&&(!n||n in s.ShaderChunk)||(n=null),{libName:e,shaderProgram:t,chunkName:n}}(),[t,n]=(0,i.useState)(e.libName),[r,p]=(0,i.useState)(e.shaderProgram),[[f,g],v]=(0,i.useState)([e.chunkName,new h.Ae]),[m,y]=(0,i.useState)(!1);window.location.hash=[t,r,f].filter(e=>!!e).join(",");let{ref:b}=(0,u.sv)(function*(e){for(let{spans:t,chunkName:n}of[...e.querySelectorAll("span")].filter(e=>"include"===e.textContent).map(e=>{let t=e.nextElementSibling,n=t.nextElementSibling,r=n.textContent.slice(1,-1);return{spans:[e.previousElementSibling,e,t,n],chunkName:r}})){let e=e=>{for(let n of(e.stopPropagation(),t))n.classList.add(S().Hover)},r=e=>{for(let n of(e.stopPropagation(),t))n.classList.remove(S().Hover)},l=e=>{e.stopPropagation(),v([n,h.Ae.from(t[0].getBoundingClientRect()).union(h.Ae.from(t[t.length-1].getBoundingClientRect()))])};for(let n of t)n.classList.add(S().Include),n.addEventListener("pointerenter",e),n.addEventListener("pointerleave",r),n.addEventListener("click",l)}yield(0,c.w)(e,{onTap:t=>{let n=e.querySelector(".".concat(S().OverlayContentWrapper));n&&!1===n.contains(t.orignalDownEvent.target)&&v([null,new h.Ae])}})},[t,r]),j=s.ShaderLib[t][r];m&&(j=j.replace(/#include <(.*)>/g,(e,t)=>{let n=s.ShaderChunk[t];if(!n)throw Error('Shader chunk "'.concat(t,'" not found'));return n}));let C=0===g.area?g:g.clone().applyPadding([2,6],"grow");return(0,l.jsxs)("div",{ref:b,className:(0,d.f)(S().ShaderXplr,"absolute-through p-4 flex flex-col gap-4"),children:[(0,l.jsx)("h1",{children:"ShaderXplr"}),(0,l.jsxs)("div",{className:(0,d.f)(S().Base,null!==f&&S().Dim),style:{background:o.Z.hljs.background},children:[(0,l.jsxs)("div",{className:S().Selectors,children:[(0,l.jsx)("select",{name:"shaderlib",id:"shaderlib",onChange:e=>n(e.target.value),children:Object.keys(s.ShaderLib).map(e=>(0,l.jsx)("option",{children:e},e))}),(0,l.jsx)("select",{name:"shaderprogram",id:"shaderprogram",onChange:e=>p(e.target.value),children:k.map(e=>(0,l.jsx)("option",{children:e},e))}),(0,l.jsxs)("div",{className:"flex flex-row items-center gap-3 px-2 bg-[#fff1] rounded-[.25em]",children:[(0,l.jsx)("label",{htmlFor:"showFinalProgram",children:"Show final program"}),(0,l.jsx)("input",{type:"checkbox",id:"showFinalProgram",checked:m,onChange:e=>y(e.target.checked)})]})]}),(0,l.jsx)("div",{className:S().BaseContentWrapper,children:(0,l.jsx)(a.Z,{language:"cpp",style:o.Z,children:j})})]}),(0,l.jsxs)("div",{className:"absolute-through",children:[(0,l.jsx)("div",{className:S().IncludeHighlight,style:{top:"".concat(C.top,"px"),left:"".concat(C.left,"px"),width:"".concat(C.width,"px"),height:"".concat(C.height,"px")}}),f&&(0,l.jsxs)("div",{className:S().Overlay,children:[(0,l.jsx)("div",{style:{height:"".concat(Math.max(g.top,110),"px"),pointerEvents:"none"}}),(0,l.jsxs)("div",{className:S().OverlayContentWrapper,style:{background:o.Z.hljs.background},children:[(0,l.jsxs)("div",{className:S().TitleBar,children:[(0,l.jsx)("h1",{children:f}),(0,l.jsx)(_,{onClick:()=>{navigator.clipboard.writeText(f)},children:(0,l.jsx)(x,{})})]}),(0,l.jsx)(w,{children:(0,l.jsx)(a.Z,{language:"cpp",style:o.Z,children:s.ShaderChunk[f]})})]})]})]})]})}function N(){return(0,p.O)()&&(0,l.jsx)(O,{})}},11030:function(e,t,n){"use strict";n.d(t,{O:function(){return l}});var r=n(27275);function l(){let[e,t]=(0,r.useState)(!1);return(0,r.useLayoutEffect)(()=>{t(!0)},[]),e}},26630:function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter(e=>!!e).map(e=>{if("string"==typeof e)return e;if(e&&"object"==typeof e)return Object.keys(e).filter(t=>!0===e[t]);throw Error("Not possible.")}).flat().join(" ")}n.d(t,{f:function(){return r}})},39805:function(e,t,n){"use strict";function r(e){let[t,n]=e.split(".");if(void 0===n)return t;let r=n.length-1;for(;"0"===n[r];)r--;return"."===n[r]&&r--,-1===r?t:t+"."+n.slice(0,r+1)}function l(e){let{maxDigits:t=8}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(t<6)throw Error("maxDigits must be at least 6");if(0===e)return"0";let[n,l]=e.toString().split("."),i=n.length,a=t-i-1;if(i>t||a<0){let[n,l]=e.toPrecision(t).split("e");return n=n.slice(0,t-l.length-1),"".concat(r(n),"e").concat(l)}return Math.abs(e)<1/Math.pow(10,t-2)?r(e.toExponential(t-5)):void 0===l?n:r(e.toFixed(a))}n.d(t,{uf:function(){return l}})},27044:function(e){e.exports={Copyable:"Copyable_Copyable__KjEYk",Overlay:"Copyable_Overlay__CzDNx"}},81143:function(e){e.exports={IconButton:"IconButton_IconButton__QPZgi"}},17950:function(e){e.exports={ShaderXplr:"style_ShaderXplr__ui5Wo",Selectors:"style_Selectors__q_Gtx",Include:"style_Include__P24wx",Hover:"style_Hover__KfJWT",Base:"style_Base___m7UK",Dim:"style_Dim__SFNyL",BaseContentWrapper:"style_BaseContentWrapper__nBKWd",OverlayContentWrapper:"style_OverlayContentWrapper___G7Tu",IncludeHighlight:"style_IncludeHighlight__2NZpu",Overlay:"style_Overlay__33OtX",TitleBar:"style_TitleBar__vfcXx"}}},function(e){e.O(0,[6118,7512,7931,4940,8648,4831,2920,7936,1744],function(){return e(e.s=82584)}),_N_E=e.O()}]);