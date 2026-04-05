import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AxiosCustomError } from "@/model/axios-error";
import { m } from "@paraglide/messages";
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
        <Dialog open={state !== null} onOpenChange={() => setState(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-lg font-bold'>{state.title}</DialogTitle>
              <Separator/>
              <DialogDescription>{state.message ?? m.error()}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              {
                state.backAction &&
                <Button variant="outline" onClick={onClickBack}>{state.backAction.label ?? m.back()}</Button>
              }
              <Button onClick={onClickOk}>{state.okAction?.label ?? m.ok()}</Button>

            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    </ModalContext.Provider >
  )
}

const useModal = () => useContext(ModalContext);

export const usualErrorHandler = (show: (data: ShowModalParam) => void, e: AxiosCustomError) => {
  show({
    type: 'error',
    title: m.something_error(),
    message: e.code === 400 ? e.data[Object.keys(e.data)[0]][0] : e.data,
    okAction: {
      label: m.error()
    }
  })
}

export default useModal;