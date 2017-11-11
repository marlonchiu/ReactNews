import React, { Component } from 'react';
import {Row, Col, BackTop} from 'antd';
import axios from 'axios';
import NewsComments from './newsComments';
import NewsImgBlock from './newsImgBlock';

class NewsDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            news :null
        }
    }

    // 请求评论数据
    componentWillMount(){
        let newsId = this.props.params.newsId;
        this.getNews(newsId);
    }

    // 切换新闻，组件将要接收props数据或者是接收的props数据发生改变的时候调用的函数
    componentWillReceiveProps(nextProps){
        let newsId = nextProps.params.newsId;
        this.getNews(newsId);
    }

    // 封装获取新闻的自定义函数
    getNews = (newsId) => {
        let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey=${newsId}`;
        axios.get(url)
            .then(response => {
                let data = response.data;
                // 更新状态
                this.setState({
                    news: data.pagecontent
                });
            })
            .catch(error => {
                console.log(error);
            })
    };


    render() {
        let {news} = this.state;
        return (
            <div>
               <Row>
                   <Col span={1}></Col>
                   <Col span={16}>
                       {/*在react中正常显示html代码*/}
                       <div dangerouslySetInnerHTML={{__html:news}}></div>
                       <NewsComments newsId={this.props.params.newsId}/>
                   </Col>
                   <Col span={6}>
                       <NewsImgBlock title="科技新闻" count={8} type="keji" imgWidth="120px" width="100%"/>
                   </Col>
                   <Col span={1}></Col>
               </Row>
                <BackTop />
            </div>
        );
    }
}

export default NewsDetail;
