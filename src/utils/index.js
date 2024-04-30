import mock from 'mockjs'

export const fetchData = (count = 1000) => {
	return new Promise((resolve, reject) => {
		const list = []
		setTimeout(() => {
			for (let i = 0; i < count; i++) {
				list.push({
					title: mock.title(10, 100),
					detail: mock.content(100, 1000),
				})
			}
		}, 1000)
	})
}
