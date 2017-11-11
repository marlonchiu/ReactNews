import React, { Component } from 'react';
import {
    Row,
    Col,
    Carousel,
    Tabs,
    BackTop
} from 'antd';
import NewsImgBlock from './newsImgBlock';
import NewsListBlock from './newsListBlock';
import ProductBlock from './productBlock';

import carousel_1 from '../images/carousel_1.jpg';
import carousel_2 from '../images/carousel_2.jpg';
import carousel_3 from '../images/carousel_3.jpg';
import carousel_4 from '../images/carousel_4.jpg';
import '../componentsCss/newsContainer.css';

const TabPane = Tabs.TabPane;

class NewsContainer extends Component {
    render() {
        return (
            <div className="newsContainer">
                <Row>
                    <Col span={1}></Col>
                    <Col span={22}>
                        <div className="leftContainer">
                            <Carousel autoplay>
                                <div className="carousel"><img src={carousel_1} alt=""/></div>
                                <div className="carousel"><img src={carousel_2} alt=""/></div>
                                <div className="carousel"><img src={carousel_3} alt=""/></div>
                                <div className="carousel"><img src={carousel_4} alt=""/></div>
                            </Carousel>
                            <NewsImgBlock title="国际头条" count={6} type="guoji" imgWidth="115px" width="100%"/>
                        </div>
                        <div className="middleContainer">
                            <Tabs className="news_tab">
                                <TabPane tab="娱乐新闻" key="1">
                                    <NewsListBlock count={28} type="yule"/>
                                </TabPane>
                                <TabPane tab="科技新闻" key="2">
                                    <NewsListBlock count={28} type="keji"/>
                                </TabPane>
                            </Tabs>
                        </div>
                        <div className="rightContainer">
                            <Tabs className="react_product">
                                <TabPane tab="ReactProduct" key="1">
                                    <ProductBlock />
                                </TabPane>
                                <TabPane tab="ReactProduct" key="2">
                                    <ProductBlock />
                                </TabPane>
                            </Tabs>
                        </div>
                        <div className="img_footer" >
                            <NewsImgBlock title="国内新闻" count={8} type="guonei" imgWidth="115px" width="100%"/>
                            <NewsImgBlock title="娱乐新闻" count={16} type="yule" imgWidth="115px" width="100%"/>
                        </div>
                    </Col>
                    <Col span={1}></Col>
                </Row>
                <BackTop />
            </div>
        );
    }
}

export default NewsContainer;
