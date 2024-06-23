"use client"
import { useState } from "react";
import { useSelector } from "react-redux";

import Alert from "./alert";
import TransactionMakingForm from "./transactionMaking.form";
import TransactionEditForm from "./transactionEdit.form";

export default function TransactionModal({transactionAction, transactionId}) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const { alertMessage, alertStatus } = useSelector((state) => state.transaction);

  const modalButtonClickHandler = () => {
    setModalVisibility(!modalVisibility);
  }

  return (
    <>
      {
        transactionAction === "create" ? 
        <button
          className="btn btn-secondary me-md-2 px-4"
          type="button"
          data-bs-toggle={modalVisibility}
          data-bs-target="#exampleModal"
          onClick={modalButtonClickHandler}
        >Create new transaction</button> :
        <button
          className="btn btn-warning px-4"
          type="button"
          data-bs-toggle={modalVisibility}
          data-bs-target="#exampleModal"
          onClick={modalButtonClickHandler}
        >Edit</button>
      }

      <div className={`modal fade ${modalVisibility ? 'show d-block' : ''}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!modalVisibility}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              {
                transactionAction === "create" ? 
                <h1 className="modal-title fs-5" id="exampleModalLabel">Create a transaction</h1> : 
                <h1 className="modal-title fs-5" id="exampleModalLabel">Edit your transaction</h1>
              }
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={modalButtonClickHandler}
              ></button>
            </div>
            {alertMessage ? <Alert status={alertStatus} message={alertMessage} /> : null}
            {
              transactionAction === "create" ? 
              <TransactionMakingForm modalButtonHandler={modalButtonClickHandler} /> : 
              <TransactionEditForm modalButtonHandler={modalButtonClickHandler} transactionId={transactionId}/>
            }
          </div>
        </div>
      </div>
    </>
  )
}