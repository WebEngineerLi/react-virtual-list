import React, { useEffect, useState } from 'react';
import { fetchData } from "";


const VirtualList = (props) => {

	const [list, setList] = useState([]);

	console.log('list', list)

	useEffect(() => {
		fetchData(300).then(setList)
	}, []);

	return (
		<div>这是列表</div>
	)
}

export default VirtualList
