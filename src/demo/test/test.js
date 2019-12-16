import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd-mobile'
import { push } from 'connected-react-router'
import { testEvent } from '../../redux/actions'
import { allComments } from '../../services'
import config from '../../config/hoc';

@config({
    title: '测试测试测试',
    fetch: true,
    connect(state) {
      return {
        home_prop: state.home,
      };
    }
  })
class test extends Component {
    constructor(props){
        super(props);
        console.info('test props',props)
        this.state={
            content:''
        }
        
    }
    componentDidMount(){
        this.props.fetch.get().then(res => {
          console.log(res);
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
                <Button type='primary' onClick={()=>{this.props.action.home.changeValue('chenyc')}}>点击测试(redux)</Button>
                <p>reducer全局存储：{this.props.home_prop.value}</p> 
                <input type="button" value='跳转' onClick={()=>{this.props.action.system.go({ pathname: '/' })}}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    //console.log('main inject:');
    console.log(state);
    return state
  }

const mapDispatchToProps = dispatch => ({
    testClk:content=>{
        console.log(content)
        dispatch(testEvent(content))
    },
    move:()=>{dispatch(push({ pathname: '/search' }))},
  })

export default test;