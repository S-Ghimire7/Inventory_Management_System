// little wrapper functions around fetch so the pages don't repeat this stuff everywhere

const BASE_URL = '/api' // vite proxies this to the express server during dev

function getAuthHeaders() {
  const token = localStorage.getItem('stockkeeper_token')
  return token ? { Authorization: 'Bearer ' + token } : {}
}

export async function loginRequest(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

// ---- products ----

export async function fetchProducts(searchTerm, supplierId) {
  const params = new URLSearchParams()
  if (searchTerm) params.append('search', searchTerm)
  if (supplierId) params.append('supplierId', supplierId)

  const res = await fetch(`${BASE_URL}/products?${params.toString()}`)
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function fetchOneProduct(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`)
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function saveProduct(formData, productId) {
  const isEditing = !!productId
  const url = isEditing ? `${BASE_URL}/products/${productId}` : `${BASE_URL}/products`

  const res = await fetch(url, {
    method: isEditing ? 'PUT' : 'POST',
    headers: getAuthHeaders(), // no Content-Type here, the browser sets it for FormData
    body: formData
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function deleteProductRequest(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

// ---- suppliers ----

export async function fetchSuppliers() {
  const res = await fetch(`${BASE_URL}/suppliers`)
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function fetchOneSupplier(id) {
  const res = await fetch(`${BASE_URL}/suppliers/${id}`)
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function saveSupplier(supplierData, supplierId) {
  const isEditing = !!supplierId
  const url = isEditing ? `${BASE_URL}/suppliers/${supplierId}` : `${BASE_URL}/suppliers`

  const res = await fetch(url, {
    method: isEditing ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(supplierData)
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export async function deleteSupplierRequest(id) {
  const res = await fetch(`${BASE_URL}/suppliers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}
