import React from 'react';
import { withRouter} from 'react-router';//高阶组件
const Hello = (props) =>{
    console.log(props);
    return(
        <div><button onClick={()=>props.history.push('/about')}>Hello</button></div>
    )
}
const WithRouterHello = withRouter(Hello); //通过我们的高阶组件包裹之后，让一个普通组件也可以拥有自己的路由属性，
                                            //然后就可以像其他组件一样获取数据，跳转路由操作了
class Home extends React.Component{
    state={
        profile:null
    }
    chooseProfile = () =>{
        //如果想要在非顶层作用域引入组件的话，可以通过这种回调函数的形式去引入
        import('./Profile').then((mod)=>{
            this.setState({
                profile:mod.default
            })
        })
    }
    render(){
        const {profile:Profile} = this.state
        return(
            <div>
                <button onClick={() => this.props.history.push('/about')}>click me</button>
                <p>Home Page</p>
                {
                    Profile!==null
                    ?<Profile/>
                    :<button onClick={()=>this.chooseProfile()}>chooseProfile</button>
                }
                <WithRouterHello />
            </div>
        )
    }
}
export default Home;