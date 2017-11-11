import React, { Component } from 'react';
import {Row, Col} from 'antd'

class newsFooter extends Component {
    
    render() {
        return (
            <div className="footer">
                <Row>
                    <Col span={1}></Col>
                    <Col span={22}>
                        &copy; 2016 ReactNews. All Rights Reserved
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </div>
        );
    }
}

export default newsFooter;
