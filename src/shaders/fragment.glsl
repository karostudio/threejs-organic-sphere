varying vec3 vNormal;
varying vec2 vUv;
varying float vDis;
varying vec3 vPositionW;
varying vec3 vNormalW;

uniform float uProgress;


void main(){
    vec3 color = vec3(smoothstep(.1,.3,1.), mix(.1, vDis * .3, .35),0.);
    float fresnelTerm = ( 1.0 - -min(dot(vPositionW , normalize(vNormalW) ), 0.0) );    
    vec4 finalColor = vec4(color,min(smoothstep(0.,0.1,vUv.y - .58 + uProgress / 3.),1.)) * (1.1 - vec4(fresnelTerm));
    if(vDis < 0.){
        color = vec3(0., 0., .0);
        finalColor = vec4(color,1.);
    }
    
    gl_FragColor = finalColor;
}
