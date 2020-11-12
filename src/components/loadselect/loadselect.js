// CommentListContainer.js
import React, { Component } from 'react';
import Select from './select';



export default class AsyncSelectContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data : []
        }
    }

    loadOptions = async () => {
        var b = [
            { value: 'vanilla', label: 'Vanilla', rating: 'safe' },
            { value: 'chocolate', label: 'Chocolate', rating: 'good' },
            { value: 'strawberry', label: 'Strawberry', rating: 'wild' },
            { value: 'salted-caramel', label: 'Salted Caramel', rating: 'crazy' },
        ]
        console.log("Log",process.env.REACT_APP_SAC_API + this.props.selectUrl, this.props.selectUrl)
        //return b
        let a= await fetch(process.env.REACT_APP_SAC_API + this.props.selectUrl)
        console.log("data", a)
        return a
    }
    
    componentDidMount(){
        let a = 
        this.setState(this.state.data, this.loadOptions)
    }


    render() {
        return (
            <Select selectName="motivo" data={this.state.data}/>
        );
    }
}