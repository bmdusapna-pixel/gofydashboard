import React, { useState } from "react";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [productFields, setProductFields] = useState({
    productName: "",
    briefDescription: "",
    detailDescription: "",
    oldPrice: 0,
    newPrice: 0,
    inStock: false,
    tags: [],
    stockNumber: 0,
    category: "",
    mfg: "",
    images: [],
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageData, setImageData] = useState([]);

  const inputChangeHandler = (event) => {
    const { name, value, type } = event.target;
    const newValue = type === "number" ? +value : value;
    setProductFields((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const array = value.split(",").map(tag => tag.trim());
    setProductFields((prev) => ({
      ...prev,
      tags: array,
    }));
  };

  const inputImageHandler = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };

  const handleImageSubmit = (event) => {
    event.preventDefault();
    if (selectedImages.length !== 5) {
      const errorMessage = "Upload Only 5 images";
      setImageUploadError(errorMessage);
      toast.info(errorMessage);
      setSelectedImages([]);
      return;
    }
    const imagePreviews = selectedImages.map((file) =>
      window.URL.createObjectURL(file)
    );
    setImageData(imagePreviews);
    setProductFields((prev) => ({ ...prev, images: selectedImages }));
  };

  const handleInStockChange = (e) => {
    const value = e.target.value === "true";
    setProductFields((prev) => ({ ...prev, inStock: value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const formData = new FormData();
  };

  return (
    <div className="w-full p-8 overflow-y-scroll">
      <div className="border shadow-md border-gray-200 p-5 rounded-2xl flex flex-col gap-5">
        <p className="text-[20px] leading-[28px] text-black font-semibold">Add New Product</p>
        <form onSubmit={submitForm} className="w-full flex flex-col gap-5">
          <div className="flex gap-10 w-full">
            <div className="w-1/2 flex flex-col gap-3">
              <div className="flex flex-col gap-2 w-full">
                <p className="text-[16px] font-medium leading-[24px] text-black">Product Name</p>
                <input required onChange={inputChangeHandler} name="productName" value={productFields.productName} type="text" className="transition-colors duration-300 text-black text-[16px] leading-[24px] font-medium py-1 px-4 rounded-md border focus:border-[#DC3545] focus:outline-none w-full border-gray-200" placeholder="Name" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <p className="text-[16px] font-medium leading-[24px] text-black">Breif Description</p>
                <textarea required onChange={inputChangeHandler} name="briefDescription" value={productFields.briefDescription} rows="4" type="text" className="transition-colors duration-300 text-black text-[16px] leading-[24px] font-medium py-1 px-4 rounded-md border focus:border-[#DC3545] focus:outline-none w-full border-gray-200" placeholder="Description"></textarea>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <p className="text-[16px] font-medium leading-[24px] text-black">Detail Description</p>
                <textarea required onChange={inputChangeHandler} name="detailDescription" value={productFields.detailDescription} rows="4" type="text" className="transition-colors duration-300 text-black text-[16px] leading-[24px] font-medium py-1 px-4 rounded-md border focus:border-[#DC3545] focus:outline-none w-full border-gray-200" placeholder="Description"></textarea>
              </div>
              <div className="flex gap-5 items-center w-full">
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-[16px] font-medium leading-[24px] text-black">MRP</p>
                  <input min="0" required onChange={inputChangeHandler} name="oldPrice" value={productFields.oldPrice} type="number" className="transition-colors duration-300 text-black text-[16px] leading-[24px] font-medium py-1 px-4 rounded-md border focus:border-[#DC3545] focus:outline-none w-full border-gray-200" placeholder="MRP" />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-[16px] font-medium leading-[24px] text-black">Sale Price</p>
                  <input min="0" required onChange={inputChangeHandler} name="newPrice" value={productFields.newPrice} type="number" className="transition-colors duration-300 text-black text-[16px] leading-[24px] font-medium py-1 px-4 rounded-md border focus:border-[#DC3545] focus:outline-none w-full border-gray-200" placeholder="Sale Price" />
                </div>
              </div>
              <div className="flex gap-5 items-center w-full">
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-[16px] font-medium leading-[24px] text-black">Stock</p>
                  <select onChange={handleInStockChange} value={productFields.inStock} className="transition-colors duration-300 text-black text-[16px] leading-[24px] font-medium py-1 px-4 rounded-md border focus:border-[#DC3545] focus:outline-none w-full border-gray-200">
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-[16px] font-medium leading-[24px] text-black">Number of stock</p>
                  <input min="0" required onChange={inputChangeHandler} name="stockNumber" value={productFields.stockNumber} type="number" className="transition-colors duration-300 text-black text-[16px] leading-[24px] font-medium py-1 px-4 rounded-md border focus:border-[#DC3545] focus:outline-none w-full border-gray-200" placeholder="number" />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <p className="text-[16px] font-medium leading-[24px] text-black">Tags</p>
                <input required onChange={handleTagsChange} name="tags" value={productFields.tags} type="text" className="transition-colors duration-300 text-black text-[16px] leading-[24px] font-medium py-1 px-4 rounded-md border focus:border-[#DC3545] focus:outline-none w-full border-gray-200" placeholder="Enter tags like 1 to 4, 8 to 9" />
              </div>
            </div>
            <div className="w-1/2 flex flex-col gap-3">
              <div className="flex flex-col gap-2 w-full">
                <p className="text-[16px] font-medium leading-[24px] text-black">Date of Manufactured</p>
                <input required onChange={inputChangeHandler} name="mfg" value={productFields.mfg} type="date" className="transition-colors duration-300 text-black text-[16px] leading-[24px] font-medium py-1 px-4 rounded-md border focus:border-[#DC3545] focus:outline-none w-full border-gray-200" placeholder="number" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <p className="text-[16px] font-medium leading-[24px] text-black">Category</p>
                <input required onChange={inputChangeHandler} name="category" value={productFields.category} type="text" className="transition-colors duration-300 text-black text-[16px] leading-[24px] font-medium py-1 px-4 rounded-md border focus:border-[#DC3545] focus:outline-none w-full border-gray-200" placeholder="Category" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <p className="text-[16px] font-medium leading-[24px] text-black">Sub Category</p>
                <input required onChange={inputChangeHandler} name="category" value={productFields.category} type="text" className="transition-colors duration-300 text-black text-[16px] leading-[24px] font-medium py-1 px-4 rounded-md border focus:border-[#DC3545] focus:outline-none w-full border-gray-200" placeholder="Sub Category" />
              </div>
              {
                imageData && imageData.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 justify-center gap-5 w-full">
                    {
                      imageData.map((item, index) => (
                        <div className="w-40 flex items-center rounded-md shadow justify-center" key={index}>
                          <img src={item} className="w-40 h-40 rounded-md" alt={`product-${index}`} />
                        </div>
                      ))
                    }
                  </div>
                )
              }
              <div className="flex gap-2 w-full items-center">
                <input onChange={inputImageHandler} accept="image/*" name="images" type="file" className="w-full rounded-xl border border-gray-200 py-1 px-4" multiple required />
                <button onClick={handleImageSubmit} type="button" className="rounded-xl w-full h-10 text-[16px] leading-[24px] font-medium text-white transition-colors duration-300 hover:bg-[#dc3545] cursor-pointer bg-[#f87171] flex gap-3 items-center justify-center">Upload Product Images</button>
              </div>
              <button type="submit" className="rounded-xl w-24 h-10 text-[18px] leading-[27px] font-medium text-white transition-colors duration-300 hover:bg-[#dc3545] cursor-pointer bg-[#f87171] flex gap-3 items-center justify-center">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
