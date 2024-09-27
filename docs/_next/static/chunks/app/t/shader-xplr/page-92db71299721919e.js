(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8256],{44456:function(e,t,n){Promise.resolve().then(n.bind(n,75064))},75064:function(e,t,n){"use strict";n.d(t,{Client:function(){return N}});var r,l=n(41291),a=n(81406),i=n(27489),o=n(26985),s=n(64740),c=n(26028),d=n(13841),u=n(71427),h=n(6332),p=n(92605),f=n(53346),v=["title","titleId"];function g(){return(g=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(null,arguments)}var x=function(e){var t=e.title,n=e.titleId,l=function(e,t){if(null==e)return{};var n,r,l=function(e,t){if(null==e)return{};var n={};for(var r in e)if(({}).hasOwnProperty.call(e,r)){if(t.includes(r))continue;n[r]=e[r]}return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.includes(n)||({}).propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}(e,v);return f.createElement("svg",g({xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",viewBox:"0 0 16 16","aria-labelledby":n},l),t?f.createElement("title",{id:n},t):null,r||(r=f.createElement("path",{fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M11.25 4.25v-2.5h-9.5v9.5h2.5m.5-6.5v9.5h9.5v-9.5z"})))},y=n(19137),m=n.n(y);function _(e){let{className:t,children:n=(0,l.jsx)(x,{})}=e;return(0,l.jsx)("button",{className:"".concat(m().IconButton," ").concat(t),...e,children:n})}var j=n(16818),b=n.n(j);function w(e){let t=(0,a.useRef)(null);return(0,l.jsxs)("div",{ref:t,className:b().Copyable,children:[(0,l.jsx)("div",{children:e.children}),(0,l.jsx)("div",{className:"".concat(b().Overlay," layer thru p-2"),children:(0,l.jsx)(_,{onClick:()=>{let e=t.current.firstChild.textContent;navigator.clipboard.writeText(e)},children:(0,l.jsx)(x,{})})})]})}var C=n(74467),S=n.n(C);let k=["vertexShader","fragmentShader"];function O(){let e=function(){let[e,t,n]=window.location.hash.slice(1).split(",");return void 0!==e&&e in s.ShaderLib||(e="basic"),void 0!==t&&k.includes(t)||(t=k[0]),void 0!==n&&(!n||n in s.ShaderChunk)||(n=null),{libName:e,shaderProgram:t,chunkName:n}}(),[t,n]=(0,a.useState)(e.libName),[r,p]=(0,a.useState)(e.shaderProgram),[[f,v],g]=(0,a.useState)([e.chunkName,new h.Ae]),[y,m]=(0,a.useState)(!1);window.location.hash=[t,r,f].filter(e=>!!e).join(",");let{ref:j}=(0,d.sv)(function*(e){for(let{spans:t,chunkName:n}of[...e.querySelectorAll("span")].filter(e=>"include"===e.textContent).map(e=>{let t=e.nextElementSibling,n=t.nextElementSibling,r=n.textContent.slice(1,-1);return{spans:[e.previousElementSibling,e,t,n],chunkName:r}})){let e=e=>{for(let n of(e.stopPropagation(),t))n.classList.add(S().Hover)},r=e=>{for(let n of(e.stopPropagation(),t))n.classList.remove(S().Hover)},l=e=>{e.stopPropagation(),g([n,h.Ae.from(t[0].getBoundingClientRect()).union(h.Ae.from(t[t.length-1].getBoundingClientRect()))])};for(let n of t)n.classList.add(S().Include),n.addEventListener("pointerenter",e),n.addEventListener("pointerleave",r),n.addEventListener("click",l)}yield(0,c.w)(e,{onTap:t=>{let n=e.querySelector(".".concat(S().OverlayContentWrapper));n&&!1===n.contains(t.orignalDownEvent.target)&&g([null,new h.Ae])}})},[t,r]),b=s.ShaderLib[t][r];y&&(b=b.replace(/#include <(.*)>/g,(e,t)=>{let n=s.ShaderChunk[t];if(!n)throw Error('Shader chunk "'.concat(t,'" not found'));return n}));let C=0===v.area?v:v.clone().applyPadding([2,6],"grow");return(0,l.jsxs)("div",{ref:j,className:(0,u.f)(S().ShaderXplr,"absolute-through p-4 flex flex-col gap-4"),children:[(0,l.jsx)("h1",{children:"ShaderXplr"}),(0,l.jsxs)("div",{className:(0,u.f)(S().Base,null!==f&&S().Dim),style:{background:o.Z.hljs.background},children:[(0,l.jsxs)("div",{className:S().Selectors,children:[(0,l.jsx)("select",{name:"shaderlib",id:"shaderlib",onChange:e=>n(e.target.value),children:Object.keys(s.ShaderLib).map(e=>(0,l.jsx)("option",{children:e},e))}),(0,l.jsx)("select",{name:"shaderprogram",id:"shaderprogram",onChange:e=>p(e.target.value),children:k.map(e=>(0,l.jsx)("option",{children:e},e))}),(0,l.jsxs)("div",{className:"flex flex-row items-center gap-3 px-2 bg-[#fff1] rounded-[.25em]",children:[(0,l.jsx)("label",{htmlFor:"showFinalProgram",children:"Show final program"}),(0,l.jsx)("input",{type:"checkbox",id:"showFinalProgram",checked:y,onChange:e=>m(e.target.checked)})]})]}),(0,l.jsx)("div",{className:S().BaseContentWrapper,children:(0,l.jsx)(i.Z,{language:"cpp",style:o.Z,children:b})})]}),(0,l.jsxs)("div",{className:"absolute-through",children:[(0,l.jsx)("div",{className:S().IncludeHighlight,style:{top:"".concat(C.top,"px"),left:"".concat(C.left,"px"),width:"".concat(C.width,"px"),height:"".concat(C.height,"px")}}),f&&(0,l.jsxs)("div",{className:S().Overlay,children:[(0,l.jsx)("div",{style:{height:"".concat(Math.max(v.top,110),"px"),pointerEvents:"none"}}),(0,l.jsxs)("div",{className:S().OverlayContentWrapper,style:{background:o.Z.hljs.background},children:[(0,l.jsxs)("div",{className:S().TitleBar,children:[(0,l.jsx)("h1",{children:f}),(0,l.jsx)(_,{onClick:()=>{navigator.clipboard.writeText(f)},children:(0,l.jsx)(x,{})})]}),(0,l.jsx)(w,{children:(0,l.jsx)(i.Z,{language:"cpp",style:o.Z,children:s.ShaderChunk[f]})})]})]})]})]})}function N(){return(0,p.O)()&&(0,l.jsx)(O,{})}},92605:function(e,t,n){"use strict";n.d(t,{O:function(){return l}});var r=n(81406);function l(){let[e,t]=(0,r.useState)(!1);return(0,r.useLayoutEffect)(()=>{t(!0)},[]),e}},71427:function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter(e=>!!e).map(e=>{if("string"==typeof e)return e;if(e&&"object"==typeof e)return Object.keys(e).filter(t=>!0===e[t]);throw Error("Not possible.")}).flat().join(" ")}n.d(t,{f:function(){return r}})},16818:function(e){e.exports={Copyable:"Copyable_Copyable__KjEYk",Overlay:"Copyable_Overlay__CzDNx"}},19137:function(e){e.exports={IconButton:"IconButton_IconButton__QPZgi"}},74467:function(e){e.exports={ShaderXplr:"style_ShaderXplr__ui5Wo",Selectors:"style_Selectors__q_Gtx",Include:"style_Include__P24wx",Hover:"style_Hover__KfJWT",Base:"style_Base___m7UK",Dim:"style_Dim__SFNyL",BaseContentWrapper:"style_BaseContentWrapper__nBKWd",OverlayContentWrapper:"style_OverlayContentWrapper___G7Tu",IncludeHighlight:"style_IncludeHighlight__2NZpu",Overlay:"style_Overlay__33OtX",TitleBar:"style_TitleBar__vfcXx"}}},function(e){e.O(0,[3032,5244,3578,6626,6028,1658,3510,1744],function(){return e(e.s=44456)}),_N_E=e.O()}]);