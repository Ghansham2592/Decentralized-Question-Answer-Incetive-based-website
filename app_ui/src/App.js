import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './header';
import Questions from "./questions";
import TruffleContract from 'truffle-contract'
import PostQuestion from "./postquestion";
import Web3 from 'web3';
import AnswerIT from '../../backend/build/contracts/AnswerIT.json'; 

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            contracts : {},
            account : '0x0',
            questions : [],
            questionCount : 0
        }

        if (typeof window.web3 === 'undefined') {
            this.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        } else {
            var myWeb3 = new Web3(window.web3.currentProvider); 
            myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;

           this.web3Provider = window.web3.currentProvider;
        }

        this.web3 = new Web3(this.web3Provider)
        this.AnswerIT = TruffleContract(AnswerIT)
        this.AnswerIT.setProvider(this.web3Provider)


    }

    postAnswer = (id, answer) => {
        this.contracts.PostAnswer(id, answer, { from: this.state.account, gas:3000000 })
        this.getQuestions();
    }

    postQuestion = (question) => {
        this.contracts.PostQuestion(question,  { from: this.state.account, gas:3000000 });
        this.getQuestions();
    }

    getQuestions = () => {
        var self = this;
        self.state.contracts.msgCount().then(function(msgCount){

            var questions = [];

            for (var i = 0; i < msgCount.toNumber(); i++) {
                self.state.contracts.Messages(i).then(function(q){
                    var numAnswers = q[5].toNumber();
                    var id = q[1].toNumber();
                    var allAnswers = [];
                    if(numAnswers == 0) {
                        q.push(allAnswers)
                        questions.push(q);
                        self.setState({questions:questions})

                    } else {
                        for(let j = 0; j < numAnswers; j++) {
                            var answers = [];
                            var upvoteCounts = [];
                            var upvoteValues = [];
                            var ownerAddress = [];

                            self.state.contracts.IterateAnswers(id, j).then(function(answer){
                                answers.push(answer);
                                self.state.contracts.GetUpvoteCount(id,j).then(function(upvoteCount) {
                                    upvoteCounts.push(upvoteCount);
                                    self.state.contracts.GetUpvoteValue(id,j).then(function(upvoteValue){
                                        upvoteValues.push(upvoteValue);
                                        self.state.contracts.GetOwnerAddress(id,j).then(function(owner) {
                                            ownerAddress.push(owner);
                                            if(j == numAnswers - 1)
                                                self.setAnswers(answers, upvoteCounts, upvoteValues, ownerAddress, numAnswers, q, questions)
                                        })
                                    })
                                })
                            })
                        }
                    }

                })
            }
        })


    }

    setAnswers = (answers, upvoteCounts, upvoteValues, ownerAddress, numAnswers, q, questions) => {
        var allAnswers = [];
        for(let x = 0; x < numAnswers; x++) {
            allAnswers.push([answers[x], upvoteCounts[x], upvoteValues[x], ownerAddress[x], "User"+(x+1).toString()])
        }
        
            q.push(allAnswers);
            questions.push(q);
            this.setState({questions:questions})
        
    }

    componentDidMount = () => {
        this.web3.eth.getCoinbase((err, acc)=>{
            this.setState({account : acc});
            this.AnswerIT.deployed().then((instance) => {
                this.contracts = instance;
                this.setState({contracts : this.contracts}, function(){
                    this.getQuestions();
                })
            })
        });
    }


    handleUpvote = (quesId, ansId) => {
        this.contracts.UpvoteAnswer(quesId, ansId,  { from: this.state.account, gas:3000000 });
    }

    render = () => {
        var self = this;
        return (
            <div className="App">
                <Header />
                <div className="posts">
                    <PostQuestion question={this.postQuestion}/>
                    <div className="questions">
                    { this.state.questions.map(function(item, i){
                        return <Questions key={i} username={item[0]} question={item[2]} answer={item[8]} id= {item[1].toNumber()} postAnswer={self.postAnswer} upvote={self.handleUpvote}/>
                        })
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export default App;