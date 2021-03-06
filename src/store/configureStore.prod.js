import {createStore,applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import rootSaga from '../sagas'
//引入redux-saga中间件
import createSagaMiddleware from 'redux-saga';
const configureStore = (preloadedState) => {
    //使用saga构造器创建sagaMiddleware中间件
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(sagaMiddleware) //使用我们的saga中间件
       
    )
    //通过saga中间件运行一个saga进程,这里传入的参数是我们自己写的监听异步action的generator函数
    sagaMiddleware.run(rootSaga);
  return store;
}
export default configureStore;