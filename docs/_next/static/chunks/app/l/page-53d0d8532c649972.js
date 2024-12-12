(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9698],{13204:function(e,n,t){Promise.resolve().then(t.t.bind(t,34709,23)),Promise.resolve().then(t.bind(t,58904)),Promise.resolve().then(t.bind(t,47537)),Promise.resolve().then(t.bind(t,22125)),Promise.resolve().then(t.bind(t,10164)),Promise.resolve().then(t.bind(t,73162)),Promise.resolve().then(t.bind(t,59841))},47537:function(e,n,t){"use strict";t.d(n,{Main:function(){return m}});var i=t(32617),r=t(37186),o=t(33966),s=t(15721),l=t(97219),c=t(12042),a=t(78780),u=t(29368);class d extends r.Kj0{constructor(){super(new r._12(4,.2),new c.P({color:"#ff9900"}))}}class h extends r.Kj0{constructor(){super(new r._12(4,.2),new r.jyz({uniforms:{uColor:{value:new r.Ilk("#ff9900")},uSunPosition:{value:new r.Pa4(.5,.7,.3)},uLuminosity:{value:.5}},vertexShader:"\n      varying vec3 vWorldNormal;\n      \n      void main() {\n        vWorldNormal = mat3(modelMatrix) * normal;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n        gl_Position.z += -0.01;\n      }\n    ",fragmentShader:"\n      varying vec3 vWorldNormal;\n      varying vec3 vColor;\n      \n      uniform vec3 uSunPosition;\n      uniform vec3 uColor;\n      uniform float uLuminosity;\n      \n      void main() {\n        vec3 lightDirection = normalize(uSunPosition);\n        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n        light = pow(light, 2.0);\n        light = mix(uLuminosity, 1.0, light);\n        gl_FragColor = vec4(uColor * light, 1.0);\n      }\n    "}))}}function f(){return(0,o.jE)(function*(e){e.useOrbitControls=!1;let n=new s.F({size:[8,8]});n.start(e.three.renderer.domElement),yield(0,u.RC)("three",t=>{n.update(e.three.camera,e.three.aspect)})}),(0,o.Ky)(function*(e){e.scene.background=new r.Ilk("#6699cc"),(0,a.cY)(new r.Kj0(new r.cJO(1,4),new c.P({color:"red"})),e.scene),(0,a.cY)(new l.O,e.scene).box({size:2}).draw().showOccludedLines(),(0,a.cY)(new d,{parent:e.scene,position:[0,.5,0]}),(0,a.cY)(new h,{parent:e.scene,position:[0,-.5,0]}),yield()=>e.scene.clear()},[]),null}function m(){return(0,i.jsx)(o.c,{children:(0,i.jsx)(f,{})})}},22125:function(e,n,t){"use strict";t.d(n,{Main:function(){return p}});var i=t(32617),r=t(37186),o=t(10725),s=t(92059),l=t(33966),c=t(30636),a=t(97219),u=t(12042),d=t(78780),h=t(29368);class f extends r.ZAu{onTick(e){let{sphere:n,pivot:t,position:i}=this.parts,o=e.lerpSin01Time(.5,1.5,{frequency:.2}),s=new r.Pa4().copy(t.position).addScaledVector(t.position,-o);n.matrixAutoUpdate=!1,n.matrix.makeScale(o,o,o).setPosition(s.add(i.position))}constructor(...e){super(...e),this.parts={sphere:(0,d.cY)(new r.Kj0(new r.cJO(1,8),new u.P),{name:"sphere",parent:this}),circle:(0,d.cY)(new a.O().circle({radius:.5}).circle({radius:1}).circle({radius:1.5}).draw(),{name:"circle",parent:this}),pivot:(0,d.cY)(new r.ZAu,{name:"pivot",parent:this}),position:(0,d.cY)(new r.ZAu,{name:"position",parent:this}),grid:(0,d.cY)(new c.K,{name:"grid",parent:this,rotationX:"90deg"})}}}function m(){let e=(0,l.jE)();return(0,l.Ky)(function*(n){n.scene.background=new r.Ilk("#345");let t=new f;n.scene.add(t),yield(0,h.RC)("three",e=>t.onTick(e)),e.sceneSelection.set("Hop!",[t.parts.pivot]),e.toolType.set(o.qK.Move),(0,s.NR)(e,t.parts.pivot),yield()=>t.removeFromParent()},[]),null}function p(){return(0,i.jsxs)(l.c,{children:[(0,i.jsx)(m,{}),(0,i.jsxs)("div",{className:"flex flex-col p-4 gap-2",children:[(0,i.jsx)("p",{children:"Pivot offset to perform translate and scale is quite straightforward:"}),(0,i.jsx)("pre",{className:"bg-[#fff1] rounded px-2 py-1",children:"\nconst scale = ... // some value\nconst translate = new Vector3()\n  .copy(pivot.position)\n  .addScaledVector(pivot.position, -scale)\n\nmatrix\n  .makeScale(scale, scale, scale)\n  .setPosition(translate)\n".trim()})]})]})}},10164:function(e,n,t){"use strict";t.d(n,{ServerProof:function(){return s}});var i=t(32617),r=t(87200);let o=function(){return(0,i.jsx)("div",{className:"w-full h-full flex flex-col items-center justify-center",children:"loading..."})};function s(){let[,e]=(0,r.useState)(0);return(0,r.useEffect)(()=>{let n=!0;return Promise.all([t.e(411),t.e(1033),t.e(7974),t.e(1573),t.e(812),t.e(1796)]).then(t.bind(t,31796)).then(t=>{n&&(o=t.ChooseOne,e(Math.random()))}),()=>{n=!1}},[]),(0,i.jsx)("div",{className:"flex flex-col gap-2",children:(0,i.jsx)("div",{className:"absolute-through",children:(0,i.jsx)(o,{})})})}},73162:function(e,n,t){"use strict";t.d(n,{SafeClient:function(){return o}});var i=t(32617),r=t(87200);function o(){let[e,n]=(0,r.useState)(null);return(0,r.useEffect)(()=>{Promise.all([t.e(7417),t.e(411),t.e(1033),t.e(3935),t.e(812),t.e(3420),t.e(1540),t.e(4157),t.e(3660),t.e(5370)]).then(t.bind(t,75370)).then(e=>{let{Client:t}=e;n(t)})},[]),e?(0,i.jsx)(e,{}):(0,i.jsx)("div",{className:"layer",children:"loading..."})}},59841:function(e,n,t){"use strict";t.d(n,{SafeClient:function(){return o}});var i=t(32617),r=t(87200);function o(){let[e,n]=(0,r.useState)(null);return(0,r.useEffect)(()=>{Promise.all([t.e(411),t.e(1033),t.e(3935),t.e(812),t.e(3420),t.e(1540),t.e(4157),t.e(3660),t.e(7436)]).then(t.bind(t,47436)).then(e=>{let{Client:t}=e;n(t)})},[]),e?(0,i.jsx)(e,{}):(0,i.jsx)("div",{className:"layer",children:"loading..."})}},30636:function(e,n,t){"use strict";t.d(n,{K:function(){return s}});var i=t(88780),r=t(32219);let o={color:"white",opacity:.5,size:[8,8],step:1,frame:!0};class s extends i.ejS{set(e){let{color:n,opacity:t,size:s,step:l,frame:c}={...o,...e},a=(0,r.iK)(s),u=(0,r.iK)(null!=l?l:a),d=[],h=(e,n)=>d.push(new i.Pa4(e,n,0));c&&(h(-a.x/2,+a.y/2),h(+a.x/2,+a.y/2),h(+a.x/2,+a.y/2),h(+a.x/2,-a.y/2),h(+a.x/2,-a.y/2),h(-a.x/2,-a.y/2),h(-a.x/2,-a.y/2),h(-a.x/2,+a.y/2));let f=Math.ceil(-a.x/2/u.x)*u.x;f===-a.x/2&&(f+=u.x);do h(f,-a.y/2),h(f,+a.y/2),f+=u.x;while(f<a.x/2);let m=Math.ceil(-a.y/2/u.y)*u.y;m===-a.y/2&&(m+=u.y);do h(-a.x/2,m),h(+a.x/2,m),m+=u.y;while(m<a.y/2);return this.geometry.setFromPoints(d),this.material.color.set(n),this.material.opacity=t,this.material.transparent=t<1,this}constructor(e){super(),this.set(null!=e?e:o)}}}},function(e){e.O(0,[7987,411,7512,5406,749,4709,812,3420,1540,167,4157,9258,5721,1174,5284,1618,8904,5694,2840,1744],function(){return e(e.s=13204)}),_N_E=e.O()}]);