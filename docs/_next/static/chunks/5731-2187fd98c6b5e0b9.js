"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5731],{25731:function(t,e,r){r.d(e,{Main:function(){return tl}});var o,n,i,s=r(78485),l=r(86895),a=r(48181),c=r(77405),u=r(77552),h=r(8834),d=r(85679),f=r(63221),p=r(63549),g=r(38137),w=r(87858),y=r(28142),m=r(9710),x=r(74831),v=r(494),V=r(1296),C=r(48437),M=r(88156),S=r(74175);let k=new d.Vector3(6,4,9),A=[new d.Vector3(0,0,4).multiplyScalar(1),new d.Vector3(0,4,0).multiplyScalar(1),new d.Vector3(6,0,9).multiplyScalar(1),new d.Vector3(6,4,6).multiplyScalar(1)],b=new d.Vector3(0,-4,8),P=new d.Vector3(1,0,1).normalize(),z=new d.Vector3(0,1,-1).normalize(),G=new d.Vector3().crossVectors(P,z).normalize();z.crossVectors(G,P).normalize();let F=new d.Matrix4().makeBasis(P,z,G).setPosition(b),B=new d.Matrix4().copy(F).invert(),I=new d.Euler().setFromRotationMatrix(F);class D extends d.Group{static current(){if(0===this.instances.length)throw Error("No Scope!");return this.instances[this.instances.length-1]}updateScope(){let{aspect:t=1,size:e=4}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t>1?e:e*t,o=r/t;(r!==this.state.width||o!==this.state.height)&&(this.parts.lines.clear().circle({radius:1}).rectangle([-r/2,-o/2,r,o]).plus([0,0],.2).draw(),this.parts.lines.geometry.computeBoundingSphere(),this.state.width=r,this.state.height=o)}isWithin(t){let{x:e,y:r}=t.clone().applyMatrix4(this.matrixWorldInverse),{width:o,height:n}=this.state;return e>=-o/2&&e<=o/2&&r>=-n/2&&r<=n/2}chunkIntersects(t){this.updateMatrixWorld(),t.updateMatrixWorld();let e=!0,r=!0,o=!0,n=!0,i=this.state.width/2,s=this.state.height/2;for(let l=0;l<4;l++){let{x:a,y:c,z:u}=D._chunkIntersectsVectors[l].copy(A[l]).applyMatrix4(t.matrixWorld).applyMatrix4(this.matrixWorldInverse);if(e&&(e=a<-i),o&&(o=a>i),r&&(r=c<-s),n&&(n=c>s),!1===(e||r||o||n))return!0}return!1}toVertigoProps(){let{width:t,height:e}=this.state;return{perspective:.5,size:[t,e],focus:this.position,rotation:this.rotation}}constructor(){super(),this.parts={lines:(0,w.cY)(new M.O,this),debugLines:(0,w.cY)(new M.O,this)},this.state={width:4,height:4},this.matrixWorldInverse=new d.Matrix4,this.destroy=()=>{let t=D.instances.indexOf(this);if(-1===t)throw Error("Scope instance not found");D.instances.splice(t,1)},D.instances.push(this),this.position.set(0,0,6),this.rotation.setFromRotationMatrix(F,C.a.default.rotation.order),this.rotation.x+=(0,S.FE)("20deg"),this.updateMatrix(),this.updateMatrixWorld(),this.matrixWorldInverse.copy(this.matrixWorld).invert()}}D.instances=[],D._chunkIntersectsVectors=[new d.Vector3,new d.Vector3,new d.Vector3,new d.Vector3];var O=r(81796),Y=r(82446),E=r(49635),_=r(16573);function L(t,e){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new d.Vector3,o=.5**e;return r.set(6*t*o,4*(.5*o*2-1),6*t*o+8*(1-o)).multiplyScalar(1)}function R(){let t;for(var e,r,o=arguments.length,n=Array(o),i=0;i<o;i++)n[i]=arguments[i];let s=0,l=0;if("number"==typeof n[0])[s,l]=n,t=null!==(e=n[3])&&void 0!==e?e:new d.Vector2;else{let[e]=n;s=e.x,l=e.y,t=null!==(r=n[1])&&void 0!==r?r:new d.Vector2}let a=-Math.log2(((l/=1)/4+1)/2)-1,c=(s/=1)/(6*.5**a);return t.set(c,a)}function X(t,e,r){let o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,{x:n,y:i,z:s}=e,l=n+r,a=i+r,c=s+r;for(let e=s;e<c;e++)for(let r=i;r<a;r++)for(let i=n;i<l;i++)t.getVoxelState(i,r,e).setInt8(0,o)}function W(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,r=k.clone().multiplyScalar(4/e),o=[];for(let n of(0,_.KA)(r)){let r=n.x*e,i=n.y*e,s=n.z*e;(function(t,e,r,o){var n,i,s,l,a,c;let u=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1;return t.getVoxelState(e,r,o).getInt8(0)>0&&!((null!==(l=null===(n=t.tryGetVoxelState(e-u,r,o))||void 0===n?void 0:n.getInt8(0))&&void 0!==l?l:0)>0)&&!((null!==(a=null===(i=t.tryGetVoxelState(e,r+u,o))||void 0===i?void 0:i.getInt8(0))&&void 0!==a?a:0)>0)&&!((null!==(c=null===(s=t.tryGetVoxelState(e,r,o+u))||void 0===s?void 0:s.getInt8(0))&&void 0!==c?c:0)>0)})(t,r,i,s,e)&&y.T.chance(1-n.py)&&o.push(new d.Vector3(r,i,s))}return o}function U(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,r=k.clone().multiplyScalar(4/e),o=[];for(let n of(0,_.KA)(r)){let r=n.x*e,i=n.y*e,s=n.z*e;(function(t,e,r,o){var n,i,s,l,a,c;let u=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1;return!(t.getVoxelState(e,r,o).getInt8(0)>0)&&(null!==(l=null===(n=t.tryGetVoxelState(e+u,r,o))||void 0===n?void 0:n.getInt8(0))&&void 0!==l?l:0)>0&&(null!==(a=null===(i=t.tryGetVoxelState(e,r-u,o))||void 0===i?void 0:i.getInt8(0))&&void 0!==a?a:0)>0&&(null!==(c=null===(s=t.tryGetVoxelState(e,r,o-u))||void 0===s?void 0:s.getInt8(0))&&void 0!==c?c:0)>0})(t,r,i,s,e)&&y.T.chance(1-n.py)&&o.push(new d.Vector3(r,i,s))}return o}console.log(R(L(3,2))),console.log(R(L(-5,21)));class T extends d.Mesh{createDots(){let t=new d.InstancedMesh(new d.IcosahedronGeometry(.1,8),new p.P,4);for(let[e,r]of((0,w.cY)(t,this),A.entries()))t.setMatrixAt(e,(0,E.$)({position:r})),t.setColorAt(e,(0,E.E)("#ffffff"));return this.dots=t,this}updateDots(t){this.dots||this.createDots();let e=this.dots;for(let[r,o]of A.entries()){e.setMatrixAt(r,(0,E.$)({position:o}));let n=t.isWithin(o)?"#00ffa6":"#ff0000";e.setColorAt(r,(0,E.E)(n))}e.instanceMatrix.needsUpdate=!0,e.instanceColor.needsUpdate=!0}get gridCoords(){return this._gridCoords}setGridCoords(t){(0,O.iK)(t,this._gridCoords);let{x:e,y:r}=this._gridCoords;this.scale.setScalar(.5**r),L(e,r,this.position)}toWhite(){this.material.color.set(16777215)}toColor(){this.material.color.set(this.color)}constructor({world:t=null,color:e=16777215*y.T.random()}={}){let r=new Y.z(Math.ceil(115.19999999999999),1),o=new d.Vector3;for(let{x:t,y:e}of(0,_.B0)(6,4))o.set(t,e,t+4-1-e).multiplyScalar(4),X(r,o,4);for(let t=0;t<6;t+=2)o.set(t+1,3,t).multiplyScalar(4),X(r,o,4),y.T.chance(.8)&&(o.set(t+1,4,t).multiplyScalar(4),X(r,o,4));{let t=U(r,2),e=W(r,2);for(let e of t)X(r,e,2,1);for(let t of e)X(r,t,2,0)}{let t=U(r,1),e=W(r,1);for(let e of t)y.T.chance(.25)&&X(r,e,1,1);for(let t of e)y.T.chance(.25)&&X(r,t,1,0)}console.time("geometry");let n=(0,Y.eO)(r.voxelFaces());console.timeEnd("geometry");let i=1/4;n.scale(i,i,i),super(n,new p.P({color:e})),this._gridCoords=new d.Vector2,this.world=null,this.dots=null,(0,w.cY)(new d.AxesHelper,this),this.chunk=r,this.color=e,this.world=t}}function j(t,e){if(t<-32768||t>=32768||e<-32768||e>=32768)throw RangeError("x and y must be in the range -0x8000 to 0x7fff, received: ".concat(t," (0x").concat(t.toString(16),"), ").concat(e," (0x").concat(e.toString(16),")"));return(t+=32768)<<16|(e+=32768)}let H=new d.Vector2;function*N(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[o,n]=(()=>{if(1!==e.length)return e;{let{x:t,y:r}=(0,S.iK)(e[0]);return[t,r]}})();yield H.set(Math.floor((o-1)/2),n-1),yield H.set(Math.floor((o+1)/2),n-1),yield H.set(o-1,n),yield H.set(o+1,n),yield H.set(2*o-1,n+1),yield H.set(2*o,n+1),yield H.set(2*o+1,n+1),yield H.set(2*o+2,n+1)}class K extends d.Group{drawCircles(){let{count:t=1,step:e=1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};for(let r=1;r<t;r++){let t=1+r*e;(0,w.cY)(new d.LineSegments(this.parts.circles.geometry,this.parts.circles.material),{parent:this,scaleScalar:t})}return this}constructor(...t){super(...t),this.parts=(()=>{let t=new M.O;t.circle({radius:1,color:f.w.defaultOptions.zColor}).circle({radius:1,color:f.w.defaultOptions.xColor,transform:{rotationY:"90deg"}}).circle({radius:1,color:f.w.defaultOptions.yColor,transform:{rotationX:"90deg"}}).draw();let e=new d.Mesh(new f.w,new p.P({vertexColors:!0}));return{axes:(0,w.cY)(e,this),circles:(0,w.cY)(t,this)}})()}}class Z extends d.Group{static current(){if(0===this.instances.length)throw Error("No World!");return this.instances[this.instances.length-1]}scopeUpdate(t){let e=(0,u.M3)(1e-4,t);this.dampedScopeCoordinates.lerp(this.scopeCoordinates,e);let{x:r,y:o}=this.dampedScopeCoordinates;this.scope.position.set(0,0,6).addScaledVector(P,r),this.worldScale=2**(.33*o),this.setChunkGroupScale(this.worldScale)}getChunk(t,e){var r;return null!==(r=this.chunks.get(j(t,e)))&&void 0!==r?r:null}ensureChunk(t,e){let r=j(t,e),o=this.chunks.get(r);if(o)return o;{let r=(0,w.cY)(new T({world:this}),this.chunkGroup);return this.chunks.set(j(t,e),r),r.setGridCoords([t,e]),r}}ensureChunkNeighbors(t,e){for(let r of(this.ensureChunk(t,e),N(t,e)))this.ensureChunk(r.x,r.y)}ensureScopeChunks(){let t=new Set([j(0,0)]),e=[this.ensureChunk(0,0)],r=0;for(;e.length>0;){if(r++>100){console.error("Exceeded maximum chunk count of ".concat(100));break}let o=e.pop();if(this.scope.chunkIntersects(o))for(let r of N(o.gridCoords)){let o=j(r.x,r.y);t.has(o)||(t.add(o),e.push(this.ensureChunk(r.x,r.y)))}}}toWhite(){for(let t of this.chunks.values())t.toWhite()}toColor(){for(let t of this.chunks.values())t.toColor()}constructor(){super(),this.origin=(0,w.cY)(new d.AxesHelper,{parent:this,position:b,rotation:I}),this.chunkGroup=(0,w.cY)(new d.Group,{parent:this}),this.scopeCoordinates=new d.Vector2,this.dampedScopeCoordinates=new d.Vector2,this.worldScale=1,this.scopeOriginPoint=new d.Vector3,this.scopeCenterChunkPoint=new d.Vector3,this.scope=(0,w.cY)(new D,this),this.XXX=(0,w.cY)(new K,this.chunkGroup),this.YYY=new d.Vector2,this.setChunkGroupScale=(()=>{let t=new d.Matrix4;return e=>{var r;this.scopeCenterChunkPoint.copy(this.scope.position).applyMatrix4(B),this.scopeOriginPoint.set(this.scopeCenterChunkPoint.x,0,0).applyMatrix4(F),this.chunkGroup.position.copy(this.scopeOriginPoint).addScaledVector(this.scopeOriginPoint,-e),this.chunkGroup.scale.setScalar(e),this.chunkGroup.updateMatrix(),this.XXX.position.copy(this.scope.position).applyMatrix4(B),this.XXX.position.z=0,this.XXX.position.applyMatrix4(F).applyMatrix4(t.copy(this.chunkGroup.matrix).invert());let{x:o,y:n}=R(this.XXX.position,this.YYY);o=Math.round(o-.5),n=Math.round(n+.5),this.toWhite(),null===(r=this.getChunk(o,n))||void 0===r||r.toColor()}})(),this.chunks=new Map,this.destroy=()=>{this.scope.destroy(),this.chunks.clear(),this.clear();let t=Z.instances.indexOf(this);if(-1===t)throw Error("World instance not found");Z.instances.splice(t,1)},Z.instances.push(this)}}Z.instances=[],(o=n||(n={}))[o.Free=0]="Free",o[o.Scope=1]="Scope";class q{initialize(t){return this.element=t,this}*doStart(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null!==(i=this.element)&&void 0!==i?i:document.body;yield(0,x.w)(t,{onDrag:t=>{let e=Z.current();e.scopeCoordinates.x+=-(.005*t.delta.x)/e.worldScale,e.scopeCoordinates.y+=-(.01*t.delta.y)}}),yield(0,m.RC)("three",t=>{let e=Z.current();e.scopeUpdate(t.deltaTime);let r=e.scope.position;this.vertigoControls.vertigo.set({focus:r}),this.vertigoControls.dampedVertigo.set({focus:r})})}start(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];this._started||(this._destroyables.collect(this.doStart(...e)),this._started=!0)}stop(){this._started&&(this._destroyables.destroy(),this._started=!1)}toggle(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:!this._started;t?this.start():this.stop()}update(t,e,r){this.vertigoControls.update(t,e,r)}constructor(){this.position=new d.Vector2,this.dampedPosition=new d.Vector2,this.scale=1,this._destroyables=new V.N,this.vertigoControls=new v.F({perspective:.5}),this._started=!1,this.destroy=()=>{this._destroyables.destroy()}}}class Q{get mode(){return this._mode}set mode(t){this.setMode(t)}initialize(t,e){this.camera=t,this.freeVertigoControls.initialize(e).toggle(0===this._mode),this.scopeCameraHandler.initialize(e).toggle(1===this._mode);let r=D.current().toVertigoProps();return this.scopeCameraHandler.vertigoControls.vertigo.set(r),this.scopeCameraHandler.vertigoControls.dampedVertigo.set(r),this}setMode(t){if(t%=2,this._mode!==t)switch(this._mode=t,this.freeVertigoControls.toggle(0===t),this.scopeCameraHandler.toggle(1===t),t){case 0:(()=>{this.mode=Q.Mode.Free,this.freeVertigoControls.dampedVertigo.copy(this.scopeCameraHandler.vertigoControls.dampedVertigo)})();break;case 1:(()=>{this.mode=Q.Mode.Scope,this.scopeCameraHandler.vertigoControls.dampedVertigo.copy(this.freeVertigoControls.dampedVertigo),this.scopeCameraHandler.vertigoControls.vertigo.set(D.current().toVertigoProps())})()}}onTick(t,e){switch(this._mode){case 0:this.freeVertigoControls.update(this.camera,e,t.deltaTime);break;case 1:this.scopeCameraHandler.update(this.camera,e,t.deltaTime)}}constructor(){this._mode=1,this.freeVertigoControls=new v.F({size:24,perspective:1}),this.scopeCameraHandler=new q,this.destroy=()=>{this.freeVertigoControls.destroy(),this.scopeCameraHandler.destroy();let t=Q.instances.indexOf(this);if(-1===t)throw Error("CameraHandler instance not found");Q.instances.splice(t,1)},Q.instances.push(this)}}Q.Mode=n,Q.instances=[];var $=r(27275),J=r(48583);r(94588);let tt=(0,$.createContext)(null);function te(t,e){let r=(0,$.useContext)(tt);return(0,J.sv)(async function*(e,o){if(t){let e=t(r,o);if(e&&"function"==typeof e.next)do{let{value:t,done:r}=await e.next();if(r)break;yield t}while(o.mounted)}},null!=e?e:"always"),r}let tr={className:"",assetsPath:"/"};function to(t){let{children:e,className:r,assetsPath:o}={...tr,...t},n=(0,$.useMemo)(()=>new a.Vu,[]);n.loader.setPath(o);let{ref:i}=(0,J.Nv)({debounce:!0},function*(t,e){yield n.initialize(t),e.triggerRender(),Object.assign(window,{three:n})},[]);return(0,s.jsx)("div",{ref:i,className:r,style:{position:"absolute",inset:0},children:(0,s.jsx)(tt.Provider,{value:n,children:n.initialized&&e})})}function tn(t){return function(){let[t,e]=(0,$.useState)(!1);return(0,$.useLayoutEffect)(()=>{e(!0)},[]),t}()&&(0,s.jsx)(to,{...t})}function ti(){return!function(t,e,r){let o=(0,$.useMemo)(()=>new d.Group,[]);o.name=t,te(async function*(t,r){if(t.scene.add(o),yield()=>{o.clear(),o.removeFromParent()},e){let n=e(o,t,r);if(n&&"function"==typeof n.next)do{let{value:t,done:e}=await n.next();if(e)break;yield t}while(r.mounted)}},r)}("fractal-grid",function*(t,e){var r;(0,w.cY)(new g.w({color:"#110512"}),t),(0,w.cY)(new d.Mesh(new d.TorusKnotGeometry(2.5,.025,512,32),new p.P({color:"#0cf"})),t).visible=!1,y.T.seed(98763);let o=(0,w.cY)(new Z,t);yield o.destroy,o.scope.updateScope({aspect:e.aspect}),o.ensureScopeChunks();let n=new Q().initialize(e.camera,e.renderer.domElement);yield(0,m.RC)("three",t=>{n.onTick(t,e.aspect),o.scope.updateScope({aspect:e.aspect})}),o.toColor(),null===(r=o.getChunk(0,0))||void 0===r||r.toWhite(),Object.assign(window,{world:o,cameraHandler:n}),(0,w.cY)(new d.Mesh(new f.w,new p.P({vertexColors:!0})),t)},[]),null}function ts(){return te(function*(t){let e=new l.n(t.scene,t.camera);e.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:2,radiusExponent:2,rings:2,samples:24}),yield t.pipeline.addPass(e,{type:a.GR.PostProcessing}),(0,h.a)({three:t,calculateExponentialDecayLerpRatio:u.M3,calculateExponentialDecayLerpRatio2:u.zl,lerp:c.t7})},[]),null}function tl(){return(0,s.jsx)("div",{className:"FractalGrid",children:(0,s.jsxs)(tn,{children:[(0,s.jsx)("h1",{children:"FractalGrid"}),(0,s.jsx)(ts,{}),(0,s.jsx)(ti,{})]})})}},8834:function(t,e,r){r.d(e,{Leak:function(){return l},a:function(){return s}});var o=r(40855),n=r(79509),i=r(28142);function s(t){Object.assign(window,{...n,...o,...t,PRNG:i.T})}function l(t){return s(t),null}},82446:function(t,e,r){r.d(e,{z:function(){return v},eO:function(){return S}});var o,n,i,s,l,a,c=r(85679);(o=s||(s={}))[o.X=0]="X",o[o.Y=2]="Y",o[o.Z=4]="Z",(n=l||(l={}))[n.R=0]="R",n[n.L=1]="L",n[n.U=2]="U",n[n.D=3]="D",n[n.F=4]="F",n[n.B=5]="B",(i=a||(a={}))[i.None=0]="None",i[i.All=63]="All",i[i.R=1]="R",i[i.L=2]="L",i[i.U=4]="U",i[i.D=8]="D",i[i.F=16]="F",i[i.B=32]="B";let u=[5,4,0,1,0,1],h=[new c.Vector3(1,0,0),new c.Vector3(-1,0,0),new c.Vector3(0,1,0),new c.Vector3(0,-1,0),new c.Vector3(0,0,1),new c.Vector3(0,0,-1)],d=0,f=0,p=0,g=0,w=[],y={A:()=>(w[d++]=f,w[d++]=p,w[d++]=g,y),B:()=>(w[d++]=f,w[d++]=p,w[d++]=g+1,y),C:()=>(w[d++]=f,w[d++]=p+1,w[d++]=g,y),D:()=>(w[d++]=f,w[d++]=p+1,w[d++]=g+1,y),E:()=>(w[d++]=f+1,w[d++]=p,w[d++]=g,y),F:()=>(w[d++]=f+1,w[d++]=p,w[d++]=g+1,y),G:()=>(w[d++]=f+1,w[d++]=p+1,w[d++]=g,y),H:()=>(w[d++]=f+1,w[d++]=p+1,w[d++]=g+1,y)},m={R:()=>(w[d++]=1,w[d++]=0,w[d++]=0,m),L:()=>(w[d++]=-1,w[d++]=0,w[d++]=0,m),U:()=>(w[d++]=0,w[d++]=1,w[d++]=0,m),D:()=>(w[d++]=0,w[d++]=-1,w[d++]=0,m),F:()=>(w[d++]=0,w[d++]=0,w[d++]=1,m),B:()=>(w[d++]=0,w[d++]=0,w[d++]=-1,m),R6:()=>m.R().R().R().R().R().R(),L6:()=>m.L().L().L().L().L().L(),U6:()=>m.U().U().U().U().U().U(),D6:()=>m.D().D().D().D().D().D(),F6:()=>m.F().F().F().F().F().F(),B6:()=>m.B().B().B().B().B().B()};class x{positionToArray(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,{position:r,direction:o}=this;switch(w=t,d=e,f=r.x,p=r.y,g=r.z,o){case l.R:y.E().G().F().F().G().H();break;case l.L:y.A().B().D().A().D().C();break;case l.U:y.D().H().G().D().G().C();break;case l.D:y.A().E().F().A().F().B();break;case l.F:y.B().F().H().B().H().D();break;case l.B:y.A().C().E().E().C().G()}return t}normalToArray(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,{direction:r}=this;switch(w=t,d=e,r){case l.R:m.R6();break;case l.L:m.L6();break;case l.U:m.U6();break;case l.D:m.D6();break;case l.F:m.F6();break;case l.B:m.B6()}return t}constructor(t,e,r=u[e]){this.position=t,this.direction=e,this.tangent=r}}class v{getVoxelState(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[o,n,i]=1===e.length?[e[0].x,e[0].y,e[0].z]:e,{size:s,size2:l,voxelStateByteSize:a,voxelState:c}=this;if(o<0||o>=s||n<0||n>=s||i<0||i>=s)throw Error("Coordinates out of bounds: ".concat(o,", ").concat(n,", ").concat(i,", size: ").concat(s));return new DataView(c,(o+n*s+i*l)*a,a)}tryGetVoxelState(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let[o,n,i]=1===e.length?[e[0].x,e[0].y,e[0].z]:e,{size:s}=this;return o<0||o>=s||n<0||n>=s||i<0||i>=s?null:this.getVoxelState(o,n,i)}*voxelFaces(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:t=>0!==t.getUint8(0),{size:e}=this,r=new x(new c.Vector3,0);for(let o=0;o<e;o++)for(let n=0;n<e;n++)for(let i=0;i<e;i++)if(t(this.getVoxelState(o,n,i)))for(let e=0;e<6;e++){let s=h[e],l=this.tryGetVoxelState(o+s.x,n+s.y,i+s.z);l&&t(l)||(r.position.set(o,n,i),r.direction=e,yield r)}}constructor(t=16,e=4){this.worldConnection=null,this.size=t,this.size2=t*t,this.size3=t*t*t,this.voxelStateByteSize=e,this.voxelState=new ArrayBuffer(t**3*e)}}class V{ensureSize(t){if(this.array.length<t){let e=new Float32Array(1<<Math.ceil(Math.log(t)/Math.log(2)));e.set(this.array),this.array=e}return this.array}copy(t){return new Float32Array(this.array.buffer,0,t).slice()}constructor(t=0){this.array=new Float32Array(0),this.ensureSize(t)}}let C=new V(768),M=new V(768);function S(t){let{geometry:e=new c.BufferGeometry}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r="function"==typeof t?t():t;C.array.fill(0),M.array.fill(0);let o=0;for(let t of r){let e=18*o;C.ensureSize(e+18),M.ensureSize(e+18),t.positionToArray(C.array,e),t.normalToArray(M.array,e),o++}return e.setAttribute("position",new c.BufferAttribute(C.copy(18*o),3)),e.setAttribute("normal",new c.BufferAttribute(M.copy(18*o),3)),e}},63221:function(t,e,r){r.d(e,{w:function(){return c}});var o=r(85679),n=r(96799);let i={axis:"x",length:1,radialSegments:12,radius:.01,coneRatio:.1,radiusScale:1,vertexColor:!0,baseCap:"flat",color:"white"},s=new o.Color;function l(t){let{axis:e,length:r,radius:l,radialSegments:a,coneRatio:c,radiusScale:u,vertexColor:h,baseCap:d,color:f}={...i,...t},p=l*u,g=r*c,w=new o.ConeGeometry(3*p,g,a),y=new o.CylinderGeometry(p,p,1,a,1,!0),m=r-g,x=r-.5*g;w.rotateZ(-Math.PI/2).translate(x,0,0),y.scale(1,m,1).rotateZ(-Math.PI/2).translate(.5*m,0,0);let v="none"===d?new o.BufferGeometry:"flat"===d?new o.CircleGeometry(p,a).rotateY(-Math.PI/2):new o.SphereGeometry(p,a,3,0,2*Math.PI,0,.5*Math.PI).rotateZ(Math.PI/2).rotateX(Math.PI/2),V=(0,n.n4)([w,y,v]);switch(e){case"y":V.rotateZ(Math.PI/2);break;case"z":V.rotateY(-Math.PI/2)}if(h){let t=V.attributes.position.count,e=new o.BufferAttribute(new Float32Array(3*t),3);V.setAttribute("color",e),s.set(f);for(let r=0;r<t;r++)e.setXYZ(r,s.r,s.g,s.b)}return V}let a={xColor:"#ff3333",yColor:"#33cc66",zColor:"#3366ff"};class c extends o.BufferGeometry{static get defaultOptions(){return{...a}}constructor(t){super();let{xColor:e,yColor:r,zColor:o,...i}={...a,...t},s=l({...i,axis:"x",color:e}),c=l({...i,axis:"y",color:r}),u=l({...i,axis:"z",color:o}),h=(0,n.n4)([s,c,u]);this.copy(h),h.dispose()}}},88156:function(t,e,r){r.d(e,{O:function(){return u}});var o=r(85679),n=r(58648),i=r(81796);let s=new o.Vector2,l=new o.Vector3,a=new o.Matrix4;function c(t,e,r){if(null==r?void 0:r.transform)for(let t of((0,i.Xe)(r.transform,a),e))t.applyMatrix4(a);(null==r?void 0:r.color)&&t.colors.set(t.points.length,new o.Color(r.color)),t.points.push(...e)}class u extends o.LineSegments{showOccludedLines(){let{opacity:t=.2}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=new o.LineBasicMaterial({color:this.material.color,transparent:!0,depthFunc:o.GreaterDepth,opacity:t}),r=new o.LineSegments(this.geometry,e);return this.add(r),this}clear(){return this.points.length=0,this.colors.clear(),this.geometry.setFromPoints(this.points),this}draw(){if(this.geometry.setFromPoints(this.points),this.geometry.computeBoundingSphere(),this.material.vertexColors=this.colors.size>0,this.material.needsUpdate=!0,this.colors.size>0){var t;let e=new o.Color(null!==(t=this.colors.get(0))&&void 0!==t?t:"white"),r=this.points.length,n=function(t){let e=t.attributes.color;if(e)return e;{let e=new o.BufferAttribute(new Float32Array(3*t.attributes.position.count),3);return t.setAttribute("color",e),e}}(this.geometry);for(let t=0;t<r;t++){let r=this.colors.get(t);r&&e.copy(r),n.setXYZ(t,e.r,e.g,e.b)}}return this}line(t,e,r){return c(this,[(0,i.Q7)(t),(0,i.Q7)(e)],r),this}circle(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let{x:n,y:l,radius:a,segments:h,...d}={...u.circleDefaultOptions,...(()=>{if(e.length>1){let[t,r,o]=e,{x:n,y:l}=(0,i.iK)(t,s);return{x:n,y:l,radius:r,...o}}return e[0]})()},f=new o.Vector3(1,0,0),p=new o.Vector3(0,1,0),g=[];for(let t=0;t<h;t++){let e=t/h*Math.PI*2,r=(t+1)/h*Math.PI*2,i=Math.cos(e)*a,s=Math.sin(e)*a,c=Math.cos(r)*a,u=Math.sin(r)*a,d=new o.Vector3(n,l,0).addScaledVector(f,i).addScaledVector(p,s),w=new o.Vector3(n,l,0).addScaledVector(f,c).addScaledVector(p,u);g.push(d,w)}return c(this,g,d),this}rectangle(t,e){let{centerX:r,centerY:i,width:s,height:l}=n.Ae.from(t),a=s/2,u=l/2,h=new o.Vector3(r-a,i-u,0),d=new o.Vector3(r+a,i-u,0),f=new o.Vector3(r+a,i+u,0),p=new o.Vector3(r-a,i+u,0);return c(this,[h,d,d,f,f,p,p,h],e),this}box(){let{center:t=[0,0,0],size:e=1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{x:r,y:n,z:s}=(0,i.Q7)(t,l),{x:a,y:c,z:u}=(0,i.Q7)(e,l),h=a/2,d=c/2,f=u/2,p=new o.Vector3(r-h,n-d,s-f),g=new o.Vector3(r+h,n-d,s-f),w=new o.Vector3(r+h,n+d,s-f),y=new o.Vector3(r-h,n+d,s-f),m=new o.Vector3(r-h,n-d,s+f),x=new o.Vector3(r+h,n-d,s+f),v=new o.Vector3(r+h,n+d,s+f),V=new o.Vector3(r-h,n+d,s+f);return this.points.push(p,g,g,w,w,y,y,p),this.points.push(m,x,x,v,v,V,V,m),this.points.push(p,m,g,x,w,v,y,V),this}plus(t,e,r){let n=e/2,{x:l,y:a}=(0,i.iK)(t,s),u=new o.Vector3(l-n,a,0);return c(this,[u,new o.Vector3(l+n,a,0),new o.Vector3(l,a-n,0),new o.Vector3(l,a+n,0)],r),this}cross(t,e,r){let n=e/2,{x:l,y:a}=(0,i.iK)(t,s),u=new o.Vector3(l-n,a-n,0);return c(this,[u,new o.Vector3(l+n,a+n,0),new o.Vector3(l-n,a+n,0),new o.Vector3(l+n,a-n,0)],r),this}constructor(...t){super(...t),this.points=[],this.colors=new Map}}u.circleDefaultOptions={x:0,y:0,radius:.5,segments:96}},63549:function(t,e,r){r.d(e,{P:function(){return s}});var o=r(85679),n=r(47174);let i={vertexColors:!0,luminosity:.5};class s extends o.MeshBasicMaterial{constructor(t){let{luminosity:e,vertexColors:r,...s}={...i,...t},l={uSunPosition:{value:new o.Vector3(.5,.7,.3)},uLuminosity:{value:e}};super(s),this.onBeforeCompile=t=>n.b.with(t).uniforms(l).varying({vWorldNormal:"vec3"}).vertex.mainAfterAll("\n          vWorldNormal = mat3(modelMatrix) * normal;\n      ").fragment.after("map_fragment","\n        vec3 lightDirection = normalize(uSunPosition);\n        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n        light = pow(light, 2.0);\n        light = mix(uLuminosity, 1.0, light);\n        diffuseColor *= light;\n      "),this.sunPosition=l.uSunPosition.value}}},38137:function(t,e,r){r.d(e,{w:function(){return i}});var o=r(85679);let n=new o.IcosahedronGeometry(1,4);class i extends o.Mesh{constructor(t){super(n,new o.MeshBasicMaterial({color:"#0c529d",...t,side:o.BackSide,depthWrite:!1,depthTest:!1})),this.renderOrder=-1,this.frustumCulled=!1,this.matrixAutoUpdate=!1,this.onBeforeRender=(t,e,r)=>{let o=(r.near+r.far)/2;this.position.copy(r.position),this.scale.setScalar(o),this.updateMatrix(),this.updateMatrixWorld()}}}},49635:function(t,e,r){r.d(e,{$:function(){return s},E:function(){return a}});var o=r(85679),n=r(81796);let i=new o.Matrix4;function s(t){return(0,n.Xe)(t,i)}let l=new o.Color;function a(t){return l.set(t)}},40855:function(t,e,r){function o(t,e){for(let r of t)if(e(r))return!0;return!1}function n(t,e){for(let r of t)if(!e(r))return!1;return!0}function i(t,e,r){let o=[];function n(t){let e=[];return o[t]=e,e}if(void 0!==r)for(let t=0;t<r;t++)n(t);for(let r of t){var i;let t=e(r);(null!==(i=o[t])&&void 0!==i?i:n(t)).push(r)}return o}r.r(e),r.d(e,{every:function(){return n},some:function(){return o},split:function(){return i}})},16573:function(t,e,r){function*o(t){let e=0,r={get i(){return e},get t(){return e/t},get p(){return e/(t-1)}};for(e=0;e<t;e++)yield r}function*n(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let o=0,n=0;2===e.length?(o=e[0],n=e[1]):Array.isArray(e[0])?(o=e[0][0],n=e[0][1]):(o=e[0].x,n=e[0].y);let i=0,s=0,l=0,a={get i(){return i},get x(){return s},get y(){return l},get tx(){return s/o},get ty(){return l/n},get px(){return s/(o-1)},get py(){return l/(n-1)}};for(l=0;l<n;l++)for(s=0;s<o;s++)yield a,i++}function*i(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];let o=0,n=0,i=0;3===e.length?(o=e[0],n=e[1],i=e[2]):Array.isArray(e[0])?(o=e[0][0],n=e[0][1],i=e[0][2]):(o=e[0].x,n=e[0].y,i=e[0].z);let s=0,l=0,a=0,c=0,u={get i(){return s},get x(){return l},get y(){return a},get z(){return c},get tx(){return l/o},get ty(){return a/n},get tz(){return c/i},get px(){return l/(o-1)},get py(){return a/(n-1)},get pz(){return c/(i-1)}};for(c=0;c<i;c++)for(a=0;a<n;a++)for(l=0;l<o;l++)yield u,s++}r.d(e,{B0:function(){return n},KA:function(){return i},VX:function(){return o}})},28142:function(t,e,r){r.d(e,{T:function(){return c}});let o=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return(t=(t=(7*t+Math.sqrt(t)+16087*Math.sin(t))%2147483647)<0?t+2147483647:t)>1?2147483647&t:0===t?345678:123456},n=t=>t=2147483647&Math.imul(t,48271),i=t=>(t-1)/2147483646,s=t=>t,l={weightsAreNormalized:!1,indexOffset:0,forbiddenItems:[]};function a(){let t=n(n(o(123456)));function e(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:123456;return"string"==typeof e&&(e=e.split("").reduce((t,e)=>7*t+e.charCodeAt(0),0)),t=n(n(o(e))),d}function r(){return i(t=n(t))}function a(t){switch(t.length){default:return[0,1,s];case 1:return[0,t[0],s];case 2:return[t[0],t[1],s];case 3:return[t[0],t[1],t[2]]}}function c(){for(var t=arguments.length,e=Array(t),o=0;o<t;o++)e[o]=arguments[o];let[n,i,s]=a(e);return n+(i-n)*s(r())}function u(){for(var t,e=arguments.length,o=Array(e),n=0;n<e;n++)o[n]=arguments[n];let[i,s,{weightsAreNormalized:a,indexOffset:c,forbiddenItems:u}]=function(t){let[e,r=null,o]=t,n={...l,...o};if(Array.isArray(e))return[e,r,n];if("object"==typeof e)return[Object.values(e),r?Object.values(r):null,n];throw Error("pick: unsupported options type")}(o);if(u.length>0){let e=new Set;for(let t of u){let r=i.indexOf(t);r>=0&&e.add(r)}if(i=i.filter((t,r)=>!e.has(r)),s=null!==(t=null==s?void 0:s.filter((t,r)=>!e.has(r)))&&void 0!==t?t:null,0===i.length)throw Error("pick: all items are forbidden")}if(null===s){let t=Math.floor(r()*i.length);return c&&(t+=c,(t%=i.length)<0&&(t+=i.length)),i[t]}if(!a){let t=s.reduce((t,e)=>t+e,0);s=s.map(e=>e/t)}let h=r(),d=0;for(let t=0;t<i.length;t++)if(h<(d+=s[t]))return i[t];throw Error("among: unreachable")}function h(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,o=r(),n=r(),i=Math.sqrt(-2*Math.log(o)),s=2*Math.PI*n;return[t+e*i*Math.cos(s),t+e*i*Math.sin(s)]}let d={seed:e,seedMax:function(){return 2147483647},reset:function(){return e(123456),d},next:function(){return t=n(t),d},random:r,between:c,around:function(){for(var t=arguments.length,e=Array(t),o=0;o<t;o++)e[o]=arguments[o];let[n=1,i=s]=e,l=2*r();return(l>1?1:-1)*i(l>1?l-1:l)*n},int:function(){for(var t=arguments.length,e=Array(t),o=0;o<t;o++)e[o]=arguments[o];let[n,i,s]=a(e);return n+Math.floor(s(r())*(i-n))},chance:function(t){return r()<t},shuffle:function(t){let{mutate:e=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=e&&Array.isArray(t)?t:[...t],n=o.length;for(let t=0;t<n;t++){let e=Math.floor(n*r()),i=o[t];o[t]=o[e],o[e]=i}return o},pick:u,createPicker:function(t){let e=t.map(t=>{let[e]=t;return e}),r=t.map(t=>{let[e,r]=t;return r}),o=r.reduce((t,e)=>t+e,0);for(let[t,e]of r.entries())r[t]=e/o;return()=>u(e,r,{weightsAreNormalized:!0})},vector:function(t,e){let[r=0,o=1]=Array.isArray(e)?e:[null==e?void 0:e.min,null==e?void 0:e.max];for(let e of Object.keys(t))t[e]=c(r,o);return t},unitVector2:function(t){let e=2*Math.PI*r();return t.x=Math.cos(e),t.y=Math.sin(e),t},unitVector3:function(t){let e=r(),o=r(),n=2*Math.PI*e,i=Math.acos(1-2*o);return t.x=Math.sin(i)*Math.cos(n),t.y=Math.sin(i)*Math.sin(n),t.z=Math.cos(i),t},normalVector:function(t){let e=Object.keys(t),r=e.length,o=Math.sqrt(r);for(let n=0;n<r;n+=2){let[i,s]=h();t[e[n]]=i/o,n+1<r&&(t[e[n+1]]=s/o)}return t},unitVector:function(t){let e=Object.keys(t),r=e.length,o=0;for(let n=0;n<r;n+=2){let[i,s]=h();t[e[n]]=i,o+=i*i,n+1<r&&(t[e[n+1]]=s,o+=s*s)}o=Math.sqrt(o);for(let n=0;n<r;n++)t[e[n]]/=o;return t},boxMuller:h};return d}let c=class{constructor(t){Object.assign(this,a().seed(t))}};Object.assign(c,a())}}]);