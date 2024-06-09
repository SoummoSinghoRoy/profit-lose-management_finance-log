"use client"
import ProtectedRoute from "./components/route-protection/ProtectedRoute";
import FinanceStatus from "./components/financeStatus.card";
import TransactionCard from "./components/transactionCard";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="row my-3">
        <FinanceStatus />
      </div>
      <div className="row">
        <TransactionCard />
      </div>
    </ProtectedRoute>
  );
}
