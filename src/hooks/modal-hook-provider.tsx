import { AxiosCustomError } from "@/model/axios-error";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

type ShowModalParam = {
  type: 'success' | 'error' | 'info',
  title: string,
  message?: string,
  okAction?: {
    onClick?: () => void,
    label: string
  },
  backAction?: {
    label: string,
    onClick?: () => void,
  }
}

type ContextProvider = {
  show: (data: ShowModalParam) => void
}

const ModalContext = createContext<ContextProvider>({} as ContextProvider);

export function ModalHookProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ShowModalParam | null>(null);
  const handleOnShow = (data: ShowModalParam) => setState(data);

  const onClickOk = () => {
    state?.okAction?.onClick?.();
    setState(null);
  }
  const onClickBack = () => {
    state?.backAction?.onClick?.();
    setState(null);
  }

  return (
    <ModalContext.Provider value={{ show: handleOnShow }}>
      {children}
      {
        state !== null &&
        <Dialog
          open={state !== null}
          onClose={() => setState(null)}
        >
          <DialogTitle>{ state.title }</DialogTitle>
          <Divider/>
          <DialogContent>
            <DialogContentText>
              { state.message ?? "Oopsie" }
            </DialogContentText>
          </DialogContent>
          <Divider/>
          <DialogActions>
            {
              state.backAction &&
              <Button variant="contained" color="secondary" onClick={onClickBack}>{state.backAction.label ?? "Take me back"}</Button>
            }
            <Button variant="contained" color="success" onClick={onClickOk}>{state.okAction?.label ?? "Ok"}</Button>
          </DialogActions>
        </Dialog>
      }
    </ModalContext.Provider>
  )
}

const useModal = () => useContext(ModalContext);

export const usualErrorHandler = (show: (data: ShowModalParam) => void, e: AxiosCustomError) => {
  show({
    type: 'error',
    title: 'Oops... something is wrong 😭',
    message: e.code === 400 ? e.data[Object.keys(e.data)[0]][0] : e.data,
    okAction: {
      label: 'Ouch...'
    }
  })
}

export default useModal;