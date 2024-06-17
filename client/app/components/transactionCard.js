import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { allTransactionsFetchAction } from "@/lib/action/transaction.action";
import TransactionModal from "./transactionModal";

export default function TransactionCard({ transactionLimit }) {
  const dispatch = useDispatch();
  const { allTransaction } = useSelector((state) => state.transaction);
  const transactionsToDisplay = transactionLimit ? allTransaction.slice(0, transactionLimit) : allTransaction;

  useEffect(() => {
    dispatch(allTransactionsFetchAction());
  }, [dispatch]);
  return (
    <>
      {
        transactionsToDisplay.length !== 0 ?
        transactionsToDisplay.map((transaction, index) => {
          return (
            <div className="col-12 col-lg-6 col-md-6 mb-3 mb-lg-0 mb-md-0" key={index}>
              <div className="card shadow-sm bg-light mt-3">
                <div className="card-header d-flex flex-row">
                  <p className="mb-0"><strong>Date:&nbsp;</strong>{transaction.date}</p>
                  <p className="ms-auto mb-0"><strong>Type:&nbsp;</strong><span className={transaction.transactionType === "income" ? "text-success" : "text-danger"}>{transaction.transactionType}</span></p>
                </div>
                <div className="card-body">
                  <p className="mb-2"><strong>From:&nbsp;</strong>{transaction.to_from}</p>
                  <p className="mb-2"><strong>Description:&nbsp;</strong>{transaction.description}</p>
                  <div className="d-flex flex-row">
                    <p className="mb-0"><strong>Total:&nbsp;</strong>{transaction.amount?.total}&#2547;</p>
                    {
                      transaction.transactionType === "income" ?
                        <p className="ms-2 mb-0"><strong>Received:&nbsp;</strong>{transaction.amount?.received}&#2547;</p> :
                        <p className="ms-2 mb-0"><strong>Paid:&nbsp;</strong>{transaction.amount?.paid}&#2547;</p>
                    }
                    <p className="ms-2 mb-0"><strong>Due:&nbsp;</strong>{transaction.amount?.due}&#2547;</p>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="d-grid gap-2 d-flex justify-content-end">
                    <TransactionModal transactionId={transaction._id} />
                    <button className="btn btn-danger" type="button">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )
        }) : 
        <div className="col-12">
          <h4 className="text-secondar text-center fw-semibold">
            Data not found.......
          </h4>
        </div>
      }
    </>
  )
}