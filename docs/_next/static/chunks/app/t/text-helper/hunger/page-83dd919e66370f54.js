(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[331],{86896:function(e,t,n){Promise.resolve().then(n.bind(n,2518))},2518:function(e,t,n){"use strict";n.d(t,{Client:function(){return p}});var a=n(78485),r=n(25462),i=n(85679),s=n(494),c=n(87858),u=n(9710),l=n(49635),o=n(28142),d=n(48984),m=n(98156),h=n(96966);async function f(e){let t=new m.Mr(new m.I8(e)),n=await t.getEntries(),a=await n[0].getData(new m.hj);return await t.close(),a}async function w(){let e=await fetch(h.v.assets("misc/knut-hamsun-hunger.bin.zip")),t=await e.arrayBuffer(),n=await f(new Uint8Array(t));return d.m.Data.decode(n)}async function*x(e){let t=new s.F({size:100}).initialize(e.renderer.domElement).start();yield(0,u.RC)("three",n=>{t.update(e.camera,e.aspect,n.deltaTime)});let n=await w();document.querySelector("#instance-count").textContent=n.metadata.textCount.toString();let a=new d.m({textCount:n.metadata.textCount,lineCount:n.metadata.lineCount,lineLength:n.metadata.lineLength,textSize:1.2});a.setData(n);let r=new i.Vector3;for(let e=0,t=n.metadata.textCount;e<t;e++)o.T.unitVector3(r),r.multiplyScalar(30+5*o.T.boxMuller()[0]),a.setMatrixAt(e,(0,l.$)({position:r})),a.setColorAt(e,(0,l.E)(16777215*o.T.random()));(0,c.cY)(a,e.scene),(0,c.cY)(new i.Mesh(new i.IcosahedronGeometry,new i.MeshBasicMaterial({wireframe:!0})),e.scene),yield()=>e.scene.clear()}function y(){return(0,r.Ky)(x,[]),null}function p(){return(0,a.jsx)("div",{className:"layer thru",children:(0,a.jsxs)(r.H7,{children:[(0,a.jsxs)("div",{className:"layer thru p-4",children:[(0,a.jsx)("h1",{className:"text-3xl font-bold",children:"Knut Hamsum - Hunger Demo"}),(0,a.jsxs)("p",{children:["63,862 words \xa0 (",(0,a.jsx)("span",{id:"instance-count",children:"X"}),"\xa0instances)"]})]}),(0,a.jsx)(y,{})]})})}},96966:function(e,t,n){"use strict";n.d(t,{v:function(){return r}});let a="/three-xp/assets/",r={development:!1,assetsPath:a,assets:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return"".concat(a).concat(e)}}}},function(e){e.O(0,[7512,4954,6799,5589,3901,7351,8938,5381,4940,9072,8648,4831,8181,9007,4342,3080,2920,7936,1744],function(){return e(e.s=86896)}),_N_E=e.O()}]);