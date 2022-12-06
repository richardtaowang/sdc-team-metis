import React, { useState, useEffect } from 'react';
import "../../styles/index.css";


const AddToCart = (props) => {
  const [sizeSelected, setSizeSelected] = useState({});
  const [quantitySelected, setQuantitySelected] = useState(1);

  const [dropdownExpanded, setDropdownExpanded] = useState(false);
  const [quantityDropdownExpanded, setQuantityDropdownExpanded] = useState(false);

  const onOptionSelect = option => {
    setSizeSelected(option);
    setDropdownExpanded(false);
  };

  const onQuantitySelect = option => {
    setQuantitySelected(option);
    setQuantityDropdownExpanded(false);
  };




  return (
    <div>
      <div class="dropdown">
        <button onClick={() => { setDropdownExpanded(!dropdownExpanded) }} class="dropdown-button">{sizeSelected.size || "SELECT SIZE"}</button>
        <div class={dropdownExpanded ? "dropdown-content dropdownExpanded" : "dropdown-content"}>
          {Object.keys((props.styles[props.styleIndex]?.skus) || {}).map(size => {
            return (<p onClick={() => { onOptionSelect(props.styles[props.styleIndex]?.skus[size]) }}>{props.styles[props.styleIndex]?.skus[size].size}</p>)
          })}
        </div>
      </div>
      <div class="dropdown">
        <button class="dropdown-button" id="quantity" onClick={() => { setQuantityDropdownExpanded(!quantityDropdownExpanded) }}>{quantitySelected}</button>
        <div class={quantityDropdownExpanded ? "dropdown-content dropdownExpanded" : "dropdown-content"}>
          {sizeSelected.quantity > 15?
           Array.from(Array(15).keys()).map(quantity => {
            return (<p onClick={() => { onQuantitySelect(quantity + 1) }}>{quantity + 1}</p>)
          })
           :  Array.from(Array(sizeSelected.quantity).keys()).map(quantity => {
            return (<p onClick={() => { onQuantitySelect(quantity) }}>{quantity}</p>)
          })}

        </div>
      </div>
    </div>
  )
}

{/* <input id="toggle" type="checkbox" checked>
<h2>Drop Down Menu</h2>
<ul>
<li><a href="#chapter1">Chapter 01</a></li>
<li><a href="#chapter2">Chapter 02</a></li>
<li><a href="#chapter3">Chapter 03</a></li>
<li><a href="#chapter4">Chapter 04</a></li>
</ul> */}

// .custom-select {
//   position: relative;
//   font-family: Arial;
// }

// .custom-select select {
//   display: none; /*hide original SELECT element: */
// }

// .select-selected {
//   background-color: DodgerBlue;
// }

// /* Style the arrow inside the select element: */
// .select-selected:after {
//   position: absolute;
//   content: "";
//   top: 14px;
//   right: 10px;
//   width: 0;
//   height: 0;
//   border: 6px solid transparent;
//   border-color: #fff transparent transparent transparent;
// }

// /* Point the arrow upwards when the select box is open (active): */
// .select-selected.select-arrow-active:after {
//   border-color: transparent transparent #fff transparent;
//   top: 7px;
// }

// /* style the items (options), including the selected item: */
// .select-items div,.select-selected {
//   color: #ffffff;
//   padding: 8px 16px;
//   border: 1px solid transparent;
//   border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;
//   cursor: pointer;
// }

// /* Style items (options): */
// .select-items {
//   position: absolute;
//   background-color: DodgerBlue;
//   top: 100%;
//   left: 0;
//   right: 0;
//   z-index: 99;
// }

// /* Hide the items when the select box is closed: */
// .select-hide {
//   display: none;
// }

// .select-items div:hover, .same-as-selected {
//   background-color: rgba(0, 0, 0, 0.1);
// }
export default AddToCart;