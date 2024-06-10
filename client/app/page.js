"use client"
import ProtectedRoute from "./components/route-protection/ProtectedRoute";
import FinanceStatus from "./components/financeStatus.card";
import TransactionCard from "./components/transactionCard";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="row my-4">
        <FinanceStatus />
      </div>
      <div className="row my-4">
        <h4 className="text-secondary fw-bolder my-3 text-center text-decoration-underline">Recent transaction</h4>
        <TransactionCard  transactionLimit = {9}/>
      </div>
    </ProtectedRoute>
  );
}
