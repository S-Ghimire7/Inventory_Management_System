import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchSuppliers, deleteProductRequest } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const LOW_STOCK_LIMIT = 5 // anything below this number of units gets flagged red

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [searchBox, setSearchBox] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const { isLoggedIn } = useAuth()

  useEffect(() => {
    fetchSuppliers().then(setSuppliers).catch(() => {})
  }, [])

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBox, supplierFilter])

  async function loadProducts() {
    setLoading(true)
    setErrorMsg('')
    try {
      const data = await fetchProducts(searchBox, supplierFilter)
      setProducts(data)
    } catch (err) {
      setErrorMsg(err.message || 'Could not load products')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, name) {
    const sure = window.confirm(`Delete "${name}"? This can't be undone.`)
    if (!sure) return

    try {
      await deleteProductRequest(id)
      loadProducts()
    } catch (err) {
      alert(err.message || 'Could not delete product')
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Products</h1>
        {isLoggedIn && (
          <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
        )}
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchBox}
          onChange={(e) => setSearchBox(e.target.value)}
          className="search-input"
        />

        <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
          <option value="">All suppliers</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.supName}</option>
          ))}
        </select>
      </div>

      {errorMsg && <div className="error-banner">{errorMsg}</div>}

      {loading ? (
        <p className="muted-text">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="muted-text">No products found. Try changing your search or filter.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Stock</th>
                {isLoggedIn && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const isLowStock = p.stockQty < LOW_STOCK_LIMIT
                return (
                  <tr key={p.id} className={isLowStock ? 'low-stock-row' : ''}>
                    <td data-label="Image">
                      {p.imagePath ? (
                        <img src={`/uploads/${p.imagePath}`} alt={p.prodName} className="thumb-img" />
                      ) : (
                        <div className="thumb-placeholder">no image</div>
                      )}
                    </td>
                    <td data-label="Name">
                      <Link to={`/products/${p.id}`} className="product-link">{p.prodName}</Link>
                    </td>
                    <td data-label="Supplier">{p.Supplier ? p.Supplier.supName : 'Unknown'}</td>
                    <td data-label="Price">£{Number(p.price).toFixed(2)}</td>
                    <td data-label="Stock">
                      {p.stockQty}
                      {isLowStock && <span className="low-stock-badge">Low Stock</span>}
                    </td>
                    {isLoggedIn && (
                      <td data-label="Actions" className="actions-cell">
                        <Link to={`/products/${p.id}/edit`} className="btn btn-small">Edit</Link>
                        <button className="btn btn-small btn-danger" onClick={() => handleDelete(p.id, p.prodName)}>Delete</button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
