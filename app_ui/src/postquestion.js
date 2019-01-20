import React, {Component} from 'react';

class PostQuestion extends Component {

    constructor(props){
        super(props);
        this.state = {
            question : ""
        }
    }

    handlePostChange = (e) => {
        this.setState({question:e.target.value})
        // console.log(this.props)
    }

    postQuestion = () => {
        this.props.question(this.state.question);
    }

    render() {
    	return(
            <div>
                <div className="postQuestion demo-card-wide mdl-card mdl-shadow--2dp">
                    <div className="mdl-card__supporting-text">
                        <div className="mdl-textfield mdl-js-textfield">
                            <textarea className="mdl-textfield__input" type="text" placeholder="Write your question here..." rows= "2" id="sample5" value = {this.state.question} onChange={this.handlePostChange}></textarea>
                        </div>
                    </div>
                    
                    <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick = {this.postQuestion}>
                        Post
                    </button>
                    
                </div>
            </div>)
    }
}

export default PostQuestion;