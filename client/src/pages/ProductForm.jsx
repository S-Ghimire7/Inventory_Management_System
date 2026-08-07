import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchOneProduct, fetchSuppliers, saveProduct } from '../api/api.js'

export default function ProductForm() {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate = useNavigate()

  const [suppliers, setSuppliers] = useState([])
  const [prodName, setProdName] = useState('')
  const [prodDesc, setProdDesc] = useState('')
  const [price, setPrice] = useState('')
  const [stockQty, setStockQty] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [existingImage, setExistingImage] = useState(null)

  const [fieldErrors, setFieldErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEditMode)

  useEffect(() => {
    fetchSuppliers().then(setSuppliers).catch(() => {})
  }, [])

  useEffect(() => {
    if (isEditMode) {
      fetchOneProduct(id).then((p) => {
        setProdName(p.prodName)
        setProdDesc(p.prodDesc || '')
        setPrice(p.price)
        setStockQty(p.stockQty)
        setSupplierId(p.supplierId)
        setExistingImage(p.imagePath)
        setPageLoading(false)
      }).catch((err) => {
        setGeneralError(err.message || 'Could not load product')
        setPageLoading(false)
      })
    }
  }, [id])

  function validateForm() {
    const errors = {}

    if (!prodName.trim()) errors.prodName = 'Product name is required'

    if (price === '' || isNaN(price)) {
      errors.price = 'Price must be a number'
    } else if (Number(price) < 0) {
      errors.price = 'Price cannot be negative'
    }

    if (stockQty === '' || isNaN(stockQty)) {
      errors.stockQty = 'Stock quantity must be a number'
    } else if (Number(stockQty) < 0) {
      errors.stockQty = 'Stock quantity cannot be negative'
    } else if (!Number.isInteger(Number(stockQty))) {
      errors.stockQty = 'Stock quantity must be a whole number'
    }

    if (!supplierId) errors.supplierId = 'Please choose a supplier'

    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGeneralError('')

    const errors = validateForm()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('prodName', prodName.trim())
    formData.append('prodDesc', prodDesc.trim())
    formData.append('price', price)
    formData.append('stockQty', stockQty)
    formData.append('supplierId', supplierId)
    if (imageFile) formData.append('productImage', imageFile)

    try {
      await saveProduct(formData, isEditMode ? id : null)
      navigate('/')
    } catch (err) {
      if (err.errors) {
        setFieldErrors(err.errors)
      }
      setGeneralError(err.message || 'Could not save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (pageLoading) return <div className="page-container"><p className="muted-text">Loading...</p></div>

  return (
    <div className="page-container">
      <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>

      {generalError && <div className="error-banner">{generalError}</div>}

      <form onSubmit={handleSubmit} className="entity-form">
        <div className="form-group">
          <label htmlFor="prodName">Product Name</label>
          <input
            id="prodName"
            type="text"
            value={prodName}
            onChange={(e) => setProdName(e.target.value)}
          />
          {fieldErrors.prodName && <span className="field-error">{fieldErrors.prodName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="prodDesc">Description</label>
          <textarea
            id="prodDesc"
            rows="3"
            value={prodDesc}
            onChange={(e) => setProdDesc(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (£)</label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {fieldErrors.price && <span className="field-error">{fieldErrors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="stockQty">Stock Quantity</label>
            <input
              id="stockQty"
              type="number"
              step="1"
              min="0"
              value={stockQty}
              onChange={(e) => setStockQty(e.target.value)}
            />
            {fieldErrors.stockQty && <span className="field-error">{fieldErrors.stockQty}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="supplierId">Supplier</label>
          <select
            id="supplierId"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">-- choose a supplier --</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.supName}</option>
            ))}
          </select>
          {fieldErrors.supplierId && <span className="field-error">{fieldErrors.supplierId}</span>}
          {suppliers.length === 0 && (
            <span className="field-hint">No suppliers yet, add one on the Suppliers page first.</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="productImage">Product Image</label>
          {existingImage && !imageFile && (
            <img src={`/uploads/${existingImage}`} alt="current" className="current-image-preview" />
          )}
          <input
            id="productImage"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <span className="field-hint">Upload a jpg, png, gif or webp file (max 5MB)</span>
        </div>

        <div className="button-row">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Product'}
          </button>
          <button type="button" className="btn" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
