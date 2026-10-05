import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;

    // 1. Scene & Camera (Light Pink Romantic Dreamscape)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfff0f5, 0.022);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xfff0f5, 1);
    container.appendChild(renderer.domElement);

    // 3. Lighting (Warm Sunlit Peach & Soft Rose)
    const ambientLight = new THREE.AmbientLight(0xffe4e6, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf43f5e, 1.6);
    dirLight1.position.set(12, 16, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xfda4af, 1.2);
    dirLight2.position.set(-10, -10, 8);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xfff1f2, 2.2, 60);
    pointLight.position.set(0, 5, 12);
    scene.add(pointLight);

    // 4. Create 3D Heart Geometry
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 1.0);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeometry.center();

    // Light Pink & Rose Palette
    const colors = [0xf43f5e, 0xfb7185, 0xf472b6, 0xfda4af, 0xffa5ba, 0xffb703];
    const materials = colors.map(
      (c) =>
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: 0.22,
          metalness: 0.28,
          emissive: c,
          emissiveIntensity: 0.08,
        })
    );

    const heartsGroup = new THREE.Group();
    const heartItems: {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      speed: number;
      rotSpeedX: number;
      rotSpeedY: number;
      floatOffset: number;
    }[] = [];

    const heartCount = 28;
    for (let i = 0; i < heartCount; i++) {
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(heartGeometry, mat);

      const scale = 0.6 + Math.random() * 1.4;
      mesh.scale.set(scale, scale, scale);

      const baseX = (Math.random() - 0.5) * 36;
      const baseY = (Math.random() - 0.5) * 28;
      const baseZ = (Math.random() - 0.5) * 16 - 2;

      mesh.position.set(baseX, baseY, baseZ);
      mesh.rotation.x = Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      heartsGroup.add(mesh);
      heartItems.push({
        mesh,
        baseX,
        baseY,
        baseZ,
        speed: 0.3 + Math.random() * 0.6,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        floatOffset: Math.random() * Math.PI * 2,
      });
    }
    scene.add(heartsGroup);

    // 5. Cherry Blossom & Rose Petal Particles
    const petalCount = 300;
    const petalGeometry = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);
    const petalColors = new Float32Array(petalCount * 3);

    const roseColor = new THREE.Color(0xf43f5e);
    const blushColor = new THREE.Color(0xfb7185);
    const goldColor = new THREE.Color(0xfbbf24);

    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3] = (Math.random() - 0.5) * 55;
      petalPositions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const pick = Math.random();
      const col = pick < 0.6 ? blushColor : pick < 0.85 ? roseColor : goldColor;
      petalColors[i * 3] = col.r;
      petalColors[i * 3 + 1] = col.g;
      petalColors[i * 3 + 2] = col.b;
    }

    petalGeometry.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));
    petalGeometry.setAttribute('color', new THREE.BufferAttribute(petalColors, 3));

    const petalMaterial = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.NormalBlending,
    });

    const petalParticles = new THREE.Points(petalGeometry, petalMaterial);
    scene.add(petalParticles);

    // 6. Interactive Mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX * 1.5 - targetX) * 0.03;
      targetY += (mouseY * 1.5 - targetY) * 0.03;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      heartItems.forEach((item) => {
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.rotation.z += item.rotSpeedX;

        const wave = Math.sin(elapsedTime * item.speed + item.floatOffset);
        item.mesh.position.y = item.baseY + wave * 0.8;
        item.mesh.position.x = item.baseX + Math.cos(elapsedTime * 0.4 + item.floatOffset) * 0.4;
      });

      petalParticles.rotation.y = elapsedTime * 0.02;
      petalParticles.rotation.x = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      heartGeometry.dispose();
      petalGeometry.dispose();
      petalMaterial.dispose();
      materials.forEach((m) => m.dispose());
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-95 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
