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
	handleCommentSubmit: function(comment){
		//optimistic updates ,先把資料更新至UI上，再執行送出
		var comments = this.state.data;
		comment.id = Date.now();//臨時給一個ID，此範例給是用時間
		var newComments = comments.concat([comment]);//串接資料
		this.setState({data: newComments});//把佔存資料存入state
		
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'POST',
			data: comment,
			success: function(data) {
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err){
				this.setState({data: comments});//發生錯誤就還原回來
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	//componentDidMount is a method called automatically by React after a component is rendered for the first time. 
	componentDidMount: function(){
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	//把handleCommentSubmit的Function當成props(onCommentSubmit)傳
	render: function(){
		return(
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit} />
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
	getInitialState: function(){
		return {author: '', text: ''};
	},
	handleAuthorChange: function(e){
		this.setState({author: e.target.value});
	},
	handleTextChange: function(e){
		this.setState({text: e.target.value});
	},
	handleSubmit: function(e){
		e.preventDefault();//阻止送出表單
		var author = this.state.author.trim();
		var text = this.state.text.trim();
		if(!text || !author){//empty
			return;
		}
		this.props.onCommentSubmit({author: author, text: text});
		this.setState({author: '' ,text: ''});//clear form
	},
	render: function(){
		return(
			<div className="commentForm" onSubmit={this.handleSubmit}>
				<form className="commentForm">
					<input type="text" placeholder="Your name"
						value={this.state.author}
						onChange={this.handleAuthorChange}
					 />
					<input type="text" placeholder="Say something..." 
						value={this.state.text}
						onChange={this.handleTextChange}
					/>
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


