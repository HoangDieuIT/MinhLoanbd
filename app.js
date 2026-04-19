// ============================================
// APP.JS - Birthday Card: Starfield + Planets + Hearts
// ============================================
(function () {
  'use strict';

  // ---- THREE.JS: Dense Starfield + Planets ----
  function initUniverse() {
    const canvas = document.getElementById('universe-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 50;

    // --- Dense starfield (small stars) ---
    const starCount = 2500;
    const starsGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 300;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 300;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 300;
      // Pink/white/gold tones
      const t = Math.random();
      if (t < 0.5) { // white
        starCol[i * 3] = 0.9 + Math.random() * 0.1;
        starCol[i * 3 + 1] = 0.85 + Math.random() * 0.15;
        starCol[i * 3 + 2] = 0.95 + Math.random() * 0.05;
      } else if (t < 0.8) { // pink
        starCol[i * 3] = 0.95 + Math.random() * 0.05;
        starCol[i * 3 + 1] = 0.5 + Math.random() * 0.3;
        starCol[i * 3 + 2] = 0.7 + Math.random() * 0.2;
      } else { // gold
        starCol[i * 3] = 1.0;
        starCol[i * 3 + 1] = 0.75 + Math.random() * 0.2;
        starCol[i * 3 + 2] = 0.2 + Math.random() * 0.3;
      }
      starSizes[i] = 0.06 + Math.random() * 0.12;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.1, vertexColors: true, transparent: true, opacity: 0.85,
      sizeAttenuation: true
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // --- Twinkling layer (very small, flicker) ---
    const twinkleCount = 800;
    const twinkleGeo = new THREE.BufferGeometry();
    const twinklePos = new Float32Array(twinkleCount * 3);
    for (let i = 0; i < twinkleCount; i++) {
      twinklePos[i * 3] = (Math.random() - 0.5) * 250;
      twinklePos[i * 3 + 1] = (Math.random() - 0.5) * 250;
      twinklePos[i * 3 + 2] = (Math.random() - 0.5) * 250;
    }
    twinkleGeo.setAttribute('position', new THREE.BufferAttribute(twinklePos, 3));
    const twinkleMat = new THREE.PointsMaterial({
      size: 0.04, color: 0xffffff, transparent: true, opacity: 0.5
    });
    const twinkles = new THREE.Points(twinkleGeo, twinkleMat);
    scene.add(twinkles);

    // --- Beautiful planets ---
    const planets = [];

    // Planet 1: Pink gas giant with ring
    const p1Geo = new THREE.SphereGeometry(3, 32, 32);
    const p1Mat = new THREE.MeshBasicMaterial({
      color: 0xff6b9d, transparent: true, opacity: 0.25, wireframe: false
    });
    const planet1 = new THREE.Mesh(p1Geo, p1Mat);
    planet1.position.set(-40, 20, -60);
    scene.add(planet1);
    // Ring around planet
    const ring1Geo = new THREE.TorusGeometry(5, 0.15, 16, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xffb6d5, transparent: true, opacity: 0.2 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.position.copy(planet1.position);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);
    planets.push({ mesh: planet1, ring: ring1, speed: 0.003, orbitRadius: 0 });

    // Planet 2: Golden planet
    const p2Geo = new THREE.SphereGeometry(2, 32, 32);
    const p2Mat = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.2 });
    const planet2 = new THREE.Mesh(p2Geo, p2Mat);
    planet2.position.set(45, -15, -50);
    scene.add(planet2);
    // Glow ring
    const ring2Geo = new THREE.TorusGeometry(3.5, 0.1, 16, 60);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.15 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.copy(planet2.position);
    ring2.rotation.x = Math.PI / 4;
    scene.add(ring2);
    planets.push({ mesh: planet2, ring: ring2, speed: 0.004, orbitRadius: 0 });

    // Planet 3: Small purple planet
    const p3Geo = new THREE.SphereGeometry(1.5, 24, 24);
    const p3Mat = new THREE.MeshBasicMaterial({ color: 0xc77dff, transparent: true, opacity: 0.2 });
    const planet3 = new THREE.Mesh(p3Geo, p3Mat);
    planet3.position.set(30, 30, -70);
    scene.add(planet3);
    planets.push({ mesh: planet3, speed: 0.005, orbitRadius: 0 });

    // Planet 4: Tiny rose planet far away
    const p4Geo = new THREE.SphereGeometry(1, 20, 20);
    const p4Mat = new THREE.MeshBasicMaterial({ color: 0xff4d6d, transparent: true, opacity: 0.18 });
    const planet4 = new THREE.Mesh(p4Geo, p4Mat);
    planet4.position.set(-30, -25, -80);
    scene.add(planet4);
    planets.push({ mesh: planet4, speed: 0.002, orbitRadius: 0 });

    // --- Nebula glow (big translucent sphere) ---
    const nebulaGeo = new THREE.SphereGeometry(80, 32, 32);
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: 0x2d0a1e, transparent: true, opacity: 0.03, side: THREE.BackSide
    });
    scene.add(new THREE.Mesh(nebulaGeo, nebulaMat));

    // --- Floating 3D hearts in the scene ---
    const heartMeshes = [];
    for (let i = 0; i < 8; i++) {
      const hs = new THREE.Shape();
      const s = 0.3 + Math.random() * 0.5;
      hs.moveTo(0, s * 0.7);
      hs.bezierCurveTo(0, s, -s * 0.5, s * 1.4, -s, s * 1.4);
      hs.bezierCurveTo(-s * 2, s * 1.4, -s * 2, s * 0.5, -s * 2, s * 0.5);
      hs.bezierCurveTo(-s * 2, -s * 0.2, -s, -s * 0.8, 0, -s * 1.4);
      hs.bezierCurveTo(s, -s * 0.8, s * 2, -s * 0.2, s * 2, s * 0.5);
      hs.bezierCurveTo(s * 2, s * 0.5, s * 2, s * 1.4, s, s * 1.4);
      hs.bezierCurveTo(s * 0.5, s * 1.4, 0, s, 0, s * 0.7);
      const hGeo = new THREE.ShapeGeometry(hs);
      const hue = 0.93 + Math.random() * 0.07;
      const hMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, 0.8, 0.6),
        transparent: true, opacity: 0.08 + Math.random() * 0.1,
        side: THREE.DoubleSide
      });
      const hMesh = new THREE.Mesh(hGeo, hMat);
      hMesh.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        -20 - Math.random() * 60
      );
      hMesh.userData = {
        baseY: hMesh.position.y,
        floatSpeed: 0.5 + Math.random() * 1.5,
        floatAmp: 2 + Math.random() * 5,
        rotSpeed: 0.005 + Math.random() * 0.01
      };
      scene.add(hMesh);
      heartMeshes.push(hMesh);
    }

    let time = 0;
    let scrollY = 0;

    window.addEventListener('scroll', () => {
      scrollY = window.pageYOffset || document.documentElement.scrollTop;
    });

    function animate() {
      requestAnimationFrame(animate);
      time += 0.004;

      // Stars gentle rotation
      stars.rotation.y = time * 0.15;
      stars.rotation.x = Math.sin(time * 0.5) * 0.05;

      // Twinkle opacity
      twinkleMat.opacity = 0.3 + Math.sin(time * 3) * 0.2;
      twinkles.rotation.y = -time * 0.08;

      // Planets gentle bob
      planets.forEach((p, i) => {
        p.mesh.position.y += Math.sin(time * (1 + i * 0.3)) * 0.01;
        p.mesh.rotation.y = time * p.speed * 50;
        if (p.ring) {
          p.ring.position.y = p.mesh.position.y;
          p.ring.rotation.z = time * 0.5;
        }
      });

      // Hearts float
      heartMeshes.forEach(h => {
        const d = h.userData;
        h.position.y = d.baseY + Math.sin(time * d.floatSpeed) * d.floatAmp;
        h.rotation.z = Math.sin(time * d.rotSpeed * 50) * 0.3;
      });

      // Camera parallax with scroll
      const scrollFraction = scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      camera.position.y = -scrollFraction * 15;
      camera.position.z = 50 - scrollFraction * 10;
      camera.rotation.x = scrollFraction * 0.05;

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ---- INTRO SPARKLES (pink particles) ----
  function createIntroSparkles() {
    const container = document.getElementById('intro-sparkles');
    if (!container) return;
    for (let i = 0; i < 40; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      const size = 2 + Math.random() * 7;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.animationDelay = Math.random() * 5 + 's';
      s.style.animationDuration = (3 + Math.random() * 4) + 's';
      container.appendChild(s);
    }
  }

  // ---- DOOR OPEN ----
  function setupDoorOpen() {
    const btn = document.getElementById('open-btn');
    const overlay = document.getElementById('intro-overlay');
    const doorL = document.getElementById('door-left');
    const doorR = document.getElementById('door-right');
    const main = document.getElementById('main-content');
    const introContent = document.getElementById('intro-content');

    btn.addEventListener('click', () => {
      // Play music
      const audio = document.getElementById('bg-music');
      if (audio) {
        audio.play().catch(e => console.log('Audio play blocked:', e));
        document.getElementById('music-toggle').classList.add('playing');
        document.getElementById('music-toggle').textContent = '🎶';
      }

      introContent.style.transition = 'opacity 0.5s ease';
      introContent.style.opacity = '0';
      setTimeout(() => {
        doorL.classList.add('open');
        doorR.classList.add('open');
      }, 300);
      setTimeout(() => {
        main.classList.add('visible');
        startFloatingHearts();
      }, 900);
      setTimeout(() => {
        overlay.classList.add('hidden');
        setTimeout(() => { overlay.style.display = 'none'; }, 1000);
      }, 1600);
    });
  }

  // ---- FLOATING HEARTS (many, in hero area) ----
  function startFloatingHearts() {
    const hearts = ['❤️', '💕', '💖', '🩷', '💗', '💓', '🤍', '✨', '🌸', '💘'];
    // Create hearts in hero section and globally
    function spawnHeart() {
      const h = document.createElement('span');
      h.className = 'floating-heart';
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      h.style.left = Math.random() * 100 + '%';
      h.style.fontSize = (10 + Math.random() * 22) + 'px';
      h.style.animationDuration = (3 + Math.random() * 5) + 's';
      h.style.animationDelay = Math.random() * 1 + 's';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 10000);
    }
    // Initial burst
    for (let i = 0; i < 15; i++) {
      setTimeout(spawnHeart, i * 150);
    }
    // Ongoing
    setInterval(spawnHeart, 400);
  }

  // ---- SCROLL PROGRESS BAR ----
  function setupScrollProgress() {
    const bar = document.getElementById('scroll-bar');
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    });
  }

  // ---- SCROLL REVEAL ANIMATIONS ----
  function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay * 180);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.wish-card, .planet-photo-frame, .planet-text, .zigzag-row, .heart-connector').forEach(el => {
      observer.observe(el);
    });
  }

  // ---- MUSIC TOGGLE ----
  function setupMusic() {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    btn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(e => console.log('Audio:', e));
        btn.classList.add('playing');
        btn.textContent = '🎶';
      } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.textContent = '🎵';
      }
    });
  }

  // ---- CSS for floating hearts (inject) ----
  function injectHeartCSS() {
    const style = document.createElement('style');
    style.textContent = `
      .floating-heart {
        position: fixed;
        bottom: -30px;
        z-index: 5;
        pointer-events: none;
        opacity: 0;
        animation: riseHeart linear forwards;
      }
      @keyframes riseHeart {
        0% { transform: translateY(0) rotate(0deg) scale(0.5); opacity: 0; }
        8% { opacity: 0.9; transform: translateY(-10vh) rotate(15deg) scale(1); }
        50% { opacity: 0.6; }
        100% { transform: translateY(-105vh) rotate(360deg) scale(0.3); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // ---- INIT ----
  document.addEventListener('DOMContentLoaded', () => {
    injectHeartCSS();
    initUniverse();
    createIntroSparkles();
    setupDoorOpen();
    setupScrollProgress();
    setupScrollReveal();
    setupMusic();
  });
})();
