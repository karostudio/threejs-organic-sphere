import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import FragmentShader from './shaders/fragment.glsl';
import VertexShader from './shaders/vertex.glsl';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

export default class App{
    constructor(){
        this.setTime();
        this.setScene();
        this.setCamera();
        this.setRenderer();
        this.setModel();
        this.setOrbitControls();
        this.handleResize();
        this.setWheelListener();
        this.progress = 0;
        this.bloomStrength = 1.2;

        this.initScrollEvents();

        this.update();
    }
    initScrollEvents(){
        gsap.registerPlugin(ScrollTrigger);
        const name = document.querySelector('#introduction p');
        const title = document.querySelector('#introduction h3');
        gsap.fromTo(title,{
            y:-200,
            opacity:0,
        },{
            y:0,
            opacity:1,
            y:-50,
            scrollTrigger:{
                scrub:5,
                trigger:document.getElementById('introduction'),
                start:'top center',
                end:'bottom bottom',
            }
        });
        gsap.fromTo(name,{
            opacity:0,
            scale:.5,
        },{
            scale:1.5,
            opacity:1,
            scrollTrigger:{
                scrub: 3,
                start:'top center',
                end:'bottom bottom',
                trigger:document.getElementById('introduction')
            }
        });
    }
    setWheelListener(){
        window.addEventListener('scroll',(e) => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.scrollHeight;
            const progress = (scrollTop / (documentHeight - windowHeight)) * 1.01;
            this.progress = progress;
        });
    }
    setTime(){
        this.elapsedTime = 0;
    }
    handleResize(){
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }
    setOrbitControls(){
        this.orbitControls = new OrbitControls(this.camera,this.renderer.domElement);
    }
    setScene(){
        this.scene = new THREE.Scene();
    }
    setCamera(){
        this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.001,1000);
        this.camera.position.z = 1;
    }
    setRenderer(){
        this.renderer = new THREE.WebGLRenderer({
            antialias:true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        document.getElementById("canvas-container").appendChild(this.renderer.domElement);

        this.composer = new EffectComposer( this.renderer );
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.bloomPass = new UnrealBloomPass(0,this.bloomStrength,1);

        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.bloomPass);

    }
    setModel(){
        this.geometry = new THREE.SphereGeometry(.5,512,512);
        this.material = new THREE.ShaderMaterial({
            uniforms:{
                uTime: { 
                    value: 10,
                    type: 'f' 
                },
                uProgress: {value:0, type:'f'}
            },
            side:THREE.DoubleSide,
            vertexShader: VertexShader,
            fragmentShader: FragmentShader,
            transparent:true
        });
        this.model = new THREE.Points(this.geometry,this.material);
        this.model.position.y = -.5;

        this.scene.add(this.model);
    }
    update(){
        this.elapsedTime += 0.001;
        // this.renderer.render(this.scene,this.camera);
        // this.model.rotation.y += 0.0005;
        this.model.position.y = -.5 + this.progress * .5;
        this.bloomStrength = 1.2 + (this.progress * 5);
        this.bloomPass.strength = this.bloomStrength;
        
        this.material.uniforms.uTime.value = this.elapsedTime;
        this.material.uniforms.uProgress.value = this.progress;
        
        this.composer.render();
        requestAnimationFrame(this.update.bind(this));
    }
}
