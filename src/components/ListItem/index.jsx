import React, { useEffect, useRef } from 'react';
import './index.css'

const ListItem = (props) => {

	const itemRef = useRef(null)

	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			const { borderBoxSize: [{ blockSize }] } = entries[0]
			if (blockSize) {
				props.onHeightChange?.(blockSize)
			}
		})
		observer.observe(itemRef.current)
		return () => {
			if (itemRef.current) {
				observer.unobserve(itemRef.current)
			}
		}
	}, []);

	return (
		<div className={`list-item list-item-${props.id}`} ref={itemRef}>
			<h4>
				{props.id} / {props.title}
			</h4>
			<p>
				{props.content}
			</p>
		</div>
	)
}

export default ListItem
