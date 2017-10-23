import React, { Component } from 'react';
import logo from '../../styles/images/logo.png';

class Headers extends Component {
    render() {
        return (
            <div className="main-header">
                <nav className="navbar navbar-static-top" style={{background:'white',display: 'inline'}}>
                    <div className="theme_topnav_logo" id="topnav_logo" style={{display: 'inline'}}>
                        <div style={{display: 'inline'}}>
                            <img src={logo} style={{width: '270px',height:'58px',marginLeft: '16% ',paddingLeft: '7px',paddingBottom: '5px',paddingTop: '18px'}} />
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Headers;
