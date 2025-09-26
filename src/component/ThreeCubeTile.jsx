// src/component/ThreeCubeTile.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeCubeTile
 * Props:
 *  - size: pixel height/width of the cube canvas (will be sized to parent)
 *  - playing: boolean -> whether the cube should animate
 *  - faceTexts: array of 6 strings for cube faces (optional)
 */
export default function ThreeCubeTile({ size = 160, playing = false, faceTexts = [] }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ running: false, rafId: null });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer, scene, camera, cube, geometry, materials;
    let mounted = true;

    // helper to create a canvas texture from text
    const createTextTexture = (text = '', opts = {}) => {
      const { w = 512, h = 512, bg = 'rgba(6,18,36,0.06)', color = '#A78BFA', fontSize = 80 } = opts;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;

      // support short/long text: break to two lines if necessary
      const words = String(text).split(' ');
      if (words.length <= 2 || text.length < 10) {
        ctx.fillText(text, w/2, h/2);
      } else {
        const mid = Math.ceil(words.length / 2);
        ctx.fillText(words.slice(0, mid).join(' '), w/2, h/2 - fontSize/3);
        ctx.fillText(words.slice(mid).join(' '), w/2, h/2 + fontSize/2);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    };

    const createMaterials = (faceTextsLocal) => {
      // ensure 6 materials
      const arr = [];
      for (let i = 0; i < 6; i++) {
        const t = faceTextsLocal && faceTextsLocal[i] ? faceTextsLocal[i] : '';
        const map = createTextTexture(t, { fontSize: 64, color: '#fff', bg: 'rgba(10,20,36,0.35)' });
        arr.push(new THREE.MeshStandardMaterial({ map, roughness: 0.6, metalness: 0.2 }));
      }
      return arr;
    };

    const init = (w, h, faceTextsLocal = []) => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
      camera.position.z = 3.0;

      geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      materials = createMaterials(faceTextsLocal);
      cube = new THREE.Mesh(geometry, materials);
      scene.add(cube);

      const ambient = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambient);
      const dir = new THREE.DirectionalLight(0xffffff, 0.6);
      dir.position.set(5, 10, 7);
      scene.add(dir);
    };

    const createRenderer = (w, h) => {
      if (renderer) {
        try { renderer.forceContextLoss(); } catch (e) {}
        renderer.dispose && renderer.dispose();
      }
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h);
      renderer.domElement.style.display = 'block';
      mount.appendChild(renderer.domElement);
      return renderer;
    };

    const animate = () => {
      if (!mounted) return;
      // only rotate when running
      if (stateRef.current.running) {
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.03;
        renderer.render(scene, camera);
      }
      stateRef.current.rafId = requestAnimationFrame(animate);
    };

    const setup = () => {
      const rect = mount.getBoundingClientRect();
      const w = Math.max(120, Math.floor(rect.width || size));
      const h = Math.max(120, Math.floor(rect.height || size));
      renderer = createRenderer(w, h);
      init(w, h, faceTexts);
      stateRef.current.running = !!playing;
      animate();
    };

    // use ResizeObserver so cube only starts once parent has size
    let ro;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver((entries) => {
        const cr = entries[0].contentRect;
        if (!renderer && cr.width > 0 && cr.height > 0) {
          setup();
          return;
        }
        if (renderer && camera) {
          const w = Math.max(120, Math.floor(cr.width));
          const h = Math.max(120, Math.floor(cr.height || size));
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }
      });
      ro.observe(mount);
    } else {
      setTimeout(setup, 120);
      window.addEventListener('resize', () => {
        if (renderer && camera) {
          const w = mount.clientWidth || size;
          const h = mount.clientHeight || size;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }
      });
    }

    // immediate attempt
    const br = mount.getBoundingClientRect();
    if (br.width > 0 && br.height > 0 && !renderer) setup();

    return () => {
      mounted = false;
      stateRef.current.running = false;
      if (stateRef.current.rafId) cancelAnimationFrame(stateRef.current.rafId);
      if (ro) try { ro.disconnect(); } catch (e) {}
      if (renderer && renderer.domElement && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      geometry?.dispose && geometry.dispose();
      (materials || []).forEach(m => m.map && m.map.dispose());
      (materials || []).forEach(m => m.dispose && m.dispose());
      renderer?.forceContextLoss && renderer.forceContextLoss();
      renderer?.dispose && renderer.dispose();
      scene = null;
      camera = null;
      cube = null;
    };
  }, [faceTexts, size]); // recreate textures if faceTexts changes

  // toggle running when `playing` prop changes
  useEffect(() => {
    stateRef.current.running = !!playing;
  }, [playing]);

  return <div ref={mountRef} style={{ width: '100%', height: `${size}px'` }} />;
}
