/**
 * Spectral ghost hero — Three.js scene with bloom + analog-decay post FX.
 * Adapted from the "Spectral Ghost" CodePen (MIT): Tweakpane removed,
 * values frozen at the chosen preset, colors rebranded, rendering pauses
 * off-screen, and everything sizes to its container instead of the window.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const CONFIG = {
	bodyColor: 0x0f2027,
	glowColor: 0xc08552, // camel
	eyeGlowColor: 0xfff8f0, // cream
	particleColor: 0xc08552,
	fireflyColor: 0xffe08a,
	ghostOpacity: 0.88,
	emissiveIntensity: 5.8,
	pulseSpeed: 1.6,
	pulseIntensity: 0.6,
	eyeGlowDecay: 0.95,
	eyeGlowResponse: 0.31,
	rimLightIntensity: 1.8,
	followSpeed: 0.075,
	wobbleAmount: 0.35,
	floatSpeed: 1.6,
	movementThreshold: 0.07,
	particleCount: 250,
	particleDecayRate: 0.005,
	particleCreationRate: 5,
	revealRadius: 43,
	fadeStrength: 2.2,
	baseOpacity: 0.35,
	revealOpacity: 0.0,
	fireflyCount: 20,
	fireflyGlowIntensity: 2.6,
	fireflySpeed: 0.04,
	analog: {
		intensity: 0.6,
		grain: 0.4,
		bleeding: 1.0,
		vsync: 1.0,
		scanlines: 1.0,
		vignette: 1.0,
		jitter: 0.4,
	},
};

const analogDecayShader = {
	uniforms: {
		tDiffuse: { value: null },
		uTime: { value: 0.0 },
		uAnalogGrain: { value: CONFIG.analog.grain },
		uAnalogBleeding: { value: CONFIG.analog.bleeding },
		uAnalogVSync: { value: CONFIG.analog.vsync },
		uAnalogScanlines: { value: CONFIG.analog.scanlines },
		uAnalogVignette: { value: CONFIG.analog.vignette },
		uAnalogJitter: { value: CONFIG.analog.jitter },
		uAnalogIntensity: { value: CONFIG.analog.intensity },
	},
	vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,
	fragmentShader: `
		uniform sampler2D tDiffuse;
		uniform float uTime;
		uniform float uAnalogGrain;
		uniform float uAnalogBleeding;
		uniform float uAnalogVSync;
		uniform float uAnalogScanlines;
		uniform float uAnalogVignette;
		uniform float uAnalogJitter;
		uniform float uAnalogIntensity;

		varying vec2 vUv;

		float random(vec2 st) {
			return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
		}

		float gaussian(float z, float u, float o) {
			return (1.0 / (o * sqrt(2.0 * 3.1415))) * exp(-(((z - u) * (z - u)) / (2.0 * (o * o))));
		}

		vec3 grain(vec2 uv, float time, float intensity) {
			float seed = dot(uv, vec2(12.9898, 78.233));
			float noise = fract(sin(seed) * 43758.5453 + time * 2.0);
			noise = gaussian(noise, 0.0, 0.5 * 0.5);
			return vec3(noise) * intensity;
		}

		void main() {
			vec2 uv = vUv;
			float time = uTime * 1.8;

			vec2 jitteredUV = uv;
			if (uAnalogJitter > 0.01) {
				float jitterAmount = (random(vec2(floor(time * 60.0))) - 0.5) * 0.003 * uAnalogJitter * uAnalogIntensity;
				jitteredUV.x += jitterAmount;
				jitteredUV.y += (random(vec2(floor(time * 30.0) + 1.0)) - 0.5) * 0.001 * uAnalogJitter * uAnalogIntensity;
			}

			if (uAnalogVSync > 0.01) {
				float vsyncRoll = sin(time * 2.0 + uv.y * 100.0) * 0.02 * uAnalogVSync * uAnalogIntensity;
				float vsyncChance = step(0.95, random(vec2(floor(time * 4.0))));
				jitteredUV.y += vsyncRoll * vsyncChance;
			}

			vec4 color = texture2D(tDiffuse, jitteredUV);

			if (uAnalogBleeding > 0.01) {
				float bleedAmount = 0.012 * uAnalogBleeding * uAnalogIntensity;
				float offsetPhase = time * 1.5 + uv.y * 20.0;
				vec2 redOffset = vec2(sin(offsetPhase) * bleedAmount, 0.0);
				vec2 blueOffset = vec2(-sin(offsetPhase * 1.1) * bleedAmount * 0.8, 0.0);
				float r = texture2D(tDiffuse, jitteredUV + redOffset).r;
				float g = texture2D(tDiffuse, jitteredUV).g;
				float b = texture2D(tDiffuse, jitteredUV + blueOffset).b;
				color = vec4(r, g, b, color.a);
			}

			if (uAnalogGrain > 0.01) {
				vec3 grainEffect = grain(uv, time, 0.075 * uAnalogGrain * uAnalogIntensity);
				grainEffect *= (1.0 - color.rgb);
				color.rgb += grainEffect;
			}

			if (uAnalogScanlines > 0.01) {
				float scanlineFreq = 600.0 + uAnalogScanlines * 400.0;
				float scanlinePattern = sin(uv.y * scanlineFreq) * 0.5 + 0.5;
				float scanlineIntensity = 0.1 * uAnalogScanlines * uAnalogIntensity;
				color.rgb *= (1.0 - scanlinePattern * scanlineIntensity);
				float horizontalLines = sin(uv.y * scanlineFreq * 0.1) * 0.02 * uAnalogScanlines * uAnalogIntensity;
				color.rgb *= (1.0 - horizontalLines);
			}

			if (uAnalogVignette > 0.01) {
				vec2 vignetteUV = (uv - 0.5) * 2.0;
				float vignette = 1.0 - dot(vignetteUV, vignetteUV) * 0.3 * uAnalogVignette * uAnalogIntensity;
				color.rgb *= vignette;
			}

			gl_FragColor = color;
		}
	`,
};

export function initHeroGhost(container) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return null;
	}

	let renderer;
	try {
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: 'high-performance',
			alpha: true,
			premultipliedAlpha: false,
			stencil: false,
		});
	} catch {
		return null; // No WebGL: the CSS-only hero still works.
	}

	const width = () => container.clientWidth;
	const height = () => container.clientHeight;

	const scene = new THREE.Scene();
	scene.background = null;

	const camera = new THREE.PerspectiveCamera(75, width() / height(), 0.1, 1000);
	camera.position.z = 20;

	renderer.setSize(width(), height());
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.9;
	renderer.setClearColor(0x000000, 0);
	container.appendChild(renderer.domElement);

	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));

	const bloomPass = new UnrealBloomPass(new THREE.Vector2(width(), height()), 0.3, 1.25, 0.0);
	composer.addPass(bloomPass);

	const analogDecayPass = new ShaderPass(analogDecayShader);
	composer.addPass(analogDecayPass);
	composer.addPass(new OutputPass());

	// Atmosphere plane the ghost "reveals" as it moves
	const atmosphereMaterial = new THREE.ShaderMaterial({
		uniforms: {
			ghostPosition: { value: new THREE.Vector3(0, 0, 0) },
			revealRadius: { value: CONFIG.revealRadius },
			fadeStrength: { value: CONFIG.fadeStrength },
			baseOpacity: { value: CONFIG.baseOpacity },
			revealOpacity: { value: CONFIG.revealOpacity },
			time: { value: 0 },
		},
		vertexShader: `
			varying vec3 vWorldPosition;
			void main() {
				vec4 worldPos = modelMatrix * vec4(position, 1.0);
				vWorldPosition = worldPos.xyz;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform vec3 ghostPosition;
			uniform float revealRadius;
			uniform float fadeStrength;
			uniform float baseOpacity;
			uniform float revealOpacity;
			uniform float time;
			varying vec3 vWorldPosition;

			void main() {
				float dist = distance(vWorldPosition.xy, ghostPosition.xy);
				float dynamicRadius = revealRadius + sin(time * 2.0) * 5.0;
				float reveal = smoothstep(dynamicRadius * 0.2, dynamicRadius, dist);
				reveal = pow(reveal, fadeStrength);
				float opacity = mix(revealOpacity, baseOpacity, reveal);
				gl_FragColor = vec4(0.001, 0.001, 0.002, opacity);
			}
		`,
		transparent: true,
		depthWrite: false,
	});
	const atmosphere = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), atmosphereMaterial);
	atmosphere.position.z = -50;
	atmosphere.renderOrder = -100;
	scene.add(atmosphere);

	scene.add(new THREE.AmbientLight(0x0a0a2e, 0.08));

	const ghostGroup = new THREE.Group();
	scene.add(ghostGroup);

	// Ghost body with organic wavy bottom
	const ghostGeometry = new THREE.SphereGeometry(2, 40, 40);
	const positions = ghostGeometry.getAttribute('position').array;
	for (let i = 0; i < positions.length; i += 3) {
		if (positions[i + 1] < -0.2) {
			const x = positions[i];
			const z = positions[i + 2];
			const noise = Math.sin(x * 5) * 0.35 + Math.cos(z * 4) * 0.25 + Math.sin((x + z) * 3) * 0.15;
			positions[i + 1] = -2.0 + noise;
		}
	}
	ghostGeometry.computeVertexNormals();

	const ghostMaterial = new THREE.MeshStandardMaterial({
		color: CONFIG.bodyColor,
		transparent: true,
		opacity: CONFIG.ghostOpacity,
		emissive: CONFIG.glowColor,
		emissiveIntensity: CONFIG.emissiveIntensity,
		roughness: 0.02,
		metalness: 0.0,
		side: THREE.DoubleSide,
		alphaTest: 0.1,
	});
	const ghostBody = new THREE.Mesh(ghostGeometry, ghostMaterial);
	ghostGroup.add(ghostBody);

	const rimLight1 = new THREE.DirectionalLight(0x4a90e2, CONFIG.rimLightIntensity);
	rimLight1.position.set(-8, 6, -4);
	scene.add(rimLight1);
	const rimLight2 = new THREE.DirectionalLight(0x50e3c2, CONFIG.rimLightIntensity * 0.7);
	rimLight2.position.set(8, -4, -6);
	scene.add(rimLight2);

	// Eyes: black sockets + glow spheres that light up on movement
	const eyeGroup = new THREE.Group();
	ghostGroup.add(eyeGroup);

	const socketGeometry = new THREE.SphereGeometry(0.45, 16, 16);
	const socketMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
	for (const xPos of [-0.7, 0.7]) {
		const socket = new THREE.Mesh(socketGeometry, socketMaterial);
		socket.position.set(xPos, 0.6, 1.9);
		socket.scale.set(1.1, 1.0, 0.6);
		eyeGroup.add(socket);
	}

	function makeEye(xPos) {
		const inner = new THREE.Mesh(
			new THREE.SphereGeometry(0.3, 12, 12),
			new THREE.MeshBasicMaterial({ color: CONFIG.eyeGlowColor, transparent: true, opacity: 0 }),
		);
		inner.position.set(xPos, 0.6, 2.0);
		eyeGroup.add(inner);

		const outer = new THREE.Mesh(
			new THREE.SphereGeometry(0.525, 12, 12),
			new THREE.MeshBasicMaterial({
				color: CONFIG.eyeGlowColor,
				transparent: true,
				opacity: 0,
				side: THREE.BackSide,
			}),
		);
		outer.position.set(xPos, 0.6, 1.95);
		eyeGroup.add(outer);

		return { inner: inner.material, outer: outer.material };
	}
	const eyes = [makeEye(-0.7), makeEye(0.7)];

	// Fireflies
	const fireflies = [];
	const fireflyGroup = new THREE.Group();
	scene.add(fireflyGroup);

	for (let i = 0; i < CONFIG.fireflyCount; i++) {
		const firefly = new THREE.Mesh(
			new THREE.SphereGeometry(0.02, 2, 2),
			new THREE.MeshBasicMaterial({ color: CONFIG.fireflyColor, transparent: true, opacity: 0.9 }),
		);
		firefly.position.set(
			(Math.random() - 0.5) * 40,
			(Math.random() - 0.5) * 30,
			(Math.random() - 0.5) * 20,
		);

		const glow = new THREE.Mesh(
			new THREE.SphereGeometry(0.08, 8, 8),
			new THREE.MeshBasicMaterial({
				color: CONFIG.fireflyColor,
				transparent: true,
				opacity: 0.4,
				side: THREE.BackSide,
			}),
		);
		firefly.add(glow);

		const light = new THREE.PointLight(CONFIG.fireflyColor, 0.8, 3, 2);
		firefly.add(light);

		firefly.userData = {
			velocity: new THREE.Vector3(
				(Math.random() - 0.5) * CONFIG.fireflySpeed,
				(Math.random() - 0.5) * CONFIG.fireflySpeed,
				(Math.random() - 0.5) * CONFIG.fireflySpeed,
			),
			phase: Math.random() * Math.PI * 2,
			pulseSpeed: 2 + Math.random() * 3,
			glowMaterial: glow.material,
			coreMaterial: firefly.material,
			light,
		};

		fireflyGroup.add(firefly);
		fireflies.push(firefly);
	}

	// Particle trail
	const particles = [];
	const particlePool = [];
	const particleGroup = new THREE.Group();
	scene.add(particleGroup);

	const particleGeometries = [
		new THREE.SphereGeometry(0.05, 6, 6),
		new THREE.TetrahedronGeometry(0.04, 0),
		new THREE.OctahedronGeometry(0.045, 0),
	];
	const particleBaseMaterial = new THREE.MeshBasicMaterial({
		color: CONFIG.particleColor,
		transparent: true,
		opacity: 0,
		alphaTest: 0.1,
	});

	for (let i = 0; i < 100; i++) {
		const geometry = particleGeometries[Math.floor(Math.random() * particleGeometries.length)];
		const particle = new THREE.Mesh(geometry, particleBaseMaterial.clone());
		particle.visible = false;
		particleGroup.add(particle);
		particlePool.push(particle);
	}

	function createParticle() {
		let particle;
		if (particlePool.length > 0) {
			particle = particlePool.pop();
			particle.visible = true;
		} else if (particles.length < CONFIG.particleCount) {
			const geometry = particleGeometries[Math.floor(Math.random() * particleGeometries.length)];
			particle = new THREE.Mesh(geometry, particleBaseMaterial.clone());
			particleGroup.add(particle);
		} else {
			return;
		}

		const color = new THREE.Color(CONFIG.particleColor);
		color.offsetHSL(Math.random() * 0.1 - 0.05, 0, 0);
		particle.material.color = color;

		particle.position.copy(ghostGroup.position);
		particle.position.z -= 0.8 + Math.random() * 0.6;
		particle.position.x += (Math.random() - 0.5) * 3.5;
		particle.position.y += (Math.random() - 0.5) * 3.5 - 0.8;

		const size = 0.6 + Math.random() * 0.7;
		particle.scale.set(size, size, size);
		particle.rotation.set(
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
		);

		particle.userData.life = 1.0;
		particle.userData.decay = Math.random() * 0.003 + CONFIG.particleDecayRate;
		particle.userData.rotationSpeed = {
			x: (Math.random() - 0.5) * 0.015,
			y: (Math.random() - 0.5) * 0.015,
			z: (Math.random() - 0.5) * 0.015,
		};
		particle.userData.velocity = {
			x: (Math.random() - 0.5) * 0.012,
			y: (Math.random() - 0.5) * 0.012 - 0.002,
			z: (Math.random() - 0.5) * 0.012 - 0.006,
		};
		particle.material.opacity = Math.random() * 0.9;
		particles.push(particle);
	}

	// Pause rendering while the hero is scrolled out of view
	let heroVisible = true;
	new IntersectionObserver(
		(entries) => {
			heroVisible = entries[0].isIntersecting;
		},
		{ threshold: 0 },
	).observe(container);

	// Resize
	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			camera.aspect = width() / height();
			camera.updateProjectionMatrix();
			renderer.setSize(width(), height());
			composer.setSize(width(), height());
			bloomPass.setSize(width(), height());
		}, 250);
	});

	// Pointer tracking
	const mouse = new THREE.Vector2();
	const prevMouse = new THREE.Vector2();
	const mouseSpeed = new THREE.Vector2();
	let lastMouseUpdate = 0;
	let isMouseMoving = false;
	let mouseMovementTimer = null;

	window.addEventListener('pointermove', (e) => {
		const now = performance.now();
		if (now - lastMouseUpdate > 16) {
			prevMouse.copy(mouse);
			mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
			mouseSpeed.set(mouse.x - prevMouse.x, mouse.y - prevMouse.y);
			isMouseMoving = true;

			clearTimeout(mouseMovementTimer);
			mouseMovementTimer = setTimeout(() => {
				isMouseMoving = false;
			}, 80);
			lastMouseUpdate = now;
		}
	});

	// Animation loop
	let time = 0;
	let currentMovement = 0;
	let lastFrameTime = 0;
	let lastParticleTime = 0;
	let frameCount = 0;

	function animate(timestamp) {
		requestAnimationFrame(animate);
		if (!heroVisible) return;

		const deltaTime = timestamp - lastFrameTime;
		lastFrameTime = timestamp;
		if (deltaTime > 100) return;

		time += (deltaTime / 16.67) * 0.01;
		frameCount++;

		atmosphereMaterial.uniforms.time.value = time;
		analogDecayPass.uniforms.uTime.value = time;

		// Follow the pointer
		const targetX = mouse.x * 11;
		const targetY = mouse.y * 7;
		const prevGhostPosition = ghostGroup.position.clone();
		ghostGroup.position.x += (targetX - ghostGroup.position.x) * CONFIG.followSpeed;
		ghostGroup.position.y += (targetY - ghostGroup.position.y) * CONFIG.followSpeed;
		atmosphereMaterial.uniforms.ghostPosition.value.copy(ghostGroup.position);

		const movementAmount = prevGhostPosition.distanceTo(ghostGroup.position);
		currentMovement =
			currentMovement * CONFIG.eyeGlowDecay + movementAmount * (1 - CONFIG.eyeGlowDecay);

		// Float + pulse
		ghostGroup.position.y +=
			Math.sin(time * CONFIG.floatSpeed * 1.5) * 0.03 +
			Math.cos(time * CONFIG.floatSpeed * 0.7) * 0.018 +
			Math.sin(time * CONFIG.floatSpeed * 2.3) * 0.008;

		const pulse = Math.sin(time * CONFIG.pulseSpeed) * CONFIG.pulseIntensity;
		ghostMaterial.emissiveIntensity =
			CONFIG.emissiveIntensity + pulse + Math.sin(time * 0.6) * 0.12;

		// Fireflies
		for (const firefly of fireflies) {
			const data = firefly.userData;
			const flyPulse = Math.sin((time + data.phase) * data.pulseSpeed) * 0.4 + 0.6;
			data.glowMaterial.opacity = CONFIG.fireflyGlowIntensity * 0.4 * flyPulse;
			data.coreMaterial.opacity = CONFIG.fireflyGlowIntensity * 0.9 * flyPulse;
			data.light.intensity = CONFIG.fireflyGlowIntensity * 0.8 * flyPulse;

			data.velocity.x += (Math.random() - 0.5) * 0.001;
			data.velocity.y += (Math.random() - 0.5) * 0.001;
			data.velocity.z += (Math.random() - 0.5) * 0.001;
			data.velocity.clampLength(0, CONFIG.fireflySpeed);
			firefly.position.add(data.velocity);

			if (Math.abs(firefly.position.x) > 30) data.velocity.x *= -0.5;
			if (Math.abs(firefly.position.y) > 20) data.velocity.y *= -0.5;
			if (Math.abs(firefly.position.z) > 15) data.velocity.z *= -0.5;
		}

		// Body tilt toward movement direction
		const mouseDirection = new THREE.Vector2(
			targetX - ghostGroup.position.x,
			targetY - ghostGroup.position.y,
		).normalize();
		const tiltStrength = 0.1 * CONFIG.wobbleAmount;
		const tiltDecay = 0.95;
		ghostBody.rotation.z =
			ghostBody.rotation.z * tiltDecay + -mouseDirection.x * tiltStrength * (1 - tiltDecay);
		ghostBody.rotation.x =
			ghostBody.rotation.x * tiltDecay + mouseDirection.y * tiltStrength * (1 - tiltDecay);
		ghostBody.rotation.y = Math.sin(time * 1.4) * 0.05 * CONFIG.wobbleAmount;

		const scale =
			(1 + Math.sin(time * 2.1) * 0.025 * CONFIG.wobbleAmount + pulse * 0.015) *
			(1 + Math.sin(time * 0.8) * 0.012);
		ghostBody.scale.set(scale, scale, scale);

		// Eye glow follows movement
		const isMoving = currentMovement > CONFIG.movementThreshold;
		const targetGlow = isMoving ? 1.0 : 0.0;
		const glowSpeed = isMoving ? CONFIG.eyeGlowResponse * 2 : CONFIG.eyeGlowResponse;
		const newOpacity = eyes[0].inner.opacity + (targetGlow - eyes[0].inner.opacity) * glowSpeed;
		for (const eye of eyes) {
			eye.inner.opacity = newOpacity;
			eye.outer.opacity = newOpacity * 0.3;
		}

		// Particle trail while moving
		if (currentMovement > 0.005 && isMouseMoving && timestamp - lastParticleTime > 100) {
			const speed = Math.sqrt(mouseSpeed.x * mouseSpeed.x + mouseSpeed.y * mouseSpeed.y) * 8;
			const rate = Math.min(CONFIG.particleCreationRate, Math.max(1, Math.floor(speed * 3)));
			for (let i = 0; i < rate; i++) createParticle();
			lastParticleTime = timestamp;
		}

		// Particle updates (budgeted per frame)
		const budget = Math.min(particles.length, 60);
		for (let i = 0; i < budget; i++) {
			const index = (frameCount + i) % particles.length;
			const particle = particles[index];
			if (!particle) continue;

			particle.userData.life -= particle.userData.decay;
			particle.material.opacity = particle.userData.life * 0.85;

			particle.position.x +=
				particle.userData.velocity.x + Math.cos(time * 1.8 + particle.position.y) * 0.0008;
			particle.position.y += particle.userData.velocity.y;
			particle.position.z += particle.userData.velocity.z;
			particle.rotation.x += particle.userData.rotationSpeed.x;
			particle.rotation.y += particle.userData.rotationSpeed.y;
			particle.rotation.z += particle.userData.rotationSpeed.z;

			if (particle.userData.life <= 0) {
				particle.visible = false;
				particle.material.opacity = 0;
				particlePool.push(particle);
				particles.splice(index, 1);
				i--;
			}
		}

		composer.render();
	}

	// Prime the scene so the reveal never shows an empty first frame
	for (let i = 0; i < 3; i++) composer.render();
	for (let i = 0; i < 10; i++) createParticle();
	composer.render();

	// Start centred, as if the pointer were mid-screen
	window.dispatchEvent(
		new MouseEvent('pointermove', {
			clientX: window.innerWidth / 2,
			clientY: window.innerHeight / 2,
		}),
	);

	requestAnimationFrame(animate);
	return renderer.domElement;
}
