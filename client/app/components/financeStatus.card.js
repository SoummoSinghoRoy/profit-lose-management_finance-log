import { useSelector } from "react-redux";

function FinanceStatus() {
  const {user} = useSelector(state => state.auth);
  return (
    <>
      <div className="col-12 col-lg-3 col-md-3">
        <div className="card text-center text-success-emphasis bg-success-subtle shadow">
          <div className="card-body">
            <h5>{user.financialState.netProfit}</h5>
            <p className="fs-6 fw-semibold">Net Profit</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-3 mt-2">
        <div className="card text-center text-danger-emphasis bg-danger-subtle shadow">
          <div className="card-body">
            <h5>{user.financialState.netLose}</h5>
            <p className="fs-6 fw-semibold">Net Lose</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-3 mt-2">
        <div className="card text-center text-warning-emphasis bg-warning-subtle shadow">
          <div className="card-body">
            <h5>{user.financialState.netPayableDue}</h5>
            <p className="fs-6 fw-semibold">Net Payable Due</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-3 mt-2">
        <div className="card text-center text-primary-emphasis bg-primary-subtle shadow">
          <div className="card-body">
            <h5>{user.financialState.netReceivableDue}</h5>
            <p className="fs-6 fw-semibold">Net Receivable Due</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-3 mt-2">
        <div className="card text-center text-info-emphasis bg-info-subtle shadow">
          <div className="card-body">
            <h5>{user.financialState.totalTransaction}</h5>
            <p className="fs-6 fw-semibold">Total Transaction</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default FinanceStatus;