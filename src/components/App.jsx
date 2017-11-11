import React, { Component } from 'react';
import NewsHeader from './newsHeader';
import NewsFooter from './newsFooter';

class App extends Component {
  render() {
    return (
        <div>
            <NewsHeader />
            {/*在当前组件(App)下请求子路由组件,目前下边有三个组件(NewsContainer NewsDetail UserCenter)*/}
            {this.props.children}
            <NewsFooter />
        </div>
    );
  }
}

export default App;
