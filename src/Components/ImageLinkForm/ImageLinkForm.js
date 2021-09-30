import React from 'react';
import './ImageLinkForm.css'
const ImageLinkForm = ({OnInputChange,onButtonSubmit,enter}) => {
	return(
		<div>
			<p className='f3 b'>
			{'This magic brain will detect faces in your pictures, give it a try!'}
			</p>
			<div className='center'>
				<div className=' form center pa4 br3 shadow-5'>
					<input className='f4 pa2 w-70 center' type='text' onChange={OnInputChange} onKeyPress={enter} />
					<button  className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonSubmit} >Detect</button>
				</div>
			</div>
		</div>
	);
}

export default ImageLinkForm; 