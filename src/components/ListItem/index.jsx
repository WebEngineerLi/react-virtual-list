import React from 'react';

const ListItem = (props) => {
	return (
		<div>
			<h4>
				{props.title}
			</h4>
			<p>
				{props.content}
			</p>
		</div>
	)
}

export default ListItem
