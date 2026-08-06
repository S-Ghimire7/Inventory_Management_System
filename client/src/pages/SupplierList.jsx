import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSuppliers, deleteSupplierRequest } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const { isLoggedIn } = useAuth()

  useEffect(() => {
    loadSuppliers()
  }, [])

  async function loadSuppliers() {
    setLoading(true)
    try {
      const data = await fetchSuppliers()
      setSuppliers(data)
    } catch (err) {
      setErrorMsg(err.message || 'Could not load suppliers')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, name) {
    const sure = window.confirm(`Delete supplier "${name}"?`)
    if (!sure) return

    try {
      await deleteSupplierRequest(id)
      loadSuppliers()
    } catch (err) {
      alert(err.message || 'Could not delete supplier')
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Suppliers</h1>
        {isLoggedIn && (
          <Link to="/suppliers/new" className="btn btn-primary">+ Add Supplier</Link>
        )}
      </div>

      {errorMsg && <div className="error-banner">{errorMsg}</div>}

      {loading ? (
        <p className="muted-text">Loading suppliers...</p>
      ) : suppliers.length === 0 ? (
        <p className="muted-text">No suppliers yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                {isLoggedIn && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td data-label="Name">{s.supName}</td>
                  <td data-label="Email">{s.supEmail}</td>
                  <td data-label="Phone">{s.supPhone || '-'}</td>
                  {isLoggedIn && (
                    <td data-label="Actions" className="actions-cell">
                      <Link to={`/suppliers/${s.id}/edit`} className="btn btn-small">Edit</Link>
                      <button className="btn btn-small btn-danger" onClick={() => handleDelete(s.id, s.supName)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
