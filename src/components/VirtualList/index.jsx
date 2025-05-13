import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchData } from "@/utils";
import './index.css'
import ListItem from "@/components/ListItem";

const estimatedHeight = 200

const bufferSize = 5

const cachedHeightMap = new Map();

const VirtualList = (props) => {
	const [originalList, setOriginalList] = useState([])
	const [renderList, setRenderList] = useState([])
	const [startIndex, setStartIndex] = useState(0);
	const visibleCount = useRef(0)
	const [initTime, setInitTime] = useState(0);
	const scrollContainerRef = useRef(null)
	// 触发重新render
	const [_, setRefreshTime] = useState(0);

	useEffect(() => {
		fetchData(400).then(data => {
			setOriginalList(data)
			visibleCount.current = Math.ceil(scrollContainerRef.current.clientHeight / estimatedHeight) + bufferSize
			setInitTime(Date.now())
		})
	}, []);

	useEffect(() => {
		if (initTime > 0) {
			getRenderData(originalList, 0)
		}
	}, [initTime]);

	// 获取某一行的高度
	const getItemHeight = (item) => {
		// 取真实高度值或者预估高度值
		return cachedHeightMap.get(item.id) || estimatedHeight
	}

	const totalHeight = originalList.reduce((prev, next) => {
		return prev + getItemHeight(next)
	}, 0)

	const translateY = useMemo(() => {
		let y = 0
		originalList.forEach((item, index) => {
			if (index >= startIndex) {
				return
			}
			y += getItemHeight(item)
		})
		return y
	}, [startIndex])

// 获取可视区域的内渲染的数据
const getRenderData = (list, scrollTop) => {
	let anchorIndex = 0;
	let height = 0;
	// 通过从第一个元素开始累加与当前的 scrollTop 对比从而计算出来当前锚点元素的索引 anchorIndex
	while (scrollTop >= height) {
		height += getItemHeight(originalList[anchorIndex]);
		anchorIndex++;
	}
	// 起始索引 = anchorIndex -  bufferSize
	const startIndex = Math.max(0, anchorIndex - bufferSize)
	// 结束索引 = 起始索引 + visibleCount + bufferSize
	const endIndex = Math.min(startIndex + visibleCount.current + bufferSize, list.length - 1)
	setRenderList(list.slice(startIndex, endIndex))
	setStartIndex(startIndex)
}

const handleScroll = (e) => {
	const { scrollTop } = e.target;
	getRenderData(originalList, scrollTop)
}

	return (
		<div
			className={'scroll-container'}
			ref={scrollContainerRef}
			onScroll={handleScroll}
		>
			{/* scroll-runway 撑开内容的高度，保证出现滚动条 */}
			<div className={'scroll-runway'} style={{ height: totalHeight }}>
				{/* 占位元素，保证当前渲染的内容出现在可视区域内*/}
				<div
					className={'scroll-placement'}
					style={{ transform: `translateY(${translateY}px)` }}
				>
					{/* renderList 动态渲染内容，只渲染可视区域的一小部分 */}
					{renderList.map((item, index) => (
						<ListItem
							key={item.id}
							{...item}
							onHeightChange={height => {
								// 监听到子组件高度改变时，将高度缓存起来，同时使页面重新 render 一次。
								if (height !== cachedHeightMap.get(item.id)) {
									cachedHeightMap.set(item.id, height);
									setRefreshTime(Date.now())
								}
							}}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default VirtualList
