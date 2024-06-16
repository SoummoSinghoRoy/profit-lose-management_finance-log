import { useSelector } from "react-redux";

function FinanceState() {
  const {financialState} = useSelector(state => state.transaction);
  return (
    <>
      <div className="col-12 col-lg-3 col-md-3">
        <div className="card text-center text-success-emphasis bg-success-subtle shadow">
          <div className="card-body">
            <h5>{financialState.netProfit ? financialState.netProfit : 0}</h5>
            <p className="fs-6 fw-semibold">Net Profit</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-3 mt-2">
        <div className="card text-center text-danger-emphasis bg-danger-subtle shadow">
          <div className="card-body">
            <h5>{financialState.netLose ? financialState.netLose : 0}</h5>
            <p className="fs-6 fw-semibold">Net Lose</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-3 mt-2">
        <div className="card text-center text-warning-emphasis bg-warning-subtle shadow">
          <div className="card-body">
            <h5>{financialState.netPayableDue ? financialState.netPayableDue : 0}</h5>
            <p className="fs-6 fw-semibold">Net Payable Due</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-3 mt-2">
        <div className="card text-center text-primary-emphasis bg-primary-subtle shadow">
          <div className="card-body">
            <h5>{financialState.netReceivableDue ? financialState.netReceivableDue : 0}</h5>
            <p className="fs-6 fw-semibold">Net Receivable Due</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-3 mt-2">
        <div className="card text-center text-info-emphasis bg-info-subtle shadow">
          <div className="card-body">
            <h5>{financialState.totalTransaction ? financialState.totalTransaction : 0}</h5>
            <p className="fs-6 fw-semibold">Total Transaction</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default FinanceState;