import React from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';

const Hero = () => {
	const { scrollYProgress } = useViewportScroll();
	// Not setting opacity to 1 prevents animation from rerendering
	const opacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 0.999]);
	const color = useTransform(
		scrollYProgress,
		[0.3, 0.31],
		['rgb(255, 255, 255)', 'rgb(0, 0, 0)']
	);
	const paddingTop = useTransform(scrollYProgress, [0.5, 1], ['50vh', '30vh']);

	return (
		<div className='hero'>
			<motion.div style={{ opacity }} className='overlay' />
			<div className='title'>
				<motion.h1 style={{ color }}>Immerse into light</motion.h1>
			</div>
			<motion.div style={{ paddingTop }} className='text'>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
					reiciendis quidem a dolorem at optio omnis quasi nesciunt adipisci
					nulla facere porro perferendis similique distinctio quam, ex excepturi
					voluptatem! Quaerat?
				</p>
			</motion.div>
		</div>
	);
};

export default Hero;
