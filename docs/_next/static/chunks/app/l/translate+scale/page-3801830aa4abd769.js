(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3938],{29869:function(e,t,n){Promise.resolve().then(n.bind(n,47423))},47423:function(e,t,n){"use strict";n.d(t,{Main:function(){return m}});var o=n(78485),r=n(52471),i=n(87885),s=n(13025),c=n(40365),l=n(88156),a=n(63549),u=n(87858),h=n(9710);class d extends r.Group{onTick(e){let{sphere:t,pivot:n}=this.parts,o=e.lerpSin01Time(.5,1.5,{frequency:.2}),i=new r.Vector3().copy(n.position).addScaledVector(n.position,-o);t.matrixAutoUpdate=!1,t.matrix.makeScale(o,o,o).setPosition(i)}constructor(...e){super(...e),this.parts={sphere:(0,u.cY)(new r.Mesh(new r.IcosahedronGeometry(1,8),new a.P),{name:"sphere",parent:this}),circle:(0,u.cY)(new l.O().circle({radius:.5}).circle({radius:1}).circle({radius:1.5}).draw(),{name:"circle",parent:this}),pivot:(0,u.cY)(new r.Group,{name:"pivot",parent:this})}}}function p(){let e=(0,c.jE)();return(0,c.Ky)(function*(t){t.scene.background=new r.Color("#345");let n=new d;t.scene.add(n),yield(0,h.RC)("three",e=>n.onTick(e)),e.sceneSelection.set("Hop!",[n.parts.pivot]),e.toolType.set(i.qK.Move),(0,s.NR)(e,n.parts.pivot),yield()=>n.removeFromParent()},[]),null}function m(){return(0,o.jsxs)(c.c,{children:[(0,o.jsx)(p,{}),(0,o.jsxs)("div",{className:"flex flex-col p-4 gap-2",children:[(0,o.jsx)("p",{children:"Pivot offset to perform translate and scale is quite straightforward:"}),(0,o.jsx)("pre",{className:"bg-[#fff1] rounded px-2 py-1",children:"\nconst scale = ... // some value\nconst translate = new Vector3()\n  .copy(pivot.position)\n  .addScaledVector(pivot.position, -scale)\n\nmatrix\n  .makeScale(scale, scale, scale)\n  .setPosition(translate)\n".trim()})]})]})}},88156:function(e,t,n){"use strict";n.d(t,{O:function(){return u}});var o=n(52471),r=n(58648),i=n(81796);let s=new o.Vector2,c=new o.Vector3,l=new o.Matrix4;function a(e,t,n){if(null==n?void 0:n.transform)for(let e of((0,i.Xe)(n.transform,l),t))e.applyMatrix4(l);e.push(...t)}class u extends o.LineSegments{showOccludedLines(){let{opacity:e=.2}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=new o.LineBasicMaterial({color:this.material.color,transparent:!0,depthFunc:o.GreaterDepth,opacity:e}),n=new o.LineSegments(this.geometry,t);return this.add(n),this}clear(){return this.points.length=0,this.geometry.setFromPoints(this.points),this}draw(){return this.geometry.setFromPoints(this.points),this.geometry.computeBoundingSphere(),this}line(e,t,n){let o=(0,i.Q7)(e),r=(0,i.Q7)(t);return a(this.points,[o,r],n),this}circle(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let{x:r,y:c,radius:l,segments:h,...d}={...u.circleDefaultOptions,...(()=>{if(t.length>1){let[e,n,o]=t,{x:r,y:c}=(0,i.iK)(e,s);return{x:r,y:c,radius:n,...o}}return t[0]})()},p=new o.Vector3(1,0,0),m=new o.Vector3(0,1,0),v=[];for(let e=0;e<h;e++){let t=e/h*Math.PI*2,n=(e+1)/h*Math.PI*2,i=Math.cos(t)*l,s=Math.sin(t)*l,a=Math.cos(n)*l,u=Math.sin(n)*l,d=new o.Vector3(r,c,0).addScaledVector(p,i).addScaledVector(m,s),f=new o.Vector3(r,c,0).addScaledVector(p,a).addScaledVector(m,u);v.push(d,f)}return a(this.points,v,d),this}rectangle(e,t){let{centerX:n,centerY:i,width:s,height:c}=r.Ae.from(e),l=s/2,u=c/2,h=new o.Vector3(n-l,i-u,0),d=new o.Vector3(n+l,i-u,0),p=new o.Vector3(n+l,i+u,0),m=new o.Vector3(n-l,i+u,0);return a(this.points,[h,d,d,p,p,m,m,h],t),this}box(){let{center:e=[0,0,0],size:t=1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{x:n,y:r,z:s}=(0,i.Q7)(e,c),{x:l,y:a,z:u}=(0,i.Q7)(t,c),h=l/2,d=a/2,p=u/2,m=new o.Vector3(n-h,r-d,s-p),v=new o.Vector3(n+h,r-d,s-p),f=new o.Vector3(n+h,r+d,s-p),w=new o.Vector3(n-h,r+d,s-p),V=new o.Vector3(n-h,r-d,s+p),g=new o.Vector3(n+h,r-d,s+p),x=new o.Vector3(n+h,r+d,s+p),y=new o.Vector3(n-h,r+d,s+p);return this.points.push(m,v,v,f,f,w,w,m),this.points.push(V,g,g,x,x,y,y,V),this.points.push(m,V,v,g,f,x,w,y),this}plus(e,t,n){let r=t/2,{x:c,y:l}=(0,i.iK)(e,s),u=new o.Vector3(c-r,l,0),h=new o.Vector3(c+r,l,0),d=new o.Vector3(c,l-r,0),p=new o.Vector3(c,l+r,0);return a(this.points,[u,h,d,p],n),this}cross(e,t,n){let r=t/2,{x:c,y:l}=(0,i.iK)(e,s),u=new o.Vector3(c-r,l-r,0),h=new o.Vector3(c+r,l+r,0),d=new o.Vector3(c-r,l+r,0),p=new o.Vector3(c+r,l-r,0);return a(this.points,[u,h,d,p],n),this}constructor(...e){super(...e),this.points=[]}}u.circleDefaultOptions={x:0,y:0,radius:.5,segments:96}},63549:function(e,t,n){"use strict";n.d(t,{P:function(){return i}});var o=n(52471);let r={vertexColors:!0,color:"white",luminosity:.5};class i extends o.ShaderMaterial{constructor(e){let{color:t,luminosity:n,vertexColors:i,...s}={...r,...e};super({...s,uniforms:{uColor:{value:new o.Color(t)},uSunPosition:{value:new o.Vector3(.5,.7,.3)},uLuminosity:{value:n}},vertexColors:i,vertexShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nvoid main() {\n  vWorldNormal = mat3(modelMatrix) * normal;\n  vColor = color;\n#ifdef USE_INSTANCING\n  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);\n#else\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#endif\n#ifdef USE_INSTANCING_COLOR\n	vColor.xyz *= instanceColor.xyz;\n#endif\n}\n",fragmentShader:"\nvarying vec3 vWorldNormal;\nvarying vec3 vColor;\n\nuniform vec3 uSunPosition;\nuniform vec3 uColor;\nuniform float uLuminosity;\n\nvoid main() {\n  vec3 lightDirection = normalize(uSunPosition);\n  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n  light = pow(light, 2.0);\n  light = mix(uLuminosity, 1.0, light);\n  gl_FragColor = vec4(vColor * uColor * light, 1.0);\n}\n"}),this.sunPosition=this.uniforms.uSunPosition.value}}}},function(e){e.O(0,[2520,5244,6712,6666,5792,2452,7741,2722,9205,4940,8648,4831,9918,8181,3583,1701,2920,7936,1744],function(){return e(e.s=29869)}),_N_E=e.O()}]);