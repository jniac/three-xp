"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[790],{50790:function(e,t,n){n.r(t),n.d(t,{Bar:function(){return y},ChooseOne:function(){return g}});var r=n(41291),i=n(81406),s=n(8423),o=n(97757),a=n(51845),d=n(11315),l=n(13841);let u=(0,i.createContext)(null);function c(e,t){let n=(0,i.useContext)(u);return(0,l.sv)(async function*(){if(e)for await(let t of e(n))yield t},null!=t?t:[]),n}function v(e){let{children:t}=e,n=(0,i.useMemo)(()=>(function(e){let{width:t=window.innerWidth,height:n=window.innerHeight,pixelRatio:r=window.devicePixelRatio}=e,i=d.vB.get("ThreeTicker"),l=new o.p9q({antialias:!0,trackTimestamp:!0});l.setPixelRatio(r),l.setSize(t,n);let u=new o.cPb(50,t/n,.1,100);u.position.z=5;let c=new s.z(u,l.domElement),v=new o.xsS;async function m(){l.renderAsync(v,u)}return{renderer:l,camera:u,scene:v,ticker:i,init:function*(e){yield i.onTick(e=>{m()}),yield(0,a.s)(i.requestActivation),e.appendChild(l.domElement),yield()=>{c.dispose(),l.domElement.remove()}}}})({width:window.innerWidth,height:window.innerHeight}),[]),{ref:c}=(0,l.sv)(function*(e){yield*n.init(e),Object.assign(window,{three:n})},[]);return(0,r.jsxs)(u.Provider,{value:n,children:[(0,r.jsx)("div",{ref:c,className:"absolute inset-0"}),(0,r.jsx)("div",{className:"absolute inset-0 pointer-through",children:t})]})}var m=n(25463);function*w(e){let t=new o.SPe(new o.cJO(.033,3),new o.vBJ,4096);t.scale.setScalar(.2);let n=new o.yGw,r=new o.Ilk("#fc0");for(let{i:e,x:i,y:s,z:o}of(0,m.K)([16,16,16]))n.makeTranslation(i-8,s-8,o-8),t.setMatrixAt(e,n),t.setColorAt(e,r);let i=new Float32Array(12288),s=(0,o.tOc)(new o.pD(i,3),"vec3",4096),a=(0,o.tOc)(new o.pD(new Float32Array(12288),3),"color",4096),d=(0,o.Fn)(()=>{let e=s.element(o.V7B),t=a.element(o.V7B),n=(0,o.vpu)(o.V7B),r=(0,o.vpu)(o.V7B.add(2)),i=(0,o.vpu)(o.V7B.add(3));e.x=n.mul(100).add(-50),e.y=r.mul(10),e.z=i.mul(100).add(-50),t.assign((0,o.R3C)(0,1,2))})().compute(4096);return(0,o.Fn)(()=>{})().compute(4096),e.renderer.compute(d),e.ticker.onTick(()=>{e.renderer.compute(d)}),e.scene.add(t),yield()=>{t.removeFromParent()},{mesh:t,positionArray:i,positionBuffer:s,colorBuffer:a}}function h(){return c(w),(0,r.jsx)("div",{children:(0,r.jsx)("h1",{className:"uppercase",children:"test-1"})})}function*f(e){{let t=new o.Kj0(new o.XvJ,new o.vBJ({color:16711680}));t.scale.setScalar(.15),e.scene.add(t),yield()=>t.removeFromParent()}let t=new o.Sxh(512,512),n=(0,o.Fn)(e=>{let{storageTexture:t}=e,n=o.V7B.modInt(512),r=o.V7B.div(512),i=(0,o.qzT)(n,r),s=(0,o.fzv)(n).div(50),a=(0,o.fzv)(r).div(50),d=s.sin(),l=a.sin(),u=s.add(a).sin(),c=s.mul(s).add(a.mul(a)).sqrt().add(5).sin(),v=d.add(l,u,c),m=v.sin(),w=v.add(Math.PI).sin(),h=v.add(Math.PI).sub(.5).sin();(0,o.YDX)(t,i,(0,o.vhs)(m,w,h,1)).toWriteOnly()})({storageTexture:t}).compute(262144);e.renderer.compute(n);let r=new o.Kj0(new o._12,new o.AEy({colorNode:(0,o.hYO)(t),side:2}));e.scene.add(r),yield()=>r.removeFromParent()}let p={Test1:h,Test2:function(){return c(f,[]),(0,r.jsx)("div",{className:"Test2",children:(0,r.jsx)("h1",{children:"Test 2"})})}};function y(){return(0,r.jsx)(h,{})}function g(){let e=Object.values(p),[t,n]=(0,i.useState)(0),s=e[t];return(0,r.jsx)(v,{children:(0,r.jsxs)("div",{className:"absolute-through p-8 flex flex-col gap-2",children:[(0,r.jsx)("select",{className:"self-start border rounded-lg p-1 pr-3",onChange:e=>n(Number.parseInt(e.target.value)),children:e.map((e,t)=>(0,r.jsx)("option",{value:t,children:e.name},t))}),(0,r.jsx)(s,{})]})})}},51845:function(e,t,n){n.d(t,{s:function(){return r}});function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[r,i]=1===t.length?[window,t[0]]:t,s=()=>{i()};return r.addEventListener("mousemove",s,{passive:!0}),r.addEventListener("mousedown",s,{passive:!0}),r.addEventListener("mouseup",s,{passive:!0}),r.addEventListener("touchstart",s,{passive:!0}),r.addEventListener("touchmove",s,{passive:!0}),r.addEventListener("wheel",s,{passive:!0}),r.addEventListener("keydown",s,{passive:!0}),r.addEventListener("keyup",s,{passive:!0}),window.addEventListener("resize",s,{passive:!0}),{destroy:()=>{r.removeEventListener("mousemove",s),r.removeEventListener("mousedown",s),r.removeEventListener("mouseup",s),r.removeEventListener("touchstart",s),r.removeEventListener("touchmove",s),r.removeEventListener("wheel",s),r.removeEventListener("keydown",s),r.removeEventListener("keyup",s),window.removeEventListener("resize",s)}}}},25463:function(e,t,n){function*r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let r=0,i=0;2===t.length?(r=t[0],i=t[1]):Array.isArray(t[0])?(r=t[0][0],i=t[0][1]):(r=t[0].x,i=t[0].y);let s=0,o=0,a=0,d={get i(){return s},get x(){return o},get y(){return a},get tx(){return o/(r-1)},get ty(){return a/(i-1)}};for(a=0;a<i;a++)for(o=0;o<r;o++)yield d,s++}function*i(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let r=0,i=0,s=0;3===t.length?(r=t[0],i=t[1],s=t[2]):Array.isArray(t[0])?(r=t[0][0],i=t[0][1],s=t[0][2]):(r=t[0].x,i=t[0].y,s=t[0].z);let o=0,a=0,d=0,l=0,u={get i(){return o},get x(){return a},get y(){return d},get z(){return l},get tx(){return a/(r-1)},get ty(){return d/(i-1)},get tz(){return l/(s-1)}};for(l=0;l<s;l++)for(d=0;d<i;d++)for(a=0;a<r;a++)yield u,o++}n.d(t,{B:function(){return r},K:function(){return i}})}}]);