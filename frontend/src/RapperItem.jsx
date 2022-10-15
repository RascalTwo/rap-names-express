export default function RapperItem({ rapper, onDelete, onLike }) {
	return (
		<li className="rapper">
			<span>{rapper.stageName}</span>
			<span>{rapper.birthName}</span>
			<span>{rapper.likes}</span>
			<span className="fa fa-thumbs-up" onClick={() => onLike(rapper)}></span>
			<span className="fa fa-trash" onClick={() => onDelete(rapper)}></span>
		</li>
	)
}