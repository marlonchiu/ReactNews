import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Card} from 'antd';
import axios from 'axios';

import '../componentsCss/newsImgBlock.css'

class NewsImgBlock extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            newsArr : []
        }
    }

    // 页面将要挂载请求数据
    componentWillMount(){
        let {type, count} = this.props;
        // 准备工作
        // http://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type=guoji&count=6
        let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type=${type}&count=${count}`;
        axios.get(url)
            .then(response => {
                let data = response.data;
                // 更新状态
                this.setState({newsArr : data});
            })
            .catch(error => {
                console.log(error);
            })
    };


    render() {
        let {title, type, count, imgWidth, width} = this.props;
        // 获取新闻数据
        let {newsArr} = this.state;
        // 判断是否拿到请求数据
        let newsList= newsArr.length ?
            (
                newsArr.map((item, index) => {
                    return (
                        <div className="newsImgContainer" key={index}>
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
        return (
            <Card title={title} style={{ width, 'marginBottom' : '20px'}}>
                {newsList}
            </Card>
        );
    }
}

// 规定props属性的必要性和数据类型
NewsImgBlock.propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    imgWidth: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired
};

export default NewsImgBlock;
