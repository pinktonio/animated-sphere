import * as BABYLON from '@babylonjs/core';
import * as earcut from 'earcut';
(window as any).earcut = earcut;

const sphere = (scene: BABYLON.Scene) => {
	const material = new BABYLON.StandardMaterial('material', scene);
	material.diffuseColor = new BABYLON.Color3(1, 0, 0);
	material.bumpTexture = new BABYLON.Texture(
		'http://i.imgur.com/wGyk6os.png',
		scene
	);

	const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {});
	sphere.material = material;

	const animation = new BABYLON.Animation(
		'sphereAnimation',
		'rotation.y',
		60,
		BABYLON.Animation.ANIMATIONTYPE_FLOAT,
		BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE
	);

	const keys = [
		{ frame: 0, value: 0 },
		{ frame: 60, value: sphere.rotation.y + 0.5 },
	];

	animation.setKeys(keys);
	sphere.animations.push(animation);
	scene.beginAnimation(sphere, 0, 60, true);

	return sphere;
};

export default sphere;
