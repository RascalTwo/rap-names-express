import { useState, useCallback, useEffect, Component } from 'react'
import RapperItem from "./RapperItem"

class AppClass extends Component {
	state = { info: [] }

	addRapper = async (event) => {
		event.preventDefault()
		const form = event.target
		const response = await fetch(form.action, {
			method: form.method,
			body: new URLSearchParams(new FormData(form))
		})

		const data = await response.json()

		this.setState({ info: [...this.state.info, data] })

		form.reset()
	}

	fetchRappers = async () => {
		const response = await fetch('/rappers')
		const data = await response.json()
		this.setState({ info: data.info })
	}

	componentDidMount() {
		this.fetchRappers()
	}

	deleteRapper = async (rapper) => {
		await fetch('/deleteRapper', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ stageNameS: rapper.stageName })
		})

		this.setState({ info: this.state.info.filter(loopRapper => loopRapper._id !== rapper._id) })
	}

	likeRapper = async (rapper) => {
		await fetch('/addOneLike', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				stageNameS: rapper.stageName,
				birthNameS: rapper.birthName,
				likesS: rapper.likes
			})
		})

		this.setState({
			info: this.state.info.map(loopRapper => {
				if (loopRapper._id === rapper._id) {
					return { ...loopRapper, likes: loopRapper.likes + 1 }
				}
				return loopRapper
			})
		})
	}

	render() {
		return (
			<>
				<h1>Current Rappers</h1>
				<ul className="rappers">
					{this.state.info.map(rapper => (
						<RapperItem key={rapper._id} rapper={rapper} onLike={this.likeRapper} onDelete={this.deleteRapper} />
					))}
				</ul>

				<h2>Add A Rapper:</h2>

				<form action="/addRapper" method="POST" onSubmit={this.addRapper}>
					<input type="text" placeholder="Stage Name" name="stageName" />
					<input type="text" placeholder="Birth Name" name="birthName" />
					<input type="submit" />
				</form>
			</>
		)
	}
}


export default function App() {
	const [info, setInfo] = useState([]);

	const fetchRappers = useCallback(async () => {
		const response = await fetch('/rappers')
		const data = await response.json()
		setInfo(data.info)
	}, [setInfo])

	useEffect(() => {
		fetchRappers()
	}, [])

	const addRapper = useCallback(async (event) => {
		event.preventDefault()
		const form = event.target
		const response = await fetch(form.action, {
			method: form.method,
			body: new URLSearchParams(new FormData(form))
		})

		const data = await response.json()

		setInfo(info => [...info, data])

		form.reset()
	}, [setInfo])

	const deleteRapper = useCallback(async (rapper) => {
		await fetch('/deleteRapper', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ stageNameS: rapper.stageName })
		})

		setInfo(info => info.filter(loopRapper => loopRapper._id !== rapper._id))
	}, [setInfo])

	const likeRapper = useCallback(async (rapper) => {
		await fetch('/addOneLike', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				stageNameS: rapper.stageName,
				birthNameS: rapper.birthName,
				likesS: rapper.likes
			})
		})


		setInfo(info => info.map(loopRapper => {
			if (loopRapper._id === rapper._id) {
				return { ...loopRapper, likes: loopRapper.likes + 1 }
			}
			return loopRapper
		}))
	}, [setInfo])


	return (
		<>
			<h1>Current Rappers</h1>
			<ul className="rappers">
				{info.map(rapper => (
					<RapperItem key={rapper._id} rapper={rapper} onLike={likeRapper} onDelete={deleteRapper} />
				))}
			</ul>

			<h2>Add A Rapper:</h2>

			<form action="/addRapper" method="POST" onSubmit={addRapper}>
				<input type="text" placeholder="Stage Name" name="stageName" />
				<input type="text" placeholder="Birth Name" name="birthName" />
				<input type="submit" />
			</form>
		</>
	)
}