import React, { Component } from 'react';
import axios from 'axios';
import {Card, Form, Input, Button, Row, Col, message, notification} from 'antd';

let FormItem = Form.Item;
class NewsComments extends Component {
    constructor(props){
        super(props);
        this.state = {
            comments :[]
        }
    }

    // 提交评论的回调
    handleSubmit = (event) => {
        event.preventDefault();

        // 收集数据
        let userId = JSON.parse(localStorage.getItem('person_key') || '{}').userId;  // 考虑到可能拿不到数据的情况

        if(!userId){
            message.warning("请先登录");
            return;
        }
        let newsId = this.props.newsId;
        let comment = this.props.form.getFieldValue('comment');
        let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=comment&userid=${userId}&uniquekey=${newsId}&commnet=${comment}`;

        axios.get(url)
            .then(response => {
                message.success('恭喜你， 提交评论成功');
                // 提交完数据清空  resetFields()会自动刷新评论列表的
                this.props.form.resetFields();
            })
            .catch(error => {
                console.log(error);
            })
    };

    // 定义收藏文章的回调
    handleCollection = () => {
        // 收集数据
        let userId = JSON.parse(localStorage.getItem('person_key') || '{}').userId;  // 考虑到可能拿不到数据的情况
        if(!userId){
            message.warning("请先登录");
            return;
        }
        let newsId = this.props.newsId;
        let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=uc&userid=${userId}&uniquekey=${newsId}`;

        axios.get(url)
            .then(response => {
                notification['success']({
                    message: 'ReactNews',
                    description: '收藏成功',
                });
            })
            .catch(error => {
                console.log(error);
                notification['error']({
                    message: 'ReactNews',
                    description: '收藏失败',
                });
            })
    };

    // 组件将要接收props数据或者是接收的props数据发生改变的时候调用的函数
    componentWillReceiveProps(nextProps){
        let newsId = nextProps.newsId;
        let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getcomments&uniquekey=${newsId}`;
        axios.get(url)
            .then(response => {
                let data = response.data;
                // 过滤数据
                let comments = data.map((item, index) => {
                    return {
                        username: item.UserName,
                        dateTime: item.datetime,
                        comment: item.Comments
                    }
                });
                // 更新状态
                this.setState({comments});
            })
            .catch(error => {
                console.log(error);
            })
    }


    render() {
        let {comments} = this.state;
        let {getFieldDecorator} = this.props.form;
        let liList = comments.length ? (
            comments.map((item,index) => {
                return (
                    <li key={index}>
                        <Card title={item.username} extra={item.dateTime}>
                            {item.comment}
                        </Card>
                    </li>
                )
            })
        ) : '暂时还没有评论内容';
        return (
            <div>
                <ul>
                    {liList}
                </ul>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem label="您的评论" labelCol={{span: 2, offset: 11}}>
                        {getFieldDecorator('comment')(
                            <Input type="textarea" style={{resize: 'none'}} placeholder="请输入您的评论" />
                        )}
                    </FormItem>
                    <Row>
                        <Col span={6} push={10}>
                            <Button htmlType='submit' type="primary">提交评论</Button>&nbsp;&nbsp;
                            <Button type="primary" onClick={this.handleCollection} >收藏文章</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}


export default Form.create()(NewsComments);
