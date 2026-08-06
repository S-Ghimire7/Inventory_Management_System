import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchOneProduct, deleteProductRequest } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const LOW_STOCK_LIMIT = 5

export default function ProductView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetchOneProduct(id)
      .then(setProduct)
      .catch((err) => setErrorMsg(err.message || 'Could not load this product'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    const sure = window.confirm(`Delete "${product.prodName}"? This can't be undone.`)
    if (!sure) return

    try {
      await deleteProductRequest(id)
      navigate('/')
    } catch (err) {
      alert(err.message || 'Could not delete product')
    }
  }

  if (loading) return <div className="page-container"><p className="muted-text">Loading...</p></div>
  if (errorMsg) return <div className="page-container"><div className="error-banner">{errorMsg}</div></div>
  if (!product) return null

  const isLowStock = product.stockQty < LOW_STOCK_LIMIT

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to products</Link>

      <div className="product-view-card">
        <div className="product-view-image">
          {product.imagePath ? (
            <img src={`/uploads/${product.imagePath}`} alt={product.prodName} />
          ) : (
            <div className="thumb-placeholder large-placeholder">no image uploaded</div>
          )}
        </div>

        <div className="product-view-details">
          <h1>{product.prodName}</h1>
          {isLowStock && <span className="low-stock-badge">Low Stock</span>}

          <p className="product-desc">{product.prodDesc || 'No description provided.'}</p>

          <div className="detail-row"><strong>Price:</strong> £{Number(product.price).toFixed(2)}</div>
          <div className="detail-row"><strong>Stock Quantity:</strong> {product.stockQty}</div>
          <div className="detail-row">
            <strong>Supplier:</strong>{' '}
            {product.Supplier ? (
              <span>{product.Supplier.supName} ({product.Supplier.supEmail})</span>
            ) : 'Unknown'}
          </div>

          {isLoggedIn && (
            <div className="button-row">
              <Link to={`/products/${product.id}/edit`} className="btn btn-primary">Edit Product</Link>
              <button className="btn btn-danger" onClick={handleDelete}>Delete Product</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
