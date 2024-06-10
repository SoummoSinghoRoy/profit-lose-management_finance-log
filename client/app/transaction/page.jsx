"use client"
import ProtectedRoute from "../components/route-protection/ProtectedRoute"
import TransactionCard from "../components/transactionCard"

export default function Transaction() {
  return (
    <ProtectedRoute>
      <div className="row d-none d-md-flex d-lg-flex my-3">
        <div className="col-3">
          <h4 className="text-secondary fw-bolder text-decoration-underline">All Transaction</h4>
        </div>
        <div className="col-6">
        <form className="d-flex" role="search">
          <input className="form-control border-secondary me-2" type="search" placeholder="Search" aria-label="Search" />
          <button className="btn btn-outline-secondary" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </button>
        </form>
        </div>
        <div className="col-3 d-flex justify-content-end">
          <button className="btn btn-secondary me-md-2 px-4" type="button">Create new transaction</button>
        </div>
      </div>
      <hr/>
      <div className="row my-4">
        <TransactionCard />
      </div>
    </ProtectedRoute>
  )
}