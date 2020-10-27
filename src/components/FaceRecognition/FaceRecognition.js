import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({ imageUrl ,box }) => {
	return(
		<div className ='center'>
			<div className='absolute mt2'>
				<img id='inputimage' alt='' src={imageUrl} width='500px' heigh='auto' />
				<div className='bounding-box' style={{top:box.topRow, right: box.rightcol, bottom: box.bottomRow, left: box.leftcol}}></div>
			</div>
		</div>
	);
} 
export default FaceRecognition;