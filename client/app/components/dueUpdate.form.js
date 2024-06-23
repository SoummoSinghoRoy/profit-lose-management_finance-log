"use client"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { dueUpdateAction } from "@/lib/action/transaction.action";

const initialState = {
  transactionid: '',
  transactionType: '',
  received: '',
  paid: '',
  date: '',
  previousDue: 0
}

export default function DueUpdateForm ({modalButtonHandler, transactionId}) {
  const [currentDueState, setCurrentDueState] = useState(initialState);
  const [currentDue, setCurrentDue] = useState('');
  const { error, allTransaction} = useSelector((state) => state.transaction);
  const dispatch = useDispatch();

  useEffect(() => {
    if(transactionId) {
      const filteredTransaction = allTransaction.find((transaction) => transaction._id === transactionId);
      setCurrentDueState({
        ...currentDueState,
        transactionid: filteredTransaction._id,
        transactionType: filteredTransaction.transactionType,
        previousDue: filteredTransaction.amount.due
      })
    }
  }, [transactionId])

  const calculateDue = (updatedState) => {
    if (currentDueState.transactionType === "income" && (currentDueState.previousDue && updatedState.received)) {
      setCurrentDue(currentDueState.previousDue - updatedState.received);
    } else if (currentDueState.transactionType === "expense" && (currentDueState.previousDue && updatedState.paid)) {
      setCurrentDue(currentDueState.previousDue - updatedState.paid);
    } else {
      setCurrentDue('');
    }
  }

  const inputChangeHandler = (event) => {
    const {name, value, type} = event.target;
    let modifiedValue;
    if (type === 'number') {
      modifiedValue = parseInt(value) || '';
    } else {
      modifiedValue = value
    }
    const updatedState = { ...currentDueState, [name]: modifiedValue };
    setCurrentDueState(updatedState);
    calculateDue(updatedState);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    if(transactionId) {
      const {received, paid, date} = currentDueState;
      const dueUpdateState = {received, paid, date, currentDue: currentDue};
      const transactionid = currentDueState.transactionid;
      dispatch(dueUpdateAction({transactionid, dueUpdateState}));
    } else {
      console.log("id not found");
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <div className="modal-body">
        <div className="row mb-3 g-3">
          <div className="col-12 col-md-6 col-lg-6">
            <label htmlFor="previousDue">Previous due</label>
            <input
              type="number"
              className="form-control"
              id="previousDue"
              name="previousDue"
              value={currentDueState.previousDue}
              disabled
            />
          </div>
          <div className={`col-12 col-md-6 col-lg-6 ${currentDueState.transactionType === "income"
            ? "d-block" : "d-none"
          }`}>
            <label htmlFor="received">Received amount</label>
            <input
              type="number"
              className="form-control"
              id="received"
              name="received"
              value={currentDueState.received}
              onChange={inputChangeHandler}
            />
            <div className="invalid-feedback d-block">
              {error.message?.received && error.message.received}
            </div>
          </div>
          <div className={`col-12 col-md-6 col-lg-6 ${currentDueState.transactionType === "expense" ? "d-block" : "d-none"
          }`}>
            <label htmlFor="paid">Paid amount</label>
            <input
              type="number"
              className="form-control"
              id="paid"
              name="paid"
              value={currentDueState.paid}
              onChange={inputChangeHandler}
            />
            <div className="invalid-feedback d-block">
              {error.message?.paid && error.message.paid}
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6 col-lg-6">
            <label htmlFor="currentDue">Due amount</label>
            <input
              type="number"
              className="form-control"
              id="currentDue"
              name="currentDue"
              value={currentDue}
              disabled
            />
            <div className="invalid-feedback d-block">
              {error.message?.currentDue && error.message.currentDue}
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={currentDueState.date}
              onChange={inputChangeHandler}
            />
            <div className="invalid-feedback d-block">
              {error.message?.date && error.message.date}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
          onClick={modalButtonHandler}
        >Close</button>
        <button type="submit" className="btn btn-warning">
          Update
        </button>
      </div>
    </form>
  )
}