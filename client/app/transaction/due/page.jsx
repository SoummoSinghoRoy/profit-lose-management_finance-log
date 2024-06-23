"use client"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DueUpdateModal from "@/app/components/dueUpdate.modal";
import Alert from "@/app/components/alert";
import { allTransactionsFetchAction } from "@/lib/action/transaction.action";
import SearchBar from "@/app/components/searchbar";

export default function AllDue() {
  const dispatch = useDispatch();
  const { allTransaction, alertMessage, alertStatus, isSearching } = useSelector((state) => state.transaction);

  useEffect(() => {
    if(!isSearching) {
      dispatch(allTransactionsFetchAction())
    } else {
      dispatch(allTransactionsFetchAction())
    }
  }, [isSearching, dispatch])

  return (
    <>
      {
        alertMessage && alertStatus === 200 && 
        <div className="row my-3">
          <div className="col-3"></div>
          <div className="col-6">
            <Alert status={alertStatus} message={alertMessage} />
          </div>
        </div>
      }
      <div className="row my-4">
        <div className="col-4">
          <h4 className="text-secondary fw-bolder text-decoration-underline">All Due list</h4>
        </div>
        <div className="col-2"></div>
        <div className="col-6">
          <SearchBar />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-bordered mt-3">
              <thead>
                <tr className="text-center">
                  <th>To/From</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Last update date</th>
                  <th>Due</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  allTransaction.length !== 0 ?
                    allTransaction.map((transaction, index) => {
                      if (transaction.amount.due !== 0) {
                        return (
                          <tr key={index}>
                            <td className="text-center">{transaction.to_from}</td>
                            <td className="text-center">{transaction.date}</td>
                            <td className="text-center">{transaction.amount.total}</td>
                            <td className="text-center">{transaction.last_update_date}</td>
                            <td className="text-center">{transaction.amount.due}</td>
                            <td> <DueUpdateModal transactionId={transaction._id} /> </td>
                          </tr>
                        )
                      }
                    }) :
                    <tr>
                      <td colSpan={7}>
                        <h5 className="text-secondary text-center py-3">Data not found.....</h5>
                      </td>
                    </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}