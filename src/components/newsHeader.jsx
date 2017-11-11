import React, { Component } from 'react';
import {Link} from 'react-router';
import axios from 'axios';

import {
    Row,
    Col,
    Menu,
    Icon,
    Button,
    Modal,
    Tabs,
    Form,
    Input,
    message
} from 'antd';

import logo from '../images/logo.png';

const MenuItem = Menu.Item;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class NewsHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            key : "top",
            username : null,
            userId : null,
            isShow : false
        }
    }

    // 页面将要加载时
    componentWillMount(){
        // 读取数据判断用户是否已经登录
        let obj = JSON.parse(localStorage.getItem('person_key'));
        if(obj){ // 用户已经登录
            this.setState({
                username : obj.username,
                userId : obj.userId
            })
        }
    }
    // 定义点击MenuItem切换key的方法
    changeKey =({item, key})=>{
        // 判断是否点击登录注册
        if(key === "loginAndRegister"){
            this.setState({isShow :true});
            // 点击登录注册之后表单输入的内容要清空
            this.props.form.resetFields();
        }
        // 切换修改状态
        this.setState({key});
    };

    // 定义对话框显示事件  (此处使用了比较高级的写法 -- bind(this, false)传入两个参数)
    handleShow=(isShow)=>{
        // 切换修改状态
        this.setState({isShow});
    };

    // 定义切换tabs面板的回调（切换过后输入的信息清空）
    // handleClean = () => {
    //   // 清空表单项输入的内容
    //   this.props.form.resetFields();
    // };

    // 定义用户登录注册 handleSubmit
    handleSubmit = (isRegister, event) => {
        // 取消默认注册行为
        event.preventDefault();
        // http://newsapi.gugujiankong.com/Handler.ashx?action=register&username=undefined&password=undefined&r_userName=abc&r_password=123123&r_confirmPassword=123123
        // 发送ajax请求
        let action = isRegister ? 'register' : 'login';
        // 获取到表单输入的数据
        let {username, password, r_userName, r_password, r_confirmPassword} = this.props.form.getFieldsValue();
        let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=${action}&username=${username}&password=${password}&r_userName=${r_userName}&r_password=${r_password}&r_confirmPassword=${r_confirmPassword}`;
        // 发送请求
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
                        // 跳转到个人中心显示
                        // 修改状态
                        this.setState({
                            username : data.NickUserName,
                            userId : data.UserId,
                        });

                        // 将用户数据存储在内存中
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

    // 定义用户退出回调
    handleOut = () => {
        this.setState({
            username : null,
            userId : null
        });
        // 清空内存登录数据
        localStorage.removeItem('person_key');
    };

    render() {
        let {key, username, isShow} = this.state;
        let {getFieldDecorator} = this.props.form;
        let userItem = username ?
            (
                <MenuItem  className="register" key="userCenter" >
                    <Button type="primary">{username}</Button>&nbsp;
                    <Button type="dashed"><Link to="/user_center">个人中心</Link></Button>&nbsp;
                    <Button onClick={this.handleOut}>退出</Button>
                </MenuItem>
        ) : (
                <MenuItem  className="register" key="loginAndRegister" >
                    <Icon type="appstore" />登录/注册
                </MenuItem>
            );
        return (
            <div>
                <Row>
                    <Col span={1}></Col>
                    <Col span={3}>
                        <div className="logo">
                            <img src={logo} alt="logo"/>
                            <span>ReactNews</span>
                        </div>
                    </Col>
                    <Col span={19}>
                        <Menu mode="horizontal" selectedKeys={[key]} onClick={this.changeKey}>
                            <MenuItem key="top">
                                <Icon type="appstore" />头条
                            </MenuItem>
                            <MenuItem key="shehui">
                                <Icon type="appstore" />社会
                            </MenuItem>
                            <MenuItem key="guonei">
                                <Icon type="appstore"/>国内
                            </MenuItem>
                            <MenuItem key="guoji">
                                <Icon type="appstore"/>国际
                            </MenuItem>
                            <MenuItem key="yule">
                                <Icon type="appstore"/>娱乐
                            </MenuItem>
                            <MenuItem key="tiyu">
                                <Icon type="appstore"/>体育
                            </MenuItem>
                            <MenuItem key="keji">
                                <Icon type="appstore"/>科技
                            </MenuItem>
                            <MenuItem key="shishang">
                                <Icon type="appstore"/>时尚
                            </MenuItem>
                            {userItem}
                        </Menu>
                        <Modal title="用户中心" visible={isShow} okText="关闭"
                               onOk={this.handleShow.bind(this, false)} onCancel={this.handleShow.bind(this, false)}>
                            <Tabs defaultActiveKey="1" onChange={()=>{this.props.form.resetFields()}}>
                                <TabPane tab="登录" key="1" >
                                    <Form onSubmit={this.handleSubmit.bind(this, false)}>
                                        <FormItem label="用户名">
                                            {getFieldDecorator('username')(
                                                <Input type="text" placeholder="请输入用户名" />
                                            )}
                                        </FormItem>
                                        <FormItem label="密码">
                                            {getFieldDecorator('password')(
                                                <Input type="password" placeholder="请输入用户密码" />
                                            )}
                                        </FormItem>
                                        <Button type="primary" htmlType="submit">登录</Button>
                                    </Form>

                                </TabPane>
                                <TabPane tab="注册" key="2">
                                    <Form onSubmit={this.handleSubmit.bind(this, true)}>
                                        <FormItem label="用户名">
                                            {getFieldDecorator('r_userName')(
                                                <Input type="text" placeholder="请输入用户名" />
                                            )}
                                        </FormItem>
                                        <FormItem label="密码">
                                            {getFieldDecorator('r_password')(
                                                <Input type="password" placeholder="请输入用户密码" />
                                            )}
                                        </FormItem>
                                        <FormItem label="密码">
                                            {getFieldDecorator('r_confirmPassword')(
                                                <Input type="password" placeholder="请确认输入密码" />
                                            )}
                                        </FormItem>
                                        <Button type="primary" htmlType="submit">注册</Button>
                                    </Form>

                                </TabPane>
                            </Tabs>
                        </Modal>
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </div>
        );
    }
}


export default Form.create()(NewsHeader);
