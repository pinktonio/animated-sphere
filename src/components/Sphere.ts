import * as BABYLON from '@babylonjs/core';
import { isMobile } from 'react-device-detect';

const sphere = (scene: BABYLON.Scene, camera: BABYLON.Camera) => {
	// Material ---------------------
	const material = new BABYLON.StandardMaterial('sphere', scene);
	material.diffuseTexture = new BABYLON.Texture(
		'./Wall_Rock_basecolor.jpg',
		scene
	);
	material.specularTexture = new BABYLON.Texture(
		'./Wall_Rock_basecolor.jpg',
		scene
	);
	material.diffuseColor = new BABYLON.Color3(1, 0, 0);
	material.bumpTexture = new BABYLON.Texture('./Wall_Rock_normal.jpg', scene);
	material.diffuseTexture.scale(2);
	material.diffuseTexture.level = 2;

	// Import Mesh -----------------------
	BABYLON.SceneLoader.ImportMeshAsync(
		'voronoi_Sphere',
		'./',
		'sphere_holes.gltf',
		scene
	).then(() => {
		const sphere = scene.getMeshByName('voronoi_Sphere');

		if (sphere) {
			sphere.material = material;
			sphere.position = BABYLON.Vector3.Zero();

			// Light --------------------------
			const light = new BABYLON.PointLight(
				'sphereLight',
				BABYLON.Vector3.Zero(),
				scene
			);
			light.position = new BABYLON.Vector3(0, 1, 0);
			light.intensity = 1;
			light.diffuse = BABYLON.Color3.White();
			light.specular = BABYLON.Color3.White();

			// Bulb ---------------------------------
			const bulbMaterial = new BABYLON.StandardMaterial('bulb', scene);
			bulbMaterial.emissiveColor = BABYLON.Color3.White();

			const bulb = BABYLON.MeshBuilder.CreateSphere('bulb', {
				diameter: 0.5,
			});
			bulb.position = new BABYLON.Vector3(0, 1, 0);
			bulb.material = bulbMaterial;
			bulb.parent = sphere;

			// God rays -------------------------------------------
			const godrays = new BABYLON.VolumetricLightScatteringPostProcess(
				'godrays',
				1.0,
				camera,
				bulb,
				100,
				BABYLON.Texture.BILINEAR_SAMPLINGMODE
			);

			godrays.exposure = 0.1;
			godrays.decay = 0.96815;
			godrays.weight = 0.98767;
			godrays.density = 0.996;

			// godrays.onActivateObservable.add(() => {
			// 	scene
			// 		.getEngine()
			// 		.clear(
			// 			new BABYLON.Color4(0, 0, 0, 0),
			// 			scene._allowPostProcessClearColor,
			// 			true,
			// 			true
			// 		);
			// });

			// godrays.onBeforeRenderObservable.clear();
			// godrays.onAfterRenderObservable.clear();

			// godrays.alphaMode = BABYLON.Constants.ALPHA_COMBINE;

			// Sphere Animation ----------------
			const animation = new BABYLON.Animation(
				'sphereAnimation',
				'rotation.y',
				60,
				BABYLON.Animation.ANIMATIONTYPE_FLOAT,
				BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE
			);

			sphere.rotationQuaternion = null;
			const rotationSpeed = 0.25;

			const keys = [
				{ frame: 0, value: 0 },
				{ frame: 60, value: rotationSpeed },
			];

			animation.setKeys(keys);

			sphere.animations.push(animation);
			const animatable = scene.beginAnimation(sphere, 0, 60, true);

			// Pointer event --------------------------------
			let timeout: NodeJS.Timeout;

			const easeOut = () => {
				if (animatable.speedRatio > 1.1) {
					animatable.speedRatio -= 0.1;
					setTimeout(easeOut, 40);
				} else if (animatable.speedRatio < 0.9) {
					animatable.speedRatio += 0.1;
					setTimeout(easeOut, 40);
				} else {
					animatable.speedRatio = 1;
				}
			};

			!isMobile &&
				scene.onPointerObservable.add((pointerInfo) => {
					switch (pointerInfo.type) {
						case BABYLON.PointerEventTypes.POINTERMOVE:
							const x = pointerInfo.event.movementX;
							const speedAmplifier = 75;
							if (
								(x > 0 && animatable.speedRatio >= 1) ||
								(x < 0 && animatable.speedRatio <= -1)
							) {
								animatable.speedRatio += x / (speedAmplifier * 2);
							} else {
								animatable.speedRatio += x / speedAmplifier;
							}

							timeout && clearTimeout(timeout);
							timeout = setTimeout(() => easeOut(), 1000);
					}
				});

			// Scroll animation ---------------------------
			window.addEventListener('scroll', () => {
				const scrollYProgress = window.scrollY / window.innerHeight;
				light.intensity = 1 + scrollYProgress * 2;
				sphere.scaling.setAll(1 + scrollYProgress * 3);
				bulb.scaling.setAll(1 + scrollYProgress * 2.5);
			});

			return sphere;
		}
	});
};

export default sphere;
