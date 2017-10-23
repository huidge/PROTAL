import React from 'react';
import styles from './MainLayout.css';
import Header from './ProtalHeaders';
import Footers from './ProtalFooters';

class ProtalLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    document.getElementsByClassName('substance')[0].style.minHeight = document.body.offsetHeight-346+'px'
  }
  render() {
    return (
      <div className={styles.normal}>
        <Header location={this.props.location} />
        <div className='substance' style={{height:'auto'}}>
          {this.props.children}
        </div>
        <Footers />
      </div>
    );
  }
}
export default (ProtalLayout);
