"use client"
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Alert from "./alert";
import DueUpdateForm from "./dueUpdate.form";

export default function DueUpdateModal({transactionId}) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const { alertMessage, alertStatus } = useSelector((state) => state.transaction);

  const modalButtonClickHandler = () => {
    setModalVisibility(!modalVisibility);
  }

  return (
    <>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-warning px-4"
          type="button"
          data-bs-toggle={modalVisibility}
          data-bs-target="#exampleDueModal"
          onClick={modalButtonClickHandler}
        >update</button>
      </div>

      <div className={`modal fade ${modalVisibility ? 'show d-block' : ''}`} id="exampleDueModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!modalVisibility}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Update your transaction</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={modalButtonClickHandler}
              ></button>
            </div>
            {alertMessage && alertStatus !== 200 ? <Alert status={alertStatus} message={alertMessage} /> : null}
            <DueUpdateForm modalButtonHandler={modalButtonClickHandler} transactionId={transactionId} />
          </div>
        </div>
      </div>
    </>
  )
}