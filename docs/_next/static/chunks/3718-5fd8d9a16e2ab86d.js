(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3718],{91850:function(t,e,r){"use strict";var o=r(14661);function n(){}function i(){}i.resetWarningCache=n,t.exports=function(){function t(t,e,r,n,i,l){if(l!==o){var s=Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function e(){return t}t.isRequired=t;var r={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:i,resetWarningCache:n};return r.PropTypes=r,r}},51745:function(t,e,r){t.exports=r(91850)()},14661:function(t){"use strict";t.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},81134:function(t,e,r){var o,n,i;i=function(t,e,r,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){if("function"!=typeof WeakMap)return null;var e=new WeakMap,r=new WeakMap;return(i=function(t){return t?r:e})(t)}Object.defineProperty(t,"__esModule",{value:!0}),function(t,e){for(var r in e)Object.defineProperty(t,r,{enumerable:!0,get:e[r]})}(t,{BlockMath:()=>u,InlineMath:()=>f}),e=function(t,e){if(t&&t.__esModule)return t;if(null===t||"object"!=typeof t&&"function"!=typeof t)return{default:t};var r=i(void 0);if(r&&r.has(t))return r.get(t);var o={},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var l in t)if("default"!==l&&Object.prototype.hasOwnProperty.call(t,l)){var s=n?Object.getOwnPropertyDescriptor(t,l):null;s&&(s.get||s.set)?Object.defineProperty(o,l,s):o[l]=t[l]}return o.default=t,r&&r.set(t,o),o}(e),r=n(r),o=n(o);let l=(t,{displayMode:n})=>{let i=({children:r,errorColor:i,math:l,renderError:s})=>{let a=null!=l?l:r,{html:c,error:u}=(0,e.useMemo)(()=>{try{return{html:o.default.renderToString(a,{displayMode:n,errorColor:i,throwOnError:!!s}),error:void 0}}catch(t){if(t instanceof o.default.ParseError||t instanceof TypeError)return{error:t};throw t}},[a,i,s]);return u?s?s(u):e.default.createElement(t,{html:`${u.message}`}):e.default.createElement(t,{html:c})};return i.propTypes={children:r.default.string,errorColor:r.default.string,math:r.default.string,renderError:r.default.func},i},s={html:r.default.string.isRequired},a=({html:t})=>e.default.createElement("div",{"data-testid":"react-katex",dangerouslySetInnerHTML:{__html:t}});a.propTypes=s;let c=({html:t})=>e.default.createElement("span",{"data-testid":"react-katex",dangerouslySetInnerHTML:{__html:t}});c.propTypes=s;let u=l(a,{displayMode:!0}),f=l(c,{displayMode:!1})},"object"==typeof t.exports?i(e,r(27275),r(51745),r(9419)):(o=[e,r(27275),r(51745),r(9419)],void 0===(n=i.apply(e,o))||(t.exports=n))},4481:function(){},32717:function(t,e,r){"use strict";function o(t,e){return e||(e=t.slice(0)),Object.freeze(Object.defineProperties(t,{raw:{value:Object.freeze(e)}}))}r.d(e,{_:function(){return o}})},25628:function(t,e,r){"use strict";r.d(e,{e:function(){return i}});var o=r(52471);function n(t,e,r){let o=r.length-t-1;if(e>=r[o])return o-1;if(e<=r[t])return t;let n=t,i=o,l=Math.floor((n+i)/2);for(;e<r[l]||e>=r[l+1];)e<r[l]?i=l:n=l,l=Math.floor((n+i)/2);return l}class i extends o.Curve{constructor(t,e,r,n,i){super(),this.degree=t,this.knots=e,this.controlPoints=[],this.startKnot=n||0,this.endKnot=i||this.knots.length-1;for(let t=0;t<r.length;++t){let e=r[t];this.controlPoints[t]=new o.Vector4(e.x,e.y,e.z,e.w)}}getPoint(t,e=new o.Vector3){let r=this.knots[this.startKnot]+t*(this.knots[this.endKnot]-this.knots[this.startKnot]),i=function(t,e,r,i){let l=n(t,i,e),s=function(t,e,r,o){let n=[],i=[],l=[];n[0]=1;for(let s=1;s<=r;++s){i[s]=e-o[t+1-s],l[s]=o[t+s]-e;let r=0;for(let t=0;t<s;++t){let e=l[t+1],o=i[s-t],a=n[t]/(e+o);n[t]=r+e*a,r=o*a}n[s]=r}return n}(l,i,t,e),a=new o.Vector4(0,0,0,0);for(let e=0;e<=t;++e){let o=r[l-t+e],n=s[e],i=o.w*n;a.x+=o.x*i,a.y+=o.y*i,a.z+=o.z*i,a.w+=o.w*n}return a}(this.degree,this.knots,this.controlPoints,r);return 1!==i.w&&i.divideScalar(i.w),e.set(i.x,i.y,i.z)}getTangent(t,e=new o.Vector3){var r;let i=this.knots[0]+t*(this.knots[this.knots.length-1]-this.knots[0]),l=(r=this.degree,function(t){let e=t.length,r=[],n=[];for(let i=0;i<e;++i){let e=t[i];r[i]=new o.Vector3(e.x,e.y,e.z),n[i]=e.w}let i=[];for(let t=0;t<e;++t){let e=r[t].clone();for(let r=1;r<=t;++r)e.sub(i[t-r].clone().multiplyScalar(function(t,e){let r=1;for(let e=2;e<=t;++e)r*=e;let o=1;for(let t=2;t<=e;++t)o*=t;for(let r=2;r<=t-e;++r)o*=r;return r/o}(t,r)*n[r]));i[t]=e.divideScalar(n[0])}return i}(function(t,e,r,i,l){let s=1<t?1:t,a=[],c=n(t,i,e),u=function(t,e,r,o,n){let i=[];for(let t=0;t<=r;++t)i[t]=0;let l=[];for(let t=0;t<=o;++t)l[t]=i.slice(0);let s=[];for(let t=0;t<=r;++t)s[t]=i.slice(0);s[0][0]=1;let a=i.slice(0),c=i.slice(0);for(let o=1;o<=r;++o){a[o]=e-n[t+1-o],c[o]=n[t+o]-e;let r=0;for(let t=0;t<o;++t){let e=c[t+1],n=a[o-t];s[o][t]=e+n;let i=s[t][o-1]/s[o][t];s[t][o]=r+e*i,r=n*i}s[o][o]=r}for(let t=0;t<=r;++t)l[0][t]=s[t][r];for(let t=0;t<=r;++t){let e=0,n=1,a=[];for(let t=0;t<=r;++t)a[t]=i.slice(0);a[0][0]=1;for(let i=1;i<=o;++i){let o=0,c=t-i,u=r-i;t>=i&&(a[n][0]=a[e][0]/s[u+1][c],o=a[n][0]*s[c][u]);let f=c>=-1?1:-c,h=t-1<=u?i-1:r-t;for(let t=f;t<=h;++t)a[n][t]=(a[e][t]-a[e][t-1])/s[u+1][c+t],o+=a[n][t]*s[c+t][u];t<=u&&(a[n][i]=-a[e][i-1]/s[u+1][t],o+=a[n][i]*s[t][u]),l[i][t]=o;let p=e;e=n,n=p}}let u=r;for(let t=1;t<=o;++t){for(let e=0;e<=r;++e)l[t][e]*=u;u*=r-t}return l}(c,i,t,s,e),f=[];for(let t=0;t<r.length;++t){let e=r[t].clone(),o=e.w;e.x*=o,e.y*=o,e.z*=o,f[t]=e}for(let e=0;e<=s;++e){let r=f[c-t].clone().multiplyScalar(u[e][0]);for(let o=1;o<=t;++o)r.add(f[c-t+o].clone().multiplyScalar(u[e][o]));a[e]=r}for(let t=s+1;t<=l+1;++t)a[t]=new o.Vector4(0,0,0);return a}(r,this.knots,this.controlPoints,i,1)));return e.copy(l[1]).normalize(),e}}},6054:function(t,e,r){"use strict";r.d(e,{Z:function(){return n}});var o=r(52471);class n extends o.Line{constructor(t,e){let r=new o.BufferGeometry;r.setAttribute("position",new o.Float32BufferAttribute([1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],3)),r.computeBoundingSphere(),super(r,new o.LineBasicMaterial({fog:!1})),this.light=t,this.color=e,this.type="RectAreaLightHelper";let n=new o.BufferGeometry;n.setAttribute("position",new o.Float32BufferAttribute([1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],3)),n.computeBoundingSphere(),this.add(new o.Mesh(n,new o.MeshBasicMaterial({side:o.BackSide,fog:!1})))}updateMatrixWorld(){if(this.scale.set(.5*this.light.width,.5*this.light.height,1),void 0!==this.color)this.material.color.set(this.color),this.children[0].material.color.set(this.color);else{this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);let t=this.material.color,e=Math.max(t.r,t.g,t.b);e>1&&t.multiplyScalar(1/e),this.children[0].material.color.copy(this.material.color)}this.matrixWorld.extractRotation(this.light.matrixWorld).scale(this.scale).copyPosition(this.light.matrixWorld),this.children[0].matrixWorld.copy(this.matrixWorld)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}}}]);