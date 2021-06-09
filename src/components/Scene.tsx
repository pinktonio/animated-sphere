import React, { useState } from 'react';
import SceneComponent from 'babylonjs-hook';

// Babylonjs
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline';

// Babylonjs Dev Tools
// import '@babylonjs/core/Debug/debugLayer';
// import '@babylonjs/inspector';

// Components
import getSphere from './Sphere';
import Hero from './Hero';

// Types
import type { Scene } from '@babylonjs/core/scene';

const SceneBuilder = () => {
	const [sphereLoading, setSphereLoading] = useState(true);

	const onSceneReady = async (scene: Scene) => {
		scene.getEngine().getRenderingCanvas();

		// Makes background transparent
		scene.clearColor = new Color4(0, 0, 0, 0);

		// Camera
		const camera = new ArcRotateCamera(
			'camera',
			Math.PI / 2,
			Math.PI / 3,
			8,
			Vector3.Zero(),
			scene
		);
		camera.setTarget(Vector3.Zero());

		await getSphere(scene, camera);

		const pipeline = new DefaultRenderingPipeline('pipeline', true, scene, [
			camera,
		]);
		pipeline.samples = 8;
		pipeline.fxaaEnabled = true;

		// scene.debugLayer.show();

		setSphereLoading(false);
	};

	/**
	 * Will run on every frame render.
	 */
	const onRender = (scene: Scene) => {};

	return (
		<>
			<SceneComponent
				antialias
				onSceneReady={onSceneReady}
				onRender={onRender}
				id='canvas'
			/>
			{sphereLoading ? (
				<div className='loading-container'>
					<div className='loading'>
						<div />
						<div />
					</div>
				</div>
			) : (
				<Hero />
			)}
		</>
	);
};

export default SceneBuilder;
