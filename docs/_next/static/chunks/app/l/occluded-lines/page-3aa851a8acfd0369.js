(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[165],{98890:function(n,e,o){Promise.resolve().then(o.bind(o,47537))},47537:function(n,e,o){"use strict";o.d(e,{Main:function(){return v}});var i=o(32617),t=o(88780),r=o(33966),l=o(15721),s=o(97219),u=o(12042),a=o(78780),c=o(29368);class m extends t.Mesh{constructor(){super(new t.PlaneGeometry(4,.2),new u.P({color:"#ff9900"}))}}class h extends t.Mesh{constructor(){super(new t.PlaneGeometry(4,.2),new t.ShaderMaterial({uniforms:{uColor:{value:new t.Color("#ff9900")},uSunPosition:{value:new t.Vector3(.5,.7,.3)},uLuminosity:{value:.5}},vertexShader:"\n      varying vec3 vWorldNormal;\n      \n      void main() {\n        vWorldNormal = mat3(modelMatrix) * normal;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n        gl_Position.z += -0.01;\n      }\n    ",fragmentShader:"\n      varying vec3 vWorldNormal;\n      varying vec3 vColor;\n      \n      uniform vec3 uSunPosition;\n      uniform vec3 uColor;\n      uniform float uLuminosity;\n      \n      void main() {\n        vec3 lightDirection = normalize(uSunPosition);\n        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n        light = pow(light, 2.0);\n        light = mix(uLuminosity, 1.0, light);\n        gl_FragColor = vec4(uColor * light, 1.0);\n      }\n    "}))}}function d(){return(0,r.jE)(function*(n){n.useOrbitControls=!1;let e=new l.F({size:[8,8]});e.start(n.three.renderer.domElement),yield(0,c.RC)("three",o=>{e.update(n.three.camera,n.three.aspect)})}),(0,r.Ky)(function*(n){n.scene.background=new t.Color("#6699cc"),(0,a.cY)(new t.Mesh(new t.IcosahedronGeometry(1,4),new u.P({color:"red"})),n.scene),(0,a.cY)(new s.O,n.scene).box({size:2}).draw().showOccludedLines(),(0,a.cY)(new m,{parent:n.scene,position:[0,.5,0]}),(0,a.cY)(new h,{parent:n.scene,position:[0,-.5,0]}),yield()=>n.scene.clear()},[]),null}function v(){return(0,i.jsx)(r.c,{children:(0,i.jsx)(d,{})})}},12042:function(n,e,o){"use strict";o.d(e,{P:function(){return l}});var i=o(88780),t=o(23247);let r={luminosity:.5};class l extends i.MeshBasicMaterial{constructor(n){let{luminosity:e,...o}={...r,...n},l={uSunPosition:{value:new i.Vector3(.5,.7,.3)},uLuminosity:{value:e}};super(o),this.onBeforeCompile=n=>t.b.with(n).uniforms(l).varying({vWorldNormal:"vec3"}).vertex.mainAfterAll("\n          vWorldNormal = mat3(modelMatrix) * normal;\n      ").fragment.after("map_fragment","\n        vec3 lightDirection = normalize(uSunPosition);\n        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n        light = pow(light, 2.0);\n        light = mix(uLuminosity, 1.0, light);\n        diffuseColor *= light;\n      "),this.sunPosition=l.uSunPosition.value}}}},function(n){n.O(0,[7987,7512,1561,7834,6158,3956,1067,3310,749,812,3420,1540,167,4157,9258,5721,1174,5284,1618,5694,2840,1744],function(){return n(n.s=98890)}),_N_E=n.O()}]);