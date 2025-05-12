import { Random } from 'mockjs'

export const fetchData = (count = 1000) => {
	return new Promise((resolve, reject) => {
		const list = []
		setTimeout(() => {
			for (let i = 0; i < count; i++) {
				list.push({
					title: Random.ctitle(10, 30),
					content: Random.cparagraph(10, 50),
					id: i
				})
			}
			resolve(list)
		}, 1000)
	})
}
