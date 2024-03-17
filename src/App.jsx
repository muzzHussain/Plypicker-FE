import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './components/auth/register'
import Login from './components/auth/login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductList from './components/products/list';
import EditProduct from './components/products/editProduct';
import Reviews from './components/products/reviewe';
import PendingReviews from './components/products/PendingReview';
import CheckProductReview from './components/products/CheckProductReview';

const App = () => {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/register' Component={Register}/>
          <Route path='/login' Component={Login}/>
          <Route path='/product' Component={ProductList}/>
          <Route path='/product/:id' Component={EditProduct}/>
          <Route path='/product/review' Component={Reviews}/>
          <Route path='/product/pending-review' Component={PendingReviews}/>
          <Route path='/product/check/:productId' Component={CheckProductReview}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
