import React from 'react';
import { Prompt } from 'react-router-dom'; //判断拦截跳转其他路由前，当前路由的输入框或者其他可编辑表单如果有内容就进行弹出提示，
                                           //让用户确认是否跳转
class About extends React.Component{
    state = {
        name:""
    }
    render(){
        return(
            <div>
                <Prompt 
                    when={!!this.state.name}
                    message="Are you sure want to leave?"
                />
                <div>About Page</div>
                <div>
                    <input 
                        value={this.state.name}
                        type="text" 
                        onChange={e=> this.setState({name:e.target.value})}
                    />
                </div>
            </div>
        )
    }
    
}
export default About;