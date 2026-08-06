import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchOneSupplier, saveSupplier } from '../api/api.js'

export default function SupplierForm() {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate = useNavigate()

  const [supName, setSupName] = useState('')
  const [supEmail, setSupEmail] = useState('')
  const [supPhone, setSupPhone] = useState('')

  const [fieldErrors, setFieldErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEditMode)

  useEffect(() => {
    if (isEditMode) {
      fetchOneSupplier(id).then((s) => {
        setSupName(s.supName)
        setSupEmail(s.supEmail)
        setSupPhone(s.supPhone || '')
        setPageLoading(false)
      }).catch((err) => {
        setGeneralError(err.message || 'Could not load supplier')
        setPageLoading(false)
      })
    }
  }, [id])

  function validateForm() {
    const errors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!supName.trim()) errors.supName = 'Supplier name is required'

    if (!supEmail.trim()) {
      errors.supEmail = 'Email is required'
    } else if (!emailPattern.test(supEmail.trim())) {
      errors.supEmail = 'Please enter a valid email address'
    }

    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGeneralError('')

    const errors = validateForm()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)

    try {
      await saveSupplier({ supName: supName.trim(), supEmail: supEmail.trim(), supPhone: supPhone.trim() }, isEditMode ? id : null)
      navigate('/suppliers')
    } catch (err) {
      if (err.errors) setFieldErrors(err.errors)
      setGeneralError(err.message || 'Could not save supplier')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (pageLoading) return <div className="page-container"><p className="muted-text">Loading...</p></div>

  return (
    <div className="page-container">
      <h1>{isEditMode ? 'Edit Supplier' : 'Add New Supplier'}</h1>

      {generalError && <div className="error-banner">{generalError}</div>}

      <form onSubmit={handleSubmit} className="entity-form">
        <div className="form-group">
          <label htmlFor="supName">Supplier Name</label>
          <input id="supName" type="text" value={supName} onChange={(e) => setSupName(e.target.value)} />
          {fieldErrors.supName && <span className="field-error">{fieldErrors.supName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="supEmail">Contact Email</label>
          <input id="supEmail" type="email" value={supEmail} onChange={(e) => setSupEmail(e.target.value)} />
          {fieldErrors.supEmail && <span className="field-error">{fieldErrors.supEmail}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="supPhone">Phone Number (optional)</label>
          <input id="supPhone" type="text" value={supPhone} onChange={(e) => setSupPhone(e.target.value)} />
        </div>

        <div className="button-row">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Supplier'}
          </button>
          <button type="button" className="btn" onClick={() => navigate('/suppliers')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
