"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[125],{6909:function(t,e,i){i.d(e,{z:function(){return m}});var o=i(7785);let s={type:"change"},a={type:"start"},n={type:"end"},r=new o.zHn,h=new o.JOQ,l=Math.cos(70*o.M8C.DEG2RAD),c=new o.Pa4,p=2*Math.PI,d={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};class m extends o.ZXd{constructor(t,e=null){super(t,e),this.state=d.NONE,this.enabled=!0,this.target=new o.Pa4,this.cursor=new o.Pa4,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:o.RsA.ROTATE,MIDDLE:o.RsA.DOLLY,RIGHT:o.RsA.PAN},this.touches={ONE:o.QmN.ROTATE,TWO:o.QmN.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new o.Pa4,this._lastQuaternion=new o._fP,this._lastTargetPosition=new o.Pa4,this._quat=new o._fP().setFromUnitVectors(t.up,new o.Pa4(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new o.$V,this._sphericalDelta=new o.$V,this._scale=1,this._panOffset=new o.Pa4,this._rotateStart=new o.FM8,this._rotateEnd=new o.FM8,this._rotateDelta=new o.FM8,this._panStart=new o.FM8,this._panEnd=new o.FM8,this._panDelta=new o.FM8,this._dollyStart=new o.FM8,this._dollyEnd=new o.FM8,this._dollyDelta=new o.FM8,this._dollyDirection=new o.Pa4,this._mouse=new o.FM8,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=v.bind(this),this._onPointerDown=u.bind(this),this._onPointerUp=f.bind(this),this._onContextMenu=b.bind(this),this._onMouseWheel=P.bind(this),this._onKeyDown=y.bind(this),this._onTouchStart=E.bind(this),this._onTouchMove=D.bind(this),this._onMouseDown=_.bind(this),this._onMouseMove=g.bind(this),this._interceptControlDown=w.bind(this),this._interceptControlUp=S.bind(this),null!==this.domElement&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){null!==this._domElementKeyEvents&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(s),this.update(),this.state=d.NONE}update(t=null){let e=this.object.position;c.copy(e).sub(this.target),c.applyQuaternion(this._quat),this._spherical.setFromVector3(c),this.autoRotate&&this.state===d.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,a=this.maxAzimuthAngle;isFinite(i)&&isFinite(a)&&(i<-Math.PI?i+=p:i>Math.PI&&(i-=p),a<-Math.PI?a+=p:a>Math.PI&&(a-=p),i<=a?this._spherical.theta=Math.max(i,Math.min(a,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+a)/2?Math.max(i,this._spherical.theta):Math.min(a,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),!0===this.enableDamping?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let n=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let t=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),n=t!=this._spherical.radius}if(c.setFromSpherical(this._spherical),c.applyQuaternion(this._quatInverse),e.copy(this.target).add(c),this.object.lookAt(this.target),!0===this.enableDamping?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let t=null;if(this.object.isPerspectiveCamera){let e=c.length();t=this._clampDistance(e*this._scale);let i=e-t;this.object.position.addScaledVector(this._dollyDirection,i),this.object.updateMatrixWorld(),n=!!i}else if(this.object.isOrthographicCamera){let e=new o.Pa4(this._mouse.x,this._mouse.y,0);e.unproject(this.object);let i=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),n=i!==this.object.zoom;let s=new o.Pa4(this._mouse.x,this._mouse.y,0);s.unproject(this.object),this.object.position.sub(s).add(e),this.object.updateMatrixWorld(),t=c.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;null!==t&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(t).add(this.object.position):(r.origin.copy(this.object.position),r.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(r.direction))<l?this.object.lookAt(this.target):(h.setFromNormalAndCoplanarPoint(this.object.up,this.target),r.intersectPlane(h,this.target))))}else if(this.object.isOrthographicCamera){let t=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),t!==this.object.zoom&&(this.object.updateProjectionMatrix(),n=!0)}return this._scale=1,this._performCursorZoom=!1,!!(n||this._lastPosition.distanceToSquared(this.object.position)>1e-6||8*(1-this._lastQuaternion.dot(this.object.quaternion))>1e-6||this._lastTargetPosition.distanceToSquared(this.target)>1e-6)&&(this.dispatchEvent(s),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0)}_getAutoRotationAngle(t){return null!==t?p/60*this.autoRotateSpeed*t:p/60/60*this.autoRotateSpeed}_getZoomScale(t){return Math.pow(.95,this.zoomSpeed*Math.abs(.01*t))}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){c.setFromMatrixColumn(e,0),c.multiplyScalar(-t),this._panOffset.add(c)}_panUp(t,e){!0===this.screenSpacePanning?c.setFromMatrixColumn(e,1):(c.setFromMatrixColumn(e,0),c.crossVectors(this.object.up,c)),c.multiplyScalar(t),this._panOffset.add(c)}_pan(t,e){let i=this.domElement;if(this.object.isPerspectiveCamera){let o=this.object.position;c.copy(o).sub(this.target);let s=c.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*s/i.clientHeight,this.object.matrix),this._panUp(2*e*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),o=t-i.left,s=e-i.top,a=i.width,n=i.height;this._mouse.x=o/a*2-1,this._mouse.y=-(s/n*2)+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(p*this._rotateDelta.x/e.clientHeight),this._rotateUp(p*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(p*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(-p*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(p*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(-p*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),e=!0}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(1===this._pointers.length)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),o=.5*(t.pageY+e.y);this._rotateStart.set(i,o)}}_handleTouchStartPan(t){if(1===this._pointers.length)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),o=.5*(t.pageY+e.y);this._panStart.set(i,o)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,o=t.pageY-e.y;this._dollyStart.set(0,Math.sqrt(i*i+o*o))}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(1==this._pointers.length)this._rotateEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),o=.5*(t.pageY+e.y);this._rotateEnd.set(i,o)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(p*this._rotateDelta.x/e.clientHeight),this._rotateUp(p*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(1===this._pointers.length)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),o=.5*(t.pageY+e.y);this._panEnd.set(i,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,o=t.pageY-e.y;this._dollyEnd.set(0,Math.sqrt(i*i+o*o)),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let s=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(s,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];void 0===e&&(e=new o.FM8,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function u(t){!1!==this.enabled&&(0===this._pointers.length&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),this._isTrackingPointer(t)||(this._addPointer(t),"touch"===t.pointerType?this._onTouchStart(t):this._onMouseDown(t)))}function v(t){!1!==this.enabled&&("touch"===t.pointerType?this._onTouchMove(t):this._onMouseMove(t))}function f(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(n),this.state=d.NONE;break;case 1:let e=this._pointers[0],i=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:i.x,pageY:i.y})}}function _(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case o.RsA.DOLLY:if(!1===this.enableZoom)return;this._handleMouseDownDolly(t),this.state=d.DOLLY;break;case o.RsA.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(!1===this.enablePan)return;this._handleMouseDownPan(t),this.state=d.PAN}else{if(!1===this.enableRotate)return;this._handleMouseDownRotate(t),this.state=d.ROTATE}break;case o.RsA.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(!1===this.enableRotate)return;this._handleMouseDownRotate(t),this.state=d.ROTATE}else{if(!1===this.enablePan)return;this._handleMouseDownPan(t),this.state=d.PAN}break;default:this.state=d.NONE}this.state!==d.NONE&&this.dispatchEvent(a)}function g(t){switch(this.state){case d.ROTATE:if(!1===this.enableRotate)return;this._handleMouseMoveRotate(t);break;case d.DOLLY:if(!1===this.enableZoom)return;this._handleMouseMoveDolly(t);break;case d.PAN:if(!1===this.enablePan)return;this._handleMouseMovePan(t)}}function P(t){!1!==this.enabled&&!1!==this.enableZoom&&this.state===d.NONE&&(t.preventDefault(),this.dispatchEvent(a),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(n))}function y(t){!1!==this.enabled&&!1!==this.enablePan&&this._handleKeyDown(t)}function E(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case o.QmN.ROTATE:if(!1===this.enableRotate)return;this._handleTouchStartRotate(t),this.state=d.TOUCH_ROTATE;break;case o.QmN.PAN:if(!1===this.enablePan)return;this._handleTouchStartPan(t),this.state=d.TOUCH_PAN;break;default:this.state=d.NONE}break;case 2:switch(this.touches.TWO){case o.QmN.DOLLY_PAN:if(!1===this.enableZoom&&!1===this.enablePan)return;this._handleTouchStartDollyPan(t),this.state=d.TOUCH_DOLLY_PAN;break;case o.QmN.DOLLY_ROTATE:if(!1===this.enableZoom&&!1===this.enableRotate)return;this._handleTouchStartDollyRotate(t),this.state=d.TOUCH_DOLLY_ROTATE;break;default:this.state=d.NONE}break;default:this.state=d.NONE}this.state!==d.NONE&&this.dispatchEvent(a)}function D(t){switch(this._trackPointer(t),this.state){case d.TOUCH_ROTATE:if(!1===this.enableRotate)return;this._handleTouchMoveRotate(t),this.update();break;case d.TOUCH_PAN:if(!1===this.enablePan)return;this._handleTouchMovePan(t),this.update();break;case d.TOUCH_DOLLY_PAN:if(!1===this.enableZoom&&!1===this.enablePan)return;this._handleTouchMoveDollyPan(t),this.update();break;case d.TOUCH_DOLLY_ROTATE:if(!1===this.enableZoom&&!1===this.enableRotate)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=d.NONE}}function b(t){!1!==this.enabled&&t.preventDefault()}function w(t){"Control"===t.key&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function S(t){"Control"===t.key&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}},3208:function(t,e,i){i.d(e,{x:function(){return s}});var o=i(7785);class s extends o.yxD{constructor(t){super(t),this.type=o.cLu}parse(t){let e,i,s;let a=function(t,e){switch(t){case 1:throw Error("THREE.RGBELoader: Read Error: "+(e||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(e||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(e||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(e||""))}},n=function(t,e,i){e=e||1024;let o=t.pos,s=-1,a=0,n="",r=String.fromCharCode.apply(null,new Uint16Array(t.subarray(o,o+128)));for(;0>(s=r.indexOf("\n"))&&a<e&&o<t.byteLength;)n+=r,a+=r.length,o+=128,r+=String.fromCharCode.apply(null,new Uint16Array(t.subarray(o,o+128)));return -1<s&&(!1!==i&&(t.pos+=a+s+1),n+r.slice(0,s))},r=new Uint8Array(t);r.pos=0;let h=function(t){let e,i;let o=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,s=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,r=/^\s*FORMAT=(\S+)\s*$/,h=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,l={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};for(!(t.pos>=t.byteLength)&&(e=n(t))||a(1,"no header found"),(i=e.match(/^#\?(\S+)/))||a(3,"bad initial token"),l.valid|=1,l.programtype=i[1],l.string+=e+"\n";!1!==(e=n(t));){if(l.string+=e+"\n","#"===e.charAt(0)){l.comments+=e+"\n";continue}if((i=e.match(o))&&(l.gamma=parseFloat(i[1])),(i=e.match(s))&&(l.exposure=parseFloat(i[1])),(i=e.match(r))&&(l.valid|=2,l.format=i[1]),(i=e.match(h))&&(l.valid|=4,l.height=parseInt(i[1],10),l.width=parseInt(i[2],10)),2&l.valid&&4&l.valid)break}return 2&l.valid||a(3,"missing format specifier"),4&l.valid||a(3,"missing image size specifier"),l}(r),l=h.width,c=h.height,p=function(t,e,i){if(e<8||e>32767||2!==t[0]||2!==t[1]||128&t[2])return new Uint8Array(t);e!==(t[2]<<8|t[3])&&a(3,"wrong scanline width");let o=new Uint8Array(4*e*i);o.length||a(4,"unable to allocate buffer space");let s=0,n=0,r=4*e,h=new Uint8Array(4),l=new Uint8Array(r),c=i;for(;c>0&&n<t.byteLength;){n+4>t.byteLength&&a(1),h[0]=t[n++],h[1]=t[n++],h[2]=t[n++],h[3]=t[n++],(2!=h[0]||2!=h[1]||(h[2]<<8|h[3])!=e)&&a(3,"bad rgbe scanline format");let i=0,p;for(;i<r&&n<t.byteLength;){let e=(p=t[n++])>128;if(e&&(p-=128),(0===p||i+p>r)&&a(3,"bad scanline data"),e){let e=t[n++];for(let t=0;t<p;t++)l[i++]=e}else l.set(t.subarray(n,n+p),i),i+=p,n+=p}for(let t=0;t<e;t++){let i=0;o[s]=l[t+i],i+=e,o[s+1]=l[t+i],i+=e,o[s+2]=l[t+i],i+=e,o[s+3]=l[t+i],s+=4}c--}return o}(r.subarray(r.pos),l,c);switch(this.type){case o.VzW:let d=new Float32Array(4*(s=p.length/4));for(let t=0;t<s;t++)!function(t,e,i,o){let s=Math.pow(2,t[e+3]-128)/255;i[o+0]=t[e+0]*s,i[o+1]=t[e+1]*s,i[o+2]=t[e+2]*s,i[o+3]=1}(p,4*t,d,4*t);e=d,i=o.VzW;break;case o.cLu:let m=new Uint16Array(4*(s=p.length/4));for(let t=0;t<s;t++)!function(t,e,i,s){let a=Math.pow(2,t[e+3]-128)/255;i[s+0]=o.A5E.toHalfFloat(Math.min(t[e+0]*a,65504)),i[s+1]=o.A5E.toHalfFloat(Math.min(t[e+1]*a,65504)),i[s+2]=o.A5E.toHalfFloat(Math.min(t[e+2]*a,65504)),i[s+3]=o.A5E.toHalfFloat(1)}(p,4*t,m,4*t);e=m,i=o.cLu;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:l,height:c,data:e,header:h.string,gamma:h.gamma,exposure:h.exposure,type:i}}setDataType(t){return this.type=t,this}load(t,e,i,s){return super.load(t,function(t,i){switch(t.type){case o.VzW:case o.cLu:t.colorSpace=o.GUF,t.minFilter=o.wem,t.magFilter=o.wem,t.generateMipmaps=!1,t.flipY=!0}e&&e(t,i)},i,s)}}},2886:function(t,e,i){i.d(e,{L:function(){return o}});class o{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(256*t.random());this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[255&t];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(t,e,i){return t[0]*e+t[1]*i}dot3(t,e,i,o){return t[0]*e+t[1]*i+t[2]*o}dot4(t,e,i,o,s){return t[0]*e+t[1]*i+t[2]*o+t[3]*s}noise(t,e){let i,o,s,a,n;let r=.5*(Math.sqrt(3)-1)*(t+e),h=Math.floor(t+r),l=Math.floor(e+r),c=(3-Math.sqrt(3))/6,p=(h+l)*c,d=t-(h-p),m=e-(l-p);d>m?(a=1,n=0):(a=0,n=1);let u=d-a+c,v=m-n+c,f=d-1+2*c,_=m-1+2*c,g=255&h,P=255&l,y=this.perm[g+this.perm[P]]%12,E=this.perm[g+a+this.perm[P+n]]%12,D=this.perm[g+1+this.perm[P+1]]%12,b=.5-d*d-m*m;b<0?i=0:(b*=b,i=b*b*this.dot(this.grad3[y],d,m));let w=.5-u*u-v*v;w<0?o=0:(w*=w,o=w*w*this.dot(this.grad3[E],u,v));let S=.5-f*f-_*_;return S<0?s=0:(S*=S,s=S*S*this.dot(this.grad3[D],f,_)),70*(i+o+s)}noise3d(t,e,i){let o,s,a,n,r,h,l,c,p,d;let m=1/3*(t+e+i),u=Math.floor(t+m),v=Math.floor(e+m),f=Math.floor(i+m),_=1/6*(u+v+f),g=t-(u-_),P=e-(v-_),y=i-(f-_);g>=P?P>=y?(r=1,h=0,l=0,c=1,p=1,d=0):(g>=y?(r=1,h=0,l=0):(r=0,h=0,l=1),c=1,p=0,d=1):P<y?(r=0,h=0,l=1,c=0,p=1,d=1):g<y?(r=0,h=1,l=0,c=0,p=1,d=1):(r=0,h=1,l=0,c=1,p=1,d=0);let E=g-r+1/6,D=P-h+1/6,b=y-l+1/6,w=g-c+1/6*2,S=P-p+1/6*2,x=y-d+1/6*2,M=g-1+1/6*3,T=P-1+1/6*3,N=y-1+1/6*3,A=255&u,R=255&v,O=255&f,L=this.perm[A+this.perm[R+this.perm[O]]]%12,U=this.perm[A+r+this.perm[R+h+this.perm[O+l]]]%12,C=this.perm[A+c+this.perm[R+p+this.perm[O+d]]]%12,z=this.perm[A+1+this.perm[R+1+this.perm[O+1]]]%12,j=.6-g*g-P*P-y*y;j<0?o=0:(j*=j,o=j*j*this.dot3(this.grad3[L],g,P,y));let I=.6-E*E-D*D-b*b;I<0?s=0:(I*=I,s=I*I*this.dot3(this.grad3[U],E,D,b));let F=.6-w*w-S*S-x*x;F<0?a=0:(F*=F,a=F*F*this.dot3(this.grad3[C],w,S,x));let V=.6-M*M-T*T-N*N;return V<0?n=0:(V*=V,n=V*V*this.dot3(this.grad3[z],M,T,N)),32*(o+s+a+n)}noise4d(t,e,i,o){let s,a,n,r,h;let l=this.grad4,c=this.simplex,p=this.perm,d=(5-Math.sqrt(5))/20,m=(Math.sqrt(5)-1)/4*(t+e+i+o),u=Math.floor(t+m),v=Math.floor(e+m),f=Math.floor(i+m),_=Math.floor(o+m),g=(u+v+f+_)*d,P=t-(u-g),y=e-(v-g),E=i-(f-g),D=o-(_-g),b=(P>y?32:0)+(P>E?16:0)+(y>E?8:0)+(P>D?4:0)+(y>D?2:0)+(E>D?1:0),w=c[b][0]>=3?1:0,S=c[b][1]>=3?1:0,x=c[b][2]>=3?1:0,M=c[b][3]>=3?1:0,T=c[b][0]>=2?1:0,N=c[b][1]>=2?1:0,A=c[b][2]>=2?1:0,R=c[b][3]>=2?1:0,O=c[b][0]>=1?1:0,L=c[b][1]>=1?1:0,U=c[b][2]>=1?1:0,C=c[b][3]>=1?1:0,z=P-w+d,j=y-S+d,I=E-x+d,F=D-M+d,V=P-T+2*d,k=y-N+2*d,H=E-A+2*d,Y=D-R+2*d,Z=P-O+3*d,G=y-L+3*d,K=E-U+3*d,B=D-C+3*d,W=P-1+4*d,X=y-1+4*d,q=E-1+4*d,Q=D-1+4*d,$=255&u,J=255&v,tt=255&f,te=255&_,ti=p[$+p[J+p[tt+p[te]]]]%32,to=p[$+w+p[J+S+p[tt+x+p[te+M]]]]%32,ts=p[$+T+p[J+N+p[tt+A+p[te+R]]]]%32,ta=p[$+O+p[J+L+p[tt+U+p[te+C]]]]%32,tn=p[$+1+p[J+1+p[tt+1+p[te+1]]]]%32,tr=.6-P*P-y*y-E*E-D*D;tr<0?s=0:(tr*=tr,s=tr*tr*this.dot4(l[ti],P,y,E,D));let th=.6-z*z-j*j-I*I-F*F;th<0?a=0:(th*=th,a=th*th*this.dot4(l[to],z,j,I,F));let tl=.6-V*V-k*k-H*H-Y*Y;tl<0?n=0:(tl*=tl,n=tl*tl*this.dot4(l[ts],V,k,H,Y));let tc=.6-Z*Z-G*G-K*K-B*B;tc<0?r=0:(tc*=tc,r=tc*tc*this.dot4(l[ta],Z,G,K,B));let tp=.6-W*W-X*X-q*q-Q*Q;return tp<0?h=0:(tp*=tp,h=tp*tp*this.dot4(l[tn],W,X,q,Q)),27*(s+a+n+r+h)}}},3818:function(t,e,i){i.d(e,{Sp:function(){return s},gs:function(){return a},mF:function(){return n},mK:function(){return r}});var o=i(7785);let s={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new o.FM8},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new o.yGw},cameraProjectionMatrixInverse:{value:new o.yGw},cameraWorldMatrix:{value:new o.yGw},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new o.Pa4(-1,-1,-1)},sceneBoxMax:{value:new o.Pa4(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;		
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif
		
		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {  
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {   
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}
		
		void main() {
			float depth = getDepth(vUv.xy);
			if (depth >= 1.0) {
				discard;
				return;
			}
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif
			
			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {
				
				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w); 
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));
				
				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));
				
				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);	

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}		

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);		
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},a={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},n={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function r(t=5){let e=Math.floor(t)%2==0?Math.floor(t)+1:Math.floor(t),i=function(t){let e=Math.floor(t)%2==0?Math.floor(t)+1:Math.floor(t),i=e*e,o=Array(i).fill(0),s=Math.floor(e/2),a=e-1;for(let t=1;t<=i;){if(-1===s&&a===e?(a=e-2,s=0):(a===e&&(a=0),s<0&&(s=e-1)),0!==o[s*e+a]){a-=2,s++;continue}o[s*e+a]=t++,a++,s--}return o}(e),s=i.length,a=new Uint8Array(4*s);for(let t=0;t<s;++t){let e=2*Math.PI*i[t]/s,n=new o.Pa4(Math.cos(e),Math.sin(e),0).normalize();a[4*t]=(.5*n.x+.5)*255,a[4*t+1]=(.5*n.y+.5)*255,a[4*t+2]=127,a[4*t+3]=255}let n=new o.IEO(a,e,e);return n.wrapS=o.rpg,n.wrapT=o.rpg,n.needsUpdate=!0,n}},1244:function(t,e,i){i.d(e,{a:function(){return a},m:function(){return s}});var o=i(7785);let s={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:a(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new o.FM8},cameraProjectionMatrixInverse:{value:new o.yGw},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;
		
		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}
		
		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1    
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1    
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);
			
			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;
		
			denoised += w * neighborColor;
			totalWeight += w;
		}
		
		void main() {
			float depth = getDepth(vUv.xy);	
			vec3 viewNormal = getViewNormal(vUv);	
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);
		
			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}
		
			if (totalWeight > 0.) { 
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function a(t,e,i){let s=function(t,e,i){let s=[];for(let a=0;a<t;a++){let n=2*Math.PI*e*a/t,r=Math.pow(a/(t-1),i);s.push(new o.Pa4(Math.cos(n),Math.sin(n),r))}return s}(t,e,i),a="vec3[SAMPLES](";for(let e=0;e<t;e++){let i=s[e];a+=`vec3(${i.x}, ${i.y}, ${i.z})${e<t-1?",":")"}`}return a}}}]);