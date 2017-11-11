# ReactNews开发速记

标签（空格分隔）： React Project

---
写在前边：记录ReactNews的开发思路
## 项目描述
* 使用React实现新闻资讯Web App
* 此项目为新闻咨讯的SPA Web App；PC端、移动端双端自适应
* 使用`React + ES6 + Webpack + Babel`等前端最新最热的技术
* 用户界面主要使用蚂蚁金服基于React的UI库: `Ant-Design`
* 项目采用**模块化、组件化、工程化**的模式开发
* 功能模块包括: 首页 / 用户注册登陆 / 新闻详情 / 新闻评论 /个人中心

## 技术选型
* 前台数据展现/交互/组件化
   * react -- react/react-dom
   * react-router -- 实现SPA的路由库
   * antd -- 基于react的UI库（用户界面开发）
   * redux -- 状态管理库
* 前台交互
   * axios -- 发送ajax请求
   * API接口
   * json -- 数据格式
   * postman -- 发送测试请求
* 模块化
   * ES6 -- 模块化构建
   * babel -- 编译ES6代码
* 项目构建/工程化
   * webpack  -- 项目构建工具
   * react-create-app  --快速创建react项目脚手架
   * eslint -- 语法检查

## API接口
* 全称：前后台交互API接口
* 前端API
   * 发送请求的方式
   * 请求的url
   * 请求的参数格式
   * 返回的数据格式  json/xml 
* 后端API
   * 返回的数据格式
* 接口文档

## Day1 实现新闻头部布局
### 自定义组件搭建实现基础路由（略）
* 搭建路由
   * App.jsx: 应用根路由组件
   * newsContainer.jsx: 首页显示各种新闻列表组件
   * newsDetail.jsx: 新闻详情组件
   * userCenter.jsx: 个人中心组件
   * newsHeader.jsx: 头部组件
   * index.js 入口主文件

* 完成头部，在头部路由实现newsHeader.jsx
   * **核心基于antd组件**。
   * 地址：`https://design.alipay.com/develop/web/react/introduce`

### 格栅布局（Row, Col）
* 完成页面整体划分（页面分为24份，左右各1，新闻logo占3，剩下的19份用于导航）

### 完成导航（Menu / MenuItem / Icon）
* Menu作为一个大的容器，包包裹着所有的导航细分MenuItem
  为了方便可以定义常量`const MenuItem = Menu.Item;`
* `<Menu mode="horizontal" selectedKeys={[key]} onClick={this.changeKey}>`的属性方法
   * mode 表示导航排布
   * selectedKeys -- 当前选中的菜单项，要求传参数是 数组 -- 动态的修改状态key值
* Menu -- onClick事件表示点击 menuitem 调用。有参数为 {item, key, keyPath}
* 定义changeKey方法

### 实现右边登录及个人中心
* 两种情况 -- 判断条件用户名是否为空
* 三元表达式，实现"登录/注册"和"个人中心"，对应的也是MenuItem
* 注意：个人中心是个可跳转的组件Link

### 登录注册按钮显示（Modal / MenuItem / Icon）Modal
* 主题是一个对话框Modal，内部是两个Tabs标签页
* 对话框
    ```
    <Modal title="用户中心" visible={isShow} okText="关闭" onOk={this.handleShow.bind(this, false)} onCancel={this.handleShow.bind(this, false)}>
    ```
   * title -- 显示弹窗标题
   * visible -- 对话框是否可见（布尔值）
   * okText -- 确认按钮文字；cancelText -- 取消按钮文字；
   * onOk -- 点击确定回调；onCancel -- 点击遮罩层或右上角叉或取消按钮的回调

* **技巧**：点击回调可以分开设置，但是这里用了比较高级的方法bind 
    ```
    // 定义对话框显示事件  (此处使用了比较高级的写法 -- bind(this, false)传入两个参数)
    handleShow=(isShow)=>{
        // 切换修改状态
        this.setState({isShow}); // 同名属性可以省略
    };
    ```

### 对话框实现（Tabs / Form / Input）
* Tabs标签容器两个子标签页`const TabPane = Tabs.TabPane;`
* 每个子标签里边是Form表单数据
* 表单内部则是由Input 和 Button 实现
* 以登录标签为例
	
    ```javascript
    <TabPane tab="登录" key="1" >
        <Form onSubmit={this.handleSubmit.bind(this, false)}>
            <FormItem label="用户名">
                {getFieldDecorator('username')(
                    <Input type="text" placeholder="请输入用户名" />)
        		}   // 获取表单数据的内容
            </FormItem>
            <FormItem label="密码">
                {getFieldDecorator('password')(
                    <Input type="password" placeholder="请输入用户密码" />)
                }
            </FormItem>
            <Button type="primary" htmlType="submit">登录</Button>
        </Form>
    </TabPane>
    ```

* 特别说明Form的用法

	```
	// 组件渲染暴露方式（文档API）
	class CustomizedForm extends React.Component {}
	CustomizedForm = Form.create({})(CustomizedForm);
	
	// 最后import要修改
	export default Form.create()(NewsHeader);
	```

* 经过 Form.create 包装的组件将会自带`this.props.form`属性，`this.props.form`提供的 常用API 如下：
   * `getFieldDecorator`  -- 用于和表单进行双向绑定。经过 `getFieldDecorator`包装的控件，表单控件会自动添加 `value`、`onChange`，数据同步将被 Form 接管
   * `getFieldsValue` -- 获取一组输入控件的值，如不传入参数，则获取全部组件的值
   * `resetFields` -- 重置一组输入控件的值（为 initialValue）与状态，如不传入参数，则重置所有组件

### 发送ajax请求(axios)
功能点：点击对话框中的form表单的登录、注册按钮，注册登录账号

* 依旧还是两个类似的事件，绑定事件可以使用bind，传递两个参数，根据文档事件是要绑定给Form表单的
   * button的原来的"type=submit"属性被占用了，要设置提交修改为了`htmlType="submit"` 
   * 注册 `<Form onSubmit={this.handleSubmit.bind(this, true)}>` 
   * 登录 `<Form onSubmit={this.handleSubmit.bind(this, false)}>`
* 定义处理用户登录注册的函数 handleSubmit
   * `handleSubmit = (isRegister, event) => {}` -- 传两个参数，第一个参数接收的上边bind的第二个参数布尔值，判断是注册还是登录
   * 阻止表单自动提交的默认行为（因为还没有读取数据、发送请求的呢）
   * 对比分析请求地址
   
	```
	// http://newsapi.gugujiankong.com/Handler.ashx?action=register&username=undefined&password=undefined&r_userName=abc&r_password=123123&r_confirmPassword=123123
	```
   
   * url中包含 action、username、password、r_username、r_password、r_confirmPassword 这六个参数需要获取拼串得到请求地址
   * action -- "isRegister"的布尔值判断发送请求的类型"login/register"（三目表达式）
   * 其他五个数据 -- `this.props.form.getFieldsValue()`(对象的解构赋值)
   * 模板字符串拼串得到url，准备工作完成发送请求 axios
   * 请求逻辑点（是否成功能达到数据、请求类型注册还是登录、登录成功要修改初始化状态）（if...else语句）提示
   * 消息提示 message组件 `message.success('恭喜您，注册成功');`

	```
	// code参照
	axios.get(url)
	    .then((response) =>{
	        let data = response.data;
	        // 判断是注册还是登录
	        if(isRegister){  // 注册
	            message.success('恭喜您，注册成功');
	        }else{  // 登录
	            // 判断是否登录成功
	            if(data){
	                message.success('恭喜您，登录成功');
	                // 跳转到个人中心显示  修改状态
	                this.setState({
	                    username : data.NickUserName,
	                    userId : data.UserId,
	                });
	
	                // 将用户数据存储在内存中（优化逻辑）
	                let {username, userId} = this.state;
	                let obj = {username, userId};
	                localStorage.setItem('person_key', JSON.stringify(obj));
	
	            }else{
	                message.error('很遗憾，登录失败');
	            }
	        }
	
	    })
	    .catch((error) =>{
	        console.log(error);
	    });
	
	// 登陆完毕，关闭弹窗  修改状态
	this.setState({isShow :false});
	};
	```

### 点击用户退出
* 更新状态`username : null, userId : null`

### 细节优化
* 切换tabs输入的数据要清空
`<Tabs onChange={()=>{this.props.form.resetFields()}}>`  -- 高级用法
* 退出按钮，修改弹窗显示
* 将用户登录信息保存在本地内存里，当用户刷新页面时不会是重新登录的bug 。**数据保存json格式**
   * `localStorage.setItem('person_key', JSON.stringify(obj));` 
* 用户点击退出的时候，除了右上角按钮变为"登录/注册"状态外，还要清空localStorage内数据
   * `localStorage.removeItem`


## Day2 实现新闻首页
* 对应的是newsContainer.jsx组件

### 格栅布局（Row, Col）
### 轮播图（Carousel）
### **封装组件**（NewsImgBlock）
* 根据分析发现页面中有三部分都是一样的结构，整体思路都是请求数据然后把信息渲染返回到页面上
* 结构是一个卡片（Card），里边是请求的数据动态显示
* 分析定义形参
   * title -- 卡片的标题不一致
   * count -- 请求回来的数据数量不一致
   * type -- 请求的新闻数据不一致（国内？国际？娱乐...）
   * width -- 卡片的宽度不一致
   * imgWidth -- 显示的每张图片宽度

* 封装组件NewsImgBlock
   * 封装组件的目的复用，简化开发。封装组件需要注意的有：有多少个形参？规定props属性的必要性和数据类型，避免参数错误
   * 定义实现基本组件
   * 规定props属性的必要性和数据类型 -- 注意 `import PropTypes from 'prop-types';`
   * 整体是一个Card插件
   * 初始化数据状态 -- 请求回来的数据是一个数组，状态定义一个空数组就好
   * 页面将要挂载请求数据（原理更前边的注册登录请求原理一样）
   * 从props上拿到传递过来的形参数据，
   * 拿到请求数据，根据数据数组的长度做判断（一定要考虑没有请求到数据的情况，三目表达式）
   * 遍历拿到的数组，然后添加到标签中(整体是个a标签 Link)，拿到对应需求数据

    ```javascript
    // 部分code
    let newsList= newsArr.length ?
	    (
	        newsArr.map((item, index) => {
	            return (
	                <div key={index}>
	                    <Link to={`/news_detail/${item.uniquekey}`}>
	                        <div>
	                            <img style={{width: imgWidth}} src={item.thumbnail_pic_s} alt=""/>
	                        </div>
	                        <div style={{width: imgWidth}}>
	                            <h3 >{item.title}</h3>
	                            <p>{item.author_name}</p>
	                        </div>
	                    </Link>
	                </div>
	            )
	        })
	    )
	: '暂时没有获取到新闻推送';
    ```

* 底部两行图片新闻列表复用组件，传递修改参数即可

### 中间的NewsListBlock
* 原理相似，不过请求参数只用 `count type` 就好，在刚才封装的组件基础上完成即可
* 需要注意的是新闻列表显示样式  -- 文字不换行超出文字点点点显示

	```
	// 设置文字不换行，超出的文字省略号显示
    .className {
        white-space: nowrap;    <!--文字不换行-->
        overflow: hidden;     <!--超出文字隐藏-->
        text-overflow: ellipsis; <!--多余文字点点点  记忆"文本-隐藏"-->
    }
	```

## Day3 新闻详情页及个人中心
### 新闻详情的请求实现
* 操作 `newsDetail` 路由
* 页面布局（略）
* 发送新闻请求拿到数据，本项目中获取新闻数据是来自`response.data.pagecontent`（根据分析postman请求的数据分析）
* **将请求的数据显示出来**
`<div dangerouslySetInnerHTML={{__html:news}}></div>`
   * `dangerouslySetInnerHTML` -- 让React正常显示你的html代码
   * `{__html : ...} 是两个下划线` -- 后边跟要显示的HTML代码内容。
   * 此功能主要被用来与 DOM 字符串操作类库一起使用，要求提供的 HTML 必须要格式清晰。

### 请求对应新闻下的评论
* 为了方便清晰，放在`NewsComments`组件中
* 请求当前新闻下的评论 ，前边的新闻newsId要先传过来
  `<NewsComments newsId={this.props.params.newsId}/>`
* 定义函数请求评论的函数
   * 组件将要接收props数据或者是接收的props数据发生改变的时候调用的函数 -- `componentWillReceiveProps(nextProps){}`
   * 准备url，拿到对应的数据。response.data得到的是一个大的数组里边包含该新闻的所有评论，比较多的。而且请求的数据有很多我们用不上的信息，可以对获取到的数据做一个简单的过滤处理
   * 调用map方法返回的还是一个数组，拿到的数组每一个是一个对象，里边包含三个属性`username`、`dateTime`、`comment`，更新状态（要先初始化状态哒）
   * 遍历评论，ul-->li-->Card 。 Card有一个属性`extra`文字右上角显示
   * 注意考虑没有评论的情况，根据`comments.length`做三目表达式判断

### 评论下边可以添加评论的Form表单
* 用法跟前边一样，需要注意的几点
* 使用表单时 -- `Form.create()(组件名)`
* 获取双向绑定的数据 -- `this.props.form.getFieldDecorator;`

* `<FormItem label="您的评论" labelCol={{span: 2, offset: 11}}>` -- labelCol属性，可以调整label的位置
* `<Input type="textarea" style={{resize: 'none'}} />` -- textarea输入框设置 `resize: 'none'` ，取消可调整大小（右下角没有了三道杠）

### 评论下边的两个按妞的回调
* 两个按钮 -- 放在Row和Col中布局，`<Col span={6} push={10}>`-- span表示按钮的占位宽度，push表示移动按钮的位置向右
* 提交评论的属性函数是Form的方法`onSubmit={this.handleSubmit}`
* 先要阻止默认行为，收集发送请求的url拼串数据
   * userId -- 从 localStorage获取，本身是json数据要转成obj，考虑到可能拿不到数据的情况
   * 拿不到数据就是用户没有登录 -- 所以要做if判断的
   * newsId -- `this.props.newsId;`
   * comment -- `this.props.form.getFieldValue('comment');`
   * 得到url,发送axios请求
   * message提示一下 -- `message.success()`
   * 提交完数据清空 --`this.props.form.resetFields();`  
   * `注意：resetFields()会自动刷新评论列表的` -- **默认功能**
* 收藏文章的Button同理 -- `方法handleCollection`
   * 中间请求逻辑(略)
   * 收藏成功或失败的提示 -- notification组件
	
	```
	notification['success']({
	    message: 'ReactNews',
	    description: '收藏成功',
	});
	``` 
 
* 右侧新闻列表用昨天封装的`NewsImgBlock`组件就可以，注意先要引入

### 点击右侧新闻实现新闻详情的同步刷新
* 需求说明，当我们点击右侧的新闻列表时，新闻详情可以同步刷新跳转到该新闻下，同时评论也得过来
* 点击旁边的新闻时，newsId修改了，触发了`componentWillReceiveProps`事件
* `componentWillReceiveProps`：表示当外部通过标签属性的方式向当前组件传递数据的时候调用，多次调用

```
// 请求评论数据
componentWillMount(){
    let newsId = this.props.params.newsId;
    this.getNews(newsId);
}

// 切换新闻，组件将要接收props数据或者是接收的props数据发生改变的时候调用的函数
componentWillReceiveProps(nextProps){
    let newsId = nextProps.params.newsId;  // 注意不要拿错了
    this.getNews(newsId);
}

// 封装获取新闻的自定义函数(提出来的公共方法)
getNews = (newsId) => {
    let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey=${newsId}`;
    axios.get(url)
        .then(response => {
            let data = response.data;
            this.setState({news: data.pagecontent});
        })
        .catch(error => {
            console.log(error);
        })
};
```

### 个人中心
* 基础布局（Row, Col, Tabs, Card）
* 我的评论和我的收藏文章列表
   * `componentWillMount` -- 在将要挂载前就要请求到数据
   * 请求数据 -- 别忘了考虑用户没有评论和收藏的 -- 三目表达式
   * 可以点击查看 -- `extra={ <Link to={}>查看</Link> }` 
* **上传图片** -- 照片墙

```
// 学会找轮子
import { Upload, Icon, Modal } from 'antd';

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };

  handleCancel = () => this.setState({ previewVisible: false })
  
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          multiple="true"  // 表示可以一次性添加多张照片
        >
          {fileList.length >= 3 ? null : uploadButton}  // 超过三张就不开以添加了，即uploadButton不显示
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<PicturesWall />, mountNode);
```
## 一点思考
* 学会找轮子
* 学会造轮子

-----
创建时间  2017-10-23 By MarlonChiu 