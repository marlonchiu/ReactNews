import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router';
import {Row, Col, Tabs, Card, Upload, Icon, Modal} from 'antd';

const TabPane = Tabs.TabPane;
class UserCenter extends Component {
    constructor(props){
        super(props);
        this.state = {
            commentsList: [],
            collectionsList: [],
            previewVisible: false,
            previewImage: '',
            fileList: [{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            }],
        }
    }

    // 请求用户评论和新闻收藏
    componentWillMount(){

        let userId = JSON.parse(localStorage.getItem('person_key')).userId;
        let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getusercomments&userid=${userId}`;
        // 请求新闻评论
        axios.get(url)
            .then(response => {
                // 更新新闻评论列表状态
                this.setState({commentsList: response.data})
            })
            .catch(error => {
                console.log(error);
            });

        // 请求收藏新闻
        url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getuc&userid=${userId}`;
        axios.get(url)
            .then(response => {
                // 更新新闻收藏列表状态
                this.setState({collectionsList: response.data});
            })
            .catch(error => {
                console.log(error);
            })
    };

    // 上传图片
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
        let {commentsList, collectionsList} = this.state;
        let commentsLi = commentsList.length
            ? (
                commentsList.map((item, index)=>{
                    return(
                        <li key={index}>
                            <Card title={`于 ${item.datetime}评论了${item.uniquekey}`} extra={<Link to={`/news_detail/${item.uniquekey}`}>查看</Link>}>
                                {item.Comments}
                            </Card>
                        </li>
                    )
                })
            ) : '您暂时还没有新闻评论';

        let collectionsLi = collectionsList.length
            ? (
                collectionsList.map((item, index)=>{
                    return(
                        <li key={index}>
                            <Card title={item.uniquekey} extra={<Link to={`/news_detail/${item.uniquekey}`}>查看</Link>}>
                                {item.Title}
                            </Card>
                        </li>
                    )
                })
            ) : '您暂时还没有收藏文章';
        return (
            <div>
                <Row>
                    <Col span={1}></Col>
                    <Col span={22}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="我的评论" key="1" style={{"margin-top": "10px"}}>
                                <ul>
                                    {commentsLi}
                                </ul>
                            </TabPane>
                            <TabPane tab="我的收藏" key="2" style={{"margin-top": "10px"}}>
                                <ul>
                                    {collectionsLi}
                                </ul>
                            </TabPane>
                            <TabPane tab="上传图片" key="3" style={{"margin-top": "10px"}}>
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                    multiple="true"
                                >
                                    {uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </div>
        );
    }
}

export default UserCenter;
