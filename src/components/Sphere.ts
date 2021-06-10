// Babylonjs
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { SphereBuilder } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { VolumetricLightScatteringPostProcess } from '@babylonjs/core/PostProcesses/volumetricLightScatteringPostProcess';
import { Animation } from '@babylonjs/core/Animations/animation';
import { PointerEventTypes } from '@babylonjs/core/Events/pointerEvents';
import '@babylonjs/loaders/glTF/2.0/glTFLoader';

import { isMobile, isSafari, isMobileSafari } from 'react-device-detect';

// Types
import type { Scene } from '@babylonjs/core/scene';
import type { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';

const sphere = async (scene: Scene, camera: ArcRotateCamera) => {
	// Material ---------------------
	const material = new StandardMaterial('sphere', scene);
	material.diffuseTexture = new Texture('./Wall_Rock_basecolor.jpg', scene);
	material.specularTexture = new Texture('./Wall_Rock_basecolor.jpg', scene);
	material.diffuseColor = new Color3(0.992, 0.11, 0.043);

	material.bumpTexture = new Texture('./Wall_Rock_normal.jpg', scene);
	material.diffuseTexture.scale(2);
	material.diffuseTexture.level = 2;

	// Import Mesh -----------------------
	return SceneLoader.ImportMeshAsync(
		'voronoi_Sphere',
		'./',
		'sphere_holes.gltf',
		scene
	).then(() => {
		const sphere = scene.getMeshByName('voronoi_Sphere');

		if (sphere) {
			sphere.material = material;
			sphere.position = Vector3.Zero();

			// Bulb ---------------------------------
			const bulbMaterial = new StandardMaterial('bulb', scene);
			bulbMaterial.emissiveColor = Color3.White();

			const bulb = SphereBuilder.CreateSphere('bulb', {
				diameter: 0.5,
			});
			bulb.position = new Vector3(0, 1, 0);
			bulb.material = bulbMaterial;
			bulb.parent = sphere;

			// Light --------------------------
			const light = new PointLight('sphereLight', Vector3.Zero(), scene);
			light.intensity = 1;
			light.diffuse = Color3.White();
			light.specular = Color3.White();
			light.parent = bulb;

			// God rays -------------------------------------------
			const godrays = new VolumetricLightScatteringPostProcess(
				'godrays',
				1.0,
				camera,
				bulb,
				isSafari && !isMobileSafari ? 50 : 100,
				Texture.BILINEAR_SAMPLINGMODE
			);

			godrays.exposure = 0.1;
			godrays.decay = isSafari && !isMobileSafari ? 0.85 : 0.94;
			godrays.weight = 0.98767;
			godrays.density = 0.996;

			// godrays.onActivateObservable.add(() => {
			// 	scene
			// 		.getEngine()
			// 		.clear(
			// 			new Color4(0, 0, 0, 0),
			// 			scene._allowPostProcessClearColor,
			// 			true,
			// 			true
			// 		);
			// });

			// godrays.onBeforeRenderObservable.clear();
			// godrays.onAfterRenderObservable.clear();

			// godrays.alphaMode = Constants.ALPHA_COMBINE;

			// Sphere Animation ----------------
			const animation = new Animation(
				'sphereAnimation',
				'rotation.y',
				60,
				Animation.ANIMATIONTYPE_FLOAT,
				Animation.ANIMATIONLOOPMODE_RELATIVE
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
						case PointerEventTypes.POINTERMOVE:
							const x = pointerInfo.event.movementX;
							const speedAmplifier = 50;
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
