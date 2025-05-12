import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchData } from "@/utils";
import ListItem from "@/components/ListItem";
import './index.css'

// 这个值要给的越高越好，否则的话在滚动的过程中总的高度越变越高，但是 scrollTop 的值相对来说滚动的时候是小的。
// translateY 是根据 scrollTop 来计算的。这会导致 translateY 的值偏小。滑动到最后的时候下面会留白
const estimatedHeight = 300

// 前后预加载个数
const prevLoad = 4

let prevScroll = 0;

const VirtualListV2 = () => {

	const [refreshTime, setRefreshTime] = useState(0);
	const startIndexRef = useRef(0);
	const endIndexRef = useRef(10);
	const scrollContainerRef = useRef()
	const itemHeightMapRef = useRef(new Map())
	const visibleCountRef = useRef(0)
	// 当前视口的锚点元素
	const anchorItemRef = useRef({
		offset: 0,
		index: 0
	})

	const [translateY, setTranslateY] = useState(0)
	const [originList, setOriginalList] = useState([]);

	const getItemHeight = (id) => {
		return itemHeightMapRef.current.get(id) || estimatedHeight
	}

	const getAttachedEndIndex = () => {
		return startIndexRef.current + visibleCountRef.current + prevLoad
	}

	const renderDataList = originList.slice(startIndexRef.current, endIndexRef.current)

	useEffect(() => {
		fetchData(50).then(data => {
			setOriginalList(data)
			visibleCountRef.current = Math.ceil(scrollContainerRef.current.clientHeight / estimatedHeight) + prevLoad
		})
	}, []);

	useEffect(() => {
		calTranslateY()
	}, [refreshTime]);

	const getItemOffsetTop = (index) => {
		let offsetTop = 0
		for (let i = 0; i < originList.length; i++) {
			if (i < index) {
				offsetTop += getItemHeight(originList[i].id)
			}
		}
		return offsetTop
	}

	const calTranslateY = () => {
		const { scrollTop } = scrollContainerRef.current
		const {
			index,
			offset
		} = anchorItemRef.current
		const anchorDomScrollY = scrollTop - offset
		let firstAttachedDomScrollY = anchorDomScrollY;
		for (let i = index - 1; i >= startIndexRef.current ; i--) {
			firstAttachedDomScrollY -= getItemHeight(originList[i].id)
		}
		setTranslateY(firstAttachedDomScrollY)
	}

	const totalHeight = originList.reduce((acc, item) => {
		return acc + getItemHeight(item.id)
	}, 0)

	const updateAnchorItem = (delta) => {
		let { offset, index } = anchorItemRef.current
		// 向下滚动
		if (delta > 0) {
			delta += offset
			while (index < originList.length && delta > getItemHeight(originList[index].id)) {
				delta -= getItemHeight(originList[index].id)
				index++;
			}
			anchorItemRef.current = {
				offset: delta,
				index,
			}
		} else {
			// 向上滚动
			delta += offset
			while (delta < 0 && index >= 1) {
				delta += getItemHeight(originList[index - 1].id)
				index--
			}
			if (index === 0 && delta <=0 ) {
				scrollContainerRef.current.scrollTop = 0
				delta = 0
			}

			anchorItemRef.current = {
				offset: delta,
				index,
			}
		}
		startIndexRef.current = Math.max(0, anchorItemRef.current.index - prevLoad)
		endIndexRef.current = Math.min(originList.length, getAttachedEndIndex())
		setRefreshTime(Date.now())
	}

	const handleScroll = () => {
		const { scrollTop } = scrollContainerRef.current
		const delta = scrollTop - prevScroll;
		prevScroll = scrollTop
		updateAnchorItem(delta)
	}
	return (
		<div className={'wrapper'}>
			<div className={'info'}>
				<div>
					<span>anchorItem：</span>
					<span>
						index: {anchorItemRef.current.index}
					</span>
					<span style={{ paddingLeft: 12 }}>
						offset: {anchorItemRef.current.offset}
					</span>
				</div>
				<div>
					<span>startIndex：</span>
					<span>{startIndexRef.current}。</span>
					<span>startIndexOffsetTop: {getItemOffsetTop(startIndexRef.current)}</span>
				</div>
				<div>
					<span>translateY：</span>
					<span>{translateY}</span>
				</div>
				<div>
					<span>height：</span>
					<span>{totalHeight}</span>
				</div>
			</div>
			<div
				className={'scroll-container'}
				ref={scrollContainerRef}
				onScroll={handleScroll}
			>
				{/*占位撑开高度*/}
				<div className={'scroll-runway'} style={{ height: totalHeight }} />
				<div
					className={'scroll-content'}
					style={{ transform: `translateY(${translateY}px)` }}
				>
					{renderDataList.map(item => (
						<ListItem
							id={item.id}
							title={item.title}
							content={item.content}
							key={item.id}
							onHeightChange={(height) => {
								itemHeightMapRef.current.set(item.id, height)
								setRefreshTime(Date.now())
							}}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
export default VirtualListV2;
