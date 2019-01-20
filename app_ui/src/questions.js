import React, { Component } from 'react';
import Answer from "./answer";

export class Questions extends Component{

    constructor(props){
        super(props);
        this.state = {
            answer : ""
        }
    }

    handleAnswerChange = (e) => {
        this.setState({answer:e.target.value})
    }

    postAnswer = () => {
        this.props.postAnswer(this.props.id, this.state.answer);
    }


    render(){
        let self = this;
        return(
            <div className = "postCards">
                <div className="demo-card-wide mdl-card mdl-shadow--2dp">
                    <div className="mdl-card__title">
                        <h2 className="mdl-card__title-text"><b>{this.props.question}</b></h2>
                    </div>
                    {
                        this.props.answer.map(function(item, i) {
                            // console.log(item)
                            return <Answer key={i} ans = {item} questionID={self.props.id} ansId={i} upvote={self.props.upvote}/>
                        })
                    }
                    <div className="mdl-card__supporting-text">
                        <div className="mdl-textfield mdl-js-textfield">
                            <textarea className="mdl-textfield__input" type="text" placeholder="Write your answer..." rows= "2" id="sample5" value = {this.state.answer} onChange={this.handleAnswerChange} ></textarea>
                        </div>
                    </div>
                    <div>
                        <button className="btn mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick = {this.postAnswer}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        )
    } 
}

export default Questions;
