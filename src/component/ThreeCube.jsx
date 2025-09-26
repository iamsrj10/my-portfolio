// src/component/ThreeCube.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeCube
 * props:
 *  - size (px) height for the wrapper (width will be 100%)
 *  - playing (bool) whether to animate rotation
 *  - faceTexts: array of 6 strings (front, back, right, left, top, bottom)
 *  - options: { fontColor, bgColor, fontSize } optional appearance
 */
export default function ThreeCube({
  size = 220,
  playing = true,
  faceTexts = ['', '', '', '', '', ''],
  options = {},
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({ running: false, rafId: null });
  const roRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer, scene, camera, cube, geometry, materials;
    let mounted = true;

    const { fontColor = '#ffffff', bgColor = 'rgba(6,18,36,0.08)', fontSize = 64 } = options;

    // Helper to create a texture with text (and optional emoji)
    function createLabelTexture(text = '') {
      // Canvas size (power-of-two-ish comfortable)
      const w = 1024, h = 1024;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');

      // background (slightly translucent so it blends with dark UI)
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      // draw optional emoji at top-left if present (simple heuristic)
      let drawText = text || '';
      const emojiMatch = text.match(/\p{Emoji}/u);
      let emoji = '';
      if (emojiMatch) {
        emoji = emojiMatch[0];
        // remove emoji from main text if it's separate
        drawText = text.replace(emoji, '').trim();
      }

      // center text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = fontColor;

      // emoji big if present
      if (emoji) {
        ctx.font = `bold ${Math.floor(fontSize * 1.6)}px system-ui, Arial`;
        ctx.fillText(emoji, w / 2, h / 2 - fontSize * 0.35);
      }

      // main lines: allow split if long
      ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
      if (drawText.length <= 12) {
        ctx.fillText(drawText, w / 2, h / 2 + (emoji ? fontSize * 0.4 : 0));
      } else {
        // split into two lines
        const mid = Math.ceil(drawText.length / 2);
        const left = drawText.slice(0, mid);
        const right = drawText.slice(mid);
        ctx.fillText(left.trim(), w / 2, h / 2 - (fontSize * 0.2) + (emoji ? fontSize * 0.4 : 0));
        ctx.fillText(right.trim(), w / 2, h / 2 + fontSize * 0.8 + (emoji ? fontSize * 0.4 : 0));
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }

    function createMaterialsFromTexts(texts) {
      const mats = [];
      for (let i = 0; i < 6; i++) {
        const t = texts[i] ?? '';
        const map = createLabelTexture(t);
        mats.push(new THREE.MeshStandardMaterial({ map, roughness: 0.6, metalness: 0.15 }));
      }
      return mats;
    }

    function init(w, h) {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
      camera.position.z = 3.3;

      geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
      materials = createMaterialsFromTexts(faceTexts);
      cube = new THREE.Mesh(geometry, materials);
      scene.add(cube);

      const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9);
      scene.add(hemi);
      const dir = new THREE.DirectionalLight(0xffffff, 0.6);
      dir.position.set(5, 10, 7);
      scene.add(dir);
    }

    function createRenderer(w, h) {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h);
      renderer.domElement.style.display = 'block';
      mount.appendChild(renderer.domElement);
      return renderer;
    }

    function animate() {
      if (!mounted) return;
      if (stateRef.current.running) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.013;
        renderer.render(scene, camera);
      }
      stateRef.current.rafId = requestAnimationFrame(animate);
    }

    function setup() {
      const rect = mount.getBoundingClientRect();
      const w = Math.max(120, Math.floor(rect.width || size));
      const h = Math.max(120, Math.floor(rect.height || size));
      try {
        createRenderer(w, h);
      } catch (err) {
        console.error('ThreeCube renderer failed', err);
        return;
      }
      init(w, h);
      // start RAF loop but only render when running flag is true
      stateRef.current.running = !!playing;
      animate();
    }

    // ResizeObserver: wait until mount has dimensions
    if ('ResizeObserver' in window) {
      roRef.current = new ResizeObserver((entries) => {
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
      roRef.current.observe(mount);
    } else {
      // fallback
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

    const br = mount.getBoundingClientRect();
    if (br.width > 0 && br.height > 0 && !renderer) setup();

    return () => {
      mounted = false;
      stateRef.current.running = false;
      if (stateRef.current.rafId) cancelAnimationFrame(stateRef.current.rafId);
      if (roRef.current) try { roRef.current.disconnect(); } catch (e) {}
      if (renderer && renderer.domElement && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      // dispose resources
      geometry?.dispose && geometry.dispose();
      materials?.forEach(m => { if (m.map) m.map.dispose(); m.dispose && m.dispose(); });
      renderer?.forceContextLoss && renderer.forceContextLoss();
      renderer?.dispose && renderer.dispose();
      scene = null;
      camera = null;
      cube = null;
    };
  }, []); // run once

  // react to playing prop changes
  useEffect(() => {
    stateRef.current.running = !!playing;
  }, [playing]);

  // re-create textures if faceTexts changes (optional: you can extend to actually update materials)
  useEffect(() => {
    // TODO: could implement dynamic texture update without full re-init
    // For now, simplest is to unmount & remount by changing key in parent if you need different face texts.
  }, [faceTexts]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: `${size}px`, display: 'block', touchAction: 'none' }}
      aria-hidden="true"
    />
  );
}
