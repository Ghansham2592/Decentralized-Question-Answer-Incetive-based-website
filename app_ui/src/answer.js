import React, {Component} from 'react';

class Answer extends Component {

    constructor(props){
        super(props);
        this.state = {
            question : ""
        }
    }



    upvote = () => {
        this.props.upvote(this.props.questionID, this.props.ansId);
    }

    render() {
    	return(
            <div className="answerList">
                <div className = "message">
                    <div className = "answer">

                            <b>{this.props.ans[4].toString()}</b><br></br>
                            {this.props.ans[0]}
                    </div>
                    <div className = "upvote">
                        <button onClick={this.upvote}><i className="fas fa-thumbs-up"></i><span>   Upvote</span></button>
                    </div>
                    <div className = "upvoteCount">
                        {this.props.ans[1].toNumber()}
                    </div>
                </div>
                <div className="mdl-card__actions mdl-card--border temp"></div>
            </div>)
    }
}

export default Answer;