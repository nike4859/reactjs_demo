var CommentBox = React.createClass({
	getInitialState: function(){
		return {data:[]};
	},
	loadCommentsFromServer: function(){
		$.ajax({
			url:this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data){
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err){
				console.error(this.props.url, status, err.toString());
			}.bind(this)

		});
	},
	componentDidMount: function(){
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	render: function(){
		return(
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm />
			</div>
			);
	}
	});

var CommentList = React.createClass({
	render: function(){
		var commentNodes = this.props.data.map(function(comment){
			return(
				<Comment author={comment.author} key={comment.id}>
					{comment.text}
				</Comment>
			);
		});
		return(
			<div className = "commentList">
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	render: function(){
		return(
			<div className="commentForm">
				<form className="commentForm">
					<input type="text" placeholder="Your name" />
					<input type="text" placeholder="Say something..." />
					<input type="submit" value="Post" />
				</form>
			</div>
		);
	}
});

var Comment = React.createClass({
	rawMarkup: function(){
		var rawMarkup = marked(this.props.children.toString(), {sanitize:true});
		return {__html: rawMarkup};
	},
	render: function(){
		return(
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<span dangerouslySetInnerHTML={this.rawMarkup()} />
			</div>
		);
	}
});

var data = [
	{id:1, author: "Pete Hunt", text:"This is one comment"},
	{id:2, author: "Jordan Walke", text:"This is *another* comment"}
];

ReactDOM.render(
	<CommentBox url="http://localhost:3000/api/comments" pollInterval={2000}/>,
	document.getElementById('content')
);


