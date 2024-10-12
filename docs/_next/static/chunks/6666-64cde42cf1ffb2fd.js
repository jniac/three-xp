"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6666],{66666:function(e,t,r){r.d(t,{$1:function(){return l},Vs:function(){return s},n4:function(){return i}});var o=r(52471);function i(e,t=!1){let r=null!==e[0].index,i=new Set(Object.keys(e[0].attributes)),l=new Set(Object.keys(e[0].morphAttributes)),s={},u={},a=e[0].morphTargetsRelative,f=new o.BufferGeometry,m=0;for(let o=0;o<e.length;++o){let n=e[o],g=0;if(r!==(null!==n.index))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let e in n.attributes){if(!i.has(e))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+'. All geometries must have compatible attributes; make sure "'+e+'" attribute exists among all geometries, or in none of them.'),null;void 0===s[e]&&(s[e]=[]),s[e].push(n.attributes[e]),g++}if(g!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+". Make sure all geometries have the same number of attributes."),null;if(a!==n.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let e in n.morphAttributes){if(!l.has(e))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+".  .morphAttributes must be consistent throughout all geometries."),null;void 0===u[e]&&(u[e]=[]),u[e].push(n.morphAttributes[e])}if(t){let e;if(r)e=n.index.count;else{if(void 0===n.attributes.position)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+". The geometry must have either an index or a position attribute"),null;e=n.attributes.position.count}f.addGroup(m,e,o),m+=e}}if(r){let t=0,r=[];for(let o=0;o<e.length;++o){let i=e[o].index;for(let e=0;e<i.count;++e)r.push(i.getX(e)+t);t+=e[o].attributes.position.count}f.setIndex(r)}for(let e in s){let t=n(s[e]);if(!t)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+e+" attribute."),null;f.setAttribute(e,t)}for(let e in u){let t=u[e][0].length;if(0===t)break;f.morphAttributes=f.morphAttributes||{},f.morphAttributes[e]=[];for(let r=0;r<t;++r){let t=[];for(let o=0;o<u[e].length;++o)t.push(u[e][o][r]);let o=n(t);if(!o)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+e+" morphAttribute."),null;f.morphAttributes[e].push(o)}}return f}function n(e){let t,r,i;let n=-1,l=0;for(let o=0;o<e.length;++o){let s=e[o];if(void 0===t&&(t=s.array.constructor),t!==s.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(void 0===r&&(r=s.itemSize),r!==s.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(void 0===i&&(i=s.normalized),i!==s.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(-1===n&&(n=s.gpuType),n!==s.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;l+=s.count*r}let s=new t(l),u=new o.BufferAttribute(s,r,i),a=0;for(let t=0;t<e.length;++t){let o=e[t];if(o.isInterleavedBufferAttribute){let e=a/r;for(let t=0,i=o.count;t<i;t++)for(let i=0;i<r;i++){let r=o.getComponent(t,i);u.setComponent(t+e,i,r)}}else s.set(o.array,a);a+=o.count*r}return void 0!==n&&(u.gpuType=n),u}function l(e,t=1e-4){t=Math.max(t,Number.EPSILON);let r={},o=e.getIndex(),i=e.getAttribute("position"),n=o?o.count:i.count,l=0,s=Object.keys(e.attributes),u={},a={},f=[],m=["getX","getY","getZ","getW"],g=["setX","setY","setZ","setW"];for(let t=0,r=s.length;t<r;t++){let r=s[t],o=e.attributes[r];u[r]=new o.constructor(new o.array.constructor(o.count*o.itemSize),o.itemSize,o.normalized);let i=e.morphAttributes[r];i&&(a[r]||(a[r]=[]),i.forEach((e,t)=>{let o=new e.array.constructor(e.count*e.itemSize);a[r][t]=new e.constructor(o,e.itemSize,e.normalized)}))}let c=.5*t,h=Math.pow(10,Math.log10(1/t)),b=c*h;for(let t=0;t<n;t++){let i=o?o.getX(t):t,n="";for(let t=0,r=s.length;t<r;t++){let r=s[t],o=e.getAttribute(r),l=o.itemSize;for(let e=0;e<l;e++)n+=`${~~(o[m[e]](i)*h+b)},`}if(n in r)f.push(r[n]);else{for(let t=0,r=s.length;t<r;t++){let r=s[t],o=e.getAttribute(r),n=e.morphAttributes[r],f=o.itemSize,c=u[r],h=a[r];for(let e=0;e<f;e++){let t=m[e],r=g[e];if(c[r](l,o[t](i)),n)for(let e=0,o=n.length;e<o;e++)h[e][r](l,n[e][t](i))}}r[n]=l,f.push(l),l++}}let d=e.clone();for(let t in e.attributes){let e=u[t];if(d.setAttribute(t,new e.constructor(e.array.slice(0,l*e.itemSize),e.itemSize,e.normalized)),t in a)for(let e=0;e<a[t].length;e++){let r=a[t][e];d.morphAttributes[t][e]=new r.constructor(r.array.slice(0,l*r.itemSize),r.itemSize,r.normalized)}}return d.setIndex(f),d}function s(e,t){if(t===o.TrianglesDrawMode)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),e;if(t!==o.TriangleFanDrawMode&&t!==o.TriangleStripDrawMode)return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",t),e;{let r=e.getIndex();if(null===r){let t=[],o=e.getAttribute("position");if(void 0===o)return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),e;for(let e=0;e<o.count;e++)t.push(e);e.setIndex(t),r=e.getIndex()}let i=r.count-2,n=[];if(t===o.TriangleFanDrawMode)for(let e=1;e<=i;e++)n.push(r.getX(0)),n.push(r.getX(e)),n.push(r.getX(e+1));else for(let e=0;e<i;e++)e%2==0?(n.push(r.getX(e)),n.push(r.getX(e+1)),n.push(r.getX(e+2))):(n.push(r.getX(e+2)),n.push(r.getX(e+1)),n.push(r.getX(e)));n.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let l=e.clone();return l.setIndex(n),l.clearGroups(),l}}}}]);