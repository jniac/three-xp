"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4451],{84451:function(e,t,n){n.r(t),n.d(t,{Bar:function(){return y},ChooseOne:function(){return g}});var r=n(78485),i=n(27275),s=n(86712),o=n(97958),u=n(32423),a=n(9710),d=n(48583);let l=(0,i.createContext)(null);function c(e,t){let n=(0,i.useContext)(l);return(0,d.sv)(async function*(){if(e)for await(let t of e(n))yield t},null!=t?t:[]),n}function v(e){let{children:t}=e,n=(0,i.useMemo)(()=>(function(e){let{width:t=window.innerWidth,height:n=window.innerHeight,pixelRatio:r=window.devicePixelRatio}=e,i=a.vB.get("ThreeTicker"),d=new o.p9q({antialias:!0,trackTimestamp:!0});d.setPixelRatio(r),d.setSize(t,n);let l=new o.cPb(50,t/n,.1,100);l.position.z=5;let c=new s.z(l,d.domElement),v=new o.xsS;async function m(){d.renderAsync(v,l)}return{renderer:d,camera:l,scene:v,ticker:i,init:function*(e){yield i.onTick(e=>{m()}),yield(0,u.s)(i.requestActivation),e.appendChild(d.domElement),yield()=>{c.dispose(),d.domElement.remove()}}}})({width:window.innerWidth,height:window.innerHeight}),[]),{ref:c}=(0,d.sv)(function*(e){yield*n.init(e),Object.assign(window,{three:n})},[]);return(0,r.jsxs)(l.Provider,{value:n,children:[(0,r.jsx)("div",{ref:c,className:"absolute inset-0"}),(0,r.jsx)("div",{className:"absolute inset-0 pointer-through",children:t})]})}var m=n(16573);function*f(e){let t=new o.SPe(new o.cJO(.033,3),new o.vBJ,4096);t.scale.setScalar(.2);let n=new o.yGw,r=new o.Ilk("#fc0");for(let{i:e,x:i,y:s,z:o}of(0,m.KA)([16,16,16]))n.makeTranslation(i-8,s-8,o-8),t.setMatrixAt(e,n),t.setColorAt(e,r);let i=new Float32Array(12288),s=(0,o.tOc)(new o.pD(i,3),"vec3",4096),u=(0,o.tOc)(new o.pD(new Float32Array(12288),3),"color",4096),a=(0,o.Fn)(()=>{let e=s.element(o.V7B),t=u.element(o.V7B),n=(0,o.vpu)(o.V7B),r=(0,o.vpu)(o.V7B.add(2)),i=(0,o.vpu)(o.V7B.add(3));e.x=n.mul(100).add(-50),e.y=r.mul(10),e.z=i.mul(100).add(-50),t.assign((0,o.R3C)(0,1,2))})().compute(4096);return(0,o.Fn)(()=>{})().compute(4096),e.renderer.compute(a),e.ticker.onTick(()=>{e.renderer.compute(a)}),e.scene.add(t),yield()=>{t.removeFromParent()},{mesh:t,positionArray:i,positionBuffer:s,colorBuffer:u}}function p(){return c(f),(0,r.jsx)("div",{children:(0,r.jsx)("h1",{className:"uppercase",children:"test-1"})})}function*w(e){{let t=new o.Kj0(new o.XvJ,new o.vBJ({color:16711680}));t.scale.setScalar(.15),e.scene.add(t),yield()=>t.removeFromParent()}let t=new o.Sxh(512,512),n=(0,o.Fn)(e=>{let{storageTexture:t}=e,n=o.V7B.modInt(512),r=o.V7B.div(512),i=(0,o.qzT)(n,r),s=(0,o.fzv)(n).div(50),u=(0,o.fzv)(r).div(50),a=s.sin(),d=u.sin(),l=s.add(u).sin(),c=s.mul(s).add(u.mul(u)).sqrt().add(5).sin(),v=a.add(d,l,c),m=v.sin(),f=v.add(Math.PI).sin(),p=v.add(Math.PI).sub(.5).sin();(0,o.YDX)(t,i,(0,o.vhs)(m,f,p,1)).toWriteOnly()})({storageTexture:t}).compute(262144);e.renderer.compute(n);let r=new o.Kj0(new o._12,new o.AEy({colorNode:(0,o.hYO)(t),side:2}));e.scene.add(r),yield()=>r.removeFromParent()}let h={Test1:p,Test2:function(){return c(w,[]),(0,r.jsx)("div",{className:"Test2",children:(0,r.jsx)("h1",{children:"Test 2"})})}};function y(){return(0,r.jsx)(p,{})}function g(){let e=Object.values(h),[t,n]=(0,i.useState)(0),s=e[t];return(0,r.jsx)(v,{children:(0,r.jsxs)("div",{className:"absolute-through p-8 flex flex-col gap-2",children:[(0,r.jsx)("select",{className:"self-start border rounded-lg p-1 pr-3",onChange:e=>n(Number.parseInt(e.target.value)),children:e.map((e,t)=>(0,r.jsx)("option",{value:t,children:e.name},t))}),(0,r.jsx)(s,{})]})})}},32423:function(e,t,n){n.d(t,{s:function(){return r}});function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let[r,i]=1===t.length?[window,t[0]]:t,s=()=>{i()};return r.addEventListener("mousemove",s,{passive:!0}),r.addEventListener("mousedown",s,{passive:!0}),r.addEventListener("mouseup",s,{passive:!0}),r.addEventListener("touchstart",s,{passive:!0}),r.addEventListener("touchmove",s,{passive:!0}),r.addEventListener("wheel",s,{passive:!0}),r.addEventListener("keydown",s,{passive:!0}),r.addEventListener("keyup",s,{passive:!0}),window.addEventListener("resize",s,{passive:!0}),{destroy:()=>{r.removeEventListener("mousemove",s),r.removeEventListener("mousedown",s),r.removeEventListener("mouseup",s),r.removeEventListener("touchstart",s),r.removeEventListener("touchmove",s),r.removeEventListener("wheel",s),r.removeEventListener("keydown",s),r.removeEventListener("keyup",s),window.removeEventListener("resize",s)}}}},16573:function(e,t,n){function*r(e){let t=0,n={get i(){return t},get t(){return t/e},get p(){return t/(e-1)}};for(t=0;t<e;t++)yield n}function*i(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let r=0,i=0;2===t.length?(r=t[0],i=t[1]):Array.isArray(t[0])?(r=t[0][0],i=t[0][1]):(r=t[0].x,i=t[0].y);let s=0,o=0,u=0,a={get i(){return s},get x(){return o},get y(){return u},get tx(){return o/r},get ty(){return u/i},get px(){return o/(r-1)},get py(){return u/(i-1)}};for(u=0;u<i;u++)for(o=0;o<r;o++)yield a,s++}function*s(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let r=0,i=0,s=0;3===t.length?(r=t[0],i=t[1],s=t[2]):Array.isArray(t[0])?(r=t[0][0],i=t[0][1],s=t[0][2]):(r=t[0].x,i=t[0].y,s=t[0].z);let o=0,u=0,a=0,d=0,l={get i(){return o},get x(){return u},get y(){return a},get z(){return d},get tx(){return u/r},get ty(){return a/i},get tz(){return d/s},get px(){return u/(r-1)},get py(){return a/(i-1)},get pz(){return d/(s-1)}};for(d=0;d<s;d++)for(a=0;a<i;a++)for(u=0;u<r;u++)yield l,o++}n.d(t,{B0:function(){return i},KA:function(){return s},VX:function(){return r}})}}]);