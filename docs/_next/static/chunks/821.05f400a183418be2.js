"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[821],{6821:function(e,n,t){t.r(n),t.d(n,{Bar:function(){return p},ChooseOne:function(){return x}});var i=t(7504),r=t(3778),s=t(3630),l=t(1415),o=t(8047),a=t(6188),d=t(2288);let c=(0,r.createContext)(null);function u(e,n){let t=(0,r.useContext)(c);return(0,d.sv)(async function*(){if(e)for await(let n of e(t))yield n},null!=n?n:[]),t}function m(e){let{children:n}=e,t=(0,r.useMemo)(()=>(function(e){let{width:n=window.innerWidth,height:t=window.innerHeight,pixelRatio:i=window.devicePixelRatio}=e,r=a.v.get("ThreeTicker"),d=new l.p9q({antialias:!0,trackTimestamp:!0});d.setPixelRatio(i),d.setSize(n,t);let c=new l.cPb(50,n/t,.1,100);c.position.z=5;let u=new s.z(c,d.domElement),m=new l.xsS;async function w(){d.renderAsync(m,c)}return{renderer:d,camera:c,scene:m,ticker:r,init:function*(e){yield r.onTick(e=>{w()}),yield(0,o.s)(r.requestActivation),e.appendChild(d.domElement),yield()=>{u.dispose(),d.domElement.remove()}}}})({width:window.innerWidth,height:window.innerHeight}),[]),{ref:u}=(0,d.sv)(function*(e){yield*t.init(e),Object.assign(window,{three:t})},[]);return(0,i.jsxs)(c.Provider,{value:t,children:[(0,i.jsx)("div",{ref:u,className:"absolute inset-0"}),(0,i.jsx)("div",{className:"absolute inset-0 pointer-through",children:n})]})}function*w(e){let n=new l.SPe(new l.cJO(.033,3),new l.vBJ,4096);n.scale.setScalar(.2);let t=new l.yGw,i=new l.Ilk("#fc0");for(let{i:e,x:r,y:s,z:l}of function*(e){Array.isArray(e)&&(e={x:e[0],y:e[1],z:e[2]});let n={i:0,x:0,y:0,z:0},t=0;for(let i=0;i<e.z;i++)for(let r=0;r<e.y;r++)for(let s=0;s<e.x;s++)n.i=t++,n.x=s,n.y=r,n.z=i,yield n}([16,16,16]))t.makeTranslation(r-8,s-8,l-8),n.setMatrixAt(e,t),n.setColorAt(e,i);let r=new Float32Array(12288),s=(0,l.tOc)(new l.pD(r,3),"vec3",4096),o=(0,l.tOc)(new l.pD(new Float32Array(12288),3),"color",4096),a=(0,l.Fn)(()=>{let e=s.element(l.V7B),n=o.element(l.V7B),t=(0,l.vpu)(l.V7B),i=(0,l.vpu)(l.V7B.add(2)),r=(0,l.vpu)(l.V7B.add(3));e.x=t.mul(100).add(-50),e.y=i.mul(10),e.z=r.mul(100).add(-50),n.assign((0,l.R3C)(0,1,2))})().compute(4096);return(0,l.Fn)(()=>{})().compute(4096),e.renderer.compute(a),e.ticker.onTick(()=>{e.renderer.compute(a)}),e.scene.add(n),yield()=>{n.removeFromParent()},{mesh:n,positionArray:r,positionBuffer:s,colorBuffer:o}}function f(){return u(w),(0,i.jsx)("div",{children:(0,i.jsx)("h1",{className:"uppercase",children:"test-1"})})}function*h(e){{let n=new l.Kj0(new l.XvJ,new l.vBJ({color:16711680}));n.scale.setScalar(.15),e.scene.add(n),yield()=>n.removeFromParent()}let n=new l.Sxh(512,512),t=(0,l.Fn)(e=>{let{storageTexture:n}=e,t=l.V7B.modInt(512),i=l.V7B.div(512),r=(0,l.qzT)(t,i),s=(0,l.fzv)(t).div(50),o=(0,l.fzv)(i).div(50),a=s.sin(),d=o.sin(),c=s.add(o).sin(),u=s.mul(s).add(o.mul(o)).sqrt().add(5).sin(),m=a.add(d,c,u),w=m.sin(),f=m.add(Math.PI).sin(),h=m.add(Math.PI).sub(.5).sin();(0,l.YDX)(n,r,(0,l.vhs)(w,f,h,1)).toWriteOnly()})({storageTexture:n}).compute(262144);e.renderer.compute(t);let i=new l.Kj0(new l._12,new l.AEy({colorNode:(0,l.hYO)(n),side:2}));e.scene.add(i),yield()=>i.removeFromParent()}let v={Test1:f,Test2:function(){return u(h,[]),(0,i.jsx)("div",{className:"Test2",children:(0,i.jsx)("h1",{children:"Test 2"})})}};function p(){return(0,i.jsx)(f,{})}function x(){let e=Object.values(v),[n,t]=(0,r.useState)(0),s=e[n];return(0,i.jsx)(m,{children:(0,i.jsxs)("div",{className:"wraps p-8 flex flex-col gap-2",children:[(0,i.jsx)("select",{className:"self-start border rounded-lg p-1 pr-3",onChange:e=>t(Number.parseInt(e.target.value)),children:e.map((e,n)=>(0,i.jsx)("option",{value:n,children:e.name},n))}),(0,i.jsx)(s,{})]})})}}}]);