import{l as y,n as w,U as x,X as S,Y as b,i as A,b as g}from"./three-B6tZXdR3.js";const C=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,T=`
  uniform float uTime, uSeed, uAmt, uSpread;
  uniform vec3 uColor;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < OCTAVES; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; } return v; }
  void main() {
    float y = vUv.y;
    float t = uTime;
    // The column drifts and curls sideways as it rises.
    float sway = (fbm(vec2(y * 1.4 - t * 0.22, uSeed)) - 0.5) * 0.75 * y;
    float x = vUv.x - 0.5 - sway;
    float width = mix(0.05, uSpread, smoothstep(0.0, 0.9, y));
    float column = exp(-(x * x) / (width * width));
    // Warp the noise by itself for wispy filaments.
    vec2 q = vec2(vUv.x * 2.4 + uSeed, y * 2.2 - t * 0.5);
  #ifdef WARP
    vec2 w = vec2(fbm(q + vec2(0.0, t * 0.1)), fbm(q + vec2(5.2, 1.3)));
    float n = fbm(q + 1.6 * w);
  #else
    float n = fbm(q + vec2(noise(q * 1.7 + t * 0.2), 0.0) * 0.8); // lite: one cheap warp instead of two fbm calls
  #endif
    float wisps = smoothstep(0.42, 0.9, n);
    float fade = smoothstep(0.0, 0.1, y) * (1.0 - smoothstep(0.4, 1.0, y));
    float a = column * wisps * fade * uAmt;
    gl_FragColor = vec4(uColor * a, a * 0.8); // premultiplied, a touch additive
  }
`;function O(u,v=5,{lite:c=!1}={}){const f=new y(1,1,1,1);f.translate(0,.5,0);const r=Array.from({length:v},(a,t)=>{const i=new w({vertexShader:C,fragmentShader:T,defines:c?{OCTAVES:3}:{OCTAVES:5,WARP:1},uniforms:{uTime:{value:0},uSeed:{value:t*3.17+.5},uAmt:{value:0},uSpread:{value:.3},uColor:{value:new A("#fff4ea")}},transparent:!0,depthWrite:!1,blending:b,blendSrc:S,blendDst:x}),o=new g(f,i);return o.renderOrder=10,o.frustumCulled=!1,o.userData.i=t,u.add(o),o});function d(a,t,i,o,p,l,h){r.forEach((e,s)=>{const n=i[s%i.length];e.position.copy(n),e.rotation.set(0,Math.atan2(t.position.x-n.x,t.position.z-n.z),0),e.scale.set(p*(.85+.3*(s*.37%1)),o*(.8+.4*(s*.61%1)),1),e.material.uniforms.uTime.value=a*(.9+.15*s),e.material.uniforms.uAmt.value=l,e.material.uniforms.uSpread.value=h,e.visible=l>.002&&!e.userData.off})}function m(){r.forEach((a,t)=>{a.material.defines={OCTAVES:3},a.material.needsUpdate=!0,t>=3&&(a.userData.off=!0,a.visible=!1)})}return{planes:r,update:d,setLite:m}}export{O as c};
