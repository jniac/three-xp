(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7686],{12219:function(e,t,n){Promise.resolve().then(n.t.bind(n,34709,23)),Promise.resolve().then(n.bind(n,3119)),Promise.resolve().then(n.bind(n,81289))},81289:function(e,t,n){"use strict";n.d(t,{Client:function(){return g}});var s=n(32617),r=n(83119),i=n(87062),l=n(47365),o=n(62274),d=n(9258),a=n(78780),c=n(29368),u=n(5693),f=n(92948),h=n(88780),p=n(80536),w=n(30636),m=n(12042),x=n(67896),v=n(28104),P=n(6246),y=n(97219);let b=new h.Raycaster;class k extends h.Group{createAllChunkMeshes(e){for(let{superChunkIndex:t,chunkIndex:n,chunk:s}of e.enumerateChunks()){let r=P.T.pick(["#ffdd55","#55ddff","#dd55ff","#55ffdd","#ff55dd","#ddff55","#ff5555"]),i=(0,p.eO)(s.voxelFaces()),l=new m.P({color:r}),{x:o,y:d,z:c}=e.metrics.fromIndexes(t,n,0);(0,a.cY)(new h.Mesh(i,l),{parent:this,x:o,y:d,z:c})}let t=e.computeBounds();(0,a.cY)(new y.O,this).box({box3:t,asIntBox3:!0}).draw()}createOneUniqueMesh(e){}constructor(...e){super(...e),this.parts=(()=>{P.T.reset();let e=(0,a.cY)(new h.Mesh(new h.TorusKnotGeometry(10,3,32,6),new m.P({wireframe:!0,side:h.DoubleSide})),this);e.visible=!1,(0,a.cY)(new w.K({size:24}),{parent:this,rotationX:"90deg"});let t=(0,a.cY)(new x.w,this),n=new p.q3;(0,f.a)({world:n});let s=new DataView(new ArrayBuffer(n.voxelStateByteSize));s.setUint8(0,1);let r=new h.Vector3;for(let{x:t,y:i,z:l}of(0,v.loop3)(24,24,24))t-=12,i-=12,l-=12,r.set(t+.5,i+.5,l+.5),b.set(r,new h.Vector3(1,0,0)),b.intersectObject(e,!0).length%2==1&&n.setVoxelState(t,i,l,s);return this.createAllChunkMeshes(n),{sky:t}})()}}var j=n(96915),C=n.n(j);function M(){return(0,u.Ky)(function*(e){(0,f.a)({three:e});let t=new o.F({size:10,perspective:1});yield t.start(e.renderer.domElement),c.vB.get("three").set({minActiveDuration:60}),yield(0,c.RC)("three",n=>{let{aspect:s,camera:r}=e;t.update(r,s,n.deltaTime)}),yield(0,l.p)([[{code:"Space",modifiers:"shift"},()=>{document.body.requestFullscreen()}]]);let n=new i.n(e.scene,e.camera);n.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:100,radiusExponent:2,rings:2,samples:16}),e.pipeline.addPass(n,{type:d.GR.PostProcessing})},[]),null}function _(){return(0,u._v)("main",function*(e){(0,a.cY)(new k,e)},[]),null}function g(){return(0,s.jsx)("div",{children:(0,s.jsxs)(u.H7,{children:[(0,s.jsx)(M,{}),(0,s.jsx)(_,{}),(0,s.jsx)("div",{className:"layer thru flex flex-col p-4 gap-2",children:(0,s.jsx)(r.U,{className:C().Markdown,children:"# World\n\nWorld handles chunks under the hood.\n"})})]})})}}},function(e){e.O(0,[9918,7512,1561,7834,6158,3956,1067,3310,4709,5229,7619,812,2038,3420,1540,9258,4157,3977,1691,3119,5694,2840,1744],function(){return e(e.s=12219)}),_N_E=e.O()}]);