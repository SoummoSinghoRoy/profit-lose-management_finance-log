"use client"
import ProtectedRoute from "../components/route-protection/ProtectedRoute";
import TransactionCard from "../components/transactionCard";
import TransactionModal from "../components/transactionModal";
import SearchBar from "../components/searchbar";

export default function Transaction() {
  return (
    <ProtectedRoute>
      <section className="d-none d-md-block d-lg-block">
        <div className="row d-md-flex d-lg-flex my-3">
          <div className="col-3">
            <h4 className="text-secondary fw-bolder text-decoration-underline">All Transaction</h4>
          </div>
          <div className="col-6">
            <SearchBar />
          </div>
          <div className="col-3 d-flex justify-content-end">
            <TransactionModal transactionAction={"create"} />
          </div>
        </div>
        <hr />
        <div className="row my-4">
          <TransactionCard />
        </div>
      </section>

      <section className="d-md-none d-lg-none">
        <div className="row my-3">
          <div className="col-12">
            <SearchBar />
          </div>
        </div>
        <div className="row my-2">
          <div className="col-12 d-flex justify-content-center">
            <TransactionModal transactionAction={"create"} />
          </div>
        </div>
        <div className="row my-4">
          <h4 className="text-secondary fw-bolder text-decoration-underline text-center">All Transaction</h4>
          <hr />
          <TransactionCard />
        </div>
      </section>
    </ProtectedRoute>
  )
}