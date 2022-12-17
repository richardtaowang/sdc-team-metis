import React, { useState, useEffect } from 'react';
import "../../styles/index.css";
import AddToCart from './addToCart.jsx';
import ImageGallery from './imageGallery.jsx';
import ProductInfo from './productInfo.jsx';
import StyleSelector from './styleSelector.jsx';

const Overview = (props) => {
  // console.log('overview', props.info);
  const [styleIndex, setStyleIndex] = useState(0);
  const setIndex = (index) => {
    console.log(index);
    setStyleIndex(index);
  }
  useEffect(() => {
    setStyleIndex(0);
  }, [props.info]); //

  return (
    <div moduleName="Overview">
      {props.styles?
      <div moduleName="Overview" className="overviewContainer">
      <div moduleName="Overview" className="productInfo"><ProductInfo rating={props.rating} info={props.info} onClickYourOutfit={props.onClickYourOutfit}/></div>
      <div moduleName="Overview" className="styleSelector"><StyleSelector onClick = {setIndex} styleIndex={styleIndex} styles={props.styles}/></div>
      <div moduleName="Overview" className="addToCart"><AddToCart styleIndex={styleIndex} styles={props.styles} /></div>
      <div moduleName="Overview" className="imageGallery"><ImageGallery  styleIndex={styleIndex} styles={props.styles}/></div>
      </div>
      : ''
    }
      </div>
  )
}

export default Overview;
