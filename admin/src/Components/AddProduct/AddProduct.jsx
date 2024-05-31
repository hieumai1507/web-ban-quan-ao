import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
const AddProduct = () => {

    const [image, setImage] = useState(false);

    const [productDetails, setProductDetails] = useState({
        name: '',
        image: '',
        category: 'women',
        new_price: '',
        old_price: '',
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }
    const changeHandle = (e) => {
        setProductDetails({...productDetails, [e.target.name]:e.target.value});
    }

    const Add_Product = async () => {
      console.log(productDetails);
      let responeData;
      let product = productDetails;

      let formData = new FormData();
      formData.append('product', image);

      await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData, 
      }).then((response) => response.json()).then((data) => {responeData = data});

      if(responeData.success) {
        product.image = responeData.image_url;
        console.log(product);
        await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product),
        }).then((response) => response.json()).then((data) => {
          data.success ? alert("Product Added") : alert("Failed")
        })
      }
    }

  return (
    <div className='add-product'>
      <div className='add-product-itemfield'>
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandle} type="text" name='name' placeholder='Type here'/>
      </div>

      <div className='add-product-price'>
        <div className='add-product-itemfield'>
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandle} type="text" name='old_price' placeholder='Type here'/>
        </div>
        <div className='add-product-itemfield'>
          <p> Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandle} type="text" name='new_price' placeholder='Type here'/>
        </div>
      </div>

      

      <div className='add-product-itemfield'>
        <p>Product Category</p>
        <select name='category' value={productDetails.category} onChange={changeHandle} className='add-product-selector'>
          <option value='women'>Women</option>
          <option value='men'>Men</option>
          <option value='kid'>Kid</option>
        </select>
      </div>
      <div className='add-product-itemfield'>
        <label htmlFor='file-input'>
          <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type='file' name='image' id='file-input' hidden />
      </div>
      <button onClick={() => {Add_Product()}} className="add-product-btn">ADD</button>
    </div>
  )
}

export default AddProduct
