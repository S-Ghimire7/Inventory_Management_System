import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Login from './pages/Login.jsx'
import ProductList from './pages/ProductList.jsx'
import ProductView from './pages/ProductView.jsx'
import ProductForm from './pages/ProductForm.jsx'
import SupplierList from './pages/SupplierList.jsx'
import SupplierForm from './pages/SupplierForm.jsx'

function App() {
  return (
    <div className="app-wrapper">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />

          <Route path="/products/:id" element={<ProductView />} />
          <Route
            path="/products/new"
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            }
          />

          <Route path="/suppliers" element={<SupplierList />} />
          <Route
            path="/suppliers/new"
            element={
              <ProtectedRoute>
                <SupplierForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suppliers/:id/edit"
            element={
              <ProtectedRoute>
                <SupplierForm />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div className="page-container"><h1>404 - Page Not Found</h1></div>} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
