"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from "next-themes";

export function HeroAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // NOUVEAU : État pour gérer l'apparition en douceur
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- CONFIGURATION ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    const globeColor = isDark ? 0x34d399 : 0x059669;
    const starColor = isDark ? 0xffffff : 0x065f46;
    const linesOpacity = isDark ? 0.3 : 0.2;

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // --- SCÈNE ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 18; 

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: "high-performance" 
    });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- GLOBE (Points) ---
    const particlesCount = 180; 
    const positions = new Float32Array(particlesCount * 3);
    const radius = 9;

    for (let i = 0; i < particlesCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particlesCount);
      const theta = Math.sqrt(particlesCount * Math.PI) * phi;
      
      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: globeColor,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
    });
    const points = new THREE.Points(geometry, material);

    // --- LIGNES ---
    const lineMaterial = new THREE.LineBasicMaterial({
      color: globeColor,
      transparent: true,
      opacity: linesOpacity,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const pPos = geometry.attributes.position.array as Float32Array;
    const linePositions: number[] = [];

    for (let i = 0; i < particlesCount; i++) {
      for (let j = i + 1; j < particlesCount; j++) {
        const dist = Math.sqrt(
          Math.pow(pPos[i*3] - pPos[j*3], 2) +
          Math.pow(pPos[i*3+1] - pPos[j*3+1], 2) +
          Math.pow(pPos[i*3+2] - pPos[j*3+2], 2)
        );

        if (dist < 4.5) {
          linePositions.push(
            pPos[i*3], pPos[i*3+1], pPos[i*3+2],
            pPos[j*3], pPos[j*3+1], pPos[j*3+2]
          );
        }
      }
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);

    const globeGroup = new THREE.Group();
    globeGroup.add(points);
    globeGroup.add(lineSegments);
    scene.add(globeGroup);

    // --- ÉTOILES ---
    const starsCount = 150;
    const starsPositions = new Float32Array(starsCount * 3);
    
    for(let i=0; i<starsCount; i++) {
        starsPositions[i*3] = (Math.random() - 0.5) * 40;
        starsPositions[i*3+1] = (Math.random() - 0.5) * 40;
        starsPositions[i*3+2] = (Math.random() - 0.5) * 40;
    }
    
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: starColor, size: 0.08, transparent: true, opacity: 0.6 });
    const starsMesh = new THREE.Points(starsGeo, starsMat);
    scene.add(starsMesh);

    // --- ANIMATION LOOP ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      globeGroup.rotation.y += 0.002;
      globeGroup.rotation.x += 0.0005;
      starsMesh.rotation.y -= 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    // NOUVEAU : On déclenche l'affichage APRÈS l'initialisation
    // On laisse un petit délai (100ms) pour être sûr que la première frame est peinte
    const timer = setTimeout(() => {
        setIsMounted(true);
    }, 100);

    const handleResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer); // Nettoyage du timer
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div 
      ref={mountRef} 
      // NOUVEAU : Gestion des classes CSS pour l'opacité
      // 1. "opacity-0" au départ
      // 2. "opacity-60" (ton réglage) une fois monté
      // 3. "transition-opacity duration-1000" pour que le changement prenne 1 seconde (fondu)
      className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none transition-opacity duration-1000 ease-in-out ${
        isMounted ? "opacity-60" : "opacity-0"
      }`}
      aria-hidden="true"
    />
  );
}