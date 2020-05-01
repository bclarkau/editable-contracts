import React from "react";

/**
 * Header includes contract title and QR code
 * @property {Object} event The event object
 * @property {String} link The URL to the current contract
 */
export const Header = props => {
	let title = props.event ? <div className="title">
		<h1 className="name">
			<span className="name__line1">Hotel</span>
			<span className="name__line2">Contract #{props.event}</span>
		</h1>
		<div className="qrcode">
			<div className="qrcode__image"><img src={`https://api.qrserver.com/v1/create-qr-code/?data=${props.link}`} /></div>
		</div>
	</div> : false;

	return (
		<header>
			<div className="container">
				<div className="brand">
					<div className="brand__logo">benclark.dev</div>
					<div className="brand__slogan">Editable contracts demo</div>
				</div>
				{title}
			</div>
		</header>
	)
}

/**
 * Footer
 */
export const Footer = props => {
	return (
		<footer>
			&sup1; rate per room, per night. Lorem ipsum dolor sit amet, consectetur adipisicing elit. At nemo nihil fugit 
			quisquam magnam consectetur sapiente deserunt accusantium veniam eaque ad ullam fuga, reprehenderit animi sit 
			similique repellendus. Possimus, similique. Ut explicabo repellendus vel nemo veritatis est, voluptatum pariatur 
			ullam quod voluptate. Natus, ab molestias qui rem adipisci labore sunt eius iste. Developed by Ben Clark <a href="https://benclark.dev">https://benclark.dev</a>
		</footer>
	)
}