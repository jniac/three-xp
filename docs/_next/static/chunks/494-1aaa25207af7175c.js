"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[494],{48437:function(t,e,i){i.d(e,{a:function(){return d}});var o,r,s=i(52471);let n=new Map;n.set(Date,t=>new Date(t.getTime())),n.set(RegExp,t=>new RegExp(t.source,t.flags)),n.set(DOMPoint,t=>DOMPoint.fromPoint(t)),n.set(DOMRect,t=>DOMRect.fromRect(t)),(o=r||(r={})).None="none",o.NotAnObject="not-an-object",o.InvalidIndex="invalid-index",o.CannotCreateAscendants="cannot-create-ascendants",o.CannotPierceNullOrUndefined="cannot-pierce-null-or-undefined";var a=i(81796);let h=new s.Matrix4,l=new s.Vector3,c=new s.Quaternion,p=new s.Quaternion,f={fov:"45deg",perspective:1,zoom:1,focus:[0,0,0],size:[4,4],before:100,after:1e3,rotation:[0,0,0,"YXZ"],frame:"contain",allowOrthographic:!0,fovEpsilon:"1.5deg",nearMin:.1};class d{static get default(){return v}set(t){let{perspective:e,fov:i,zoom:o,focus:r,size:s,before:n,after:h,rotation:l,frame:c,allowOrthographic:p,fovEpsilon:f,nearMin:d}=t;return void 0!==e&&(this.perspective=e),void 0!==i&&(this.fov=(0,a.FE)(i)),void 0!==o&&(this.zoom=o),void 0!==r&&(0,a.Q7)(r,this.focus),void 0!==s&&(0,a.iK)(s,this.size),void 0!==n&&(this.before=n),void 0!==h&&(this.after=h),void 0!==l&&(0,a.Gg)(l,this.rotation),void 0!==c&&(this.frame="string"==typeof c?"cover"===c?0:1:c),void 0!==p&&(this.allowOrthographic=p),void 0!==f&&(this.fovEpsilon=(0,a.FE)(f)),void 0!==d&&(this.nearMin=d),this}copy(t){return this.perspective=t.perspective,this.fov=t.fov,this.zoom=t.zoom,this.focus.copy(t.focus),this.size.copy(t.size),this.before=t.before,this.after=t.after,this.rotation.copy(t.rotation),this.frame=t.frame,this.allowOrthographic=t.allowOrthographic,this.fovEpsilon=t.fovEpsilon,this.nearMin=t.nearMin,this}clone(){return new d().copy(this)}lerpVertigos(t,e,i){this.perspective=t.perspective+(e.perspective-t.perspective)*i,this.fov=t.fov+(e.fov-t.fov)*i;let o=Math.log(t.zoom)/Math.log(.001),r=o+(Math.log(e.zoom)/Math.log(.001)-o)*i;return this.zoom=.001**r,this.focus.lerpVectors(t.focus,e.focus,i),this.size.lerpVectors(t.size,e.size,i),this.before=t.before+(e.before-t.before)*i,this.after=t.after+(e.after-t.after)*i,c.setFromEuler(t.rotation),p.setFromEuler(e.rotation),this.rotation.setFromQuaternion(c.slerp(p,i)),this.frame=t.frame+(e.frame-t.frame)*i,this.allowOrthographic=i<.5?t.allowOrthographic:e.allowOrthographic,this.fovEpsilon=t.fovEpsilon+(e.fovEpsilon-t.fovEpsilon)*i,this.nearMin=t.nearMin+(e.nearMin-t.nearMin)*i,this}lerp(t,e){return this.lerpVertigos(this,t,e)}apply(t,e){let i=this.size.x/this.size.y/e,o=1+(i>1?this.frame:1-this.frame)*(i-1),r=this.size.y*o/this.zoom,s=this.fovEpsilon,n=this.perspective*this.fov;!this.allowOrthographic&&n<s&&(n=s);let a=r/2/Math.tan(n/2),c=n>=s,p=c?a:this.before+this.nearMin;if(h.makeRotationFromEuler(this.rotation),l.set(h.elements[8],h.elements[9],h.elements[10]).multiplyScalar(p).add(this.focus),t.position.copy(l),t.rotation.copy(this.rotation),t.updateMatrix(),t.updateMatrixWorld(!0),t.isPerspectiveCamera=c,t.isOrthographicCamera=!c,c){let i=Math.max(this.nearMin/this.zoom,a-this.before),o=a+this.after,s=r*i/a/2,h=s*e;t.fov=180*n/Math.PI,t.projectionMatrix.makePerspective(-h,h,s,-s,i,o)}else{let i=this.nearMin/this.zoom,o=i+this.before+this.after,s=r/2,n=s*e;t.fov=0,t.projectionMatrix.makeOrthographic(-n,n,s,-s,i,o)}return t.projectionMatrixInverse.copy(t.projectionMatrix).invert(),this.computedNdcScalar.set(o*e,o),this.computedSize.set(r*e,r),this}toDeclaration(){let t=[(0,a.ux)(this.rotation.x,"deg"),(0,a.ux)(this.rotation.y,"deg"),(0,a.ux)(this.rotation.z,"deg"),this.rotation.order];return{perspective:this.perspective,fov:(0,a.ux)(this.fov,"deg"),zoom:this.zoom,focus:this.focus.toArray(),size:this.size.toArray(),before:this.before,after:this.after,rotation:t,frame:this.frame,allowOrthographic:this.allowOrthographic,fovEpsilon:(0,a.ux)(this.fovEpsilon,"deg"),nearMin:this.nearMin}}constructor(t){this.focus=new s.Vector3,this.size=new s.Vector2,this.rotation=new s.Euler,this.computedNdcScalar=new s.Vector2,this.computedSize=new s.Vector2,this.set({...f,...t})}}let v=function t(e){if(Object.freeze(e),null!==e&&"object"==typeof e)for(let i in e)t(e[i]);return e}(new d)},494:function(t,e,i){i.d(e,{F:function(){return u}});var o,r=i(52471),s=i(74831),n=i(63425),a=i(1296),h=i(77552),l=i(81796),c=i(48437);let p=new r.Quaternion,f=new r.Vector3,d=new r.Vector3;function v(t){p.setFromEuler(t),f.set(1,0,0).applyQuaternion(p),d.set(0,1,0).applyQuaternion(p)}class u extends a.N{pan(t,e){v(this.vertigo.rotation);let i=1/this.vertigo.zoom;this.vertigo.focus.addScaledVector(f,t*i).addScaledVector(d,e*i)}rotate(t,e){this.vertigo.rotation.x+=t,this.vertigo.rotation.y+=e}zoomAt(t,e){let i=this.vertigo.size.x/this.vertigo.zoom,o=this.vertigo.size.y/this.vertigo.zoom,r=this.vertigo.size.x/t,s=this.vertigo.size.y/t;v(this.vertigo.rotation);let{x:n,y:a}=e;this.vertigo.focus.addScaledVector(f,-((r-i)*n)).addScaledVector(d,-((s-o)*a)),this.vertigo.zoom=t}initialize(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document.body;return this.element=t,this}*doStart(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null!==(o=this.element)&&void 0!==o?o:document.body;yield function(t,e){for(let[i,o]of Object.entries(e))t.addEventListener(i,o);return{destroy(){for(let[i,o]of Object.entries(e))t.removeEventListener(i,o)}}}(t,{contextmenu:t=>{t.preventDefault()}});let e=new r.Vector2;yield(0,s.w)(t,{onChange:i=>{let o=t.getBoundingClientRect(),r=(i.localPosition.x-o.x)/o.width*2-1,s=-((i.localPosition.y-o.y)/o.height*2-1);e.set(r/2,s/2).multiply(this.vertigo.computedNdcScalar)},dragButton:-1,onDrag:t=>{switch(t.button){case s.M.Left:this.rotate(-.01*t.delta.y,-.01*t.delta.x);break;case s.M.Right:this.pan(-.025*t.delta.x,.025*t.delta.y)}},wheelPreventDefault:!0,onWheel:t=>{let i=this.vertigo.zoom*(1-.001*t.delta.y);t.event.altKey?this.zoomAt(i,e):this.zoomAt(i,{x:0,y:0})}})}start(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];return!1===this.started&&(this.started=!0,this.collect(this.doStart(...e))),this}stop(){this.started&&(this.started=!1,this.destroy())}toggle(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:!this.started;t?this.start():this.stop()}update(t,e){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1/60,o=(0,h.M3)(this.dampingDecayFactor,i);this.dampedVertigo.lerp(this.vertigo,o).apply(t,e)}constructor(t={}){super(),this.dampingDecayFactor=1e-4,this.vertigo=new c.a,this.dampedVertigo=new c.a,this.actions={togglePerspective:()=>{let t=this.vertigo.perspective>.5?0:1;n.fw.tween({target:[this.vertigo,"perspective"],to:{perspective:t},duration:1,ease:"inOut3"})},focus:t=>{n.fw.tween({target:this.vertigo.focus,to:(0,l.Q7)(t),duration:1,ease:"inOut3"})},rotate:(t,e,i)=>{let o=new r.Quaternion().setFromEuler(this.vertigo.rotation),s=new r.Quaternion().setFromEuler(new r.Euler(t,e,i,"YXZ")),a=new r.Quaternion;n.fw.during({target:[this.vertigo,"rotation"],duration:1}).onUpdate(t=>{let{progress:e}=t;a.slerpQuaternions(o,s,n.fw.ease("inOut3")(e)),this.vertigo.rotation.setFromQuaternion(a)})},positiveXAlign:()=>{this.actions.rotate(0,Math.PI/2,0)},negativeXAlign:()=>{this.actions.rotate(0,-Math.PI/2,0)},positiveYAlign:()=>{this.actions.rotate(-Math.PI/2,0,0)},negativeYAlign:()=>{this.actions.rotate(Math.PI/2,0,0)},positiveZAlign:()=>{this.actions.rotate(0,0,0)},negativeZAlign:()=>{this.actions.rotate(0,Math.PI,0)}},this.started=!1,this.vertigo.set(t),this.dampedVertigo.set(t)}}}}]);