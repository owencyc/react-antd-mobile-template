import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { testEvent } from '../../redux/actions'
import { allComments } from '../../services'

class test extends Component {
    constructor(props){
        super(props);
        this.state={
            content:''
        }
        
    }
    componentDidMount(){
        allComments().then(data=>{
            console.log(data);
        })
    }
    render() {
        const change=(e)=>{
            this.setState({content:e.target.value})
        }
        return (
            <div>
                <input type='text' value={this.state.content} onChange={change.bind(this)}/>
                <p>state的双向绑定：{this.state.content}</p> 
                <input type="button" value='点击测试(redux)' onClick={()=>{this.props.testClk(this.state.content)}}/>
                <p>reducer全局存储：{this.props.hh}</p> 
                <input type="button" value='跳转' onClick={()=>{this.props.move()}}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    //console.log('main inject:');
    console.log(state.reducer1);
    return state.reducer1
  }

const mapDispatchToProps = dispatch => ({
    testClk:content=>dispatch(testEvent(content)),
    move:()=>{dispatch(push({ pathname: '/search' }))},
  })

export default connect(mapStateToProps, mapDispatchToProps)(test);