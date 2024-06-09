import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { allTransactionsFetchAction } from "@/lib/action/transaction.action";

export default function TransactionCard() {
  const { allTransaction } = useSelector((state) => state.transaction);
  const dispatch = useDispatch();

  useEffect(() => {
    const result = dispatch(allTransactionsFetchAction());
    console.log(result);
  }, []);
  return (
    <>
      <div className="col-12 col-lg-6 col-md-6">
        <h4>Recent transaction</h4>
        {allTransaction.length}
      </div>
    </>
  )
}