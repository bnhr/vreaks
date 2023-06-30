import { truncateText } from '~/utils'

const longText =
	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit labore amet consequatur perspiciatis pariatur quod illo, maxime porro cumque deserunt aliquid aut minus atque cupiditate nostrum consequuntur doloremque reiciendis unde, aspernatur esse? Neque animi exercitationem in debitis earum perspiciatis dignissimos!'

function AboutPage() {
	return (
		<div>
			<p>hello world</p>
			<p>{truncateText(longText, 20)}</p>
		</div>
	)
}

export default AboutPage
