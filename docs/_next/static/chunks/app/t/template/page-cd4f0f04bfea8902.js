(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1682],{55892:function(e,t,n){Promise.resolve().then(n.bind(n,45742))},45742:function(e,t,n){"use strict";n.d(t,{Client:function(){return g}});var i=n(32617),r=n(88780),o=n(62274),l=n(12042),u=n(78780),s=n(29368),a=n(87200),c=n(23657),f=n(9258);n(41737);let d=(0,a.createContext)(null),m={className:"",assetsPath:"/"};function h(e){let{children:t,className:n,assetsPath:r}={...m,...e},o=(0,a.useMemo)(()=>new f.Vu,[]);o.loader.setPath(r);let{ref:l}=(0,c.Nv)({debounce:!0},function*(e,t){yield o.initialize(e),t.triggerRender(),Object.assign(window,{three:o})},[]);return(0,i.jsx)("div",{ref:l,className:n,style:{position:"absolute",inset:0},children:(0,i.jsx)(d.Provider,{value:o,children:o.initialized&&t})})}function v(e){return function(){let[e,t]=(0,a.useState)(!1);return(0,a.useLayoutEffect)(()=>{t(!0)},[]),e}()&&(0,i.jsx)(h,{...e})}var w=n(57143),x=n.n(w);function y(){return!function(e,t){let n=(0,a.useContext)(d);(0,c.sv)(async function*(t,i){if(e){let t=e(n,i);if(t&&"function"==typeof t.next)do{let{value:e,done:n}=await t.next();if(n)break;yield e}while(i.mounted)}},null!=t?t:"always")}(function*(e){let t=(0,u.cY)(new r.Mesh(new r.IcosahedronGeometry,new l.P),e.scene);yield()=>t.removeFromParent();let n=new o.F;n.initialize(e.renderer.domElement).start(),yield(0,s.RC)("three",t=>{n.update(e.camera,e.aspect,t.deltaTime)})},[]),null}function g(){return(0,i.jsx)("div",{className:"layer thru ".concat(x().Client),children:(0,i.jsx)(v,{children:(0,i.jsx)(y,{})})})}},12042:function(e,t,n){"use strict";n.d(t,{P:function(){return l}});var i=n(88780),r=n(23247);let o={luminosity:.5};class l extends i.MeshBasicMaterial{constructor(e){let{luminosity:t,...n}={...o,...e},l={uSunPosition:{value:new i.Vector3(.5,.7,.3)},uLuminosity:{value:t}};super(n),this.onBeforeCompile=e=>r.b.with(e).uniforms(l).varying({vWorldNormal:"vec3"}).vertex.mainAfterAll("\n          vWorldNormal = mat3(modelMatrix) * normal;\n      ").fragment.after("map_fragment","\n        vec3 lightDirection = normalize(uSunPosition);\n        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;\n        light = pow(light, 2.0);\n        light = mix(uLuminosity, 1.0, light);\n        diffuseColor *= light;\n      "),this.sunPosition=l.uSunPosition.value}}},57143:function(e){e.exports={Client:"client_Client__eDdMm"}},77478:function(e,t,n){"use strict";function i(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}n.d(t,{_:function(){return i}})}},function(e){e.O(0,[7176,7512,1561,7834,6158,3956,1067,3310,812,2038,3420,1540,9258,4157,3977,5694,2840,1744],function(){return e(e.s=55892)}),_N_E=e.O()}]);