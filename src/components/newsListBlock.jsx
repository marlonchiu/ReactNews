import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Card} from 'antd';
import axios from 'axios';

class NewsListBlock extends React.Component {
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
        let {type, count} = this.props;
        // 获取新闻数据
        let {newsArr} = this.state;
        // 判断是否拿到请求数据
        let newsList= newsArr.length ?
            (
                newsArr.map((item, index) => {
                    return (
                        <li key={index}>
                            <Link to={`/news_detail/${item.uniquekey}`}>{item.title}</Link>
                        </li>
                    )
                })
            )
        : '暂时没有获取到新闻推送';
        return (
            <Card style={{width: '100%'}}>
                <ul className="textList">
                    {newsList}
                </ul>
            </Card>
        );
    }
}

// 规定props属性的必要性和数据类型
NewsListBlock.propTypes = {
    type: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired
};

export default NewsListBlock;
