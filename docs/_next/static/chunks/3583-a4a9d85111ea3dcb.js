"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3583],{73583:function(t,e,i){i.d(e,{Nm:function(){return u.Nm},J8:function(){return u.J8},wx:function(){return l},T:function(){return z}}),(o=l||(l={}))[o.Auto=0]="Auto",o[o.Absolute=1]="Absolute",o[o.Relative=2]="Relative",o[o.OppositeRelative=3]="OppositeRelative",o[o.SmallerRelative=4]="SmallerRelative",o[o.LargerRelative=5]="LargerRelative",o[o.Fraction=6]="Fraction";let r={abs:1,rel:2,opp:3,sm:4,lg:5,fr:6,"%":2,part:6,sh:6},n=Object.fromEntries(Object.entries(r).map(t=>{let[e,i]=t;return[i,e]}));class s{static parse(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new s;return e.parse(t),e}set(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.type;this.value=t,this.type=e}compute(t,e){switch(this.type){case 1:return this.value;case 2:return this.value*t;case 3:return this.value*e;case 4:return this.value*Math.min(t,e);case 5:return this.value*Math.max(t,e);case 0:case 6:return t}}parse(t){return!function(t){var e;let i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new s;if("auto"===t)return i.value=1,i.type=0;if("number"==typeof t)return i.value=t,i.type=1;if("string"!=typeof t)throw console.log("received:",t),Error("Invalid scalar declaration");let n=t.match(/([\d\.]+)([a-z%]+)?$/);if(!n)throw console.log("received:",t),Error("Invalid scalar declaration");let[o,l,a]=n,h=Number.parseFloat(l),f=null!==(e=r[a])&&void 0!==e?e:1;if(Number.isNaN(h))throw Error("Invalid scalar declaration");"%"===a&&(h/=100),i.value=h,i.type=f}(t,this),this}toString(){return"".concat(this.value).concat(n[this.type])}constructor(t=0,e=1){this.value=t,this.type=e}}var o,l,a=i(74175),h=i(1237),f=i(40855),d=i(6297),u=i(97);let p=new d.Z,c=[];function g(t,e,i,r,n){let s=0,o=0;if(r===u.Nm.Horizontal&&(t.sizeX.type===l.Auto||t.sizeX.type===l.Fraction)&&(i=Math.max(0,i-Math.max(0,n.top-p.top)-Math.max(0,n.bottom-p.bottom))),r===u.Nm.Vertical&&(t.sizeY.type===l.Auto||t.sizeY.type===l.Fraction)&&(e=Math.max(0,e-Math.max(0,n.left-p.left)-Math.max(0,n.right-p.right))),null!==t.aspect){let n=!1;if(t.sizeX.type===l.Auto)n=t.sizeY.type!==l.Auto||r===u.Nm.Horizontal;else if(t.sizeY.type===l.Auto)n=!1;else throw Error('When aspect ratio is defined, at least one of the sizeX or sizeY must be "auto"');n?o=(s=t.sizeX.compute(e,i))/t.aspect:s=(o=t.sizeY.compute(i,e))*t.aspect}else s=t.sizeX.compute(e,i),o=t.sizeY.compute(i,e);t.rect.width=t.extraSizeX.compute(s,o),t.rect.height=t.extraSizeY.compute(o,s)}let m=new h.Ae;function v(t,e,i){if(Array.isArray(t)){let[r,n]=t;return e.parse(r),i.parse(n),[e,i]}return"object"==typeof t?(e.parse(t.x),i.parse(t.y)):(e.parse(t),i.parse(t)),[e,i]}function y(t){if(!1===Array.isArray(t))return[t,t,t,t];if(1===t.length)return[t[0],t[0],t[0],t[0]];if(2===t.length)return[t[0],t[1],t[0],t[1]];if(4===t.length)return t;throw Error("Invalid number of arguments")}class z{set(t){if(void 0!==t.direction&&(this.direction=(0,u.yW)(t.direction)),void 0!==t.positioning&&(this.positioning=(0,u.wb)(t.positioning)),void 0!==t.offset&&v(t.offset,this.offsetX,this.offsetY),void 0!==t.offsetX&&this.offsetX.parse(t.offsetX),void 0!==t.offsetY&&this.offsetY.parse(t.offsetY),void 0!==t.size&&v(t.size,this.sizeX,this.sizeY),void 0!==t.sizeX&&this.sizeX.parse(t.sizeX),void 0!==t.sizeY&&this.sizeY.parse(t.sizeY),void 0!==t.aspect&&(this.aspect=t.aspect),void 0!==t.alignChildren){let{x:e,y:i}=(0,a.iK)(t.alignChildren);this.alignChildrenX=e,this.alignChildrenY=i}if(void 0!==t.alignChildrenX&&(this.alignChildrenX=t.alignChildrenX),void 0!==t.alignChildrenY&&(this.alignChildrenY=t.alignChildrenY),void 0!==t.alignSelf){let{x:e,y:i}=(0,a.iK)(t.alignSelf);this.alignSelfX=e,this.alignSelfY=i}if(void 0!==t.alignSelfX&&(this.alignSelfX=t.alignSelfX),void 0!==t.alignSelfY&&(this.alignSelfY=t.alignSelfY),void 0!==t.padding){let[e,i,r,n]=y(t.padding);this.padding[0].parse(e),this.padding[1].parse(i),this.padding[2].parse(r),this.padding[3].parse(n)}if(void 0!==t.paddingTop&&this.padding[0].parse(t.paddingTop),void 0!==t.paddingRight&&this.padding[1].parse(t.paddingRight),void 0!==t.paddingBottom&&this.padding[2].parse(t.paddingBottom),void 0!==t.paddingLeft&&this.padding[3].parse(t.paddingLeft),void 0!==t.margin){let[e,i,r,n]=y(t.margin);this.margin[0].parse(e),this.margin[1].parse(i),this.margin[2].parse(r),this.margin[3].parse(n)}if(void 0!==t.marginTop&&this.margin[0].parse(t.marginTop),void 0!==t.marginRight&&this.margin[1].parse(t.marginRight),void 0!==t.marginBottom&&this.margin[2].parse(t.marginBottom),void 0!==t.marginLeft&&this.margin[3].parse(t.marginLeft),void 0!==t.gap&&this.gap.parse(t.gap),void 0!==t.spacing){let[e,i,r,n,s]=function(t){if(!1===Array.isArray(t))return[t,t,t,t,t];let[e,...i]=t;return[e,...y(i)]}(t.spacing);this.gap.parse(e),this.padding[0].parse(i),this.padding[1].parse(r),this.padding[2].parse(n),this.padding[3].parse(s)}return void 0!==t.userData&&Object.assign(this.userData,t.userData),this}setDirection(t){return this.direction=(0,u.yW)(t),this}setPositioning(t){return this.positioning=(0,u.wb)(t),this}setOffset(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];if(e[0]&&"object"==typeof e[0]){let{x:t,y:i=t}=e[0];this.offsetX.parse(t),this.offsetY.parse(i)}else{let[t,i=t]=e;this.offsetX.parse(t),this.offsetY.parse(i)}return this}setSize(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];if(e[0]&&"object"==typeof e[0]){let{x:t,y:i=t}=e[0];this.sizeX.parse(t),this.sizeY.parse(i)}else{let[t,i=t]=e;this.sizeX.parse(t),this.sizeY.parse(i)}return this}setOffsetSizeAsAbsoluteRect(t){return this.offsetX.set(t.x,l.Absolute),this.offsetY.set(t.y,l.Absolute),this.sizeX.set(t.width,l.Absolute),this.sizeY.set(t.height,l.Absolute),this}setAlign(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t;return this.alignChildrenX=t,this.alignChildrenY=e,this}setUserData(t){return Object.assign(this.userData,t),this}setPadding(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];1===e.length&&Array.isArray(e[0])&&(e=e[0]);let[r,n,s,o]=y(e);return this.padding[0].parse(r),this.padding[1].parse(n),this.padding[2].parse(s),this.padding[3].parse(o),this}setGap(t){return this.gap.parse(t),this}setSpacing(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];let[r,...n]=e;return this.setGap(r),n.length>0?this.setPadding.apply(this,n):this.setPadding(r),this}isRoot(){return this.root===this}isLeaf(){return 0===this.children.length}depth(){let t=0,e=this;for(;e;)e=e.parent,t++;return t}*allDescendants(){let{includeSelf:t=!1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};for(let e of(t&&(yield this),this.children))yield*e.allDescendants({includeSelf:!0})}descendantsCount(){let{includeSelf:t=!1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=0;for(let i of this.allDescendants({includeSelf:t}))e++;return e}*allAncestors(){let{includeSelf:t=!1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t?this:this.parent;for(;e;)yield e,e=e.parent}*allLeaves(){let{includeSelf:t=!0}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};for(let e of this.allDescendants({includeSelf:t}))0===e.children.length&&(yield e)}leavesCount(){let{includeSelf:t=!0}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=0;for(let i of this.allLeaves({includeSelf:t}))e++;return e}path(){let t=[],e=this;for(;e.parent;)t.push(e.parent.children.indexOf(e)),e=e.parent;return t.reverse()}get(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];let r=e[0]&&"object"==typeof e[0]&&Symbol.iterator in e[0]?e[0]:e,n=this;for(let t of r)if(t<0&&(t=n.children.length+t),!(n=n.children[t]))return null;return n}find(t){let{includeSelf:e=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};for(let i of this.allDescendants({includeSelf:e}))if(t(i))return i;return null}*findAll(t){let{includeSelf:e=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};for(let i of this.allDescendants({includeSelf:e}))t(i)&&(yield i)}pointCast(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];let[r,n]=1===e.length?[e[0].x,e[0].y]:e;for(let t of this.allLeaves())if(t.rect.containsXY(r,n))return t;return null}add(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];for(let t of e)t.removeFromParent(),t.parent=this,t.root=this.root,this.children.push(t);return this}populate(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];if(1===e.length&&"object"==typeof e[0]){let{count:t,...i}=e[0];return this.populate(t,i)}let[r,n]=e;for(let t=0;t<r;t++)this.add(new z(n));return this}addTo(t){return t.add(this),this}prepend(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];for(let t of e)t.removeFromParent(),this.children.unshift(t),t.parent=this,t.root=this.root;return this}prependTo(t){return t.prepend(this),this}removeFromParent(){return this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent=null,this.root=this),this}remove(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];for(let t of e)t.parent===this&&t.removeFromParent();return this}sort(t){return this.children.sort(t),this}tangentSize(){var t,e;return(null!==(e=null===(t=this.parent)||void 0===t?void 0:t.direction)&&void 0!==e?e:this.direction)===u.Nm.Horizontal?this.sizeX:this.sizeY}normalSize(){return this.direction===u.Nm.Horizontal?this.sizeX:this.sizeY}getUvRect(){return this.rect.clone().relativeTo(this.root.rect)}parse(t){let e;if(!t)return;let i=/(\w+)(?:\(([^)]+)\))?/g,r=[];for(;null!==(e=i.exec(t));){let t=e[1],i=e[2]?e[2].split(",").map(t=>t.trim()):[];r.push({token:t,args:i})}for(let{token:e,args:i}of r)switch(e){case"horizontal":this.direction=u.Nm.Horizontal;break;case"vertical":this.direction=u.Nm.Vertical;break;case"size":{let[t,e=t]=i;this.sizeX.parse(t),this.sizeY.parse(e);break}default:throw console.log(t,r),Error('Unknow type: "'.concat(e,'"'))}}computeLayout(){this.isRoot()&&function(t){let{offsetX:e,offsetY:i,sizeX:r,sizeY:n}=t;for(let t of[e,i,r,n])if(t.type!==l.Absolute)throw Error("Root space must have absolute offset and size");t.rect.set(e.value,i.value,r.value,n.value)}(this);let t=[this];for(;t.length>0;){let e=t.shift();!function(t){var e,i,r,n,s,o;let{direction:a,alignChildrenX:h,alignChildrenY:v}=t,[y,z]=(0,f.split)(t.children,t=>t.enabled?0:1);if(z)for(let t of z)for(let e of t.allDescendants({includeSelf:!0}))e.rect.set(0,0,0,0);if(void 0===y)return;!function(t){let{width:e,height:i}=t.rect;for(let e of t.padding)if(e.type===l.Fraction)throw Error("Share padding is not allowed");p.setTRBL(t.padding[0].compute(i,e),t.padding[1].compute(e,i),t.padding[2].compute(i,e),t.padding[3].compute(e,i))}(t);let{x:w,y:A,width:b,height:Y}=m.copy(t.rect).applyPadding(p),X=t.gap.compute(b,Y),[x,S,N,R,C]=y.reduce((t,e)=>{if(e.positioning===u.J8.Detached)t[0].push(e);else{t[1].push(e);let i=a===u.Nm.Horizontal?e.sizeX:e.sizeY;i.type!==l.Fraction&&i.type!==l.Auto?t[2].push(e):(t[3].push(e),t[4]+=i.value)}return t},[[],[],[],[],0]);!function(t){for(;c.length<t.children.length;)c.push(new d.Z);let{width:e,height:i}=t.rect;for(let r=0;r<t.children.length;r++){let n=t.children[r];c[r].setTRBL(n.margin[0].compute(i,e),n.margin[1].compute(e,i),n.margin[2].compute(i,e),n.margin[3].compute(e,i))}}(t);let D=Array.from({length:S.length+1}),F=0,M=0;if(a===u.Nm.Horizontal){F+=M=Math.max(c[0].left,p.left),D[0]=M;for(let t=1,e=S.length;t<e;t++)F+=M=Math.max(c[t-1].right,c[t].left,X),D[t]=M;S.length>0&&(F+=M=Math.max(c[S.length-1].right,p.right),D[S.length]=M)}else{F+=M=Math.max(c[0].top,p.top),D[0]=M;for(let t=1,e=S.length;t<e;t++)F+=M=Math.max(c[t-1].bottom,c[t].top,X),D[t]=M;S.length>0&&(F+=M=Math.max(c[S.length-1].bottom,p.bottom),D[S.length]=M)}for(let t of x){g(t,b,Y,a,c[0]);let r=b-t.rect.width,n=Y-t.rect.height;t.rect.x=w+r*(null!==(e=t.alignSelfX)&&void 0!==e?e:h)+t.offsetX.compute(b,Y),t.rect.y=A+n*(null!==(i=t.alignSelfY)&&void 0!==i?i:v)+t.offsetY.compute(Y,b)}let H=0;if(a===u.Nm.Horizontal)for(let t=0,e=N.length;t<e;t++){let e=N[t];g(e,b,Y,a,c[t]),H+=e.rect.width}else for(let t=0,e=N.length;t<e;t++){let e=N[t];g(e,b,Y,a,c[t]),H+=e.rect.height}let E=(a===u.Nm.Horizontal?t.rect.width:t.rect.height)-H-F,L=E>0?E/C:0;if(a===u.Nm.Horizontal)for(let t=0,e=R.length;t<e;t++){let e=R[t];g(e,L*e.sizeX.value,Y,a,c[t])}else for(let t=0,e=R.length;t<e;t++){let e=R[t];g(e,b,L*e.sizeY.value,a,c[t])}let j=0;if(a===u.Nm.Horizontal)for(let e of(j=t.rect.width-F,S))j-=e.rect.width;else for(let e of(j=t.rect.height-F,S))j-=e.rect.height;if(a===u.Nm.Horizontal){let e=t.rect.x+D[0]+j*h;for(let t=0,i=S.length;t<i;t++){let i=S[t],s=i.offsetX.compute(i.rect.width,i.rect.height),o=i.offsetY.compute(i.rect.height,i.rect.width);if(i.rect.x=s+e,i.sizeY.type===l.Fraction||i.sizeY.type===l.Auto){let e=Math.max(0,c[t].top-p.top),n=Math.max(0,c[t].bottom-p.bottom);i.rect.y=o+m.y+e+(m.height-i.rect.height-e-n)*(null!==(r=i.alignSelfY)&&void 0!==r?r:v)}else i.rect.y=o+m.y+(m.height-i.rect.height)*(null!==(n=i.alignSelfY)&&void 0!==n?n:v);e+=i.rect.width+D[t+1]}}else{let e=t.rect.y+D[0]+j*v;for(let t=0,i=S.length;t<i;t++){let i=S[t],r=i.offsetX.compute(i.rect.width,i.rect.height),n=i.offsetY.compute(i.rect.height,i.rect.width);if(i.sizeX.type===l.Fraction||i.sizeX.type===l.Auto){let e=Math.max(0,c[t].left-p.left),n=Math.max(0,c[t].right-p.right);i.rect.x=r+m.x+e+(m.width-i.rect.width-e-n)*(null!==(s=i.alignSelfX)&&void 0!==s?s:h)}else i.rect.x=r+m.x+(m.width-i.rect.width)*(null!==(o=i.alignSelfX)&&void 0!==o?o:h);i.rect.y=n+e,e+=i.rect.height+D[t+1]}}}(e),t.push(...e.children)}return this}constructor(t){this.enabled=!0,this.root=this,this.parent=null,this.children=[],this.direction=u.Nm.Horizontal,this.positioning=u.J8.Flow,this.aspect=null,this.offsetX=new s(0,l.Absolute),this.offsetY=new s(0,l.Absolute),this.sizeX=new s(1,l.Auto),this.sizeY=new s(1,l.Auto),this.extraSizeX=new s(1,l.Relative),this.extraSizeY=new s(1,l.Relative),this.padding=[new s(0,l.Absolute),new s(0,l.Absolute),new s(0,l.Absolute),new s(0,l.Absolute)],this.margin=[new s(0,l.Absolute),new s(0,l.Absolute),new s(0,l.Absolute),new s(0,l.Absolute)],this.gap=new s(0,l.Absolute),this.alignChildrenX=.5,this.alignChildrenY=.5,this.alignSelfX=null,this.alignSelfY=null,this.rect=new h.Ae,this.userData={},t&&("object"==typeof t?this.set(t):this.direction=t,this.root=this)}}},97:function(t,e,i){var r,n,s,o,l,a;function h(t){if(t in s)return t;if("string"==typeof t)return"flow"===t?0:1;throw Error("Invalid positioning value: ".concat(t))}function f(t){if(t in n)return t;if("string"==typeof t)return"horizontal"===t?2:3;throw Error("Invalid direction value: ".concat(t))}i.d(e,{J8:function(){return s},Nm:function(){return n},wb:function(){return h},yW:function(){return f}}),(o=r||(r={}))[o.Flow=0]="Flow",o[o.Detached=1]="Detached",o[o.Horizontal=2]="Horizontal",o[o.Vertical=3]="Vertical",(l=n||(n={}))[l.Horizontal=2]="Horizontal",l[l.Vertical=3]="Vertical",(a=s||(s={}))[a.Flow=0]="Flow",a[a.Detached=1]="Detached"},40855:function(t,e,i){function r(t,e){for(let i of t)if(e(i))return!0;return!1}function n(t,e){for(let i of t)if(!e(i))return!1;return!0}function s(t,e,i){let r=[];function n(t){let e=[];return r[t]=e,e}if(void 0!==i)for(let t=0;t<i;t++)n(t);for(let i of t){var s;let t=e(i);(null!==(s=r[t])&&void 0!==s?s:n(t)).push(i)}return r}i.r(e),i.d(e,{every:function(){return n},some:function(){return r},split:function(){return s}})}}]);