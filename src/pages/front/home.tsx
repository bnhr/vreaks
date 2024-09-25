import { Link } from 'react-router-dom'
import Button from '~/components/base/button/button'
import useCounterState from '~/store/counter'

function HomePage() {
	const { count, increase, decrease } = useCounterState()

	return (
		<div>
			<p>hello world</p>

			<Link to="/login">login</Link>

			<div className="ml-12 mt-12">
				<Button onClick={increase}>increase</Button>
				<p>{count}</p>
				<Button onClick={decrease}>decrease</Button>
			</div>
		</div>
	)
}

export default HomePage
