import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux';
import {addData,addDataAsync} from './actions/counter';
import {get_user} from './actions/user';
import About from './components/About';
import Home from './components/Home';
import NoMatch from './components/Error';
import { BrowserRouter as Router,
   Route,
   Link,
   NavLink,
   Switch,
   Redirect
} from "react-router-dom";
//定义一个临时使用得无状态组件
//这里可以用es6的语法取出{match}
const User= (props) =>{
  console.log(props);
  //以下几种方式都可以获取到路由传递过来的参数
  var paramter = new URLSearchParams(props.location.search);//获取地址栏传过来的值
  console.log(paramter.get("name"));
  console.log(paramter.get("a"));
  console.log(props.location.hash);//获取hash属性用于定位到某一个组件中
  console.log(props.location.state.fromDashboard);//获取link组件中定义的state传过来的值，不会显示在地址栏中
  return(
    // props.match.params.id === 'zhouwh'?
    // <Redirect to="/" /> :
    <div>User {props.match.params.id}</div>//获取路由中传过来的值
  )
}
//自定义link组件
// const MenuLink = ({children,to,exact}) =>{
//   const match = window.location.pathname === to
//   return(
//     <NavLink activeStyle={match ? {color:'green'} :{}}  to={to}>
//       {match?'>':''}{children}
//     </NavLink>
//   )
// }
//在react中，jsx语法，箭头函数中的()=>{return()}可以简写成()=>()
const MenuLink = ({children,to,exact}) =>{
  return(
    <Route path={to} exact children = {({match})=>(
      <NavLink activeStyle={match ? {color:'green'} :{}}  to={to}>
          {match?'>':''}{children}
      </NavLink>
    )} />
  )
}

//定义配置式路由
const routes = [
  {
    path:'/',
    component:Home,
    exact:true
  },
  {
    path:'/about',
    component:About,
    exact:true,
    strict:true
  }
]
//定义动态组件，当我们遇到页面内容较多，加载较慢的时候使用这种方案
class DynamicImport extends React.Component{
  state = {
    component:null
  }
  //在新版本的React中componentWillMount可能会失效，可以使用componentDidMount
  //将要装载，在render之前调用；
  componentWillMount(){
      this.props.load()
      .then((mod)=>this.setState({
        component:mod.default
      }))
  }
  render(){
    //接收传入的所有子节点
    return this.props.children(this.state.component)
    //接收到子节点后，将我们的当前组件传入到子节点中去
  }
}
//动态加载我们的组件
const Profile = (props) =>(
  <DynamicImport load={()=> import('./components/Profile')}>
    {(Component)=>Component === null
      ? <h1>Loading...</h1>
      :<Component {...props} />
    }
  </DynamicImport>
)
class App extends Component {
  handleClick = () =>{
    console.log(this.props);
  }
  render() {
    //这里的props里面的这些属性是我们的connect函数连接state返回之后的一个dispatch
    const {counter,addData,addDataAsync,get_user} = this.props;
    const {isFetching,error,user} = this.props.user;//这里的this.props.user指的是user
    let data;
    if(error){
      data = error;
    }else if(isFetching){
      data = "Loading...";
    }else{
      data = user && user.data[0].email;//如果user是一个{}空对象，就会报错，告诉我们user不是一个react的子对象
    }
    return (
      <Router>
         <div className="App">
            <p className="App-intro">
            {counter}
            </p>
            <p>
            <button onClick={addData}>+</button>
            <br/>
            <button onClick={addDataAsync}>async +</button>
            <br/>
            <button onClick={get_user}>Get User</button>
            </p>
            <h1>{data}</h1>
            <ul>
              <li><MenuLink exact to="/" >Home</MenuLink></li>
              <li><MenuLink exact to="/profile" >Profile</MenuLink></li>
              <li><MenuLink exact to="/about" >About</MenuLink></li>
              <li><NavLink exact to="/error" activeStyle={{color:'green'}}>Error</NavLink></li>
              <li><NavLink exact to="/users/zhouwh" activeStyle={{color:'green'}}>zhouwh</NavLink></li>
              <li>
                <Link to={{
                  pathname:"/users/profile/zhouwh123",
                  hash: "#the-hash",
                  search:"?a=b&name=222",
                  state: { fromDashboard: true }
                }}>to Object</Link>
              </li>
            </ul>
            <div>
              <button onClick={()=> this.handleClick()}>push</button>
            </div>
            <Switch>
              {routes.map((route)=>(
                  <Route key={route.path}
                    path={route.path}
                    component={route.component}
                    {...route}
                  />
              ))}
              {/* <Route exact path="/" component={Home} />
              <Route strict exact path="/about"  component={About} /> */}
              <Route path="/newhome"  render={(props)=> <Home {...props} />} />
              <Route exact path="/profile" component={Profile} />
       
              <Route path="/users/profile/:id" component={User} />
              <Redirect from="/users/:id" to="/users/profile/:id" />
              <Route  component={NoMatch} />
            </Switch>
          </div>
      </Router>
     
    );
  }
}
const mapStateToProps = (state) => {
  return{
    counter:state.counter,
    user:state.user
    //这里的counter对应的就是我们的reducers返回的counter
  };
};
//这里的addData是我们自己定义的action
//connect的第二个参数
//如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，对象所定义的方法名将作为属性名；
//每个方法将返回一个新的函数，函数中dispatch方法会将 action creator 的返回值作为参数执行。
//这些属性会被合并到组件的 props 中
export default connect(mapStateToProps,{addData,addDataAsync,get_user})(App);
