"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[958],{3208:function(e,t,i){i.d(t,{x:function(){return a}});var o=i(7785);class a extends o.yxD{constructor(e){super(e),this.type=o.cLu}parse(e){let t,i,a;let r=function(e,t){switch(e){case 1:throw Error("THREE.RGBELoader: Read Error: "+(t||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(t||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(t||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(t||""))}},n=function(e,t,i){t=t||1024;let o=e.pos,a=-1,r=0,n="",l=String.fromCharCode.apply(null,new Uint16Array(e.subarray(o,o+128)));for(;0>(a=l.indexOf("\n"))&&r<t&&o<e.byteLength;)n+=l,r+=l.length,o+=128,l+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(o,o+128)));return -1<a&&(!1!==i&&(e.pos+=r+a+1),n+l.slice(0,a))},l=new Uint8Array(e);l.pos=0;let s=function(e){let t,i;let o=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,a=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,l=/^\s*FORMAT=(\S+)\s*$/,s=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,c={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};for(!(e.pos>=e.byteLength)&&(t=n(e))||r(1,"no header found"),(i=t.match(/^#\?(\S+)/))||r(3,"bad initial token"),c.valid|=1,c.programtype=i[1],c.string+=t+"\n";!1!==(t=n(e));){if(c.string+=t+"\n","#"===t.charAt(0)){c.comments+=t+"\n";continue}if((i=t.match(o))&&(c.gamma=parseFloat(i[1])),(i=t.match(a))&&(c.exposure=parseFloat(i[1])),(i=t.match(l))&&(c.valid|=2,c.format=i[1]),(i=t.match(s))&&(c.valid|=4,c.height=parseInt(i[1],10),c.width=parseInt(i[2],10)),2&c.valid&&4&c.valid)break}return 2&c.valid||r(3,"missing format specifier"),4&c.valid||r(3,"missing image size specifier"),c}(l),c=s.width,v=s.height,f=function(e,t,i){if(t<8||t>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);t!==(e[2]<<8|e[3])&&r(3,"wrong scanline width");let o=new Uint8Array(4*t*i);o.length||r(4,"unable to allocate buffer space");let a=0,n=0,l=4*t,s=new Uint8Array(4),c=new Uint8Array(l),v=i;for(;v>0&&n<e.byteLength;){n+4>e.byteLength&&r(1),s[0]=e[n++],s[1]=e[n++],s[2]=e[n++],s[3]=e[n++],(2!=s[0]||2!=s[1]||(s[2]<<8|s[3])!=t)&&r(3,"bad rgbe scanline format");let i=0,f;for(;i<l&&n<e.byteLength;){let t=(f=e[n++])>128;if(t&&(f-=128),(0===f||i+f>l)&&r(3,"bad scanline data"),t){let t=e[n++];for(let e=0;e<f;e++)c[i++]=t}else c.set(e.subarray(n,n+f),i),i+=f,n+=f}for(let e=0;e<t;e++){let i=0;o[a]=c[e+i],i+=t,o[a+1]=c[e+i],i+=t,o[a+2]=c[e+i],i+=t,o[a+3]=c[e+i],a+=4}v--}return o}(l.subarray(l.pos),c,v);switch(this.type){case o.VzW:let m=new Float32Array(4*(a=f.length/4));for(let e=0;e<a;e++)!function(e,t,i,o){let a=Math.pow(2,e[t+3]-128)/255;i[o+0]=e[t+0]*a,i[o+1]=e[t+1]*a,i[o+2]=e[t+2]*a,i[o+3]=1}(f,4*e,m,4*e);t=m,i=o.VzW;break;case o.cLu:let p=new Uint16Array(4*(a=f.length/4));for(let e=0;e<a;e++)!function(e,t,i,a){let r=Math.pow(2,e[t+3]-128)/255;i[a+0]=o.A5E.toHalfFloat(Math.min(e[t+0]*r,65504)),i[a+1]=o.A5E.toHalfFloat(Math.min(e[t+1]*r,65504)),i[a+2]=o.A5E.toHalfFloat(Math.min(e[t+2]*r,65504)),i[a+3]=o.A5E.toHalfFloat(1)}(f,4*e,p,4*e);t=p,i=o.cLu;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:c,height:v,data:t,header:s.string,gamma:s.gamma,exposure:s.exposure,type:i}}setDataType(e){return this.type=e,this}load(e,t,i,a){return super.load(e,function(e,i){switch(e.type){case o.VzW:case o.cLu:e.colorSpace=o.GUF,e.minFilter=o.wem,e.magFilter=o.wem,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,i)},i,a)}}},2886:function(e,t,i){i.d(t,{L:function(){return o}});class o{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(256*e.random());this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[255&e];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(e,t,i){return e[0]*t+e[1]*i}dot3(e,t,i,o){return e[0]*t+e[1]*i+e[2]*o}dot4(e,t,i,o,a){return e[0]*t+e[1]*i+e[2]*o+e[3]*a}noise(e,t){let i,o,a,r,n;let l=.5*(Math.sqrt(3)-1)*(e+t),s=Math.floor(e+l),c=Math.floor(t+l),v=(3-Math.sqrt(3))/6,f=(s+c)*v,m=e-(s-f),p=t-(c-f);m>p?(r=1,n=0):(r=0,n=1);let u=m-r+v,h=p-n+v,d=m-1+2*v,x=p-1+2*v,g=255&s,w=255&c,P=this.perm[g+this.perm[w]]%12,D=this.perm[g+r+this.perm[w+n]]%12,E=this.perm[g+1+this.perm[w+1]]%12,S=.5-m*m-p*p;S<0?i=0:(S*=S,i=S*S*this.dot(this.grad3[P],m,p));let y=.5-u*u-h*h;y<0?o=0:(y*=y,o=y*y*this.dot(this.grad3[D],u,h));let M=.5-d*d-x*x;return M<0?a=0:(M*=M,a=M*M*this.dot(this.grad3[E],d,x)),70*(i+o+a)}noise3d(e,t,i){let o,a,r,n,l,s,c,v,f,m;let p=1/3*(e+t+i),u=Math.floor(e+p),h=Math.floor(t+p),d=Math.floor(i+p),x=1/6*(u+h+d),g=e-(u-x),w=t-(h-x),P=i-(d-x);g>=w?w>=P?(l=1,s=0,c=0,v=1,f=1,m=0):(g>=P?(l=1,s=0,c=0):(l=0,s=0,c=1),v=1,f=0,m=1):w<P?(l=0,s=0,c=1,v=0,f=1,m=1):g<P?(l=0,s=1,c=0,v=0,f=1,m=1):(l=0,s=1,c=0,v=1,f=1,m=0);let D=g-l+1/6,E=w-s+1/6,S=P-c+1/6,y=g-v+1/6*2,M=w-f+1/6*2,U=P-m+1/6*2,T=g-1+1/6*3,N=w-1+1/6*3,z=P-1+1/6*3,A=255&u,C=255&h,b=255&d,_=this.perm[A+this.perm[C+this.perm[b]]]%12,R=this.perm[A+l+this.perm[C+s+this.perm[b+c]]]%12,V=this.perm[A+v+this.perm[C+f+this.perm[b+m]]]%12,L=this.perm[A+1+this.perm[C+1+this.perm[b+1]]]%12,I=.6-g*g-w*w-P*P;I<0?o=0:(I*=I,o=I*I*this.dot3(this.grad3[_],g,w,P));let O=.6-D*D-E*E-S*S;O<0?a=0:(O*=O,a=O*O*this.dot3(this.grad3[R],D,E,S));let F=.6-y*y-M*M-U*U;F<0?r=0:(F*=F,r=F*F*this.dot3(this.grad3[V],y,M,U));let H=.6-T*T-N*N-z*z;return H<0?n=0:(H*=H,n=H*H*this.dot3(this.grad3[L],T,N,z)),32*(o+a+r+n)}noise4d(e,t,i,o){let a,r,n,l,s;let c=this.grad4,v=this.simplex,f=this.perm,m=(5-Math.sqrt(5))/20,p=(Math.sqrt(5)-1)/4*(e+t+i+o),u=Math.floor(e+p),h=Math.floor(t+p),d=Math.floor(i+p),x=Math.floor(o+p),g=(u+h+d+x)*m,w=e-(u-g),P=t-(h-g),D=i-(d-g),E=o-(x-g),S=(w>P?32:0)+(w>D?16:0)+(P>D?8:0)+(w>E?4:0)+(P>E?2:0)+(D>E?1:0),y=v[S][0]>=3?1:0,M=v[S][1]>=3?1:0,U=v[S][2]>=3?1:0,T=v[S][3]>=3?1:0,N=v[S][0]>=2?1:0,z=v[S][1]>=2?1:0,A=v[S][2]>=2?1:0,C=v[S][3]>=2?1:0,b=v[S][0]>=1?1:0,_=v[S][1]>=1?1:0,R=v[S][2]>=1?1:0,V=v[S][3]>=1?1:0,L=w-y+m,I=P-M+m,O=D-U+m,F=E-T+m,H=w-N+2*m,G=P-z+2*m,B=D-A+2*m,k=E-C+2*m,j=w-b+3*m,W=P-_+3*m,Z=D-R+3*m,Y=E-V+3*m,$=w-1+4*m,X=P-1+4*m,q=D-1+4*m,K=E-1+4*m,J=255&u,Q=255&h,ee=255&d,et=255&x,ei=f[J+f[Q+f[ee+f[et]]]]%32,eo=f[J+y+f[Q+M+f[ee+U+f[et+T]]]]%32,ea=f[J+N+f[Q+z+f[ee+A+f[et+C]]]]%32,er=f[J+b+f[Q+_+f[ee+R+f[et+V]]]]%32,en=f[J+1+f[Q+1+f[ee+1+f[et+1]]]]%32,el=.6-w*w-P*P-D*D-E*E;el<0?a=0:(el*=el,a=el*el*this.dot4(c[ei],w,P,D,E));let es=.6-L*L-I*I-O*O-F*F;es<0?r=0:(es*=es,r=es*es*this.dot4(c[eo],L,I,O,F));let ec=.6-H*H-G*G-B*B-k*k;ec<0?n=0:(ec*=ec,n=ec*ec*this.dot4(c[ea],H,G,B,k));let ev=.6-j*j-W*W-Z*Z-Y*Y;ev<0?l=0:(ev*=ev,l=ev*ev*this.dot4(c[er],j,W,Z,Y));let ef=.6-$*$-X*X-q*q-K*K;return ef<0?s=0:(ef*=ef,s=ef*ef*this.dot4(c[en],$,X,q,K)),27*(a+r+n+l+s)}}},3818:function(e,t,i){i.d(t,{Sp:function(){return a},gs:function(){return r},mF:function(){return n},mK:function(){return l}});var o=i(7785);let a={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new o.FM8},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new o.yGw},cameraProjectionMatrixInverse:{value:new o.yGw},cameraWorldMatrix:{value:new o.yGw},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new o.Pa4(-1,-1,-1)},sceneBoxMax:{value:new o.Pa4(1,1,1)}},vertexShader:`

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
		}`},r={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
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
		}`};function l(e=5){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),i=function(e){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),i=t*t,o=Array(i).fill(0),a=Math.floor(t/2),r=t-1;for(let e=1;e<=i;){if(-1===a&&r===t?(r=t-2,a=0):(r===t&&(r=0),a<0&&(a=t-1)),0!==o[a*t+r]){r-=2,a++;continue}o[a*t+r]=e++,r++,a--}return o}(t),a=i.length,r=new Uint8Array(4*a);for(let e=0;e<a;++e){let t=2*Math.PI*i[e]/a,n=new o.Pa4(Math.cos(t),Math.sin(t),0).normalize();r[4*e]=(.5*n.x+.5)*255,r[4*e+1]=(.5*n.y+.5)*255,r[4*e+2]=127,r[4*e+3]=255}let n=new o.IEO(r,t,t);return n.wrapS=o.rpg,n.wrapT=o.rpg,n.needsUpdate=!0,n}},1244:function(e,t,i){i.d(t,{a:function(){return r},m:function(){return a}});var o=i(7785);let a={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:r(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new o.FM8},cameraProjectionMatrixInverse:{value:new o.yGw},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

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
		}`};function r(e,t,i){let a=function(e,t,i){let a=[];for(let r=0;r<e;r++){let n=2*Math.PI*t*r/e,l=Math.pow(r/(e-1),i);a.push(new o.Pa4(Math.cos(n),Math.sin(n),l))}return a}(e,t,i),r="vec3[SAMPLES](";for(let t=0;t<e;t++){let i=a[t];r+=`vec3(${i.x}, ${i.y}, ${i.z})${t<e-1?",":")"}`}return r}}}]);