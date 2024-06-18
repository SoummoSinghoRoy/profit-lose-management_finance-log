"use client"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createTransactionAction } from "@/lib/action/transaction.action";

const initialState = {
  transactionType: '',
  to_from: '',
  total: '',
  received: '',
  paid: '',
  date: '',
  description: ''
}

export default function TransactionMakingForm({ modalButtonHandler}) {
  const [transactionMakingState, setTransactionMakingState] = useState(initialState);
  const [due, setDue] = useState('');
  const { error} = useSelector((state) => state.transaction);
  const dispatch = useDispatch();

  const inputChangeHandler = (event) => {
    const {name, value, type} = event.target;
    let modifiedValue;
    if (type === 'number') {
      modifiedValue = parseInt(value);
    } else {
      modifiedValue = value
    }
    const updatedState = { ...transactionMakingState, [name]: modifiedValue }
    setTransactionMakingState(updatedState);
    calculateDue(updatedState);
  }

  const calculateDue = (updatedState) => {
    if(updatedState.transactionType === "income" && (updatedState.total && updatedState.received)) {
      setDue(updatedState.total - updatedState.received)
    }else if(updatedState.transactionType === "expense" && (updatedState.total && updatedState.paid)) {
      setDue(updatedState.total - updatedState.paid)
    } else {
      setDue('')
    }
  }

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(createTransactionAction({...transactionMakingState, due}));
    setTransactionMakingState(initialState);
    setDue('')
  }

  return (
    <form onSubmit={submitHandler}>
      <div className="modal-body">
        <div className="row mb-3 g-3">
          <div className="col-12 col-md-6 col-lg-6">
            <label htmlFor="transactionType">Transaction type</label>
            <select
              className="form-select"
              id="transactionType"
              name="transactionType"
              onChange={inputChangeHandler}
              value={transactionMakingState.transactionType}
            >
              <option value="">Select one type.....</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <div className="invalid-feedback d-block">
              {error.message?.transactionType && error.message.transactionType}
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6">
            <label htmlFor="to_from">To/From</label>
            <input
              type="text"
              className="form-control"
              id="to_from"
              name="to_from"
              value={transactionMakingState.to_from}
              onChange={inputChangeHandler}
            />
            <div className="invalid-feedback d-block">
              {error.message?.to_from && error.message.to_from}
            </div>
          </div>
        </div>
        <div className="row mb-3 g-3">
          <div className="col-12 col-md-6 col-lg-6">
            <label htmlFor="total">Total amount</label>
            <input
              type="number"
              className="form-control"
              id="total"
              name="total"
              value={transactionMakingState.total}
              onChange={inputChangeHandler}
            />
            <div className="invalid-feedback d-block">
              {error.message?.total && error.message.total}
            </div>
          </div>
          <div className={`col-12 col-md-6 col-lg-6 ${transactionMakingState.transactionType === "income" ? "d-block" : "d-none"}`}>
            <label htmlFor="received">Received amount</label>
            <input
              type="number"
              className="form-control"
              id="received"
              name="received"
              value={transactionMakingState.received}
              onChange={inputChangeHandler}
            />
            <div className="invalid-feedback d-block">
              {error.message?.received && error.message.received}
            </div>
          </div>
          <div className={`col-12 col-md-6 col-lg-6 ${transactionMakingState.transactionType === "expense" ? "d-block" : "d-none"}`}>
            <label htmlFor="paid">Paid amount</label>
            <input
              type="number"
              className="form-control"
              id="paid"
              name="paid"
              value={transactionMakingState.paid}
              onChange={inputChangeHandler}
            />
            <div className="invalid-feedback d-block">
              {error.message?.paid && error.message.paid}
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6 col-lg-6">
            <label htmlFor="due">Due amount</label>
            <input
              type="number"
              className="form-control"
              id="due"
              name="due"
              value={due}
              disabled
            />
            <div className="invalid-feedback d-block">
              {error.message?.due && error.message.due}
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6">
            <label htmlFor="total">Transaction date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={transactionMakingState.date}
              onChange={inputChangeHandler}
            />
            <div className="invalid-feedback d-block">
              {error.message?.date && error.message.date}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="form-floating">
              <textarea
                className="form-control"
                placeholder="Leave a short description here"
                id="description"
                value={transactionMakingState.description}
                name="description"
                onChange={inputChangeHandler}
              ></textarea>
              <label htmlFor="description">Short description</label>
            </div>
            <div className="invalid-feedback d-block">
              {error.message?.description && error.message.description}
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
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  )
}