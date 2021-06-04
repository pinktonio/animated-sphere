import React from 'react';
import SceneComponent from 'babylonjs-hook';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';

import getSphere from './Sphere';

const Scene = () => {
	const onSceneReady = async (scene: BABYLON.Scene) => {
		const canvas = scene.getEngine().getRenderingCanvas();
		// Makes background transparent
		scene.autoClear = false;

		// Camera
		const camera = new BABYLON.ArcRotateCamera(
			'camera',
			Math.PI / 2,
			Math.PI / 4,
			8,
			BABYLON.Vector3.Zero(),
			scene
		);
		camera.setTarget(BABYLON.Vector3.Zero());

		// Light
		const hemisphericLight = new BABYLON.HemisphericLight(
			'hemisphericLight',
			new BABYLON.Vector3(1, 1, 0),
			scene
		);
		hemisphericLight.intensity = 0.8;

		getSphere(scene);

		scene.debugLayer.show();
	};

	/**
	 * Will run on every frame render.  We are spinning the box on y-axis.
	 */
	const onRender = (scene: BABYLON.Scene) => {};

	return (
		<SceneComponent
			antialias
			onSceneReady={onSceneReady}
			onRender={onRender}
			id='canvas'
		/>
	);
};

export default Scene;
