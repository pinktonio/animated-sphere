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
		scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

		// Camera
		const camera = new BABYLON.ArcRotateCamera(
			'camera',
			Math.PI / 2,
			Math.PI / 3,
			8,
			BABYLON.Vector3.Zero(),
			scene
		);
		camera.setTarget(BABYLON.Vector3.Zero());
		// camera.attachControl(canvas);

		getSphere(scene, camera);

		const pipeline = new BABYLON.DefaultRenderingPipeline(
			'pipeline',
			true,
			scene,
			[camera]
		);
		pipeline.samples = 8;
		pipeline.fxaaEnabled = true;

		// scene.debugLayer.show();
	};

	/**
	 * Will run on every frame render.
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
